'use client';

import { useState, useEffect } from 'react';

/**
 * useIsMobile
 * -----------
 * Custom hook to detect if the current viewport is "mobile" based on a configurable breakpoint.
 * Uses matchMedia for better performance and consistency across browsers (Safari included).
 * 
 * @param breakpoint The pixel width threshold (defaults to 768px).
 * @returns boolean indicating if the viewport is below the threshold.
 */
export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    
    // Initial check
    setIsMobile(mql.matches);

    // Listener with support for older Safari versions (using addListener/removeListener if needed, 
    // but addEventListener is standard in modern ones)
    const onChange = () => setIsMobile(mql.matches);
    
    // Modern API
    mql.addEventListener('change', onChange);
    
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
}
