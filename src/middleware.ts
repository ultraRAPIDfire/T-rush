import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    
    // Initialize the matching SSR client to write cookies identically to the middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    // This method automatically writes the official, matching cookies to the browser
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Login successful! Send them to the main page dashboard
      return NextResponse.redirect(requestUrl.origin);
    }
  }

  // Fallback to login page if something went wrong during the handshake
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}