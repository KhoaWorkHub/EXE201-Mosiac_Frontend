import React from 'react';
import { Card, Divider, Typography, Spin, Button } from 'antd';
import { ShoppingOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/formatters';

const { Text } = Typography;

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  className?: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  showCheckoutButton = true,
  className = '',
}) => {
  const { t } = useTranslation(['cart', 'common', 'checkout']);
  const { state } = useCart();
  const { cart, loading } = state;

  if (loading) {
    return (
      <Card className={`${className}`}>
        <div className="flex justify-center items-center py-4">
          <Spin />
        </div>
      </Card>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Card className={`${className}`}>
        <div className="text-center py-4">
          <ShoppingOutlined className="text-4xl text-gray-300 mb-2" />
          <Text className="block text-gray-500">{t('cart:cart.empty')}</Text>
          <Link to="/products">
            <Button type="link">{t('cart:cart.start_shopping')}</Button>
          </Link>
        </div>
      </Card>
    );
  }

  // Calculate totals - in a real app, these might come from the backend
  const calculateSubtotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  };
  
  const subtotal = cart.totalAmount ?? calculateSubtotal();
  const shipping = 0; // Example, replace with actual calculation
  const tax = 0; // Example, replace with actual calculation
  const total = subtotal + shipping + tax;

  return (
    <Card className={`${className}`} title={t('cart:cart.summary')}>
      <div className="mb-4">
        {/* Show each item in a condensed form */}
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <Text className="flex-1 truncate dark:text-gray-300">
              {item.quantity} × {item.productName}
              {item.variantInfo && <span className="text-gray-500"> ({item.variantInfo})</span>}
            </Text>
            <Text className="ml-2 dark:text-white">{formatCurrency(item.subtotal)}</Text>
          </div>
        ))}
      </div>

      <Divider className="my-3" />

      <div className="mb-4">
        <div className="flex justify-between py-1">
          <Text className="dark:text-gray-300">{t('cart:cart.subtotal')}</Text>
          <Text className="dark:text-white">{formatCurrency(subtotal)}</Text>
        </div>

        <div className="flex justify-between py-1">
          <Text className="dark:text-gray-300">{t('cart:cart.shipping')}</Text>
          <Text className="dark:text-white">{formatCurrency(shipping)}</Text>
        </div>

        <div className="flex justify-between py-1">
          <Text className="dark:text-gray-300">{t('cart:cart.tax')}</Text>
          <Text className="dark:text-white">{formatCurrency(tax)}</Text>
        </div>
      </div>

      <Divider className="my-3" />

      <div className="flex justify-between py-1 mb-4">
        <Text strong className="text-lg dark:text-white">{t('cart:cart.total')}</Text>
        <Text strong className="text-lg text-primary">{formatCurrency(total)}</Text>
      </div>

      {showCheckoutButton && (
        <Button
          type="primary"
          size="large"
          block
          className="flex items-center justify-center"
        >
          <Link to="/checkout" className="flex items-center justify-center w-full">
            {t('cart:cart.checkout')} <RightOutlined className="ml-1" />
          </Link>
        </Button>
      )}
    </Card>
  );
};

export default CartSummary;