'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error'; text: string } | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = '/';
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleGitHubLogin = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
      const baseOrigin = isProduction ? 'https://t-rush-zeta.vercel.app' : 'http://localhost:3000';
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${baseOrigin}/api/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'GitHub Authentication failed';
      setMessage({ type: 'error', text: errorMessage });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-[#050507] font-sans antialiased text-neutral-200 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-5xl bg-zinc-950/45 border border-zinc-900/80 backdrop-blur-3xl rounded-[32px] shadow-2xl relative z-10 flex flex-col md:flex-row min-h-[560px]">
        
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b border-zinc-900/60 md:border-b-0 md:border-r border-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500 text-black font-black flex items-center justify-center rounded-xl text-lg">T</div>
            <span className="font-black text-xl tracking-[0.25em] text-white uppercase">T-Rush</span>
          </div>
          <div className="my-12 md:my-0 space-y-6">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Explore Soundwaves.<br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Build Collections.</span>
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-md bg-zinc-900/30 border border-zinc-900/40 p-5 rounded-2xl">
              This platform serves as a high-speed audio radar. We don&apos;t stream full length discographies; instead, we provide <span className="text-white font-bold">fast snippet streams</span> to let you discover new rhythms instantly.
            </p>
          </div>
          <div>
            <a href="https://github.com/ultraRAPIDfire/T-rush" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-zinc-900/50 border border-zinc-800/60 px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-400 hover:text-white">
              <span>Source: <span className="text-emerald-400 font-mono underline ml-1">ultraRAPIDfire/T-rush</span></span>
            </a>
          </div>
        </div>

        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-black/20">
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Gate Access</h2>
              <p className="text-xs text-neutral-500 mt-1">Verify your profile node to initialize your stream catalogs.</p>
            </div>
            {message && <div className="p-4 rounded-xl text-xs font-bold border bg-rose-500/10 border-rose-500/20 text-rose-400">{message.text}</div>}
            <button
              onClick={handleGitHubLogin}
              className="w-full bg-white hover:bg-neutral-100 text-black font-black py-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl transition-all"
            >
              <span>{loading ? 'HANDSHAKING...' : 'Continue with GitHub'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}