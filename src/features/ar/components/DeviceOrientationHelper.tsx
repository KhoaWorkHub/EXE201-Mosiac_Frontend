import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileOutlined, CheckCircleOutlined } from '@ant-design/icons';

interface DeviceOrientationHelperProps {
  onDismiss: () => void;
}

const DeviceOrientationHelper: React.FC<DeviceOrientationHelperProps> = ({ onDismiss }) => {
  const [isCorrectOrientation, setIsCorrectOrientation] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  
  // Track device orientation
  useEffect(() => {
    const checkOrientation = () => {
      // For AR, landscape mode is usually preferred
      const isLandscape = window.innerWidth > window.innerHeight;
      setIsCorrectOrientation(isLandscape);
      
      // Auto-dismiss after a few seconds if in correct orientation
      if (isLandscape) {
        setTimeout(() => {
          setShouldShow(false);
          setTimeout(onDismiss, 500); // Allow exit animation to complete
        }, 3000);
      }
    };
    
    // Check initial orientation
    checkOrientation();
    
    // Listen for orientation changes
    window.addEventListener('resize', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, [onDismiss]);
  
  // Handle manual dismiss
  const handleDismiss = () => {
    setShouldShow(false);
    setTimeout(onDismiss, 500); // Allow exit animation to complete
  };
  
  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed left-4 right-4 bottom-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center">
            <div className="mr-4 text-2xl text-primary">
              <MobileOutlined className={`transform ${isCorrectOrientation ? 'rotate-90' : ''}`} />
            </div>
            <div className="flex-grow">
              <h3 className="text-base font-medium text-gray-800 dark:text-white m-0">
                {isCorrectOrientation ? (
                  <span className="flex items-center">
                    <CheckCircleOutlined className="text-green-500 mr-2" />
                    Perfect! Keep your device in this orientation
                  </span>
                ) : (
                  'For the best AR experience, rotate your device'
                )}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 m-0 mt-1">
                {isCorrectOrientation 
                  ? 'Landscape mode provides a wider field of view'
                  : 'Turning your device sideways provides a wider view of the model'}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeviceOrientationHelper;