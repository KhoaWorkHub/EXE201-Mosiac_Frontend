import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  Upload,
  Card,
  message,
  notification,
  Divider,
  Tooltip,
  Row,
  Col,
  Popconfirm,
  InputNumber,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCategoryById,
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearCurrentCategory,
} from "@/admin/store/slices/categorySlice";
import { AdminCategoryService } from "@/admin/services/adminCategoryService";
import { CategoryRequest } from "@/admin/types";
import { motion } from "framer-motion";
import { RcFile } from "antd/es/upload";

const { TextArea } = Input;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
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

const CategoryForm: React.FC = () => {
  const { t } = useTranslation(["admin", "common"]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { currentCategory, submitting } = useAppSelector(
    (state) => state.categories
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [slugCustomized, setSlugCustomized] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  const isEditing = !!id;

  // Fetch category details when editing
  useEffect(() => {
    const loadData = async () => {
      if (isEditing) {
        await dispatch(fetchCategoryById(id)).unwrap();
      } else {
        dispatch(clearCurrentCategory());
      }

      // Fetch all categories for parent dropdown
      try {
        const data = await dispatch(fetchAllCategories()).unwrap();
        // Filter out current category and its children to prevent circular references
        const filteredCategories = isEditing
          ? 
            data.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (cat: any) => cat.id !== id && !isCategoryChild(cat, id)
            )
          : data;

        setAllCategories(filteredCategories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    loadData();
  }, [dispatch, isEditing, id]);

  // Set form values when category data is loaded
  useEffect(() => {
    if (currentCategory && isEditing) {
      form.setFieldsValue({
        name: currentCategory.name,
        slug: currentCategory.slug,
        description: currentCategory.description,
        parentId: currentCategory.parent?.id,
        displayOrder: currentCategory.displayOrder || 0,
        active: currentCategory.active,
      });

      setSlugCustomized(true);

      if (currentCategory.imageUrl) {
        setFileList([
          {
            uid: "-1",
            name: "current-image.jpg",
            status: "done",
            url: currentCategory.imageUrl,
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [currentCategory, isEditing, form]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearCurrentCategory());
    };
  }, [dispatch]);

  // Check if a category is a child of another category (for parent dropdown filtering)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isCategoryChild = (category: any, parentId: string): boolean => {
    if (!category.children || category.children.length === 0) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return category.children.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (child: any) => child.id === parentId || isCategoryChild(child, parentId)
    );
  };

  // Handle form submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    try {
      // Prepare category data
      const categoryData: CategoryRequest = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        parentId: values.parentId,
        displayOrder: values.displayOrder,
        active: values.active,
      };

      // Handle file upload
      if (fileList.length > 0 && fileList[0].originFileObj) {
        categoryData.file = fileList[0].originFileObj;
      } else if (fileList.length > 0 && fileList[0].url) {
        categoryData.imageUrl = fileList[0].url;
      }

      if (isEditing) {
        await dispatch(updateCategory({ id, category: categoryData })).unwrap();
        message.success(t("admin:categories.update_success"));
      } else {
        await dispatch(createCategory(categoryData)).unwrap();
        message.success(t("admin:categories.create_success"));
      }

      setFormChanged(false);
      navigate("/admin/categories");
    } catch (err) {
      notification.error({
        message: isEditing
          ? t("admin:categories.update_error")
          : t("admin:categories.create_error"),
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  // Handle file upload change
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
    setFormChanged(true);
  };

  // Validate file before upload
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error(t("admin:validation.image_only"));
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t("admin:validation.image_size"));
    }

    return isImage && isLt2M;
  };

  // Handle image preview
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  // Convert file to base64 for preview
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getBase64 = (file: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle name change to auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!slugCustomized) {
      const name = e.target.value;
      const slug = AdminCategoryService.generateSlugFromName(name);
      form.setFieldsValue({ slug });
    }

    setFormChanged(true);
  };

  // Handle slug change
  const handleSlugChange = () => {
    setSlugCustomized(true);
    setFormChanged(true);
  };

  // Handle form cancel with confirm if changes made
  const handleCancel = () => {
    if (formChanged) {
      setConfirmLeave(true);
    } else {
      navigate("/admin/categories");
    }
  };

  // Handle category deletion
  const handleDelete = async () => {
    if (!isEditing) return;

    try {
      await dispatch(deleteCategory(id)).unwrap();
      message.success(t("admin:categories.delete_success"));
      navigate("/admin/categories");
    } catch (err) {
      notification.error({
        message: t("admin:categories.delete_error"),
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  // Handle form value changes
  const handleFormValueChange = () => {
    setFormChanged(true);
  };

  // Upload button component
  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>{t("admin:actions.upload")}</div>
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold dark:text-white">
          {isEditing ? t("admin:categories.edit") : t("admin:categories.add")}
        </h1>

        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel}
          className="flex items-center"
        >
          {t("admin:actions.back")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <motion.div variants={slideUp} className="lg:col-span-2">
          <Card className="shadow-sm dark:bg-gray-800">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onSubmitCapture={(e) => e.preventDefault()}
              initialValues={{ active: true, displayOrder: 0 }}
              onValuesChange={handleFormValueChange}
              className="space-y-4"
            >
              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item
                    name="name"
                    label={t("admin:categories.name")}
                    rules={[
                      {
                        required: true,
                        message: t("admin:validation.name_required"),
                      },
                    ]}
                    tooltip={t("admin:categories.name_tooltip")}
                  >
                    <Input
                      placeholder={t("admin:categories.name_placeholder")}
                      onChange={handleNameChange}
                      className="rounded-lg"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    name="slug"
                    label={
                      <div className="flex items-center">
                        {t("admin:categories.slug")}
                        <Tooltip title={t("admin:categories.slug_info")}>
                          <InfoCircleOutlined className="ml-1 text-gray-400" />
                        </Tooltip>
                      </div>
                    }
                    rules={[
                      {
                        required: true,
                        message: t("admin:validation.slug_required"),
                      },
                      {
                        pattern: /^[a-z0-9-]+$/,
                        message: t("admin:validation.slug_format"),
                      },
                    ]}
                  >
                    <Input
                      prefix={<GlobalOutlined className="text-gray-400" />}
                      placeholder={t("admin:categories.slug_placeholder")}
                      onChange={handleSlugChange}
                      className="rounded-lg"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
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
                      className="rounded-lg"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="displayOrder"
                    label={t("admin:categories.display_order")}
                    tooltip={t("admin:categories.display_order_tooltip")}
                  >
                    <InputNumber
                      className="w-full rounded-lg"
                      min={0}
                      placeholder="0"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    name="description"
                    label={t("admin:categories.description")}
                    tooltip={t("admin:categories.description_tooltip")}
                  >
                    <TextArea
                      rows={4}
                      placeholder={t(
                        "admin:categories.description_placeholder"
                      )}
                      className="rounded-lg"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Divider orientation="left">
                    {t("admin:categories.image")}
                  </Divider>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {t("admin:categories.image_hint")}
                  </p>

                  <Form.Item>
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleUploadChange}
                      beforeUpload={beforeUpload}
                      onRemove={() => setFileList([])}
                      maxCount={1}
                      className="category-image-upload"
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>

                    <Modal
                      open={previewVisible}
                      title={t("admin:categories.image_preview")}
                      footer={null}
                      onCancel={() => setPreviewVisible(false)}
                    >
                      <img
                        alt="preview"
                        style={{ width: "100%" }}
                        src={previewImage}
                      />
                    </Modal>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="active"
                    label={
                      <div className="flex items-center">
                        {t("admin:categories.status")}
                        <Tooltip title={t("admin:categories.status_tooltip")}>
                          <InfoCircleOutlined className="ml-1 text-gray-400" />
                        </Tooltip>
                      </div>
                    }
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren={<CheckCircleOutlined />}
                      unCheckedChildren={<CloseCircleOutlined />}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div className="flex justify-end pt-4 space-x-2">
                <Button onClick={handleCancel} disabled={submitting}>
                  {t("admin:actions.cancel")}
                </Button>
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  loading={submitting}
                  icon={<SaveOutlined />}
                >
                  {isEditing
                    ? t("admin:actions.update")
                    : t("admin:actions.save")}
                </Button>
              </div>
            </Form>
          </Card>

          {/* Confirm leave modal */}
          <Modal
            title={
              <div className="flex items-center">
                <QuestionCircleOutlined className="text-yellow-500 mr-2" />
                {t("admin:confirm_leave.title")}
              </div>
            }
            open={confirmLeave}
            onOk={() => navigate("/admin/categories")}
            onCancel={() => setConfirmLeave(false)}
            okText={t("admin:confirm_leave.ok")}
            cancelText={t("admin:confirm_leave.cancel")}
          >
            <p>{t("admin:confirm_leave.message")}</p>
          </Modal>
        </motion.div>

        {/* Right sidebar */}
        <motion.div variants={slideUp}>
          <div className="space-y-6">
            {/* Help card */}
            <Card className="shadow-sm dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                {t("admin:categories.help_title")}
              </h3>

              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                    {t("admin:categories.help_slug_title")}
                  </h4>
                  <p className="text-sm">
                    {t("admin:categories.help_slug_text")}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                    {t("admin:categories.help_parent_title")}
                  </h4>
                  <p className="text-sm">
                    {t("admin:categories.help_parent_text")}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                    {t("admin:categories.help_display_title")}
                  </h4>
                  <p className="text-sm">
                    {t("admin:categories.help_display_text")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Danger zone for edit mode */}
            {isEditing && (
              <Card
                className="shadow-sm dark:bg-gray-800 border-red-200 dark:border-red-800"
                title={
                  <span className="text-red-600 dark:text-red-400 font-semibold">
                    {t("admin:danger_zone")}
                  </span>
                }
              >
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {t("admin:danger_zone_description")}
                </p>

                <Popconfirm
                  title={t("admin:categories.delete_confirm")}
                  onConfirm={handleDelete}
                  okText={t("admin:actions.yes")}
                  cancelText={t("admin:actions.no")}
                  okButtonProps={{ danger: true }}
                  icon={<DeleteOutlined className="text-red-600" />}
                >
                  <Button danger icon={<DeleteOutlined />} block>
                    {t("admin:categories.delete_category")}
                  </Button>
                </Popconfirm>
              </Card>
            )}
          </div>
        </motion.div>
      </div>

      {/* Custom styling */}
      <style>{`
        .category-image-upload .ant-upload-list-item-info {
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .category-image-upload .ant-upload.ant-upload-select {
          border-radius: 0.5rem;
          border-style: dashed;
          transition: all 0.3s;
        }
        
        .category-image-upload .ant-upload.ant-upload-select:hover {
          border-color: #005c4e;
        }
      `}</style>
    </motion.div>
  );
};

export default CategoryForm;
