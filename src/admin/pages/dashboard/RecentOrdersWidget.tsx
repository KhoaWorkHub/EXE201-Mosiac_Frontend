import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Tooltip, 
  Typography, 
  Skeleton 
} from 'antd';
import { 
  EyeOutlined, 
  ShoppingOutlined, 
  ArrowRightOutlined 
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AdminOrderService } from '@/admin/services/adminOrderService';
import { OrderResponse, OrderStatus } from '@/admin/types/order.types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { motion } from 'framer-motion';

const { Title } = Typography;

const RecentOrdersWidget: React.FC = () => {
  const { t } = useTranslation(['admin-orders', 'common']);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true);
        const response = await AdminOrderService.getAllOrders({
          page: 0,
          size: 5,
          sort: 'createdAt,desc'
        });
        setOrders(response.content);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentOrders();
  }, []);
  
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
        <span className="font-medium">{text}</span>
      ),
    },
    {
      title: t('admin-orders:orders.customer'),
      dataIndex: 'recipientName',
      key: 'recipientName',
      render: (text: string, record: OrderResponse) => (
        <div className="truncate max-w-[160px]">
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.recipientPhone}</div>
        </div>
      ),
    },
    {
      title: t('admin-orders:orders.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
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
        const statusColors: Record<OrderStatus, string> = {
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
      title: t('common:actions'),
      key: 'actions',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: OrderResponse) => (
        <Tooltip title={t('common:view')}>
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record.id as unknown as string)}
          />
        </Tooltip>
      ),
    },
  ];
  
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
            {t('admin-orders:actions.view_all')}
          </Button>
        }
        className="h-full"
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : (
          <Table
            dataSource={orders}
            columns={columns}
            rowKey="id"
            size="small"
            pagination={false}
            className="recent-orders-table"
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default RecentOrdersWidget;