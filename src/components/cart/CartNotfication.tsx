import React, { useState, useEffect } from 'react';
import { Drawer, Typography, Button, Badge } from 'antd';
import { CheckCircleFilled, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/formatters';
import type { ProductResponse } from '@/types/product.types';

const { Title, Text } = Typography;

interface CartNotificationProps {
  open: boolean;
  onClose: () => void;
  product: ProductResponse | null;
  quantity: number;
}

const CartNotification: React.FC<CartNotificationProps> = ({
  open,
  onClose,
  product,
  quantity,
}) => {
  const { t } = useTranslation(['cart', 'common']);
  const [isClosing, setIsClosing] = useState(false);

  // Close the notification after 5 seconds
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          onClose();
          setIsClosing(false);
        }, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!product) return null;

  const subtotal = product.price * quantity;
  const primaryImage = product.images?.[0]?.imageUrl || '/placeholder-product.jpg';

  return (
    <Drawer
      title={null}
      placement="right"
      closable={false}
      onClose={onClose}
      open={open}
      width={400}
      className="cart-notification-drawer"
      headerStyle={{ display: 'none' }}
      bodyStyle={{ padding: 0 }}
      mask={false}
    >
      <motion.div 
        initial={{ x: 400 }}
        animate={{ x: isClosing ? 400 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="h-full"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <CheckCircleFilled className="text-green-500 text-2xl mr-3" />
            <Title level={4} className="m-0 dark:text-white">
              {t('cart:notifications.item_added')}
            </Title>
            <Button 
              type="text" 
              className="ml-auto" 
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  onClose();
                  setIsClosing(false);
                }, 300);
              }}
            >
              ×
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
              <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="ml-4 flex-grow">
              <Title level={5} className="m-0 mb-1 dark:text-white">
                {product.name}
              </Title>
              <div className="flex justify-between items-center">
                <Text className="text-gray-500 dark:text-gray-400">
                  {t('product:product_details.quantity')}: {quantity}
                </Text>
                <Text strong className="text-primary">
                  {formatCurrency(product.price)}
                </Text>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <Text className="dark:text-gray-300">{t('cart:cart.subtotal')}:</Text>
              <Text strong className="text-lg dark:text-white">
                {formatCurrency(subtotal)}
              </Text>
            </div>
            <div className="flex justify-between items-center">
              <Text className="dark:text-gray-300">
                <Badge count={quantity} size="small" className="mr-2" />
                {t('cart:cart.items')} {t('cart:cart.in_cart')}
              </Text>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              type="primary"
              size="large"
              block
              className="flex items-center justify-center"
            >
              <Link to="/cart" className="flex items-center justify-center w-full">
                {t('actions.view_cart')}
              </Link>
            </Button>
            <Button
              type="default"
              size="large"
              block
              className="flex items-center justify-center"
            >
              <Link to="/checkout" className="flex items-center justify-center w-full">
                {t('cart:cart.checkout')} <RightOutlined className="ml-1" />
              </Link>
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Button type="link" onClick={onClose}>
              {t('actions.continue_shopping')}
            </Button>
          </div>
        </div>

        <motion.div
          className="bg-primary h-1"
          initial={{ width: '100%' }}
          animate={{ width: isClosing ? '100%' : '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
        />
      </motion.div>
    </Drawer>
  );
};

export default CartNotification;