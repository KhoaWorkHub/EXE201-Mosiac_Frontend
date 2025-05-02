import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Space,
  Card,
  Typography,
  Input,
  Tag,
  Popconfirm,
  notification,
  Empty,
  Skeleton,
  Switch,
  Breadcrumb,
  Tooltip,
  Dropdown,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AdminRegionService } from "@/admin/services/adminRegionService";
import { RegionResponse, type RegionCardProps } from "@/admin/types";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash/debounce";

const { Title, Text } = Typography;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Card view item component for region
const RegionCard: React.FC<RegionCardProps> = ({
  region,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <motion.div variants={slideUp} layout>
      <Card
        hoverable
        className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-full"
        cover={
          <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
            {region.imageUrl ? (
              <img
                src={region.imageUrl}
                alt={region.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
                <PictureOutlined className="text-4xl text-gray-400 dark:text-gray-500" />
              </div>
            )}
            <div className="absolute top-3 right-3">
              <Tag
                color={region.active ? "success" : "error"}
                className="shadow-sm"
              >
                {region.active
                  ? t("admin:regions.active")
                  : t("admin:regions.inactive")}
              </Tag>
            </div>
          </div>
        }
        actions={[
          <Tooltip title={t("admin:actions.edit")}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(region)}
              aria-label={t("admin:actions.edit")}
            />
          </Tooltip>,
          <Tooltip title={t("admin:actions.toggle_status")}>
            <Switch
              checked={region.active}
              onChange={() => onToggleStatus(region)}
              size="small"
            />
          </Tooltip>,
          <Popconfirm
            title={t("admin:regions.delete_confirm")}
            onConfirm={() => onDelete(region.id)}
            okText={t("admin:actions.yes")}
            cancelText={t("admin:actions.no")}
          >
            <Tooltip title={t("admin:actions.delete")}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                aria-label={t("admin:actions.delete")}
              />
            </Tooltip>
          </Popconfirm>,
        ]}
      >
        <div className="px-1 py-2">
          <div className="flex justify-between items-start mb-2">
            <Title level={5} className="mb-0 line-clamp-1 dark:text-white">
              {region.name}
            </Title>
          </div>
          {region.description && (
            <Text className="line-clamp-2 text-gray-600 dark:text-gray-300 text-sm mb-2">
              {region.description}
            </Text>
          )}
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
            <GlobalOutlined className="mr-1" />
            <Text className="text-gray-500 dark:text-gray-400">
              /{region.slug}
            </Text>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const RegionList = () => {
  const { t } = useTranslation(["admin", "common"]);
  const navigate = useNavigate();

  // State
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

const { current, pageSize } = pagination;

// ① Định nghĩa fetchRegions ngoài useEffect
const fetchRegions = useCallback(async () => {
  setLoading(true);
  try {
    const sort = `${sortField},${sortOrder}`;
    const resp = await AdminRegionService.getRegions(
      current - 1,
      pageSize,
      sort
    );
    setRegions(resp.content);
    setPagination(prev =>
      prev.total === resp.totalElements
        ? prev
        : { ...prev, total: resp.totalElements }
    );
  } catch (err) {
    notification.error({
      message: t("admin:regions.fetch_error"),
      description: err instanceof Error ? err.message : "Unknown error",
    });
  } finally {
    setLoading(false);
  }
}, [current, pageSize, sortField, sortOrder, t]);

// ② Dùng fetchRegions trong useEffect để load lần đầu / mỗi lần deps thay đổi
useEffect(() => {
  fetchRegions();
}, [fetchRegions]);



  // Handle search
  const handleSearch = debounce((value: string) => {
    setSearchText(value);
    setPagination({
      ...pagination,
      current: 1, // Reset to first page on search
    });
  }, 500);

  // Handle edit
  const handleEdit = (region: RegionResponse) => {
    navigate(`/admin/regions/${region.id}`);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await AdminRegionService.deleteRegion(id);
      notification.success({
        message: t("admin:regions.delete_success"),
        placement: "topRight",
      });
      fetchRegions();
    } catch (error) {
      notification.error({
        message: t("admin:regions.delete_error"),
        description: error instanceof Error ? error.message : "Unknown error",
        placement: "topRight",
      });
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (region: RegionResponse) => {
    try {
      const updatedRegion = {
        ...region,
        active: !region.active,
      };

      await AdminRegionService.updateRegion(region.id, {
        name: region.name,
        slug: region.slug,
        description: region.description,
        imageUrl: region.imageUrl,
        active: !region.active,
      });

      notification.success({
        message: updatedRegion.active
          ? t("admin:regions.activate_success")
          : t("admin:regions.deactivate_success"),
        placement: "topRight",
      });

      fetchRegions();
    } catch (error) {
      notification.error({
        message: t("admin:regions.update_error"),
        description: error instanceof Error ? error.message : "Unknown error",
        placement: "topRight",
      });
    }
  };

  // Handle table sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Toggle order if clicking on the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter regions based on search text
  const filteredRegions = searchText
    ? regions.filter(
        (region) =>
          region.name.toLowerCase().includes(searchText.toLowerCase()) ||
          (region.description || "")
            .toLowerCase()
            .includes(searchText.toLowerCase())
      )
    : regions;

  // Table columns
  const columns = [
    {
      title: t("admin:regions.image"),
      dataIndex: "imageUrl",
      key: "image",
      width: 100,
      render: (imageUrl: string) =>
        imageUrl ? (
          <img
            src={imageUrl}
            alt="region"
            className="w-16 h-16 object-cover rounded shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
            <EnvironmentOutlined className="text-gray-500 dark:text-gray-400 text-xl" />
          </div>
        ),
    },
    {
      title: (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleSortChange("name")}
        >
          {t("admin:regions.name")}
          {sortField === "name" &&
            (sortOrder === "asc" ? (
              <SortAscendingOutlined className="ml-1" />
            ) : (
              <SortDescendingOutlined className="ml-1" />
            ))}
        </div>
      ),
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-medium dark:text-white">{text}</span>
      ),
    },
    {
      title: t("admin:regions.slug"),
      dataIndex: "slug",
      key: "slug",
      render: (text: string) => (
        <Text className="text-gray-500 dark:text-gray-400">{text}</Text>
      ),
    },
    {
      title: t("admin:regions.status"),
      dataIndex: "active",
      key: "active",
      render: (active: boolean, record: RegionResponse) => (
        <Switch
          checked={active}
          onChange={() => handleToggleStatus(record)}
          size="small"
        />
      ),
    },
    {
      title: t("admin:regions.actions"),
      key: "action",
      render: (_: unknown, record: RegionResponse) => (
        <Space size="small">
          <Tooltip title={t("admin:actions.edit")}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t("admin:regions.delete_confirm")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("admin:actions.yes")}
            cancelText={t("admin:actions.no")}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Define sort options for dropdown
  const sortOptions = [
    { key: "name-asc", label: t("admin:sort.name_asc") },
    { key: "name-desc", label: t("admin:sort.name_desc") },
    { key: "createdAt-desc", label: t("admin:sort.newest") },
    { key: "createdAt-asc", label: t("admin:sort.oldest") },
  ];

  // Handle sort option selection
  const handleSortOptionSelect = ({ key }: { key: string }) => {
    const [field, order] = key.split("-");
    setSortField(field);
    setSortOrder(order as "asc" | "desc");
  };

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
            <Breadcrumb.Item>{t("admin:regions.title")}</Breadcrumb.Item>
          </Breadcrumb>
          <Title level={2} className="mb-0 dark:text-white flex items-center">
            {t("admin:regions.title")}
            <Tooltip title={t("admin:regions.info_tooltip")}>
              <InfoCircleOutlined className="ml-2 text-gray-400 text-lg" />
            </Tooltip>
          </Title>
          <Text className="text-gray-500 dark:text-gray-400">
            {t("admin:regions.description")}
          </Text>
        </div>
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/regions/new")}
            className="flex items-center"
          >
            {t("admin:regions.add")}
          </Button>
          <Tooltip title={t("admin:actions.refresh")}>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchRegions}
              loading={loading}
            />
          </Tooltip>
        </div>
      </div>

      {/* Filters and controls */}
      <Card className="shadow-sm dark:bg-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <Input.Search
            placeholder={t("admin:regions.search_placeholder")}
            allowClear
            onChange={(e) => handleSearch(e.target.value)}
            className="md:w-80"
            prefix={<SearchOutlined className="text-gray-400" />}
          />

          <div className="flex items-center gap-3">
            <Dropdown
              menu={{
                items: sortOptions.map((opt) => ({
                  key: opt.key,
                  label: opt.label,
                })),
                onClick: handleSortOptionSelect,
              }}
              trigger={["click"]}
            >
              <Button icon={<SortAscendingOutlined />}>
                {t("admin:actions.sort")}
              </Button>
            </Dropdown>

            <div className="flex border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
              <Tooltip title={t("admin:view.table")}>
                <Button
                  type={viewMode === "table" ? "primary" : "default"}
                  icon={<FilterOutlined />}
                  onClick={() => setViewMode("table")}
                  className={viewMode !== "table" ? "border-0" : ""}
                />
              </Tooltip>
              <Tooltip title={t("admin:view.grid")}>
                <Button
                  type={viewMode === "grid" ? "primary" : "default"}
                  icon={<EnvironmentOutlined />}
                  onClick={() => setViewMode("grid")}
                  className={viewMode !== "grid" ? "border-0" : ""}
                />
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="h-80">
                  <Skeleton active paragraph={{ rows: 3 }} />
                </Card>
              ))}
            </div>
          ) : (
            <Skeleton active />
          )
        ) : filteredRegions.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              searchText
                ? t("admin:regions.no_results")
                : t("admin:regions.no_regions")
            }
          />
        ) : (
          <>
            {/* Grid view */}
            {viewMode === "grid" && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {filteredRegions.map((region) => (
                    <RegionCard
                      key={region.id}
                      region={region}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Table view */}
            {viewMode === "table" && (
              <Table
                columns={columns}
                dataSource={filteredRegions}
                rowKey="id"
                pagination={{
                  ...pagination,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
                  showTotal: (total) =>
                    t("admin:pagination.total_items", { total }),
                }}
                onChange={(newPagination) => {
                  setPagination({
                    current: newPagination.current || 1,
                    pageSize: newPagination.pageSize || 10,
                    total: pagination.total,
                  });
                }}
                className="custom-table-animation"
              />
            )}
          </>
        )}
      </Card>

      {/* Add CSS for animations */}
      <style>{`
        .custom-table-animation tbody tr {
          transition: all 0.3s ease;
        }
        .custom-table-animation tbody tr:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
};

export default RegionList;
