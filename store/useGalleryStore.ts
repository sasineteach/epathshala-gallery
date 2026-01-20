
import { create } from 'zustand';
import { ClassFolder, MediaItem, MediaType } from '../types';
import { fetchFolders, fetchFiles, getFileUrl, getThumbnailUrl } from '../services/googleDrive';
import { MOCK_CLASSES, getMockMediaForClass } from '../constants';

interface GalleryState {
  classes: ClassFolder[];
  selectedClass: ClassFolder | null;
  mediaItems: MediaItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadClasses: () => Promise<void>;
  selectClass: (folder: ClassFolder) => Promise<void>;
  clearSelection: () => void;
}

const ROOT_FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_ROOT_ID;

export const useGalleryStore = create<GalleryState>((set, get) => ({
  classes: [],
  selectedClass: null,
  mediaItems: [],
  isLoading: false,
  error: null,

  loadClasses: async () => {
    set({ isLoading: true, error: null });
    try {
      if (!ROOT_FOLDER_ID) {
        console.warn('VITE_GOOGLE_DRIVE_ROOT_ID is missing using mock classes');
        set({ classes: MOCK_CLASSES, isLoading: false });
        return;
      }

      const folders = await fetchFolders(ROOT_FOLDER_ID);
      console.log('Fetched root folders:', folders);
      const classFolders: ClassFolder[] = await Promise.all(folders.map(async (f) => {
        // Fetch one image to use as thumbnail
        const files = await fetchFiles(f.id);
        console.log(`Files in folder ${f.name} (${f.id}):`, files.map(file => ({ name: file.name, mimeType: file.mimeType })));
        
        const mediaFiles = files.filter(file => file.mimeType.startsWith('image/') || file.mimeType.startsWith('video/'));
        const firstImage = mediaFiles.find(file => file.mimeType.startsWith('image/'));
        
        return {
          id: f.id,
          className: f.name,
          thumbnail: firstImage ? getThumbnailUrl(firstImage) : 'https://picsum.photos/seed/school/800/600',
          itemCount: mediaFiles.length
        };
      }));

      set({ classes: classFolders, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load classes', isLoading: false });
      console.error(err);
    }
  },

  selectClass: async (folder: ClassFolder) => {
    set({ selectedClass: folder, isLoading: true, error: null, mediaItems: [] });
    try {
      if (folder.id.startsWith('c')) { // Mock ID
        const media = getMockMediaForClass(folder.id);
        set({ mediaItems: media, isLoading: false });
        return;
      }

      const files = await fetchFiles(folder.id);
      console.log(`All files in class ${folder.className}:`, files);
      
      const mediaFiles = files.filter(f => f.mimeType.startsWith('image/') || f.mimeType.startsWith('video/'));
      console.log(`Media files only:`, mediaFiles);

      const mediaItems: MediaItem[] = mediaFiles.map(f => ({
        id: f.id,
        name: f.name,
        type: f.mimeType.startsWith('video/') ? MediaType.VIDEO : MediaType.IMAGE,
        url: getFileUrl(f),
        thumbnail: getThumbnailUrl(f),
        mimeType: f.mimeType,
        size: f.size ? `${(parseInt(f.size) / (1024 * 1024)).toFixed(2)} MB` : undefined,
        dimensions: f.imageMediaMetadata ? `${f.imageMediaMetadata.width}x${f.imageMediaMetadata.height}` : undefined,
        date: f.imageMediaMetadata?.time?.split(' ')[0].replace(/:/g, '-')
      }));

      set({ mediaItems, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load media', isLoading: false });
      console.error(err);
    }
  },

  clearSelection: () => {
    set({ selectedClass: null, mediaItems: [] });
  }
}));
