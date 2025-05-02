// src/admin/pages/categories/CategoryDetail.tsx
import React, { useEffect, useState } from 'react';
import { 
  Card, Typography, Button, Tag, Descriptions, Skeleton, 
  Empty, Divider, Tooltip, Breadcrumb, Tabs, Statistic, 
  Badge, Alert, Modal, List, Avatar
} from 'antd';
import { 
  EditOutlined, DeleteOutlined, ArrowLeftOutlined, 
  AppstoreOutlined, LinkOutlined, ClockCircleOutlined, 
  InfoCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, 
  EyeOutlined, PictureOutlined
} from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategoryById, deleteCategory } from '@/admin/store/slices/categorySlice';
import { CategoryResponse } from '@/admin/types';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

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
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  }
};

// Child Category Card Component
interface ChildCategoryCardProps {
  category: CategoryResponse;
  onView: (id: string) => void;
}

const ChildCategoryCard: React.FC<ChildCategoryCardProps> = ({ category, onView }) => {
  return (
    <List.Item>
      <div className="flex w-full items-center">
        <div className="flex-shrink-0 mr-4">
          {category.imageUrl ? (
            <Avatar 
              shape="square" 
              size={48} 
              src={category.imageUrl} 
              className="rounded-md"
            />
          ) : (
            <Avatar 
              shape="square" 
              size={48} 
              icon={<AppstoreOutlined />} 
              className="rounded-md bg-gray-200 dark:bg-gray-700"
            />
          )}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium dark:text-white m-0">{category.name}</h4>
              <div className="text-xs text-gray-500 dark:text-gray-400">/{category.slug}</div>
            </div>
            <Tag 
              color={category.active ? 'success' : 'error'}
              className="ml-2"
            >
              {category.active ? 'Active' : 'Inactive'}
            </Tag>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => onView(category.id)}
            className="flex items-center justify-center"
          />
        </div>
      </div>
    </List.Item>
  );
};

const CategoryDetail: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentCategory, loading } = useAppSelector(state => state.categories);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  
  // Mock stats data
  const [stats] = useState({
    products: 12,
    views: 485,
    subcategories: Array.isArray(currentCategory?.children) ? currentCategory.children.length : 0,
  });
  
  // Fetch category data
  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryById(id));
    }
  }, [dispatch, id]);
  
  // Handle edit button click
  const handleEdit = () => {
    navigate(`/admin/categories/edit/${id}`);
  };
  
  // Show delete confirmation modal
  const showDeleteConfirm = () => {
    setDeleteConfirmVisible(true);
  };
  
  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      await dispatch(deleteCategory(id!)).unwrap();
      setDeleteConfirmVisible(false);
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  
  // Handle view child category
  const handleViewChild = (childId: string) => {
    navigate(`/admin/categories/${childId}`);
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('LL LT');
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
  
  if (!currentCategory) {
    return (
      <Card className="text-center py-12">
        <Empty
          description={t('admin:categories.not_found')}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button
          type="primary"
          className="mt-4"
          onClick={() => navigate('/admin/categories')}
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
            <Breadcrumb.Item>{t('admin:dashboard.title')}</Breadcrumb.Item>
            <Breadcrumb.Item
              onClick={() => navigate('/admin/categories')}
              className="cursor-pointer"
            >
              {t('admin:categories.title')}
            </Breadcrumb.Item>
            <Breadcrumb.Item>{currentCategory.name}</Breadcrumb.Item>
          </Breadcrumb>
          
          <div className="flex items-center gap-2">
            <Title level={2} className="mb-0 dark:text-white">
              {currentCategory.name}
            </Title>
            <Tag color={currentCategory.active ? 'success' : 'error'} className="ml-2">
              {currentCategory.active
                ? t('admin:categories.active')
                : t('admin:categories.inactive')}
            </Tag>
          </div>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
            <LinkOutlined className="mr-1" />
            <Text
              copyable={{ text: currentCategory.slug }}
              className="text-gray-500 dark:text-gray-400"
            >
              /{currentCategory.slug}
            </Text>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/categories')}
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
            onClick={showDeleteConfirm}
          >
            {t('admin:actions.delete')}
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main category information */}
        <motion.div 
          className="lg:col-span-2" 
          variants={slideUp}
        >
          <Card className="shadow-sm dark:bg-gray-800">
            <Tabs defaultActiveKey="info" className="overflow-visible">
              <TabPane
                tab={
                  <span className="flex items-center">
                    <InfoCircleOutlined className="mr-1" />
                    {t('admin:categories.info_tab')}
                  </span>
                }
                key="info"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="md:col-span-2">
                    <div
                      className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 h-60 md:h-80 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
                      onClick={() => currentCategory.imageUrl && setImagePreviewVisible(true)}
                    >
                      {currentCategory.imageUrl ? (
                        <img
                          src={currentCategory.imageUrl}
                          alt={currentCategory.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                          <PictureOutlined style={{ fontSize: 48 }} />
                          <Text className="text-gray-400 dark:text-gray-500 mt-2">
                            {t('admin:categories.no_image')}
                          </Text>
                        </div>
                      )}
                      
                      {/* View full image button */}
                      {currentCategory.imageUrl && (
                        <div className="absolute right-4 bottom-4">
                          <Tooltip title={t('admin:actions.view_image')}>
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<EyeOutlined />}
                              onClick={() => setImagePreviewVisible(true)}
                            />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="md:col-span-2">
                    <Title level={4} className="dark:text-white">
                      {t('admin:categories.description')}
                    </Title>
                    
                    {currentCategory.description ? (
                      <Paragraph className="text-gray-700 dark:text-gray-300 text-base">
                        {currentCategory.description}
                      </Paragraph>
                    ) : (
                      <Alert
                        type="warning"
                        message={t('admin:categories.no_description')}
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
                      {t('admin:categories.details')}
                    </Title>
                  }
                  bordered
                  column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
                  className="category-details-table"
                >
                  <Descriptions.Item label={t('admin:categories.id')}>
                    <Text copyable>{currentCategory.id}</Text>
                  </Descriptions.Item>
                  
                  <Descriptions.Item label={t('admin:categories.parent')}>
                    {currentCategory.parent ? (
                      <Link 
                        to={`/admin/categories/${currentCategory.parent.id}`}
                        className="text-primary"
                      >
                        {currentCategory.parent.name}
                      </Link>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </Descriptions.Item>
                  
                  <Descriptions.Item label={t('admin:categories.display_order')}>
                    {currentCategory.displayOrder || 0}
                  </Descriptions.Item>
                  
                  <Descriptions.Item label={t('admin:categories.created_at')}>
                    <span className="flex items-center">
                      <ClockCircleOutlined className="mr-1 text-gray-500" />
                      {formatDate(currentCategory.createdAt)}
                    </span>
                  </Descriptions.Item>
                  
                  <Descriptions.Item label={t('admin:categories.updated_at')}>
                    <span className="flex items-center">
                      <ClockCircleOutlined className="mr-1 text-gray-500" />
                      {formatDate(currentCategory.updatedAt)}
                    </span>
                  </Descriptions.Item>
                  
                  <Descriptions.Item label={t('admin:categories.status')}>
                    {currentCategory.active ? (
                      <Badge
                        status="success"
                        text={
                          <span className="flex items-center">
                            <CheckCircleOutlined className="mr-1 text-green-500" />
                            {t('admin:categories.active')}
                          </span>
                        }
                      />
                    ) : (
                      <Badge
                        status="error"
                        text={
                          <span className="flex items-center">
                            <CloseCircleOutlined className="mr-1 text-red-500" />
                            {t('admin:categories.inactive')}
                          </span>
                        }
                      />
                    )}
                  </Descriptions.Item>
                </Descriptions>
                
                {/* Child Categories */}
                {currentCategory.children && currentCategory.children.length > 0 && (
                  <div className="mt-8">
                    <Title level={4} className="dark:text-white mb-4">
                      {t('admin:categories.subcategories')}
                    </Title>
                    
                    <List
                      itemLayout="horizontal"
                      dataSource={currentCategory.children}
                      renderItem={item => (
                        <ChildCategoryCard 
                          category={item} 
                          onView={handleViewChild} 
                        />
                      )}
                      bordered
                      className="category-children-list"
                    />
                  </div>
                )}
              </TabPane>
              
              <TabPane
                tab={
                  <span className="flex items-center">
                    <AppstoreOutlined className="mr-1" />
                    {t('admin:categories.products_tab')}
                  </span>
                }
                key="products"
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className="shadow-sm text-center">
                    <Statistic
                      title={t('admin:categories.total_products')}
                      value={stats.products}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                  
                  <Card className="shadow-sm text-center">
                    <Statistic
                      title={t('admin:categories.total_views')}
                      value={stats.views}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                  
                  <Card className="shadow-sm text-center">
                    <Statistic
                      title={t('admin:categories.total_subcategories')}
                      value={stats.subcategories}
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Card>
                </div>
                
                <Alert
                  type="info"
                  message={t('admin:categories.products_info')}
                  description={t('admin:categories.products_description')}
                  showIcon
                  className="mb-4"
                />
                
                <div className="flex justify-center py-8">
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={() => navigate('/admin/products?categoryId=' + currentCategory.id)}
                  >
                    {t('admin:categories.view_products')}
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </motion.div>
        
        {/* Sidebar */}
        <motion.div variants={slideUp}>
          <div className="space-y-6">
            {/* Quick actions */}
            <Card
              title={
                <Text strong className="dark:text-white flex items-center">
                  <AppstoreOutlined className="mr-2" />
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
                  type="default"
                  icon={<AppstoreOutlined />}
                  block
                  onClick={() => navigate('/admin/products?categoryId=' + currentCategory.id)}
                >
                  {t('admin:categories.view_products')}
                </Button>
                
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  block
                  onClick={() => window.open(`/categories/${currentCategory.slug}`, '_blank')}
                >
                  {t('admin:categories.view_on_site')}
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
                  {t('admin:danger_zone')}
                </Text>
              }
              className="shadow-sm dark:bg-gray-800"
            >
              <Alert
                message={t('admin:categories.delete_warning')}
                description={t('admin:categories.delete_warning_desc')}
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
                {t('admin:categories.delete_category')}
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
        title={t('admin:categories.image_preview')}
      >
        {currentCategory.imageUrl && (
          <img
            src={currentCategory.imageUrl}
            alt={currentCategory.name}
            style={{ width: '100%' }}
          />
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <Text className="text-red-600">
            {t('admin:categories.delete_confirm_title')}
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
        <p>{t('admin:categories.delete_confirm')}</p>
        <p className="font-semibold">{currentCategory.name}</p>
        
        <Alert
          message={t('admin:categories.delete_permanent')}
          description={t('admin:categories.delete_cascade_warning')}
          type="warning"
          showIcon
          className="mt-4"
        />
      </Modal>
      
      {/* Custom styles */}
      <style>{`
        .category-details-table .ant-descriptions-item-label {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .dark .category-details-table .ant-descriptions-item-label {
          background-color: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.85);
        }
        
        .dark .category-details-table .ant-descriptions-item-content {
          color: rgba(255, 255, 255, 0.65);
        }
        
        .category-children-list .ant-list-item {
          transition: all 0.3s ease;
        }
        
        .category-children-list .ant-list-item:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .dark .category-children-list .ant-list-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </motion.div>
  );
};

export default CategoryDetail;