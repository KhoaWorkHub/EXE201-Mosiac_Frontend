import React, { useRef } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Divider, 
  Row, 
  Col, 
  Table, 
  Space
} from 'antd';
import {
  PrinterOutlined,
  DownloadOutlined,
  MailOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { OrderResponse } from '@/admin/types/order.types';
import { formatCurrency, formatDate } from '@/utils/formatters';

const { Title, Text } = Typography;

interface OrderInvoiceProps {
  order: OrderResponse;
  onClose: () => void;
}

const OrderInvoice: React.FC<OrderInvoiceProps> = ({ order }) => {
  const { t } = useTranslation(['admin', 'common']);
  const printRef = useRef<HTMLDivElement>(null);
  
  // Handle print function
  const handlePrint = useReactToPrint({
    documentTitle: `Invoice-${order.orderNumber}`,
    content: () => printRef.current,
    onAfterPrint: () => {
      console.log('Print completed');
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  React.useEffect(() => {
    // Set up the content to be printed
    if (handlePrint && printRef.current) {
      handlePrint();
    }
  }, [handlePrint]);
  
  // Table columns
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, _record: any, index: number) => index + 1,
      width: 50,
    },
    {
      title: t('admin:orders.product'),
      dataIndex: 'productNameSnapshot',
      key: 'productNameSnapshot',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (text: string, record: any) => (
        <div>
          <div>{text}</div>
          {record.variantInfoSnapshot && (
            <div className="text-xs text-gray-500">{record.variantInfoSnapshot}</div>
          )}
        </div>
      ),
    },
    {
      title: t('admin:orders.price'),
      dataIndex: 'priceSnapshot',
      key: 'priceSnapshot',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      align: 'right' as 'right',
      render: (price: number) => formatCurrency(price),
      width: 120,
    },
    {
      title: t('admin:orders.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      align: 'center' as 'center',
      width: 100,
    },
    {
      title: t('admin:orders.subtotal'),
      dataIndex: 'subtotal',
      key: 'subtotal',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      align: 'right' as 'right',
      render: (subtotal: number) => (
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      ),
      width: 120,
    },
  ];
  
  return (
    <Card
      title={
        <div className="flex justify-between items-center">
          <span>{t('admin:orders.invoice_title', { number: order.orderNumber })}</span>
          <Space>
            <Button 
              icon={<PrinterOutlined />} 
              onClick={handlePrint}
            >
              {t('admin:orders.actions.print')}
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              type="primary"
            >
              {t('admin:orders.actions.download')}
            </Button>
            <Button 
              icon={<MailOutlined />} 
            >
              {t('admin:orders.actions.email')}
            </Button>
          </Space>
        </div>
      }
    >
      <div ref={printRef} className="invoice-container p-6">
        <div className="invoice-header">
          <Row gutter={24}>
            <Col span={12}>
              <div className="flex items-center mb-4">
                <img 
                  src="/logo.svg" 
                  alt="MOSIAC" 
                  className="h-10 w-auto mr-2" 
                />
                <Title level={3} className="mb-0">MOSIAC STORE</Title>
              </div>
              <div className="company-info">
                <Text>123 Nguyen Hue Street</Text><br />
                <Text>District 1, Ho Chi Minh City</Text><br />
                <Text>Vietnam</Text><br />
                <Text>Email: support@mosiacstore.com</Text><br />
                <Text>Phone: +84 28 1234 5678</Text>
              </div>
            </Col>
            <Col span={12} className="text-right">
              <Title level={2} className="mb-4 mt-0 text-primary">INVOICE</Title>
              <div className="invoice-details">
                <Text className="block"><strong>Invoice #:</strong> INV-{order.orderNumber}</Text>
                <Text className="block"><strong>Order #:</strong> {order.orderNumber}</Text>
                <Text className="block"><strong>Date:</strong> {formatDate(order.createdAt)}</Text>
                <Text className="block mt-2">
                  <strong>Status:</strong>{' '}
                  <span className={`status-${order.status.toLowerCase()}`}>
                    {t(`admin:orders.statuses.${order.status.toLowerCase()}`)}
                  </span>
                </Text>
              </div>
            </Col>
          </Row>
        </div>
        
        <Divider className="my-6" />
        
        <div className="invoice-info mb-6">
          <Row gutter={24}>
            <Col span={12}>
              <div className="border rounded p-4 h-full">
                <Title level={5} className="mb-2">{t('admin:orders.bill_to')}</Title>
                <Text className="block"><strong>{order.recipientName}</strong></Text>
                <Text className="block">{order.shippingAddressSnapshot}</Text>
                <Text className="block">{order.recipientPhone}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div className="border rounded p-4 h-full">
                <Title level={5} className="mb-2">{t('admin:orders.payment_info')}</Title>
                {order.payment ? (
                  <>
                    <Text className="block">
                      <strong>{t('admin:orders.payment_method')}:</strong>{' '}
                      {t(`admin:orders.payment_methods.${order.payment.paymentMethod.toLowerCase()}`)}
                    </Text>
                    <Text className="block">
                      <strong>{t('admin:orders.payment_status')}:</strong>{' '}
                      {t(`admin:orders.payment_statuses.${order.payment.status.toLowerCase()}`)}
                    </Text>
                    {order.payment.transactionReference && (
                      <Text className="block">
                        <strong>{t('admin:orders.transaction_reference')}:</strong>{' '}
                        {order.payment.transactionReference}
                      </Text>
                    )}
                    {order.payment.paymentDate && (
                      <Text className="block">
                        <strong>{t('admin:orders.payment_date')}:</strong>{' '}
                        {formatDate(order.payment.paymentDate)}
                      </Text>
                    )}
                  </>
                ) : (
                  <Text className="block">{t('admin:orders.no_payment')}</Text>
                )}
              </div>
            </Col>
          </Row>
        </div>
        
        <Table 
          dataSource={order.orderItems} 
          columns={columns}
          rowKey="id"
          pagination={false}
          className="invoice-items"
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                <Table.Summary.Cell index={1} className="font-medium text-right">
                  {t('admin:orders.subtotal')}:
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} className="font-medium text-right">
                  {formatCurrency(order.totalProductAmount)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                <Table.Summary.Cell index={1} className="font-medium text-right">
                  {t('admin:orders.shipping_fee')}:
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} className="font-medium text-right">
                  {formatCurrency(order.shippingFee)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                <Table.Summary.Cell index={1} className="font-medium text-right">
                  <span className="text-lg">{t('admin:orders.total')}:</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} className="font-medium text-right">
                  <span className="text-lg text-primary">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
        
        <div className="invoice-footer mt-6 pt-6 border-t">
          <Row gutter={24}>
            <Col span={12}>
              {order.note && (
                <div className="mb-4">
                  <Title level={5}>{t('admin:orders.notes')}</Title>
                  <Text>{order.note}</Text>
                </div>
              )}
              
              <div className="mb-4">
                <Title level={5}>{t('admin:orders.terms')}</Title>
                <Text>{t('admin:orders.terms_content')}</Text>
              </div>
            </Col>
            <Col span={12} className="text-right">
              <div className="mb-4">
                <Title level={5}>{t('admin:orders.thank_you')}</Title>
                <Text>{t('admin:orders.thank_you_message')}</Text>
              </div>
            </Col>
          </Row>
          
          <div className="text-center mt-6 text-gray-500">
            <Text>{t('admin:orders.invoice_footer')}</Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderInvoice;