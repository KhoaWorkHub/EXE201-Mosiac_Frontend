// src/components/navigation/UserMenu.tsx
import React from 'react';
import { Dropdown, Button, Avatar, Badge, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserOutlined, 
  LogoutOutlined, 
  ShoppingOutlined,
  SettingOutlined,
  HeartOutlined,
  GiftOutlined,
  BellOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import type { MenuProps } from 'antd';

interface UserMenuProps {
  className?: string;
  trigger?: ('click' | 'hover')[];
}

const UserMenu: React.FC<UserMenuProps> = ({ 
  className = '', 
  trigger = ['click'] 
}) => {
  const { t } = useTranslation(['common', 'auth']);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="px-2 py-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Avatar size="large" icon={<UserOutlined />} />
            <div>
              <div className="font-medium text-gray-800 dark:text-white">
                {user?.fullName || 'User'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </div>
            </div>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'orders',
      label: (
        <Link to="/orders" className="flex items-center space-x-3 py-1">
          <ShoppingOutlined className="text-blue-500" />
          <span>📋 {t('common:nav.orders')}</span>
        </Link>
      ),
    },
    {
      key: 'profile',
      label: (
        <Link to="/profile" className="flex items-center space-x-3 py-1">
          <UserOutlined className="text-green-500" />
          <span>👤 {t('common:nav.profile')}</span>
        </Link>
      ),
    },
    {
      key: 'wishlist',
      label: (
        <Link to="/wishlist" className="flex items-center space-x-3 py-1">
          <HeartOutlined className="text-red-500" />
          <span>❤️ {t('common:nav.wishlist')}</span>
          <Badge count={0} size="small" />
        </Link>
      ),
    },
    {
      key: 'notifications',
      label: (
        <Link to="/notifications" className="flex items-center space-x-3 py-1">
          <BellOutlined className="text-yellow-500" />
          <span>🔔 {t('common:nav.notifications')}</span>
          <Badge count={3} size="small" />
        </Link>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      label: (
        <Link to="/settings" className="flex items-center space-x-3 py-1">
          <SettingOutlined className="text-gray-500" />
          <span>⚙️ {t('common:nav.settings')}</span>
        </Link>
      ),
    },
    {
      key: 'rewards',
      label: (
        <Link to="/rewards" className="flex items-center space-x-3 py-1">
          <GiftOutlined className="text-purple-500" />
          <span>🎁 {t('common:nav.rewards')}</span>
        </Link>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <div 
          onClick={handleLogout}
          className="flex items-center space-x-3 py-1 cursor-pointer text-red-500 hover:text-red-600"
        >
          <LogoutOutlined />
          <span>🚪 {t('auth:logout')}</span>
        </div>
      ),
    },
  ];

  if (!isAuthenticated) {
    return (
      <Space>
        <Link to="/login">
          <Button type="primary">
            {t('auth:sign_in')}
          </Button>
        </Link>
      </Space>
    );
  }

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={trigger}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
      overlayClassName="user-menu-dropdown"
      className={className}
    >
      <Button type="text" className="flex items-center space-x-2 px-3 py-2 h-auto">
        <Avatar size="small" icon={<UserOutlined />} />
        <span className="hidden sm:inline text-gray-700 dark:text-gray-300">
          {user?.fullName?.split(' ')[0] || 'User'}
        </span>
        <DownOutlined className="text-xs text-gray-400" />
      </Button>
    </Dropdown>
  );
};

export default UserMenu;