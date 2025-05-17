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
  Dropdown,
  Badge,
  Drawer,
  Empty,
} from 'antd';
import type { Breakpoint } from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  FilterOutlined,
  CalendarOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchOrders, 
  fetchOrderAnalytics,
  exportOrders,
  setCurrentPage, 
  setPageSize,
  setKeywordFilter,
  setStatusFilter,
  setDateRangeFilter,
  resetFilters
} from '@/admin/store/slices/orderSlice';
import { type OrderResponse, OrderStatus, OrderStatusColors } from '@/admin/types/order.types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import OrderStatusFilter from './OrderStatusFilter';
import OrderAnalytics from './OrderAnalytics';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const OrderList: React.FC = () => {
  const { t } = useTranslation(['admin', 'admin-orders', 'common']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { 
    orders, 
    loading, 
    pagination, 
    filters,
    analytics, 
    exporting
  } = useAppSelector(state => state.orders);
  
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [mobileFilterDrawerVisible, setMobileFilterDrawerVisible] = useState(false);
  const [mobileViewWidth, setMobileViewWidth] = useState(window.innerWidth);
  
  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => setMobileViewWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isMobile = mobileViewWidth < 768;
  
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
  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
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
  
  // Handle export orders
  const handleExportOrders = (format: string) => {
    const params: {
      format: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    } = { format };
    
    if (filters.statuses.length === 1) {
      params.status = filters.statuses[0];
    }
    
    if (filters.dateRange) {
      params.startDate = filters.dateRange[0];
      params.endDate = filters.dateRange[1];
    }
    
    dispatch(exportOrders(params))
      .then((action) => {
        if (action.payload) {
          // Create a download link for the blob
          const blob = action.payload as Blob;
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const dateStr = new Date().toISOString().split('T')[0];
          a.download = `orders_export_${dateStr}.${format}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      });
  };
  
  // Get counts for statistics
  const getStatusCount = (status: OrderStatus) => {
    return analytics.countByStatus?.[status] || 0;
  };
  
  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.totalAmount, 0);
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
              onClick={() => handleViewOrder(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  // Mobile columns (simplified)
  const mobileColumns = [
    {
      title: t('admin-orders:orders.order_info'),
      key: 'orderInfo',
      render: (record: OrderResponse) => (
        <div onClick={() => handleViewOrder(record)} className="cursor-pointer">
          <div className="flex justify-between items-center">
            <span className="font-medium text-primary">{record.orderNumber}</span>
            <Tag color={OrderStatusColors[record.status]}>
              {t(`admin-orders:orders.statuses.${record.status.toLowerCase()}`)}
            </Tag>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatDate(record.createdAt)}
          </div>
          <div className="flex justify-between items-center mt-2">
            <span>{record.recipientName}</span>
            <span className="font-medium">{formatCurrency(record.totalAmount)}</span>
          </div>
        </div>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <Title level={2} className="mb-1 dark:text-white">
              {t('admin-orders:orders.title')}
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">
              {t('admin-orders:orders.subtitle')}
            </Text>
          </div>
          <div className="flex gap-2">
            <Dropdown 
              menu={{
                items: [
                  {
                    key: 'csv',
                    label: t('admin-orders:orders.export_csv'),
                    icon: <FileExcelOutlined />,
                    onClick: () => handleExportOrders('csv')
                  },
                  {
                    key: 'excel',
                    label: t('admin-orders:orders.export_excel'),
                    icon: <FileExcelOutlined />,
                    onClick: () => handleExportOrders('xlsx')
                  }
                ]
              }}
            >
              <Button icon={<DownloadOutlined />} loading={exporting}>
                {!isMobile && t('admin-orders:orders.actions.export')}
              </Button>
            </Dropdown>
            
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => dispatch(fetchOrders())}
              loading={loading}
            >
              {!isMobile && t('admin-orders:orders.actions.refresh')}
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Analytics summary */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="h-full">
              <Statistic
                title={t('admin-orders:orders.total_orders')}
                value={pagination.total}
                prefix={<ShoppingOutlined className="text-blue-500" />}
                loading={analytics.loading}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="h-full">
              <Statistic
                title={t('admin-orders:orders.total_revenue')}
                value={getTotalRevenue()}
                prefix={<DollarOutlined className="text-green-500" />}
                loading={analytics.loading}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="h-full">
              <Statistic
                title={t('admin-orders:orders.delivered_orders')}
                value={getStatusCount(OrderStatus.DELIVERED)}
                prefix={<CheckCircleOutlined className="text-green-500" />}
                loading={analytics.loading}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="h-full">
              <Statistic
                title={t('admin-orders:orders.cancelled_orders')}
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
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className="mt-4">
          {/* Search and filter bar */}
          <div className="flex flex-col lg:flex-row justify-between mb-4 gap-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-grow">
              <Input
                placeholder={t('admin-orders:orders.search_placeholder')}
                prefix={<SearchOutlined />}
                allowClear
                className="w-full sm:w-60"
                value={filters.keyword}
                onChange={(e) => handleSearch(e.target.value)}
              />
              
              {isMobile ? (
                <Button
                  type="default"
                  icon={<FilterOutlined />}
                  onClick={() => setMobileFilterDrawerVisible(true)}
                  className={filters.statuses.length > 0 || filters.dateRange !== null ? 'border-primary text-primary' : ''}
                >
                  {t('admin-orders:orders.filters')}
                  {(filters.statuses.length > 0 || filters.dateRange !== null) && (
                    <Badge count={filters.statuses.length + (filters.dateRange ? 1 : 0)} className="ml-1" />
                  )}
                </Button>
              ) : (
                <Button
                  type={isFilterVisible ? "primary" : "default"}
                  icon={<FilterOutlined />}
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                >
                  {t('admin-orders:orders.filters')}
                </Button>
              )}
              
              {(filters.statuses.length > 0 || filters.dateRange !== null || filters.keyword) && (
                <Button danger onClick={handleResetFilters}>
                  {t('admin-orders:orders.clear_filters')}
                </Button>
              )}
            </div>
            
            {!isMobile && (
              <div className="flex items-center gap-2">
                <Text className="mr-2 whitespace-nowrap">{t('admin-orders:orders.sort_by')}:</Text>
                <Select
                  defaultValue="createdAt,desc"
                  style={{ width: 150 }}
                  onChange={(value) => console.log(value)}
                >
                  <Select.Option value="createdAt,desc">{t('admin-orders:orders.newest')}</Select.Option>
                  <Select.Option value="createdAt,asc">{t('admin-orders:orders.oldest')}</Select.Option>
                  <Select.Option value="totalAmount,desc">{t('admin-orders:orders.amount_high_low')}</Select.Option>
                  <Select.Option value="totalAmount,asc">{t('admin-orders:orders.amount_low_high')}</Select.Option>
                </Select>
              </div>
            )}
          </div>
          
          {/* Active filters display */}
          {(filters.statuses.length > 0 || filters.dateRange !== null) && !isMobile && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.statuses.map((status) => (
                <Tag
                  key={status}
                  closable
                  onClose={() => handleStatusFilterChange(filters.statuses.filter((s) => s !== status))}
                  color={OrderStatusColors[status]}
                >
                  {t(`admin-orders:orders.statuses.${status.toLowerCase()}`)}
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
          {isFilterVisible && !isMobile && (
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
                    <div className="mb-2 font-medium">{t('admin-orders:orders.status')}:</div>
                    <OrderStatusFilter 
                      value={filters.statuses}
                      onChange={handleStatusFilterChange}
                    />
                  </div>
                  
                  <div>
                    <div className="mb-2 font-medium">{t('admin-orders:orders.date_range')}:</div>
                    <RangePicker 
                      className="w-full" 
                      onChange={(dates) => handleDateRangeChange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)} 
                      value={filters.dateRange ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])] : null}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
          
          {/* Mobile filter drawer */}
          <Drawer
            title={t('admin-orders:orders.filters')}
            placement="right"
            onClose={() => setMobileFilterDrawerVisible(false)}
            open={mobileFilterDrawerVisible}
            width={300}
          >
            <div className="space-y-6">
              <div>
                <div className="mb-2 font-medium">{t('admin-orders:orders.status')}:</div>
                <OrderStatusFilter 
                  value={filters.statuses}
                  onChange={handleStatusFilterChange}
                />
              </div>
              
              <div>
                <div className="mb-2 font-medium">{t('admin-orders:orders.date_range')}:</div>
                <RangePicker 
                  className="w-full" 
                  onChange={(dates) => handleDateRangeChange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)}
                  value={filters.dateRange ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])] : null}
                />
              </div>
              
              <div>
                <div className="mb-2 font-medium">{t('admin-orders:orders.sort_by')}:</div>
                <Select
                  defaultValue="createdAt,desc"
                  style={{ width: '100%' }}
                  onChange={(value) => console.log(value)}
                >
                  <Select.Option value="createdAt,desc">{t('admin-orders:orders.newest')}</Select.Option>
                  <Select.Option value="createdAt,asc">{t('admin-orders:orders.oldest')}</Select.Option>
                  <Select.Option value="totalAmount,desc">{t('admin-orders:orders.amount_high_low')}</Select.Option>
                  <Select.Option value="totalAmount,asc">{t('admin-orders:orders.amount_low_high')}</Select.Option>
                </Select>
              </div>
              
              <div className="pt-4 border-t">
                <Button danger block onClick={handleResetFilters}>
                  {t('admin-orders:orders.clear_filters')}
                </Button>
              </div>
            </div>
          </Drawer>
          
          {/* Order table */}
          {orders.length === 0 ? (
            <Empty
              description={
                <div>
                  <p>{t('admin-orders:orders.no_orders')}</p>
                  <p className="text-gray-500">{t('admin-orders:orders.no_orders_message')}</p>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <Table
              columns={isMobile ? mobileColumns : columns}
              dataSource={orders}
              rowKey="id"
              loading={loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showTotal: (total) => t('admin-orders:orders.total_items', { total }),
                onChange: (page) => dispatch(setCurrentPage(page)),
                onShowSizeChange: (_, size) => dispatch(setPageSize(size)),
              }}
              scroll={{ x: 'max-content' }}
              rowClassName="cursor-pointer hover:bg-gray-50 transition-colors"
              onRow={(record) => ({
                onClick: () => handleViewOrder(record),
              })}
            />
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default OrderList;