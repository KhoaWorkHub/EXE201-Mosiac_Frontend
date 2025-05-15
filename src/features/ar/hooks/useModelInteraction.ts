import { useCallback, useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, Mesh, Group } from 'three';
import { gsap } from 'gsap';
import useARStore from '../store/arStore';

interface ModelInteractionOptions {
  enableRotation?: boolean;
  enableZoom?: boolean;
  highlightOnHover?: boolean;
  animateFocus?: boolean;
}

/**
 * Custom hook for handling 3D model interactions in AR
 */
export function useModelInteraction(
  modelRef: React.RefObject<Group | Mesh | null>,
  options: ModelInteractionOptions = {}
) {
  const {
    enableRotation = true,
    enableZoom = true,
    highlightOnHover = true,
    animateFocus = true,
  } = options;
  
  const { camera, raycaster, mouse, gl } = useThree();
  const { selectPattern, modelInfo, selectedPattern } = useARStore();
  
  // Internal state
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [autoRotate, setAutoRotate] = useState(enableRotation);
  const rotationRef = useRef(0);
  
  // Raycast to find intersections with model parts
  const raycast = useCallback(() => {
    if (!modelRef.current) return null;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(modelRef.current, true);
    
    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      return intersectedObject;
    }
    
    return null;
  }, [camera, mouse, modelRef, raycaster]);
  
  // Handle pointer movement for hover effects
  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!modelRef.current || !highlightOnHover) return;
    
    // Convert mouse position to normalized device coordinates
    mouse.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;
    
    const intersectedObject = raycast();
    
    if (intersectedObject) {
      // Find if this is a pattern part
      const patternMatch = modelInfo.patterns.find(
        pattern => intersectedObject.name.includes(pattern.id)
      );
      
      if (patternMatch) {
        setHoveredPartId(patternMatch.id);
        
        // Apply hover effect
        if (intersectedObject instanceof Mesh && 
            intersectedObject.material && 
            'emissive' in intersectedObject.material) {
          gsap.to(intersectedObject.material.emissive, {
            r: 0.3,
            g: 0.3,
            b: 0.3,
            duration: 0.3,
          });
        }
      } else {
        if (hoveredPartId) {
          setHoveredPartId(null);
        }
      }
    } else if (hoveredPartId) {
      setHoveredPartId(null);
    }
  }, [modelRef, hoveredPartId, modelInfo.patterns, raycast, mouse, gl.domElement, highlightOnHover]);
  
  // Handle pointer down for selection
  const handlePointerDown = useCallback((_event: PointerEvent) => {
    if (!modelRef.current) return;
    
    const intersectedObject = raycast();
    
    if (intersectedObject) {
      // Find if this is a pattern part
      const patternMatch = modelInfo.patterns.find(
        pattern => intersectedObject.name.includes(pattern.id)
      );
      
      if (patternMatch) {
        // Toggle selection
        selectPattern(
          selectedPattern?.id === patternMatch.id ? null : patternMatch.id
        );
        
        // Focus camera on selected part if animateFocus is enabled
        if (animateFocus && modelRef.current) {
          const position = new Vector3(
            patternMatch.position[0],
            patternMatch.position[1],
            patternMatch.position[2]
          );
          
          // Position is in model space, convert to world space
          modelRef.current.localToWorld(position);
          
          // Animate camera to look at the position
          gsap.to(camera.position, {
            x: position.x + 0.5,
            y: position.y + 0.2,
            z: position.z + 0.7,
            duration: 1,
            ease: 'power2.out',
          });
          
          // Also animate model rotation to face camera
          if (modelRef.current instanceof Group) {
            const targetRotation = Math.atan2(
              camera.position.x - position.x,
              camera.position.z - position.z
            );
            
            gsap.to(modelRef.current.rotation, {
              y: targetRotation,
              duration: 1,
              ease: 'power2.out',
            });
          }
          
          // Pause auto-rotation when focused on a part
          setAutoRotate(false);
        }
      }
    }
  }, [modelRef, raycast, modelInfo.patterns, selectPattern, selectedPattern, animateFocus, camera]);
  
  // Reset view
  const resetView = useCallback(() => {
    if (!modelRef.current) return;
    
    // Reset zoom
    setZoomLevel(1);
    
    // Reset rotation
    if (modelRef.current instanceof Group) {
      gsap.to(modelRef.current.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    }
    
    // Reset camera
    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: 5,
      duration: 0.8,
      ease: 'power2.out',
    });
    
    // Reset pattern selection
    selectPattern(null);
    
    // Resume auto-rotation
    setAutoRotate(enableRotation);
  }, [modelRef, camera, enableRotation, selectPattern]);
  
  // Zoom in/out
  const zoom = useCallback((factor: number) => {
    if (!enableZoom) return;
    
    const newZoom = Math.max(0.5, Math.min(2.0, zoomLevel * factor));
    setZoomLevel(newZoom);
    
    if (modelRef.current) {
      gsap.to(modelRef.current.scale, {
        x: newZoom,
        y: newZoom,
        z: newZoom,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [zoomLevel, enableZoom, modelRef]);
  
  // Toggle auto-rotation
  const toggleRotation = useCallback(() => {
    setAutoRotate(prev => !prev);
  }, []);
  
  // Animation frame updates
  useFrame((_, delta) => {
    if (modelRef.current && autoRotate && !selectedPattern) {
      // Only auto-rotate if not focusing on a pattern
      rotationRef.current += delta * 0.3;
      modelRef.current.rotation.y = rotationRef.current;
    }
  });
  
  // Setup event listeners
  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [handlePointerMove, handlePointerDown]);
  
  return {
    hoveredPartId,
    zoomLevel,
    autoRotate,
    resetView,
    zoom,
    toggleRotation,
  };
}

export default useModelInteraction;