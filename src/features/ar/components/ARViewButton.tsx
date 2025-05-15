import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Badge, Popover } from 'antd';
import { MobileOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ARViewButtonProps {
  productId: string;
  region?: string;
  className?: string;
  size?: 'small' | 'middle' | 'large';
}

const ARViewButton: React.FC<ARViewButtonProps> = ({
  productId,
  region = 'danang', // Default to Da Nang as specified
  className = '',
  size = 'middle',
}) => {
  const navigate = useNavigate();
  const [isARSupported, setIsARSupported] = useState<boolean>(false);
  const [hasShownIntro, setHasShownIntro] = useState<boolean>(false);
  
  // Check if AR is supported on this device
  useEffect(() => {
    const checkARSupport = () => {
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
      
      // Check if device supports AR (basic check)
      const supported = 
        hasWebGL() && 
        'mediaDevices' in navigator && 
        'getUserMedia' in navigator.mediaDevices &&
        (window.isSecureContext || location.hostname === 'localhost');
      
      setIsARSupported(supported);
    };
    
    checkARSupport();
    
    // Check if first-time user
    const hasIntroBeenShown = localStorage.getItem('ar_intro_shown');
    setHasShownIntro(!!hasIntroBeenShown);
  }, []);
  
  const handleARLaunch = () => {
    // Mark that intro has been shown
    if (!hasShownIntro) {
      localStorage.setItem('ar_intro_shown', 'true');
      setHasShownIntro(true);
    }
    
    // Navigate to AR experience with region info
    navigate(`/ar/${productId}`, { 
      state: { 
        region: region,
        from: window.location.pathname 
      } 
    });
  };
  
  // AR introduction content
  const arIntroContent = (
    <div style={{ maxWidth: 280 }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: 16 }}>Experience in AR</h4>
      <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
        View this traditional clothing in augmented reality to explore its cultural patterns and details.
      </p>
      <img 
        src="/assets/ar-preview.jpg" 
        alt="AR Preview" 
        style={{ width: '100%', borderRadius: 8, marginBottom: 8 }}
      />
      <Button type="primary" size="small" onClick={handleARLaunch}>
        Try Now
      </Button>
    </div>
  );
  
  // If AR is not supported, don't render the button
  if (!isARSupported) return null;
  
  // Feature intro popup for first-time users
  if (!hasShownIntro) {
    return (
      <Popover 
        content={arIntroContent}
        title="New Feature: AR View"
        open={true}
        placement="left"
      >
        <Badge dot offset={[-5, 5]}>
          <Button
            type="default"
            icon={<MobileOutlined />}
            className={`ar-view-button ${className}`}
            size={size}
            onClick={handleARLaunch}
          >
            AR View
          </Button>
        </Badge>
      </Popover>
    );
  }
  
  // Regular button for returning users
  return (
    <Tooltip title="View in augmented reality">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          type="default"
          icon={<MobileOutlined />}
          className={`ar-view-button ${className}`}
          size={size}
          onClick={handleARLaunch}
        >
          AR View
        </Button>
      </motion.div>
    </Tooltip>
  );
};

// Help popover explaining AR functionality
export const ARHelpButton: React.FC = () => {
  return (
    <Popover
      content={
        <div style={{ maxWidth: 250 }}>
          <p style={{ margin: '0 0 8px 0', fontSize: 14 }}>
            AR View uses your device's camera to display a 3D model of traditional clothing with interactive cultural information.
          </p>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li>Works best in good lighting</li>
            <li>Requires camera permission</li>
            <li>Touch patterns to learn about their cultural significance</li>
          </ul>
        </div>
      }
      title="About AR View"
      trigger="click"
      placement="bottom"
    >
      <Button
        type="text"
        icon={<QuestionCircleOutlined />}
        size="small"
      />
    </Popover>
  );
};

export default ARViewButton;