import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // Initialize a server-side Supabase instance using your existing env variables
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false, // Prevents server-side state bleeding
        },
      }
    );

    // Exchange the temporary code for a secure session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      const cookieStore = await cookies();
      
      // Set the access token cookie manually so your middleware can read it immediately
      cookieStore.set('sb-access-token', data.session.access_token, {
        path: '/',
        secure: true,
        sameSite: 'lax',
        maxAge: data.session.expires_in,
      });
      
      if (data.session.refresh_token) {
        cookieStore.set('sb-refresh-token', data.session.refresh_token, {
          path: '/',
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }
    }
  }

  // Redirect the authenticated user back to the main layout dashboard
  return NextResponse.redirect(requestUrl.origin);
}