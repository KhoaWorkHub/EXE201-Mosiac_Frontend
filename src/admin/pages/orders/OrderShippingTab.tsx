import React from 'react';
import { Card, Descriptions, Tag, Alert, Steps, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { 
  ShoppingOutlined, 
  CarOutlined, 
  CheckCircleOutlined, 
  InfoCircleOutlined 
} from '@ant-design/icons';
import { OrderResponse, OrderStatus } from '@/admin/types/order.types'; 
import { formatCurrency, formatDate } from '@/utils/formatters';
import ShippingFeeForm from './ShippingFeeForm';

const { Step } = Steps;

interface OrderShippingTabProps {
  order: OrderResponse;
  onShippingFeeUpdated: () => void;
}

const OrderShippingTab: React.FC<OrderShippingTabProps> = ({ 
  order,
  onShippingFeeUpdated
}) => {
  const { t } = useTranslation(['admin-orders', 'common']);
  
  // Get current shipping step based on order status
  const getCurrentShippingStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PROCESSING:
        return 0;
      case OrderStatus.SHIPPING:
        return 1;
      case OrderStatus.DELIVERED:
        return 2;
      case OrderStatus.CANCELLED:
        return -1;
      default:
        return -1; // Not yet in shipping process
    }
  };
  
  const currentStep = getCurrentShippingStep(order.status);
  
  // Show shipping related status alerts
  const getShippingStatusAlert = () => {
    if (order.status === OrderStatus.CANCELLED) {
      return (
        <Alert
          type="error"
          message={t('admin-orders:orders.cancelled_notice')}
          description={order.cancelledReason || t('admin-orders:orders.no_reason_provided')}
          className="mb-4"
        />
      );
    }
    
    if (order.status === OrderStatus.PENDING_PAYMENT || order.status === OrderStatus.PAID) {
      return (
        <Alert
          type="info"
          message={t('admin-orders:orders.awaiting_processing')}
          description={t('admin-orders:orders.awaiting_processing_desc')}
          className="mb-4"
        />
      );
    }
    
    return null;
  };
  
  const canSetShippingFee = [
    OrderStatus.PENDING_PAYMENT, 
    OrderStatus.PAID, 
    OrderStatus.PROCESSING
  ].includes(order.status);
  
  return (
    <div className="space-y-6">
      {getShippingStatusAlert()}
      
      {/* Shipping progress */}
      {currentStep >= 0 && (
        <Card title={t('admin-orders:orders.shipping_progress')} className="mb-4">
          <Steps current={currentStep} status={order.status === OrderStatus.CANCELLED ? "error" : "process"}>
            <Step 
              title={t('admin-orders:orders.statuses.processing')} 
              icon={<ShoppingOutlined />} 
              description={currentStep >= 0 ? formatDate(order.updatedAt) : ''}
            />
            <Step 
              title={t('admin-orders:orders.statuses.shipping')} 
              icon={<CarOutlined />} 
              description={currentStep >= 1 ? formatDate(order.updatedAt) : ''}
            />
            <Step 
              title={t('admin-orders:orders.statuses.delivered')} 
              icon={<CheckCircleOutlined />} 
              description={currentStep >= 2 ? formatDate(order.updatedAt) : ''}
            />
          </Steps>
        </Card>
      )}
      
      {/* Shipping fee management */}
      {canSetShippingFee ? (
        <ShippingFeeForm 
          orderId={order.id} 
          orderNumber={order.orderNumber}
          currentShippingFee={order.shippingFee}
          onSuccess={onShippingFeeUpdated}
        />
      ) : (
        <Card title={t('admin-orders:orders.shipping_details')} className="mb-4">
          <Descriptions bordered column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
            <Descriptions.Item label={t('admin-orders:orders.shipping_fee')}>
              <span className="font-semibold">
                {formatCurrency(order.shippingFee || 0)}
              </span>
              {order.status !== OrderStatus.PENDING_PAYMENT && order.status !== OrderStatus.PAID && (
                <Tooltip title={t('admin-orders:orders.shipping_fee_locked_tooltip')}>
                  <InfoCircleOutlined className="ml-2 text-gray-400" />
                </Tooltip>
              )}
            </Descriptions.Item>
            <Descriptions.Item label={t('admin-orders:orders.shipping_address')}>
              {order.shippingAddressSnapshot}
            </Descriptions.Item>
            <Descriptions.Item label={t('admin-orders:orders.recipient')}>
              {order.recipientName} - {order.recipientPhone}
            </Descriptions.Item>
            <Descriptions.Item label={t('admin-orders:orders.status')}>
              <Tag color={
                order.status === OrderStatus.SHIPPING ? "blue" : 
                order.status === OrderStatus.DELIVERED ? "green" : 
                "default"
              }>
                {t(`admin-orders:orders.statuses.${order.status.toLowerCase()}`)}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
          
          {order.status === OrderStatus.CANCELLED ? (
            <Alert 
              type="warning" 
              message={t('admin-orders:orders.shipping_cancelled')}
              description={t('admin-orders:orders.shipping_cancelled_desc')}
              className="mt-4"
            />
          ) : order.status === OrderStatus.DELIVERED ? (
            <Alert 
              type="success" 
              message={t('admin-orders:orders.delivered_notice')}
              description={t('admin-orders:orders.delivered_notice_desc', { 
                date: formatDate(order.updatedAt)
              })}
              className="mt-4"
            />
          ) : null}
        </Card>
      )}
    </div>
  );
};

export default OrderShippingTab;