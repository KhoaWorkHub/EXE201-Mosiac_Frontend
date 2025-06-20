// src/components/orders/OrderQuickActions.tsx
import React from 'react';
import { Button, Space, Tooltip, Badge } from 'antd';
import { Link } from 'react-router-dom';
import { 
  ShoppingOutlined, 
  HistoryOutlined,
  ReloadOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { motion } from 'framer-motion';

interface OrderQuickActionsProps {
  className?: string;
  size?: 'small' | 'middle' | 'large';
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
}

const OrderQuickActions: React.FC<OrderQuickActionsProps> = ({ 
  className = '',
  size = 'middle',
  orientation = 'horizontal',
  showLabels = true
}) => {
  const { t } = useTranslation(['common', 'orders']);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return null;
  }

  const actions = [
    {
      key: 'orders',
      to: '/orders',
      icon: <ShoppingOutlined />,
      label: t('common:nav.orders'),
      badge: 0,
      color: 'primary',
      tooltip: 'View all your orders'
    },
    {
      key: 'recent-orders',
      to: '/orders?filter=recent',
      icon: <HistoryOutlined />,
      label: 'Recent Orders',
      badge: 0,
      color: 'default',
      tooltip: 'Your recent order history'
    },
    {
      key: 'reorder',
      to: '/orders?tab=reorder',
      icon: <ReloadOutlined />,
      label: 'Reorder',
      badge: 0,
      color: 'default',
      tooltip: 'Reorder previous purchases'
    },
    {
      key: 'reviews',
      to: '/orders?tab=reviews',
      icon: <StarOutlined />,
      label: 'Reviews',
      badge: 3,
      color: 'default',
      tooltip: 'Products waiting for review'
    }
  ];

  const renderAction = (action: typeof actions[0], index: number) => (
    <motion.div
      key={action.key}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Tooltip title={action.tooltip} placement="bottom">
        <Link to={action.to}>
          <Badge count={action.badge} size="small" offset={[-8, 8]}>
            <Button
              type={action.color === 'primary' ? 'primary' : 'default'}
              icon={action.icon}
              size={size}
              className={`${orientation === 'vertical' ? 'w-full justify-start' : ''} 
                transition-all duration-300 hover:scale-105 hover:shadow-md`}
            >
              {showLabels && (
                <span className={orientation === 'vertical' ? 'ml-2' : 'ml-1'}>
                  {action.label}
                </span>
              )}
            </Button>
          </Badge>
        </Link>
      </Tooltip>
    </motion.div>
  );

  return (
    <div className={className}>
      <Space 
        direction={orientation} 
        size={orientation === 'vertical' ? 'middle' : 'small'}
        className={orientation === 'vertical' ? 'w-full' : ''}
      >
        {actions.map((action, index) => renderAction(action, index))}
      </Space>
    </div>
  );
};

export default OrderQuickActions;