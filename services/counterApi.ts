const API_BASE_URL = 'https://api.counterapi.dev/v2';
const WORKSPACE = import.meta.env.VITE_COUNTER_WORKSPACE || 'epathshala';

const ALBUM_COUNTER_MAPPING: Record<string, string> = {
  'Student Photos': 'student-album-counter',
  'Dance Photos': 'dance-album-counter',
  'Song Photos': 'songs-album-counter',
  'Guest Photos': 'guest-album-counter'
};

export const getCounterIdForAlbum = (albumName: string, fallbackId: string): string => {
  return ALBUM_COUNTER_MAPPING[albumName] || fallbackId;
};

export const incrementAlbumView = async (albumId: string): Promise<number | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(WORKSPACE)}/${encodeURIComponent(albumId)}/up`);
    
    if (!response.ok) throw new Error('Failed to increment count');
    
    const data = await response.json();
    return data.count;
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
    return data.count;
  } catch (error) {
    console.error('Error fetching view count:', error);
    return null;
  }
};
