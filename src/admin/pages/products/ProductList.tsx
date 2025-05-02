import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, Button, Space, Card, Typography, Input, Tag, Dropdown, Empty, Skeleton, 
  Tabs, Form, Row, Col, Select, Slider, Switch, notification, Radio, Drawer,
  Tooltip, Popconfirm
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, EditOutlined, StarOutlined, 
  StarFilled, EyeOutlined, FilterOutlined, 
  ReloadOutlined, AppstoreOutlined, UnorderedListOutlined, DownloadOutlined,
  ShoppingOutlined, ExportOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminProductService } from '@/admin/services/adminProductService';
import { AdminCategoryService } from '@/admin/services/adminCategoryService';
import { AdminRegionService } from '@/admin/services/adminRegionService';
import { ProductResponse, CategoryResponse, RegionResponse } from '@/admin/types';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/utils/formatters';
import ProductCard from '@/admin/components/products/ProductCard';
import debounce from 'lodash/debounce';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Animations
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const ProductList: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const navigate = useNavigate();
  
  // State
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
  
  // Filter state
  const [filters, setFilters] = useState({
    keyword: '',
    categoryId: undefined as string | undefined,
    regionId: undefined as string | undefined,
    priceRange: [0, 5000] as [number, number],
    featured: undefined as boolean | undefined,
    active: undefined as boolean | undefined,
    stockStatus: undefined as 'inStock' | 'outOfStock' | 'lowStock' | undefined,
  });
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [form] = Form.useForm();
  
  // Memoized fetch products function
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { keyword, categoryId, regionId, priceRange, featured, active } = filters;
      const minPrice = priceRange[0] > 0 ? priceRange[0] : undefined;
      const maxPrice = priceRange[1] < 5000 ? priceRange[1] : undefined;
      
      const response = await AdminProductService.getAllProducts(
        pagination.current - 1,
        pagination.pageSize,
        sortBy,
        keyword,
        categoryId,
        regionId,
        minPrice,
        maxPrice,
        featured,
        active
      );
      
      const productsData = response.content;
      setProducts(productsData);
      setFilteredProducts(productsData);
      setPagination(prev => ({
        ...prev,
        total: response.totalElements,
      }));
      
      // Additional filtering for stock status (client-side)
      if (filters.stockStatus) {
        let filteredByStock;
        switch (filters.stockStatus) {
          case 'inStock':
            filteredByStock = productsData.filter(p => (p.stockQuantity || 0) > 5);
            break;
          case 'lowStock':
            filteredByStock = productsData.filter(p => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) <= 5);
            break;
          case 'outOfStock':
            filteredByStock = productsData.filter(p => !p.stockQuantity || p.stockQuantity <= 0);
            break;
          default:
            filteredByStock = productsData;
        }
        setFilteredProducts(filteredByStock);
      }
    } catch (error) {
      notification.error({
        message: t('admin:products.fetch_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, sortBy, filters, t]);
  
  // Load data on mount and when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // Fetch categories and regions on mount
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [categoriesData, regionsData] = await Promise.all([
          AdminCategoryService.getAllCategories(),
          AdminRegionService.getAllRegions()
        ]);
        setCategories(categoriesData);
        setRegions(regionsData);
      } catch (error) {
        console.error('Failed to fetch filter data:', error);
      }
    };
    
    fetchFilterData();
  }, []);
  
  // Handle search
  const handleSearch = debounce((value: string) => {
    setFilters(prev => ({ ...prev, keyword: value }));
  }, 300);
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  
  // Handle filter form submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterSubmit = (values: any) => {
    setFilters({
      ...filters,
      ...values,
    });
    setShowAdvancedFilters(false);
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
      stockStatus: undefined,
    });
  };
  
  // Action handlers
  const handleAddProduct = () => {
    navigate('/admin/products/new');
  };
  
  const handleEditProduct = (id: string) => {
    navigate(`/admin/products/edit/${id}`);
  };
  
  const handleViewProduct = (id: string) => {
    navigate(`/admin/products/${id}`);
  };
  
  const handleDeleteProduct = async (id: string) => {
    try {
      await AdminProductService.deleteProduct(id);
      notification.success({
        message: t('admin:products.delete_success'),
        placement: 'top',
      });
      fetchProducts();
    } catch (error) {
      notification.error({
        message: t('admin:products.delete_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await AdminProductService.setProductFeatured(id, !currentStatus);
      notification.success({
        message: currentStatus 
          ? t('admin:products.unfeature_success') 
          : t('admin:products.feature_success'),
        placement: 'top',
      });
      fetchProducts();
    } catch (error) {
      notification.error({
        message: t('admin:products.feature_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  // Export functions
  const exportToExcel = async () => {
    setExportLoading(true);
    try {
      // Get all products for export
      const response = await AdminProductService.getAllProducts(
        0, 1000, sortBy, filters.keyword, filters.categoryId, 
        filters.regionId, undefined, undefined, filters.featured, filters.active
      );
      
      const productsForExport = response.content.map(product => ({
        ID: product.id,
        Name: product.name,
        SKU: product.sku || '',
        Category: product.category?.name || '',
        Region: product.region?.name || '',
        Price: formatCurrency(Number(product.price)),
        'Original Price': product.originalPrice ? formatCurrency(Number(product.originalPrice)) : '',
        Stock: product.stockQuantity || 0,
        Status: product.active ? t('admin:products.active') : t('admin:products.inactive'),
        Featured: product.featured ? '✓' : '',
        'View Count': product.viewCount || 0,
        'Created At': new Date(product.createdAt).toLocaleString(),
        'Updated At': new Date(product.updatedAt).toLocaleString(),
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(productsForExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
      
      // Adjust column widths
      const colWidths = [
        { wch: 36 }, // ID
        { wch: 30 }, // Name
        { wch: 15 }, // SKU
        { wch: 20 }, // Category
        { wch: 20 }, // Region
        { wch: 15 }, // Price
        { wch: 15 }, // Original Price
        { wch: 10 }, // Stock
        { wch: 10 }, // Status
        { wch: 10 }, // Featured
        { wch: 10 }, // View Count
        { wch: 20 }, // Created At
        { wch: 20 }, // Updated At
      ];
      worksheet['!cols'] = colWidths;
      
      XLSX.writeFile(workbook, 'products_export.xlsx');
    } catch (error) {
      notification.error({
        message: t('admin:export_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setExportLoading(false);
    }
  };
  
  // CSV export data
  const csvData = products.map(product => ({
    ID: product.id,
    Name: product.name,
    SKU: product.sku || '',
    Category: product.category?.name || '',
    Region: product.region?.name || '',
    Price: product.price,
    'Original Price': product.originalPrice || '',
    Stock: product.stockQuantity || 0,
    Status: product.active ? t('admin:products.active') : t('admin:products.inactive'),
    Featured: product.featured ? 'Yes' : 'No',
    'View Count': product.viewCount || 0,
    'Created At': new Date(product.createdAt).toLocaleString(),
    'Updated At': new Date(product.updatedAt).toLocaleString(),
  }));
  
  // Table columns
  const columns = [
    {
      title: t('admin:products.image'),
      dataIndex: 'images',
      key: 'image',
      width: 100,
      render: (images: ProductResponse['images']) => {
        const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
        return primaryImage ? (
          <img 
            src={primaryImage.imageUrl} 
            alt="product" 
            className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-gray-700"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
            <ShoppingOutlined className="text-gray-400 dark:text-gray-500" />
          </div>
        );
      },
    },
    {
      title: t('admin:products.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string, record: ProductResponse) => (
        <div>
          <div className="font-medium dark:text-white">{text}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{record.sku}</div>
        </div>
      ),
    },
    {
      title: t('admin:products.price'),
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      render: (price: number, record: ProductResponse) => (
        <div>
          <div className="text-primary font-medium">{formatCurrency(Number(price))}</div>
          {record.originalPrice && Number(record.originalPrice) > Number(price) && (
            <div className="text-xs text-gray-400 line-through">
              {formatCurrency(Number(record.originalPrice))}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t('admin:products.stock'),
      dataIndex: 'stockQuantity',
      key: 'stock',
      sorter: true,
      render: (stock: number) => (
        <Tag color={stock > 10 ? 'success' : stock > 0 ? 'warning' : 'error'}>
          {stock || 0}
        </Tag>
      ),
    },
    {
      title: t('admin:products.category'),
      dataIndex: ['category', 'name'],
      key: 'category',
    },
    {
      title: t('admin:products.region'),
      dataIndex: ['region', 'name'],
      key: 'region',
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
    },
    {
      title: t('admin:products.actions'),
      key: 'action',
      width: 200,
      render: (_: unknown, record: ProductResponse) => (
        <Space size="small">
          <Tooltip title={t('common:view')}>
            <Button
              type="default"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewProduct(record.id)}
              className="flex items-center"
            />
          </Tooltip>
          
          <Tooltip title={t('admin:actions.edit')}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditProduct(record.id)}
              className="flex items-center"
            />
          </Tooltip>
          
          <Popconfirm
            title={t('admin:products.delete_confirm')}
            onConfirm={() => handleDeleteProduct(record.id)}
            okText={t('admin:actions.yes')}
            cancelText={t('admin:actions.no')}
          >
            <Tooltip title={t('admin:actions.delete')}>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                size="small"
                className="flex items-center"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  // Sort options
  const sortOptions = [
    { label: t('admin:sort.newest'), value: 'createdAt,desc' },
    { label: t('admin:sort.oldest'), value: 'createdAt,asc' },
    { label: t('admin:sort.name_asc'), value: 'name,asc' },
    { label: t('admin:sort.name_desc'), value: 'name,desc' },
    { label: t('admin:products.price_low_high'), value: 'price,asc' },
    { label: t('admin:products.price_high_low'), value: 'price,desc' },
    { label: t('admin:products.stock_asc'), value: 'stockQuantity,asc' },
    { label: t('admin:products.stock_desc'), value: 'stockQuantity,desc' },
  ];
  
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title level={2} className="dark:text-white mb-0 flex items-center">
            <ShoppingOutlined className="mr-3" /> {t('admin:products.title')}
          </Title>
          <Text className="text-gray-500 dark:text-gray-400">
            {t('admin:products.subtitle')}
          </Text>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddProduct}
            className="flex items-center"
          >
            {t('admin:products.add')}
          </Button>
          
          <Dropdown
            menu={{
              items: [
                {
                  key: 'excel',
                  label: t('admin:actions.export_excel'),
                  icon: <DownloadOutlined />,
                  onClick: exportToExcel,
                },
                {
                  key: 'csv',
                  label: (
                    <CSVLink 
                      data={csvData} 
                      filename="products_export.csv"
                      className="ant-dropdown-menu-item"
                    >
                      <ExportOutlined /> {t('admin:actions.export_csv')}
                    </CSVLink>
                  ),
                },
              ],
            }}
          >
            <Button icon={<DownloadOutlined />} loading={exportLoading}>
              {t('admin:actions.export')}
            </Button>
          </Dropdown>
        </div>
      </div>
      
      {/* Main content card */}
      <Card className="shadow-sm dark:bg-gray-800">
        {/* Tabs for sections */}
        <Tabs 
          defaultActiveKey="all" 
          className="mb-4" 
          onChange={(activeKey) => {
            switch (activeKey) {
              case 'active':
                setFilters(prev => ({ ...prev, active: true, featured: undefined }));
                break;
              case 'featured':
                setFilters(prev => ({ ...prev, featured: true, active: undefined }));
                break;
              case 'inactive':
                setFilters(prev => ({ ...prev, active: false, featured: undefined }));
                break;
              default: // 'all'
                setFilters(prev => ({ ...prev, active: undefined, featured: undefined }));
                break;
            }
          }}
        >
          <TabPane tab={t('admin:products.all_products')} key="all" />
          <TabPane tab={t('admin:products.active_products')} key="active" />
          <TabPane tab={t('admin:products.featured_products')} key="featured" />
          <TabPane tab={t('admin:products.inactive_products')} key="inactive" />
        </Tabs>
        
        {/* Filters and controls */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Input.Search
              placeholder={t('admin:products.search_placeholder')}
              onSearch={value => setFilters(prev => ({ ...prev, keyword: value }))}
              onChange={e => handleSearch(e.target.value)}
              allowClear
              className="w-full sm:w-80"
              value={filters.keyword}
            />
            
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowAdvancedFilters(true)}
              className={`flex items-center ${Object.values(filters).some(v => v !== undefined && v !== '' && v !== null && (Array.isArray(v) ? (v[0] !== 0 || v[1] !== 5000) : true)) ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' : ''}`}
            >
              {t('admin:actions.filter')}
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-end gap-2">
            <Select
              style={{ width: 160 }}
              placeholder={t('admin:sort.sort_by')}
              value={sortBy}
              onChange={handleSortChange}
              options={sortOptions}
              className="flex-grow sm:flex-grow-0"
            />
            
            <Radio.Group 
              value={viewMode} 
              onChange={e => setViewMode(e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 rounded-md p-1"
            >
              <Radio.Button value="grid" className="rounded-l-md">
                <AppstoreOutlined />
              </Radio.Button>
              <Radio.Button value="table" className="rounded-r-md">
                <UnorderedListOutlined />
              </Radio.Button>
            </Radio.Group>
            
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchProducts()}
              loading={loading}
              className="flex items-center justify-center"
            />
          </div>
        </div>
        
        {/* Active filters display */}
        {Object.values(filters).some(v => v !== undefined && v !== '' && v !== null && (Array.isArray(v) ? (v[0] !== 0 || v[1] !== 5000) : true)) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.keyword && (
              <Tag closable onClose={() => setFilters(prev => ({ ...prev, keyword: '' }))}>
                {t('admin:search')}: {filters.keyword}
              </Tag>
            )}
            
            {filters.categoryId && (
              <Tag closable onClose={() => setFilters(prev => ({ ...prev, categoryId: undefined }))}>
                {t('admin:products.category')}: {categories.find(c => c.id === filters.categoryId)?.name}
              </Tag>
            )}
            
            {filters.regionId && (
              <Tag closable onClose={() => setFilters(prev => ({ ...prev, regionId: undefined }))}>
                {t('admin:products.region')}: {regions.find(r => r.id === filters.regionId)?.name}
              </Tag>
            )}
            
            {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 5000) && (
              <Tag closable onClose={() => setFilters(prev => ({ ...prev, priceRange: [0, 5000] }))}>
                {t('admin:products.price')}: {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}
              </Tag>
            )}
            
            {filters.featured !== undefined && (
              <Tag closable onClose={() => setFilters(prev => ({ ...prev, featured: undefined }))}>
                {filters.featured ? t('admin:products.featured') : t('admin:products.not_featured')}
              </Tag>
            )}
            
            {filters.active !== undefined && (
              <Tag closable onClose={() => setFilters(prev => ({ ...prev, active: undefined }))}>
                {filters.active ? t('admin:products.active') : t('admin:products.inactive')}
              </Tag>
            )}
            
            {filters.stockStatus && (
              <Tag closable onClose={() => setFilters(prev => ({ ...prev, stockStatus: undefined }))}>
                {t(`admin:products.${filters.stockStatus}`)}
              </Tag>
            )}
            
            <Button size="small" onClick={handleResetFilters}>
              {t('admin:actions.clear_all')}
            </Button>
          </div>
        )}
        
        {/* Loading state */}
        {loading ? (
          viewMode === 'grid' ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i}>
                  <Skeleton.Image className="w-full h-48" active />
                  <Skeleton active paragraph={{ rows: 2 }} className="mt-2" />
                </div>
              ))}
            </motion.div>
          ) : (
            <Skeleton active paragraph={{ rows: 10 }} />
          )
        ) : filteredProducts.length === 0 ? (
          <Empty 
            description={t('admin:products.no_products_found')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="my-12"
          />
        ) : (
          <>
            {/* Grid view */}
            {viewMode === 'grid' && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onView={handleViewProduct}
                      onDelete={handleDeleteProduct}
                      onToggleFeatured={handleToggleFeatured}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
            
            {/* Table view */}
            {viewMode === 'table' && (
              <Table
                columns={columns}
                dataSource={filteredProducts}
                rowKey="id"
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  pageSizeOptions: ['12', '24', '36', '48'],
                  onChange: (page, pageSize) => {
                    setPagination({
                      ...pagination,
                      current: page,
                      pageSize: pageSize || 12,
                    });
                  },
                  showTotal: (total) => `${total} ${t('admin:products.items')}`,
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(_pagination, _, sorter: any) => {
                  if (sorter && sorter.order) {
                    const order = sorter.order === 'ascend' ? 'asc' : 'desc';
                    setSortBy(`${sorter.field},${order}`);
                  }
                }}
                scroll={{ x: 1200 }}
                className="products-table"
              />
            )}
          </>
        )}
      </Card>
      
      {/* Advanced filters drawer */}
      <Drawer
        title={t('admin:products.advanced_filters')}
        placement="right"
        onClose={() => setShowAdvancedFilters(false)}
        open={showAdvancedFilters}
        width={380}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={handleResetFilters}>
              {t('admin:actions.reset')}
            </Button>
            <Button type="primary" onClick={() => form.submit()}>
              {t('admin:actions.apply')}
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFilterSubmit}
          initialValues={filters}
        >
          <Form.Item name="categoryId" label={t('admin:products.category')}>
            <Select
              placeholder={t('admin:products.select_category')}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="regionId" label={t('admin:products.region')}>
            <Select
              placeholder={t('admin:products.select_region')}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {regions.map((region) => (
                <Option key={region.id} value={region.id}>
                  {region.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="priceRange" label={t('admin:products.price_range')}>
            <Slider
              range
              min={0}
              max={5000}
              tipFormatter={(value) => `$${value}`}
              marks={{
                0: '$0',
                1000: '$1000',
                3000: '$3000',
                5000: '$5000',
              }}
            />
          </Form.Item>
          
          <Form.Item name="stockStatus" label={t('admin:products.stock_status')}>
            <Select placeholder={t('admin:products.any_stock')} allowClear>
              <Option value="inStock">{t('admin:products.inStock')}</Option>
              <Option value="lowStock">{t('admin:products.lowStock')}</Option>
              <Option value="outOfStock">{t('admin:products.outOfStock')}</Option>
            </Select>
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="featured" label={t('admin:products.featured')} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item name="active" label={t('admin:products.status')} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      
      {/* Styling */}
      <style>{`
        .products-table .ant-table-row {
          transition: all 0.3s ease;
        }
        
        .products-table .ant-table-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .dark .products-table .ant-table-row:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </motion.div>
  );
};

export default ProductList;