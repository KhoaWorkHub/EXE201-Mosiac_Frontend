import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Popconfirm, Tag, Input, Card, message, notification, 
  Select, Form, Row, Col, Slider, Switch, Tooltip
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  StarOutlined, StarFilled, EyeOutlined, FilterOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminProductService } from '@/admin/services/adminProductService';
import { AdminCategoryService } from '@/admin/services/adminCategoryService';
import { AdminRegionService } from '@/admin/services/adminRegionService';
import { ProductResponse, CategoryResponse, RegionResponse } from '@/admin/types';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/formatters';
import type { ColumnsType } from 'antd/es/table';


const { Option } = Select;

const ProductList: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // State for data
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  // State for filters
  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: undefined as string | undefined,
    regionId: undefined as string | undefined,
    priceRange: [0, 5000] as [number, number],
    featured: undefined as boolean | undefined,
    active: undefined as boolean | undefined,
  });
  
  // State for filter drawer
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Fetch products, categories and regions on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchRegions();
  }, [pagination.current, pagination.pageSize]);
  
  // Fetch products based on current filters and pagination
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { keyword, categoryId, regionId, priceRange, featured, active } = filters;
      
      const response = await AdminProductService.getAllProducts(
        pagination.current - 1, // API uses 0-based indexing
        pagination.pageSize,
        'createdAt,desc',
        keyword,
        categoryId,
        regionId,
        priceRange[0] > 0 ? priceRange[0] : undefined,
        priceRange[1] < 5000 ? priceRange[1] : undefined,
        featured,
        active
      );
      
      setProducts(response.content);
      setPagination({
        ...pagination,
        total: response.totalElements,
      });
    } catch (error) {
      notification.error({
        message: t('admin:products.fetch_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories for filter
  const fetchCategories = async () => {
    try {
      const response = await AdminCategoryService.getAllCategories();
      setCategories(response);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };
  
  // Fetch all regions for filter
  const fetchRegions = async () => {
    try {
      const response = await AdminRegionService.getAllRegions();
      setRegions(response);
    } catch (error) {
      console.error('Failed to fetch regions:', error);
    }
  };

  // Handle table pagination change
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
  };
  
  // Handle product deletion
  const handleDelete = async (id: string) => {
    try {
      await AdminProductService.deleteProduct(id);
      message.success(t('admin:products.delete_success'));
      fetchProducts();
    } catch (error) {
      notification.error({
        message: t('admin:products.delete_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  // Handle toggling featured status
  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await AdminProductService.setProductFeatured(id, !currentStatus);
      message.success(
        currentStatus 
          ? t('admin:products.unfeature_success') 
          : t('admin:products.feature_success')
      );
      fetchProducts();
    } catch (error) {
      notification.error({
        message: t('admin:products.feature_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  // Handle filter form submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterSubmit = (values: any) => {
    setFilters({
      ...filters,
      ...values,
    });
    setPagination({
      ...pagination,
      current: 1, // Reset to first page when filters change
    });
    setShowFilters(false);
    fetchProducts();
  };
  
  // Reset filters
  const handleResetFilters = () => {
    form.resetFields();
    setFilters({
      keyword: '',
      categoryId: undefined,
      regionId: undefined,
      priceRange: [0, 5000],
      featured: undefined,
      active: undefined,
    });
    setPagination({
      ...pagination,
      current: 1,
    });
    fetchProducts();
    setShowFilters(false);
  };
  
  // Handle keyword search
  const handleSearch = (value: string) => {
    setFilters({
      ...filters,
      keyword: value,
    });
    setPagination({
      ...pagination,
      current: 1,
    });
    fetchProducts();
  };
  
  // Define table columns
  const columns: ColumnsType<ProductResponse> = [
    {
      title: t('admin:products.image'),
      dataIndex: ['images'],
      key: 'image',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (images: any[]) => {
        const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
        return primaryImage ? (
          <img 
            src={primaryImage.imageUrl} 
            alt="product" 
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
            <ShoppingOutlined className="text-gray-400" />
          </div>
        );
      },
    },
    {
      title: t('admin:products.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ProductResponse) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.sku}</div>
        </div>
      ),
    },
    {
      title: t('admin:products.price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price),
      sorter: (a: ProductResponse, b: ProductResponse) => a.price - b.price,
    },
    {
      title: t('admin:products.stock'),
      dataIndex: 'stockQuantity',
      key: 'stock',
      render: (stock: number) => (
        <Tag color={stock > 0 ? 'green' : 'red'}>
          {stock > 0 ? stock : t('common:out_of_stock')}
        </Tag>
      ),
      sorter: (a: ProductResponse, b: ProductResponse) => (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0),
    },
    {
      title: t('admin:products.category'),
      dataIndex: ['category', 'name'],
      key: 'category',
      filters: categories.map(cat => ({ text: cat.name, value: cat.id })),
      onFilter: (value, record) =>
        record.category?.id === (value as string)
    },
    {
      title: t('admin:products.region'),
      dataIndex: ['region', 'name'],
      key: 'region',
      filters: regions.map(region => ({ text: region.name, value: region.id })),
      onFilter: (value, record) =>
        record.region?.id === (value as string)
    },
    {
      title: t('admin:products.status'),
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? t('admin:products.active') : t('admin:products.inactive')}
        </Tag>
      ),
      filters: [
        { text: t('admin:products.active'), value: true },
        { text: t('admin:products.inactive'), value: false },
      ],
      onFilter: (value, record) =>
        record.active === (value as boolean),
    },
    {
      title: t('admin:products.featured'),
      dataIndex: 'featured',
      key: 'featured',
      render: (featured: boolean, record: ProductResponse) => (
        <Button 
          type="text" 
          icon={featured ? <StarFilled className="text-yellow-500" /> : <StarOutlined />} 
          onClick={() => handleToggleFeatured(record.id, featured)}
        />
      ),
      filters: [
        { text: t('admin:products.featured'), value: true },
        { text: t('common:not_featured'), value: false },
      ],
      onFilter: (value, record) =>
        record.featured === (value as boolean),
    },
    {
      title: t('admin:products.actions'),
      key: 'action',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: ProductResponse) => (
        <Space size="small">
          <Tooltip title={t('common:view')}>
            <Button
              icon={<EyeOutlined />}
              shape="circle"
              onClick={() => window.open(`/products/${record.slug}`, '_blank')}
            />
          </Tooltip>
          
          <Tooltip title={t('admin:actions.edit')}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              shape="circle"
              onClick={() => navigate(`/admin/products/edit/${record.id}`)}
            />
          </Tooltip>
          
          <Tooltip title={t('admin:actions.delete')}>
            <Popconfirm
              title={t('admin:products.delete_confirm')}
              onConfirm={() => handleDelete(record.id)}
              okText={t('admin:actions.yes')}
              cancelText={t('admin:actions.no')}
            >
              <Button 
                type="primary" 
                danger 
                icon={<DeleteOutlined />}
                shape="circle"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">
          {t('admin:products.title')}
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/products/new')}
        >
          {t('admin:products.add')}
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          {/* Search input */}
          <Input.Search
            placeholder={t('admin:products.search_placeholder')}
            className="w-full md:w-80"
            value={filters.keyword}
            onChange={(e) => setFilters({...filters, keyword: e.target.value})}
            onSearch={handleSearch}
            allowClear
          />
          
          <div className="flex gap-2">
            {/* Filter button */}
            <Button 
              icon={<FilterOutlined />} 
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-blue-50 text-blue-500 border-blue-200' : ''}
            >
              {t('common:filters')}
            </Button>
            
            {/* Reset filters */}
            <Button 
              onClick={handleResetFilters}
              disabled={
                !filters.keyword && 
                !filters.categoryId && 
                !filters.regionId && 
                filters.priceRange[0] === 0 && 
                filters.priceRange[1] === 5000 && 
                filters.featured === undefined && 
                filters.active === undefined
              }
            >
              {t('common:reset')}
            </Button>
          </div>
        </div>
        
        {/* Filter panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFilterSubmit}
              initialValues={filters}
            >
              <Row gutter={16}>
                <Col xs={24} md={8} lg={6}>
                  <Form.Item name="categoryId" label={t('admin:products.category')}>
                    <Select 
                      placeholder={t('admin:products.select_category')}
                      allowClear
                    >
                      {categories.map(category => (
                        <Option key={category.id} value={category.id}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8} lg={6}>
                  <Form.Item name="regionId" label={t('admin:products.region')}>
                    <Select 
                      placeholder={t('admin:products.select_region')}
                      allowClear
                    >
                      {regions.map(region => (
                        <Option key={region.id} value={region.id}>
                          {region.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8} lg={6}>
                  <Form.Item name="priceRange" label={t('admin:products.price')}>
                    <Slider
                      range
                      min={0}
                      max={5000}
                      tipFormatter={value => `$${value}`}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={12} md={4} lg={3}>
                  <Form.Item 
                    name="featured" 
                    label={t('admin:products.featured')}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                
                <Col xs={12} md={4} lg={3}>
                  <Form.Item 
                    name="active" 
                    label={t('admin:products.status')}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
              
              <div className="flex justify-end space-x-2">
                <Button onClick={handleResetFilters}>{t('common:reset')}</Button>
                <Button type="primary" htmlType="submit">{t('common:apply')}</Button>
              </div>
            </Form>
          </motion.div>
        )}
        
        {/* Products table */}
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default ProductList;