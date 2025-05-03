// src/admin/pages/products/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { 
  Form, Input, InputNumber, Select, Switch, Button, Upload, Card, message, 
  notification, Tabs, Space, Table, Popconfirm, Modal, Typography,
  Row, Col, Tooltip, 
} from 'antd';
import { 
  ArrowLeftOutlined, SaveOutlined, DeleteOutlined, 
  EditOutlined, LoadingOutlined, CloudUploadOutlined, EyeOutlined,
  StarOutlined, StarFilled
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminProductService } from '@/admin/services/adminProductService';
import { AdminCategoryService } from '@/admin/services/adminCategoryService';
import { AdminRegionService } from '@/admin/services/adminRegionService';
import { 
  ProductRequest, 
  ProductResponse, 
  CategoryResponse, 
  RegionResponse,
  ProductVariantRequest,
  ProductVariantResponse,
} from '@/admin/types';
import { motion, AnimatePresence } from 'framer-motion';
import { RcFile, UploadFile } from 'antd/es/upload';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { UploadFileStatus } from 'antd/es/upload/interface';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title } = Typography;

// Available sizes for variants
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ProductForm: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [variantForm] = Form.useForm();
  
  // States
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadLoading, _setUploadLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [variants, setVariants] = useState<ProductVariantResponse[]>([]);
  const [editingVariant, setEditingVariant] = useState<ProductVariantResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  
  const isEditing = !!id;
  
  // Initial data loading
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch categories and regions
        const [categoriesResponse, regionsResponse] = await Promise.all([
          AdminCategoryService.getAllCategories(),
          AdminRegionService.getAllRegions()
        ]);
        
        setCategories(categoriesResponse);
        setRegions(regionsResponse);
        
        // If editing, fetch product details
        if (isEditing && id) {
          const productResponse = await AdminProductService.getProductById(id);
          setProduct(productResponse);
          setVariants(productResponse.variants || []);
          
          // Set form values
          form.setFieldsValue({
            name: productResponse.name,
            slug: productResponse.slug,
            description: productResponse.description,
            shortDescription: productResponse.shortDescription,
            price: productResponse.price,
            originalPrice: productResponse.originalPrice,
            stockQuantity: productResponse.stockQuantity,
            sku: productResponse.sku,
            categoryId: productResponse.category?.id,
            regionId: productResponse.region?.id,
            active: productResponse.active,
            featured: productResponse.featured,
          });
          
          // Set image file list
          if (productResponse.images && productResponse.images.length > 0) {
            const fileList = productResponse.images.map((image, index) => ({
              uid: image.id || `-${index}`,
              name: `image-${index}.jpg`,
              status: 'done' as UploadFileStatus,
              url: image.imageUrl,
              imageId: image.id,
              isPrimary: image.isPrimary,
            })) as UploadFile[];
            setImageFileList(fileList);
          }
        }
      } catch (error) {
        notification.error({
          message: t('admin:products.fetch_error'),
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [id, form, isEditing, t]);
  
  // Validate image before upload
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error(t('admin:validation.image_only'));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t('admin:validation.image_size'));
    }
    return false; // Prevent automatic upload
  };
  
  // Enhanced image upload handler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageUpload = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    
    try {
      // Simulate progress
      onProgress({ percent: 30 });
      
      if (!isEditing || !id) {
        message.warning(t('admin:products.save_product_first'));
        onError(new Error('Product not saved'));
        return;
      }
      
      onProgress({ percent: 60 });
      
      const uploadedImages = await AdminProductService.uploadProductImages(
        id,
        [file],
        'Product Image',
        imageFileList.length === 0 // First image is primary
      );
      
      onProgress({ percent: 100 });
      onSuccess(uploadedImages[0], file);
      
      // Refresh product to get updated images
      const updatedProduct = await AdminProductService.getProductById(id);
      setProduct(updatedProduct);
      
      message.success(t('admin:products.image_upload_success'));
    } catch (error) {
      onError(error);
      message.error(t('admin:products.image_upload_error'));
    }
  };
  
  // Convert file to base64 for preview
  const getBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  // Image preview handler
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    
    setPreviewImage(file.url || (file.preview as string));
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    setPreviewVisible(true);
  };
  
  // Handle image removal
  const handleDeleteImage = async (imageId: string) => {
    try {
      await AdminProductService.deleteProductImage(imageId);
      message.success(t('admin:products.image_delete_success'));
      if (id) {
        const updatedProduct = await AdminProductService.getProductById(id);
        setProduct(updatedProduct);
      }
    } catch (error) {
      notification.error({
        message: t('admin:products.image_delete_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  // Set primary image
  const handleSetPrimaryImage = async (imageId: string) => {
    if (!isEditing || !id) return;
    
    try {
      await AdminProductService.setPrimaryImage(id, imageId);
      message.success(t('admin:products.primary_image_success'));
      
      // Refresh product data
      const updatedProduct = await AdminProductService.getProductById(id);
      setProduct(updatedProduct);
    } catch (error) {
      message.error(t('admin:products.primary_image_error'));
    }
  };
  
  // Submit form handler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);
      
      const productData: ProductRequest = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        shortDescription: values.shortDescription,
        price: values.price,
        originalPrice: values.originalPrice,
        stockQuantity: values.stockQuantity,
        sku: values.sku,
        categoryId: values.categoryId,
        regionId: values.regionId,
        active: values.active,
        featured: values.featured,
      };
      
      let savedProduct: ProductResponse;
      
      if (isEditing && id) {
        savedProduct = await AdminProductService.updateProduct(id, productData);
        message.success(t('admin:products.update_success'));
      } else {
        savedProduct = await AdminProductService.createProduct(productData);
        message.success(t('admin:products.create_success'));
        // Navigate to edit mode with the new ID
        navigate(`/admin/products/edit/${savedProduct.id}`);
        return; // Return early to prevent further processing in create mode
      }
      
      // Update product state
      setProduct(savedProduct);
      
    } catch (error) {
      notification.error({
        message: isEditing 
          ? t('admin:products.update_error') 
          : t('admin:products.create_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Submit variant form handler
  const handleAddVariant = async () => {
    try {
      const values = await variantForm.validateFields();
      const variantData: ProductVariantRequest = {
        size: values.size,
        color: values.color,
        priceAdjustment: values.priceAdjustment,
        stockQuantity: values.stockQuantity,
        skuVariant: values.skuVariant,
        active: values.active,
      };
      
      if (editingVariant) {
        // Update existing variant
        const updatedVariant = await AdminProductService.updateProductVariant(
          editingVariant.id,
          variantData
        );
        
        setVariants(variants.map(v => v.id === updatedVariant.id ? updatedVariant : v));
        message.success(t('admin:products.variant_update_success'));
      } else if (product) {
        // Add new variant
        const newVariant = await AdminProductService.addProductVariant(
          product.id,
          variantData
        );
        
        setVariants([...variants, newVariant]);
        message.success(t('admin:products.variant_add_success'));
      }
      
      // Reset form and editing state
      variantForm.resetFields();
      setEditingVariant(null);
      
    } catch (error) {
      notification.error({
        message: editingVariant 
          ? t('admin:products.variant_update_error') 
          : t('admin:products.variant_add_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  // Edit variant handler
  const handleEditVariant = (variant: ProductVariantResponse) => {
    setEditingVariant(variant);
    variantForm.setFieldsValue({
      size: variant.size,
      color: variant.color,
      priceAdjustment: variant.priceAdjustment,
      stockQuantity: variant.stockQuantity,
      skuVariant: variant.skuVariant,
      active: variant.active,
    });
  };
  
  // Delete variant handler
  const handleDeleteVariant = async (variantId: string) => {
    try {
      await AdminProductService.deleteProductVariant(variantId);
      setVariants(variants.filter(v => v.id !== variantId));
      message.success(t('admin:products.variant_delete_success'));
    } catch (error) {
      notification.error({
        message: t('admin:products.variant_delete_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  // Cancel variant editing
  const handleCancelEditVariant = () => {
    setEditingVariant(null);
    variantForm.resetFields();
  };
  
  // Generate slug from name
  const generateSlug = () => {
    const name = form.getFieldValue('name');
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/-+/g, '-'); // Replace multiple dashes with single dash
      
      form.setFieldsValue({ slug });
    }
  };
  
  // Define variant columns for the table
  const variantColumns = [
    {
      title: t('admin:products.variant'),
      key: 'variant',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: ProductVariantResponse) => (
        <span>
          {record.size} / {record.color}
        </span>
      ),
    },
    {
      title: t('admin:products.price_adjustment'),
      dataIndex: 'priceAdjustment',
      key: 'priceAdjustment',
      render: (value: number) => (
        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
          {value >= 0 ? `+${value}` : value}
        </span>
      ),
    },
    {
      title: t('admin:products.stock'),
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
    },
    {
      title: 'SKU',
      dataIndex: 'skuVariant',
      key: 'skuVariant',
    },
    {
      title: t('admin:products.status'),
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Switch checked={active} disabled />
      ),
    },
    {
      title: t('admin:products.actions'),
      key: 'action',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: ProductVariantResponse) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditVariant(record)}
          >
            {t('admin:actions.edit')}
          </Button>
          <Popconfirm
            title={t('admin:products.variant_delete_confirm')}
            onConfirm={() => handleDeleteVariant(record.id)}
            okText={t('admin:actions.yes')}
            cancelText={t('admin:actions.no')}
          >
            <Button 
              danger 
              size="small"
              icon={<DeleteOutlined />}
            >
              {t('admin:actions.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  const uploadButton = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-4"
    >
      {uploadLoading ? <LoadingOutlined /> : <CloudUploadOutlined className="text-3xl" />}
      <div className="mt-2 text-sm">{t('admin:actions.upload')}</div>
    </motion.div>
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingOutlined style={{ fontSize: 48 }} spin />
      </div>
    );
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Title level={2} className="mb-0 dark:text-white">
          {isEditing ? t('admin:products.edit') : t('admin:products.add')}
        </Title>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/products')}
        >
          {t('admin:actions.back')}
        </Button>
      </div>
      
      <Card className="shadow-sm dark:bg-gray-800">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          defaultActiveKey="basic" 
          className="overflow-visible"
        >
          {/* Basic Info Tab */}
          <TabPane tab={t('admin:products.basic_info')} key="basic">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                active: true,
                featured: false,
                stockQuantity: 0,
                price: 0,
              }}
              className="mt-4"
            >
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="name"
                    label={t('admin:products.name')}
                    rules={[
                      { required: true, message: t('admin:validation.name_required') }
                    ]}
                  >
                    <Input 
                      onBlur={() => {
                        if (!isEditing) generateSlug();
                      }}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} lg={12}>
                  <Form.Item
                    name="slug"
                    label={t('admin:products.slug')}
                    rules={[
                      { required: true, message: t('admin:validation.slug_required') }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                
                <Col xs={24} lg={8}>
                  <Form.Item
                    name="categoryId"
                    label={t('admin:products.category')}
                    rules={[
                      { required: true, message: t('admin:validation.category_required') }
                    ]}
                  >
                    <Select placeholder={t('admin:products.select_category')}>
                      {categories.map(category => (
                        <Option key={category.id} value={category.id}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} lg={8}>
                  <Form.Item
                    name="regionId"
                    label={t('admin:products.region')}
                    rules={[
                      { required: true, message: t('admin:validation.region_required') }
                    ]}
                  >
                    <Select placeholder={t('admin:products.select_region')}>
                      {regions.map(region => (
                        <Option key={region.id} value={region.id}>
                          {region.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} lg={8}>
                  <Form.Item
                    name="sku"
                    label="SKU"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8}>
                  <Form.Item
                    name="price"
                    label={t('admin:products.price')}
                    rules={[
                      { required: true, message: t('admin:validation.price_required') },
                      { type: 'number', min: 0, message: t('admin:validation.price_positive') }
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8}>
                  <Form.Item
                    name="originalPrice"
                    label={t('admin:products.original_price')}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8}>
                  <Form.Item
                    name="stockQuantity"
                    label={t('admin:products.stock')}
                    rules={[
                      { type: 'number', min: 0, message: t('admin:validation.quantity_positive') }
                    ]}
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col xs={24}>
                  <Form.Item
                    name="shortDescription"
                    label={t('admin:products.short_description')}
                  >
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </Col>
                
                <Col xs={24}>
                  <Form.Item
                    name="description"
                    label={t('admin:products.description')}
                  >
                    <ReactQuill
                      theme="snow"
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          [{ 'color': [] }, { 'background': [] }],
                          ['link', 'image'],
                          ['clean']
                        ],
                      }}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={12} md={6}>
                  <Form.Item
                    name="active"
                    label={t('admin:products.status')}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                
                <Col xs={12} md={6}>
                  <Form.Item
                    name="featured"
                    label={t('admin:products.featured')}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
              
              <div className="flex justify-end mt-6 space-x-2">
                <Button
                  onClick={() => navigate('/admin/products')}
                  disabled={submitting}
                >
                  {t('admin:actions.cancel')}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  icon={<SaveOutlined />}
                >
                  {t('admin:actions.save')}
                </Button>
              </div>
            </Form>
          </TabPane>
          
          {/* Images Tab - Enhanced */}
          {isEditing && (
            <TabPane 
              tab={
                <Space>
                  <CloudUploadOutlined />
                  {t('admin:products.images')}
                  {product?.images?.length ? (
                    <span className="ml-2 px-2 py-1 bg-primary text-white rounded-full text-xs">
                      {product.images.length}
                    </span>
                  ) : null}
                </Space>
              } 
              key="images"
            >
              <div className="space-y-6">
                <Typography.Paragraph className="text-gray-600 dark:text-gray-300">
                  {t('admin:products.image_hint')}
                </Typography.Paragraph>
                
                <Upload
                  listType="picture-card"
                  fileList={imageFileList}
                  onPreview={handlePreview}
                  beforeUpload={beforeUpload}
                  customRequest={handleImageUpload}
                  multiple
                  className="upload-list-inline"
                >
                  {imageFileList.length >= 8 ? null : uploadButton}
                </Upload>
                
                {product?.images && product.images.length > 0 && (
                  <div className="mt-8">
                    <Title level={4} className="mb-4">
                      {t('admin:products.manage_images')}
                    </Title>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      <AnimatePresence>
                        {product.images.map((image) => (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative group"
                          >
                            <Card
                              hoverable
                              cover={
                                <div className="h-48 overflow-hidden">
                                  <img
                                    alt={image.altText || product.name}
                                    src={image.imageUrl}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  />
                                </div>
                              }
                              className={`${image.isPrimary ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                            >
                              <div className="absolute top-2 right-2 flex gap-2">
                                {image.isPrimary && (
                                  <Tooltip title={t('admin:products.primary_image')}>
                                    <StarFilled className="text-yellow-400 text-xl" />
                                  </Tooltip>
                                )}
                              </div>
                              
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                                <Tooltip title={t('admin:actions.view')}>
                                  <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<EyeOutlined />}
                                    onClick={() => {
                                      setPreviewImage(image.imageUrl);
                                      setPreviewVisible(true);
                                    }}
                                  />
                                </Tooltip>
                                
                                {!image.isPrimary && (
                                  <Tooltip title={t('admin:products.set_as_primary')}>
                                    <Button
                                      type="primary"
                                      shape="circle"
                                      icon={<StarOutlined />}
                                      onClick={() => handleSetPrimaryImage(image.id)}
                                    />
                                  </Tooltip>
                                )}
                                
                                <Popconfirm
                                  title={t('admin:products.image_delete_confirm')}
                                  onConfirm={() => handleDeleteImage(image.id)}
                                  okText={t('admin:actions.yes')}
                                  cancelText={t('admin:actions.no')}
                                >
                                  <Tooltip title={t('admin:actions.delete')}>
                                    <Button
                                      danger
                                      shape="circle"
                                      icon={<DeleteOutlined />}
                                    />
                                  </Tooltip>
                                </Popconfirm>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            </TabPane>
          )}
          
          {/* Variants Tab */}
          {isEditing && (
            <TabPane tab={t('admin:products.variants')} key="variants">
              <div className="mt-4">
                <Row gutter={16}>
                  <Col xs={24} lg={12}>
                    <Card title={t('admin:products.add_variant')} className="mb-6">
                      <Form
                        form={variantForm}
                        layout="vertical"
                      >
                        <Form.Item
                          name="size"
                          label={t('common:size')}
                          rules={[
                            { required: true, message: t('admin:validation.size_required') }
                          ]}
                        >
                          <Select placeholder={t('admin:products.select_size')}>
                            {SIZES.map(size => (
                              <Option key={size} value={size}>{size}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                        
                        <Form.Item
                          name="color"
                          label={t('common:color')}
                        >
                          <Input />
                        </Form.Item>
                        
                        <Form.Item
                          name="priceAdjustment"
                          label={t('admin:products.price_adjustment')}
                          initialValue={0}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                          />
                        </Form.Item>
                        
                        <Form.Item
                          name="stockQuantity"
                          label={t('admin:products.stock')}
                          initialValue={0}
                          rules={[
                            { type: 'number', min: 0, message: t('admin:validation.quantity_positive') }
                          ]}
                        >
                          <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                        
                        <Form.Item
                          name="skuVariant"
                          label="SKU"
                        >
                          <Input />
                        </Form.Item>
                        
                        <Form.Item
                          name="active"
                          label={t('admin:products.status')}
                          valuePropName="checked"
                          initialValue={true}
                        >
                          <Switch />
                        </Form.Item>
                        
                        <div className="flex justify-end space-x-2">
                          {editingVariant && (
                            <Button onClick={handleCancelEditVariant}>
                              {t('admin:actions.cancel')}
                            </Button>
                          )}
                          <Button
                            type="primary"
                            onClick={handleAddVariant}
                          >
                            {editingVariant 
                              ? t('admin:actions.update') 
                              : t('admin:actions.add')
                            }
                          </Button>
                        </div>
                      </Form>
                    </Card>
                  </Col>
                  
                  <Col xs={24} lg={12}>
                    <Card title={t('admin:products.variant_list')} className="mb-6">
                      {variants.length > 0 ? (
                        <Table
                          dataSource={variants}
                          columns={variantColumns}
                          rowKey="id"
                          pagination={false}
                          size="small"
                        />
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          {t('admin:products.no_variants')}
                        </div>
                      )}
                    </Card>
                  </Col>
                </Row>
              </div>
            </TabPane>
          )}
        </Tabs>
      </Card>
      
      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      
      {/* Add custom styles */}
      <style>{`
        .upload-list-inline .ant-upload-list-item {
          float: left;
          width: 200px;
          margin-right: 8px;
        }
        
        .upload-list-inline .ant-upload-animate-enter {
          animation-name: uploadAnimateInlineIn;
        }
        
        .upload-list-inline .ant-upload-animate-leave {
          animation-name: uploadAnimateInlineOut;
        }
      `}</style>
    </motion.div>
  );
};

export default ProductForm;