import React, { useState } from 'react';
import useARStore from '../store/arStore';

interface ARControlsProps {
  onClose?: () => void;
  onReset?: () => void;
  onRotate?: () => void;
  onZoom?: (factor: number) => void;
}

const ARControls: React.FC<ARControlsProps> = ({
  onClose,
  onReset,
  onRotate,
  onZoom,
}) => {
  const { isModelLoaded, selectedPattern, selectPattern, setShowPatternInfo } = useARStore();
  const [isRotating, setIsRotating] = useState(false);
  
  // Handle rotating toggle
  const handleRotateToggle = () => {
    setIsRotating(!isRotating);
    if (onRotate) onRotate();
  };
  
  // Handle pattern selection
  const handlePatternInfoClick = () => {
    if (selectedPattern) {
      setShowPatternInfo(true);
    }
  };
  
  // Handle model reset
  const handleReset = () => {
    selectPattern(null);
    if (onReset) onReset();
  };
  
  // Handle zoom in/out
  const handleZoom = (factor: number) => {
    if (onZoom) onZoom(factor);
  };
  
  return (
    <div 
      className="ar-controls"
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        zIndex: 100,
      }}
    >
      {/* Close button */}
      <button
        className="control-button"
        onClick={onClose}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          cursor: 'pointer',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {/* Info button - only visible when a pattern is selected */}
      {selectedPattern && (
        <button
          className="control-button"
          onClick={handlePatternInfoClick}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 92, 78, 0.9)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2"/>
            <path d="M12 16V12M12 8H12.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}
      
      {/* Only show these controls when the model is loaded */}
      {isModelLoaded && (
        <>
          {/* Rotate toggle */}
          <button
            className={`control-button ${isRotating ? 'active' : ''}`}
            onClick={handleRotateToggle}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: isRotating ? 'rgba(0, 92, 78, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke={isRotating ? 'white' : '#333'} strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 5H21V10" stroke={isRotating ? 'white' : '#333'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Zoom controls */}
          <button
            className="control-button"
            onClick={() => handleZoom(1.1)}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V16M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          <button
            className="control-button"
            onClick={() => handleZoom(0.9)}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          {/* Reset button */}
          <button
            className="control-button"
            onClick={handleReset}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H6M21 12H18M12 3V6M12 21V18M5.63604 5.63604L7.75736 7.75736M18.364 5.63604L16.2426 7.75736M5.63604 18.364L7.75736 16.2426M18.364 18.364L16.2426 16.2426" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default ARControls;