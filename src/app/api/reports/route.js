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

    // 3. Build structured SMS alert text
    let species = 'Unknown Animal';
    let condition = 'Condition not specified';
    let urgency = 'MEDIUM';
    let injuries = [];
    let immediateSteps = [];

    try {
      const parsed = typeof data.analysis === 'string' ? JSON.parse(data.analysis) : data.analysis;
      if (parsed && typeof parsed === 'object') {
        species = parsed.species || species;
        condition = parsed.condition || condition;
        urgency = parsed.urgencyLevel || urgency;
        injuries = Array.isArray(parsed.injuries) ? parsed.injuries.slice(0, 2) : [];
        immediateSteps = Array.isArray(parsed.immediateSteps) ? parsed.immediateSteps.slice(0, 2) : [];
      } else if (typeof data.analysis === 'string') {
        condition = data.analysis.replace(/[#*{}":\n]/g, ' ').trim().substring(0, 80);
      }
    } catch (e) {
      condition = typeof data.analysis === 'string'
        ? data.analysis.replace(/[#*{}":\n]/g, ' ').trim().substring(0, 80)
        : 'Check dashboard for details';
    }

    const urgencyEmoji = urgency === 'HIGH' ? '🔴' : urgency === 'LOW' ? '🟢' : '🟡';
    const injuriesLine = injuries.length > 0 ? `\nInjuries: ${injuries.join(', ')}` : '';
    const stepsLine = immediateSteps.length > 0 ? `\nImmediate: ${immediateSteps.join(' | ')}` : '';

    const buildAlertMsg = (recipientName) =>
`🚨 JEEV RAKSHAK - ANIMAL EMERGENCY 🚨

Animal: ${species}
Urgency: ${urgencyEmoji} ${urgency}${injuriesLine}
Condition: ${condition.substring(0, 80)}${stepsLine}

Location: ${data.location}
Assigned To: ${recipientName}

👉 Login to accept dispatch:
jeev-rakshak.vercel.app/ngo/login`;

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

      // Send SMS alert on ACCEPT
      const acceptMsg =
`✅ DISPATCH ACCEPTED - JEEV RAKSHAK

Rescue Case #${id.slice(0, 8)} has been accepted.

Accepted By: ${ngoName}
Contact: ${ngoPhone || 'N/A'}

Please proceed to the incident location and begin rescue operations immediately.

Track: jeev-rakshak.vercel.app/ngo/login`;

      await sendSMS('+919369617224', acceptMsg);

      if (ngoPhone) {
        const ngoConfirmMsg =
`✅ JEEV RAKSHAK - Dispatch Confirmed

You have accepted Rescue Case #${id.slice(0, 8)}.

Please respond immediately and head to the reported location. Update the case status after treatment via the dashboard.

Dashboard: jeev-rakshak.vercel.app/ngo/login

Thank you for your service! 🐾`;
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
      const resolveMsg =
`🩺 JEEV RAKSHAK - CASE RESOLVED

Rescue Case #${id.slice(0, 8)} has been marked RESOLVED.

Post-Treatment Update:
${(conditionReport || 'No notes provided.').substring(0, 120)}

Great work! The animal has received care. 🐾

View full report: jeev-rakshak.vercel.app/ngo/login`;
      await sendSMS('+919369617224', resolveMsg);

      return Response.json({ success: true, report: updateData[0] });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update report:', error);
    return Response.json({ error: 'Failed to update report' }, { status: 500 });
  }
}

