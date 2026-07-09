'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import Link from 'next/link';

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  audio_url: string;
  cover_url: string;
}

const AVAILABLE_GENRES = [
  { id: 'all', label: '🌍 All Hits' },
  { id: 'opm', label: '🇵🇭 OPM (Filipino)' },
  { id: 'pop', label: '🎵 Pop' },
  { id: 'rock', label: '🎸 Rock' },
  { id: 'hiphop', label: '🎤 Hip Hop' },
  { id: 'jpop', label: '🎌 J-Pop' },
  { id: 'kpop', label: '🫰 K-Pop' },
  { id: 'rnb', label: '🎹 R&B' },
  { id: 'country', label: '🤠 Country' },
  { id: 'jazz', label: '🎷 Jazz' },
  { id: 'electronic', label: '⚡ Electronic' },
  { id: 'classical', label: '🎻 Classical' }
];

export default function Feed() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [globalVolume, setGlobalVolume] = useState(0.8);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const loadAlgorithmicFeed = useCallback(async (genreToFetch = selectedGenre, isNewGenre = false) => {
    try {
      const response = await fetch(`/api/feed?genre=${genreToFetch}`);
      const data = await response.json();
      if (data.tracks) {
        setTracks((prev) => isNewGenre ? data.tracks : [...prev, ...data.tracks]);
      }
    } catch (error) {
      console.error("Failed to load your T-Rush stream:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedGenre]);

  const handleGenreChange = async (genreId: string) => {
    setLoading(true);
    setTracks([]);
    setActiveIndex(0);
    setSelectedGenre(genreId);
    setIsDropdownOpen(false);
    await loadAlgorithmicFeed(genreId, true);
  };

  useEffect(() => {
    let isMounted = true;
    const initFeed = async () => {
      if (isMounted) {
        await loadAlgorithmicFeed('all', true);
      }
    };
    initFeed();
    return () => { isMounted = false; };
  }, [loadAlgorithmicFeed]);

  const scrollToCardIndex = useCallback((index: number) => {
    if (!containerRef.current || index < 0 || index >= tracks.length) return;
    setActiveIndex(index);
    const targetCard = containerRef.current.children[index] as HTMLElement;
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (index === tracks.length - 2) {
      loadAlgorithmicFeed(selectedGenre, false);
    }
  }, [tracks.length, selectedGenre, loadAlgorithmicFeed]);

  // Global Keyboard Listening Grid Handler - Spacebar logic removed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown'].includes(e.code)) {
        e.preventDefault(); // Stop default browser page scrolling layout drops
      }

      if (e.code === 'ArrowUp') {
        scrollToCardIndex(activeIndex - 1);
      } else if (e.code === 'ArrowDown') {
        scrollToCardIndex(activeIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, scrollToCardIndex]);

  if (loading && tracks.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050507] text-white">
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 border-[3px] border-emerald-500/10 border-t-emerald-400 rounded-full animate-spin"></div>
          <div className="absolute text-2xl animate-pulse">🎵</div>
        </div>
        <p className="text-xs font-black tracking-[0.3em] text-neutral-500 mt-8 uppercase">Analyzing Soundwaves</p>
      </div>
    );
  }

  const activeGenreObj = AVAILABLE_GENRES.find(g => g.id === selectedGenre);

  return (
    <div className="h-screen w-full relative bg-[#050507] overflow-hidden font-sans antialiased text-neutral-200 select-none">
      
      {/* Top Floating Header Navigation */}
      <div className="absolute top-4 sm:top-6 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 pointer-events-none max-w-7xl mx-auto">
        <div className="relative flex flex-col items-start pointer-events-auto">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-zinc-950/60 hover:bg-zinc-900/80 border border-zinc-800/40 backdrop-blur-2xl px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-neutral-300 hover:text-emerald-400 transition-all"
          >
            <span>Channel: <span className="text-emerald-400 ml-1">{activeGenreObj?.label}</span></span>
            <span className={`text-[8px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`}>▼</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-[280px] sm:w-[480px] bg-zinc-950/90 border border-zinc-800/80 rounded-2xl shadow-2xl backdrop-blur-3xl p-2 grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-[50vh] overflow-y-auto scrollbar-none animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto">
              {AVAILABLE_GENRES.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreChange(genre.id)}
                  className={`text-left px-4 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all ${
                    selectedGenre === genre.id
                      ? 'bg-emerald-500 text-black font-black shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-zinc-900/50'
                  }`}
                >
                  {genre.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link 
          href="/library"
          className="pointer-events-auto bg-zinc-950/60 hover:bg-zinc-900/80 border border-zinc-800/40 backdrop-blur-2xl px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] transition-all text-neutral-300 hover:text-emerald-400"
        >
          📂 Library
        </Link>
      </div>

      {/* STATIC CONTROL ARROWS: Fixed securely to top right layout layers */}
      <div className="absolute right-4 sm:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 pointer-events-auto">
        <button
          disabled={activeIndex === 0}
          onClick={() => scrollToCardIndex(activeIndex - 1)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-950/70 hover:bg-zinc-900 border border-zinc-800/80 text-neutral-400 hover:text-emerald-400 disabled:opacity-15 disabled:hover:text-neutral-400 rounded-full backdrop-blur-2xl flex items-center justify-center font-bold text-sm transition-all active:scale-90 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          title="Previous Track (Arrow Up)"
        >
          ▲
        </button>
        <button
          disabled={activeIndex === tracks.length - 1}
          onClick={() => scrollToCardIndex(activeIndex + 1)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-950/70 hover:bg-zinc-900 border border-zinc-800/80 text-neutral-400 hover:text-emerald-400 disabled:opacity-15 disabled:hover:text-neutral-400 rounded-full backdrop-blur-2xl flex items-center justify-center font-bold text-sm transition-all active:scale-90 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          title="Next Track (Arrow Down)"
        >
          ▼
        </button>
      </div>

      {/* Main Track Viewport Container */}
      <main 
        ref={containerRef}
        className="h-full w-full overflow-hidden bg-black flex flex-col"
      >
        {tracks.map((track, index) => (
          <TrackVideoCard 
            key={`${track.id}-${index}`} 
            track={track} 
            volume={globalVolume}
            onVolumeChange={setGlobalVolume}
            isFocused={index === activeIndex}
            onTrackEnded={() => scrollToCardIndex(index + 1)}
          />
        ))}
      </main>
    </div>
  );
}

function TrackVideoCard({ 
  track, 
  volume, 
  onVolumeChange, 
  isFocused,
  onTrackEnded
}: { 
  track: Track; 
  volume: number; 
  onVolumeChange: (v: number) => void; 
  isFocused: boolean;
  onTrackEnded: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || hasError) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  }, [isPlaying, hasError]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isFocused && !hasError) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isFocused, hasError]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 30;
      setTrackProgress((current / duration) * 100);
    }
  };

  const handleLikeInteraction = async () => {
    try {
      const nextLikedState = !isLiked;
      setIsLiked(nextLikedState);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in to save tracks to your library collection!");
        setIsLiked(false);
        return;
      }

      if (nextLikedState) {
        const { error } = await supabase.from('liked_tracks').insert({
          user_id: user.id,
          track_id: track.id,
          title: track.title,
          artist: track.artist,
          genre: track.genre,
          audio_url: track.audio_url,
          cover_url: track.cover_url
        });
        if (error && error.code !== '23505') throw error;
      } else {
        const { error } = await supabase.from('liked_tracks')
          .delete()
          .eq('user_id', user.id)
          .eq('track_id', track.id);
        if (error) throw error;
      }
    } catch (err) {
      console.error("Database alignment fault:", err);
      setIsLiked(!isLiked);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative bg-[#050507] overflow-hidden flex-shrink-0">
      
      <audio 
        ref={audioRef} 
        src={track.audio_url} 
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={onTrackEnded}
        onError={() => { setHasError(true); setIsPlaying(false); }} 
      />

      {/* Ambient Blur Backdrop Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none transform scale-105">
        <div 
          style={{ backgroundImage: `url(${track.cover_url})` }} 
          className="absolute inset-0 bg-cover bg-center blur-[110px] opacity-25 mix-blend-screen saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050507] via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-95" />
      </div>

      {/* Layout Box Container */}
      <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between relative z-10 px-4 sm:px-8 lg:pl-16 lg:pr-36 pt-24 pb-12 max-w-7xl mx-auto gap-8 lg:gap-16">
        
        {/* Left Column: Disc Art Display Panel */}
        <div className="flex-1 w-full flex items-center justify-center relative max-h-[35vh] sm:max-h-[45vh] lg:max-h-none">
          <div onClick={togglePlay} className="relative group cursor-pointer flex items-center justify-center">
            
            {/* Spinning Record Vinyl Frame */}
            <div className={`absolute w-52 h-52 sm:w-72 sm:h-72 lg:w-[410px] lg:h-[410px] bg-[#09090b] rounded-full shadow-2xl border border-zinc-800/40 hidden sm:flex items-center justify-center transition-all duration-[1000ms] ${
              isPlaying ? 'lg:translate-x-28 rotate-[360deg] [animation-duration:12s]' : 'translate-x-0'
            }`}>
              <div className="flex gap-1 items-center justify-center opacity-20">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`w-0.5 bg-emerald-400 transition-all rounded-full ${isPlaying ? 'h-6 animate-bounce' : 'h-1.5'}`} />
                ))}
              </div>
            </div>

            <div 
              style={{ backgroundImage: `url(${track.cover_url})` }}
              className="w-44 h-44 sm:w-64 sm:h-64 lg:w-[350px] lg:h-[350px] bg-zinc-900 bg-cover bg-center rounded-2xl lg:rounded-[28px] relative z-10 border border-zinc-800/50 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/40 opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 text-xl">
                  {isPlaying ? '⏸' : '▶'}
                </div>
              </div>

              {hasError && (
                <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-4">
                  <span className="text-2xl animate-bounce">⚠️</span>
                  <p className="text-[10px] font-black text-red-400 mt-2 uppercase tracking-widest">Stream Bridge Terminated</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Player Dashboard Terminal Deck Control Unit */}
        <div className="w-full sm:max-w-md lg:w-[400px] bg-zinc-950/45 border border-zinc-900/50 backdrop-blur-3xl p-5 sm:p-6 rounded-2xl sm:rounded-[28px] shadow-2xl relative flex flex-col justify-between gap-5 sm:gap-6 overflow-hidden">
          
          <div 
            style={{ width: `${trackProgress}%` }}
            className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-200 ease-linear shadow-[0_0_8px_rgba(52,211,153,0.3)]" 
          />

          <div>
            <span className="px-2.5 py-0.5 text-[9px] bg-zinc-900/90 border border-zinc-800/80 text-emerald-400 font-bold uppercase tracking-wider rounded inline-block mb-2">
              {track.genre}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight truncate">
              {track.title}
            </h2>
            <p className="text-neutral-400 font-medium text-xs sm:text-sm mt-1 truncate flex items-center gap-2">
              <span className={`inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 ${isPlaying ? 'animate-ping' : 'opacity-40'}`} />
              {track.artist}
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-3 border-t border-zinc-900/60">
            
            <div className="flex items-center justify-between gap-3 bg-zinc-900/20 border border-zinc-900/40 px-3.5 py-2.5 rounded-xl text-neutral-400 text-[11px] font-bold">
              <span>🔊</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <span className="font-mono text-[9px] text-neutral-500 w-6 text-right">
                {Math.round(volume * 100)}
              </span>
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={handleLikeInteraction} 
                className={`flex-1 py-3 rounded-xl border font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isLiked 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-sm' 
                    : 'bg-zinc-900/40 border-zinc-800/80 text-neutral-400 hover:text-white'
                }`}
              >
                <span>{isLiked ? '❤️ Saved' : '🖤 Save'}</span>
              </button>
              
              <button 
                onClick={togglePlay} 
                className="px-6 sm:px-8 py-3 bg-white text-black font-black rounded-xl text-xs transition-all hover:bg-neutral-100 flex items-center justify-center shadow-md"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}