
import React from 'react';
import { MediaItem, MediaType } from '../types';

interface Props {
  className: string;
  items: MediaItem[];
  onItemClick: (index: number) => void;
}

const ClassMediaGrid: React.FC<Props> = ({ className, items, onItemClick }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-gray-900">{className}</h2>
          <p className="text-gray-500 mt-2">Captured moments from the annual function.</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100">
            {items.filter(i => i.type === MediaType.IMAGE).length} Photos
          </span>
          <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold border border-purple-100">
            {items.filter(i => i.type === MediaType.VIDEO).length} Videos
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {items.length === 0 ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
          ))
        ) : items.map((item, idx) => (
          <div 
            key={item.id}
            onClick={() => onItemClick(idx)}
            className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          >
            <img 
              src={item.thumbnail} 
              alt={item.name}
              className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            {item.type === MediaType.VIDEO && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="bg-white/30 backdrop-blur-md p-3 rounded-full border border-white/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
              <p className="text-white text-[10px] truncate font-medium">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassMediaGrid;
