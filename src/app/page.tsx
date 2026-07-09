'use client';
import { supabase } from '../utils/supabaseClient';

export default function DashboardPage() {

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Wipe client window memory and force middleware re-evaluation
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white p-6">
      {/* Your main app / music deck layout goes here */}
      <div className="flex justify-between items-center border-b border-zinc-850 pb-4">
        <h1 className="text-xl font-black tracking-widest uppercase text-emerald-400">T-RUSH DECK</h1>
        
        {/* Sign Out Button Chassis */}
        <button
          onClick={handleSignOut}
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white transition-all active:scale-95"
        >
          Sign Out Node
        </button>
      </div>

      <main className="mt-8">
        <p className="text-zinc-400 text-sm">Welcome back to your audio radar stream nodes.</p>
        {/* <Feed /> component or player mechanics */}
      </main>
    </div>
  );
}