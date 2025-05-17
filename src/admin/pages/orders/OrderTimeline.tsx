import React from 'react';
import { Timeline, Tag, Card, Typography, Avatar } from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CarOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { OrderResponse, OrderStatus, PaymentStatus } from '@/admin/types/order.types';
import { formatDate } from '@/utils/formatters';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

interface OrderTimelineProps {
  order: OrderResponse;
}

interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  color?: string;
  tags?: { text: string; color: string }[];
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const { t } = useTranslation(['admin', 'common']);
  
  // Build timeline items based on order data
  const generateTimelineItems = (): TimelineItem[] => {
    const items: TimelineItem[] = [];
    
    // Order created
    items.push({
      id: 'created',
      date: order.createdAt,
      title: t('admin:orders.history.order_created'),
      description: t('admin:orders.history.order_created_desc', { number: order.orderNumber }),
      icon: <ShoppingOutlined />,
      color: 'blue',
      tags: [
        { 
          text: t('admin:orders.statuses.pending_payment'), 
          color: 'orange' 
        }
      ]
    });
    
    // Payment status
    if (order.payment) {
      let paymentIcon = <DollarOutlined />;
      let paymentColor = 'blue';
      
      switch (order.payment.status) {
        case PaymentStatus.COMPLETED:
          paymentIcon = <CheckCircleOutlined />;
          paymentColor = 'green';
          break;
        case PaymentStatus.FAILED:
          paymentIcon = <CloseCircleOutlined />;
          paymentColor = 'red';
          break;
        case PaymentStatus.REFUNDED:
          paymentIcon = <DollarOutlined />;
          paymentColor = 'purple';
          break;
        default:
          paymentIcon = <ClockCircleOutlined />;
          paymentColor = 'orange';
      }
      
      items.push({
        id: 'payment',
        date: order.payment.paymentDate || order.createdAt,
        title: t(`admin:orders.history.payment_${order.payment.status.toLowerCase()}`),
        description: t(`admin:orders.history.payment_${order.payment.status.toLowerCase()}_desc`, {
          method: t(`admin:orders.payment_methods.${order.payment.paymentMethod.toLowerCase()}`)
        }),
        icon: paymentIcon,
        color: paymentColor,
        tags: [
          { 
            text: t(`admin:orders.payment_statuses.${order.payment.status.toLowerCase()}`), 
            color: paymentColor 
          }
        ]
      });
    }
    
    // Order status updates (mock data - would be replaced with actual status history)
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      items.push({
        id: 'status_paid',
        date: new Date(new Date(order.createdAt).getTime() + 1 * 60 * 60 * 1000).toISOString(), // example: 1 hour later
        title: t('admin:orders.history.status_changed', {
          from: t('admin:orders.statuses.pending_payment'),
          to: t('admin:orders.statuses.paid')
        }),
        icon: <DollarOutlined />,
        color: 'blue'
      });
    }
    
    if (order.status === OrderStatus.PROCESSING || 
        order.status === OrderStatus.SHIPPING || 
        order.status === OrderStatus.DELIVERED) {
      items.push({
        id: 'status_processing',
        date: new Date(new Date(order.createdAt).getTime() + 2 * 60 * 60 * 1000).toISOString(), // example: 2 hours later
        title: t('admin:orders.history.status_changed', {
          from: t('admin:orders.statuses.paid'),
          to: t('admin:orders.statuses.processing')
        }),
        icon: <ShoppingOutlined />,
        color: 'cyan'
      });
    }
    
    if (order.status === OrderStatus.SHIPPING || order.status === OrderStatus.DELIVERED) {
      items.push({
        id: 'status_shipping',
        date: new Date(new Date(order.createdAt).getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(), // example: 1 day later
        title: t('admin:orders.history.status_changed', {
          from: t('admin:orders.statuses.processing'),
          to: t('admin:orders.statuses.shipping')
        }),
        icon: <CarOutlined />,
        color: 'blue'
      });
    }
    
    if (order.status === OrderStatus.DELIVERED) {
      items.push({
        id: 'status_delivered',
        date: new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // example: 3 days later
        title: t('admin:orders.history.status_changed', {
          from: t('admin:orders.statuses.shipping'),
          to: t('admin:orders.statuses.delivered')
        }),
        icon: <CheckCircleOutlined />,
        color: 'green'
      });
    }
    
    if (order.status === OrderStatus.CANCELLED) {
      items.push({
        id: 'status_cancelled',
        date: order.updatedAt,
        title: t('admin:orders.history.order_cancelled'),
        description: order.cancelledReason 
          ? `${t('admin:orders.history.reason')}: ${order.cancelledReason}` 
          : undefined,
        icon: <CloseCircleOutlined />,
        color: 'red'
      });
    }
    
    // Sort items by date
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  const timelineItems = generateTimelineItems();
  
  return (
    <Card
      title={t('admin:orders.order_timeline')}
      className="order-timeline"
    >
      <Timeline
        mode="left"
        items={timelineItems.map(item => ({
          color: item.color,
          dot: <Avatar 
            size="small" 
            style={{ backgroundColor: item.color }} 
            icon={item.icon} 
          />,
          children: (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              className="pb-4"
            >
              <div className="flex flex-col">
                <Text className="text-gray-500 text-sm">
                  {formatDate(item.date)}
                </Text>
                <Title level={5} className="m-0 mt-1">
                  {item.title}
                </Title>
                {item.description && (
                  <Text className="mt-1">{item.description}</Text>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2">
                    {item.tags.map((tag, index) => (
                      <Tag key={index} color={tag.color}>
                        {tag.text}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )
        }))}
      />
    </Card>
  );
};

export default OrderTimeline;