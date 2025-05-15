import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Group, Vector3 } from 'three';
import { gsap } from 'gsap';
import useARStore, { PatternInfo } from '../store/arStore';

interface HotspotProps {
  pattern: PatternInfo;
  onClick: (id: string) => void;
  selected: boolean;
  hovered: boolean;
}

// Individual hotspot component
const Hotspot: React.FC<HotspotProps> = ({ pattern, onClick, selected, hovered }) => {
  const pulseRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  
  // Set up pulse animation
  useEffect(() => {
    if (pulseRef.current && !selected) {
      gsap.to(pulseRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        repeat: -1,
        ease: 'power1.out',
      });
    }
    
    // Handle hover animation
    if (dotRef.current) {
      if (hovered && !selected) {
        gsap.to(dotRef.current, {
          scale: 1.3,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 0 10px rgba(0, 92, 78, 0.6)',
          duration: 0.3,
        });
      } else if (!selected) {
        gsap.to(dotRef.current, {
          scale: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          boxShadow: '0 0 5px rgba(0, 92, 78, 0.3)',
          duration: 0.3,
        });
      }
    }
  }, [hovered, selected]);
  
  // Handle selection animation
  useEffect(() => {
    if (dotRef.current && pulseRef.current) {
      if (selected) {
        // Stop pulse animation
        gsap.killTweensOf(pulseRef.current);
        
        // Animate dot to selected state
        gsap.to(dotRef.current, {
          scale: 1.5,
          backgroundColor: 'rgba(0, 92, 78, 1)',
          border: '2px solid white',
          boxShadow: '0 0 15px rgba(0, 92, 78, 0.8)',
          duration: 0.4,
        });
        
        // Animate pulse to selected state
        gsap.to(pulseRef.current, {
          scale: 2,
          opacity: 0.5,
          backgroundColor: 'rgba(0, 92, 78, 0.3)',
          duration: 0.4,
        });
      } else {
        // Reset pulse animation
        gsap.to(pulseRef.current, {
          scale: 1.5,
          opacity: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          duration: 0.4,
          onComplete: () => {
            if (pulseRef.current) {
              gsap.to(pulseRef.current, {
                scale: 1.5,
                opacity: 0,
                duration: 1.5,
                repeat: -1,
                ease: 'power1.out',
              });
            }
          },
        });
      }
    }
  }, [selected]);
  
  return (
    <div className="hotspot-container" onClick={() => onClick(pattern.id)} style={{ cursor: 'pointer' }}>
      {/* Pulsing background */}
      <div 
        ref={pulseRef}
        className="hotspot-pulse" 
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 0.5,
        }}
      />
      
      {/* Main hotspot dot */}
      <div 
        ref={dotRef}
        className="hotspot-dot" 
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 0 5px rgba(0, 92, 78, 0.3)',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
        }}
      />
    </div>
  );
};

interface ModelHotspotsProps {
  modelRef: React.RefObject<Group>;
}

// Hotspot container component to add to 3D model
const ModelHotspots: React.FC<ModelHotspotsProps> = ({ modelRef }) => {
  const { modelInfo, selectedPattern, selectPattern } = useARStore();
  const [hoveredPattern] = useState<string | null>(null);
  const hotspotRefs = useRef<(Vector3 | null)[]>(Array(modelInfo.patterns.length).fill(null));
  
  // Update world positions of hotspots each frame
  useFrame(() => {
    if (!modelRef.current) return;
    
    modelInfo.patterns.forEach((pattern, index) => {
      // Create a Vector3 if it doesn't exist yet
      if (!hotspotRefs.current[index]) {
        hotspotRefs.current[index] = new Vector3(...pattern.position);
      }
      
      // Get the Vector3 reference
      const pos = hotspotRefs.current[index];
      if (!pos) return;
      
      // Update position based on model's world transformation
      pos.set(...pattern.position);
      modelRef.current.localToWorld(pos.clone());
    });
  });
  
  const handleHotspotClick = (patternId: string) => {
    selectPattern(selectedPattern?.id === patternId ? null : patternId);
  };
  
  
  return (
    <>
      {modelInfo.patterns.map((pattern, _index) => (
        <Html
          key={pattern.id}
          position={pattern.position}
          occlude={true}
          distanceFactor={10}
          zIndexRange={[50, 0]}
          center
        >
          <Hotspot
            pattern={pattern}
            onClick={handleHotspotClick}
            selected={selectedPattern?.id === pattern.id}
            hovered={hoveredPattern === pattern.id}
          />
          
          {/* Add label that appears on hover */}
          {(hoveredPattern === pattern.id || selectedPattern?.id === pattern.id) && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                marginTop: '5px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {pattern.name}
            </div>
          )}
        </Html>
      ))}
    </>
  );
};

export default ModelHotspots;