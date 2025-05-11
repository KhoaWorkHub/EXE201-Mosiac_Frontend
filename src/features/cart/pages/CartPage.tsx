import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Divider, 
  Empty, 
  Spin, 
  Breadcrumb,
  Popconfirm
} from 'antd';
import { 
  ShoppingCartOutlined, 
  ShoppingOutlined,
  RightOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import CartItem from '@/components/cart/CartItem';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/formatters';

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
  const { t } = useTranslation(['cart', 'common']);
  const { state, fetchCart, updateQuantity, removeItem, clearCart } = useCart();
  const { cart, loading, itemBeingUpdated, itemBeingRemoved } = state;
  
  useEffect(() => {
    fetchCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity > 0) {
      updateQuantity(itemId, quantity);
    }
  };
  
  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };
  
  const handleClearCart = () => {
    clearCart();
  };
  
  const cartIsEmpty = !cart || !cart.items || cart.items.length === 0;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Link to="/">{t('common:nav.home')}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t('cart:cart.title')}</Breadcrumb.Item>
        </Breadcrumb>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <ShoppingCartOutlined className="text-2xl text-primary mr-3" />
              <Title level={2} className="m-0 dark:text-white">
                {t('cart:cart.title')}
              </Title>
              <Text className="ml-3 text-gray-500 dark:text-gray-400">
                {cart?.totalItems ? `(${cart.totalItems} ${cart.totalItems === 1 ? t('cart:cart.item') : t('cart:cart.items')})` : ''}
              </Text>
            </div>
            
            {loading && !itemBeingUpdated && !itemBeingRemoved ? (
              <div className="py-12 flex justify-center">
                <Spin size="large" />
              </div>
            ) : cartIsEmpty ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="py-12 text-center"
              >
                <Empty
                  image={<ShoppingOutlined style={{ fontSize: 64 }} className="text-gray-300 dark:text-gray-600" />}
                  description={
                    <span className="text-gray-500 dark:text-gray-400 text-lg">
                      {t('cart:cart.empty')}
                    </span>
                  }
                />
                <Button 
                  type="primary" 
                  size="large" 
                  className="mt-6 flex items-center mx-auto"
                >
                  <Link to="/products" className="flex items-center">
                    {t('cart:cart.start_shopping')}
                    <RightOutlined className="ml-1" />
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <div>
                {/* Cart Items */}
                <motion.div
                  className="mb-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {cart?.items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                        loading={itemBeingUpdated === item.id}
                        isRemoving={itemBeingRemoved === item.id}
                      />
                    ))}
                  </AnimatePresence>
                  
                  {/* Clear Cart Button */}
                  <div className="mt-4 flex justify-end">
                    <Popconfirm
                      title={t('cart:cart.clear_cart')}
                      description={t('cart:cart.clear_confirm')}
                      onConfirm={handleClearCart}
                      okText={t('common:actions.yes')}
                      cancelText={t('common:actions.no')}
                      placement="topRight"
                    >
                      <Button 
                        danger 
                        icon={<DeleteOutlined />}
                        className="flex items-center"
                      >
                        {t('cart:cart.clear_cart')}
                      </Button>
                    </Popconfirm>
                  </div>
                </motion.div>
                
                {/* Cart Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8"
                >
                  <Title level={4} className="mb-4 dark:text-white">
                    {t('cart:cart.summary')}
                  </Title>
                  
                  <div className="mb-4">
                    <div className="flex justify-between py-2">
                      <Text className="dark:text-gray-300">{t('cart:cart.subtotal')}</Text>
                      <Text className="dark:text-white">
                        {formatCurrency(cart?.totalAmount || 0)}
                      </Text>
                    </div>
                    
                    <div className="flex justify-between py-2">
                      <Text className="dark:text-gray-300">{t('cart:cart.shipping')}</Text>
                      <Text className="dark:text-white">
                        {formatCurrency(0)} {/* Calculate shipping based on your business rules */}
                      </Text>
                    </div>
                    
                    <div className="flex justify-between py-2">
                      <Text className="dark:text-gray-300">{t('cart:cart.tax')}</Text>
                      <Text className="dark:text-white">
                        {formatCurrency(0)} {/* Calculate tax based on your business rules */}
                      </Text>
                    </div>
                    
                    <Divider className="my-3" />
                    
                    <div className="flex justify-between py-2">
                      <Text strong className="text-lg dark:text-white">
                        {t('cart:cart.total')}
                      </Text>
                      <Text strong className="text-xl text-primary">
                        {formatCurrency(cart?.totalAmount || 0)}
                      </Text>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="primary"
                      size="large"
                      block
                      className="flex items-center justify-center"
                    >
                      <Link to="/checkout" className="flex items-center justify-center">
                        {t('cart:cart.checkout')} <RightOutlined className="ml-1" />
                      </Link>
                    </Button>
                    
                    <Button size="large" block className="flex items-center justify-center">
                      <Link to="/products" className="flex items-center justify-center">
                        {t('cart:cart.continue_shopping')}
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;