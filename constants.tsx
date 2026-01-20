
import { ClassFolder, MediaItem, MediaType } from './types';

// Mock data generator for visual demonstration
// In a real app, this would be replaced by actual Google Drive API responses.
export const MOCK_CLASSES: ClassFolder[] = [
  { id: 'c1', className: 'Grade 1A', thumbnail: 'https://picsum.photos/seed/school1/800/600', itemCount: 24 },
  { id: 'c2', className: 'Grade 2B', thumbnail: 'https://picsum.photos/seed/school2/800/600', itemCount: 18 },
  { id: 'c3', className: 'Grade 3C', thumbnail: 'https://picsum.photos/seed/school3/800/600', itemCount: 32 },
  { id: 'c4', className: 'Grade 4A', thumbnail: 'https://picsum.photos/seed/school4/800/600', itemCount: 15 },
  { id: 'c5', className: 'Grade 5B', thumbnail: 'https://picsum.photos/seed/school5/800/600', itemCount: 21 },
  { id: 'c6', className: 'Grade 6D', thumbnail: 'https://picsum.photos/seed/school6/800/600', itemCount: 12 },
  { id: 'c7', className: 'Grade 7A', thumbnail: 'https://picsum.photos/seed/school7/800/600', itemCount: 28 },
  { id: 'c8', className: 'Kindergarten', thumbnail: 'https://picsum.photos/seed/school8/800/600', itemCount: 45 },
];

export const getMockMediaForClass = (classId: string): MediaItem[] => {
  return Array.from({ length: 20 }).map((_, i) => ({
    id: `${classId}-item-${i}`,
    name: i % 5 === 0 ? `Annual Dance Performance ${i}` : `Moment ${i}`,
    type: i % 5 === 0 ? MediaType.VIDEO : MediaType.IMAGE,
    url: i % 5 === 0 
      ? 'https://www.w3schools.com/html/mov_bbb.mp4' 
      : `https://picsum.photos/seed/${classId}-${i}/1200/800`,
    thumbnail: `https://picsum.photos/seed/${classId}-${i}/400/300`,
    mimeType: i % 5 === 0 ? 'video/mp4' : 'image/jpeg',
    size: '2.4 MB',
    dimensions: '1920x1080',
    date: '2026-05-15'
  }));
};
