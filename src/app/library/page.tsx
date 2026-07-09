'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Link from 'next/link';

interface SavedTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  audio_url: string;
  cover_url: string;
}

export default function LibraryPage() {
  const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch everything the user has favorited out of the cloud table matrix
        const { data, error } = await supabase
          .from('liked_tracks')
          .select('track_id, title, artist, genre, audio_url, cover_url')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          // Map database structure safely back into standard UI elements
          const mapped: SavedTrack[] = data.map((item) => ({
            id: item.track_id,
            title: item.title,
            artist: item.artist,
            genre: item.genre,
            audio_url: item.audio_url,
            cover_url: item.cover_url
          }));
          setSavedTracks(mapped);
        }
      } catch (err) {
        console.error("Could not fetch saved tracking entries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handlePlayTrack = (track: SavedTrack) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(track.audio_url);
    }

    if (currentPlayingId === track.id) {
      audioRef.current.pause();
      setCurrentPlayingId(null);
    } else {
      audioRef.current.pause();
      audioRef.current.src = track.audio_url;
      audioRef.current.play().catch(() => {});
      setCurrentPlayingId(track.id);
    }
  };

  const removeTrackFromLibrary = async (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering the row click play state
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('liked_tracks')
        .delete()
        .eq('user_id', user.id)
        .eq('track_id', trackId);

      if (error) throw error;
      
      // Update local state matrix instantly
      setSavedTracks(prev => prev.filter(t => t.id !== trackId));
      if (currentPlayingId === trackId && audioRef.current) {
        audioRef.current.pause();
        setCurrentPlayingId(null);
      }
    } catch (err) {
      console.error("Could not drop track entry:", err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050507] text-white">
        <p className="text-xs font-black tracking-[0.3em] text-neutral-500 uppercase animate-pulse">Opening Vault Collection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050507] text-neutral-200 px-6 py-12 select-none">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Action Header */}
        <div className="flex justify-between items-center mb-12 border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">🎵 Your Library</h1>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-bold">
              Archived Tracks: {savedTracks.length}
            </p>
          </div>
          <Link 
            href="/" 
            className="bg-emerald-500 text-black px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all hover:scale-103 shadow-lg shadow-emerald-500/10"
          >
            ← Back to Feed
          </Link>
        </div>

        {/* Empty Collection Placeholder state layout */}
        {savedTracks.length === 0 ? (
          <div className="bg-zinc-950/40 border border-zinc-900/60 backdrop-blur-xl p-12 rounded-[24px] text-center max-w-md mx-auto mt-12 shadow-2xl">
            <span className="text-4xl block mb-4">🖤</span>
            <h2 className="text-lg font-black text-white">Your Collection is Empty</h2>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Head back to the global music feed and tap the heart icon on any unblocked hit to save it here.
            </p>
          </div>
        ) : (
          /* Grid Matrix Content View List */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedTracks.map((track) => {
              const isCurrent = currentPlayingId === track.id;
              return (
                <div 
                  key={track.id}
                  onClick={() => handlePlayTrack(track)}
                  className={`bg-zinc-950/30 hover:bg-zinc-900/40 border p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all duration-200 group relative overflow-hidden ${
                    isCurrent ? 'border-emerald-500/40 shadow-xl shadow-emerald-500/5' : 'border-zinc-900/60'
                  }`}
                >
                  {/* Miniature album art wrapper */}
                  <div 
                    style={{ backgroundImage: `url(${track.cover_url})` }}
                    className="w-16 h-16 bg-zinc-800 bg-cover bg-center rounded-xl border border-zinc-800 flex items-center justify-center relative flex-shrink-0 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <span className="text-white text-sm">{isCurrent ? '⏸' : '▶'}</span>
                    </div>
                  </div>

                  {/* Metadata labels info blocks */}
                  <div className="min-w-0 flex-1">
                    <span className="px-2 py-0.5 text-[9px] bg-zinc-900 border border-zinc-800 rounded text-neutral-400 font-bold uppercase tracking-wider">
                      {track.genre}
                    </span>
                    <h3 className="text-sm font-black text-white mt-1.5 truncate pr-8">{track.title}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate font-medium">@{track.artist}</p>
                  </div>

                  {/* Explicit Discard Delete Option Node */}
                  <button
                    onClick={(e) => removeTrackFromLibrary(track.id, e)}
                    className="absolute right-4 p-2 text-neutral-600 hover:text-rose-400 transition-colors text-xs"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}