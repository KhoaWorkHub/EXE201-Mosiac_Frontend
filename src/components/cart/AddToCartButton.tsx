import React, { useState, useEffect } from 'react';
import { Button, notification, Tooltip, Badge } from 'antd';
import { ShoppingCartOutlined, CheckOutlined, WarningOutlined } from '@ant-design/icons';
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
  const [currentQtyInCart, setCurrentQtyInCart] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  // Get stock quantity from product or variant
  const getStockQuantity = () => {
    if (variant) {
      return variant.stockQuantity;
    }
    return product.stockQuantity || 0;
  };
  
  // Check if we can add more of this product
  const canAddMore = () => {
    const stockQty = getStockQuantity();
    return stockQty > currentQtyInCart && isInStock();
  };
  
  // Check if product is in stock
  const isInStock = () => {
    if (variant) {
      return variant.stockQuantity > 0;
    }
    return product.stockQuantity > 0;
  };
  
  // Check current quantity in cart
  useEffect(() => {
    if (state.cart && product) {
      // Find the item in cart - need to match both product and variant if present
      const cartItem = state.cart.items.find(item => {
        if (variant) {
          return item.productId === product.id && item.variantId === variant.id;
        }
        return item.productId === product.id && !item.variantId;
      });
      
      setCurrentQtyInCart(cartItem?.quantity || 0);
    }
  }, [state.cart, product, variant]);
  
  const handleAddToCart = async () => {
    if (!isInStock()) {
      notification.error({
        message: t('product:product_details.out_of_stock'),
        placement: 'bottomRight',
      });
      return;
    }
    
    if (!canAddMore()) {
      notification.warning({
        message: t('cart:notifications.max_quantity_reached'),
        description: t('cart:notifications.only_x_in_stock', { count: getStockQuantity() }),
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
      
      // Update the local cart quantity counter
      setCurrentQtyInCart(prev => prev + quantity);
      
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
              {currentQtyInCart + quantity >= getStockQuantity() && (
                <p className="text-xs text-yellow-500 mt-1 flex items-center">
                  <WarningOutlined className="mr-1" />
                  {t('cart:notifications.max_quantity_reached')}
                </p>
              )}
            </div>
          </div>
        ),
        placement: 'bottomRight',
        duration: 4,
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
  
  // Get appropriate button tooltip text
  const getTooltipText = () => {
    if (!isInStock()) {
      return t('product:product_details.out_of_stock');
    }
    
    if (!canAddMore()) {
      return t('cart:notifications.max_quantity_reached');
    }
    
    if (currentQtyInCart > 0) {
      return `${currentQtyInCart} ${t('cart:cart.in_cart')} (${t('cart:product_details.remaining_stock', { count: getStockQuantity() - currentQtyInCart })})`;
    }
    
    return t('common:actions.add_to_cart');
  };
  
  return (
    <Tooltip title={getTooltipText()} visible={isHovering || !canAddMore()} placement="top">
      <Badge count={currentQtyInCart > 0 ? currentQtyInCart : 0} offset={[0, 0]} size="small">
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
          disabled={!isInStock() || !canAddMore() || state.itemBeingAdded}
          loading={state.itemBeingAdded}
          block={block}
          className={`flex items-center justify-center ${className} ${
            success ? 'bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600' : ''
          } ${!canAddMore() && isInStock() ? 'bg-yellow-500 border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600' : ''}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {showText && (
            <span className="ml-1">
              {success ? t('cart:notifications.added') : 
               !canAddMore() && isInStock() ? t('cart:notifications.max_quantity_reached') : 
               t('common:actions.add_to_cart')}
            </span>
          )}
        </Button>
      </Badge>
    </Tooltip>
  );
};

export default AddToCartButton;