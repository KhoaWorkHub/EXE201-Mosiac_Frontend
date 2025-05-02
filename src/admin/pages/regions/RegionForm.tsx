import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Switch,
  Button,
  Card,
  message,
  Upload,
  Skeleton,
  Typography,
  Breadcrumb,
  Tooltip,
  Divider,
  Alert,
  Modal,
  Popconfirm,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AdminRegionService } from "@/admin/services/adminRegionService";
import { RegionRequest } from "@/admin/types";
import { motion } from "framer-motion";
import slugify from "slugify";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const RegionForm = () => {
  const { t } = useTranslation(["admin", "common"]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [, setNameChanged] = useState<boolean>(false);
  const [isSlugCustomized, setIsSlugCustomized] = useState<boolean>(false);

  const isEditing = !!id;

  // Fetch region data if editing
  useEffect(() => {
    if (isEditing && id) {
      fetchRegionData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  // Fetch region data
  const fetchRegionData = async (regionId: string) => {
    setLoading(true);
    try {
      const region = await AdminRegionService.getRegionById(regionId);

      // Set form values
      form.setFieldsValue({
        name: region.name,
        slug: region.slug,
        description: region.description,
        active: region.active,
      });

      // Set image file list if exists
      if (region.imageUrl) {
        setFileList([
          {
            uid: "-1",
            name: "region-image.jpg",
            status: "done",
            url: region.imageUrl,
          },
        ]);
      }

      setIsSlugCustomized(true);
    } catch (error) {
      message.error(t("admin:regions.fetch_error"));
      console.error("Error fetching region:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle name change to auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameChanged(true);

    // If slug hasn't been customized, auto-generate it from the name
    if (!isSlugCustomized) {
      const name = e.target.value;
      const slug = slugify(name, {
        lower: true,
        strict: true,
        locale: "vi",
      });
      form.setFieldValue("slug", slug);
    }
  };

  // Handle slug change
  const handleSlugChange = () => {
    // If the user manually edits the slug, don't overwrite it when name changes
    setIsSlugCustomized(true);
  };

  // Handle image upload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  // Preview image
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  // Convert image to base64
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Submit form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const regionData: RegionRequest = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        active: values.active,
      };
  
      // Handle image upload if file exists
      if (fileList.length > 0 && fileList[0].originFileObj) {
        // Debug file info
        console.log("File object:", fileList[0].originFileObj);
        console.log("File type:", fileList[0].originFileObj.type);
        console.log("File size:", fileList[0].originFileObj.size);
        
        // Pass the actual file to the API service
        regionData.file = fileList[0].originFileObj;
      } else if (fileList.length > 0 && fileList[0].url) {
        // If we already have a URL (for existing images), pass it along
        regionData.imageUrl = fileList[0].url;
      }
  
      // Create or update region
      if (isEditing && id) {
        const response = await AdminRegionService.updateRegion(id, regionData);
        console.log("Update response:", response);
        message.success(t("admin:regions.update_success"));
      } else {
        const response = await AdminRegionService.createRegion(regionData);
        console.log("Create response:", response);
        message.success(t("admin:regions.create_success"));
      }
  
      // Navigate back to region list
      navigate("/admin/regions");
    } catch (error) {
      console.error("Error details:", error);
      message.error(
        isEditing
          ? t("admin:regions.update_error")
          : t("admin:regions.create_error")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Upload button for image upload
  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>{t("admin:actions.upload")}</div>
    </div>
  );

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
            <Breadcrumb.Item>
              {isEditing ? t("admin:regions.edit") : t("admin:regions.add")}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Title level={2} className="mb-0 dark:text-white">
            {isEditing ? t("admin:regions.edit") : t("admin:regions.add")}
          </Title>
          <Text className="text-gray-500 dark:text-gray-400">
            {isEditing
              ? t("admin:regions.edit_description")
              : t("admin:regions.add_description")}
          </Text>
        </div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/regions")}
          className="flex items-center"
        >
          {t("admin:actions.back")}
        </Button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <Card className="lg:col-span-2 shadow-sm dark:bg-gray-800">
          {loading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <motion.div initial="hidden" animate="visible" variants={slideUp}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  active: true,
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    name="name"
                    label={t("admin:regions.name")}
                    rules={[
                      {
                        required: true,
                        message: t("admin:validation.name_required"),
                      },
                    ]}
                    tooltip={{
                      title: t("admin:regions.name_tooltip"),
                      icon: <InfoCircleOutlined />,
                    }}
                    className="md:col-span-2"
                  >
                    <Input
                      className="rounded-md"
                      onChange={handleNameChange}
                      placeholder={t("admin:regions.name_placeholder")}
                    />
                  </Form.Item>

                  <Form.Item
                    name="slug"
                    label={
                      <div className="flex items-center">
                        {t("admin:regions.slug")}
                        <Tooltip title={t("admin:regions.slug_info")}>
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
                    className="md:col-span-2"
                  >
                    <div className="flex items-center">
                      <span className="bg-gray-100 dark:bg-gray-700 px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md text-gray-500 dark:text-gray-400">
                        <GlobalOutlined className="mr-1" />/
                      </span>
                      <Input
                        className="rounded-r-md"
                        onChange={handleSlugChange}
                        placeholder={t("admin:regions.slug_placeholder")}
                      />
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label={t("admin:regions.description")}
                    className="md:col-span-2"
                    tooltip={{
                      title: t("admin:regions.description_tooltip"),
                      icon: <InfoCircleOutlined />,
                    }}
                  >
                    <TextArea
                      rows={4}
                      className="rounded-md"
                      placeholder={t("admin:regions.description_placeholder")}
                    />
                  </Form.Item>

                  <div className="md:col-span-2">
                    <Divider orientation="left">
                      {t("admin:regions.image")}
                    </Divider>
                    <Paragraph className="text-gray-600 dark:text-gray-400 mb-4">
                      {t("admin:regions.image_hint")}
                    </Paragraph>

                    <Form.Item>
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={(file) => {
                          // Only validate file, don't upload automatically
                          const isImage = file.type.startsWith("image/");
                          const isLt2M = file.size / 1024 / 1024 < 2;

                          if (!isImage) {
                            message.error(t("admin:validation.image_only"));
                          }
                          if (!isLt2M) {
                            message.error(t("admin:validation.image_size"));
                          }

                          // Return false to prevent auto upload
                          return false;
                        }}
                        onPreview={handlePreview}
                        maxCount={1}
                      >
                        {fileList.length >= 1 ? null : uploadButton}
                      </Upload>
                      <Modal
                        open={previewVisible}
                        title={t("admin:regions.image_preview")}
                        footer={null}
                        onCancel={() => setPreviewVisible(false)}
                      >
                        {previewImage && (
                          <img
                            alt="Preview"
                            style={{ width: "100%" }}
                            src={previewImage}
                          />
                        )}
                      </Modal>
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="active"
                    label={t("admin:regions.status")}
                    valuePropName="checked"
                    className="flex-1"
                    tooltip={{
                      title: t("admin:regions.status_tooltip"),
                      icon: <InfoCircleOutlined />,
                    }}
                  >
                    <Switch
                      checkedChildren={<CheckCircleOutlined />}
                      unCheckedChildren={<WarningOutlined />}
                    />
                  </Form.Item>
                </div>

                <Divider />

                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => navigate("/admin/regions")}
                    disabled={submitting}
                    icon={<ArrowLeftOutlined />}
                  >
                    {t("admin:actions.cancel")}
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    icon={<SaveOutlined />}
                  >
                    {isEditing
                      ? t("admin:actions.update")
                      : t("admin:actions.save")}
                  </Button>
                </div>
              </Form>
            </motion.div>
          )}
        </Card>

        {/* Side info */}
        <div className="space-y-6">
          <Card className="shadow-sm dark:bg-gray-800">
            <Title level={5} className="mb-4 dark:text-white">
              {t("admin:regions.side_info_title")}
            </Title>

            <div className="space-y-4">
              <Alert
                type="info"
                message={t("admin:regions.side_info_1_title")}
                description={t("admin:regions.side_info_1_desc")}
                showIcon
                className="mb-4"
              />

              <Alert
                type="warning"
                message={t("admin:regions.side_info_2_title")}
                description={t("admin:regions.side_info_2_desc")}
                showIcon
                className="mb-4"
              />

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Title level={5} className="text-gray-800 dark:text-white mb-2">
                  {t("admin:regions.tips_title")}
                </Title>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                  <li>{t("admin:regions.tips_1")}</li>
                  <li>{t("admin:regions.tips_2")}</li>
                  <li>{t("admin:regions.tips_3")}</li>
                </ul>
              </div>
            </div>
          </Card>

          {isEditing && (
            <Card className="shadow-sm dark:bg-gray-800">
              <Title level={5} className="mb-4 text-red-600 dark:text-red-400">
                {t("admin:regions.danger_zone")}
              </Title>
              <Paragraph className="text-gray-600 dark:text-gray-400 mb-4">
                {t("admin:regions.danger_description")}
              </Paragraph>
              <Popconfirm
                title={t("admin:regions.delete_confirm")}
                onConfirm={async () => {
                  try {
                    if (id) {
                      await AdminRegionService.deleteRegion(id);
                      message.success(t("admin:regions.delete_success"));
                      navigate("/admin/regions");
                    }
                  } catch (error) {
                    message.error(t("admin:regions.delete_error"));
                  }
                }}
                okText={t("admin:actions.yes")}
                cancelText={t("admin:actions.no")}
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />} block>
                  {t("admin:regions.delete_region")}
                </Button>
              </Popconfirm>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RegionForm;
