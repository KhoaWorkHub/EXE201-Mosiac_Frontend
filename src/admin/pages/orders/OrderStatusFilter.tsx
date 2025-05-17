import React from 'react';
import { Tag, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { OrderStatus, OrderStatusColors } from '@/admin/types/order.types';
import { motion } from 'framer-motion';

interface OrderStatusFilterProps {
  value: OrderStatus[];
  onChange: (statuses: OrderStatus[]) => void;
}

const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({ value, onChange }) => {
  const { t } = useTranslation(['admin-orders']);
  
  const handleToggleStatus = (status: OrderStatus) => {
    if (value.includes(status)) {
      onChange(value.filter((s) => s !== status));
    } else {
      onChange([...value, status]);
    }
  };
  
  // Animation variants for the chip
  const chipVariants = {
    selected: { scale: 1.05, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' },
    unselected: { scale: 1, boxShadow: '0 0 0 rgba(0, 0, 0, 0)' }
  };
  
  return (
    <Space size={[8, 8]} wrap>
      {Object.values(OrderStatus).map((status) => {
        const isSelected = value.includes(status);
        
        return (
          <motion.div
            key={status}
            initial="unselected"
            animate={isSelected ? "selected" : "unselected"}
            variants={chipVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Tag
              color={isSelected ? OrderStatusColors[status] : 'default'}
              style={{ 
                cursor: 'pointer',
                borderWidth: isSelected ? 2 : 1,
                padding: '6px 12px',
                borderRadius: '16px',
                fontWeight: isSelected ? 'bold' : 'normal'
              }}
              onClick={() => handleToggleStatus(status)}
            >
              {t(`admin-orders:orders.statuses.${status.toLowerCase()}`)}
            </Tag>
          </motion.div>
        );
      })}
    </Space>
  );
};

export default OrderStatusFilter;