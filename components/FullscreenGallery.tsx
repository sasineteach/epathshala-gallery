
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MediaItem, MediaType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Download, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface Props {
  items: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}

const FullscreenGallery: React.FC<Props> = ({ items, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showDetails, setShowDetails] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [direction, setDirection] = useState(0);

  const activeItem = items[currentIndex];

  const handleNext = useCallback(() => {
    setIsZoomed(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setIsZoomed(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  const downloadFile = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white">
          <p className="text-xs text-gray-400 font-mono tracking-widest uppercase">{currentIndex + 1} / {items.length}</p>
          <h3 className="font-bold text-lg leading-tight truncate max-w-[200px] md:max-w-md">{activeItem.name}</h3>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setShowDetails(!showDetails)}
            className="p-3 text-white hover:bg-white/10 rounded-full transition-colors"
            title="Info"
          >
            <Info size={24} />
          </button>
          <button 
            onClick={() => downloadFile(activeItem.url, activeItem.name)}
            className="p-3 text-white hover:bg-white/10 rounded-full transition-colors"
            title="Download"
          >
            <Download size={24} />
          </button>
          <button 
            onClick={onClose}
            className="p-3 text-white hover:bg-white/10 rounded-full transition-colors bg-white/5 backdrop-blur"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Navigation Buttons (Desktop) */}
        {!isZoomed && (
          <>
            <button 
              onClick={handlePrev}
              className="hidden md:flex absolute left-6 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white z-20 backdrop-blur-sm transition-all border border-white/10"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={handleNext}
              className="hidden md:flex absolute right-6 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white z-20 backdrop-blur-sm transition-all border border-white/10"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full h-full flex items-center justify-center p-4 pointer-events-auto"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(_, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500;
                if (swipe) {
                  if (offset.x > 0) handlePrev();
                  else handleNext();
                }
              }}
            >
              {activeItem.type === MediaType.IMAGE ? (
                <div className="relative group">
                   <motion.img 
                    src={activeItem.url} 
                    alt={activeItem.name}
                    className="max-w-full max-h-screen object-contain shadow-2xl rounded"
                    animate={{ scale: isZoomed ? 2 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => setIsZoomed(!isZoomed)}
                    style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="absolute bottom-4 right-4 p-2 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isZoomed ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
                  <video 
                    src={activeItem.url} 
                    controls 
                    autoPlay
                    className="w-full h-full"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Details Panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-24 right-6 left-6 md:left-auto md:w-80 p-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 border border-white/20"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-gray-900">Media Details</h4>
              <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-gray-600">
                 <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-400">File Type</span>
                <span className="font-medium text-gray-700">{activeItem.mimeType}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-400">Dimensions</span>
                <span className="font-medium text-gray-700">{activeItem.dimensions || '1920x1080'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-400">File Size</span>
                <span className="font-medium text-gray-700">{activeItem.size || '2.4 MB'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Captured On</span>
                <span className="font-medium text-gray-700">{activeItem.date || '2026-05-15'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thumbnails Navigation */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2 px-6 overflow-x-auto no-scrollbar pb-2">
        {items.map((item, idx) => (
          <button 
            key={item.id}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`flex-shrink-0 transition-all duration-300 rounded-lg overflow-hidden border-2 ${
              currentIndex === idx 
                ? 'w-14 h-14 border-blue-500 scale-110 shadow-lg' 
                : 'w-10 h-10 opacity-40 hover:opacity-100 border-white/20'
            }`}
          >
            <img src={item.thumbnail} className="w-full h-full object-cover" alt={`Thumb ${idx}`} referrerPolicy="no-referrer" />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default FullscreenGallery;
