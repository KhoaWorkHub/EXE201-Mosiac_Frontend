import React from 'react';
import { 
  Card, 
  Typography, 
  Tag, 
  Steps, 
  Divider, 
  List, 
  Button,
  Descriptions,
  Space,
} from 'antd';
import {
  ClockCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { 
  OrderResponse, 
  OrderStatus, 
  OrderStatusColors,
  PaymentStatusColors
} from '@/admin/types/order.types';
import { formatCurrency, formatDate } from '@/utils/formatters';

const { Title, Text } = Typography;
const { Step } = Steps;

interface MobileOrderDetailProps {
  order: OrderResponse;
  onUpdateStatus: () => void;
}

const MobileOrderDetail: React.FC<MobileOrderDetailProps> = ({ order, onUpdateStatus }) => {
  const { t } = useTranslation(['admin', 'common']);
  
  // Get current step in order process
  const getCurrentStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
        return 0;
      case OrderStatus.PAID:
        return 1;
      case OrderStatus.PROCESSING:
        return 2;
      case OrderStatus.SHIPPING:
        return 3;
      case OrderStatus.DELIVERED:
        return 4;
      case OrderStatus.CANCELLED:
        return -1;
      default:
        return 0;
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Order Status */}
      <Card className="mb-4">
        <div className="flex flex-col items-start">
          <div className="flex justify-between w-full mb-2">
            <div>
              <Text className="text-gray-500">{t('admin:orders.order_number')}</Text>
              <Title level={5} className="m-0">{order.orderNumber}</Title>
            </div>
            <Tag color={OrderStatusColors[order.status]}>
              {t(`admin:orders.statuses.${order.status.toLowerCase()}`)}
            </Tag>
          </div>
          <Text className="text-gray-500 text-sm mb-4">
            {formatDate(order.createdAt)}
          </Text>
          
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            block
            onClick={onUpdateStatus}
          >
            {t('admin:orders.actions.update_status')}
          </Button>
          
          <Divider className="my-4" />
          
          {/* Order Progress */}
          {order.status !== OrderStatus.CANCELLED ? (
            <Steps
              current={getCurrentStep(order.status)}
              direction="vertical"
              size="small"
              className="w-full"
            >
              <Step 
                title={t('admin:orders.statuses.pending_payment')} 
                icon={<ClockCircleOutlined />} 
              />
              <Step 
                title={t('admin:orders.statuses.paid')} 
                icon={<DollarOutlined />} 
              />
              <Step 
                title={t('admin:orders.statuses.processing')} 
                icon={<ShoppingOutlined />} 
              />
              <Step 
                title={t('admin:orders.statuses.shipping')} 
                icon={<ShoppingOutlined />} 
              />
              <Step 
                title={t('admin:orders.statuses.delivered')} 
                icon={<CheckCircleOutlined />} 
              />
            </Steps>
          ) : (
            <div className="w-full p-3 bg-red-50 rounded-md">
              <Text type="danger">
                {t('admin:orders.cancelled_notice')}
                {order.cancelledReason && (
                  <div className="mt-2">
                    <Text strong>{t('admin:orders.cancelled_reason')}:</Text> {order.cancelledReason}
                  </div>
                )}
              </Text>
            </div>
          )}
        </div>
      </Card>
      
      {/* Customer Information */}
      <Card title={t('admin:orders.customer_information')}>
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label={
            <Space>
              <UserOutlined />
              {t('admin:orders.recipient')}
            </Space>
          }>
            {order.recipientName}
          </Descriptions.Item>
          <Descriptions.Item label={
            <Space>
              <PhoneOutlined />
              {t('admin:orders.phone')}
            </Space>
          }>
            {order.recipientPhone}
          </Descriptions.Item>
          <Descriptions.Item label={
            <Space>
              <HomeOutlined />
              {t('admin:orders.shipping_address')}
            </Space>
          }>
            {order.shippingAddressSnapshot}
          </Descriptions.Item>
        </Descriptions>
        
        {order.note && (
          <div className="mt-4">
            <Text strong>{t('admin:orders.customer_note')}:</Text>
            <div className="p-2 bg-gray-50 rounded mt-1">
              {order.note}
            </div>
          </div>
        )}
      </Card>
      
      {/* Payment Information */}
      <Card title={t('admin:orders.payment_details')}>
        {order.payment ? (
          <div>
            <div className="flex justify-between mb-3">
              <Text>{t('admin:orders.payment_method')}:</Text>
              <Text strong>
                {t(`admin:orders.payment_methods.${order.payment.paymentMethod.toLowerCase()}`)}
              </Text>
            </div>
            
            <div className="flex justify-between mb-3">
              <Text>{t('admin:orders.payment_status')}:</Text>
              <Tag color={PaymentStatusColors[order.payment.status]}>
                {t(`admin:orders.payment_statuses.${order.payment.status.toLowerCase()}`)}
              </Tag>
            </div>
            
            {order.payment.transactionReference && (
              <div className="flex justify-between mb-3">
                <Text>{t('admin:orders.transaction_reference')}:</Text>
                <Text strong>{order.payment.transactionReference}</Text>
              </div>
            )}
            
            {order.payment.paymentDate && (
              <div className="flex justify-between mb-3">
                <Text>{t('admin:orders.payment_date')}:</Text>
                <Text strong>{formatDate(order.payment.paymentDate)}</Text>
              </div>
            )}
            
            <Divider className="my-3" />
            
            <div className="flex justify-between text-lg">
              <Text strong>{t('admin:orders.amount')}:</Text>
              <Text strong className="text-primary">{formatCurrency(order.payment.amount)}</Text>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Text>{t('admin:orders.no_payment')}</Text>
          </div>
        )}
      </Card>
      
      {/* Order Items */}
      <Card 
        title={t('admin:orders.order_items')}
        extra={<Text>{order.orderItems.length} {t('admin:orders.items')}</Text>}
      >
        <List
          dataSource={order.orderItems}
          renderItem={(item) => (
            <List.Item>
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <Text strong>{item.productNameSnapshot}</Text>
                  <Text>{formatCurrency(item.priceSnapshot)}</Text>
                </div>
                {item.variantInfoSnapshot && (
                  <div className="text-xs text-gray-500 mb-1">
                    {item.variantInfoSnapshot}
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <Text className="text-gray-500">
                    {t('admin:orders.quantity')}: {item.quantity}
                  </Text>
                  <Text strong>{formatCurrency(item.subtotal)}</Text>
                </div>
              </div>
            </List.Item>
          )}
        />
        
        <Divider className="my-3" />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Text>{t('admin:orders.subtotal')}:</Text>
            <Text>{formatCurrency(order.totalProductAmount)}</Text>
          </div>
          <div className="flex justify-between">
            <Text>{t('admin:orders.shipping_fee')}:</Text>
            <Text>{formatCurrency(order.shippingFee)}</Text>
          </div>
          <Divider className="my-2" />
          <div className="flex justify-between">
            <Text strong className="text-lg">{t('admin:orders.total')}:</Text>
            <Text strong className="text-lg text-primary">
              {formatCurrency(order.totalAmount)}
            </Text>
          </div>
        </div>
      </Card>
      
      {/* Admin Notes */}
      {order.adminNote && (
        <Card title={t('admin:orders.admin_note')}>
          <div className="p-2 bg-gray-50 rounded">
            {order.adminNote}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MobileOrderDetail;