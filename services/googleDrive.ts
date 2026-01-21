
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/drive/v3';

export interface DriveFolder {
  id: string;
  name: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  imageMediaMetadata?: {
    width: number;
    height: number;
    time?: string;
  };
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
}

export const fetchFolders = async (parentFolderId: string): Promise<DriveFolder[]> => {
  if (!API_KEY) {
    console.warn('Google Drive API Key is missing. Using mock data.');
    return [];
  }

  const query = `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  let allFiles: DriveFolder[] = [];
  let pageToken: string | null = null;

  do {
    const url = `${BASE_URL}/files?q=${encodeURIComponent(query)}&key=${API_KEY}&pageSize=1000&fields=nextPageToken,files(id,name)&supportsAllDrives=true&includeItemsFromAllDrives=true${pageToken ? `&pageToken=${pageToken}` : ''}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.files) {
        allFiles = [...allFiles, ...data.files];
      }
      pageToken = data.nextPageToken || null;
    } catch (error) {
      console.error('Error fetching folders:', error);
      return allFiles;
    }
  } while (pageToken);

  return allFiles;
};

export const fetchFiles = async (folderId: string): Promise<DriveFile[]> => {
  if (!API_KEY) {
    console.warn('Google Drive API Key is missing. Using mock data.');
    return [];
  }

  const query = `'${folderId}' in parents and trashed = false`;
  let allFiles: DriveFile[] = [];
  let pageToken: string | null = null;

  do {
    const url = `${BASE_URL}/files?q=${encodeURIComponent(query)}&key=${API_KEY}&pageSize=1000&fields=nextPageToken,files(id,name,mimeType,size,imageMediaMetadata,thumbnailLink,webViewLink,webContentLink)&supportsAllDrives=true&includeItemsFromAllDrives=true${pageToken ? `&pageToken=${pageToken}` : ''}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google Drive API Error (fetchFiles):', errorData);
        return allFiles; 
      }
      const data = await response.json();
      if (data.files) {
        allFiles = [...allFiles, ...data.files];
      }
      pageToken = data.nextPageToken || null;
    } catch (error) {
      console.error('Error fetching files:', error);
      return allFiles;
    }
  } while (pageToken);

  return allFiles;
};

export const getFileUrl = (file: DriveFile): string => {
  // For videos, return the direct streamable API URL using key
  if (file.mimeType.startsWith('video/')) {
    return `${BASE_URL}/files/${file.id}?alt=media&key=${API_KEY}`;
  }

  // For images, use lh3 thumbnail link if available (best for images)
  if (file.thumbnailLink) {
    // Replace the small size with a larger one
    return file.thumbnailLink.replace(/=s\d+/, '=s1600');
  }
  
  // Fallback to direct Drive export link
  return `https://drive.google.com/uc?export=view&id=${file.id}`;
};

export const getThumbnailUrl = (file: DriveFile): string => {
  if (file.thumbnailLink) {
    return file.thumbnailLink.replace(/=s\d+/, '=s400');
  }
  return `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`;
};
