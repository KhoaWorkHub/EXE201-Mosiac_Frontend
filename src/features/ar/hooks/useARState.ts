import { useEffect, useState } from 'react';
import useARStore from '../store/arStore';

/**
 * Hook to manage AR state and camera permissions
 */
export const useARState = () => {
  const {
    hasCameraPermission,
    cameraError,
    isARReady,
    isModelLoaded,
    loadingProgress,
    setCameraPermission,
    setCameraError,
    setARReady,
    setModelLoaded,
    setLoadingProgress,
  } = useARStore();
  
  const [arSupported, setARSupported] = useState<boolean | null>(null);
  
  // Check if AR is supported
  useEffect(() => {
    const checkARSupport = async () => {
      // Basic check for device capabilities
      const hasWebGL = () => {
        try {
          const canvas = document.createElement('canvas');
          return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
          );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          return false;
        }
      };
      
      // Check for required capabilities
      const isSupported =
        // Need WebGL
        hasWebGL() &&
        // Need camera access
        'mediaDevices' in navigator &&
        'getUserMedia' in navigator.mediaDevices &&
        // Either secure context or localhost
        (window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1');
      
      setARSupported(isSupported);
    };
    
    checkARSupport();
  }, []);
  
  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      // Request camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer back camera
        },
      });
      
      // Stop tracks immediately, we just needed the permission
      stream.getTracks().forEach(track => track.stop());
      
      setCameraPermission(true);
      return true;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      
      // Set appropriate error message
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          setCameraError('Camera access was denied. Please grant permission to use AR.');
        } else if (error.name === 'NotFoundError') {
          setCameraError('No camera found on this device.');
        } else {
          setCameraError(`Camera error: ${error.message}`);
        }
      } else {
        setCameraError('Unknown error accessing camera.');
      }
      
      setCameraPermission(false);
      return false;
    }
  };
  
  // Function to initialize AR
  const initializeAR = async () => {
    if (!hasCameraPermission) {
      const granted = await requestCameraPermission();
      if (!granted) return false;
    }
    
    setARReady(true);
    return true;
  };
  
  // Track loading progress between 0-100
  const updateLoadingProgress = (progress: number) => {
    setLoadingProgress(Math.min(100, Math.max(0, progress)));
  };
  
  // Mark model as loaded
  const completeModelLoading = () => {
    setLoadingProgress(100);
    setModelLoaded(true);
  };
  
  return {
    arSupported,
    hasCameraPermission,
    cameraError,
    isARReady,
    isModelLoaded,
    loadingProgress,
    requestCameraPermission,
    initializeAR,
    updateLoadingProgress,
    completeModelLoading,
  };
};

export default useARState;