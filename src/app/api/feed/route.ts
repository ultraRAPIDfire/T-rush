import { NextRequest, NextResponse } from 'next/server';
import { MASSIVE_MUSIC_CATALOG } from '../../../utils/musicCatalog';

interface iTunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  primaryGenreName: string;
  previewUrl: string;
  artworkUrl100: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const activeGenre = searchParams.get('genre') || 'all';

  // Safely grab the selected genre index sub-pool out of the 500+ dataset catalog
  const selectedPool = MASSIVE_MUSIC_CATALOG[activeGenre] || MASSIVE_MUSIC_CATALOG['all'];
  const searchKeyword = selectedPool[Math.floor(Math.random() * selectedPool.length)];

  try {
    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchKeyword)}&entity=song&limit=40`;
    const response = await fetch(searchUrl);
    
    if (!response.ok) throw new Error("iTunes connection dropped");
    
    const data = await response.json();
    const results: iTunesTrack[] = data.results || [];

    let filteredTracks = results.filter(track => track.previewUrl);

    if (activeGenre !== 'all' && activeGenre !== 'opm') {
      const target = activeGenre === 'hiphop' ? 'hip hop' : activeGenre.toLowerCase();
      filteredTracks = filteredTracks.filter(track => 
        track.primaryGenreName?.toLowerCase().includes(target) ||
        track.trackName?.toLowerCase().includes(target)
      );
    }

    const sourceSelection = filteredTracks.length > 0 ? filteredTracks : results.filter(track => track.previewUrl);
    const randomSelection = [...sourceSelection].sort(() => Math.random() - 0.5).slice(0, 5);

    const tracks = randomSelection.map((track, index) => ({
      id: `itunes-${track.trackId}-${index}-${Date.now()}`,
      title: track.trackName,
      artist: track.artistName,
      genre: activeGenre === 'opm' ? 'OPM' : (track.primaryGenreName || 'Music'),
      audio_url: track.previewUrl,
      cover_url: track.artworkUrl100.replace('100x100bb', '400x400bb')
    }));

    return NextResponse.json({ tracks });

  } catch (error) {
    console.error("Genre api execution failure:", error);
    return NextResponse.json({ tracks: [] });
  }
}