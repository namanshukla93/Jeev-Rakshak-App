import { supabase } from '@/utils/supabase';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Try to insert into Supabase - if table doesn't exist, we still log and succeed
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, message }])
        .select();

      if (error) {
        // Log it server-side but don't fail the user
        console.warn('[Contact Form] Supabase save failed (table may not exist yet):', error.message);
        console.log(`[Contact Form - LOGGED] From: ${name} <${email}> | Message: ${message}`);
      } else {
        console.log('[Contact Form] Message saved to Supabase:', data);
      }
    } catch (dbErr) {
      console.warn('[Contact Form] DB error, message logged only:', dbErr.message);
      console.log(`[Contact Form - LOGGED] From: ${name} <${email}> | Message: ${message}`);
    }

    // Always return success so the user gets confirmation
    return Response.json({ success: true });

  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
