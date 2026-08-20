import { supabase } from '@/utils/supabase';
import { sendSMS } from '@/utils/sms';

export async function GET() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    return Response.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
  return Response.json(data);
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    // 1. Upload image to Supabase Storage if it's a base64 string
    let finalImageUrl = data.imageUrl;
    
    if (data.imageUrl && data.imageUrl.startsWith('data:image')) {
      const base64Data = data.imageUrl.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `report_${Date.now()}.png`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reports')
        .upload(filename, buffer, {
          contentType: 'image/png',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('reports')
        .getPublicUrl(filename);
        
      finalImageUrl = publicUrlData.publicUrl;
    }
    
    // 2. Insert into Supabase DB
    const { data: reportData, error: insertError } = await supabase
      .from('reports')
      .insert([{
        location: data.location,
        analysis: data.analysis,
        image_url: finalImageUrl,
        assigned_ngo: 'BROADCASTED',
        status: 'PENDING'
      }])
      .select();

    if (insertError) {
      console.error('DB Insert Error:', insertError);
      throw new Error(`Failed to save report to database: ${insertError.message}`);
    }

    const report = reportData[0];

    // 3. Build structured SMS alert text (Compact GSM-7 for instant delivery)
    let species = 'Animal';
    let urgency = 'MEDIUM';
    let condition = '';

    try {
      const parsed = typeof data.analysis === 'string' ? JSON.parse(data.analysis) : data.analysis;
      if (parsed && typeof parsed === 'object') {
        species = parsed.species || species;
        urgency = parsed.urgencyLevel || urgency;
        condition = (parsed.condition || '').replace(/[#*{}":\n]/g, ' ').trim().substring(0, 60);
      } else if (typeof data.analysis === 'string') {
        condition = data.analysis.replace(/[#*{}":\n]/g, ' ').trim().substring(0, 60);
      }
    } catch (e) {
      condition = '';
    }

    const shortLoc = (data.location || '').split(',').slice(0, 2).join(',').trim();
    const buildAlertMsg = (recipientName) => {
      const target = recipientName && recipientName !== 'BROADCAST (All NGOs)' ? `For: ${recipientName.substring(0, 20)}\n` : '';
      const condLine = condition ? `Cond: ${condition}\n` : '';
      return `[EMERGENCY] Jeev Rakshak Alert
Animal: ${species.substring(0, 25)}
Urgency: ${urgency}
${condLine}Loc: ${shortLoc.substring(0, 40)}
${target}Accept at: jeev-rakshak.vercel.app/ngo/login`;
    };

    const messageText = buildAlertMsg('BROADCAST (All NGOs)');
    
    // Send to admin number
    const adminResult1 = await sendSMS('+919369617224', messageText);
    const adminResult2 = { success: true, skipped: true }; // second slot reserved

    // Send to all selected NGOs/Clinics directly
    const ngoSmsResults = [];
    if (data.assignedNgos && Array.isArray(data.assignedNgos)) {
      for (const ngo of data.assignedNgos) {
        const targetPhone = ngo.phone || '+919369617224';
        const customMsg = buildAlertMsg(ngo.name);
        const res = await sendSMS(targetPhone, customMsg);
        ngoSmsResults.push({
          name: ngo.name,
          phone: targetPhone,
          success: res.success,
          sid: res.sid,
          error: res.error
        });
      }
    }

    return Response.json({ 
      success: true, 
      report, 
      smsSummary: {
        adminAlerts: [adminResult1, adminResult2],
        ngoAlerts: ngoSmsResults
      } 
    });
  } catch (error) {
    console.error('Failed to create report:', error);
    return Response.json({ error: error.message || 'Failed to create report' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const { id, action, ngoName, ngoPhone, conditionReport, treatmentImageUrl } = data;
    
    if (action === 'ACCEPT') {
      const formattedNgo = ngoPhone ? `${ngoName} (Phone: ${ngoPhone})` : ngoName;
      const { data: updateData, error } = await supabase
        .from('reports')
        .update({ 
          status: 'ACCEPTED', 
          assigned_ngo: formattedNgo,
          accepted_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
        
      if (error) throw error;

      // Send SMS alert on ACCEPT (Compact GSM-7 format)
      const acceptMsg =
`[ACCEPTED] Jeev Rakshak Case #${id.slice(0, 8)}
Accepted by: ${ngoName.substring(0, 30)}
Contact: ${ngoPhone || 'N/A'}
Please proceed to location immediately.
Dashboard: jeev-rakshak.vercel.app/ngo/login`;

      await sendSMS('+919369617224', acceptMsg);

      if (ngoPhone) {
        const ngoConfirmMsg =
`[CONFIRMED] Jeev Rakshak Case #${id.slice(0, 8)}
You accepted this rescue dispatch.
Please head to the reported incident location.
Dashboard: jeev-rakshak.vercel.app/ngo/login`;
        await sendSMS(ngoPhone, ngoConfirmMsg);
      }

      return Response.json({ success: true, report: updateData[0] });
    }
    
    if (action === 'UPDATE_CONDITION') {
      let finalTreatmentImageUrl = null;
      
      if (treatmentImageUrl && treatmentImageUrl.startsWith('data:image')) {
        const base64Data = treatmentImageUrl.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `treatment_${id}_${Date.now()}.png`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('reports')
          .upload(filename, buffer, {
            contentType: 'image/png',
            upsert: false
          });
          
        if (uploadError) {
          console.error('Storage upload error for treatment:', uploadError);
          throw new Error('Failed to upload post-treatment image');
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('reports')
          .getPublicUrl(filename);
          
        finalTreatmentImageUrl = publicUrlData.publicUrl;
      }

      const { data: updateData, error } = await supabase
        .from('reports')
        .update({ 
          post_treatment_report: conditionReport,
          post_treatment_image_url: finalTreatmentImageUrl,
          status: 'RESOLVED'
        })
        .eq('id', id)
        .select();
        
      if (error) throw error;

      // Send SMS alert on Treatment Update / Resolve
      const cleanNotes = (conditionReport || 'Animal has received care.').replace(/[#*{}":\n]/g, ' ').trim().substring(0, 60);
      const resolveMsg =
`[RESOLVED] Jeev Rakshak Case #${id.slice(0, 8)}
Case marked RESOLVED.
Update: ${cleanNotes}
Details: jeev-rakshak.vercel.app/ngo/login`;
      await sendSMS('+919369617224', resolveMsg);

      return Response.json({ success: true, report: updateData[0] });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update report:', error);
    return Response.json({ error: 'Failed to update report' }, { status: 500 });
  }
}

