import React, { useEffect, useState } from "react";
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
  Spin,
  Tabs,
  Row,
  Col,
  Radio,
  message,
  Dropdown,
  InputNumber,
} from "antd";
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
  CloseCircleOutlined,
  FileExcelOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getOrderDetails,
  updateOrderStatus,
  validatePayment,
  markPaymentAsFailed,
  refundPayment,
  updateOrderItems,
  addOrderItem,
  removeOrderItem,
  exportOrders,
} from "@/admin/store/slices/orderSlice";
import {
  OrderStatus,
  OrderItemResponse,
  PaymentStatus,
  OrderStatusColors,
  PaymentMethod,
  PaymentStatusColors,
  OrderItemRequest,
  UpdateOrderItemsRequest,
} from "@/admin/types/order.types";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { motion } from "framer-motion";
import OrderTimelineStatus  from "./OrderTimelineStatus";
import OrderShippingTab from './OrderShippingTab';


const { Title, Text } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;
const { confirm } = Modal;

const OrderDetail: React.FC = () => {
  const { t } = useTranslation(["admin", "admin-orders", "common"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { currentOrder, orderDetail, orderDetailLoading, updating, exporting } =
    useAppSelector((state) => state.orders);

  const [updateStatusModalVisible, setUpdateStatusModalVisible] =
    useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [editItemsModalVisible, setEditItemsModalVisible] = useState(false);

  const [form] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [refundForm] = Form.useForm();
  const [itemForm] = Form.useForm();
  const [editItemsForm] = Form.useForm();

  useEffect(() => {
    if (id) {
      dispatch(
        getOrderDetails(
          id as `${string}-${string}-${string}-${string}-${string}`
        )
      );
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
        return [OrderStatus.CANCELLED]; // Typically delivered orders aren't cancelled, but included for completeness
      case OrderStatus.CANCELLED:
        return [];
      default:
        return [];
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate("/admin/orders");
  };

  // Handle update status
  const handleUpdateStatus = () => {
    setUpdateStatusModalVisible(true);
    form.setFieldsValue({
      status: currentOrder.status,
      adminNote: currentOrder.adminNote || "",
    });
  };

  // Handle update status submit
  const handleUpdateStatusSubmit = () => {
    form.validateFields().then((values) => {
      dispatch(
        updateOrderStatus({
          id: currentOrder.id as `${string}-${string}-${string}-${string}-${string}`,
          request: {
            status: values.status,
            adminNote: values.adminNote,
          },
        })
      ).then(() => {
        setUpdateStatusModalVisible(false);
        message.success(t("admin-orders:orders.status_updated"));
      });
    });
  };

  // Handle payment validation modal
  const handlePaymentValidation = () => {
    setPaymentModalVisible(true);
    paymentForm.setFieldsValue({
      isValid: "yes",
      adminNote: "",
    });
  };

  // Handle payment validation submit
  const handlePaymentValidationSubmit = () => {
    paymentForm.validateFields().then((values) => {
      dispatch(
        validatePayment({
          id: currentOrder.payment
            ?.id as `${string}-${string}-${string}-${string}-${string}`,
          request: {
            isValid: values.isValid === "yes",
            adminNote: values.adminNote,
          },
        })
      ).then(() => {
        setPaymentModalVisible(false);
        // Refresh order data
        if (id) {
          dispatch(
            getOrderDetails(
              id as `${string}-${string}-${string}-${string}-${string}`
            )
          );
        }
        message.success(t("admin-orders:orders.payment_validated"));
      });
    });
  };

  // Handle mark payment as failed
  const handleMarkPaymentAsFailed = () => {
    confirm({
      title: t("admin-orders:orders.payment_actions.mark_failed_confirm"),
      icon: <ExclamationCircleOutlined />,
      content: t("admin-orders:orders.payment_actions.mark_failed_message"),
      onOk() {
        paymentForm.validateFields().then((values) => {
          dispatch(
            markPaymentAsFailed({
              id: currentOrder.payment
                ?.id as `${string}-${string}-${string}-${string}-${string}`,
              reason:
                values.adminNote ||
                t("admin-orders:orders.payment_actions.default_failed_reason"),
            })
          ).then(() => {
            setPaymentModalVisible(false);
            // Refresh order data
            if (id) {
              dispatch(
                getOrderDetails(
                  id as `${string}-${string}-${string}-${string}-${string}`
                )
              );
            }
            message.success(t("admin-orders:orders.payment_marked_failed"));
          });
        });
      },
    });
  };

  // Handle refund payment
  const handleRefundPayment = () => {
    setRefundModalVisible(true);
    refundForm.resetFields();
  };

  // Handle refund payment submit
  const handleRefundPaymentSubmit = () => {
    refundForm.validateFields().then((values) => {
      dispatch(
        refundPayment({
          id: currentOrder.payment
            ?.id as `${string}-${string}-${string}-${string}-${string}`,
          reason: values.reason,
        })
      ).then(() => {
        setRefundModalVisible(false);
        // Refresh order data
        if (id) {
          dispatch(
            getOrderDetails(
              id as `${string}-${string}-${string}-${string}-${string}`
            )
          );
        }
        message.success(t("admin-orders:orders.payment_refunded"));
      });
    });
  };

  // Handle add item modal
  const handleAddItem = () => {
    setAddItemModalVisible(true);
    itemForm.resetFields();
  };

  // Handle add item submit
  const handleAddItemSubmit = () => {
    itemForm.validateFields().then((values) => {
      const request: OrderItemRequest = {
        productId: values.productId,
        variantId: values.variantId,
        quantity: values.quantity,
        priceOverride: values.priceOverride,
      };

      dispatch(
        addOrderItem({
          id: currentOrder.id as `${string}-${string}-${string}-${string}-${string}`,
          request,
        })
      ).then(() => {
        setAddItemModalVisible(false);
        // Refresh order data
        if (id) {
          dispatch(
            getOrderDetails(
              id as `${string}-${string}-${string}-${string}-${string}`
            )
          );
        }
        message.success(t("admin-orders:orders.item_added"));
      });
    });
  };

  // Handle edit items modal
  const handleEditItems = () => {
    setEditItemsModalVisible(true);

    // Prepare form data from current items
    const formInitialValues = {
      items: currentOrder.orderItems.map((item) => ({
        productId: item.productId,
        // variantId might be undefined
        variantId: item.variantInfoSnapshot ? item.productId : undefined,
        quantity: item.quantity,
        priceOverride: item.priceSnapshot,
      })),
    };

    editItemsForm.setFieldsValue(formInitialValues);
  };

  // Handle edit items submit
  const handleEditItemsSubmit = () => {
    editItemsForm.validateFields().then((values) => {
      const request: UpdateOrderItemsRequest = {
        items: values.items,
      };

      dispatch(
        updateOrderItems({
          id: currentOrder.id as `${string}-${string}-${string}-${string}-${string}`,
          request,
        })
      ).then(() => {
        setEditItemsModalVisible(false);
        // Refresh order data
        if (id) {
          dispatch(
            getOrderDetails(
              id as `${string}-${string}-${string}-${string}-${string}`
            )
          );
        }
        message.success(t("admin-orders:orders.items_updated"));
      });
    });
  };

  // Handle remove item
  const handleRemoveItem = (itemId: string) => {
    confirm({
      title: t("admin-orders:orders.remove_item_confirm"),
      icon: <ExclamationCircleOutlined />,
      content: t("admin-orders:orders.remove_item_message"),
      onOk() {
        dispatch(
          removeOrderItem({
            id: currentOrder.id as `${string}-${string}-${string}-${string}-${string}`,
            itemId:
              itemId as `${string}-${string}-${string}-${string}-${string}`,
          })
        ).then(() => {
          // Refresh order data
          if (id) {
            dispatch(
              getOrderDetails(
                id as `${string}-${string}-${string}-${string}-${string}`
              )
            );
          }
          message.success(t("admin-orders:orders.item_removed"));
        });
      },
    });
  };

  // Handle export order
  const handleExportOrder = (format: string) => {
    dispatch(
      exportOrders({
        format,
        status: currentOrder.status,
      })
    ).then((action) => {
      if (action.payload) {
        // Create a download link for the blob
        const blob = action.payload as Blob;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `order_${currentOrder.orderNumber}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        message.success(t("admin-orders:orders.export_success"));
      }
    });
  };

  // Table columns for order items
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, _record: any, index: number) => index + 1,
      width: 50,
    },
    {
      title: t("admin-orders:orders.product"),
      dataIndex: "productNameSnapshot",
      key: "productNameSnapshot",
      render: (text: string, record: OrderItemResponse) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.variantInfoSnapshot && (
            <div className="text-xs text-gray-500">
              {record.variantInfoSnapshot}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t("admin-orders:orders.price"),
      dataIndex: "priceSnapshot",
      key: "priceSnapshot",
      render: (price: number) => formatCurrency(price),
      width: 120,
    },
    {
      title: t("admin-orders:orders.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: t("admin-orders:orders.subtotal"),
      dataIndex: "subtotal",
      key: "subtotal",
      render: (subtotal: number) => (
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      ),
      width: 120,
    },
    {
      title: t("common:actions"),
      key: "actions",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: OrderItemResponse) => (
        <Space>
          <Tooltip title={t("admin-orders:orders.remove_item")}>
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => handleRemoveItem(record.id as string)}
              disabled={
                currentOrder.status === OrderStatus.DELIVERED ||
                currentOrder.status === OrderStatus.CANCELLED
              }
            />
          </Tooltip>
        </Space>
      ),
      width: 80,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              {t("common:actions.back")}
            </Button>
            <div>
              <Title level={3} className="mb-0 dark:text-white">
                {t("admin-orders:orders.order_details")} #
                {currentOrder.orderNumber}
              </Title>
              <Text className="text-gray-500 dark:text-gray-400">
                {formatDate(currentOrder.createdAt)}
              </Text>
            </div>
          </div>

          <div className="flex space-x-2">
            <Tooltip title={t("admin-orders:orders.actions.print")}>
              <Button
                icon={<PrinterOutlined />}
                onClick={() => window.print()}
              />
            </Tooltip>

            <Dropdown
              menu={{
                items: [
                  {
                    key: "csv",
                    label: t("admin-orders:orders.export_csv"),
                    icon: <FileExcelOutlined />,
                    onClick: () => handleExportOrder("csv"),
                  },
                  {
                    key: "excel",
                    label: t("admin-orders:orders.export_excel"),
                    icon: <FileExcelOutlined />,
                    onClick: () => handleExportOrder("xlsx"),
                  },
                ],
              }}
            >
              <Button icon={<DownloadOutlined />} loading={exporting}>
                {t("admin-orders:orders.actions.export")}
              </Button>
            </Dropdown>

            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleUpdateStatus}
              loading={updating}
            >
              {t("admin-orders:orders.actions.update_status")}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Status indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 gap-6"
      >
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <Tag
              color={OrderStatusColors[currentOrder.status]}
              className="text-base px-3 py-1"
            >
              {t(
                `admin-orders:orders.statuses.${currentOrder.status.toLowerCase()}`
              )}
            </Tag>

            {currentOrder.status === OrderStatus.CANCELLED && (
              <Alert
                type="error"
                showIcon
                message={t("admin-orders:orders.cancelled_reason")}
                description={
                  currentOrder.cancelledReason ||
                  t("admin-orders:orders.no_reason_provided")
                }
              />
            )}
          </div>

          {/* Order status steps */}
          {currentOrder.status !== OrderStatus.CANCELLED ? (
            <Steps
              current={getCurrentStep(currentOrder.status)}
              responsive
              className="mt-6"
              status={
                (currentOrder.status as OrderStatus) === OrderStatus.CANCELLED
                  ? "error"
                  : "process"
              }
            >
              <Step
                title={t("admin-orders:orders.statuses.pending_payment")}
                icon={<ClockCircleOutlined />}
              />
              <Step
                title={t("admin-orders:orders.statuses.paid")}
                icon={<DollarOutlined />}
              />
              <Step
                title={t("admin-orders:orders.statuses.processing")}
                icon={<ShoppingOutlined />}
              />
              <Step
                title={t("admin-orders:orders.statuses.shipping")}
                icon={<ShoppingOutlined />}
              />
              <Step
                title={t("admin-orders:orders.statuses.delivered")}
                icon={<CheckCircleOutlined />}
              />
            </Steps>
          ) : (
            <Alert
              message={t("admin-orders:orders.cancelled_notice")}
              description={t("admin-orders:orders.cancelled_description")}
              type="warning"
              showIcon
            />
          )}
        </Card>
      </motion.div>

      {/* Order details tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Tabs
          defaultActiveKey="details"
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <TabPane tab={t("admin-orders:orders.tabs.details")} key="details">
            <Row gutter={16}>
              {/* Order Info */}
              <Col xs={24} md={16}>
                <Card
                  title={t("admin-orders:orders.order_information")}
                  className="mb-6"
                >
                  <Descriptions
                    bordered
                    column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
                  >
                    <Descriptions.Item
                      label={t("admin-orders:orders.order_number")}
                    >
                      <span className="font-medium">
                        {currentOrder.orderNumber}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t("admin-orders:orders.order_date")}
                    >
                      {formatDate(currentOrder.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label={t("admin-orders:orders.status")}>
                      <Tag color={OrderStatusColors[currentOrder.status]}>
                        {t(
                          `admin-orders:orders.statuses.${currentOrder.status.toLowerCase()}`
                        )}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t("admin-orders:orders.payment_method")}
                    >
                      {currentOrder.payment ? (
                        <div>
                          {t(
                            `admin-orders:orders.payment_methods.${currentOrder.payment.paymentMethod.toLowerCase()}`
                          )}
                          <Tag
                            color={
                              PaymentStatusColors[currentOrder.payment.status]
                            }
                            className="ml-2"
                          >
                            {t(
                              `admin-orders:orders.payment_statuses.${currentOrder.payment.status.toLowerCase()}`
                            )}
                          </Tag>
                        </div>
                      ) : (
                        <span>{t("admin-orders:orders.no_payment")}</span>
                      )}
                    </Descriptions.Item>
                    {currentOrder.payment?.paymentMethod ===
                      PaymentMethod.BANK_TRANSFER && (
                      <>
                        <Descriptions.Item
                          label={t("admin-orders:orders.transaction_reference")}
                        >
                          {currentOrder.payment?.transactionReference ||
                            t("admin-orders:orders.not_provided")}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={t("admin-orders:orders.payment_date")}
                        >
                          {currentOrder.payment?.paymentDate
                            ? formatDate(currentOrder.payment.paymentDate)
                            : t("admin-orders:orders.not_provided")}
                        </Descriptions.Item>
                      </>
                    )}
                    <Descriptions.Item
                      label={t("admin-orders:orders.recipient")}
                      span={2}
                    >
                      <Space>
                        <UserOutlined />
                        {currentOrder.recipientName}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label={t("admin-orders:orders.phone")}>
                      <Space>
                        <PhoneOutlined />
                        {currentOrder.recipientPhone}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t("admin-orders:orders.shipping_address")}
                      span={3}
                    >
                      <Space>
                        <HomeOutlined />
                        {currentOrder.shippingAddressSnapshot}
                      </Space>
                    </Descriptions.Item>
                    {orderDetail?.user && (
                      <Descriptions.Item
                        label={t("admin-orders:orders.customer_details")}
                        span={3}
                      >
                        <Space direction="vertical">
                          <Text>
                            <strong>
                              {t("admin-orders:orders.customer_email")}:
                            </strong>{" "}
                            {orderDetail.user.email}
                          </Text>
                          <Text>
                            <strong>
                              {t("admin-orders:orders.customer_name")}:
                            </strong>{" "}
                            {orderDetail.user.fullName}
                          </Text>
                        </Space>
                      </Descriptions.Item>
                    )}
                    {currentOrder.note && (
                      <Descriptions.Item
                        label={t("admin-orders:orders.customer_note")}
                        span={3}
                      >
                        {currentOrder.note}
                      </Descriptions.Item>
                    )}
                    {currentOrder.adminNote && (
                      <Descriptions.Item
                        label={t("admin-orders:orders.admin_note")}
                        span={3}
                      >
                        {currentOrder.adminNote}
                      </Descriptions.Item>
                    )}
                  </Descriptions>

                  {/* Order Items */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <Title level={5}>
                        {t("admin-orders:orders.order_items")}
                      </Title>
                      <Space>
                        <Button
                          type="primary"
                          onClick={handleAddItem}
                          disabled={
                            currentOrder.status === OrderStatus.DELIVERED ||
                            currentOrder.status === OrderStatus.CANCELLED
                          }
                        >
                          {t("admin-orders:orders.add_item")}
                        </Button>
                        <Button
                          onClick={handleEditItems}
                          disabled={
                            currentOrder.status === OrderStatus.DELIVERED ||
                            currentOrder.status === OrderStatus.CANCELLED
                          }
                        >
                          {t("admin-orders:orders.edit_items")}
                        </Button>
                      </Space>
                    </div>
                    <Table
                      dataSource={currentOrder.orderItems}
                      columns={columns}
                      rowKey="id"
                      pagination={false}
                      summary={() => (
                        <Table.Summary>
                          <Table.Summary.Row>
                            <Table.Summary.Cell
                              index={0}
                              colSpan={3}
                            ></Table.Summary.Cell>
                            <Table.Summary.Cell
                              index={1}
                              className="font-medium text-right"
                            >
                              {t("admin-orders:orders.subtotal")}:
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                              index={2}
                              className="font-medium"
                            >
                              {formatCurrency(currentOrder.totalProductAmount)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                          </Table.Summary.Row>
                          <Table.Summary.Row>
                            <Table.Summary.Cell
                              index={0}
                              colSpan={3}
                            ></Table.Summary.Cell>
                            <Table.Summary.Cell
                              index={1}
                              className="font-medium text-right"
                            >
                              {t("admin-orders:orders.shipping_fee")}:
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                              index={2}
                              className="font-medium"
                            >
                              {formatCurrency(currentOrder.shippingFee)}
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                          </Table.Summary.Row>
                          <Table.Summary.Row>
                            <Table.Summary.Cell
                              index={0}
                              colSpan={3}
                            ></Table.Summary.Cell>
                            <Table.Summary.Cell
                              index={1}
                              className="font-medium text-right"
                            >
                              <span className="text-lg">
                                {t("admin-orders:orders.total")}:
                              </span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell
                              index={2}
                              className="font-medium"
                            >
                              <span className="text-lg text-primary">
                                {formatCurrency(currentOrder.totalAmount)}
                              </span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
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
                    title={t("admin-orders:orders.payment_details")}
                    className="mb-6"
                    extra={
                      <Tag
                        color={PaymentStatusColors[currentOrder.payment.status]}
                      >
                        {t(
                          `admin-orders:orders.payment_statuses.${currentOrder.payment.status.toLowerCase()}`
                        )}
                      </Tag>
                    }
                  >
                    <Descriptions column={1} bordered>
                      <Descriptions.Item
                        label={t("admin-orders:orders.payment_method")}
                      >
                        {t(
                          `admin-orders:orders.payment_methods.${currentOrder.payment.paymentMethod.toLowerCase()}`
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={t("admin-orders:orders.amount")}
                      >
                        {formatCurrency(currentOrder.payment.amount)}
                      </Descriptions.Item>
                      {currentOrder.payment.paymentMethod ===
                        PaymentMethod.BANK_TRANSFER && (
                        <>
                          <Descriptions.Item
                            label={t("admin-orders:orders.bank_name")}
                          >
                            {currentOrder.payment.bankName ||
                              t("admin-orders:orders.not_provided")}
                          </Descriptions.Item>
                          <Descriptions.Item
                            label={t("admin-orders:orders.account_number")}
                          >
                            {currentOrder.payment.bankAccountNumber ||
                              t("admin-orders:orders.not_provided")}
                          </Descriptions.Item>
                          <Descriptions.Item
                            label={t(
                              "admin-orders:orders.transaction_reference"
                            )}
                          >
                            {currentOrder.payment.transactionReference ||
                              t("admin-orders:orders.not_provided")}
                          </Descriptions.Item>
                        </>
                      )}
                      {currentOrder.payment.paymentNote && (
                        <Descriptions.Item
                          label={t("admin-orders:orders.payment_note")}
                        >
                          {currentOrder.payment.paymentNote}
                        </Descriptions.Item>
                      )}
                    </Descriptions>

                    <Divider />

                    {/* Payment actions based on status */}
                    <div className="space-y-3">
                      {currentOrder.payment.status ===
                        PaymentStatus.PENDING && (
                        <>
                          <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            block
                            onClick={handlePaymentValidation}
                          >
                            {t("admin-orders:orders.payment_actions.validate")}
                          </Button>
                          <Button
                            danger
                            icon={<CloseCircleOutlined />}
                            block
                            onClick={handlePaymentValidation}
                          >
                            {t(
                              "admin-orders:orders.payment_actions.mark_failed"
                            )}
                          </Button>
                        </>
                      )}

                      {currentOrder.payment.status ===
                        PaymentStatus.COMPLETED && (
                        <Button
                          type="default"
                          icon={<CloseCircleOutlined />}
                          block
                          onClick={handleRefundPayment}
                        >
                          {t("admin-orders:orders.payment_actions.refund")}
                        </Button>
                      )}

                      {(currentOrder.payment.status === PaymentStatus.FAILED ||
                        currentOrder.payment.status ===
                          PaymentStatus.REFUNDED) && (
                        <Alert
                          message={
                            currentOrder.payment.status === PaymentStatus.FAILED
                              ? t(
                                  "admin-orders:orders.payment_actions.failed_notice"
                                )
                              : t(
                                  "admin-orders:orders.payment_actions.refunded_notice"
                                )
                          }
                          description={
                            currentOrder.payment.paymentNote ||
                            t("admin-orders:orders.no_reason_provided")
                          }
                          type={
                            currentOrder.payment.status === PaymentStatus.FAILED
                              ? "error"
                              : "warning"
                          }
                          showIcon
                        />
                      )}
                    </div>
                  </Card>
                )}

                {/* Update Status Actions */}
                <Card
                  title={t("admin-orders:orders.quick_actions")}
                  className="mb-6"
                >
                  <div className="space-y-3">
                    {getAllowedNextStatuses(currentOrder.status).map(
                      (status) => (
                        <Button
                          key={status}
                          type={
                            status === OrderStatus.CANCELLED
                              ? "default"
                              : "primary"
                          }
                          danger={status === OrderStatus.CANCELLED}
                          block
                          onClick={() => {
                            confirm({
                              title: t(
                                "admin-orders:orders.status_update_confirm",
                                {
                                  status: t(
                                    `admin-orders:orders.statuses.${status.toLowerCase()}`
                                  ),
                                }
                              ),
                              content: t(
                                "admin-orders:orders.status_update_message"
                              ),
                              onOk() {
                                dispatch(
                                  updateOrderStatus({
                                    id: currentOrder.id as `${string}-${string}-${string}-${string}-${string}`,
                                    request: {
                                      status,
                                    },
                                  })
                                ).then(() => {
                                  message.success(
                                    t("admin-orders:orders.status_updated")
                                  );
                                });
                              },
                            });
                          }}
                        >
                          {t(
                            `admin-orders:orders.status_actions.${status.toLowerCase()}`
                          )}
                        </Button>
                      )
                    )}

                    {getAllowedNextStatuses(currentOrder.status).length ===
                      0 && (
                      <Alert
                        message={t("admin-orders:orders.no_status_actions")}
                        description={t(
                          "admin-orders:orders.no_status_actions_message"
                        )}
                        type="info"
                        showIcon
                      />
                    )}
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={t("admin-orders:orders.tabs.history")} key="history">
            <OrderTimelineStatus order={currentOrder} />
          </TabPane>
          <TabPane tab={t("admin-orders:orders.tabs.shipping")} key="shipping">
            <OrderShippingTab 
              order={currentOrder} 
              onShippingFeeUpdated={() => {
                // Refresh order data
                if (id) {
                  dispatch(
                    getOrderDetails(
                      id as `${string}-${string}-${string}-${string}-${string}`
                    )
                  );
                }
              }} 
            />
          </TabPane>
          
          <TabPane tab={t("admin-orders:orders.tabs.payment")} key="payment">
            {/* Bạn có thể thêm nội dung chi tiết thanh toán ở đây */}
            <Card title={t("admin-orders:orders.payment_details")} className="mb-4">
              {currentOrder.payment ? (
                <Descriptions bordered column={1}>
                  <Descriptions.Item label={t("admin-orders:orders.payment_method")}>
                    {t(`admin-orders:orders.payment_methods.${currentOrder.payment.paymentMethod.toLowerCase()}`)}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("admin-orders:orders.amount")}>
                    {formatCurrency(currentOrder.payment.amount)}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("admin-orders:orders.payment_status")}>
                    <Tag color={PaymentStatusColors[currentOrder.payment.status]}>
                      {t(`admin-orders:orders.payment_statuses.${currentOrder.payment.status.toLowerCase()}`)}
                    </Tag>
                  </Descriptions.Item>
                  {currentOrder.payment.paymentDate && (
                    <Descriptions.Item label={t("admin-orders:orders.payment_date")}>
                      {formatDate(currentOrder.payment.paymentDate)}
                    </Descriptions.Item>
                  )}
                  {currentOrder.payment.transactionReference && (
                    <Descriptions.Item label={t("admin-orders:orders.transaction_reference")}>
                      {currentOrder.payment.transactionReference}
                    </Descriptions.Item>
                  )}
                  {currentOrder.payment.paymentNote && (
                    <Descriptions.Item label={t("admin-orders:orders.payment_note")}>
                      {currentOrder.payment.paymentNote}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              ) : (
                <Alert
                  message={t("admin-orders:orders.no_payment")}
                  description={t("admin-orders:orders.no_payment_desc")}
                  type="info"
                  showIcon
                />
              )}
            </Card>
          </TabPane>
        </Tabs>
      </motion.div>

      {/* Update Status Modal */}
      <Modal
        title={t("admin-orders:orders.status_update_title")}
        open={updateStatusModalVisible}
        onOk={handleUpdateStatusSubmit}
        onCancel={() => setUpdateStatusModalVisible(false)}
        confirmLoading={updating}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="status"
            label={t("admin-orders:orders.status")}
            rules={[
              { required: true, message: t("admin:validation.required") },
            ]}
          >
            <Select>
              {Object.values(OrderStatus).map((status) => (
                <Select.Option key={status} value={status}>
                  {t(`admin-orders:orders.statuses.${status.toLowerCase()}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="adminNote"
            label={t("admin-orders:orders.admin_note")}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Payment Validation Modal */}
      <Modal
        title={t("admin-orders:orders.payment_validation_title")}
        open={paymentModalVisible}
        onOk={handlePaymentValidationSubmit}
        onCancel={() => setPaymentModalVisible(false)}
        confirmLoading={updating}
        footer={[
          <Button key="back" onClick={() => setPaymentModalVisible(false)}>
            {t("common:actions.cancel")}
          </Button>,
          <Button key="failed" danger onClick={handleMarkPaymentAsFailed}>
            {t("admin-orders:orders.payment_actions.mark_failed")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handlePaymentValidationSubmit}
          >
            {t("admin-orders:orders.payment_actions.validate")}
          </Button>,
        ]}
      >
        <Form form={paymentForm} layout="vertical">
          <Form.Item
            name="isValid"
            label={t("admin-orders:orders.payment_validation_question")}
            rules={[
              { required: true, message: t("admin:validation.required") },
            ]}
            initialValue="yes"
          >
            <Radio.Group>
              <Radio value="yes">
                {t("admin-orders:orders.payment_valid")}
              </Radio>
              <Radio value="no">
                {t("admin-orders:orders.payment_invalid")}
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="adminNote"
            label={t("admin-orders:orders.admin_note")}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Refund Modal */}
      <Modal
        title={t("admin-orders:orders.refund_title")}
        open={refundModalVisible}
        onOk={handleRefundPaymentSubmit}
        onCancel={() => setRefundModalVisible(false)}
        confirmLoading={updating}
      >
        <Alert
          message={t("admin-orders:orders.refund_warning")}
          description={t("admin-orders:orders.refund_warning_desc")}
          type="warning"
          showIcon
          className="mb-4"
        />
        <Form form={refundForm} layout="vertical">
          <Form.Item
            name="reason"
            label={t("admin-orders:orders.refund_reason")}
            rules={[
              { required: true, message: t("admin:validation.required") },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Item Modal */}
      <Modal
        title={t("admin-orders:orders.add_item")}
        open={addItemModalVisible}
        onOk={handleAddItemSubmit}
        onCancel={() => setAddItemModalVisible(false)}
        confirmLoading={updating}
      >
        <Form form={itemForm} layout="vertical">
          <Form.Item
            name="productId"
            label={t("admin-orders:orders.product")}
            rules={[
              { required: true, message: t("admin:validation.required") },
            ]}
          >
            <ProductSelector value={undefined} onChange={undefined} />
          </Form.Item>
          <Form.Item name="variantId" label={t("admin-orders:orders.variant")}>
            <VariantSelector productId={itemForm.getFieldValue("productId")} value={undefined} onChange={undefined} />
          </Form.Item>
          <Form.Item
            name="quantity"
            label={t("admin-orders:orders.quantity")}
            rules={[
              { required: true, message: t("admin:validation.required") },
            ]}
            initialValue={1}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="priceOverride"
            label={t("admin-orders:orders.price_override")}
            extra={t("admin-orders:orders.price_override_hint")}
          >
            <InputNumber
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => (value || "").replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Items Modal */}
      <Modal
        title={t("admin-orders:orders.edit_items")}
        open={editItemsModalVisible}
        onOk={handleEditItemsSubmit}
        onCancel={() => setEditItemsModalVisible(false)}
        confirmLoading={updating}
        width={800}
      >
        <Form form={editItemsForm} layout="vertical">
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="border p-4 mb-4 rounded-md">
                    <Row gutter={16}>
                      <Col span={14}>
                        <Form.Item
                          {...restField}
                          name={[name, "productId"]}
                          label={t("admin-orders:orders.product")}
                          rules={[
                            {
                              required: true,
                              message: t("admin:validation.required"),
                            },
                          ]}
                        >
                          <ProductSelector value={undefined} onChange={undefined} />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          name={[name, "variantId"]}
                          label={t("admin-orders:orders.variant")}
                        >
                          <VariantSelector
                            productId={editItemsForm.getFieldValue([
                              "items",
                              name,
                              "productId",
                            ])} value={undefined} onChange={undefined}                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          label={t("admin-orders:orders.quantity")}
                          rules={[
                            {
                              required: true,
                              message: t("admin:validation.required"),
                            },
                          ]}
                        >
                          <InputNumber min={1} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "priceOverride"]}
                          label={t("admin-orders:orders.price")}
                        >
                          <InputNumber
                              formatter={(value) =>
                                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              parser={(value) => (value || "").replace(/\$\s?|(,*)/g, "")}
                              style={{ width: "100%" }}
                            />
                        </Form.Item>
                      </Col>
                      <Col span={4} className="flex items-end justify-end pb-6">
                        <Button
                          danger
                          onClick={() => remove(name)}
                          icon={<CloseCircleOutlined />}
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    {t("admin-orders:orders.add_item")}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

// ProductSelector component
interface ProductSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}
const ProductSelector: React.FC<ProductSelectorProps> = ({ value, onChange }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Replace with your actual API call
        const response = await fetch("/api/v1/products/all");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Select
      showSearch
      value={value}
      onChange={onChange}
      loading={loading}
      placeholder="Select a product"
      optionFilterProp="children"
      filterOption={(input, option) =>
        (option?.label?.toString() || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {products.map((product) => (
        <Select.Option key={product.id} value={product.id}>
          {product.name}
        </Select.Option>
      ))}
    </Select>
  );
};

// VariantSelector component
interface VariantSelectorProps {
  productId?: string;
  value?: string;
  onChange?: (value: string) => void;
}
const VariantSelector: React.FC<VariantSelectorProps> = ({ productId, value, onChange }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) {
      setVariants([]);
      return;
    }

    const fetchVariants = async () => {
      setLoading(true);
      try {
        // Replace with your actual API call
        const response = await fetch(`/api/v1/products/${productId}`);
        const data = await response.json();
        setVariants(data.variants || []);
      } catch (error) {
        console.error("Error fetching variants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [productId]);

  if (!productId) {
    return <Select disabled placeholder="Select a product first" />;
  }

  return (
    <Select
      showSearch
      value={value}
      onChange={onChange}
      loading={loading}
      placeholder="Select a variant (optional)"
      optionFilterProp="children"
      filterOption={(input, option) =>
        option?.children
          ? option.children.toString().toLowerCase().includes(input.toLowerCase())
          : false
      }
      allowClear
    >
      {variants.map((variant) => (
        <Select.Option key={variant.id} value={variant.id}>
          {variant.size} {variant.color && `- ${variant.color}`}
        </Select.Option>
      ))}
    </Select>
  );
};

export default OrderDetail;
