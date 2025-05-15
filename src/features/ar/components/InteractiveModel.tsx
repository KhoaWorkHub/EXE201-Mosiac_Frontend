import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Mesh, Group, Vector3, MeshStandardMaterial } from 'three';
import * as THREE from 'three';
import { gsap } from 'gsap';
import useARStore from '../store/arStore';
import ModelHotspots from './ModelHotspots';

interface InteractiveModelProps {
  modelPath: string;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  interactive?: boolean;
  autoRotate?: boolean;
}

// This component handles the interactive 3D model with hotspots for cultural patterns
const InteractiveModel = forwardRef<{ reset: () => void }, InteractiveModelProps>(({
    modelPath,
    position = [0, -0.5, 0],
    scale = 0.5,
    rotation = [0, 0, 0],
    interactive = true,
    autoRotate = true,
  }, ref) => {
  const { camera } = useThree();
  const { selectPattern, modelInfo, selectedPattern, setShowPatternInfo } = useARStore();
  
  // Refs for animations
  const modelRef = useRef<Group>(null!);
  const rotationRef = useRef<number>(0);
  
  // Local state for hover effects and rotation
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  
  // Load the model
  const { scene } = useGLTF(modelPath);
  
  // Clone the model to avoid modifying the cached original
  useEffect(() => {
    if (scene && modelRef.current) {
      // Clear any existing children
      while (modelRef.current.children.length) {
        modelRef.current.remove(modelRef.current.children[0]);
      }
      
      // Add the cloned scene
      modelRef.current.add(scene.clone());
      
      // Add names to meshes based on position to identify pattern areas
      if (interactive) {
        modelRef.current.traverse((object) => {
          if (object instanceof Mesh) {
            const mesh = object as Mesh;
            
            // Check which pattern this mesh might be closest to
            modelInfo.patterns.forEach(pattern => {
              const patternPos = new Vector3(...pattern.position);
              const distance = mesh.position.distanceTo(patternPos);
              
              // If mesh is close to a pattern position, tag it with the pattern ID
              if (distance < 0.3) {
                mesh.name = `${mesh.name}_${pattern.id}`;
              }
            });
          }
        });
      }
    }
  }, [scene, modelRef, interactive, modelInfo.patterns]);
  
  // Setup highlight materials for interactive parts
  useEffect(() => {
    if (!modelRef.current || !interactive) return;
    
    // Find meshes that correspond to our interactive patterns
    modelRef.current.traverse((object) => {
      if (object instanceof Mesh) {
        const mesh = object as Mesh;
        
        // Store original material for reverting later
        if (!mesh.userData.originalMaterial) {
          mesh.userData.originalMaterial = mesh.material;
        }
        
        // Check if this mesh is one of our interactive pattern areas
        const patternMatch = modelInfo.patterns.find(
          pattern => mesh.name.includes(pattern.id)
        );
        
        if (patternMatch) {
          // Make it slightly emissive to stand out
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map(m => {
              if (m instanceof MeshStandardMaterial) {
                const newMat = m.clone();
                newMat.emissive.set('#222222');
                return newMat;
              }
              return m;
            });
          } else if (mesh.material instanceof MeshStandardMaterial) {
            const newMat = mesh.material.clone();
            newMat.emissive.set('#222222');
            mesh.material = newMat;
          }
        }
      }
    });
  }, [modelRef, interactive, modelInfo.patterns]);
  
  // Frame loop for auto-rotation and animations
  useFrame((state, delta) => {
    if (modelRef.current && isAutoRotating) {
      // Gentle auto-rotation
      rotationRef.current += delta * 0.3;
      modelRef.current.rotation.y = rotationRef.current;
    }
    
    // Add subtle floating animation
    if (modelRef.current) {
      modelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });
  
  // Handle mesh hover
  
  // Handle mesh click
  const handleMeshClick = (meshName: string) => {
    if (!interactive) return;
    
    // Find the corresponding pattern
    const patternMatch = modelInfo.patterns.find(
      pattern => meshName.includes(pattern.id)
    );
    
    if (patternMatch) {
      // Toggle selected state
      selectPattern(selectedPattern?.id === patternMatch.id ? null : patternMatch.id);
      
      // Show info popup if selecting a pattern
      if (selectedPattern?.id !== patternMatch.id) {
        setTimeout(() => {
          setShowPatternInfo(true);
        }, 500);
      }
      
      // Stop auto-rotation when a pattern is selected
      setIsAutoRotating(selectedPattern?.id === patternMatch.id ? false : autoRotate);
      
      // Animate focus on the clicked part
      if (modelRef.current) {
        // Calculate position to focus on
        const targetPosition = new Vector3(...patternMatch.position);
        
        // Rotate model to face camera
        const targetRotation = Math.atan2(
          camera.position.x - targetPosition.x,
          camera.position.z - targetPosition.z
        );
        
        // Animate to focus
        gsap.to(modelRef.current.rotation, {
          y: targetRotation,
          duration: 1,
          ease: 'power2.out',
        });
      }
    }
  };
  
  // Handle hotspot click
  
  // Reset model
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetModel = () => {
    if (!modelRef.current) return;
    
    // Reset rotation
    gsap.to(modelRef.current.rotation, {
      x: rotation[0],
      y: rotation[1],
      z: rotation[2],
      duration: 0.8,
      ease: 'power2.out',
    });
    
    // Reset position
    gsap.to(modelRef.current.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: 0.8,
      ease: 'power2.out',
    });
    
    // Reset state
    selectPattern(null);
    setIsAutoRotating(autoRotate);
  };
  
  // Expose reset method to parent components
  React.useImperativeHandle(
    ref,
    () => ({
      reset: resetModel,
    }),
    [resetModel]
  );
  
  // Pointer events for interactivity - raycasting on mobile is handled in ARViewer
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!interactive || !modelRef.current) return;
      
      // Raycast to check if a model part was clicked
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      
      raycaster.setFromCamera(mouse, camera);
      
      const intersects = raycaster.intersectObjects(modelRef.current.children, true);
      
      if (intersects.length > 0) {
        const mesh = intersects[0].object as Mesh;
        handleMeshClick(mesh.name);
      }
    };
    
    window.addEventListener('pointerdown', handlePointerDown);
    
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, camera]);
  
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]} ref={modelRef}>
      {/* Interactive model hotspots */}
      {interactive && <ModelHotspots modelRef={modelRef} />}
    </group>
  );
});

export default InteractiveModel;