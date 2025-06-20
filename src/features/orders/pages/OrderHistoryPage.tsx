/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/orders/pages/OrderHistoryPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Tag,
  Button,
  Input,
  DatePicker,
  Select,
  Space,
  Empty,
  Spin,
  Row,
  Col,
  Statistic,
  Breadcrumb,
  Tabs,
  Avatar,
  Tooltip,
  Modal,
  Rate,
  message
} from 'antd';
import {
  ShoppingOutlined,
  SearchOutlined,
  EyeOutlined,
  ReloadOutlined,
  FilterOutlined,
  CalendarOutlined,
  DollarOutlined,
  TruckOutlined,
  StarOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layout/MainLayout';
import { formatVND } from '@/utils/formatters';
import { Order, OrderStatus } from '@/types/order.types';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1' as any,
    orderNumber: 'MOSAIC001234',
    status: OrderStatus.DELIVERED,
    items: [
      {
        id: '1' as any,
        productId: '1' as any,
        productName: 'Áo Dài Truyền Thống Đỏ',
        productImage: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        productSlug: 'ao-dai-truyen-thong-do',
        price: 890000,
        quantity: 1,
        subtotal: 890000
      }
    ],
    shippingAddress: {
      recipientName: 'Nguyễn Văn A',
      phone: '0901234567',
      streetAddress: '123 Đường ABC',
      ward: 'Phường XYZ',
      district: 'Quận 1',
      province: 'TP.HCM',
      fullAddress: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM'
    },
    totalAmount: 890000,
    shippingFee: 0,
    tax: 89000,
    grandTotal: 979000,
    paymentMethod: 'MOMO',
    paymentProofs: [],
    estimatedDeliveryDate: '2024-12-20T10:00:00Z',
    actualDeliveryDate: '2024-12-19T14:30:00Z',
    trackingNumber: 'TN123456789',
    createdAt: '2024-12-15T09:00:00Z',
    updatedAt: '2024-12-19T14:30:00Z',
    statusHistory: [
      {
        status: OrderStatus.PENDING_PAYMENT,
        timestamp: '2024-12-15T09:00:00Z',
        notes: 'Đơn hàng được tạo'
      },
      {
        status: OrderStatus.PAID,
        timestamp: '2024-12-15T09:15:00Z',
        notes: 'Thanh toán được xác nhận'
      },
      {
        status: OrderStatus.PROCESSING,
        timestamp: '2024-12-15T10:00:00Z',
        notes: 'Đang chuẩn bị hàng'
      },
      {
        status: OrderStatus.SHIPPING,
        timestamp: '2024-12-16T08:00:00Z',
        notes: 'Đang vận chuyển'
      },
      {
        status: OrderStatus.DELIVERED,
        timestamp: '2024-12-19T14:30:00Z',
        notes: 'Giao hàng thành công'
      }
    ]
  },
  {
    id: '2' as any,
    orderNumber: 'MOSAIC001235',
    status: OrderStatus.SHIPPING,
    items: [
      {
        id: '2' as any,
        productId: '2' as any,
        productName: 'Áo Dài Hiện Đại Xanh',
        productImage: 'https://images.unsplash.com/photo-1624371711241-e15e6d554040?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        productSlug: 'ao-dai-hien-dai-xanh',
        price: 1200000,
        quantity: 1,
        subtotal: 1200000
      }
    ],
    shippingAddress: {
      recipientName: 'Trần Thị B',
      phone: '0987654321',
      streetAddress: '456 Đường DEF',
      ward: 'Phường UVW',
      district: 'Quận 3',
      province: 'TP.HCM',
      fullAddress: '456 Đường DEF, Phường UVW, Quận 3, TP.HCM'
    },
    totalAmount: 1200000,
    shippingFee: 30000,
    tax: 120000,
    grandTotal: 1350000,
    paymentMethod: 'BANK_TRANSFER',
    paymentProofs: [],
    estimatedDeliveryDate: '2024-12-25T10:00:00Z',
    trackingNumber: 'TN987654321',
    createdAt: '2024-12-20T14:00:00Z',
    updatedAt: '2024-12-22T08:00:00Z',
    statusHistory: [
      {
        status: OrderStatus.PENDING_PAYMENT,
        timestamp: '2024-12-20T14:00:00Z',
        notes: 'Đơn hàng được tạo'
      },
      {
        status: OrderStatus.PAID,
        timestamp: '2024-12-20T14:30:00Z',
        notes: 'Thanh toán được xác nhận'
      },
      {
        status: OrderStatus.PROCESSING,
        timestamp: '2024-12-21T09:00:00Z',
        notes: 'Đang chuẩn bị hàng'
      },
      {
        status: OrderStatus.SHIPPING,
        timestamp: '2024-12-22T08:00:00Z',
        notes: 'Đã bàn giao cho đơn vị vận chuyển'
      }
    ]
  },
  {
    id: '3' as any,
    orderNumber: 'MOSAIC001236',
    status: OrderStatus.PENDING_PAYMENT,
    items: [
      {
        id: '3' as any,
        productId: '3' as any,
        productName: 'Set Áo Dài Cưới Vàng',
        productImage: 'https://images.unsplash.com/photo-1557750255-c76072a7fdf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        productSlug: 'set-ao-dai-cuoi-vang',
        price: 2500000,
        quantity: 1,
        subtotal: 2500000
      }
    ],
    shippingAddress: {
      recipientName: 'Lê Thị C',
      phone: '0912345678',
      streetAddress: '789 Đường GHI',
      ward: 'Phường JKL',
      district: 'Quận 7',
      province: 'TP.HCM',
      fullAddress: '789 Đường GHI, Phường JKL, Quận 7, TP.HCM'
    },
    totalAmount: 2500000,
    shippingFee: 0,
    tax: 250000,
    grandTotal: 2750000,
    paymentMethod: 'BANK_TRANSFER',
    paymentProofs: [],
    createdAt: '2024-12-23T16:00:00Z',
    updatedAt: '2024-12-23T16:00:00Z',
    statusHistory: [
      {
        status: OrderStatus.PENDING_PAYMENT,
        timestamp: '2024-12-23T16:00:00Z',
        notes: 'Đơn hàng được tạo, chờ thanh toán'
      }
    ]
  }
];

const OrderHistoryPage: React.FC = () => {
useTranslation(['orders', 'common']);
  const navigate = useNavigate();

  // Component state
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, ] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [reviewModal, setReviewModal] = useState<{ visible: boolean; order: Order | null }>({
    visible: false,
    order: null
  });

  // Status configuration
  const statusConfig = {
    [OrderStatus.PENDING_PAYMENT]: {
      label: 'Chờ thanh toán',
      color: 'orange',
      icon: '💳'
    },
    [OrderStatus.PAID]: {
      label: 'Đã thanh toán',
      color: 'green',
      icon: '✅'
    },
    [OrderStatus.PROCESSING]: {
      label: 'Đang xử lý',
      color: 'blue',
      icon: '⚙️'
    },
    [OrderStatus.SHIPPING]: {
      label: 'Đang vận chuyển',
      color: 'purple',
      icon: '🚚'
    },
    [OrderStatus.DELIVERED]: {
      label: 'Đã giao hàng',
      color: 'green',
      icon: '📦'
    },
    [OrderStatus.CANCELLED]: {
      label: 'Đã hủy',
      color: 'red',
      icon: '❌'
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Filter by search text
    if (searchText && !order.orderNumber.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }

    // Filter by status
    if (statusFilter !== 'ALL' && order.status !== statusFilter) {
      return false;
    }

    // Filter by date range
    if (dateRange) {
      const orderDate = dayjs(order.createdAt);
      if (!orderDate.isBetween(dateRange[0], dateRange[1], 'day', '[]')) {
        return false;
      }
    }

    return true;
  });

  // Get orders by status for tabs
  const getOrdersByStatus = (status: OrderStatus | 'ALL') => {
    if (status === 'ALL') return orders;
    return orders.filter(order => order.status === status);
  };

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === OrderStatus.PENDING_PAYMENT).length,
    processing: orders.filter(o => o.status === OrderStatus.PROCESSING).length,
    shipping: orders.filter(o => o.status === OrderStatus.SHIPPING).length,
    delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
    totalValue: orders.reduce((sum, order) => sum + order.grandTotal, 0)
  };

  // Handle order cancellation
  const handleCancelOrder = (order: Order) => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn hủy đơn hàng ${order.orderNumber}?`,
      okText: 'Hủy đơn hàng',
      okType: 'danger',
      cancelText: 'Đóng',
      onOk() {
        // Mock cancellation
        setOrders(prev => prev.map(o => 
          o.id === order.id 
            ? { ...o, status: OrderStatus.CANCELLED, updatedAt: new Date().toISOString() }
            : o
        ));
        message.success('Đơn hàng đã được hủy thành công');
      }
    });
  };

  // Handle reorder
  const handleReorder = (_order: Order) => {
    message.success('Đã thêm sản phẩm vào giỏ hàng!');
    navigate('/cart');
  };

  // Render order card
  const renderOrderCard = (order: Order) => {
    const config = statusConfig[order.status];
    
    return (
      <motion.div
        key={order.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="mb-6"
      >
        <Card className="hover:shadow-lg transition-all duration-300">
          {/* Order header */}
          <div className="flex flex-wrap justify-between items-start mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Title level={5} className="m-0">
                  #{order.orderNumber}
                </Title>
                <Tag color={config.color} className="flex items-center">
                  <span className="mr-1">{config.icon}</span>
                  {config.label}
                </Tag>
              </div>
              <div className="text-sm text-gray-500 space-x-4">
                <span>Đặt hàng: {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                {order.trackingNumber && (
                  <span>Mã vận đơn: {order.trackingNumber}</span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <Text strong className="text-lg text-primary block">
                {formatVND(order.grandTotal)}
              </Text>
              <Text className="text-sm text-gray-500">
                {order.items.length} sản phẩm
              </Text>
            </div>
          </div>

          {/* Order items */}
          <div className="border-t pt-4 mb-4">
            <div className="space-y-3">
              {order.items.slice(0, 2).map(item => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.productImage} 
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link 
                      to={`/products/${item.productSlug}`}
                      className="text-gray-800 hover:text-primary font-medium block"
                    >
                      {item.productName}
                    </Link>
                    <Text className="text-sm text-gray-500">
                      Số lượng: {item.quantity} × {formatVND(item.price)}
                    </Text>
                  </div>
                  <Text strong>{formatVND(item.subtotal)}</Text>
                </div>
              ))}
              
              {order.items.length > 2 && (
                <Text className="text-sm text-gray-500 text-center block">
                  Và {order.items.length - 2} sản phẩm khác...
                </Text>
              )}
            </div>
          </div>

          {/* Order actions */}
          <div className="border-t pt-4 flex flex-wrap gap-2 justify-between items-center">
            <Space wrap>
              <Button 
                type="primary" 
                icon={<EyeOutlined />}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                Xem chi tiết
              </Button>
              
              {order.status === OrderStatus.PENDING_PAYMENT && (
                <Button 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleCancelOrder(order)}
                >
                  Hủy đơn hàng
                </Button>
              )}
              
              {order.status === OrderStatus.DELIVERED && (
                <>
                  <Button 
                    icon={<StarOutlined />}
                    onClick={() => setReviewModal({ visible: true, order })}
                  >
                    Đánh giá
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />}
                    onClick={() => handleReorder(order)}
                  >
                    Mua lại
                  </Button>
                </>
              )}
              
              {order.status === OrderStatus.SHIPPING && order.trackingNumber && (
                <Button 
                  icon={<TruckOutlined />}
                  onClick={() => window.open(`https://tracking.example.com/${order.trackingNumber}`, '_blank')}
                >
                  Theo dõi vận chuyển
                </Button>
              )}
            </Space>
            
            <Text className="text-sm text-gray-500">
              Cập nhật: {dayjs(order.updatedAt).fromNow()}
            </Text>
          </div>
        </Card>
      </motion.div>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <Empty
        image={<ShoppingOutlined style={{ fontSize: 64 }} className="text-gray-300" />}
        description={
          <div>
            <Title level={4} className="text-gray-500 mb-2">
              Chưa có đơn hàng nào
            </Title>
            <Text className="text-gray-400">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </Text>
          </div>
        }
      >
        <Button type="primary" onClick={() => navigate('/products')}>
          Bắt đầu mua sắm
        </Button>
      </Empty>
    </motion.div>
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item>Lịch sử đơn hàng</Breadcrumb.Item>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <Title level={2} className="mb-4">
            <ShoppingOutlined className="mr-3" />
            Lịch sử đơn hàng
          </Title>
          
          {/* Statistics */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Tổng đơn hàng"
                  value={stats.total}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Đang xử lý"
                  value={stats.processing + stats.shipping}
                  prefix={<TruckOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Đã giao"
                  value={stats.delivered}
                  prefix={<Avatar size="small" style={{ backgroundColor: '#52c41a' }}>✓</Avatar>}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic
                  title="Tổng giá trị"
                  value={stats.totalValue}
                  formatter={(value) => formatVND(Number(value))}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder="Trạng thái"
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full"
                suffixIcon={<FilterOutlined />}
              >
                <Option value="ALL">Tất cả trạng thái</Option>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <Option key={status} value={status}>
                    <span className="mr-2">{config.icon}</span>
                    {config.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <RangePicker
                placeholder={['Từ ngày', 'Đến ngày']}
                value={dateRange}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setDateRange([dates[0], dates[1]]);
                  } else {
                    setDateRange(null);
                  }
                }}
                className="w-full"
                suffixIcon={<CalendarOutlined />}
              />
            </Col>
            <Col xs={24} sm={2}>
              <Tooltip title="Làm mới">
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setSearchText('');
                    setStatusFilter('ALL');
                    setDateRange(null);
                    setActiveTab('ALL');
                  }}
                />
              </Tooltip>
            </Col>
          </Row>
        </Card>

        {/* Orders */}
        <Card>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            tabBarExtraContent={
              <Text className="text-gray-500">
                {filteredOrders.length} đơn hàng
              </Text>
            }
          >
            <TabPane 
              tab={
                <span>
                  <Avatar size="small" className="mr-2">All</Avatar>
                  Tất cả ({orders.length})
                </span>
              } 
              key="ALL"
            />
            <TabPane 
              tab={
                <span>
                  <Avatar size="small" style={{ backgroundColor: '#faad14' }} className="mr-2">💳</Avatar>
                  Chờ thanh toán ({getOrdersByStatus(OrderStatus.PENDING_PAYMENT).length})
                </span>
              } 
              key={OrderStatus.PENDING_PAYMENT}
            />
            <TabPane 
              tab={
                <span>
                  <Avatar size="small" style={{ backgroundColor: '#1890ff' }} className="mr-2">⚙️</Avatar>
                  Đang xử lý ({getOrdersByStatus(OrderStatus.PROCESSING).length})
                </span>
              } 
              key={OrderStatus.PROCESSING}
            />
            <TabPane 
              tab={
                <span>
                  <Avatar size="small" style={{ backgroundColor: '#722ed1' }} className="mr-2">🚚</Avatar>
                  Đang giao ({getOrdersByStatus(OrderStatus.SHIPPING).length})
                </span>
              } 
              key={OrderStatus.SHIPPING}
            />
            <TabPane 
              tab={
                <span>
                  <Avatar size="small" style={{ backgroundColor: '#52c41a' }} className="mr-2">📦</Avatar>
                  Đã giao ({getOrdersByStatus(OrderStatus.DELIVERED).length})
                </span>
              } 
              key={OrderStatus.DELIVERED}
            />
          </Tabs>

          <div className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <Spin size="large" tip="Đang tải đơn hàng..." />
              </div>
            ) : filteredOrders.length === 0 ? (
              renderEmptyState()
            ) : (
              <AnimatePresence>
                {filteredOrders.map(order => renderOrderCard(order))}
              </AnimatePresence>
            )}
          </div>
        </Card>

        {/* Review Modal */}
        <Modal
          title="Đánh giá sản phẩm"
          open={reviewModal.visible}
          onCancel={() => setReviewModal({ visible: false, order: null })}
          footer={[
            <Button key="cancel" onClick={() => setReviewModal({ visible: false, order: null })}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" onClick={() => {
              message.success('Cảm ơn bạn đã đánh giá!');
              setReviewModal({ visible: false, order: null });
            }}>
              Gửi đánh giá
            </Button>
          ]}
          width={600}
        >
          {reviewModal.order && (
            <div>
              {reviewModal.order.items.map(item => (
                <div key={item.id} className="border-b pb-4 mb-4 last:border-b-0 last:mb-0">
                  <div className="flex items-start space-x-3 mb-3">
                    <img 
                      src={item.productImage} 
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <Text strong className="block">{item.productName}</Text>
                      <Text className="text-gray-500">Số lượng: {item.quantity}</Text>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <Text strong className="block mb-2">Đánh giá chất lượng:</Text>
                    <Rate allowHalf defaultValue={5} />
                  </div>
                  
                  <div>
                    <Text strong className="block mb-2">Nhận xét:</Text>
                    <TextArea 
                      rows={3} 
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default OrderHistoryPage;