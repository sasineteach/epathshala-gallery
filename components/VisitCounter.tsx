import React, { useEffect, useState } from 'react';
import { incrementAlbumView } from '../services/counterApi';

const VisitCounter: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const GLOBAL_COUNTER_KEY = 'total-site-visits';
    
    // Increment on mount (session storage check could be added here to avoid spamming)
    incrementAlbumView(GLOBAL_COUNTER_KEY).then(newCount => {
      setCount(newCount);
      setLoading(false);
    });
  }, []);

  if (loading) return <span className="text-xs text-gray-400 animate-pulse">Loading views...</span>;

  return (
    <div className="flex items-center gap-2 justify-center mt-2 text-xs text-blue-400/80 font-medium">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
      <span>{(count || 0).toLocaleString()} Total Visits</span>
    </div>
  );
};

export default VisitCounter;
