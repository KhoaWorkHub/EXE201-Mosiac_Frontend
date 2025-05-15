import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import useARStore from '../store/arStore';

const CulturalInfoPopUp: React.FC = () => {
  const { selectedPattern, setShowPatternInfo, showPatternInfo } = useARStore();
  const popupRef = useRef<HTMLDivElement>(null);
  
  // Animate popup appearance
  useEffect(() => {
    if (popupRef.current) {
      if (selectedPattern && showPatternInfo) {
        // Animate in
        gsap.fromTo(
          popupRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      } else {
        // Animate out
        gsap.to(popupRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    }
  }, [selectedPattern, showPatternInfo]);
  
  // If no pattern is selected or popup is hidden, return null
  if (!selectedPattern || !showPatternInfo) return null;
  
  return (
    <div 
      ref={popupRef}
      className="cultural-info-popup"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
      }}
    >
      <div className="popup-header" style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <div className="pattern-thumbnail" style={{
          width: '60px',
          height: '60px',
          borderRadius: '8px',
          overflow: 'hidden',
          marginRight: '15px',
          flexShrink: 0,
        }}>
          <img 
            src={selectedPattern.imageUrl} 
            alt={selectedPattern.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        
        <div>
          <h3 style={{
            margin: '0 0 5px 0',
            fontSize: '18px',
            fontWeight: 600,
            color: '#005c4e'
          }}>
            {selectedPattern.name}
          </h3>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#666'
          }}>
            {selectedPattern.description}
          </p>
        </div>
        
        <button
          onClick={() => setShowPatternInfo(false)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#999'
          }}
        >
          ×
        </button>
      </div>
      
      <div className="cultural-significance" style={{
        marginTop: '15px',
        padding: '12px',
        backgroundColor: 'rgba(0, 92, 78, 0.08)',
        borderRadius: '8px',
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#333'
      }}>
        <h4 style={{
          margin: '0 0 8px 0',
          fontSize: '16px',
          fontWeight: 500,
          color: '#005c4e'
        }}>
          Cultural Significance
        </h4>
        <p style={{ margin: 0 }}>
          {selectedPattern.culturalSignificance}
        </p>
      </div>
      
      <div className="action-buttons" style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px'
      }}>
        <button 
          style={{
            padding: '8px 15px',
            backgroundColor: '#005c4e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            flex: '1',
            marginRight: '8px'
          }}
        >
          Learn More
        </button>
        <button 
          style={{
            padding: '8px 15px',
            backgroundColor: 'transparent',
            color: '#005c4e',
            border: '1px solid #005c4e',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            flex: '1',
            marginLeft: '8px'
          }}
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default CulturalInfoPopUp;