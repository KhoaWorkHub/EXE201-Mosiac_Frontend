import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design
 * Returns whether the specified media query matches
 * 
 * @param query - CSS media query string
 * @returns - Boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);
  
  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Define event listener
    const handleResize = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add listener for window resize
    mediaQuery.addEventListener('change', handleResize);
    
    // Cleanup function
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, [query]);
  
  return matches;
};