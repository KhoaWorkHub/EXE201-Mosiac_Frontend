import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Space, 
  Tooltip, 
  Row,
  Col,
  Statistic,
  Typography,
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  FilterOutlined,
  CalendarOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchOrders, 
  fetchOrderAnalytics,
  setCurrentPage, 
  setPageSize,
  setKeywordFilter,
  setStatusFilter,
  setDateRangeFilter,
  resetFilters
} from '@/admin/store/slices/orderSlice';
import { type OrderResponse, OrderStatus } from '@/admin/types/order.types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { motion } from 'framer-motion';
import { Dayjs } from 'dayjs';
import OrderStatusFilter from './OrderStatusFilter';
import OrderAnalytics from './OrderAnalytics';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const OrderList: React.FC = () => {
  const { t } = useTranslation(['admin', 'admin-orders']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { 
    orders, 
    loading, 
    pagination, 
    filters,
    analytics 
  } = useAppSelector(state => state.orders);
  
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // Fetch orders on mount and when filters/pagination change
  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchOrderAnalytics());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pagination.current, pagination.pageSize, filters]);
  
  // Handle navigation to order detail
  const handleViewOrder = (order: OrderResponse) => {
    navigate(`/admin/orders/${order.id}`);
  };
  
  // Handle search
  const handleSearch = (value: string) => {
    dispatch(setKeywordFilter(value));
  };
  
  // Handle filter change
  const handleStatusFilterChange = (statuses: OrderStatus[]) => {
    dispatch(setStatusFilter(statuses));
  };
  
  // Handle date range change
  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (!dates || !dates[0] || !dates[1]) {
      dispatch(setDateRangeFilter(null));
      return;
    }
    
    const startDate = dates[0].format('YYYY-MM-DDTHH:mm:ss');
    const endDate = dates[1].format('YYYY-MM-DDTHH:mm:ss');
    dispatch(setDateRangeFilter([startDate, endDate]));
  };
  
  // Handle reset filters
  const handleResetFilters = () => {
    dispatch(resetFilters());
  };
  
  // Table columns
  const columns = [
    {
      title: t('admin:orders.order_number'),
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string) => (
        <span className="font-medium text-primary">{text}</span>
      ),
    },
    {
      title: t('admin:orders.customer'),
      dataIndex: 'recipientName',
      key: 'recipientName',
      render: (text: string, record: OrderResponse) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.recipientPhone}</div>
        </div>
      ),
    },
    {
      title: t('admin:orders.date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: t('admin:orders.amount'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span className="font-medium">{formatCurrency(amount)}</span>
      ),
    },
    {
      title: t('admin:orders.status'),
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
            {t(`admin:orders.statuses.${status.toLowerCase()}`)}
          </Tag>
        );
      },
    },
    {
      title: t('admin:orders.payment'),
      dataIndex: 'payment',
      key: 'payment',
      render: (payment: OrderResponse['payment']) => {
        if (!payment) return <Tag color="default">{t('admin:orders.no_payment')}</Tag>;
        
        const paymentStatusColors = {
          PENDING: 'orange',
          COMPLETED: 'green',
          FAILED: 'red',
          REFUNDED: 'purple'
        };
        
        return (
          <div>
            <Tag color={paymentStatusColors[payment.status]}>
              {t(`admin:orders.payment_statuses.${payment.status.toLowerCase()}`)}
            </Tag>
            <div className="text-xs text-gray-500 mt-1">
              {t(`admin:orders.payment_methods.${payment.paymentMethod.toLowerCase()}`)}
            </div>
          </div>
        );
      },
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
              onClick={() => handleViewOrder(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  // Get counts for statistics
  const getStatusCount = (status: OrderStatus) => {
    return analytics.countByStatus?.[status] || 0;
  };
  
  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.totalAmount, 0);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-1 dark:text-white">
            {t('admin:orders.title')}
          </Title>
          <Text className="text-gray-500 dark:text-gray-400">
            {t('admin:orders.subtitle')}
          </Text>
        </div>
        <div>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => dispatch(fetchOrders())}
            loading={loading}
          >
            {t('admin:actions.refresh')}
          </Button>
        </div>
      </div>
      
      {/* Analytics summary */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <Statistic
                title={t('admin:orders.total_orders')}
                value={pagination.total}
                prefix={<ShoppingOutlined />}
                loading={analytics.loading}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <Statistic
                title={t('admin:orders.total_revenue')}
                value={getTotalRevenue()}
                prefix={<DollarOutlined />}
                loading={analytics.loading}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <Statistic
                title={t('admin:orders.delivered_orders')}
                value={getStatusCount(OrderStatus.DELIVERED)}
                prefix={<CheckCircleOutlined className="text-green-500" />}
                loading={analytics.loading}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <Statistic
                title={t('admin:orders.cancelled_orders')}
                value={getStatusCount(OrderStatus.CANCELLED)}
                prefix={<CloseCircleOutlined className="text-red-500" />}
                loading={analytics.loading}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
      
      {/* Order Analytics Charts */}
      <OrderAnalytics />
      
      <Card className="mt-4">
        {/* Search and filter bar */}
        <div className="flex flex-col lg:flex-row justify-between mb-4 gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-grow">
            <Input
              placeholder={t('admin:orders.search_placeholder')}
              prefix={<SearchOutlined />}
              allowClear
              className="w-full sm:w-60"
              value={filters.keyword}
              onChange={(e) => handleSearch(e.target.value)}
            />
            
            <Button
              type={isFilterVisible ? "primary" : "default"}
              icon={<FilterOutlined />}
              onClick={() => setIsFilterVisible(!isFilterVisible)}
            >
              {t('admin:actions.filter')}
            </Button>
            
            {(filters.statuses.length > 0 || filters.dateRange !== null || filters.keyword) && (
              <Button danger onClick={handleResetFilters}>
                {t('admin:actions.clear_all')}
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Text className="mr-2 whitespace-nowrap">{t('admin:sort.sort_by')}:</Text>
            <Select
              defaultValue="createdAt,desc"
              style={{ width: 150 }}
              onChange={(value) => console.log(value)}
            >
              <Option value="createdAt,desc">{t('admin:sort.newest')}</Option>
              <Option value="createdAt,asc">{t('admin:sort.oldest')}</Option>
              <Option value="totalAmount,desc">{t('admin:sort.amount_high_low')}</Option>
              <Option value="totalAmount,asc">{t('admin:sort.amount_low_high')}</Option>
            </Select>
          </div>
        </div>
        
        {/* Active filters display */}
        {(filters.statuses.length > 0 || filters.dateRange !== null) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.statuses.map((status) => (
              <Tag
                key={status}
                closable
                onClose={() => handleStatusFilterChange(filters.statuses.filter((s) => s !== status))}
              >
                {t(`admin:orders.statuses.${status.toLowerCase()}`)}
              </Tag>
            ))}
            
            {filters.dateRange && (
              <Tag
                closable
                onClose={() => dispatch(setDateRangeFilter(null))}
                icon={<CalendarOutlined />}
              >
                {formatDate(filters.dateRange[0])} - {formatDate(filters.dateRange[1])}
              </Tag>
            )}
          </div>
        )}
        
        {/* Advanced filter panel */}
        {isFilterVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="bg-gray-50 dark:bg-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <div className="mb-2 font-medium">{t('admin:orders.status')}:</div>
                  <OrderStatusFilter 
                    value={filters.statuses}
                    onChange={handleStatusFilterChange}
                  />
                </div>
                
                <div>
                  <div className="mb-2 font-medium">{t('admin:orders.date_range')}:</div>
                  <RangePicker 
                    className="w-full" 
                    onChange={(dates) => handleDateRangeChange(dates as [Dayjs | null, Dayjs | null] | null)} 
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
        
        {/* Order table */}
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => t('admin:pagination.total_items', { total }),
            onChange: (page) => dispatch(setCurrentPage(page)),
            onShowSizeChange: (_, size) => dispatch(setPageSize(size)),
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default OrderList;