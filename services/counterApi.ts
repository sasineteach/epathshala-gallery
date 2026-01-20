const API_BASE_URL = 'https://api.counterapi.dev/v2';
const WORKSPACE = import.meta.env.VITE_COUNTER_WORKSPACE || 'epathshala';

const ALBUM_COUNTER_MAPPING: Record<string, string> = {
  'STUDENT PHOTOS': 'student-album-counter',
  'DANCE PHOTOS': 'dance-album-counter',
  'SONG PHOTOS': 'songs-album-counter',
  'GUEST PHOTOS': 'guest-album-counter'
};

export const getCounterIdForAlbum = (albumName: string): string | null => {
  return ALBUM_COUNTER_MAPPING[albumName.toUpperCase()] || null;
};

export const incrementAlbumView = async (albumId: string): Promise<number | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(WORKSPACE)}/${encodeURIComponent(albumId)}/up`);
    
    if (!response.ok) throw new Error('Failed to increment count');
    
    const data = await response.json();
    // V2 API returns { code: "200", data: { up_count: number, ... } }
    return data.data?.up_count ?? data.count ?? 0;
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return null;
  }
};

export const getAlbumViewCount = async (albumId: string): Promise<number | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(WORKSPACE)}/${encodeURIComponent(albumId)}`);

    if (!response.ok) throw new Error('Failed to get count');
    
    const data = await response.json();
    // V2 API returns { code: "200", data: { up_count: number, ... } }
    return data.data?.up_count ?? data.count ?? 0;
  } catch (error) {
    console.error('Error fetching view count:', error);
    return null;
  }
};
