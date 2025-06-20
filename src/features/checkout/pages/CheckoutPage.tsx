/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/checkout/pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Radio,
  Input,
  Form,
  message,
  Steps,
  Alert,
  Empty,
  Spin,
  Tag,
  Breadcrumb,
  Modal
} from 'antd';
import {
  ShoppingCartOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  LeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
  TruckOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../../components/layout/MainLayout';
import { useCart } from '../../../contexts/CartContext';
import { formatVND } from '../../../utils/formatters';
import PaymentUploadComponent from '../../../features/orders/components/PaymentUploadComponent';
import { Order } from '../../../types/order.types';

const { Title, Text } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

interface CheckoutAddress {
  id: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  isDefault: boolean;
}

// Mock addresses data
const mockAddresses: CheckoutAddress[] = [
  {
    id: '1',
    recipientName: 'Nguyễn Văn A',
    phone: '0901234567',
    fullAddress: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
    isDefault: true
  },
  {
    id: '2',
    recipientName: 'Trần Thị B',
    phone: '0987654321',
    fullAddress: '456 Đường DEF, Phường UVW, Quận 3, TP.HCM',
    isDefault: false
  }
];

const CheckoutPage: React.FC = () => {
  useTranslation(['checkout', 'common', 'cart']);
  const navigate = useNavigate();
  const { state } = useCart();
  const { cart, loading } = state;

  // Component state
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<CheckoutAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'MOMO' | 'BANK_TRANSFER' | 'COD'>('MOMO');
  const [orderNotes, setOrderNotes] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [addresses] = useState<CheckoutAddress[]>(mockAddresses);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Initialize selected address
  useEffect(() => {
    const defaultAddress = addresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [addresses]);

  // Check if cart is empty
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <Empty
              image={<ShoppingCartOutlined style={{ fontSize: 64 }} className="text-gray-300" />}
              description={
                <div>
                  <Title level={3} className="text-gray-500 mb-2">
                    Giỏ hàng trống
                  </Title>
                  <Text className="text-gray-400">
                    Bạn chưa có sản phẩm nào trong giỏ hàng
                  </Text>
                </div>
              }
            >
              <Button type="primary" onClick={() => navigate('/products')}>
                Tiếp tục mua sắm
              </Button>
            </Empty>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingFee = subtotal > 500000 ? 0 : 30000; // Free shipping over 500k
  const tax = subtotal * 0.1; // 10% VAT
  const total = subtotal + shippingFee + tax;

  // Handle order creation
  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      message.error('Vui lòng chọn địa chỉ giao hàng!');
      return;
    }

    setProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock order creation
      const newOrder: Order = {
        id: 'order_' + Date.now() as any,
        orderNumber: 'MOSAIC' + Date.now().toString().slice(-6),
        status: paymentMethod === 'COD' ? 'PAID' as any : 'PENDING_PAYMENT' as any,
        items: cart.items,
        shippingAddress: {
          recipientName: selectedAddress.recipientName,
          phone: selectedAddress.phone,
          streetAddress: selectedAddress.fullAddress,
          ward: '',
          district: '',
          province: '',
          fullAddress: selectedAddress.fullAddress
        },
        totalAmount: subtotal,
        shippingFee,
        tax,
        grandTotal: total,
        paymentMethod,
        paymentProofs: [],
        notes: orderNotes || undefined,
        estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [
          {
            status: paymentMethod === 'COD' ? 'PAID' as any : 'PENDING_PAYMENT' as any,
            timestamp: new Date().toISOString(),
            notes: 'Đơn hàng được tạo thành công'
          }
        ]
      };

      setCreatedOrder(newOrder);
      
      if (paymentMethod === 'COD') {
        message.success('Đặt hàng thành công!');
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        setCurrentStep(2); // Go to payment step
      }
      
    } catch {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setProcessing(false);
    }
  };

  // Handle payment proof upload
  const handlePaymentProofUpload = async (file: File, method: 'MOMO' | 'BANK_TRANSFER') => {
    // Mock upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Uploading payment proof:', file, method);
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    navigate('/orders');
  };

  // Render address selection
  const renderAddressSelection = () => (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Title level={4} className="m-0">
          <EnvironmentOutlined className="mr-2 text-blue-500" />
          Địa chỉ giao hàng
        </Title>
        <Button 
          type="dashed" 
          icon={<PlusOutlined />}
          onClick={() => setShowAddressModal(true)}
        >
          Thêm địa chỉ mới
        </Button>
      </div>

      <Radio.Group
        value={selectedAddress?.id}
        onChange={(e) => {
          const addr = addresses.find(a => a.id === e.target.value);
          setSelectedAddress(addr || null);
        }}
        className="w-full"
      >
        <div className="space-y-3">
          {addresses.map(address => (
            <motion.div
              key={address.id}
              whileHover={{ scale: 1.01 }}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedAddress?.id === address.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Radio value={address.id} className="w-full">
                <div className="flex justify-between items-start">
                  <div className="flex-1 ml-2">
                    <div className="flex items-center mb-2">
                      <Text strong className="mr-2">{address.recipientName}</Text>
                      <Text className="text-gray-500">{address.phone}</Text>
                      {address.isDefault && (
                        <Tag color="blue" className="ml-2">Mặc định</Tag>
                      )}
                    </div>
                    <Text className="text-gray-600 dark:text-gray-400">
                      {address.fullAddress}
                    </Text>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button type="text" size="small" icon={<EditOutlined />} />
                    <Button type="text" size="small" icon={<DeleteOutlined />} danger />
                  </div>
                </div>
              </Radio>
            </motion.div>
          ))}
        </div>
      </Radio.Group>
    </Card>
  );

  // Render payment method selection
  const renderPaymentMethodSelection = () => (
    <Card className="mb-6">
      <Title level={4} className="mb-4">
        <CreditCardOutlined className="mr-2 text-green-500" />
        Phương thức thanh toán
      </Title>

      <Radio.Group
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full"
      >
        <div className="space-y-3">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              paymentMethod === 'MOMO' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10' : 'border-gray-200'
            }`}
          >
            <Radio value="MOMO">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center mr-3">
                  <Text className="text-white font-bold text-sm">M</Text>
                </div>
                <div>
                  <Text strong>Ví MoMo</Text>
                  <div className="text-sm text-gray-500">Thanh toán qua ví điện tử MoMo</div>
                </div>
              </div>
            </Radio>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              paymentMethod === 'BANK_TRANSFER' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200'
            }`}
          >
            <Radio value="BANK_TRANSFER">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mr-3">
                  <Text className="text-white font-bold text-sm">B</Text>
                </div>
                <div>
                  <Text strong>Chuyển khoản ngân hàng</Text>
                  <div className="text-sm text-gray-500">Chuyển khoản qua ngân hàng</div>
                </div>
              </div>
            </Radio>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-gray-200'
            }`}
          >
            <Radio value="COD">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center mr-3">
                  <Text className="text-white font-bold text-sm">C</Text>
                </div>
                <div>
                  <Text strong>Thanh toán khi nhận hàng (COD)</Text>
                  <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                </div>
              </div>
            </Radio>
          </motion.div>
        </div>
      </Radio.Group>

      {paymentMethod === 'COD' && (
        <Alert
          message="Lưu ý về COD"
          description="Phí COD: 20,000đ. Vui lòng chuẩn bị đủ tiền mặt khi nhận hàng."
          type="info"
          showIcon
          className="mt-4"
        />
      )}
    </Card>
  );

  // Render order notes
  const renderOrderNotes = () => (
    <Card className="mb-6">
      <Title level={4} className="mb-4">
        <EditOutlined className="mr-2 text-purple-500" />
        Ghi chú đơn hàng
      </Title>
      
      <TextArea
        placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)"
        value={orderNotes}
        onChange={(e) => setOrderNotes(e.target.value)}
        rows={4}
        maxLength={500}
        showCount
      />
    </Card>
  );

  // Render order summary
  const renderOrderSummary = () => (
    <Card className="sticky top-6">
      <Title level={4} className="mb-4">
        <ShoppingCartOutlined className="mr-2 text-blue-500" />
        Tóm tắt đơn hàng
      </Title>

      {/* Order items */}
      <div className="space-y-3 mb-4">
        {cart.items.map(item => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
              <img 
                src={item.productImage || '/placeholder-product.jpg'} 
                alt={item.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Text strong className="block truncate">{item.productName}</Text>
              {item.variantInfo && (
                <Text className="text-sm text-gray-500 block">{item.variantInfo}</Text>
              )}
              <Text className="text-sm">
                {item.quantity} × {formatVND(item.price)}
              </Text>
            </div>
            <Text strong className="text-primary">
              {formatVND(item.subtotal)}
            </Text>
          </div>
        ))}
      </div>

      <Divider />

      {/* Order totals */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <Text>Tạm tính:</Text>
          <Text>{formatVND(subtotal)}</Text>
        </div>
        <div className="flex justify-between">
          <Text>Phí vận chuyển:</Text>
          <Text className={shippingFee === 0 ? 'text-green-500' : ''}>
            {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
          </Text>
        </div>
        <div className="flex justify-between">
          <Text>Thuế VAT (10%):</Text>
          <Text>{formatVND(tax)}</Text>
        </div>
        {paymentMethod === 'COD' && (
          <div className="flex justify-between">
            <Text>Phí COD:</Text>
            <Text>{formatVND(20000)}</Text>
          </div>
        )}
      </div>

      <Divider />

      <div className="flex justify-between mb-6">
        <Text strong className="text-lg">Tổng cộng:</Text>
        <Text strong className="text-xl text-primary">
          {formatVND(total + (paymentMethod === 'COD' ? 20000 : 0))}
        </Text>
      </div>

      {/* Shipping benefits */}
      <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3 mb-4">
        <div className="flex items-center text-green-600 dark:text-green-400 mb-2">
          <TruckOutlined className="mr-2" />
          <Text strong className="text-green-600 dark:text-green-400">
            Ưu đãi vận chuyển
          </Text>
        </div>
        {shippingFee === 0 ? (
          <Text className="text-green-600 text-sm">
            🎉 Bạn được miễn phí vận chuyển!
          </Text>
        ) : (
          <Text className="text-green-600 text-sm">
            Mua thêm {formatVND(500000 - subtotal)} để được miễn phí vận chuyển
          </Text>
        )}
      </div>

      {/* Security badges */}
      <div className="flex items-center justify-center space-x-4 text-center text-gray-500 text-sm">
        <div className="flex items-center">
          <SafetyOutlined className="mr-1" />
          <span>Bảo mật</span>
        </div>
        <div className="flex items-center">
          <GiftOutlined className="mr-1" />
          <span>Đảm bảo</span>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-96">
          <Spin size="large" tip="Đang tải thông tin..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item href="/cart">Giỏ hàng</Breadcrumb.Item>
          <Breadcrumb.Item>Thanh toán</Breadcrumb.Item>
        </Breadcrumb>

        {/* Steps */}
        <Card className="mb-8">
          <Steps current={currentStep} className="mb-6">
            <Step 
              title="Thông tin đặt hàng" 
              icon={<EnvironmentOutlined />}
              description="Địa chỉ & thanh toán"
            />
            <Step 
              title="Xác nhận đơn hàng" 
              icon={<CheckCircleOutlined />}
              description="Kiểm tra thông tin"
            />
            <Step 
              title="Thanh toán" 
              icon={<CreditCardOutlined />}
              description="Hoàn tất thanh toán"
            />
          </Steps>
        </Card>

        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Form layout="vertical">
                    {renderAddressSelection()}
                    {renderPaymentMethodSelection()}
                    {renderOrderNotes()}
                    
                    <div className="flex items-center space-x-4">
                      <Button 
                        icon={<LeftOutlined />}
                        onClick={() => navigate('/cart')}
                        size="large"
                      >
                        Quay lại giỏ hàng
                      </Button>
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => setCurrentStep(1)}
                        disabled={!selectedAddress}
                        className="flex-1"
                      >
                        Tiếp tục
                      </Button>
                    </div>
                  </Form>
                </Col>
                <Col xs={24} lg={8}>
                  {renderOrderSummary()}
                </Col>
              </Row>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="order-confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Card className="mb-6">
                    <Title level={4} className="mb-4">
                      Xác nhận thông tin đặt hàng
                    </Title>
                    
                    {/* Address confirmation */}
                    <div className="mb-6">
                      <Text strong className="block mb-2">Địa chỉ giao hàng:</Text>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <Text strong className="block">{selectedAddress?.recipientName}</Text>
                        <Text className="block text-gray-600">{selectedAddress?.phone}</Text>
                        <Text className="block text-gray-600">{selectedAddress?.fullAddress}</Text>
                      </div>
                    </div>

                    {/* Payment method confirmation */}
                    <div className="mb-6">
                      <Text strong className="block mb-2">Phương thức thanh toán:</Text>
                      <Tag color={
                        paymentMethod === 'MOMO' ? 'pink' :
                        paymentMethod === 'BANK_TRANSFER' ? 'blue' : 'orange'
                      }>
                        {paymentMethod === 'MOMO' ? 'Ví MoMo' :
                         paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản ngân hàng' : 'COD'}
                      </Tag>
                    </div>

                    {/* Order notes */}
                    {orderNotes && (
                      <div className="mb-6">
                        <Text strong className="block mb-2">Ghi chú:</Text>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <Text>{orderNotes}</Text>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-4">
                      <Button 
                        icon={<LeftOutlined />}
                        onClick={() => setCurrentStep(0)}
                        size="large"
                      >
                        Quay lại
                      </Button>
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleCreateOrder}
                        loading={processing}
                        className="flex-1"
                      >
                        {paymentMethod === 'COD' ? 'Đặt hàng' : 'Tạo đơn hàng'}
                      </Button>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  {renderOrderSummary()}
                </Col>
              </Row>
            </motion.div>
          )}

          {currentStep === 2 && createdOrder && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PaymentUploadComponent
                orderNumber={createdOrder.orderNumber}
                totalAmount={createdOrder.grandTotal}
                onPaymentProofUpload={handlePaymentProofUpload}
                onComplete={handlePaymentComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Address Modal */}
        <Modal
          title="Thêm địa chỉ mới"
          open={showAddressModal}
          onCancel={() => setShowAddressModal(false)}
          footer={null}
          width={600}
        >
          <Text>Tính năng thêm địa chỉ đang được phát triển...</Text>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;