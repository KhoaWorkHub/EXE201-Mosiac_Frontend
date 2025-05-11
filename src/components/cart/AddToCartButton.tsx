import React, { useState } from 'react';
import { Button, notification } from 'antd';
import { ShoppingCartOutlined, CheckOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';
import type { ProductResponse, ProductVariantResponse } from '@/types/product.types';
import type { UUID } from 'crypto';

interface AddToCartButtonProps {
  product: ProductResponse;
  variant?: ProductVariantResponse | null;
  quantity?: number;
  showText?: boolean;
  size?: 'small' | 'middle' | 'large';
  block?: boolean;
  className?: string;
  onSuccess?: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = null,
  quantity = 1,
  showText = true,
  size = 'middle',
  block = false,
  className = '',
  onSuccess,
}) => {
  const { t } = useTranslation(['product', 'common', 'cart']);
  const { addToCart, state } = useCart();
  const [success, setSuccess] = useState(false);
  
  const isInStock = () => {
    if (variant) {
      return variant.stockQuantity > 0;
    }
    return product.stockQuantity > 0;
  };
  
  const handleAddToCart = async () => {
    if (!isInStock()) {
      notification.error({
        message: t('product:product_details.out_of_stock'),
        placement: 'bottomRight',
      });
      return;
    }
    
    try {
      await addToCart({
        productId: product.id as UUID,
        variantId: variant?.id as UUID | undefined,
        quantity,
      });
      
      // Visual feedback
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      
      // Emit the onSuccess callback which will trigger the CartNotification in parent component
      if (onSuccess) {
        onSuccess();
      }
      
      // Also show a mini notification for immediate feedback
      notification.success({
        message: t('cart:notifications.item_added'),
        description: (
          <div className="flex items-center mt-2">
            <img 
              src={product.images?.[0]?.imageUrl || '/placeholder-product.jpg'} 
              alt={product.name} 
              className="w-12 h-12 object-cover rounded mr-3" 
            />
            <div>
              <p className="font-medium">{product.name}</p>
              {variant && <p className="text-xs text-gray-500">{variant.name}</p>}
              <p className="text-sm mt-1">{t('product:product_details.quantity')}: {quantity}</p>
            </div>
          </div>
        ),
        placement: 'bottomRight',
        duration: 3,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      notification.error({
        message: t('cart:notifications.error_adding'),
        description: 'Failed to add item to cart',
        placement: 'bottomRight',
      });
    }
  };
  
  return (
    <Button
      type="primary"
      size={size}
      icon={
        <AnimatePresence mode="wait">
          {success ? (
            <motion.span
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CheckOutlined />
            </motion.span>
          ) : (
            <motion.span
              key="cart"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ShoppingCartOutlined />
            </motion.span>
          )}
        </AnimatePresence>
      }
      onClick={handleAddToCart}
      disabled={!isInStock() || state.itemBeingAdded}
      loading={state.itemBeingAdded}
      block={block}
      className={`flex items-center justify-center ${className} ${
        success ? 'bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600' : ''
      }`}
    >
      {showText && (
        <span className="ml-1">
          {success ? t('cart:notifications.added') : t('common:actions.add_to_cart')}
        </span>
      )}
    </Button>
  );
};

export default AddToCartButton;