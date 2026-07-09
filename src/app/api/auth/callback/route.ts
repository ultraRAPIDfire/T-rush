import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      const cookieStore = await cookies();
      
      // Set the exact cookie your middleware expects
      cookieStore.set('sb-access-token', data.session.access_token, {
        path: '/',
        secure: true,
        sameSite: 'lax',
        maxAge: data.session.expires_in,
      });
    }
  }
  
  // Return to the main page player
  return NextResponse.redirect(requestUrl.origin);
}