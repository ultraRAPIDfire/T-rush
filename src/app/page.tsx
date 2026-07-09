'use client';
import { supabase } from '../utils/supabaseClient';
// 1. Re-import your actual feed player components here
import Feed from '../components/Feed'; 

export default function DashboardPage() {

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white p-4 sm:p-6">
      
      {/* Top Navigation Control Strip */}
      <div className="flex justify-between items-center border-b border-zinc-900 pb-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 text-black font-black flex items-center justify-center rounded-lg text-sm shadow-lg shadow-emerald-500/10">
            T
          </div>
          <h1 className="text-base font-black tracking-[0.2em] uppercase text-white">T-RUSH DECK</h1>
        </div>
        
        <button
          onClick={handleSignOut}
          className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700 px-3.5 py-1.5 rounded-xl text-xs font-bold text-neutral-400 hover:text-white transition-all active:scale-95 shadow-md"
        >
          Sign Out Node
        </button>
      </div>

      {/* 2. Your actual core music discovery player engine goes back here */}
      <main className="max-w-7xl mx-auto mt-6 sm:mt-8">
        <Feed />
      </main>

    </div>
  );
}