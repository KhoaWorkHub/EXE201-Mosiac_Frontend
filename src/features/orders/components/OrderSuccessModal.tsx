// src/components/orders/OrderSuccessModal.tsx
import React from 'react';
import { Modal, Button, Result, Space, Typography, Card, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { 
  CheckCircleOutlined, 
  ShoppingOutlined,
  EyeOutlined,
  HomeOutlined,
  GiftOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatVND } from '@/utils/formatters';
import Confetti from 'react-confetti';

const { Title, Text, Paragraph } = Typography;

interface OrderSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  orderData?: {
    orderNumber: string;
    totalAmount: number;
    itemCount: number;
    estimatedDelivery?: string;
    paymentMethod: string;
  };
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  visible,
  onClose,
  orderData
}) => {
  useTranslation(['orders', 'common']);

  if (!orderData) return null;

  return (
    <>
      {visible && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          initialVelocityY={-10}
          colors={['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe']}
        />
      )}
      
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width={600}
        centered
        maskClosable={false}
        closeIcon={false}
        className="order-success-modal"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        >
          <Result
            icon={
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                <CheckCircleOutlined className="text-green-500" style={{ fontSize: '72px' }} />
              </motion.div>
            }
            title={
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Title level={2} className="text-green-600 mb-2">
                  🎉 Order Placed Successfully!
                </Title>
                <Text className="text-lg text-gray-600">
                  Thank you for your purchase!
                </Text>
              </motion.div>
            }
            subTitle={
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4"
              >
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Text strong>Order Number:</Text>
                      <Text className="font-mono text-primary text-lg">
                        #{orderData.orderNumber}
                      </Text>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Text strong>Total Amount:</Text>
                      <Text className="text-xl font-bold text-red-500">
                        {formatVND(orderData.totalAmount)}
                      </Text>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Text strong>Items:</Text>
                      <Text>{orderData.itemCount} products</Text>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Text strong>Payment Method:</Text>
                      <Text>{orderData.paymentMethod}</Text>
                    </div>
                    
                    {orderData.estimatedDelivery && (
                      <div className="flex justify-between items-center">
                        <Text strong>Estimated Delivery:</Text>
                        <Text className="text-green-600">
                          {orderData.estimatedDelivery}
                        </Text>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            }
          />

          <Divider />

          {/* What's Next Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <Title level={4} className="text-center mb-4">
              🚀 What's Next?
            </Title>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 border rounded-lg hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">📧</div>
                <Text strong className="block">Email Confirmation</Text>
                <Text className="text-sm text-gray-500">
                  Check your email for order details
                </Text>
              </div>
              
              <div className="text-center p-3 border rounded-lg hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">📦</div>
                <Text strong className="block">Order Processing</Text>
                <Text className="text-sm text-gray-500">
                  We'll prepare your items for shipping
                </Text>
              </div>
              
              <div className="text-center p-3 border rounded-lg hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">🚚</div>
                <Text strong className="block">Shipping Updates</Text>
                <Text className="text-sm text-gray-500">
                  Track your order in real-time
                </Text>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Space direction="vertical" className="w-full" size="middle">
              <Space className="w-full justify-center" wrap>
                <Link to={`/orders/${orderData.orderNumber}`}>
                  <Button type="primary" icon={<EyeOutlined />} size="large">
                    View Order Details
                  </Button>
                </Link>
                
                <Link to="/orders">
                  <Button icon={<ShoppingOutlined />} size="large">
                    Order History
                  </Button>
                </Link>
                
                <Link to="/products">
                  <Button icon={<GiftOutlined />} size="large">
                    Continue Shopping
                  </Button>
                </Link>
              </Space>
              
              <div className="text-center">
                <Link to="/">
                  <Button type="text" icon={<HomeOutlined />} onClick={onClose}>
                    Return to Home
                  </Button>
                </Link>
              </div>
            </Space>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
          >
            <Paragraph className="text-gray-600 mb-2">
              💝 <strong>Thank you for choosing MOSAIC!</strong>
            </Paragraph>
            <Text className="text-sm text-gray-500">
              We appreciate your trust in us and hope you love your purchase. 
              Don't forget to share your experience with us! ⭐
            </Text>
          </motion.div>
        </motion.div>
      </Modal>

      <style>{`
        .order-success-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
        }
        
        .order-success-modal .ant-result-title {
          color: #52c41a !important;
        }
      `}</style>
    </>
  );
};

export default OrderSuccessModal;