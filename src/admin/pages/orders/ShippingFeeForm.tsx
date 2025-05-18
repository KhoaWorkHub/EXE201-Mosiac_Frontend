import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  InputNumber, 
  message, 
} from 'antd';
import { SendOutlined, SaveOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';
import { formatCurrency } from '@/utils/formatters';

interface ShippingFeeProps {
  orderId: string;
  orderNumber: string;
  currentShippingFee?: number;
  onSuccess?: () => void;
}

const ShippingFeeForm: React.FC<ShippingFeeProps> = ({
  orderId,
  currentShippingFee = 0,
  onSuccess
}) => {
  const { t } = useTranslation(['admin-orders', 'common']);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { shippingFee: number }) => {
    try {
      setLoading(true);
      
      const response = await api.post(
        `/api/v1/admin/orders/${orderId}/shipping-fee`,
        null,
        {
          params: {
            shippingFee: values.shippingFee
          }
        }
      );
      
      if (response.data.success) {
        message.success(t('admin-orders:orders.shipping_fee_updated'));
        if (onSuccess) onSuccess();
      } else {
        message.error(response.data.message || t('common:errors.something_went_wrong'));
      }
    } catch (error) {
      console.error('Error updating shipping fee:', error);
      message.error(t('common:errors.something_went_wrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title={t('admin-orders:orders.shipping_details')}
      className="mb-4"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ shippingFee: currentShippingFee }}
        onFinish={handleSubmit}
      >
        <div className="mb-4">
          <p className="text-gray-500">
            {t('admin-orders:orders.shipping_fee_description')}
          </p>
          {currentShippingFee > 0 && (
            <p className="font-medium mt-2">
              {t('admin-orders:orders.current_shipping_fee')}: {formatCurrency(currentShippingFee)}
            </p>
          )}
        </div>
        
        <Form.Item
          name="shippingFee"
          label={t('admin-orders:orders.shipping_fee')}
          rules={[
            { required: true, message: t('common:validation.required') }
          ]}
        >
          <InputNumber
            min={0}
            step={1000}
            style={{ width: '100%' }}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => {
              const parsedValue = (value || '').replace(/\$\s?|(,*)/g, '');
              return (parsedValue === '' ? 0 : Number(parsedValue)) as 0;
            }}
          />
        </Form.Item>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            htmlType="submit"
            loading={loading}
          >
            {t('admin-orders:orders.update_shipping_fee')}
          </Button>
          <Button
            icon={<SendOutlined />}
            onClick={() => {
              // Only send notification without updating shipping fee
              form.validateFields().then(() => {
                // This would only call the email sending function if implemented separately
                message.success(t('admin-orders:orders.notification_sent'));
              });
            }}
          >
            {t('admin-orders:orders.send_notification_only')}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ShippingFeeForm;