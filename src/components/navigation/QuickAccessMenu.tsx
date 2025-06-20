// src/components/navigation/QuickAccessMenu.tsx
import React from 'react';
import { Badge, Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { 
  HeartOutlined,
  BellOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { useCart } from '@/contexts/CartContext';
import CartButton from '@/components/cart/CardButton';
import UserMenu from './UserMenu';

interface QuickAccessMenuProps {
  className?: string;
}

const QuickAccessMenu: React.FC<QuickAccessMenuProps> = ({ className = '' }) => {
  const { t } = useTranslation(['common']);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { state } = useCart();

  // Calculate total items in cart
  const totalItemsCount = state.cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Notifications - Only for authenticated users */}
      {isAuthenticated && (
        <Tooltip title={t('common:nav.notifications')}>
          <Link to="/notifications">
            <Badge count={3} size="small" offset={[-2, 6]}>
              <Button 
                type="text" 
                icon={<BellOutlined className="text-xl" />}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              />
            </Badge>
          </Link>
        </Tooltip>
      )}

      {/* Wishlist - Only for authenticated users */}
      {isAuthenticated && (
        <Tooltip title={t('common:nav.wishlist')}>
          <Link to="/wishlist">
            <Badge count={0} size="small" offset={[-2, 6]}>
              <Button 
                type="text" 
                icon={<HeartOutlined className="text-xl" />}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              />
            </Badge>
          </Link>
        </Tooltip>
      )}

      {/* Orders - Only for authenticated users */}
      {isAuthenticated && (
        <Tooltip title={t('common:nav.orders')}>
          <Link to="/orders">
            <Button 
              type="text" 
              icon={<ShoppingOutlined className="text-xl" />}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            />
          </Link>
        </Tooltip>
      )}

      {/* Cart Button */}
      <CartButton className="relative" />

      {/* User Menu */}
      <UserMenu />

      {/* Mobile Cart Info - Show on small screens */}
      <div className="sm:hidden">
        {totalItemsCount > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickAccessMenu;