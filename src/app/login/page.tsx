'use client';
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Link from 'next/link';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error'; text: string } | null>(null);

  const handleGitHubLogin = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://t-rush-zeta.vercel.app';
      
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        // Crucial: Routes the handshake through the code exchange endpoint first
        redirectTo: `${currentOrigin}/auth/callback`,
        skipBrowserRedirect: false
      },
    });
      if (error) throw error;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'GitHub OAuth initialization failure';
      setMessage({ type: 'error', text: errorMessage });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-[#050507] font-sans antialiased text-neutral-200 select-none flex items-center justify-center p-3 sm:p-4 overflow-x-hidden">
      
      {/* Premium Cinematic Animated Background Canvas */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none transform scale-105">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] sm:blur-[140px] animate-[pulse_8s_infinite_ease-in-out]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-500/10 rounded-full blur-[130px] sm:blur-[160px] animate-[pulse_11s_infinite_ease-in-out_2s]" />
        <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px] sm:blur-[130px] animate-[pulse_9s_infinite_ease-in-out_1s]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main Responsive Layout Chassis Container */}
      <div className="w-full max-w-5xl bg-zinc-950/45 border border-zinc-900/80 backdrop-blur-3xl rounded-[24px] sm:rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden flex flex-col md:flex-row min-h-0 md:min-h-[560px] animate-in fade-in zoom-in-95 duration-500">
        
        {/* LEFT COLUMN: Mission Statement */}
        <div className="flex-1 p-6 sm:p-10 lg:p-16 flex flex-col justify-between border-b border-zinc-900/60 md:border-b-0 md:border-r bg-gradient-to-br from-zinc-950/20 to-transparent gap-8 md:gap-0">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500 text-black font-black flex items-center justify-center rounded-xl shadow-lg shadow-emerald-500/20 text-base sm:text-lg animate-pulse">
              T
            </div>
            <span className="font-black text-lg sm:text-xl tracking-[0.25em] text-white uppercase">T-Rush</span>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                <span>⚡ Sound Discovery Node</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-[1.15]">
              Explore Soundwaves.<br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
                Build Collections.
              </span>
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed max-w-md bg-zinc-900/30 border border-zinc-900/40 p-4 sm:p-5 rounded-2xl backdrop-blur-md shadow-inner">
              This platform serves as a high-speed audio radar. We don&apos;t stream full length discographies; instead, we provide 
              <span className="text-white font-bold"> fast snippet streams </span> 
              to let you discover new rhythms instantly and save them to personal vault logs for future reference.
            </p>
          </div>

          <div className="pt-2 md:pt-0">
            <a 
              href="https://github.com/ultraRAPIDfire/T-rush"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700 px-4 py-2.5 rounded-xl transition-all text-xs font-bold text-neutral-400 hover:text-white"
            >
              <svg className="w-4 h-4 fill-current transition-transform group-hover:rotate-12" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="truncate">Source: <span className="text-emerald-400 font-mono underline ml-1">ultraRAPIDfire/T-rush</span></span>
            </a>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Dedicated GitHub Auth Portal */}
        <div className="flex-1 p-6 sm:p-10 lg:p-16 flex flex-col justify-center bg-black/10 sm:bg-black/20">
          
          <div className="w-full max-w-sm mx-auto space-y-5 sm:space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">Gate Access</h2>
              <p className="text-xs text-neutral-500 mt-1 font-medium leading-relaxed">Verify your developer profile node to load your catalog layout stream channels.</p>
            </div>

            {message && (
              <div className="p-4 rounded-xl text-xs font-bold border bg-rose-500/10 border-rose-500/20 text-rose-400 animate-in fade-in slide-in-from-top-1">
                {message.text}
              </div>
            )}

            <div className="pt-1">
              <button
                disabled={loading}
                onClick={handleGitHubLogin}
                className="w-full bg-white hover:bg-neutral-100 disabled:bg-neutral-300 text-black font-black py-3.5 sm:py-4 px-4 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
              >
                <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span className="truncate">{loading ? 'Handshaking...' : 'Continue with GitHub'}</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <Link 
                href="/"
                className="text-[10px] uppercase font-black tracking-widest text-neutral-500 hover:text-emerald-400 transition-colors inline-block py-1"
              >
                ← Return to Preview Deck
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}