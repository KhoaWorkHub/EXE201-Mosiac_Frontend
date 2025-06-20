/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/orders/pages/OrderDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Breadcrumb,
  Button,
  Tag,
  Divider,
  Space,
  Modal,
  Image,
  Spin,
  Avatar,
  Tabs,
  Rate,
  Input,
  message,
  QRCode
} from 'antd';
import {
  ArrowLeftOutlined,
  CopyOutlined,
  DownloadOutlined,
  PrinterOutlined,
  MessageOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  TruckOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StarOutlined,
  ShareAltOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/layout/MainLayout';
import OrderStatusTracker from '../components/OrderStatusTracker';
import PaymentUploadComponent from '../components/PaymentUploadComponent';
import { formatVND } from '@/utils/formatters';
import { Order, OrderStatus } from '@/types/order.types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

// Mock order detail data
const mockOrderDetail: Order = {
  id: '1' as any,
  orderNumber: 'MOSAIC001234',
  status: OrderStatus.DELIVERED,
  items: [
    {
      id: '1' as any,
      productId: '1' as any,
      productName: 'Áo Mosaic Hà Nội',
      productImage: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      productSlug: 'ao-dai-truyen-thong-do',
      variantInfo: 'Size M, Màu Đỏ',
      price: 890000,
      quantity: 1,
      subtotal: 890000
    },
    {
      id: '2' as any,
      productId: '2' as any,
      productName: 'Áo Mosaic Khánh Hoà',
      productImage: 'https://images.unsplash.com/photo-1624371711241-e15e6d554040?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      productSlug: 'phu-kien-man-cai',
      price: 120000,
      quantity: 2,
      subtotal: 240000
    }
  ],
  shippingAddress: {
    recipientName: 'Nguyễn Thị Mai',
    phone: '0901234567',
    streetAddress: '123 Đường Nguyễn Văn Cừ',
    ward: 'Phường An Hòa',
    district: 'Quận Ninh Kiều',
    province: 'Cần Thơ',
    fullAddress: '123 Đường Nguyễn Văn Cừ, Phường An Hòa, Quận Ninh Kiều, Cần Thơ'
  },
  totalAmount: 1130000,
  shippingFee: 30000,
  tax: 113000,
  grandTotal: 1273000,
  paymentMethod: 'MOMO',
  paymentProofs: [
    {
      id: '1' as any,
      imageUrl: 'https://via.placeholder.com/400x600/ff69b4/ffffff?text=MoMo+Payment+Proof',
      paymentMethod: 'MOMO',
      uploadedAt: '2024-12-15T09:15:00Z',
      verified: true
    }
  ],
  notes: 'Vui lòng giao hàng vào buổi chiều, sau 2h. Cảm ơn!',
  estimatedDeliveryDate: '2024-12-20T10:00:00Z',
  actualDeliveryDate: '2024-12-19T14:30:00Z',
  trackingNumber: 'VN123456789',
  createdAt: '2024-12-15T09:00:00Z',
  updatedAt: '2024-12-19T14:30:00Z',
  statusHistory: [
    {
      status: OrderStatus.PENDING_PAYMENT,
      timestamp: '2024-12-15T09:00:00Z',
      notes: 'Đơn hàng được tạo thành công',
      updatedBy: 'Hệ thống'
    },
    {
      status: OrderStatus.PAID,
      timestamp: '2024-12-15T09:15:00Z',
      notes: 'Thanh toán MoMo đã được xác nhận',
      updatedBy: 'Admin'
    },
    {
      status: OrderStatus.PROCESSING,
      timestamp: '2024-12-15T10:00:00Z',
      notes: 'Bắt đầu chuẩn bị và đóng gói sản phẩm',
      updatedBy: 'Kho hàng'
    },
    {
      status: OrderStatus.SHIPPING,
      timestamp: '2024-12-16T08:00:00Z',
      notes: 'Đã bàn giao cho đơn vị vận chuyển Viettel Post',
      updatedBy: 'Kho hàng'
    },
    {
      status: OrderStatus.DELIVERED,
      timestamp: '2024-12-19T14:30:00Z',
      notes: 'Giao hàng thành công. Khách hàng đã ký nhận.',
      updatedBy: 'Nhân viên giao hàng'
    }
  ]
};

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
useTranslation(['orders', 'common']);
  
  // Component state
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [reviewForm, setReviewForm] = useState<{[key: string]: { rating: number; comment: string }}>({});

  // Load order data
  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (orderId === '1') {
          setOrder(mockOrderDetail);
        } else {
          // Order not found
          setOrder(null);
        }
      } catch (error) {
        console.error('Error loading order:', error);
        message.error('Có lỗi xảy ra khi tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-96">
          <Spin size="large" tip="Đang tải thông tin đơn hàng..." />
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <Title level={3} className="text-gray-500 mb-4">
              Không tìm thấy đơn hàng
            </Title>
            <Text className="text-gray-400 mb-6">
              Đơn hàng #{orderId} không tồn tại hoặc bạn không có quyền xem.
            </Text>
            <Button type="primary" onClick={() => navigate('/orders')}>
              Quay lại danh sách đơn hàng
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Handle actions
  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    message.success('Đã copy mã đơn hàng!');
  };

  const handleCancelOrder = () => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      okText: 'Hủy đơn hàng',
      okType: 'danger',
      cancelText: 'Đóng',
      onOk() {
        message.success('Đơn hàng đã được hủy');
        navigate('/orders');
      }
    });
  };

  const handleReorder = () => {
    message.success('Đã thêm sản phẩm vào giỏ hàng!');
    navigate('/cart');
  };

  const handlePaymentProofUpload = async (_file: File, _method: 'MOMO' | 'BANK_TRANSFER') => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    message.success('Upload minh chứng thanh toán thành công!');
    setShowPaymentModal(false);
  };

  // Render order header
  const renderOrderHeader = () => (
    <Card className="mb-6">
      <div className="flex flex-wrap justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <Title level={3} className="m-0">
              Đơn hàng #{order.orderNumber}
            </Title>
            <Button 
              type="text" 
              size="small"
              icon={<CopyOutlined />}
              onClick={handleCopyOrderNumber}
              className="text-gray-500 hover:text-primary"
            />
          </div>
          
          <div className="space-y-2 text-gray-600">
            <div>
              <ClockCircleOutlined className="mr-2" />
              Đặt hàng: {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
            </div>
            {order.trackingNumber && (
              <div>
                <TruckOutlined className="mr-2" />
                Mã vận đơn: <Text strong>{order.trackingNumber}</Text>
              </div>
            )}
            {order.estimatedDeliveryDate && (
              <div>
                <CheckCircleOutlined className="mr-2" />
                Dự kiến giao: {dayjs(order.estimatedDeliveryDate).format('DD/MM/YYYY')}
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          <Title level={2} className="text-primary m-0 mb-2">
            {formatVND(order.grandTotal)}
          </Title>
          <Text className="text-gray-500">
            {order.items.length} sản phẩm
          </Text>
        </div>
      </div>

      {/* Action buttons */}
      <Divider />
      <Space wrap>
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/orders')}
        >
          Quay lại
        </Button>
        
        <Button 
          icon={<PrinterOutlined />}
          onClick={() => window.print()}
        >
          In đơn hàng
        </Button>
        
        <Button 
          icon={<DownloadOutlined />}
          onClick={() => message.info('Tính năng xuất PDF đang phát triển')}
        >
          Xuất PDF
        </Button>
        
        <Button 
          icon={<ShareAltOutlined />}
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            message.success('Đã copy link đơn hàng!');
          }}
        >
          Chia sẻ
        </Button>

        {order.status === OrderStatus.PENDING_PAYMENT && (
          <>
            <Button 
              type="primary"
              icon={<DollarOutlined />}
              onClick={() => setShowPaymentModal(true)}
            >
              Thanh toán ngay
            </Button>
            <Button 
              danger
              icon={<ExclamationCircleOutlined />}
              onClick={handleCancelOrder}
            >
              Hủy đơn hàng
            </Button>
          </>
        )}

        {order.status === OrderStatus.DELIVERED && (
          <Button 
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleReorder}
          >
            Mua lại
          </Button>
        )}

        {order.trackingNumber && order.status === OrderStatus.SHIPPING && (
          <Button 
            type="primary"
            icon={<TruckOutlined />}
            onClick={() => window.open(`https://tracking.example.com/${order.trackingNumber}`, '_blank')}
          >
            Theo dõi vận chuyển
          </Button>
        )}
      </Space>
    </Card>
  );

  // Render order overview tab
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Order Status */}
      <OrderStatusTracker
        currentStatus={order.status}
        statusHistory={order.statusHistory}
        orderNumber={order.orderNumber}
        estimatedDeliveryDate={order.estimatedDeliveryDate}
        trackingNumber={order.trackingNumber}
        showTimeline={true}
      />

      <Row gutter={[24, 24]}>
        {/* Order Items */}
        <Col xs={24} lg={16}>
          <Card title="Sản phẩm đã đặt" className="h-full">
            <div className="space-y-4">
              {order.items.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                      preview={{
                        onVisibleChange: (visible) => {
                          if (visible) setSelectedImage(item.productImage);
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <Link 
                      to={`/products/${item.productSlug}`}
                      className="font-medium text-gray-800 hover:text-primary block mb-1"
                    >
                      {item.productName}
                    </Link>
                    {item.variantInfo && (
                      <Text className="text-sm text-gray-500 block mb-1">
                        {item.variantInfo}
                      </Text>
                    )}
                    <Text className="text-sm">
                      Số lượng: {item.quantity} × {formatVND(item.price)}
                    </Text>
                  </div>
                  
                  <div className="text-right">
                    <Text strong className="text-lg">
                      {formatVND(item.subtotal)}
                    </Text>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order summary */}
            <Divider />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Text>Tạm tính:</Text>
                <Text>{formatVND(order.totalAmount)}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Phí vận chuyển:</Text>
                <Text>{formatVND(order.shippingFee)}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Thuế VAT:</Text>
                <Text>{formatVND(order.tax)}</Text>
              </div>
              <Divider />
              <div className="flex justify-between">
                <Text strong className="text-lg">Tổng cộng:</Text>
                <Text strong className="text-xl text-primary">
                  {formatVND(order.grandTotal)}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Order Info */}
        <Col xs={24} lg={8}>
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card title={
              <span>
                <EnvironmentOutlined className="mr-2" />
                Địa chỉ giao hàng
              </span>
            }>
              <div className="space-y-2">
                <Text strong className="block">{order.shippingAddress.recipientName}</Text>
                <Text className="flex items-center">
                  <PhoneOutlined className="mr-2" />
                  {order.shippingAddress.phone}
                </Text>
                <Text className="text-gray-600">
                  {order.shippingAddress.fullAddress}
                </Text>
              </div>
            </Card>

            {/* Payment Info */}
            <Card title={
              <span>
                <DollarOutlined className="mr-2" />
                Thông tin thanh toán
              </span>
            }>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text>Phương thức:</Text>
                  <Tag color={
                    order.paymentMethod === 'MOMO' ? 'pink' :
                    order.paymentMethod === 'BANK_TRANSFER' ? 'blue' : 'orange'
                  }>
                    {order.paymentMethod === 'MOMO' ? 'MoMo' :
                     order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'COD'}
                  </Tag>
                </div>
                
                {order.paymentProofs.length > 0 && (
                  <div>
                    <Text className="block mb-2">Minh chứng thanh toán:</Text>
                    <div className="grid grid-cols-2 gap-2">
                      {order.paymentProofs.map(proof => (
                        <div 
                          key={proof.id}
                          className="relative cursor-pointer border rounded overflow-hidden hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedImage(proof.imageUrl);
                            setShowImageModal(true);
                          }}
                        >
                          <img 
                            src={proof.imageUrl} 
                            alt="Payment proof"
                            className="w-full h-20 object-cover"
                          />
                          {proof.verified && (
                            <div className="absolute top-1 right-1">
                              <Avatar size="small" style={{ backgroundColor: '#52c41a' }}>
                                ✓
                              </Avatar>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Order Notes */}
            {order.notes && (
              <Card title={
                <span>
                  <MessageOutlined className="mr-2" />
                  Ghi chú đơn hàng
                </span>
              }>
                <Text className="text-gray-600">
                  {order.notes}
                </Text>
              </Card>
            )}

            {/* Security Badge */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="text-center">
                <SafetyOutlined className="text-2xl text-green-500 mb-2" />
                <Text strong className="block text-green-700 mb-1">
                  Đơn hàng được bảo vệ
                </Text>
                <Text className="text-sm text-green-600">
                  Thanh toán an toàn và đảm bảo chất lượng
                </Text>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );

  // Render reviews tab
  const renderReviewsTab = () => (
    <Card title="Đánh giá sản phẩm">
      {order.status === OrderStatus.DELIVERED ? (
        <div className="space-y-6">
          {order.items.map(item => (
            <div key={item.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start space-x-4 mb-4">
                <img 
                  src={item.productImage} 
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <Text strong className="block mb-1">{item.productName}</Text>
                  {item.variantInfo && (
                    <Text className="text-sm text-gray-500">{item.variantInfo}</Text>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Text strong className="block mb-2">Đánh giá chất lượng:</Text>
                  <Rate 
                    allowHalf 
                    value={reviewForm[item.id]?.rating || 0}
                    onChange={(value) => setReviewForm(prev => ({
                      ...prev,
                      [item.id]: { ...prev[item.id], rating: value }
                    }))}
                  />
                </div>
                
                <div>
                  <Text strong className="block mb-2">Nhận xét:</Text>
                  <TextArea 
                    rows={3} 
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    value={reviewForm[item.id]?.comment || ''}
                    onChange={(e) => setReviewForm(prev => ({
                      ...prev,
                      [item.id]: { ...prev[item.id], comment: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-center">
            <Button 
              type="primary" 
              size="large"
              icon={<StarOutlined />}
              onClick={() => {
                message.success('Cảm ơn bạn đã đánh giá!');
              }}
            >
              Gửi đánh giá
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Text className="text-gray-500">
            Bạn có thể đánh giá sản phẩm sau khi đơn hàng được giao thành công.
          </Text>
        </div>
      )}
    </Card>
  );

  // Render documents tab
  const renderDocumentsTab = () => (
    <Card title="Tài liệu đơn hàng">
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileTextOutlined className="text-2xl text-blue-500" />
              <div>
                <Text strong className="block">Hóa đơn điện tử</Text>
                <Text className="text-sm text-gray-500">
                  Invoice_{order.orderNumber}.pdf
                </Text>
              </div>
            </div>
            <Space>
              <Button icon={<DownloadOutlined />}>Tải xuống</Button>
              <Button icon={<PrinterOutlined />}>In</Button>
            </Space>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TruckOutlined className="text-2xl text-green-500" />
              <div>
                <Text strong className="block">Phiếu giao hàng</Text>
                <Text className="text-sm text-gray-500">
                  DeliveryNote_{order.orderNumber}.pdf
                </Text>
              </div>
            </div>
            <Space>
              <Button icon={<DownloadOutlined />}>Tải xuống</Button>
              <Button icon={<PrinterOutlined />}>In</Button>
            </Space>
          </div>
        </div>

        {/* QR Code for order */}
        <div className="border rounded-lg p-4 text-center">
          <Text strong className="block mb-4">Mã QR đơn hàng</Text>
          <div className="flex justify-center mb-4">
            <QRCode value={`https://mosaic.com/orders/${order.id}`} size={128} />
          </div>
          <Text className="text-sm text-gray-500">
            Quét mã QR để xem thông tin đơn hàng
          </Text>
        </div>
      </div>
    </Card>
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item href="/orders">Đơn hàng</Breadcrumb.Item>
          <Breadcrumb.Item>#{order.orderNumber}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Order Header */}
        {renderOrderHeader()}

        {/* Main Content */}
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
            <TabPane 
              tab={
                <span>
                  <FileTextOutlined className="mr-2" />
                  Tổng quan
                </span>
              } 
              key="overview"
            >
              {renderOverviewTab()}
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <StarOutlined className="mr-2" />
                  Đánh giá
                </span>
              } 
              key="reviews"
            >
              {renderReviewsTab()}
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <DownloadOutlined className="mr-2" />
                  Tài liệu
                </span>
              } 
              key="documents"
            >
              {renderDocumentsTab()}
            </TabPane>
          </Tabs>
        </Card>

        {/* Payment Modal */}
        <Modal
          title="Thanh toán đơn hàng"
          open={showPaymentModal}
          onCancel={() => setShowPaymentModal(false)}
          footer={null}
          width="90%"
          style={{ maxWidth: 1200 }}
          destroyOnClose
        >
          <PaymentUploadComponent
            orderNumber={order.orderNumber}
            totalAmount={order.grandTotal}
            onPaymentProofUpload={handlePaymentProofUpload}
            onComplete={() => setShowPaymentModal(false)}
          />
        </Modal>

        {/* Image Modal */}
        <Modal
          open={showImageModal}
          footer={null}
          onCancel={() => setShowImageModal(false)}
          width="80%"
          style={{ maxWidth: 800 }}
          centered
        >
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Payment proof"
              className="w-full"
              preview={false}
            />
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default OrderDetailPage;