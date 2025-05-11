// src/components/cart/CartButton.tsx
import React, { useEffect, useMemo } from 'react';
import { Button, Badge, Popover, Empty, Spin, Divider } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/formatters';

interface CartButtonProps {
  className?: string;
}

const CartButton: React.FC<CartButtonProps> = ({ className = '' }) => {
  const { t } = useTranslation(['cart', 'common']);
  const { state, fetchCart, removeItem } = useCart();
  const { cart, loading, itemBeingRemoved } = state;
  
  useEffect(() => {
    fetchCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Calculate total items in cart manually (since API returns totalItems as null)
  const totalItemsCount = useMemo(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return 0;
    }
    
    // Sum up the quantity of all items in cart
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);
  
  const handleRemoveItem = async (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await removeItem(itemId);
  };
  
  const cartContent = (
    <div className="w-80 max-h-96 overflow-auto p-2">
      <div className="mb-3">
        <h3 className="text-lg font-semibold dark:text-white flex items-center">
          {t('cart:cart.title')} 
          {totalItemsCount > 0 && (
            <span className="text-sm font-normal ml-2">
              ({totalItemsCount} {totalItemsCount === 1 ? t('cart:cart.item') : t('cart:cart.items')})
            </span>
          )}
        </h3>
      </div>
      
      {loading ? (
        <div className="py-4 flex justify-center">
          <Spin size="small" />
        </div>
      ) : !cart || !cart.items || cart.items.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description={t('cart:cart.empty')}
        />
      ) : (
        <>
          <AnimatePresence>
            {cart.items.slice(0, 3).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center py-2 border-b dark:border-gray-700">
                  <div className="w-12 h-12 overflow-hidden rounded mr-3">
                    <img 
                      src={item.productImage || '/placeholder-product.jpg'} 
                      alt={item.productName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <Link to={`/products/${item.productSlug}`} className="text-sm font-medium dark:text-white hover:text-primary dark:hover:text-primary truncate block">
                      {item.productName}
                    </Link>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.quantity} × {formatCurrency(item.price)}
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    className="ml-2"
                    onClick={(e) => handleRemoveItem(item.id, e)}
                    loading={itemBeingRemoved === item.id}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {cart.items.length > 3 && (
            <div className="text-center text-sm my-2 text-gray-500 dark:text-gray-400">
              + {cart.items.length - 3} {t('common:actions.more')} {t('cart:cart.items')}
            </div>
          )}
          
          <Divider className="my-3" />
          
          <div className="flex justify-between font-medium mb-3">
            <span className="dark:text-white">{t('cart:cart.subtotal')}</span>
            <span className="text-primary">
              {formatCurrency(cart.totalAmount || cart.items.reduce((total, item) => total + item.subtotal, 0))}
            </span>
          </div>
          
          <div className="flex flex-col gap-2">
            <Link to="/cart">
              <Button type="primary" block className="flex items-center justify-center">
                {t('actions.view_cart')}
                <RightOutlined className="ml-1" />
              </Button>
            </Link>
            <Link to="/checkout">
              <Button block className="flex items-center justify-center">
                {t('cart:cart.checkout')}
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
  
  return (
    <Popover 
      content={cartContent} 
      title={null}
      placement="bottomRight"
      trigger="click"
      arrow={{ pointAtCenter: true }}
      overlayClassName="cart-popover"
    >
      <Badge 
        count={totalItemsCount} 
        showZero={false} 
        size="small" 
        className={className}
        offset={[-2, 6]}
      >
        <Button 
          type="text" 
          icon={<ShoppingCartOutlined className="text-xl" />}
          className={`hover:bg-transparent transition-all ${
            state.loading ? 'animate-pulse' : ''
          }`}
        />
      </Badge>
    </Popover>
  );
};

export default CartButton;