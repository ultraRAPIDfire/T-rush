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

      {/* Main Core Viewport Node */}
      <main className="w-full min-h-screen">
        <Feed />
      </main>

    </div>
  );
}