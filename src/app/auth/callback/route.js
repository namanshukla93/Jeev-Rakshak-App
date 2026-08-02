import { supabase } from '@/utils/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // Exchange the auth code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to NGO dashboard after successful login
  return NextResponse.redirect(new URL('/ngo/dashboard', requestUrl.origin));
}
