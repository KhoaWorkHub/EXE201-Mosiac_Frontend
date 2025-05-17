import React, { useEffect, useState } from 'react';
import { 
  Card,
  Typography,
  Button,
  Descriptions,
  Tag,
  Divider,
  Steps,
  Table,
  Space,
  Modal,
  Form,
  Select,
  Input,
  Tooltip,
  Alert,
  Timeline,
  Spin,
  Tabs,
  Row,
  Col,
  Radio
} from 'antd';
import {
  ArrowLeftOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  PrinterOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchOrderById, 
  updateOrderStatus,
  validatePayment,
  markPaymentAsFailed,
  refundPayment,
  fetchOrderByNumber
} from '@/admin/store/slices/orderSlice';
import { 
  OrderStatus, 
  OrderItemResponse,
  PaymentStatus,
  OrderStatusColors,
  PaymentMethod,
  PaymentStatusColors
} from '@/admin/types/order.types';
import { formatCurrency, formatDate } from '@/utils/formatters';

const { Title, Text } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;
const { confirm } = Modal;

const OrderDetail: React.FC = () => {
  const { t } = useTranslation(['admin', 'admin-orders']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { currentOrder, orderDetailLoading, updating } = useAppSelector(state => state.orders);
  
  const [updateStatusModalVisible, setUpdateStatusModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [refundForm] = Form.useForm();
  
  useEffect(() => {
    if (id) {
        dispatch(fetchOrderByNumber(id as string));
    }
  }, [dispatch, id]);
  
  if (orderDetailLoading || !currentOrder) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }
  
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
  
  // Get allowed next statuses based on current status
  const getAllowedNextStatuses = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case OrderStatus.PENDING_PAYMENT:
        return [OrderStatus.PAID, OrderStatus.CANCELLED];
      case OrderStatus.PAID:
        return [OrderStatus.PROCESSING];
      case OrderStatus.PROCESSING:
        return [OrderStatus.SHIPPING, OrderStatus.CANCELLED];
      case OrderStatus.SHIPPING:
        return [OrderStatus.DELIVERED, OrderStatus.CANCELLED];
      case OrderStatus.DELIVERED:
        return [OrderStatus.CANCELLED];
      case OrderStatus.CANCELLED:
        return [];
      default:
        return [];
    }
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/admin/orders');
  };
  
  // Handle update status
  const handleUpdateStatus = () => {
    setUpdateStatusModalVisible(true);
    form.setFieldsValue({
      status: currentOrder.status,
      adminNote: currentOrder.adminNote || '',
    });
  };
  
  // Handle update status submit
  const handleUpdateStatusSubmit = () => {
    form.validateFields().then(values => {
      dispatch(updateOrderStatus({
        id: currentOrder.id,
        request: {
          status: values.status,
          adminNote: values.adminNote,
        },
      })).then(() => {
        setUpdateStatusModalVisible(false);
      });
    });
  };
  
  // Handle payment validation modal
  const handlePaymentValidation = () => {
    setPaymentModalVisible(true);
  };
  
  // Handle payment validation submit
  const handlePaymentValidationSubmit = () => {
      paymentForm.validateFields().then(values => {
      dispatch(validatePayment({
        id: currentOrder.payment?.id as `${string}-${string}-${string}-${string}-${string}`,
        isValid: values.isValid === 'yes',
        adminNote: values.adminNote,
      })).then(() => {
        setPaymentModalVisible(false);
        // Refresh order data
        dispatch(fetchOrderById(id as `${string}-${string}-${string}-${string}-${string}`));
      });
    });
  };
  
  // Handle mark payment as failed
  const handleMarkPaymentAsFailed = () => {
    confirm({
      title: t('admin:orders.payment_actions.mark_failed_confirm'),
      icon: <ExclamationCircleOutlined />,
      content: t('admin:orders.payment_actions.mark_failed_message'),
      onOk() {
        paymentForm.validateFields().then(values => {
            dispatch(markPaymentAsFailed({
              id: currentOrder.payment?.id as `${string}-${string}-${string}-${string}-${string}`,
              reason: values.adminNote || t('admin:orders.payment_actions.default_failed_reason'),
            })).then(() => {
              setPaymentModalVisible(false);
              // Refresh order data
              dispatch(fetchOrderById(id as `${string}-${string}-${string}-${string}-${string}`));
            });
          });
      },
    });
  };
  
  // Handle refund payment
  const handleRefundPayment = () => {
    setRefundModalVisible(true);
  };
  
  // Handle refund payment submit
  const handleRefundPaymentSubmit = () => {
      refundForm.validateFields().then(values => {
      dispatch(refundPayment({
        id: currentOrder.payment?.id as `${string}-${string}-${string}-${string}-${string}`,
        reason: values.reason,
      })).then(() => {
        setRefundModalVisible(false);
        // Refresh order data
        dispatch(fetchOrderById(id as `${string}-${string}-${string}-${string}-${string}`));
      });
    });
  };
  
  // Table columns for order items
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
      render: (text: string, record: OrderItemResponse) => (
        <div>
          <div className="font-medium">{text}</div>
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
      render: (price: number) => formatCurrency(price),
      width: 120,
    },
    {
      title: t('admin:orders.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
    },
    {
      title: t('admin:orders.subtotal'),
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal: number) => (
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      ),
      width: 120,
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
          >
            {t('admin:actions.back_to_list')}
          </Button>
          <div>
            <Title level={3} className="mb-0 dark:text-white">
              {t('admin:orders.order_details')} #{currentOrder.orderNumber}
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">
              {formatDate(currentOrder.createdAt)}
            </Text>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Tooltip title={t('admin:orders.actions.print')}>
            <Button icon={<PrinterOutlined />} />
          </Tooltip>
          
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleUpdateStatus}
            loading={updating}
          >
            {t('admin:orders.actions.update_status')}
          </Button>
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <Tag color={OrderStatusColors[currentOrder.status]} className="text-base px-3 py-1">
              {t(`admin:orders.statuses.${currentOrder.status.toLowerCase()}`)}
            </Tag>
            
            {currentOrder.status === OrderStatus.CANCELLED && (
              <Alert 
                type="error" 
                showIcon
                message={t('admin:orders.cancelled_reason')}
                description={currentOrder.cancelledReason || t('admin:orders.no_reason_provided')}
              />
            )}
          </div>
          
          {/* Order status steps */}
          {currentOrder.status !== OrderStatus.CANCELLED ? (
            <Steps
              current={getCurrentStep(currentOrder.status)}
              responsive
              className="mt-6"
              status="process"
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
            <Alert
              message={t('admin:orders.cancelled_notice')}
              description={t('admin:orders.cancelled_description')}
              type="warning"
              showIcon
            />
          )}
        </Card>
      </div>
      
      {/* Order details tabs */}
      <Tabs defaultActiveKey="details" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <TabPane tab={t('admin:orders.tabs.details')} key="details">
          <Row gutter={16}>
            {/* Order Info */}
            <Col xs={24} md={16}>
              <Card title={t('admin:orders.order_information')} className="mb-6">
                <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
                  <Descriptions.Item label={t('admin:orders.order_number')}>
                    <span className="font-medium">{currentOrder.orderNumber}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('admin:orders.order_date')}>
                    {formatDate(currentOrder.createdAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('admin:orders.status')}>
                    <Tag color={OrderStatusColors[currentOrder.status]}>
                      {t(`admin:orders.statuses.${currentOrder.status.toLowerCase()}`)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('admin:orders.payment_method')}>
                    {currentOrder.payment ? (
                      <div>
                        {t(`admin:orders.payment_methods.${currentOrder.payment.paymentMethod.toLowerCase()}`)}
                        <Tag 
                          color={PaymentStatusColors[currentOrder.payment.status]} 
                          className="ml-2"
                        >
                          {t(`admin:orders.payment_statuses.${currentOrder.payment.status.toLowerCase()}`)}
                        </Tag>
                      </div>
                    ) : (
                      <span>{t('admin:orders.no_payment')}</span>
                    )}
                  </Descriptions.Item>
                  {currentOrder.payment?.paymentMethod === PaymentMethod.BANK_TRANSFER && (
                    <>
                      <Descriptions.Item label={t('admin:orders.transaction_reference')}>
                        {currentOrder.payment?.transactionReference || t('admin:orders.not_provided')}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('admin:orders.payment_date')}>
                        {currentOrder.payment?.paymentDate 
                          ? formatDate(currentOrder.payment.paymentDate)
                          : t('admin:orders.not_provided')}
                      </Descriptions.Item>
                    </>
                  )}
                  <Descriptions.Item label={t('admin:orders.recipient')} span={2}>
                    <Space>
                      <UserOutlined />
                      {currentOrder.recipientName}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('admin:orders.phone')}>
                    <Space>
                      <PhoneOutlined />
                      {currentOrder.recipientPhone}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('admin:orders.shipping_address')} span={3}>
                    <Space>
                      <HomeOutlined />
                      {currentOrder.shippingAddressSnapshot}
                    </Space>
                  </Descriptions.Item>
                  {currentOrder.note && (
                    <Descriptions.Item label={t('admin:orders.customer_note')} span={3}>
                      {currentOrder.note}
                    </Descriptions.Item>
                  )}
                  {currentOrder.adminNote && (
                    <Descriptions.Item label={t('admin:orders.admin_note')} span={3}>
                      {currentOrder.adminNote}
                    </Descriptions.Item>
                  )}
                </Descriptions>
                
                {/* Order Items */}
                <div className="mt-6">
                  <Title level={5}>{t('admin:orders.order_items')}</Title>
                  <Table 
                    dataSource={currentOrder.orderItems} 
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    summary={() => (
                      <Table.Summary>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="font-medium text-right">
                            {t('admin:orders.subtotal')}:
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2} className="font-medium">
                            {formatCurrency(currentOrder.totalProductAmount)}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="font-medium text-right">
                            {t('admin:orders.shipping_fee')}:
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2} className="font-medium">
                            {formatCurrency(currentOrder.shippingFee)}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={3}></Table.Summary.Cell>
                          <Table.Summary.Cell index={1} className="font-medium text-right">
                            <span className="text-lg">{t('admin:orders.total')}:</span>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2} className="font-medium">
                            <span className="text-lg text-primary">
                              {formatCurrency(currentOrder.totalAmount)}
                            </span>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                  />
                </div>
              </Card>
            </Col>
            
            {/* Payment Actions */}
            <Col xs={24} md={8}>
              {currentOrder.payment && (
                <Card 
                  title={t('admin:orders.payment_details')} 
                  className="mb-6"
                  extra={
                    <Tag color={PaymentStatusColors[currentOrder.payment.status]}>
                      {t(`admin:orders.payment_statuses.${currentOrder.payment.status.toLowerCase()}`)}
                    </Tag>
                  }
                >
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label={t('admin:orders.payment_method')}>
                      {t(`admin:orders.payment_methods.${currentOrder.payment.paymentMethod.toLowerCase()}`)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('admin:orders.amount')}>
                      {formatCurrency(currentOrder.payment.amount)}
                    </Descriptions.Item>
                    {currentOrder.payment.paymentMethod === PaymentMethod.BANK_TRANSFER && (
                      <>
                        <Descriptions.Item label={t('admin:orders.bank_name')}>
                          {currentOrder.payment.bankName || t('admin:orders.not_provided')}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('admin:orders.account_number')}>
                          {currentOrder.payment.bankAccountNumber || t('admin:orders.not_provided')}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('admin:orders.transaction_reference')}>
                          {currentOrder.payment.transactionReference || t('admin:orders.not_provided')}
                        </Descriptions.Item>
                      </>
                    )}
                    {currentOrder.payment.paymentNote && (
                      <Descriptions.Item label={t('admin:orders.payment_note')}>
                        {currentOrder.payment.paymentNote}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                  
                  <Divider />
                  
                  {/* Payment actions based on status */}
                  <div className="space-y-3">
                    {currentOrder.payment.status === PaymentStatus.PENDING && (
                      <>
                        <Button 
                          type="primary" 
                          icon={<CheckCircleOutlined />}
                          block
                          onClick={handlePaymentValidation}
                        >
                          {t('admin:orders.payment_actions.validate')}
                        </Button>
                        <Button 
                          danger 
                          icon={<CloseCircleOutlined />}
                          block
                          onClick={handlePaymentValidation}
                        >
                          {t('admin:orders.payment_actions.mark_failed')}
                        </Button>
                      </>
                    )}
                    
                    {currentOrder.payment.status === PaymentStatus.COMPLETED && (
                      <Button 
                        type="default" 
                        icon={<CloseCircleOutlined />}
                        block
                        onClick={handleRefundPayment}
                      >
                        {t('admin:orders.payment_actions.refund')}
                      </Button>
                    )}
                    
                    {(currentOrder.payment.status === PaymentStatus.FAILED || 
                     currentOrder.payment.status === PaymentStatus.REFUNDED) && (
                      <Alert
                        message={
                          currentOrder.payment.status === PaymentStatus.FAILED 
                            ? t('admin:orders.payment_actions.failed_notice')
                            : t('admin:orders.payment_actions.refunded_notice')
                        }
                        description={currentOrder.payment.paymentNote || t('admin:orders.no_reason_provided')}
                        type={currentOrder.payment.status === PaymentStatus.FAILED ? "error" : "warning"}
                        showIcon
                      />
                    )}
                  </div>
                </Card>
              )}
              
              {/* Update Status Actions */}
              <Card 
                title={t('admin:orders.quick_actions')} 
                className="mb-6"
              >
                <div className="space-y-3">
                  {getAllowedNextStatuses(currentOrder.status).map(status => (
                    <Button 
                      key={status}
                      type={status === OrderStatus.CANCELLED ? "default" : "primary"}
                      danger={status === OrderStatus.CANCELLED}
                      block
                      onClick={() => {
                        confirm({
                          title: t('admin:orders.status_update_confirm', { 
                            status: t(`admin:orders.statuses.${status.toLowerCase()}`) 
                          }),
                          content: t('admin:orders.status_update_message'),
                          onOk() {
                            dispatch(updateOrderStatus({
                              id: currentOrder.id,
                              request: {
                                status,
                              },
                            }));
                          },
                        });
                      }}
                    >
                      {t('admin:orders.status_actions.' + status.toLowerCase())}
                    </Button>
                  ))}
                  
                  {getAllowedNextStatuses(currentOrder.status).length === 0 && (
                    <Alert
                      message={t('admin:orders.no_status_actions')}
                      description={t('admin:orders.no_status_actions_message')}
                      type="info"
                      showIcon
                    />
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab={t('admin:orders.tabs.history')} key="history">
          <Card>
            <Timeline mode="left">
              <Timeline.Item label={formatDate(currentOrder.createdAt)}>
                {t('admin:orders.history.order_created')}
              </Timeline.Item>
              
              {currentOrder.payment && (
                <Timeline.Item 
                  label={formatDate(currentOrder.payment.paymentDate || currentOrder.createdAt)}
                  dot={<DollarOutlined className="text-blue-500" />}
                >
                  {t(`admin:orders.history.payment_${currentOrder.payment.status.toLowerCase()}`, {
                    method: t(`admin:orders.payment_methods.${currentOrder.payment.paymentMethod.toLowerCase()}`)
                  })}
                </Timeline.Item>
              )}
              
              {/* Example history entries - in real app, these would come from order history API */}
              {currentOrder.status !== OrderStatus.PENDING_PAYMENT && (
                <Timeline.Item 
                  label="2023-05-19 10:30:45"
                  dot={<CheckCircleOutlined className="text-green-500" />}
                >
                  {t('admin:orders.history.status_changed', {
                    from: t('admin:orders.statuses.pending_payment'),
                    to: t('admin:orders.statuses.paid')
                  })}
                </Timeline.Item>
              )}
              
              {currentOrder.status !== OrderStatus.PENDING_PAYMENT && 
               currentOrder.status !== OrderStatus.PAID && (
                <Timeline.Item 
                  label="2023-05-19 14:22:10"
                >
                  {t('admin:orders.history.status_changed', {
                    from: t('admin:orders.statuses.paid'),
                    to: t('admin:orders.statuses.processing')
                  })}
                </Timeline.Item>
              )}
              
              {currentOrder.status === OrderStatus.CANCELLED && (
                <Timeline.Item 
                  label={formatDate(currentOrder.updatedAt)}
                  color="red"
                >
                  {t('admin:orders.history.order_cancelled')}
                  <div className="text-gray-500 text-sm mt-1">
                    {t('admin:orders.history.reason')}: {currentOrder.cancelledReason || t('admin:orders.no_reason_provided')}
                  </div>
                </Timeline.Item>
              )}
            </Timeline>
          </Card>
        </TabPane>
      </Tabs>
      
      {/* Update Status Modal */}
      <Modal
        title={t('admin:orders.status_update_title')}
        open={updateStatusModalVisible}
        onOk={handleUpdateStatusSubmit}
        onCancel={() => setUpdateStatusModalVisible(false)}
        confirmLoading={updating}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="status"
            label={t('admin:orders.status')}
            rules={[{ required: true, message: t('admin:validation.required') }]}
          >
            <Select>
              {Object.values(OrderStatus).map(status => (
                <Select.Option key={status} value={status}>
                  {t(`admin:orders.statuses.${status.toLowerCase()}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="adminNote"
            label={t('admin:orders.admin_note')}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Payment Validation Modal */}
      <Modal
        title={t('admin:orders.payment_validation_title')}
        open={paymentModalVisible}
        onOk={handlePaymentValidationSubmit}
        onCancel={() => setPaymentModalVisible(false)}
        confirmLoading={updating}
        footer={[
          <Button key="back" onClick={() => setPaymentModalVisible(false)}>
            {t('admin:actions.cancel')}
          </Button>,
          <Button 
            key="failed" 
            danger
            onClick={handleMarkPaymentAsFailed}
          >
            {t('admin:orders.payment_actions.mark_failed')}
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handlePaymentValidationSubmit}
          >
            {t('admin:orders.payment_actions.validate')}
          </Button>,
        ]}
      >
        <Form form={paymentForm} layout="vertical">
          <Form.Item
            name="isValid"
            label={t('admin:orders.payment_validation_question')}
            rules={[{ required: true, message: t('admin:validation.required') }]}
            initialValue="yes"
          >
            <Radio.Group>
              <Radio value="yes">{t('admin:orders.payment_valid')}</Radio>
              <Radio value="no">{t('admin:orders.payment_invalid')}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="adminNote"
            label={t('admin:orders.admin_note')}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Refund Modal */}
      <Modal
        title={t('admin:orders.refund_title')}
        open={refundModalVisible}
        onOk={handleRefundPaymentSubmit}
        onCancel={() => setRefundModalVisible(false)}
        confirmLoading={updating}
      >
        <Alert
          message={t('admin:orders.refund_warning')}
          description={t('admin:orders.refund_warning_desc')}
          type="warning"
          showIcon
          className="mb-4"
        />
        <Form form={refundForm} layout="vertical">
          <Form.Item
            name="reason"
            label={t('admin:orders.refund_reason')}
            rules={[{ required: true, message: t('admin:validation.required') }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderDetail;