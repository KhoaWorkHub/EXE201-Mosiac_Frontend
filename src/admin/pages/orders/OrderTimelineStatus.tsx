import React from 'react';
import { Timeline, Tag, Card, Typography, Avatar } from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { OrderResponse, OrderStatus, PaymentStatus, OrderStatusColors, PaymentStatusColors } from '@/admin/types/order.types';
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
  userName?: string;
}

const OrderTimelineStatus: React.FC<OrderTimelineProps> = ({ order }) => {
  const { t } = useTranslation(['admin', 'admin-orders', 'common']);
  
  // Helper function to determine appropriate status icon
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
        return <ClockCircleOutlined />;
      case OrderStatus.PAID:
        return <DollarOutlined />;
      case OrderStatus.PROCESSING:
        return <ShoppingOutlined />;
      case OrderStatus.SHIPPING:
        return <CarOutlined />;
      case OrderStatus.DELIVERED:
        return <CheckCircleOutlined />;
      case OrderStatus.CANCELLED:
        return <CloseCircleOutlined />;
      default:
        return <ShoppingOutlined />;
    }
  };
  
  // Build timeline items based on order data
  const generateTimelineItems = (): TimelineItem[] => {
    const items: TimelineItem[] = [];
    
    // Order created
    items.push({
      id: 'created',
      date: order.createdAt,
      title: t('admin-orders:orders.history.order_created'),
      description: t('admin-orders:orders.history.order_created_desc', { 
        number: order.orderNumber,
        amount: order.totalAmount 
      }),
      icon: <ShoppingOutlined />,
      color: 'blue',
      tags: [
        { 
          text: t('admin-orders:orders.statuses.pending_payment'), 
          color: OrderStatusColors[OrderStatus.PENDING_PAYMENT]
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
          paymentColor = PaymentStatusColors[PaymentStatus.COMPLETED];
          break;
        case PaymentStatus.FAILED:
          paymentIcon = <CloseCircleOutlined />;
          paymentColor = PaymentStatusColors[PaymentStatus.FAILED];
          break;
        case PaymentStatus.REFUNDED:
          paymentIcon = <DollarOutlined />;
          paymentColor = PaymentStatusColors[PaymentStatus.REFUNDED];
          break;
        default:
          paymentIcon = <ClockCircleOutlined />;
          paymentColor = PaymentStatusColors[PaymentStatus.PENDING];
      }
      
      items.push({
        id: 'payment',
        date: order.payment.paymentDate || order.createdAt,
        title: t(`admin-orders:orders.history.payment_${order.payment.status.toLowerCase()}`),
        description: t(`admin-orders:orders.history.payment_${order.payment.status.toLowerCase()}_desc`, {
          method: t(`admin-orders:orders.payment_methods.${order.payment.paymentMethod.toLowerCase()}`),
          amount: order.payment.amount
        }),
        icon: paymentIcon,
        color: paymentColor,
        tags: [
          { 
            text: t(`admin-orders:orders.payment_statuses.${order.payment.status.toLowerCase()}`), 
            color: paymentColor 
          }
        ]
      });
    }
    
    // Status timeline based on current status - we'll create hypothetical past status changes
    // In a real implementation this would come from an actual status history API
    const possibleStatuses = [
      OrderStatus.PENDING_PAYMENT,
      OrderStatus.PAID,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPING,
      OrderStatus.DELIVERED
    ];
    
    const currentStatusIndex = possibleStatuses.indexOf(order.status);
    
    // Special case for cancelled orders
    if (order.status === OrderStatus.CANCELLED) {
      // We don't know at which point the order was cancelled, so just add the cancellation event
      items.push({
        id: 'status_cancelled',
        date: order.updatedAt,
        title: t('admin-orders:orders.history.order_cancelled'),
        description: order.cancelledReason 
          ? `${t('admin-orders:orders.history.reason')}: ${order.cancelledReason}` 
          : undefined,
        icon: <CloseCircleOutlined />,
        color: OrderStatusColors[OrderStatus.CANCELLED],
        tags: [
          {
            text: t('admin-orders:orders.statuses.cancelled'),
            color: OrderStatusColors[OrderStatus.CANCELLED]
          }
        ]
      });
    } else {
      // For non-cancelled orders, add status changes up to current status
      for (let i = 1; i <= currentStatusIndex; i++) {
        const previousStatus = possibleStatuses[i-1];
        const currentStatus = possibleStatuses[i];
        
        // Calculate a hypothetical date for the status change
        // In a real system this would come from actual history data
        const hoursToAdd = i * 24; // Just a simple progression for demo
        const statusDate = new Date(new Date(order.createdAt).getTime() + hoursToAdd * 60 * 60 * 1000).toISOString();
        
        items.push({
          id: `status_${currentStatus.toLowerCase()}`,
          date: statusDate,
          title: t('admin-orders:orders.history.status_changed', {
            from: t(`admin-orders:orders.statuses.${previousStatus.toLowerCase()}`),
            to: t(`admin-orders:orders.statuses.${currentStatus.toLowerCase()}`)
          }),
          icon: getStatusIcon(currentStatus),
          color: OrderStatusColors[currentStatus],
          tags: [
            {
              text: t(`admin-orders:orders.statuses.${currentStatus.toLowerCase()}`),
              color: OrderStatusColors[currentStatus]
            }
          ],
          userName: "Admin" // In a real implementation, this would be the actual user who made the change
        });
      }
    }
    
    // Sort items by date (newest first)
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  const timelineItems = generateTimelineItems();
  
  return (
    <Card
      title={t('admin-orders:orders.order_timeline')}
      className="order-timeline"
    >
      {timelineItems.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          {t('admin-orders:orders.no_timeline_data')}
        </div>
      ) : (
        <Timeline
          mode="left"
          items={timelineItems.map((item, index) => ({
            color: item.color,
            dot: (
              <Avatar 
                size="small" 
                style={{ backgroundColor: item.color }} 
                icon={item.icon} 
              />
            ),
            children: (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={item.id}
                className="pb-6"
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
                  {item.userName && (
                    <Text className="text-xs text-gray-500 mt-1">
                      <UserOutlined className="mr-1" />
                      {item.userName}
                    </Text>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-2">
                      {item.tags.map((tag, tagIndex) => (
                        <Tag key={tagIndex} color={tag.color}>
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
      )}
    </Card>
  );
};

export default OrderTimelineStatus;