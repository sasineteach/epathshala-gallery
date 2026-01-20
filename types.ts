
export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  downloadUrl?: string;
  thumbnail: string;
  mimeType: string;
  size?: string;
  dimensions?: string;
  date?: string;
}

export interface ClassFolder {
  id: string;
  className: string;
  thumbnail: string;
  itemCount: number;
}
