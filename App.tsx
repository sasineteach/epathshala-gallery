
import React, { useState, useEffect } from 'react';
import { useGalleryStore } from './store/useGalleryStore';
import ClassSelectionGrid from './components/ClassSelectionGrid';
import ClassMediaGrid from './components/ClassMediaGrid';
import FullscreenGallery from './components/FullscreenGallery';

const App: React.FC = () => {
  const { 
    classes, 
    selectedClass, 
    mediaItems, 
    isLoading, 
    loadClasses, 
    selectClass, 
    clearSelection 
  } = useGalleryStore();

  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleMediaClick = (index: number) => {
    setGalleryIndex(index);
  };

  const handleCloseGallery = () => {
    setGalleryIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Annual Day 2026</h1>
          </div>
          {selectedClass && (
            <button 
              onClick={clearSelection}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to Albums
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {isLoading && !selectedClass ? (
          <div className="h-full flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Loading memories...</p>
          </div>
        ) : !selectedClass ? (
          <ClassSelectionGrid onSelect={selectClass} />
        ) : (
          <ClassMediaGrid 
            className={selectedClass.className}
            items={mediaItems}
            onItemClick={handleMediaClick}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>© 2026 ePathshala CBSE School. All memories preserved.</p>
      </footer>

      {/* Gallery Modal */}
      {galleryIndex !== null && (
        <FullscreenGallery 
          items={mediaItems}
          initialIndex={galleryIndex}
          onClose={handleCloseGallery}
        />
      )}
    </div>
  );
};

export default App;
