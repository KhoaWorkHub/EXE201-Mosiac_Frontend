import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Button, Tag, Descriptions, Skeleton, Tooltip, 
  Breadcrumb, Tabs, Statistic, Badge, Alert, Modal, List, Image,
  Table, notification, Popconfirm, Carousel, Empty, Row, Col, message,
} from 'antd';
import { 
  EditOutlined, DeleteOutlined, ArrowLeftOutlined, EyeOutlined, 
  LinkOutlined, ClockCircleOutlined, InfoCircleOutlined, PictureOutlined,
  CheckCircleOutlined, CloseCircleOutlined, StarOutlined, StarFilled,
  ShoppingOutlined, TagsOutlined, EnvironmentOutlined, DollarOutlined,
  BarChartOutlined, AppstoreOutlined, SyncOutlined, QrcodeOutlined,
  PlusOutlined, ShareAltOutlined
} from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminProductService } from '@/admin/services/adminProductService';
import { ProductResponse, ProductVariantResponse, ProductImageResponse } from '@/admin/types';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/formatters';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.4 } 
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5 } 
  }
};

const ProductDetail: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('info');
  const [imagePreviewVisible, setImagePreviewVisible] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  
  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);
  
  const fetchProduct = async (productId: string) => {
    setLoading(true);
    try {
      const data = await AdminProductService.getProductById(productId);
      setProduct(data);
    } catch (error) {
      notification.error({
        message: t('admin:products.fetch_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = () => {
    if (id) {
      navigate(`/admin/products/edit/${id}`);
    }
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await AdminProductService.deleteProduct(id);
      notification.success({
        message: t('admin:products.delete_success'),
      });
      setDeleteConfirmVisible(false);
      navigate('/admin/products');
    } catch (error) {
      notification.error({
        message: t('admin:products.delete_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  const handleToggleFeatured = async () => {
    if (!product || !id) return;
    
    try {
      const updatedProduct = await AdminProductService.setProductFeatured(
        id, !product.featured
      );
      setProduct(updatedProduct);
      notification.success({
        message: product.featured 
          ? t('admin:products.unfeature_success') 
          : t('admin:products.feature_success'),
      });
    } catch (error) {
      notification.error({
        message: t('admin:products.feature_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  const handleToggleStatus = async () => {
    if (!product || !id) return;
    
    try {
      const updatedProduct = await AdminProductService.updateProductStatus(
        id, !product.active
      );
      setProduct(updatedProduct);
      notification.success({
        message: product.active 
          ? t('admin:products.deactivate_success') 
          : t('admin:products.activate_success'),
      });
    } catch (error) {
      notification.error({
        message: t('admin:products.status_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  const handleSetPrimaryImage = async (imageId: string) => {
    if (!product || !id) return;
    
    try {
      await AdminProductService.setPrimaryImage(id, imageId);
      fetchProduct(id); // Refresh product data
      notification.success({
        message: t('admin:products.primary_image_success'),
      });
    } catch (error) {
      notification.error({
        message: t('admin:products.primary_image_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  const handleDeleteVariant = async (variantId: string) => {
    try {
      await AdminProductService.deleteProductVariant(variantId);
      notification.success({
        message: t('admin:products.variant_delete_success'),
      });
      if (id) {
        fetchProduct(id);
      }
    } catch (error) {
      notification.error({
        message: t('admin:products.variant_delete_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  const handleDeleteImage = async (imageId: string) => {
    try {
      await AdminProductService.deleteProductImage(imageId);
      notification.success({
        message: t('admin:products.image_delete_success'),
      });
      if (id) {
        fetchProduct(id);
      }
    } catch (error) {
      notification.error({
        message: t('admin:products.image_delete_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  const showImagePreview = (url: string) => {
    setCurrentImage(url);
    setImagePreviewVisible(true);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('LL LT');
  };
  
  // Variant columns for table
  const variantColumns = [
    {
      title: t('admin:products.variant'),
      key: 'variant',
      render: (_: unknown, record: ProductVariantResponse) => (
        <span>
          {record.size} {record.color ? `/ ${record.color}` : ''}
        </span>
      ),
    },
    {
      title: t('admin:products.price_adjustment'),
      dataIndex: 'priceAdjustment',
      key: 'priceAdjustment',
      render: (value: number) => (
        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
          {value >= 0 ? `+${formatCurrency(value)}` : formatCurrency(value)}
        </span>
      ),
    },
    {
      title: t('admin:products.stock'),
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      render: (value: number) => (
        <Tag color={value > 10 ? 'success' : value > 0 ? 'warning' : 'error'}>
          {value ?? 0}
        </Tag>
      ),
    },
    {
      title: t('admin:products.sku'),
      dataIndex: 'skuVariant',
      key: 'skuVariant',
    },
    {
      title: t('admin:products.status'),
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'error'}>
          {active ? t('admin:products.active') : t('admin:products.inactive')}
        </Tag>
      ),
    },
    {
      title: t('admin:products.actions'),
      key: 'action',
      render: (_: unknown, record: ProductVariantResponse) => (
        <Popconfirm
          title={t('admin:products.variant_delete_confirm')}
          onConfirm={() => handleDeleteVariant(record.id)}
          okText={t('admin:actions.yes')}
          cancelText={t('admin:actions.no')}
        >
          <Button 
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
          />
        </Popconfirm>
      ),
    },
  ];
  
  // Enhanced image gallery
  const renderImageGallery = () => {
    if (!product?.images || product.images.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Empty 
            description={t('admin:products.no_images')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleEdit}
            >
              {t('admin:products.add_images')}
            </Button>
          </Empty>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Carousel 
          autoplay
          dots
          className="rounded-lg overflow-hidden shadow-lg"
        >
          {product.images.map((image) => (
            <div key={image.id} className="h-96 relative">
              <Image
                src={image.imageUrl}
                alt={image.altText || product.name}
                className="w-full h-full object-cover"
                preview={{
                  mask: <div className="flex items-center gap-2">
                    <EyeOutlined /> {t('admin:actions.view')}
                  </div>
                }}
              />
              {image.isPrimary && (
                <Badge
                  className="absolute top-4 right-4"
                  count={t('admin:products.primary_image')}
                  style={{ backgroundColor: '#52c41a' }}
                />
              )}
            </div>
          ))}
        </Carousel>
        
        {/* Thumbnail gallery */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {product.images.map((image) => (
            <div 
              key={image.id}
              className={`relative cursor-pointer rounded-md overflow-hidden ${
                image.isPrimary ? 'ring-2 ring-primary' : ''
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={image.altText || product.name}
                className="w-full h-20 object-cover"
                preview={{
                  src: image.imageUrl,
                  mask: <EyeOutlined className="text-white" />
                }}
              />
              {image.isPrimary && (
                <div className="absolute top-1 right-1">
                  <StarFilled className="text-yellow-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton active paragraph={{ rows: 1 }} />
        <Card>
          <Skeleton active avatar paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }
  
  if (!product) {
    return (
      <Card className="text-center py-12">
        <Alert
          type="error"
          message={t('admin:products.not_found')}
          description={t('admin:products.not_found_description')}
          className="mb-4 max-w-md mx-auto"
        />
        <Button
          type="primary"
          onClick={() => navigate('/admin/products')}
        >
          {t('admin:actions.back_to_list')}
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
            <Breadcrumb.Item>
              <Link to="/admin">{t('admin:dashboard.title')}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/admin/products">{t('admin:products.title')}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
          </Breadcrumb>
          
          <div className="flex items-center gap-2">
            <Title level={2} className="mb-0 dark:text-white">
              {product.name}
            </Title>
            <Tag color={product.active ? 'success' : 'error'} className="ml-2">
              {product.active 
                ? t('admin:products.active') 
                : t('admin:products.inactive')}
            </Tag>
            {product.featured && (
              <Tag icon={<StarFilled />} color="warning">
                {t('admin:products.featured')}
              </Tag>
            )}
          </div>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
            <LinkOutlined className="mr-1" />
            <Text
              copyable={{ text: product.slug }}
              className="text-gray-500 dark:text-gray-400"
            >
              /{product.slug}
            </Text>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/products')}
          >
            {t('admin:actions.back')}
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={handleEdit}
          >
            {t('admin:actions.edit')}
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => setDeleteConfirmVisible(true)}
          >
            {t('admin:actions.delete')}
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <motion.div 
          className="lg:col-span-2" 
          variants={slideUp}
        >
          <Card className="shadow-sm dark:bg-gray-800">
            <Tabs 
              activeKey={activeTab} 
              onChange={(key) => setActiveTab(key)}
              className="overflow-visible"
            >
              <TabPane
                tab={
                  <span className="flex items-center">
                    <InfoCircleOutlined className="mr-1" />
                    {t('admin:products.information')}
                  </span>
                }
                key="info"
              >
                {/* Enhanced image gallery section */}
                <div className="mb-8">
                  <Title level={4} className="mb-4">
                    {t('admin:products.images')}
                  </Title>
                  {renderImageGallery()}
                </div>
                
                {/* Product Basic Info */}
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card className="shadow-sm">
                      <Title level={4} className="dark:text-white mb-4">
                        {t('admin:products.basic_info')}
                      </Title>
                      
                      <Descriptions 
                        bordered 
                        column={1} 
                        className="product-details-table"
                        size="small"
                      >
                        <Descriptions.Item label={t('admin:products.id')}>
                          <Text copyable>{product.id}</Text>
                        </Descriptions.Item>
                        
                        <Descriptions.Item label={t('admin:products.sku')}>
                          {product.sku || '-'}
                        </Descriptions.Item>
                        
                        <Descriptions.Item label={t('admin:products.category')}>
                          {product.category ? (
                            <Tag color="blue" icon={<TagsOutlined />}>
                              {product.category.name}
                            </Tag>
                          ) : '-'}
                        </Descriptions.Item>
                        
                        <Descriptions.Item label={t('admin:products.region')}>
                          {product.region ? (
                            <Tag color="green" icon={<EnvironmentOutlined />}>
                              {product.region.name}
                            </Tag>
                          ) : '-'}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Card className="shadow-sm">
                      <Title level={4} className="dark:text-white mb-4">
                        {t('admin:products.pricing_stock')}
                      </Title>
                      
                      <Descriptions 
                        bordered 
                        column={1} 
                        className="product-details-table"
                        size="small"
                      >
                        <Descriptions.Item label={t('admin:products.price')}>
                          <div className="flex items-center">
                            <DollarOutlined className="mr-1 text-primary" />
                            <Text strong className="text-primary">
                              {formatCurrency(Number(product.price))}
                            </Text>
                            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                              <Text delete className="text-gray-400 ml-2">
                                {formatCurrency(Number(product.originalPrice))}
                              </Text>
                            )}
                          </div>
                        </Descriptions.Item>
                        
                        <Descriptions.Item label={t('admin:products.stock')}>
                          <Tag color={
                            (product.stockQuantity || 0) > 10 ? 'success' : 
                            (product.stockQuantity || 0) > 0 ? 'warning' : 'error'
                          }>
                            {product.stockQuantity || 0}
                          </Tag>
                        </Descriptions.Item>
                        
                        <Descriptions.Item label={t('admin:products.status')}>
                          {product.active ? (
                            <Badge
                              status="success"
                              text={
                                <span className="flex items-center">
                                  <CheckCircleOutlined className="mr-1 text-green-500" />
                                  {t('admin:products.active')}
                                </span>
                              }
                            />
                          ) : (
                            <Badge
                              status="error"
                              text={
                                <span className="flex items-center">
                                  <CloseCircleOutlined className="mr-1 text-red-500" />
                                  {t('admin:products.inactive')}
                                </span>
                              }
                            />
                          )}
                        </Descriptions.Item>
                        
                        <Descriptions.Item label={t('admin:products.featured')}>
                          {product.featured ? (
                            <Badge
                              status="warning"
                              text={
                                <span className="flex items-center">
                                  <StarFilled className="mr-1 text-yellow-500" />
                                  {t('admin:products.featured')}
                                </span>
                              }
                            />
                          ) : (
                            <Badge
                              status="default"
                              text={
                                <span className="flex items-center">
                                  <StarOutlined className="mr-1 text-gray-500" />
                                  {t('admin:products.not_featured')}
                                </span>
                              }
                            />
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                </Row>
                
                {/* Description */}
                <Card className="mt-4 shadow-sm">
                  <Title level={4} className="dark:text-white mb-4">
                    {t('admin:products.description')}
                  </Title>
                  
                  {product.description ? (
                    <div className="product-description dark:text-gray-300" 
                      dangerouslySetInnerHTML={{ __html: product.description }} 
                    />
                  ) : (
                    <Alert
                      type="warning"
                      message={t('admin:products.no_description')}
                      className="mb-4"
                      showIcon
                    />
                  )}
                  
                  {product.shortDescription && (
                    <div className="mt-6">
                      <Title level={5} className="dark:text-white mb-2">
                        {t('admin:products.short_description')}
                      </Title>
                      <Paragraph className="dark:text-gray-300">
                        {product.shortDescription}
                      </Paragraph>
                    </div>
                  )}
                </Card>
              </TabPane>
              
              {/* Variants Tab */}
              <TabPane
                tab={
                  <span className="flex items-center">
                    <AppstoreOutlined className="mr-1" />
                    {t('admin:products.variants')}
                    {product.variants?.length > 0 && (
                      <Badge count={product.variants.length} className="ml-2" />
                    )}
                  </span>
                }
                key="variants"
              >
                {product.variants && product.variants.length > 0 ? (
                  <Table
                    dataSource={product.variants}
                    columns={variantColumns}
                    rowKey="id"
                    pagination={false}
                    className="mt-4"
                  />
                ) : (
                  <Empty
                    description={t('admin:products.no_variants')}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="my-12"
                  >
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={handleEdit}
                    >
                      {t('admin:products.add_variant')}
                    </Button>
                  </Empty>
                )}
              </TabPane>
              
              {/* Images Tab */}
              <TabPane
                tab={
                  <span className="flex items-center">
                    <PictureOutlined className="mr-1" />
                    {t('admin:products.images')}
                    {product.images?.length > 0 && (
                      <Badge count={product.images.length} className="ml-2" />
                    )}
                  </span>
                }
                key="images"
              >
                {product.images && product.images.length > 0 ? (
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                    dataSource={product.images}
                    renderItem={(image: ProductImageResponse) => (
                      <List.Item>
                        <Card
                          hoverable
                          cover={
                            <div className="h-48 overflow-hidden">
                              <img
                                alt={image.altText || product.name}
                                src={image.imageUrl}
                                className="w-full h-full object-cover"
                                onClick={() => showImagePreview(image.imageUrl)}
                              />
                            </div>
                          }
                          actions={[
                            <Tooltip title={t('admin:actions.view')}>
                              <EyeOutlined key="view" onClick={() => showImagePreview(image.imageUrl)} />
                            </Tooltip>,
                            <Tooltip title={t('admin:products.set_as_primary')}>
                              <Button
                                type="text"
                                icon={<StarOutlined />}
                                onClick={() => handleSetPrimaryImage(image.id)}
                                disabled={image.isPrimary}
                              />
                            </Tooltip>,
                            <Popconfirm
                              title={t('admin:products.image_delete_confirm')}
                              onConfirm={() => handleDeleteImage(image.id)}
                              okText={t('admin:actions.yes')}
                              cancelText={t('admin:actions.no')}
                            >
                              <DeleteOutlined key="delete" />
                            </Popconfirm>,
                          ]}
                          className={image.isPrimary ? 'border-2 border-primary' : ''}
                        >
                          <div className="flex justify-between items-center">
                            <Text className="text-sm truncate">
                              {image.altText || t('admin:products.no_alt_text')}
                            </Text>
                            {image.isPrimary && (
                              <Tag color="success">{t('admin:products.primary')}</Tag>
                            )}
                          </div>
                        </Card>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty
                    description={t('admin:products.no_images')}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="my-12"
                  >
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={handleEdit}
                    >
                      {t('admin:products.add_images')}
                    </Button>
                  </Empty>
                )}
              </TabPane>
              
              {/* Stats Tab */}
              <TabPane
                tab={
                  <span className="flex items-center">
                    <BarChartOutlined className="mr-1" />
                    {t('admin:products.stats')}
                  </span>
                }
                key="stats"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card className="text-center">
                    <Statistic
                      title={t('admin:products.view_count')}
                      value={product.viewCount || 0}
                      prefix={<EyeOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                  
                  <Card className="text-center">
                    <Statistic
                      title={t('admin:products.variants_count')}
                      value={product.variants?.length || 0}
                      prefix={<AppstoreOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                  
                  <Card className="text-center">
                    <Statistic
                      title={t('admin:products.stock')}
                      value={product.stockQuantity || 0}
                      prefix={<ShoppingOutlined />}
                      valueStyle={{ 
                        color: (product.stockQuantity || 0) > 10 
                          ? '#52c41a' 
                          : (product.stockQuantity || 0) > 0 
                            ? '#faad14' 
                            : '#f5222d' 
                      }}
                    />
                  </Card>
                  
                  <Card className="text-center">
                    <Statistic
                      title={t('admin:products.images_count')}
                      value={product.images?.length || 0}
                      prefix={<PictureOutlined />}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </div>
                
                <Alert
                  type="info"
                  message={t('admin:products.stats_note')}
                  description={t('admin:products.stats_description')}
                  showIcon
                  className="mb-6"
                />
                
                {/* Placeholder for future statistics and charts */}
                <div className="border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center rounded-lg">
                  <BarChartOutlined className="text-4xl text-gray-400 mb-4" />
                  <Text className="text-gray-500 dark:text-gray-400 block">
                    {t('admin:products.detailed_stats_coming_soon')}
                  </Text>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </motion.div>
        
        {/* Sidebar */}
        <motion.div variants={slideUp}>
          <div className="space-y-6">
            {/* Quick actions card */}
            <Card
              title={
                <Text strong className="dark:text-white flex items-center">
                  <ShoppingOutlined className="mr-2" />
                  {t('admin:quick_actions')}
                </Text>
              }
              className="shadow-sm dark:bg-gray-800"
            >
              <div className="space-y-2">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  block
                  onClick={handleEdit}
                >
                  {t('admin:actions.edit')}
                </Button>
                
                <Button
                  type={product.featured ? 'default' : 'default'}
                  icon={product.featured ? <StarFilled className="text-yellow-500" /> : <StarOutlined />}
                  block
                  onClick={handleToggleFeatured}
                >
                  {product.featured 
                    ? t('admin:products.unfeature') 
                    : t('admin:products.feature')}
                </Button>
                
                <Button
                  type={product.active ? 'default' : 'primary'}
                  icon={product.active ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                  block
                  onClick={handleToggleStatus}
                >
                  {product.active 
                    ? t('admin:products.deactivate') 
                    : t('admin:products.activate')}
                </Button>
                
                <Button
                  type="default"
                  icon={<SyncOutlined />}
                  block
                  onClick={() => id && fetchProduct(id)}
                >
                  {t('admin:actions.refresh')}
                </Button>
                
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  block
                  onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                >
                  {t('admin:products.view_on_site')}
                </Button>
              </div>
            </Card>
            
            {/* Product Dates */}
            <Card
              title={
                <Text strong className="dark:text-white flex items-center">
                  <ClockCircleOutlined className="mr-2" />
                  {t('admin:products.timestamps')}
                </Text>
              }
              className="shadow-sm dark:bg-gray-800"
            >
              <Descriptions 
                bordered 
                column={1}
                size="small"
                className="product-details-table"
              >
                <Descriptions.Item label={t('admin:products.created_at')}>
                  <span className="flex items-center">
                    <ClockCircleOutlined className="mr-1 text-gray-500" />
                    {formatDate(product.createdAt)}
                  </span>
                </Descriptions.Item>
                
                <Descriptions.Item label={t('admin:products.updated_at')}>
                  <span className="flex items-center">
                    <ClockCircleOutlined className="mr-1 text-gray-500" />
                    {formatDate(product.updatedAt)}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </Card>
            
            {/* QR code if available */}
            {product.qrCode && (
              <Card
                title={
                  <Text strong className="dark:text-white flex items-center">
                    <QrcodeOutlined className="mr-2" />
                    {t('admin:products.qr_code')}
                  </Text>
                }
                className="shadow-sm dark:bg-gray-800"
              >
                <div className="p-4 bg-white rounded-lg text-center">
                  <img 
                    src={product.qrCode.qrImageUrl} 
                    alt="QR Code"
                    className="w-32 h-32 mx-auto" 
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    {product.qrCode.qrData}
                  </div>
                  <Button 
                    type="primary" 
                    icon={<LinkOutlined />}
                    className="mt-4"
                    onClick={() => window.open(product.qrCode?.redirectUrl, '_blank')}
                  >
                    {t('admin:products.view_qr_page')}
                  </Button>
                </div>
              </Card>
            )}
            
            {/* Share Card */}
            <Card
              title={
                <Text strong className="dark:text-white flex items-center">
                  <ShareAltOutlined className="mr-2" />
                  {t('admin:products.share')}
                </Text>
              }
              className="shadow-sm dark:bg-gray-800"
            >
              <Button 
                type="default" 
                icon={<LinkOutlined />}
                block
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  message.success(t('admin:products.link_copied'));
                }}
              >
                {t('admin:products.copy_link')}
              </Button>
            </Card>
            
            {/* Danger zone card */}
            <Card
              title={
                <Text
                  strong
                  className="text-red-600 dark:text-red-400 flex items-center"
                >
                  <DeleteOutlined className="mr-2" />
                  {t('admin:danger_zone')}
                </Text>
              }
              className="shadow-sm dark:bg-gray-800"
            >
              <Alert
                message={t('admin:products.delete_warning')}
                description={t('admin:products.delete_warning_desc')}
                type="warning"
                showIcon
                className="mb-4"
              />
              
              <Button
                danger
                icon={<DeleteOutlined />}
                block
                onClick={() => setDeleteConfirmVisible(true)}
              >
                {t('admin:products.delete_product')}
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
        width="auto"
        centered
        className="image-preview-modal"
      >
        <Image
          src={currentImage}
          alt="preview"
          style={{ maxWidth: '100%' }}
          preview={false}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <Text className="text-red-600">
            {t('admin:products.delete_confirm_title')}
          </Text>
        }
        open={deleteConfirmVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteConfirmVisible(false)}
        okText={t('admin:actions.delete')}
        cancelText={t('admin:actions.cancel')}
        okButtonProps={{ danger: true }}
        centered
      >
        <p>{t('admin:products.delete_confirm')}</p>
        <p className="font-semibold">{product.name}</p>
        
        <Alert
          message={t('admin:products.delete_permanent')}
          description={t('admin:products.delete_cascade_warning')}
          type="warning"
          showIcon
          className="mt-4"
        />
      </Modal>
      
      {/* Custom Styles */}
      <style>{`
        .product-details-table .ant-descriptions-item-label {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .dark .product-details-table .ant-descriptions-item-label {
          background-color: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.85);
        }
        
        .dark .product-details-table .ant-descriptions-item-content {
          color: rgba(255, 255, 255, 0.65);
        }
        
        .product-description img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }
        
        .product-carousel .slick-dots {
          margin-bottom: 12px;
        }
        
        .product-carousel .slick-dots li button {
          background: #ccc;
          opacity: 0.4;
        }
        
        .product-carousel .slick-dots li.slick-active button {
          background: #1890ff;
          opacity: 1;
        }
        
        .image-preview-modal .ant-modal-body {
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          max-height: 90vh;
          overflow: auto;
        }
      `}</style>
    </motion.div>
  );
};

export default ProductDetail;