import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Tag,
  Input,
  Card,
  message,
  notification,
  Select,
  Form,
  Row,
  Col,
  Tooltip,
  Dropdown,
  Badge,
  Empty,
  Skeleton,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  ReloadOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCategories,
  fetchAllCategories,
  deleteCategory,
  setViewMode,
  setSearch,
  setSort,
  setCurrentPage,
  setPageSize,
  setParentFilter,
  setActiveFilter,
  resetFilters,
} from "@/admin/store/slices/categorySlice";
import { CategoryResponse } from "@/admin/types";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4 },
  },
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

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// Category Card Component
interface CategoryCardProps {
  category: CategoryResponse;
  onEdit: (category: CategoryResponse) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  onView,
}) => {
  const { t } = useTranslation(["admin", "common"]);

  return (
    <motion.div variants={slideUp} className="h-full">
      <Card
        hoverable
        className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col"
        cover={
          <div className="relative h-40 bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-t-lg">
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <AppstoreOutlined className="text-4xl text-gray-300 dark:text-gray-600" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Tag
                color={category.active ? "success" : "error"}
                className="px-2 py-1 rounded-full text-xs font-medium"
              >
                {category.active
                  ? t("admin:categories.active")
                  : t("admin:categories.inactive")}
              </Tag>
            </div>
          </div>
        }
      >
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-2 flex items-start justify-between">
            <Tooltip title={category.name}>
              <h3 className="text-lg font-medium truncate dark:text-white">
                {category.name}
              </h3>
            </Tooltip>
            {Array.isArray(category.children) &&
              category.children.length > 0 && (
                <Badge count={category.children.length} className="ml-2" />
              )}
          </div>

          {category.parent && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span className="font-medium">
                {t("admin:categories.parent")}:
              </span>{" "}
              {category.parent.name}
            </div>
          )}

          {category.description && (
            <Tooltip title={category.description}>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {category.description}
              </p>
            </Tooltip>
          )}

          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">
                {t("admin:categories.display_order")}:
              </span>{" "}
              {category.displayOrder || 0}
            </div>

            <Space size="small">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => onView(category.id)}
              />
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(category)}
              />
              <Popconfirm
                title={t("admin:categories.delete_confirm")}
                onConfirm={() => onDelete(category.id)}
                okText={t("admin:actions.yes")}
                cancelText={t("admin:actions.no")}
                placement="left"
              >
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Space>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Skeleton Loader
const CategorySkeleton: React.FC = () => (
  <Card className="rounded-lg shadow-sm h-full">
    <Skeleton.Image className="w-full h-40 mb-4" active />
    <Skeleton active paragraph={{ rows: 2 }} />
  </Card>
);

// Main CategoryList Component
const CategoryList: React.FC = () => {
  const { t } = useTranslation(["admin", "common"]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    categories,
    pagination,
    loading,
    error,
    viewMode,
    filters,
  } = useAppSelector((state) => state.categories);

  const [form] = Form.useForm();
  const [showFilters, setShowFilters] = useState(false);
  const [allCategories, setAllCategories] = useState<CategoryResponse[]>([]);

  // Fetch categories on component mount or filter/pagination change
  useEffect(() => {
    dispatch(fetchCategories());
  }, [
    dispatch,
    pagination.current,
    pagination.pageSize,
    filters.search,
    filters.sort,
    filters.parentId,
    filters.active,
  ]);

  // Fetch all categories for parent filter dropdown
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const data = await dispatch(fetchAllCategories()).unwrap();
        setAllCategories(data);
      } catch (err) {
        console.error("Failed to fetch parent categories", err);
      }
    };

    fetchParentCategories();
  }, [dispatch]);

  // Handle search input change with debounce
  const handleSearch = debounce((value: string) => {
    dispatch(setSearch(value));
  }, 500);

  // Handle category deletion
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      message.success(t("admin:categories.delete_success"));
      dispatch(fetchCategories());
    } catch (err) {
      notification.error({
        message: t("admin:categories.delete_error"),
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  // Handle edit button click
  const handleEdit = (category: CategoryResponse) => {
    navigate(`/admin/categories/edit/${category.id}`);
  };

  // Handle view button click
  const handleView = (id: string) => {
    navigate(`/admin/categories/${id}`);
  };

  // Handle filter form submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterSubmit = (values: any) => {
    dispatch(setParentFilter(values.parentId));
    dispatch(setActiveFilter(values.active));
    setShowFilters(false);
  };

  // Reset all filters
  const handleResetFilters = () => {
    form.resetFields();
    dispatch(resetFilters());
    setShowFilters(false);
  };

  // Handle table pagination change
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (pagination: any, sorter: any) => {
    dispatch(setCurrentPage(pagination.current));

    if (sorter && sorter.field && sorter.order) {
      const order = sorter.order === "ascend" ? "asc" : "desc";
      dispatch(setSort(`${sorter.field},${order}`));
    }
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
  };

  // Define sort menu items
  const sortMenuItems = [
    { key: "name,asc", label: t("admin:sort.name_asc") },
    { key: "name,desc", label: t("admin:sort.name_desc") },
    { key: "createdAt,desc", label: t("admin:sort.newest") },
    { key: "createdAt,asc", label: t("admin:sort.oldest") },
    {
      key: "displayOrder,asc",
      label: `${t("admin:categories.display_order")} (${t("admin:sort.asc")})`,
    },
    {
      key: "displayOrder,desc",
      label: `${t("admin:categories.display_order")} (${t("admin:sort.desc")})`,
    },
  ];

  // Handle sort dropdown menu click
  const handleSortMenuClick = ({ key }: { key: string }) => {
    dispatch(setSort(key));
  };

  // Define table columns
  const columns = [
    {
      title: t("admin:categories.image"),
      dataIndex: "imageUrl",
      key: "image",
      width: 80,
      render: (imageUrl: string, record: CategoryResponse) => (
        <div className="relative w-16 h-16">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={record.name}
              className="w-full h-full object-cover rounded-md shadow-sm"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
              <AppstoreOutlined className="text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>
      ),
    },
    {
      title: t("admin:categories.name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text: string, record: CategoryResponse) => (
        <div>
          <div className="font-medium dark:text-white">{text}</div>
          {record.slug && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              /{record.slug}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t("admin:categories.parent"),
      dataIndex: ["parent", "name"],
      key: "parent",
      render: (_text: string, record: CategoryResponse) => 
      record.parent ? (
          <Tag color="blue">{record.parent.name}</Tag>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">-</span>
        ),
    },
    {
      title: t("admin:categories.display_order"),
      dataIndex: "displayOrder",
      key: "displayOrder",
      sorter: true,
      render: (order: number) => order || 0,
    },
    {
      title: t("admin:categories.status"),
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag
          color={active ? "success" : "error"}
          className="px-2 py-1 rounded-md"
        >
          {active
            ? t("admin:categories.active")
            : t("admin:categories.inactive")}
        </Tag>
      ),
    },
    {
      title: t("admin:categories.actions"),
      key: "action",
      width: 180,
      render: (_: unknown, record: CategoryResponse) => (
        <Space size="small">
          <Tooltip title={t("common:actions.view")}>
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record.id)}
              className="flex items-center justify-center"
            />
          </Tooltip>
          <Tooltip title={t("admin:actions.edit")}>
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className="flex items-center justify-center"
            />
          </Tooltip>
          <Popconfirm
            title={t("admin:categories.delete_confirm")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("admin:actions.yes")}
            cancelText={t("admin:actions.no")}
            placement="left"
          >
            <Tooltip title={t("admin:actions.delete")}>
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
                className="flex items-center justify-center"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold dark:text-white flex items-center">
          {t("admin:categories.title")}
          <Tooltip title={t("admin:categories.description")}>
            <InfoCircleOutlined className="ml-2 text-gray-400 text-base" />
          </Tooltip>
        </h1>

        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/categories/new")}
            className="flex items-center"
          >
            {t("admin:categories.add")}
          </Button>

          <Tooltip title={t("admin:actions.refresh")}>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => dispatch(fetchCategories())}
              loading={loading}
              className="flex items-center justify-center"
            />
          </Tooltip>
        </div>
      </div>

      <Card className="shadow-sm dark:bg-gray-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <Input.Search
            placeholder={t("admin:categories.search_placeholder")}
            allowClear
            onChange={(e) => handleSearch(e.target.value)}
            className="md:w-80"
            prefix={<SearchOutlined className="text-gray-400" />}
          />

          <div className="flex items-center gap-3">
            <Dropdown
              menu={{
                items: sortMenuItems.map((item) => ({
                  key: item.key,
                  label: item.label,
                })),
                onClick: handleSortMenuClick,
                selectedKeys: [filters.sort],
              }}
              trigger={["click"]}
            >
              <Button
                icon={<SortAscendingOutlined />}
                className={`flex items-center ${
                  filters.sort !== "displayOrder,asc"
                    ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                    : ""
                }`}
              >
                {t("admin:actions.sort")}
              </Button>
            </Dropdown>

            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center ${
                showFilters || filters.parentId || filters.active !== undefined
                  ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                  : ""
              }`}
            >
              {t("common:filters")}
            </Button>

            <div className="hidden sm:flex border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
              <Tooltip title={t("admin:view.table")}>
                <Button
                  type={viewMode === "table" ? "primary" : "default"}
                  icon={<TableOutlined />}
                  onClick={() => dispatch(setViewMode("table"))}
                  className={`flex items-center justify-center ${
                    viewMode !== "table" ? "border-0" : ""
                  }`}
                />
              </Tooltip>
              <Tooltip title={t("admin:view.grid")}>
                <Button
                  type={viewMode === "grid" ? "primary" : "default"}
                  icon={<AppstoreOutlined />}
                  onClick={() => dispatch(setViewMode("grid"))}
                  className={`flex items-center justify-center ${
                    viewMode !== "grid" ? "border-0" : ""
                  }`}
                />
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Filter panel with animation */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFilterSubmit}
                initialValues={{
                  parentId: filters.parentId,
                  active: filters.active,
                }}
                className="space-y-4"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="parentId"
                      label={t("admin:categories.parent")}
                    >
                      <Select
                        placeholder={t("admin:categories.select_parent")}
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={allCategories.map((cat) => ({
                          value: cat.id,
                          label: cat.name,
                        }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="active"
                      label={t("admin:categories.status")}
                    >
                      <Select
                        placeholder={t("common:all")}
                        allowClear
                        options={[
                          { value: true, label: t("admin:categories.active") },
                          {
                            value: false,
                            label: t("admin:categories.inactive"),
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <div className="flex justify-end space-x-2">
                  <Button onClick={handleResetFilters}>
                    {t("common:reset")}
                  </Button>
                  <Button type="primary" htmlType="submit">
                    {t("common:apply")}
                  </Button>
                </div>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-600 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            <p className="font-medium">{t("admin:categories.fetch_error")}</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading state or content */}
        {loading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
            </div>
          ) : (
            <Skeleton active paragraph={{ rows: 5 }} />
          )
        ) : categories.length === 0 ? (
          <Empty
            description={
              <span className="text-gray-500 dark:text-gray-400">
                {filters.search ||
                filters.parentId ||
                filters.active !== undefined
                  ? t("admin:categories.no_results")
                  : t("admin:categories.no_categories")}
              </span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="my-8"
          />
        ) : (
          <>
            {/* Grid view */}
            {viewMode === "grid" && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {categories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={handleView}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Table view */}
            {viewMode === "table" && (
              <Table
                columns={columns}
                dataSource={categories}
                rowKey="id"
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  onShowSizeChange: handlePageSizeChange,
                  showTotal: (total) =>
                    t("admin:pagination.total_items", { total }),
                }}
                onChange={handleTableChange}
                loading={loading}
                className="category-table-animation"
                rowClassName="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                scroll={{ x: "max-content" }}
              />
            )}
          </>
        )}
      </Card>

      {/* Add custom CSS for animations */}
      <style>{`
        .category-table-animation tbody tr {
          transition: all 0.3s ease;
        }

        .category-table-animation tbody tr:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .dark .category-table-animation tbody tr:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </motion.div>
  );
};

export default CategoryList;
