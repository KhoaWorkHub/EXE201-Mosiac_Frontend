import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  Environment, 
  OrbitControls, 
  PerspectiveCamera, 
  SoftShadows, 
  useProgress 
} from '@react-three/drei';
import AROnboarding from './AROnboarding';
import DeviceOrientationHelper from './DeviceOrientationHelper';
import ARDebugPanel from './ARDebugPanel'; // Added import for ARDebugPanel

// Declare global MindAR types
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MindAR: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MindARThree: any;
  }
}
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import { gsap } from 'gsap';
import useARStore from '../store/arStore';
import InteractiveModel from './InteractiveModel';
import CulturalInfoPopup from './CulturalInfoPopUp';
import ARControls from './ARControls';

// Enable soft shadows for better visuals
SoftShadows({});

// Loading progress component
const LoadingScreen: React.FC = () => {
  const { progress } = useProgress();
  const { loadingProgress } = useARStore();
  const finalProgress = Math.max(progress, loadingProgress);
  
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        zIndex: 100,
      }}
    >
      <h2 style={{ marginBottom: '20px', fontWeight: 500 }}>Loading AR Experience</h2>
      <div
        style={{
          width: '80%',
          maxWidth: '300px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${finalProgress}%`,
            height: '100%',
            background: '#005c4e',
            borderRadius: '4px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p style={{ marginTop: '10px', fontSize: '14px' }}>
        {Math.round(finalProgress)}% Loaded
      </p>
    </div>
  );
};

// Camera permission component
const CameraPermission: React.FC<{ onRequestCamera: () => void }> = ({ onRequestCamera }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '20px',
        zIndex: 100,
      }}
    >
      <div style={{ maxWidth: '500px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px', fontWeight: 500 }}>Camera Access Required</h2>
        <p style={{ marginBottom: '30px', lineHeight: 1.5 }}>
          This AR experience requires access to your camera to recognize QR codes and display 3D models of traditional Vietnamese clothing.
        </p>
        <button
          onClick={onRequestCamera}
          style={{
            padding: '12px 24px',
            background: '#005c4e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Grant Camera Access
        </button>
      </div>
    </div>
  );
};

// Error screen component
const ErrorScreen: React.FC<{ message: string; onRetry: () => void }> = ({ 
  message, 
  onRetry 
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '20px',
        zIndex: 100,
      }}
    >
      <div style={{ maxWidth: '500px', textAlign: 'center' }}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: '20px' }}
        >
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
          <path d="M12 8V12M12 16H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h2 style={{ marginBottom: '20px', fontWeight: 500 }}>Error</h2>
        <p style={{ marginBottom: '30px', lineHeight: '1.5' }}>{message}</p>
        <button
          onClick={onRetry}
          style={{
            padding: '12px 24px',
            background: '#005c4e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

interface ARViewerProps {
  targetImage: string;  // URL to the target image for tracking
  modelPath: string;    // Path to the 3D model
  onClose?: () => void; // Callback when AR experience is closed
}

// Main AR Viewer component
const ARViewer: React.FC<ARViewerProps> = ({
  targetImage,
  modelPath,
  onClose,
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera>(null!) as React.RefObject<THREE.Camera>;
  const modelRef = useRef<THREE.Group>(null); // Changed to Group to match ARDebugPanel expectation
  
  // AR controller reference
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arControllerRef = useRef<any>(null);
  
  // State for the 3D model
  const [modelScale, setModelScale] = useState(0.5);
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [autoRotate, setAutoRotate] = useState(true);
  
  // Flags and status
  const [showCanvas, setShowCanvas] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showOrientationHelper, setShowOrientationHelper] = useState(false);
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === 'development'); // Added state for debug mode
  
  // AR store
  const {
    isARReady,
    isModelLoaded,
    hasCameraPermission,
    setCameraPermission,
    setCameraError,
    setARReady,
    selectedPattern,
  } = useARStore();

  // Check if tutorial has been viewed
  useEffect(() => {
    // Check if this is the user's first time using AR
    const hasTutorialBeenViewed = localStorage.getItem('ar_tutorial_viewed');
    setShowTutorial(!hasTutorialBeenViewed);
  }, []);

  // Check for mobile device to show orientation helper
  useEffect(() => {
    // Show orientation helper only on mobile devices and after AR is ready
    if (isARReady && isModelLoaded) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setShowOrientationHelper(isMobile);
    }
  }, [isARReady, isModelLoaded]);

  // Setup AR and camera
  useEffect(() => {
    const setupAR = async () => {
      try {
        if (!containerRef.current) return;
        
        // Create AR controller
        const MindARThree = window.MindARThree;

        arControllerRef.current = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: targetImage,
          uiLoading: '#loader',
          uiScanning: '#scanning',
          filterMinCF: 0.001,
          filterBeta: 0.01,
        });
        
        // Get refs to video, scene, and camera
        const { scene, camera } = arControllerRef.current;
        videoRef.current = arControllerRef.current.video;
        sceneRef.current = scene;
        cameraRef.current = camera;
        
        // Setup lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 0);
        scene.add(directionalLight);
        
        // Add a point light to highlight details
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(0, 5, 0);
        scene.add(pointLight);
        
        // Initialize AR experience
        await arControllerRef.current.start();
        setARReady(true);
        setShowCanvas(true);
        
        // Cleanup function
        return () => {
          if (arControllerRef.current) {
            arControllerRef.current.stop();
          }
        };
      } catch (err) {
        console.error('Error setting up AR:', err);
        setError('Failed to initialize AR experience. Please try again.');
      }
    };
    
    if (hasCameraPermission && !isARReady) {
      setupAR();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCameraPermission, isARReady, targetImage]);

  // Handle camera permission request
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop tracks immediately
      setCameraPermission(true);
    } catch (err) {
      console.error('Camera permission error:', err);
      setCameraPermission(false);
      setCameraError('Camera access was denied. Please grant permission to use the AR feature.');
    }
  };
  
  // Handle rotation toggle
  const handleRotateToggle = () => {
    setAutoRotate(!autoRotate);
  };
  
  // Handle model reset
  const handleModelReset = () => {
    setModelScale(0.5);
    setModelRotation([0, 0, 0]);
    setAutoRotate(true);
    
    // Animate reset
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0.5,
        duration: 0.2,
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 1,
            duration: 0.2,
          });
        },
      });
    }
  };
  
  // Handle zoom
  const handleZoom = (factor: number) => {
    setModelScale(prev => Math.min(Math.max(prev * factor, 0.2), 2.0));
  };
  
  // Retry on error
  const handleRetry = () => {
    setError(null);
    setCameraPermission(false);
  };
  
  // Handle tutorial completion and skip
  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
  };

  // Handle orientation helper dismiss
  const handleOrientationHelperDismiss = () => {
    setShowOrientationHelper(false);
  };

  // Handle debug panel controls
  const handleAutoRotateChange = (value: boolean) => {
    setAutoRotate(value);
  };

  const handleModelScaleChange = (value: number) => {
    setModelScale(value);
  };
  
  // Determine what to render based on state
  const renderContent = () => {
    if (error) {
      return <ErrorScreen message={error} onRetry={handleRetry} />;
    }
    
    if (!hasCameraPermission) {
      return <CameraPermission onRequestCamera={requestCameraPermission} />;
    }
    
    if (!isARReady || !isModelLoaded) {
      return <LoadingScreen />;
    }
    
    return null;
  };
  
  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* This div will be used by MindAR to mount the video */}
      <div id="ar-container" style={{ width: '100%', height: '100%' }} />
      
      {/* Loading and scanning UI */}
      <div id="loader" style={{ display: 'none' }} />
      <div id="scanning" style={{ display: 'none' }} />
      
      {/* Three.js Canvas for our 3D model */}
      {showCanvas && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
          }}
        >
          <Canvas shadows>
            {/* Camera setup */}
            <PerspectiveCamera
              makeDefault
              position={[0, 0, 5]}
              fov={50}
              near={0.1}
              far={1000}
            />
            
            {/* Environment and lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.6} castShadow />
            <directionalLight
              position={[0, 10, 0]}
              intensity={0.8}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            
            {/* HDRI environment for realistic lighting */}
            <Environment preset="sunset" background={false} />
            
            {/* 3D model */}
            <InteractiveModel
              modelPath={modelPath}
              scale={modelScale}
              rotation={modelRotation}
              position={[0, -0.5, 0]}
              interactive={true}
              //ref={modelRef} // Using ref attribute for forwarding
            />
            
            {/* Post-processing effects */}
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                height={300}
                opacity={0.5}
              />
              <DepthOfField
                focusDistance={0}
                focalLength={0.02}
                bokehScale={2}
                height={480}
              />
            </EffectComposer>
            
            {/* Camera controls */}
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              autoRotate={autoRotate && !selectedPattern}
              autoRotateSpeed={0.5}
              target={[0, 0, 0]}
            />
          </Canvas>
        </div>
      )}
      
      {/* UI Controls */}
      <ARControls 
        onClose={onClose}
        onReset={handleModelReset}
        onRotate={handleRotateToggle}
        onZoom={handleZoom}
      />
      
      {/* Cultural info popup */}
      <CulturalInfoPopup />
      
      {/* Status message for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
          }}
        >
          AR Ready: {isARReady ? 'Yes' : 'No'} | Model Loaded: {isModelLoaded ? 'Yes' : 'No'}
        </div>
      )}
      
      {/* Overlay content based on state */}
      {renderContent()}
      
      {/* Tutorial overlay */}
      <AROnboarding 
        visible={showTutorial && isARReady && isModelLoaded} 
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
      />
      
      {/* Device orientation helper */}
      {showOrientationHelper && (
        <DeviceOrientationHelper onDismiss={handleOrientationHelperDismiss} />
      )}
      
      {/* Debug panel for development */}
      <ARDebugPanel
        modelRef={modelRef as React.RefObject<THREE.Group>}
        cameraRef={cameraRef}
        visible={showDebug}
        onClose={() => setShowDebug(false)}
        setAutoRotate={handleAutoRotateChange}
        setModelScale={handleModelScaleChange}
      />
    </div>
  );
};

export default ARViewer;