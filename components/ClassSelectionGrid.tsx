import React from 'react';
import { ClassFolder } from '../types';
import { useGalleryStore } from '../store/useGalleryStore';

interface Props {
  onSelect: (folder: ClassFolder) => void;
}

const ClassSelectionGrid: React.FC<Props> = ({ onSelect }) => {
  const { classes } = useGalleryStore();
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold text-gray-900">Choose a Class</h2>
        <p className="text-gray-500">Browse photos and videos of our talented students organized by class.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classes.length === 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))
        ) : classes.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onSelect(folder)}
            className="group relative flex flex-col items-start bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img 
                src={folder.thumbnail} 
                alt={folder.className}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                {folder.itemCount} items
              </div>
            </div>
            <div className="p-5 w-full flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{folder.className}</h3>
                <p className="text-gray-400 text-xs mt-1">Class Memories</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Upload Instructions Section */}
      {/* <div className="mt-16 bg-blue-50/50 rounded-3xl p-8 border border-blue-100/50 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Have memories to share?</h3>
            <p className="text-gray-600 leading-relaxed">
              Contributing your photos and videos is easy. Follow these steps to upload your captures to the school's official gallery:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm pt-2">
              <div className="flex items-start gap-3">
                <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-blue-600 shadow-sm border border-blue-100">1</div>
                <p className="text-gray-600">Open the shared <strong>Google Drive</strong> link for Annual Day 2026.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-blue-600 shadow-sm border border-blue-100">2</div>
                <p className="text-gray-600">Locate your student's <strong>Class Folder</strong> (e.g., Grade 4A).</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-blue-600 shadow-sm border border-blue-100">3</div>
                <p className="text-gray-600">Drag & drop or use <strong>"New &gt; File Upload"</strong> to add your media.</p>
              </div>
            </div>
            <div className="pt-4">
              <a 
                href="https://drive.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-md active:scale-95"
              >
                Go to Google Drive
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
              </a>
              <p className="mt-3 text-xs text-gray-400 italic">Please ensure your media is of high quality and appropriate for the school community.</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ClassSelectionGrid;
