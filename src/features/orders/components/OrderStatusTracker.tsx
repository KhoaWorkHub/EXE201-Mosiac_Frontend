// src/features/orders/components/OrderStatusTracker.tsx
import React from 'react';
import { Steps, Card, Typography, Tag, Timeline, Avatar } from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CarOutlined,
  HomeOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
  GiftOutlined,
  TruckOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { OrderStatus, OrderStatusHistory } from '@/types/order.types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Title, Text } = Typography;
const { Step } = Steps;

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
  statusHistory: OrderStatusHistory[];
  orderNumber: string;
  estimatedDeliveryDate?: string;
  trackingNumber?: string;
  className?: string;
  size?: 'small' | 'default';
  showTimeline?: boolean;
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  currentStatus,
  statusHistory = [],
  orderNumber,
  estimatedDeliveryDate,
  trackingNumber,
  className = '',
  size = 'default',
  showTimeline = true
}) => {
useTranslation(['orders', 'common']);

  // Status configuration with Vietnamese labels
  const statusConfig = {
    [OrderStatus.PENDING_PAYMENT]: {
      label: 'Chờ thanh toán',
      color: 'orange',
      icon: <DollarOutlined />,
      bgColor: 'from-orange-500 to-yellow-500',
      description: 'Đơn hàng đang chờ xác nhận thanh toán'
    },
    [OrderStatus.PAID]: {
      label: 'Đã thanh toán',
      color: 'green',
      icon: <CheckCircleOutlined />,
      bgColor: 'from-green-500 to-emerald-500',
      description: 'Thanh toán đã được xác nhận thành công'
    },
    [OrderStatus.PROCESSING]: {
      label: 'Đang xử lý',
      color: 'blue',
      icon: <SyncOutlined spin />,
      bgColor: 'from-blue-500 to-cyan-500',
      description: 'Đơn hàng đang được chuẩn bị và đóng gói'
    },
    [OrderStatus.SHIPPING]: {
      label: 'Đang vận chuyển',
      color: 'purple',
      icon: <CarOutlined />,
      bgColor: 'from-purple-500 to-indigo-500',
      description: 'Đơn hàng đang trên đường giao đến bạn'
    },
    [OrderStatus.DELIVERED]: {
      label: 'Đã giao hàng',
      color: 'green',
      icon: <HomeOutlined />,
      bgColor: 'from-green-600 to-teal-600',
      description: 'Đơn hàng đã được giao thành công'
    },
    [OrderStatus.CANCELLED]: {
      label: 'Đã hủy',
      color: 'red',
      icon: <CloseCircleOutlined />,
      bgColor: 'from-red-500 to-pink-500',
      description: 'Đơn hàng đã bị hủy'
    }
  };

  // Get status index for Steps component
  const getStatusIndex = (status: OrderStatus): number => {
    const statusOrder = [
      OrderStatus.PENDING_PAYMENT,
      OrderStatus.PAID,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPING,
      OrderStatus.DELIVERED
    ];
    
    if (status === OrderStatus.CANCELLED) {
      return -1; // Special handling for cancelled status
    }
    
    return statusOrder.indexOf(status);
  };

  const currentIndex = getStatusIndex(currentStatus);
  const config = statusConfig[currentStatus];

  // Create steps for the progress
  const steps = [
    {
      title: 'Chờ thanh toán',
      icon: <DollarOutlined />,
      status: OrderStatus.PENDING_PAYMENT
    },
    {
      title: 'Đã thanh toán',
      icon: <CheckCircleOutlined />,
      status: OrderStatus.PAID
    },
    {
      title: 'Đang xử lý',
      icon: <ShoppingOutlined />,
      status: OrderStatus.PROCESSING
    },
    {
      title: 'Vận chuyển',
      icon: <TruckOutlined />,
      status: OrderStatus.SHIPPING
    },
    {
      title: 'Hoàn thành',
      icon: <GiftOutlined />,
      status: OrderStatus.DELIVERED
    }
  ];

  // Render main status card
  const renderStatusCard = () => (
    <Card className="mb-6 overflow-hidden">
      <div className="relative">
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r ${config.bgColor} opacity-10 rounded-lg`} />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`w-16 h-16 bg-gradient-to-r ${config.bgColor} rounded-full flex items-center justify-center text-white shadow-lg`}
            >
              <div className="text-2xl">
                {config.icon}
              </div>
            </motion.div>
            
            <div>
              <Title level={4} className="m-0 mb-1">
                {config.label}
              </Title>
              <Text className="text-gray-600 dark:text-gray-400">
                {config.description}
              </Text>
              {trackingNumber && currentStatus === OrderStatus.SHIPPING && (
                <div className="mt-2">
                  <Text className="text-sm">
                    Mã vận đơn: <Text strong>{trackingNumber}</Text>
                  </Text>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <Tag color={config.color} className="text-lg px-4 py-2 font-medium">
              {config.label}
            </Tag>
            {estimatedDeliveryDate && currentStatus !== OrderStatus.DELIVERED && currentStatus !== OrderStatus.CANCELLED && (
              <div className="mt-2">
                <Text className="text-sm text-gray-500">
                  Dự kiến giao: {dayjs(estimatedDeliveryDate).format('DD/MM/YYYY')}
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  // Render progress steps
  const renderProgressSteps = () => {
    if (currentStatus === OrderStatus.CANCELLED) {
      return (
        <Card className="mb-6">
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CloseCircleOutlined className="text-3xl text-red-500" />
            </motion.div>
            <Title level={4} className="text-red-500 mb-2">
              Đơn hàng đã bị hủy
            </Title>
            <Text className="text-gray-600 dark:text-gray-400">
              Đơn hàng #{orderNumber} đã bị hủy
            </Text>
          </div>
        </Card>
      );
    }

    return (
      <Card className="mb-6">
        <div className="px-4">
          <Steps 
            current={currentIndex} 
            size={size}
            className="mb-4"
          >
            {steps.map((step, index) => (
              <Step
                key={step.status}
                title={step.title}
                icon={step.icon}
                status={
                  index < currentIndex ? 'finish' :
                  index === currentIndex ? 'process' : 'wait'
                }
              />
            ))}
          </Steps>
        </div>
      </Card>
    );
  };

  // Render timeline
  const renderTimeline = () => {
    if (!showTimeline || statusHistory.length === 0) return null;

    return (
      <Card>
        <Title level={4} className="mb-4">
          Lịch sử đơn hàng
        </Title>
        
        <Timeline mode="left">
          {statusHistory.map((history, index) => {
            const config = statusConfig[history.status];
            return (
              <Timeline.Item
                key={index}
                dot={
                  <Avatar
                    size="small"
                    className={`bg-gradient-to-r ${config.bgColor}`}
                    icon={config.icon}
                  />
                }
                color={config.color}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Text strong className="block">
                        {config.label}
                      </Text>
                      {history.notes && (
                        <Text className="text-gray-600 dark:text-gray-400 text-sm block mt-1">
                          {history.notes}
                        </Text>
                      )}
                      {history.updatedBy && (
                        <Text className="text-gray-500 text-xs block mt-1">
                          Cập nhật bởi: {history.updatedBy}
                        </Text>
                      )}
                    </div>
                    <div className="text-right">
                      <Text className="text-gray-500 text-sm">
                        {dayjs(history.timestamp).format('DD/MM/YYYY HH:mm')}
                      </Text>
                      <br />
                      <Text className="text-gray-400 text-xs">
                        {dayjs(history.timestamp).fromNow()}
                      </Text>
                    </div>
                  </div>
                </motion.div>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Card>
    );
  };

  return (
    <div className={className}>
      {renderStatusCard()}
      {renderProgressSteps()}
      {renderTimeline()}
    </div>
  );
};

export default OrderStatusTracker;