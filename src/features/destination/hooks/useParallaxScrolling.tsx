import { useRef, useEffect, RefObject } from 'react';

/**
 * Custom hook for parallax scrolling effects
 * Uses requestAnimationFrame for optimal performance
 * 
 * @param ref - React ref to the target element
 * @param speed - Parallax speed factor (0.5 = half speed, 2 = double speed)
 * @param direction - Direction of parallax effect ('up', 'down', 'left', 'right')
 * @returns - Style object to be applied to the element
 */
export const useParallaxScrolling = (
  ref: RefObject<HTMLElement>, 
  speed = 0.5, 
  direction = 'up'
) => {
  const initialPositionRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const transformRef = useRef({ y: 0, scale: 1 });
  
  useEffect(() => {
    // Store initial position when the component mounts
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      initialPositionRef.current = rect.top + window.scrollY;
    }
    
    const handleScroll = () => {
      if (!ref.current) return;
      
      // Element boundaries
      const rect = ref.current.getBoundingClientRect();
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      const elementHeight = rect.height;
      
      // Only apply parallax when element is in viewport (with buffer)
      const viewportHeight = window.innerHeight;
      const buffer = viewportHeight * 0.5;
      
      if (elementBottom < -buffer || elementTop > viewportHeight + buffer) {
        return;
      }
      
      // Calculate parallax transforms
      const scrollPosition = window.scrollY;
      const relativeScroll = scrollPosition - initialPositionRef.current;
      let yOffset = relativeScroll * speed;
      
      if (direction === 'down') {
        yOffset = -yOffset;
      }
      
      // Calculate scale effect (subtle zoom)
      const scrollProgress = Math.max(0, Math.min(1, 
        (elementTop + elementHeight) / (viewportHeight + elementHeight)
      ));
      const scale = 1 + (scrollProgress * 0.05);
      
      // Update transform ref
      transformRef.current = {
        y: yOffset,
        scale: direction === 'up' || direction === 'down' ? scale : 1
      };
      
      // Apply transform via inline style for max performance
      if (ref.current) {
        const transform = `translate3d(0, ${yOffset}px, 0) scale(${transformRef.current.scale})`;
        ref.current.style.transform = transform;
      }
    };
    
    // Use requestAnimationFrame for smooth performance
    const tick = () => {
      handleScroll();
      animationFrameRef.current = requestAnimationFrame(tick);
    };
    
    // Start animation frame loop
    animationFrameRef.current = requestAnimationFrame(tick);
    
    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [ref, speed, direction]);
  
  return {
    transform: `translate3d(0, ${transformRef.current.y}px, 0) scale(${transformRef.current.scale})`,
    transition: 'transform 0.1s linear',
    willChange: 'transform',
  };
};