import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartOutlined, WarningOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import { useTranslation } from 'react-i18next';

interface AddToCartAnimationProps {
  sourceRef: React.RefObject<HTMLElement>;
  destinationRef: React.RefObject<HTMLElement>;
  imageUrl?: string;
  animate: boolean;
  onComplete: () => void;
  quantity?: number;
  isMaxQuantity?: boolean;
}

const AddToCartAnimation: React.FC<AddToCartAnimationProps> = ({
  sourceRef,
  destinationRef,
  imageUrl,
  animate,
  onComplete,
  quantity = 1,
  isMaxQuantity = false,
}) => {
  const { t } = useTranslation(['cart']);
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
        <>
          {/* Main flying item */}
          <motion.div
            initial={{ 
              x: coords.startX, 
              y: coords.startY, 
              scale: 1,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: coords.endX,
              y: coords.endY,
              scale: 0.3,
              opacity: 0,
              rotate: isMaxQuantity ? [0, -5, 5, -5, 5, 0] : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 250,
              damping: 25,
              duration: 0.8,
              rotate: {
                repeat: isMaxQuantity ? 2 : 0,
                duration: 0.3
              }
            }}
            onAnimationComplete={onComplete}
            style={{
              position: 'fixed',
              transformOrigin: 'center center',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          >
            {imageUrl ? (
              <Badge count={quantity} offset={[-5, 5]}>
                <div className={`w-16 h-16 rounded-full overflow-hidden bg-white shadow-lg border-2 ${isMaxQuantity ? 'border-yellow-500' : 'border-primary'}`}>
                  <img src={imageUrl} alt="Product" className="w-full h-full object-cover" />
                </div>
              </Badge>
            ) : (
              <Badge count={quantity} offset={[-5, 5]}>
                <div className={`w-12 h-12 rounded-full ${isMaxQuantity ? 'bg-yellow-500' : 'bg-primary'} text-white flex items-center justify-center shadow-lg`}>
                  <ShoppingCartOutlined style={{ fontSize: 20 }} />
                </div>
              </Badge>
            )}
          </motion.div>
          
          {/* Max quantity warning message - shown only when reaching max */}
          {isMaxQuantity && (
            <motion.div
              initial={{ 
                x: coords.startX, 
                y: coords.startY - 30, 
                opacity: 0 
              }}
              animate={{
                opacity: 1,
                y: coords.startY - 60,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={{
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 9999,
                transformOrigin: 'center bottom',
              }}
            >
              <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-3 py-1 rounded-full shadow-md flex items-center">
                <WarningOutlined className="mr-1" />
                <span>{t('cart:notifications.max_quantity_reached')}</span>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default AddToCartAnimation;