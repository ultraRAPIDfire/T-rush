'use client';
import { supabase } from '../../utils/supabaseClient';
import { useState } from 'react';

export default function SeedPage() {
  const [status, setStatus] = useState('');

  const seedInfiniteCatalog = async () => {
    setStatus('Clearing fallback states and deploying a limitless music matrix...');
    
    const megaCatalog = [
      // POP / GLOBAL / TRENDING
      { title: 'Pasilyo', artist: 'SunKissed Lola', genre: 'pop', youtube_id: 'Vn1eW9grhLc' },
      { title: 'Tadhana', artist: 'Up Dharma Down', genre: 'pop', youtube_id: 'gX_G6pXvF3U' },
      { title: 'ERE', artist: 'juan karlos', genre: 'pop', youtube_id: '6zE_j_C8A18' },
      { title: 'Blinding Lights', artist: 'The Weeknd', genre: 'pop', youtube_id: 'fHI8X4OXluQ' },
      { title: 'Cruel Summer', artist: 'Taylor Swift', genre: 'pop', youtube_id: 'ic8j13UcyI8' },
      { title: 'As It Was', artist: 'Harry Styles', genre: 'pop', youtube_id: 'H5v3kku4y6Q' },
      { title: 'Die With A Smile', artist: 'Bruno Mars & Lady Gaga', genre: 'pop', youtube_id: '8re_Gf9zWb4' },
      { title: 'Birds of a Feather', artist: 'Billie Eilish', genre: 'pop', youtube_id: 'dYpS6Z_5fWk' },
      { title: 'Espresso', artist: 'Sabrina Carpenter', genre: 'pop', youtube_id: 'cZ6WpM51s-c' },
      { title: 'Pantropiko', artist: 'BINI', genre: 'pop', youtube_id: 'x8I9f8B7z6c' },
      { title: 'Salamin, Salamin', artist: 'BINI', genre: 'pop', youtube_id: 'p_K_bCgT96c' },
      { title: 'Leave The Door Open', artist: 'Silk Sonic', genre: 'pop', youtube_id: 'm8m-ZreXlM8' },

      // J-POP / CITY POP / ARCADE
      { title: 'Stay With Me', artist: 'Miki Matsubara', genre: 'jpop', youtube_id: 'HmeZ1S_7y6U' },
      { title: 'Plastic Love', artist: 'Mariya Takeuchi', genre: 'jpop', youtube_id: '9Gj47G2vA9M' },
      { title: 'Idol', artist: 'YOASOBI', genre: 'jpop', youtube_id: 'ZRtdQ81jCUs' },
      { title: 'Night Dancer', artist: 'imase', genre: 'jpop', youtube_id: 'v_B30Y8Gg8E' },
      { title: 'Racing Into The Night', artist: 'YOASOBI', genre: 'jpop', youtube_id: 'v_B_8zZ7Y6U' },
      { title: 'First Love', artist: 'Hikaru Utada', genre: 'jpop', youtube_id: 'k_b9c7Y6U88' },
      { title: 'Sparkle', artist: 'RADWIMPS', genre: 'jpop', youtube_id: 'a2g8Y7z6W_c' },

      // HIP HOP / URBAN LO-FI
      { title: 'Raining In Manila', artist: 'Lola Amour', genre: 'hiphop', youtube_id: 'iI6p_kH_V4s' },
      { title: 'SICKO MODE', artist: 'Travis Scott', genre: 'hiphop', youtube_id: 'd-JBBPb8Ylk' },
      { title: 'Not Like Us', artist: 'Kendrick Lamar', genre: 'hiphop', youtube_id: 'H58vB9XWLTE' },
      { title: 'Palayo', artist: 'Al James', genre: 'hiphop', youtube_id: 'c_K7bZ8Y6X0' },
      { title: 'Elevate', artist: 'Flow G', genre: 'hiphop', youtube_id: 'b_M8y6Z7X_w' },
      { title: 'Gods Plan', artist: 'Drake', genre: 'hiphop', youtube_id: 'xpV8y6Z7W9m' },

      // ROCK / ALTERNATIVE
      { title: 'Ang Huling El Bimbo', artist: 'Eraserheads', genre: 'rock', youtube_id: 'G_U7C5mF050' },
      { title: 'Numb', artist: 'Linkin Park', genre: 'rock', youtube_id: 'kXYiU_JCYtU' },
      { id: 'yt-r3', title: 'Bring Me To Life', artist: 'Evanescence', genre: 'rock', youtube_id: '3YxaaGgTQYM' },
      { title: 'In The End', artist: 'Linkin Park', genre: 'rock', youtube_id: 'v_B8y7Z6W_m' },
      { title: 'With A Smile', artist: 'Eraserheads', genre: 'rock', youtube_id: 'x7Y8z6W9m_c' },
      { title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'rock', youtube_id: 'b_M7y6W8Z9m' }
    ];

    // Clear old data safely
    await supabase.from('tracks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Inject the tracks into the database table
    const { error } = await supabase.from('tracks').insert(megaCatalog);

    if (error) {
      setStatus(`Seeding failed: ${error.message}`);
    } else {
      setStatus(`Successfully loaded ${megaCatalog.length} songs straight into your database schema!`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-6">
      <h1 className="text-2xl font-black mb-4">T-Rush Production Syncer</h1>
      <button 
        onClick={seedInfiniteCatalog} 
        className="bg-emerald-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all shadow-lg"
      >
        Sync Entire Music Catalog
      </button>
      {status && <p className="mt-4 text-emerald-400 bg-neutral-900 px-4 py-2 rounded-lg text-sm">{status}</p>}
    </div>
  );
}