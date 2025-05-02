import
 { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Tag,
  Descriptions,
  Skeleton,
  Empty,
  Divider,
  Tooltip,
  Breadcrumb,
  Tabs,
  Statistic,
  Badge,
  Alert,
  Modal,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  LinkOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  ExportOutlined,
  PictureOutlined,
  CheckCircleOutlined,
  StopOutlined,
  AreaChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AdminRegionService } from "@/admin/services/adminRegionService";
import { RegionResponse } from "@/admin/types";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

// Initialize dayjs plugins
dayjs.extend(localizedFormat);

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.2,
    },
  },
};

const RegionDetail = () => {
  const { t } = useTranslation(["admin", "common"]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [region, setRegion] = useState<RegionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);

  // Statistics (mock data - would be replaced with actual API data)
  const [stats] = useState({
    products: 24,
    views: 1250,
    orders: 68,
    revenue: 3450,
  });

  // Fetch region data
  useEffect(() => {
    if (id) {
      fetchRegion(id);
    }
  }, [id]);

  const fetchRegion = async (regionId: string) => {
    setLoading(true);
    try {
      const data = await AdminRegionService.getRegionById(regionId);
      setRegion(data);
    } catch (error) {
      console.error("Error fetching region:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = () => {
    if (id) {
      navigate(`/admin/regions/${id}`);
    }
  };

  // Handle delete button click
  const showDeleteConfirm = () => {
    setDeleteConfirmVisible(true);
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!id) return;

    try {
      await AdminRegionService.deleteRegion(id);
      setDeleteConfirmVisible(false);
      navigate("/admin/regions");
    } catch (error) {
      console.error("Error deleting region:", error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("LL LT");
  };

  // Show image preview
  const showImagePreview = () => {
    if (region?.imageUrl) {
      setImagePreviewVisible(true);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton active paragraph={{ rows: 1 }} />
        <Card>
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </Card>
      </div>
    );
  }

  if (!region) {
    return (
      <Card className="text-center py-12">
        <Empty
          description={t("admin:regions.not_found")}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button
          type="primary"
          className="mt-4"
          onClick={() => navigate("/admin/regions")}
        >
          {t("admin:actions.back_to_list")}
        </Button>
      </Card>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb className="mb-2">
            <Breadcrumb.Item>{t("admin:dashboard.title")}</Breadcrumb.Item>
            <Breadcrumb.Item
              onClick={() => navigate("/admin/regions")}
              className="cursor-pointer"
            >
              {t("admin:regions.title")}
            </Breadcrumb.Item>
            <Breadcrumb.Item>{region.name}</Breadcrumb.Item>
          </Breadcrumb>

          <div className="flex items-center gap-2">
            <Title level={2} className="mb-0 dark:text-white">
              {region.name}
            </Title>
            <Tag color={region.active ? "success" : "error"} className="ml-2">
              {region.active
                ? t("admin:regions.active")
                : t("admin:regions.inactive")}
            </Tag>
          </div>

          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
            <LinkOutlined className="mr-1" />
            <Text
              copyable={{ text: region.slug }}
              className="text-gray-500 dark:text-gray-400"
            >
              /{region.slug}
            </Text>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/regions")}
          >
            {t("admin:actions.back")}
          </Button>
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
            {t("admin:actions.edit")}
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={showDeleteConfirm}>
            {t("admin:actions.delete")}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main region information */}
        <motion.div className="lg:col-span-2" variants={slideUp}>
          <Card className="shadow-sm dark:bg-gray-800">
            <Tabs defaultActiveKey="info" className="overflow-visible">
              <TabPane
                tab={
                  <span className="flex items-center">
                    <InfoCircleOutlined className="mr-1" />
                    {t("admin:regions.tab_info")}
                  </span>
                }
                key="info"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="md:col-span-2">
                    <div
                      className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 h-60 md:h-80 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
                      onClick={showImagePreview}
                    >
                      {region.imageUrl ? (
                        <img
                          src={region.imageUrl}
                          alt={region.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                          <PictureOutlined style={{ fontSize: 48 }} />
                          <Text className="text-gray-400 dark:text-gray-500 mt-2">
                            {t("admin:regions.no_image")}
                          </Text>
                        </div>
                      )}

                      {/* View full image button */}
                      {region.imageUrl && (
                        <div className="absolute right-4 bottom-4">
                          <Tooltip title={t("admin:actions.view_image")}>
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<EyeOutlined />}
                              onClick={showImagePreview}
                            />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <Title level={4} className="dark:text-white">
                      {t("admin:regions.description")}
                    </Title>

                    {region.description ? (
                      <Paragraph className="text-gray-700 dark:text-gray-300">
                        {region.description}
                      </Paragraph>
                    ) : (
                      <Alert
                        type="warning"
                        message={t("admin:regions.no_description")}
                        className="mb-4"
                        showIcon
                      />
                    )}
                  </div>
                </div>

                <Divider />

                {/* Details */}
                <Descriptions
                  title={
                    <Title level={4} className="dark:text-white">
                      {t("admin:regions.details")}
                    </Title>
                  }
                  bordered
                  column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
                  className="region-details-table"
                >
                  <Descriptions.Item label={t("admin:regions.id")}>
                    <Text copyable>{region.id}</Text>
                  </Descriptions.Item>

                  <Descriptions.Item label={t("admin:regions.created_at")}>
                    <span className="flex items-center">
                      <ClockCircleOutlined className="mr-1 text-gray-500" />
                      {formatDate(region.createdAt)}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label={t("admin:regions.updated_at")}>
                    <span className="flex items-center">
                      <ClockCircleOutlined className="mr-1 text-gray-500" />
                      {formatDate(region.updatedAt)}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label={t("admin:regions.status")}>
                    {region.active ? (
                      <Badge
                        status="success"
                        text={
                          <span className="flex items-center">
                            <CheckCircleOutlined className="mr-1 text-green-500" />
                            {t("admin:regions.active")}
                          </span>
                        }
                      />
                    ) : (
                      <Badge
                        status="error"
                        text={
                          <span className="flex items-center">
                            <StopOutlined className="mr-1 text-red-500" />
                            {t("admin:regions.inactive")}
                          </span>
                        }
                      />
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label={t("admin:regions.slug")}>
                    <div className="flex items-center">
                      <LinkOutlined className="mr-1 text-gray-500" />
                      <Text
                        copyable
                        className="text-gray-800 dark:text-gray-300"
                      >
                        /{region.slug}
                      </Text>
                    </div>
                  </Descriptions.Item>

                  <Descriptions.Item label={t("admin:regions.linked_products")}>
                    <div className="flex items-center">
                      <ShoppingOutlined className="mr-1 text-gray-500" />
                      <Text className="text-gray-800 dark:text-gray-300">
                        {stats.products} {t("admin:regions.products")}
                      </Text>
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>

              <TabPane
                tab={
                  <span className="flex items-center">
                    <AreaChartOutlined className="mr-1" />
                    {t("admin:regions.tab_stats")}
                  </span>
                }
                key="stats"
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className="shadow-sm text-center">
                    <Statistic
                      title={t("admin:regions.total_products")}
                      value={stats.products}
                      prefix={<ShoppingOutlined />}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>

                  <Card className="shadow-sm text-center">
                    <Statistic
                      title={t("admin:regions.total_views")}
                      value={stats.views}
                      prefix={<EyeOutlined />}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Card>

                  <Card className="shadow-sm text-center">
                    <Statistic
                      title={t("admin:regions.total_orders")}
                      value={stats.orders}
                      prefix={<ShoppingOutlined />}
                      valueStyle={{ color: "#fa8c16" }}
                    />
                  </Card>

                  <Card className="shadow-sm text-center">
                    <Statistic
                      title={t("admin:regions.total_revenue")}
                      value={stats.revenue}
                      prefix="$"
                      valueStyle={{ color: "#f5222d" }}
                    />
                  </Card>
                </div>

                <Alert
                  type="info"
                  message={t("admin:regions.stats_note")}
                  description={t("admin:regions.stats_description")}
                  showIcon
                />
              </TabPane>

              <TabPane
                tab={
                  <span className="flex items-center">
                    <ExportOutlined className="mr-1" />
                    {t("admin:regions.tab_export")}
                  </span>
                }
                key="export"
              >
                <Alert
                  message={t("admin:regions.export_title")}
                  description={t("admin:regions.export_description")}
                  type="info"
                  showIcon
                  className="mb-6"
                />

                <div className="flex flex-wrap gap-4">
                  <Button
                    type="primary"
                    icon={<ExportOutlined />}
                    className="min-w-[180px]"
                  >
                    {t("admin:actions.export_json")}
                  </Button>

                  <Button icon={<ExportOutlined />} className="min-w-[180px]">
                    {t("admin:actions.export_csv")}
                  </Button>

                  <Button icon={<ExportOutlined />} className="min-w-[180px]">
                    {t("admin:actions.export_excel")}
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={cardVariants}>
          <div className="space-y-6">
            {/* Quick actions */}
            <Card
              title={
                <Text strong className="dark:text-white flex items-center">
                  <TeamOutlined className="mr-2" />
                  {t("admin:regions.quick_actions")}
                </Text>
              }
              className="shadow-sm dark:bg-gray-800"
            >
              <div className="space-y-2">
                <Button
                  type="primary"
                  icon={<ShoppingOutlined />}
                  block
                  onClick={() =>
                    navigate("/admin/products?regionId=" + region.id)
                  }
                >
                  {t("admin:regions.view_products")}
                </Button>

                <Button
                  icon={<EnvironmentOutlined />}
                  block
                  onClick={() => window.open(`/${region.slug}`, "_blank")}
                >
                  {t("admin:regions.view_on_site")}
                </Button>

                <Button icon={<EditOutlined />} block onClick={handleEdit}>
                  {t("admin:actions.edit")}
                </Button>
              </div>
            </Card>

            {/* Danger zone */}
            <Card
              title={
                <Text
                  strong
                  className="text-red-600 dark:text-red-400 flex items-center"
                >
                  <DeleteOutlined className="mr-2" />
                  {t("admin:regions.danger_zone")}
                </Text>
              }
              className="shadow-sm dark:bg-gray-800"
            >
              <Alert
                message={t("admin:regions.delete_warning")}
                description={t("admin:regions.delete_warning_desc")}
                type="warning"
                showIcon
                className="mb-4"
              />

              <Button
                danger
                icon={<DeleteOutlined />}
                block
                onClick={showDeleteConfirm}
              >
                {t("admin:actions.delete")}
              </Button>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Image Preview Modal */}
      <Modal
        open={imagePreviewVisible}
        footer={null}
        onCancel={() => setImagePreviewVisible(false)}
        width={800}
        centered
        title={t("admin:regions.image_preview")}
      >
        {region.imageUrl && (
          <img
            src={region.imageUrl}
            alt={region.name}
            style={{ width: "100%" }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <Text className="text-red-600">
            {t("admin:regions.delete_confirm_title")}
          </Text>
        }
        open={deleteConfirmVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteConfirmVisible(false)}
        okText={t("admin:actions.delete")}
        cancelText={t("admin:actions.cancel")}
        okButtonProps={{ danger: true }}
        centered
      >
        <p>{t("admin:regions.delete_confirm")}</p>
        <p className="font-semibold">{region.name}</p>

        <Alert
          message={t("admin:regions.delete_permanent")}
          description={t("admin:regions.delete_cascade_warning")}
          type="warning"
          showIcon
          className="mt-4"
        />
      </Modal>

      {/* Custom styles */}
      <style>{`
        .region-details-table .ant-descriptions-item-label {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .dark .region-details-table .ant-descriptions-item-label {
          background-color: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.85);
        }
        
        .dark .region-details-table .ant-descriptions-item-content {
          color: rgba(255, 255, 255, 0.65);
        }
      `}</style>
    </motion.div>
  );
};

export default RegionDetail;
