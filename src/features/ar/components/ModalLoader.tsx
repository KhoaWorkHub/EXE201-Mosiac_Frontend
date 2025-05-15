import React, { useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import useARStore from '../store/arStore';

interface ModelLoaderProps {
  modelPath: string;
  draco?: boolean;
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  onLoad?: () => void;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({
  modelPath,
  draco = true,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  onLoad,
}) => {
  const { setLoadingProgress, setModelLoaded } = useARStore();
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // Setup loaders
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Create the GLTF loader
        const gltfLoader = new GLTFLoader();
        
        // Configure Draco loader if needed for compression
        if (draco) {
          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath('/draco/');
          gltfLoader.setDRACOLoader(dracoLoader);
        }
        
        // Progressive loading reporting
        gltfLoader.load(
          modelPath,
          (_gltf) => {
            setModelLoaded(true);
            if (onLoad) onLoad();
          },
          (progress) => {
            const progressPercentage = (progress.loaded / progress.total) * 100;
            setLoadingProgress(progressPercentage);
          },
          (error) => {
            console.error('Error loading model:', error);
            setLoadingError(error instanceof Error ? error.message : 'Unknown error');
          }
        );
      } catch (error) {
        console.error('Error in model loading process:', error);
        setLoadingError(error instanceof Error ? error.message : 'Unknown error');
      }
    };
    
    loadModel();
    
    // Cleanup loader
    return () => {
      // Nothing to clean up for now
    };
  }, [modelPath, draco, setLoadingProgress, setModelLoaded, onLoad]);
  
  const gltf = useLoader(GLTFLoader, modelPath, (loader) => {
    if (draco) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/');
      loader.setDRACOLoader(dracoLoader);
    }
  });
  
  if (loadingError) {
    return (
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }
  
  // Position, scale and rotate the model
  return gltf ? (
    <primitive 
      object={gltf.scene.clone()} 
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    />
  ) : null;
};

export default ModelLoader;