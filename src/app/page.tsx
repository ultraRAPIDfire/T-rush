'use client';
import { supabase } from '../utils/supabaseClient';
import Feed from '../components/Feed'; 

export default function DashboardPage() {

  // Keeping your custom sign out handler wired to your original system layout
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white relative overflow-x-hidden">
      
      {/* Sneaking your synchronized Sign Out trigger right over the generic 'EXIT' button.
        We position it absolutely so it sits elegantly in the top right corner without 
        distorting the center vinyl layout engine.
      */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <button
          onClick={handleSignOut}
          className="bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/60 hover:border-zinc-700 px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase text-neutral-400 hover:text-white transition-all active:scale-95 shadow-md backdrop-blur-md"
        >
          Sign Out Node
        </button>
      </div>

      {/* Main Core Viewport Node */}
      <main className="w-full min-h-screen">
        <Feed />
      </main>

    </div>
  );
}