'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Preloader from '../components/Preloader';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Check if this is a page reload (not client-side navigation)
    const handleBeforeUnload = () => {
      sessionStorage.setItem('cityride_reloading', 'true');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    const wasReloading = sessionStorage.getItem('cityride_reloading') === 'true';
    
    if (wasReloading || isInitialLoad) {
      setLoading(true);
      sessionStorage.removeItem('cityride_reloading');
      
      const timer = setTimeout(() => {
        setLoading(false);
        setIsInitialLoad(false);
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    } else {
      setLoading(false);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname, isInitialLoad]);

  if (loading) {
    return <Preloader onFinished={() => setLoading(false)} />;
  }

  return (
    <div className="bg-[#F8F7F2] text-gray-800 min-h-screen overflow-x-hidden">
      {children}
    </div>
  );
}