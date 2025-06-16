import React, { useState, useEffect } from 'react';
import { 
  Form, Input, InputNumber, Select, Switch, Button, Upload, Card, message, 
  notification, Tabs, Space, Table, Popconfirm, Modal, Typography,
  Row, Col, Tooltip, Progress, Tag, Empty, Alert
} from 'antd';
import { 
  ArrowLeftOutlined, SaveOutlined, DeleteOutlined, 
  EditOutlined, LoadingOutlined, CloudUploadOutlined, EyeOutlined,
  StarOutlined, StarFilled, PlusOutlined, DragOutlined, CompressOutlined
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
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { RcFile, UploadFile } from 'antd/es/upload';
import type { UploadFileStatus } from 'antd/es/upload/interface';

const { Option } = Select;
const { Title } = Typography;
const { Dragger } = Upload;

// Define available sizes for the UI (matches backend enum)
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Define custom type to extend UploadFile with additional properties
type CustomUploadFile = UploadFile & {
  imageId?: string;
  isPrimary?: boolean;
  uploading?: boolean;
  compressed?: boolean;
};

const ProductForm: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [variantForm] = Form.useForm();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [imageFileList, setImageFileList] = useState<CustomUploadFile[]>([]);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [batchUploadProgress, setBatchUploadProgress] = useState<number>(0);
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [variants, setVariants] = useState<ProductVariantResponse[]>([]);
  const [editingVariant, setEditingVariant] = useState<ProductVariantResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [dragOver, setDragOver] = useState<boolean>(false);
  
  const isEditing = !!id;
  const maxImages = 10;
  const maxFileSize = 5; // MB
  
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, regionsResponse] = await Promise.all([
          AdminCategoryService.getAllCategories(),
          AdminRegionService.getAllRegions()
        ]);
        
        setCategories(categoriesResponse);
        setRegions(regionsResponse);
        
        if (isEditing && id) {
          const productResponse = await AdminProductService.getProductById(id);
          setProduct(productResponse);
          setVariants(productResponse.variants || []);
          
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
          
          if (productResponse.images && productResponse.images.length > 0) {
            const fileList: CustomUploadFile[] = productResponse.images.map((image, index) => ({
              uid: image.id || `-${index}`,
              name: `image-${index}.jpg`,
              status: 'done' as UploadFileStatus,
              url: image.imageUrl,
              imageId: image.id,
              isPrimary: image.isPrimary,
              thumbUrl: image.imageUrl,
            }));
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
  
  // Image compression function
  const compressImage = async (file: RcFile): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const maxSize = 1920;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          0.8
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };
  
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error(t('admin:validation.image_only'));
      return false;
    }
    
    const isLt5M = file.size / 1024 / 1024 < maxFileSize;
    if (!isLt5M) {
      message.error(`${t('admin:validation.image_size')} ${maxFileSize}MB`);
      return false;
    }
    
    if (imageFileList.length >= maxImages) {
      message.error(`Maximum ${maxImages} images allowed`);
      return false;
    }
    
    return true;
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageUpload = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    
    try {
      setUploadLoading(true);
      onProgress({ percent: 20 });
      
      if (!isEditing || !id) {
        message.warning(t('admin:products.save_product_first'));
        onError(new Error('Product not saved'));
        return;
      }
      
      onProgress({ percent: 40 });
      
      // Compress image
      const compressedFile = await compressImage(file);
      onProgress({ percent: 60 });
      
      const uploadedImages = await AdminProductService.uploadProductImages(
        id,
        [compressedFile],
        file.name.replace(/\.[^/.]+$/, ''),
        imageFileList.length === 0
      );
      
      onProgress({ percent: 100 });
      onSuccess(uploadedImages[0], file);
      
      const newImage: CustomUploadFile = {
        uid: uploadedImages[0].id,
        name: file.name,
        status: 'done' as UploadFileStatus,
        url: uploadedImages[0].imageUrl,
        imageId: uploadedImages[0].id,
        isPrimary: uploadedImages[0].isPrimary,
        thumbUrl: uploadedImages[0].imageUrl,
        compressed: compressedFile.size < file.size,
      };
      
      setImageFileList(prev => [...prev, newImage]);
      message.success(t('admin:products.image_upload_success'));
      
    } catch (error) {
      console.error('Image upload error:', error);
      onError(error);
      message.error(t('admin:products.image_upload_error'));
    } finally {
      setUploadLoading(false);
    }
  };
  
  // Batch upload handler
  const handleBatchUpload = async (files: File[]) => {
    if (!isEditing || !id) {
      message.warning(t('admin:products.save_product_first'));
      return;
    }
    
    if (imageFileList.length + files.length > maxImages) {
      message.error(`Maximum ${maxImages} images allowed`);
      return;
    }
    
    setUploadLoading(true);
    setBatchUploadProgress(0);
    
    try {
      const processedFiles: File[] = [];
      
      // Compress all files
      for (let i = 0; i < files.length; i++) {
        setBatchUploadProgress((i / files.length) * 50);
        const compressedFile = await compressImage(files[i] as RcFile);
        processedFiles.push(compressedFile);
      }
      
      setBatchUploadProgress(50);
      
      // Upload all files
      const uploadedImages = await AdminProductService.uploadProductImages(
        id,
        processedFiles,
        'Product Image',
        imageFileList.length === 0
      );
      
      setBatchUploadProgress(100);
      
      // Add to file list
      const newImages: CustomUploadFile[] = uploadedImages.map((image, index) => ({
        uid: image.id,
        name: files[index].name,
        status: 'done' as UploadFileStatus,
        url: image.imageUrl,
        imageId: image.id,
        isPrimary: image.isPrimary,
        thumbUrl: image.imageUrl,
        compressed: processedFiles[index].size < files[index].size,
      }));
      
      setImageFileList(prev => [...prev, ...newImages]);
      message.success(`Successfully uploaded ${files.length} image(s)`);
      
      setTimeout(() => setBatchUploadProgress(0), 1000);
      
    } catch {
      message.error(t('admin:products.image_upload_error'));
    } finally {
      setUploadLoading(false);
    }
  };
  
  const getBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    
    setPreviewImage(file.url || (file.preview as string));
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    setPreviewVisible(true);
  };
  
  const handleDeleteImage = async (imageId: string) => {
    try {
      await AdminProductService.deleteProductImage(imageId);
      setImageFileList(prev => prev.filter(image => image.imageId !== imageId));
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
  
  const handleSetPrimaryImage = async (imageId: string) => {
    if (!isEditing || !id) return;
    
    try {
      await AdminProductService.setPrimaryImage(id, imageId);
      message.success(t('admin:products.primary_image_success'));
      
      const updatedProduct = await AdminProductService.getProductById(id);
      setProduct(updatedProduct);
      
      const updatedFileList = imageFileList.map(img => ({
        ...img,
        isPrimary: img.imageId === imageId
      }));
      setImageFileList(updatedFileList);
    } catch {
      message.error(t('admin:products.primary_image_error'));
    }
  };
  
  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) return false;
      if (file.size > maxFileSize * 1024 * 1024) return false;
      return true;
    });
    
    if (validFiles.length > 0) {
      handleBatchUpload(validFiles);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };
  
  // Reorder images
  const handleReorderImages = (newOrder: CustomUploadFile[]) => {
    setImageFileList(newOrder);
  };
  
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
        navigate(`/admin/products/edit/${savedProduct.id}`);
        return;
      }
      
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
        const updatedVariant = await AdminProductService.updateProductVariant(
          editingVariant.id,
          variantData
        );
        
        setVariants(variants.map(v => v.id === updatedVariant.id ? updatedVariant : v));
        message.success(t('admin:products.variant_update_success'));
      } else if (product) {
        const newVariant = await AdminProductService.addProductVariant(
          product.id,
          variantData
        );
        
        setVariants([...variants, newVariant]);
        message.success(t('admin:products.variant_add_success'));
      }
      
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
  
  const handleCancelEditVariant = () => {
    setEditingVariant(null);
    variantForm.resetFields();
  };
  
  const generateSlug = () => {
    const name = form.getFieldValue('name');
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      
      form.setFieldsValue({ slug });
    }
  };
  
  const variantColumns = [
    {
      title: t('admin:products.variant'),
      key: 'variant',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: ProductVariantResponse) => (
        <span>
          {record.size} {record.color ? `/ ${record.color}` : ""}
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
      className="flex flex-col items-center justify-center p-8"
    >
      {uploadLoading ? <LoadingOutlined /> : <CloudUploadOutlined className="text-4xl mb-4" />}
      <div className="text-lg font-medium mb-2">
        {dragOver ? 'Drop images here' : 'Upload Product Images'}
      </div>
      <div className="text-sm text-gray-500 mb-4">
        Drag & drop or click to select multiple images
      </div>
      <div className="flex gap-2 text-xs">
        <Tag>Max {maxImages} images</Tag>
        <Tag>Max {maxFileSize}MB each</Tag>
        <Tag color="green">Auto-compress</Tag>
      </div>
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
          items={[
            {
              key: 'basic',
              label: t('admin:products.basic_info'),
              children: (
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
                        <Input.TextArea rows={4} />
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
              ),
            },
            ...(isEditing ? [{
              key: 'images',
              label: (
                <Space>
                  <CloudUploadOutlined />
                  {t('admin:products.images')}
                  {imageFileList.length > 0 && (
                    <span className="ml-2 px-2 py-1 bg-primary text-white rounded-full text-xs">
                      {imageFileList.length}
                    </span>
                  )}
                </Space>
              ),
              children: (
                <div className="space-y-6">
                  {/* Upload Progress */}
                  {batchUploadProgress > 0 && (
                    <div className="mb-4">
                      <Progress
                        percent={batchUploadProgress}
                        status={batchUploadProgress === 100 ? 'success' : 'active'}
                        format={percent => `${percent}% Uploaded`}
                      />
                    </div>
                  )}

                  {/* Enhanced Upload Area */}
                  <div
                    className={`transition-all duration-300 ${
                      dragOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <Dragger
                      multiple
                      accept="image/*"
                      beforeUpload={beforeUpload}
                      customRequest={handleImageUpload}
                      showUploadList={false}
                      disabled={uploadLoading || imageFileList.length >= maxImages}
                      className="border-2 border-dashed hover:border-primary"
                    >
                      {uploadButton}
                    </Dragger>
                  </div>
                  
                  {/* Upload Stats */}
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>{imageFileList.length} / {maxImages} images uploaded</span>
                    <div className="flex gap-4">
                      <span>
                        {imageFileList.filter(img => img.isPrimary).length > 0 ? '✓' : '⚠'} Primary image set
                      </span>
                      <span>
                        {imageFileList.filter(img => img.compressed).length} compressed
                      </span>
                    </div>
                  </div>

                  {/* Image Gallery */}
                  {imageFileList.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Title level={4} className="mb-0">
                          {t('admin:products.manage_images')} ({imageFileList.length})
                        </Title>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          disabled={imageFileList.length >= maxImages}
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.multiple = true;
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const files = Array.from((e.target as HTMLInputElement).files || []);
                              handleBatchUpload(files);
                            };
                            input.click();
                          }}
                        >
                          Add More Images
                        </Button>
                      </div>

                      <Reorder.Group
                        values={imageFileList}
                        onReorder={handleReorderImages}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                      >
                        <AnimatePresence>
                          {imageFileList.map((image) => (
                            <Reorder.Item
                              key={image.uid}
                              value={image}
                              dragListener={!image.uploading}
                            >
                              <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className={`relative group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
                                  image.uploading ? 'opacity-70' : ''
                                } ${
                                  image.isPrimary ? 'ring-2 ring-primary ring-offset-2' : ''
                                }`}
                              >
                                {/* Image */}
                                <div className="aspect-square relative">
                                  <img
                                    src={image.url || image.thumbUrl}
                                    alt={image.name}
                                    className="w-full h-full object-cover"
                                  />
                                  
                                  {/* Upload Progress Overlay */}
                                  {image.uploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                      <div className="text-center text-white">
                                        <LoadingOutlined className="text-2xl mb-2" />
                                        <div className="text-sm">Uploading...</div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Primary Badge */}
                                  {image.isPrimary && (
                                    <div className="absolute top-2 left-2">
                                      <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                        <StarFilled className="mr-1" />
                                        Primary
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Compression Badge */}
                                  {image.compressed && (
                                    <div className="absolute top-2 right-2">
                                      <Tooltip title="Compressed for optimization">
                                        <div className="bg-green-500 text-white p-1 rounded-full">
                                          <CompressOutlined className="text-xs" />
                                        </div>
                                      </Tooltip>
                                    </div>
                                  )}
                                  
                                  {/* Actions Overlay */}
                                  {!image.uploading && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                      <div className="flex gap-2">
                                        <Tooltip title="Preview">
                                          <Button
                                            type="primary"
                                            shape="circle"
                                            size="small"
                                            icon={<EyeOutlined />}
                                            onClick={() => handlePreview(image)}
                                          />
                                        </Tooltip>
                                        
                                        <Tooltip title={image.isPrimary ? "Primary image" : "Set as primary"}>
                                          <Button
                                            type={image.isPrimary ? "primary" : "default"}
                                            shape="circle"
                                            size="small"
                                            icon={image.isPrimary ? <StarFilled /> : <StarOutlined />}
                                            onClick={() => !image.isPrimary && image.imageId && handleSetPrimaryImage(image.imageId)}
                                            disabled={image.isPrimary}
                                          />
                                        </Tooltip>
                                        
                                        <Tooltip title="Delete">
                                          <Button
                                            type="primary"
                                            danger
                                            shape="circle"
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={() => {
                                              Modal.confirm({
                                                title: 'Delete Image',
                                                content: 'Are you sure you want to delete this image?',
                                                onOk: () => image.imageId && handleDeleteImage(image.imageId),
                                              });
                                            }}
                                          />
                                        </Tooltip>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Drag Handle */}
                                  {!image.uploading && (
                                    <div className="absolute bottom-2 right-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="bg-white/80 dark:bg-black/80 p-1 rounded">
                                        <DragOutlined className="text-gray-600 dark:text-gray-400" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Image Info */}
                                <div className="p-3">
                                  <div className="flex justify-between items-center">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        {image.name}
                                      </p>
                                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span>{((image.size || 0) / 1024 / 1024).toFixed(1)} MB</span>
                                        {image.compressed && (
                                          <Tag color="green">Optimized</Tag>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </Reorder.Item>
                          ))}
                        </AnimatePresence>
                      </Reorder.Group>
                    </div>
                  ) : (
                    <Empty
                      description="No images uploaded yet"
                      className="py-12"
                    />
                  )}

                  {/* Upload Tips */}
                  <Alert
                    type="info"
                    showIcon
                    message="Image Upload Tips"
                    description={
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Use high-quality images (at least 800x800px) for best results</li>
                        <li>The first image will be set as primary automatically</li>
                        <li>Drag images to reorder them</li>
                        <li>Images will be automatically compressed to optimize loading speed</li>
                        <li>Supported formats: JPEG, PNG, WebP</li>
                      </ul>
                    }
                    className="border-blue-200 dark:border-blue-800"
                  />
                </div>
              ),
            }] : []),
            ...(isEditing ? [{
              key: 'variants',
              label: t('admin:products.variants'),
              children: (
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
              ),
            }] : []),
          ]}
          className="overflow-visible"
        />
      </Card>
      
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </motion.div>
  );
};

export default ProductForm;