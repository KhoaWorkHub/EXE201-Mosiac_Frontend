import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartOutlined } from '@ant-design/icons';

interface AddToCartAnimationProps {
  sourceRef: React.RefObject<HTMLElement>;
  destinationRef: React.RefObject<HTMLElement>;
  imageUrl?: string;
  animate: boolean;
  onComplete: () => void;
}

const AddToCartAnimation: React.FC<AddToCartAnimationProps> = ({
  sourceRef,
  destinationRef,
  imageUrl,
  animate,
  onComplete,
}) => {
  const [coords, setCoords] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  useEffect(() => {
    if (animate && sourceRef.current && destinationRef.current) {
      const sourceRect = sourceRef.current.getBoundingClientRect();
      const destRect = destinationRef.current.getBoundingClientRect();

      setCoords({
        startX: sourceRect.x + sourceRect.width / 2,
        startY: sourceRect.y + sourceRect.height / 2,
        endX: destRect.x + destRect.width / 2,
        endY: destRect.y + destRect.height / 2,
      });
    } else {
      setCoords(null);
    }
  }, [animate, sourceRef, destinationRef]);

  return (
    <AnimatePresence>
      {animate && coords && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
          <motion.div
            initial={{ 
              x: coords.startX, 
              y: coords.startY, 
              scale: 1,
              opacity: 1 
            }}
            animate={{
              x: coords.endX,
              y: coords.endY,
              scale: 0.3,
              opacity: 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 250,
              damping: 25,
              duration: 0.8,
            }}
            onAnimationComplete={onComplete}
            style={{
              position: 'absolute',
              transformOrigin: 'center center',
            }}
          >
            {imageUrl ? (
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-lg border-2 border-primary">
                <img src={imageUrl} alt="Product" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                <ShoppingCartOutlined style={{ fontSize: 20 }} />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartAnimation;