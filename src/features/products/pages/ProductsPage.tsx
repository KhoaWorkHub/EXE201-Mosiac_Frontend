import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Breadcrumb, 
  Row, 
  Col, 
  Input, 
  Select, 
  Button, 
  Collapse, 
  Tag, 
  Pagination, 
  Divider, 
  Spin, 
  Badge, 
  Empty, 
  message,
  Card,
  Space,
  Checkbox,
  Statistic,
  Affix
} from 'antd';
import { 
  FilterOutlined, 
  SearchOutlined, 
  CloseCircleOutlined, 
  SortAscendingOutlined,
  EnvironmentOutlined,
  ClearOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  StarOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts, setFilters, resetFilters } from '@/store/slices/productSlice';
import ProductsGrid from '../components/ProductsGrid';
import type { ProductResponse } from '@/types/product.types';
import { useCart } from '@/contexts/CartContext';
import type { UUID } from 'crypto';
import { formatVND } from '@/utils/formatters';
import { 
  RegionQuickFilter, 
  RegionListFilter,
  getRegionById 
} from '@/components/filters/RegionFilter';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

interface ProductFilters {
  page: number;
  size: number;
  sort: string;
  keyword?: string;
  regionId?: string;
  featured?: boolean;
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const ProductsPage: React.FC = () => {
  const { t, i18n } = useTranslation(['product', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { products, loading, pagination, filters } = useAppSelector(state => state.products);
  
  // Local UI state
  const [showFilters, setShowFilters] = useState(false);
  useState(false);
  const [localFilters, setLocalFilters] = useState<ProductFilters>({
    page: 0,
    size: 12,
    sort: 'createdAt,desc',
    ...filters
  });
  
  // Parse query parameters on mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newFilters: ProductFilters = {
      page: 0,
      size: 12,
      sort: 'createdAt,desc',
    };
    
    queryParams.forEach((value, key) => {
      if (key === 'page') {
        newFilters.page = parseInt(value) - 1;
      } else if (key === 'size') {
        newFilters.size = parseInt(value);
      } else if (key === 'featured') {
        newFilters.featured = value === 'true';
      } else if (key === 'active') {
        newFilters.active = value === 'true';
      } else {
        newFilters[key] = value;
      }
    });
    
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
  }, [location.search, dispatch]);
  
  // Fetch products when filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);
  
  // Apply filters
  const applyFilters = () => {
    dispatch(setFilters(localFilters));
    updateURLParams(localFilters);
    setShowFilters(false);
  };
  
  // Reset filters
  const handleResetFilters = () => {
    dispatch(resetFilters());
    setLocalFilters({
      page: 0,
      size: 12,
      sort: 'createdAt,desc',
    });
    navigate('/products');
    setShowFilters(false);
  };
  
  // Update URL parameters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateURLParams = (updatedFilters: any) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'page') {
          searchParams.append(key, String(Number(value) + 1));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    
    navigate({
      pathname: '/products',
      search: searchParams.toString()
    }, { replace: true });
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page: page - 1 };
    dispatch(setFilters(updatedFilters));
    updateURLParams(updatedFilters);
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    const updatedFilters = { ...filters, sort: value, page: 0 };
    dispatch(setFilters(updatedFilters));
    updateURLParams(updatedFilters);
  };
  
  // Handle filter changes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value, page: 0 }));
  };
  
  // Quick apply single filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quickApplyFilter = (key: string, value: any) => {
    const updatedFilters = { ...filters, [key]: value, page: 0 };
    dispatch(setFilters(updatedFilters));
    updateURLParams(updatedFilters);
  };
  
  const { addToCart } = useCart();
  
  // Enhanced add to cart
  const handleAddToCart = async (product: ProductResponse) => {
    try {
      await addToCart({
        productId: product.id as UUID,
        quantity: 1,
      }, product);
      
      message.success({
        content: (
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <div>
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-gray-500">
                Đã thêm vào giỏ hàng - {formatVND(product.price)}
              </div>
            </div>
          </div>
        ),
        duration: 3,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      message.error(t('cart:notifications.error_adding'));
    }
  };
  
  // Enhanced add to wishlist
  const handleAddToWishlist = (product: ProductResponse) => {
    message.success({
      content: (
        <div className="flex items-center space-x-2">
          <span className="text-red-500">♥</span>
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-gray-500">
              Đã thêm vào danh sách yêu thích
            </div>
          </div>
        </div>
      ),
      duration: 3,
    });
  };

  // Active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.keyword) count++;
    if (filters.regionId) count++;
    if (filters.featured !== undefined) count++;
    if (filters.active !== undefined) count++;
    return count;
  };

  // Get current region
  const getCurrentRegion = () => {
    return filters.regionId ? getRegionById(filters.regionId) : null;
  };

  // Generate mock statistics for current filter
  const getFilterStats = () => {
    const totalProducts = pagination.totalElements;
    const currentRegion = getCurrentRegion();
    
    return {
      total: totalProducts,
      inStock: Math.floor(totalProducts * 0.85),
      featured: Math.floor(totalProducts * 0.3),
      averagePrice: products.length > 0 
        ? Math.floor(products.reduce((sum, p) => sum + p.price, 0) / products.length)
        : 0,
      regionName: currentRegion ? 
        (i18n.language === 'vi' ? currentRegion.name : currentRegion.nameEn) : 
        null
    };
  };

  const stats = getFilterStats();
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          className="mb-6"
          items={[
            { title: t('common:nav.home'), href: '/' },
            { title: t('common:nav.products') },
            ...(getCurrentRegion() ? [{ title: getCurrentRegion()!.name }] : [])
          ]}
        />
        
        {/* Hero Section with Quick Stats */}
        <div className="mb-8">
          <Card 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-lg"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div>
                <Title level={2} className="mb-2 dark:text-white">
                  {filters.keyword ? 
                    t('product:search_results_for', { keyword: filters.keyword }) : 
                    getCurrentRegion() ? 
                      `${t('product:products_in')} ${getCurrentRegion()!.name}` :
                      t('product:all_products')
                  }
                </Title>
                <Text className="text-gray-600 dark:text-gray-300 text-lg">
                  {t('product:discover_unique_products')}
                </Text>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 lg:mt-0">
                <Statistic
                  title={t('product:total_products')}
                  value={stats.total}
                  prefix={<AppstoreOutlined />}
                  valueStyle={{ fontSize: '18px', color: '#1890ff' }}
                />
                <Statistic
                  title={t('product:in_stock')}
                  value={stats.inStock}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ fontSize: '18px', color: '#52c41a' }}
                />
                <Statistic
                  title={t('product:featured')}
                  value={stats.featured}
                  prefix={<StarOutlined />}
                  valueStyle={{ fontSize: '18px', color: '#faad14' }}
                />
                <Statistic
                  title={t('product:avg_price')}
                  value={formatVND(stats.averagePrice)}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ fontSize: '16px', color: '#722ed1' }}
                />
              </div>
            </div>
          </Card>
        </div>
        
        {/* Quick Region Filter */}
        <div className="mb-6">
          <RegionQuickFilter
            selectedRegionId={filters.regionId}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRegionChange={(regionId: any) => quickApplyFilter('regionId', regionId)}
            showTitle={true}
            cardSize="medium"
            columns={5}
          />
        </div>
        
        <Row gutter={[24, 24]}>
          {/* Desktop Filters - Left Sidebar */}
          <Col xs={0} lg={6} className="hidden lg:block">
            <Affix offsetTop={20}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <Title level={4} className="mb-0 dark:text-white">
                    <FilterOutlined className="mr-2" />
                    {t('product:filters.filter')}
                  </Title>
                  <Badge count={getActiveFiltersCount()} offset={[0, 0]} />
                </div>
                
                {/* Search */}
                <div className="mb-6">
                  <Text strong className="block mb-2 dark:text-white">
                    <SearchOutlined className="mr-2" />
                    {t('common:search.title')}
                  </Text>
                  <Input 
                    placeholder={t('common:search.placeholder')}
                    prefix={<SearchOutlined />}
                    value={localFilters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    onPressEnter={() => applyFilters()}
                    allowClear
                  />
                </div>

                {/* Region Filter */}
                <div className="mb-6">
                  <Text strong className="block mb-3 dark:text-white">
                    <EnvironmentOutlined className="mr-2" />
                    {t('product:filters.region')}
                  </Text>
                  <RegionListFilter
                    selectedRegionId={localFilters.regionId}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onRegionChange={(regionId: any) => handleFilterChange('regionId', regionId)}
                    showAllOption={true}
                  />
                </div>
                
                {/* Quick Filters */}
                <div className="mb-6">
                  <Text strong className="block mb-3 dark:text-white">
                    {t('product:filters.quick_filters')}
                  </Text>
                  <div className="space-y-3">
                    <Checkbox 
                      checked={localFilters.featured === true}
                      onChange={(e) => handleFilterChange('featured', e.target.checked ? true : undefined)}
                    >
                      <span className="dark:text-gray-300">
                        ⭐ {t('product:filters.featured_only')}
                      </span>
                    </Checkbox>
                    <Checkbox 
                      checked={localFilters.active === true}
                      onChange={(e) => handleFilterChange('active', e.target.checked ? true : undefined)}
                    >
                      <span className="dark:text-gray-300">
                        ✅ {t('product:filters.in_stock_only')}
                      </span>
                    </Checkbox>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    type="primary" 
                    onClick={applyFilters} 
                    block
                    loading={loading}
                    size="large"
                  >
                    {t('product:filters.apply')}
                    {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()})`}
                  </Button>
                  <Button 
                    onClick={handleResetFilters} 
                    block
                    icon={<ClearOutlined />}
                    size="large"
                  >
                    {t('product:filters.clear')}
                  </Button>
                </div>

                {/* Current Region Info */}
                {getCurrentRegion() && (
                  <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{getCurrentRegion()!.icon}</span>
                      <div>
                        <div className="font-medium dark:text-white">
                          {getCurrentRegion()!.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getCurrentRegion()!.description}
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="small" 
                      type="link" 
                      onClick={() => quickApplyFilter('regionId', undefined)}
                      className="p-0 h-auto text-red-500"
                    >
                      {t('product:filters.clear_region')}
                    </Button>
                  </div>
                )}
              </div>
            </Affix>
          </Col>
          
          {/* Main Content */}
          <Col xs={24} lg={18}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-wrap justify-between items-center mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <Title level={3} className="mb-0 dark:text-white">
                      {pagination.totalElements} {t('product:products_found')}
                    </Title>
                    {getCurrentRegion() && (
                      <Tag 
                        color="geekblue" 
                        icon={<EnvironmentOutlined />}
                        className="text-sm px-3 py-1"
                      >
                        {getCurrentRegion()!.icon} {getCurrentRegion()!.name}
                      </Tag>
                    )}
                  </div>
                  
                  {filters.keyword && (
                    <Text className="text-gray-500 dark:text-gray-400">
                      {t('product:search_results_for', { keyword: filters.keyword })}
                    </Text>
                  )}
                </div>
                
                <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                  {/* Mobile Filter Button */}
                  <div className="lg:hidden">
                    <Badge count={getActiveFiltersCount()} offset={[-5, 5]}>
                      <Button 
                        icon={<FilterOutlined />} 
                        onClick={() => setShowFilters(true)}
                        size="large"
                      >
                        {t('product:filters.filter')}
                      </Button>
                    </Badge>
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div className="flex items-center">
                    <SortAscendingOutlined className="mr-2 text-gray-500" />
                    <Select
                      value={filters.sort}
                      onChange={handleSortChange}
                      style={{ width: 200 }}
                      size="large"
                    >
                      <Option value="createdAt,desc">
                        🆕 {t('product:filters.newest')}
                      </Option>
                      <Option value="price,asc">
                        💰 {t('product:filters.price_low_high')}
                      </Option>
                      <Option value="price,desc">
                        💎 {t('product:filters.price_high_low')}
                      </Option>
                      <Option value="viewCount,desc">
                        🔥 {t('product:filters.popularity')}
                      </Option>
                      <Option value="name,asc">
                        🔤 {t('product:sort.name_asc')}
                      </Option>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Active Filters */}
              {getActiveFiltersCount() > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="flex flex-wrap items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Text strong className="dark:text-white">
                      {t('product:applied_filters')}:
                    </Text>
                    
                    {filters.keyword && (
                      <Tag 
                        closable 
                        onClose={() => quickApplyFilter('keyword', undefined)}
                        icon={<SearchOutlined />}
                        color="blue"
                      >
                        "{filters.keyword}"
                      </Tag>
                    )}

                    {filters.regionId && getCurrentRegion() && (
                      <Tag 
                        color="geekblue" 
                        closable 
                        onClose={() => quickApplyFilter('regionId', undefined)}
                        icon={<EnvironmentOutlined />}
                      >
                        {getCurrentRegion()!.icon} {getCurrentRegion()!.name}
                      </Tag>
                    )}
                    
                    {filters.featured !== undefined && (
                      <Tag 
                        color="purple" 
                        closable 
                        onClose={() => quickApplyFilter('featured', undefined)}
                      >
                        ⭐ {t('product:featured')}
                      </Tag>
                    )}
                    
                    {filters.active !== undefined && (
                      <Tag 
                        color="green" 
                        closable 
                        onClose={() => quickApplyFilter('active', undefined)}
                      >
                        ✅ {t('product:in_stock')}
                      </Tag>
                    )}
                    
                    <Button 
                      type="link" 
                      icon={<CloseCircleOutlined />} 
                      onClick={handleResetFilters}
                      className="text-red-500 hover:text-red-700"
                      size="small"
                    >
                      {t('product:filters.clear_all')}
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {/* Product Grid */}
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 flex justify-center"
                  >
                    <Spin size="large" tip={t('product:loading_products')} />
                  </motion.div>
                ) : products.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProductsGrid 
                      products={products} 
                      cols={3}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <div className="text-center">
                          <div className="text-lg mb-2 dark:text-white">
                            {getCurrentRegion() ? 
                              t('product:no_products_in_region', { region: getCurrentRegion()!.name }) :
                              t('product:no_products_found')
                            }
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {t('product:try_adjusting_filters')}
                          </div>
                          {getActiveFiltersCount() > 0 && (
                            <Space>
                              <Button 
                                type="primary" 
                                onClick={handleResetFilters}
                                icon={<ClearOutlined />}
                              >
                                {t('product:filters.clear_all_and_retry')}
                              </Button>
                              {getCurrentRegion() && (
                                <Button 
                                  onClick={() => quickApplyFilter('regionId', undefined)}
                                >
                                  {t('product:view_all_regions')}
                                </Button>
                              )}
                            </Space>
                          )}
                        </div>
                      }
                      className="py-12"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 flex justify-center"
                >
                  <Pagination
                    current={pagination.currentPage + 1}
                    total={pagination.totalElements}
                    pageSize={pagination.pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} ${t('product:of')} ${total} ${t('product:products')}`
                    }
                    size="default"
                  />
                </motion.div>
              )}
            </div>
          </Col>
        </Row>
      </div>
      
      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile filter content - similar to desktop but adapted for mobile */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <Title level={4} className="m-0 dark:text-white">
                    <FilterOutlined className="mr-2" />
                    {t('product:filters.filter')}
                  </Title>
                  <div className="flex items-center space-x-2">
                    <Badge count={getActiveFiltersCount()} />
                    <Button 
                      type="text" 
                      icon={<CloseCircleOutlined />} 
                      onClick={() => setShowFilters(false)}
                      size="large"
                    />
                  </div>
                </div>
                
                <Divider />
                
                <Collapse defaultActiveKey={['1', '2', '3']} className="bg-transparent border-0">
                  <Panel 
                    header={<Text strong className="dark:text-white">{t('common:search.title')}</Text>} 
                    key="1" 
                  >
                    <Input 
                      placeholder={t('common:search.placeholder')}
                      prefix={<SearchOutlined />}
                      value={localFilters.keyword}
                      onChange={(e) => handleFilterChange('keyword', e.target.value)}
                      size="large"
                      allowClear
                    />
                  </Panel>

                  <Panel 
                    header={
                      <Text strong className="dark:text-white">
                        <EnvironmentOutlined className="mr-2" />
                        {t('product:filters.region')}
                      </Text>
                    } 
                    key="2"
                  >
                    <RegionListFilter
                      selectedRegionId={localFilters.regionId}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onRegionChange={(regionId: any) => handleFilterChange('regionId', regionId)}
                      showAllOption={true}
                    />
                  </Panel>
                  
                  <Panel 
                    header={<Text strong className="dark:text-white">{t('product:filters.quick_filters')}</Text>} 
                    key="3"
                  >
                    <div className="space-y-4">
                      <Checkbox 
                        checked={localFilters.featured === true}
                        onChange={(e) => handleFilterChange('featured', e.target.checked ? true : undefined)}
                        className="text-lg"
                      >
                        <span className="dark:text-gray-300">
                          ⭐ {t('product:filters.featured_only')}
                        </span>
                      </Checkbox>
                      <Checkbox 
                        checked={localFilters.active === true}
                        onChange={(e) => handleFilterChange('active', e.target.checked ? true : undefined)}
                        className="text-lg"
                      >
                        <span className="dark:text-gray-300">
                          ✅ {t('product:filters.in_stock_only')}
                        </span>
                      </Checkbox>
                    </div>
                  </Panel>
                </Collapse>
                
                <div className="mt-6 sticky bottom-0 bg-white dark:bg-gray-800 pt-4 pb-safe">
                  <Space className="w-full" direction="vertical" size="large">
                    <Button 
                      type="primary" 
                      onClick={applyFilters} 
                      block
                      loading={loading}
                      size="large"
                    >
                      {t('product:filters.apply')}
                      {getActiveFiltersCount() > 0 && ` (${getActiveFiltersCount()})`}
                    </Button>
                    <Button 
                      onClick={handleResetFilters} 
                      block
                      icon={<ClearOutlined />}
                      size="large"
                    >
                      {t('product:filters.clear')}
                    </Button>
                  </Space>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default ProductsPage;