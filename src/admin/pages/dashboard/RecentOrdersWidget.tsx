import React, { useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Tooltip, 
  Typography, 
  Skeleton,
  Empty, 
  Space
} from 'antd';
import { 
  EyeOutlined, 
  ShoppingOutlined, 
  ArrowRightOutlined 
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrders } from '@/admin/store/slices/orderSlice';
import { OrderResponse, OrderStatus, OrderStatusColors } from '@/admin/types/order.types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Breakpoint } from 'antd';
import { motion } from 'framer-motion';

const { Title } = Typography;

const RecentOrdersWidget: React.FC = () => {
  const { t } = useTranslation(['admin-orders', 'common']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector(state => state.orders);
  
  useEffect(() => {
    // Fetch latest orders specifically for the dashboard widget
    dispatch(fetchOrders());
  }, [dispatch]);
  
  // Handle view order
  const handleViewOrder = (id: string) => {
    navigate(`/admin/orders/${id}`);
  };
  
  // Handle all orders navigation
  const handleViewAllOrders = () => {
    navigate('/admin/orders');
  };
  
  // Table columns
  const columns = [
      {
        title: t('admin-orders:orders.order_number'),
        dataIndex: 'orderNumber',
        key: 'orderNumber',
        render: (text: string) => (
          <span className="font-medium text-primary">{text}</span>
        ),
      },
      {
        title: t('admin-orders:orders.customer'),
        dataIndex: 'recipientName',
        key: 'recipientName',
        render: (text: string, record: OrderResponse) => (
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.recipientPhone}</div>
          </div>
        ),
        responsive: ['md' as Breakpoint],
      },
      {
        title: t('admin-orders:orders.date'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        responsive: ['lg' as Breakpoint],
      },
      {
        title: t('admin-orders:orders.amount'),
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        render: (amount: number) => (
          <span className="font-medium">{formatCurrency(amount)}</span>
        ),
      },
      {
        title: t('admin-orders:orders.status'),
        dataIndex: 'status',
        key: 'status',
        render: (status: OrderStatus) => {
          const statusColors = {
            PENDING_PAYMENT: 'orange',
            PAID: 'geekblue',
            PROCESSING: 'cyan',
            SHIPPING: 'blue',
            DELIVERED: 'green',
            CANCELLED: 'red'
          };
          
          return (
            <Tag color={statusColors[status]}>
              {t(`admin-orders:orders.statuses.${status.toLowerCase()}`)}
            </Tag>
          );
        },
      },
      {
        title: t('admin-orders:orders.payment'),
        dataIndex: 'payment',
        key: 'payment',
        render: (payment: OrderResponse['payment']) => {
          if (!payment) return <Tag color="default">{t('admin-orders:orders.no_payment')}</Tag>;
          
          const paymentStatusColors = {
            PENDING: 'orange',
            COMPLETED: 'green',
            FAILED: 'red',
            REFUNDED: 'purple'
          };
          
          return (
            <div>
              <Tag color={paymentStatusColors[payment.status]}>
                {t(`admin-orders:orders.payment_statuses.${payment.status.toLowerCase()}`)}
              </Tag>
              <div className="text-xs text-gray-500 mt-1">
                {t(`admin-orders:orders.payment_methods.${payment.paymentMethod.toLowerCase()}`)}
              </div>
            </div>
          );
        },
        responsive: ['lg' as Breakpoint],
      },
      {
        title: t('common:actions'),
        key: 'actions',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (_: any, record: OrderResponse) => (
          <Space>
            <Tooltip title={t('common:view')}>
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewOrder(record.id as string)}
              />
            </Tooltip>
          </Space>
        ),
      },
    ];
  
  // Responsive column adjustments for mobile
  const mobileColumns = [
    {
      title: t('admin-orders:orders.order_info'),
      key: 'orderInfo',
      render: (record: OrderResponse) => (
        <div onClick={() => handleViewOrder(record.id as string)} className="cursor-pointer">
          <div className="flex justify-between items-center">
            <span className="font-medium">{record.orderNumber}</span>
            <Tag color={OrderStatusColors[record.status]}>
              {t(`admin-orders:orders.statuses.${record.status.toLowerCase()}`)}
            </Tag>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm">{record.recipientName}</span>
            <span className="font-medium">{formatCurrency(record.totalAmount)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatDate(record.createdAt)}
          </div>
        </div>
      ),
    },
  ];
  
  const isMobile = window.innerWidth < 768;
  const displayColumns = isMobile ? mobileColumns : columns;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        title={
          <div className="flex items-center">
            <ShoppingOutlined className="mr-2 text-primary" />
            <Title level={5} className="m-0">{t('admin-orders:orders.recent_orders')}</Title>
          </div>
        }
        extra={
          <Button 
            type="link" 
            onClick={handleViewAllOrders}
            icon={<ArrowRightOutlined />}
          >
            {t('admin-orders:orders.actions.view_all')}
          </Button>
        }
        className="h-full"
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : orders.length === 0 ? (
          <Empty 
            description={t('admin-orders:orders.no_orders')} 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            dataSource={orders}
            columns={displayColumns}
            rowKey="id"
            size="small"
            pagination={false}
            className="recent-orders-table"
            scroll={{ x: 'max-content' }}
            onRow={(record) => ({
              onClick: () => handleViewOrder(record.id as string),
              className: 'cursor-pointer hover:bg-gray-50 transition-colors'
            })}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default RecentOrdersWidget;