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
  Slider, 
  Collapse, 
  Tag, 
  Pagination, 
  Divider, 
  Spin, 
  Badge, 
  Empty, 
  message 
} from 'antd';
import { 
  FilterOutlined, 
  SearchOutlined, 
  CloseCircleOutlined, 
  SortAscendingOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts, setFilters, resetFilters } from '@/store/slices/productSlice';
import ProductsGrid from '../components/ProductsGrid';
import type { ProductResponse } from '@/types/product.types';
import { useCart } from '@/contexts/CartContext';
import type { UUID } from 'crypto';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const ProductsPage: React.FC = () => {
  const { t } = useTranslation(['product', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { products, loading, pagination, filters } = useAppSelector(state => state.products);
  
  // Local UI state
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<ProductFilters>({
    page: 0,
    size: 12,
    sort: 'createdAt,desc',
    ...filters // Override defaults with any defined values from filters
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  // Define type for filters
  interface ProductFilters {
    page: number;
    size: number;
    sort: string;
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    active?: boolean;
    categoryId?: string;
    regionId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // For any additional dynamic properties
  }
  
  // Parse query parameters on mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newFilters: ProductFilters = {
      page: 0,
      size: 12,
      sort: 'createdAt,desc',
      // Add other default filter values as needed
    };
    
    queryParams.forEach((value, key) => {
      if (key === 'page') {
        newFilters.page = parseInt(value) - 1; // Convert to 0-based index
      } else if (key === 'size') {
        newFilters.size = parseInt(value);
      } else if (key === 'minPrice') {
        newFilters.minPrice = parseFloat(value);
      } else if (key === 'maxPrice') {
        newFilters.maxPrice = parseFloat(value);
      } else if (key === 'featured') {
        newFilters.featured = value === 'true';
      } else if (key === 'active') {
        newFilters.active = value === 'true';
      } else {
        newFilters[key] = value;
      }
    });
    
    // Update price range based on query parameters or set to default
    if (newFilters.minPrice !== undefined && newFilters.maxPrice !== undefined) {
      setPriceRange([newFilters.minPrice, newFilters.maxPrice]);
    } else {
      setPriceRange([0, 1000]); // Default price range
    }
    
    // Update local filters
    setLocalFilters(newFilters);
    
    // Dispatch filters to Redux
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
    setPriceRange([0, 1000]);
    navigate('/products');
    setShowFilters(false);
  };
  
  // Update URL parameters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateURLParams = (updatedFilters: any) => {
    const searchParams = new URLSearchParams();
    
    // Add all filters to URL
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'page') {
          // Convert 0-based index to 1-based for URL
          searchParams.append(key, String(Number(value) + 1));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    
    // Update URL without reloading page
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
  
  // Handle price range change
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    setLocalFilters(prev => ({ 
      ...prev, 
      minPrice: value[0], 
      maxPrice: value[1],
      page: 0
    }));
  };
  
  // Add/remove active filter
  const toggleActiveFilter = (active: boolean) => {
    const updatedFilters = { 
      ...filters, 
      active: filters.active === active ? undefined : active,
      page: 0 
    };
    dispatch(setFilters(updatedFilters));
    updateURLParams(updatedFilters);
  };
  
  // Add/remove featured filter
  const toggleFeaturedFilter = (featured: boolean) => {
    const updatedFilters = { 
      ...filters, 
      featured: filters.featured === featured ? undefined : featured,
      page: 0 
    };
    dispatch(setFilters(updatedFilters));
    updateURLParams(updatedFilters);
  };
  
  const { addToCart } = useCart();
  
  // Handle add to cart
const handleAddToCart = async (product: ProductResponse) => {
  try {
    await addToCart({
      productId: product.id as UUID,
      quantity: 1,
    }, product);
    // The notification will be shown by the CartNotification component
  } catch (error) {
    console.error('Failed to add to cart:', error);
    message.error(t('cart:notifications.error_adding'));
  }
};
  
  // Handle add to wishlist (placeholder)
  const handleAddToWishlist = (product: ProductResponse) => {
    message.success(`${product.name} added to wishlist!`);
  };

  // Active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.keyword) count++;
    if (filters.categoryId) count++;
    if (filters.regionId) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.featured !== undefined) count++;
    if (filters.active !== undefined) count++;
    return count;
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          className="mb-6"
          items={[
            { title: t('common:nav.home'), href: '/' },
            { title: t('common:nav.products') },
          ]}
        />
        
        <Row gutter={[24, 24]}>
          {/* Desktop Filters - Left Sidebar */}
          <Col xs={0} lg={6} className="hidden lg:block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <Title level={4} className="mb-4 dark:text-white">
                {t('product:filters.filter')}
              </Title>
              
              {/* Search */}
              <div className="mb-6">
                <Text strong className="block mb-2 dark:text-white">
                  {t('common:search.title')}
                </Text>
                <Input 
                  placeholder={t('common:search.placeholder')}
                  prefix={<SearchOutlined />}
                  value={localFilters.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  onPressEnter={() => applyFilters()}
                />
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <Text strong className="block mb-2 dark:text-white">
                  {t('product:filters.price_range')}
                </Text>
                <Slider 
                  range 
                  min={0} 
                  max={1000} 
                  step={10}
                  value={priceRange}
                  onChange={(value) => handlePriceRangeChange(value as [number, number])}
                  tooltip={{
                    formatter: (value) => `$${value}`,
                  }}
                />
                <div className="flex justify-between mt-2">
                  <Text className="text-gray-500 dark:text-gray-400">
                    ${priceRange[0]}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400">
                    ${priceRange[1]}
                  </Text>
                </div>
              </div>
              
              {/* Categories - Placeholder, would load from API */}
              <div className="mb-6">
                <Text strong className="block mb-2 dark:text-white">
                  {t('product:filters.categories')}
                </Text>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="cat-womens" 
                      className="mr-2" 
                      checked={localFilters.categoryId === '123'}
                      onChange={(e) => handleFilterChange('categoryId', e.target.checked ? '123' : undefined)}
                    />
                    <label htmlFor="cat-womens" className="dark:text-gray-300">
                      {t('product:categories.womens')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="cat-mens" 
                      className="mr-2" 
                      checked={localFilters.categoryId === '456'}
                      onChange={(e) => handleFilterChange('categoryId', e.target.checked ? '456' : undefined)}
                    />
                    <label htmlFor="cat-mens" className="dark:text-gray-300">
                      {t('product:categories.mens')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="cat-accessories" 
                      className="mr-2" 
                      checked={localFilters.categoryId === '789'}
                      onChange={(e) => handleFilterChange('categoryId', e.target.checked ? '789' : undefined)}
                    />
                    <label htmlFor="cat-accessories" className="dark:text-gray-300">
                      {t('product:categories.accessories')}
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Regions - Placeholder, would load from API */}
              <div className="mb-6">
                <Text strong className="block mb-2 dark:text-white">
                  {t('product:filters.regions')}
                </Text>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="region-north" 
                      className="mr-2" 
                      checked={localFilters.regionId === '111'}
                      onChange={(e) => handleFilterChange('regionId', e.target.checked ? '111' : undefined)}
                    />
                    <label htmlFor="region-north" className="dark:text-gray-300">
                      {t('product:regions.north')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="region-central" 
                      className="mr-2" 
                      checked={localFilters.regionId === '222'}
                      onChange={(e) => handleFilterChange('regionId', e.target.checked ? '222' : undefined)}
                    />
                    <label htmlFor="region-central" className="dark:text-gray-300">
                      {t('product:regions.central')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="region-south" 
                      className="mr-2" 
                      checked={localFilters.regionId === '333'}
                      onChange={(e) => handleFilterChange('regionId', e.target.checked ? '333' : undefined)}
                    />
                    <label htmlFor="region-south" className="dark:text-gray-300">
                      {t('product:regions.south')}
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Special Filters */}
              <div className="mb-6">
                <Text strong className="block mb-2 dark:text-white">
                  {t('product:filters.special')}
                </Text>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="featured" 
                      className="mr-2" 
                      checked={localFilters.featured === true}
                      onChange={(e) => handleFilterChange('featured', e.target.checked ? true : undefined)}
                    />
                    <label htmlFor="featured" className="dark:text-gray-300">
                      {t('product:filters.featured_only')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="in-stock" 
                      className="mr-2" 
                      checked={localFilters.active === true}
                      onChange={(e) => handleFilterChange('active', e.target.checked ? true : undefined)}
                    />
                    <label htmlFor="in-stock" className="dark:text-gray-300">
                      {t('product:filters.in_stock_only')}
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button type="primary" onClick={applyFilters} className="flex-1">
                  {t('product:filters.apply')}
                </Button>
                <Button onClick={handleResetFilters} className="flex-1">
                  {t('product:filters.clear')}
                </Button>
              </div>
            </div>
          </Col>
          
          {/* Main Content */}
          <Col xs={24} lg={18}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                  <Title level={3} className="mb-1 dark:text-white">
                    {filters.keyword ? 
                      t('product:search_results_for', { keyword: filters.keyword }) : 
                      t('product:categories.all')}
                  </Title>
                  <Text className="text-gray-500 dark:text-gray-400">
                    {pagination.totalElements} {t('product:products_found')}
                  </Text>
                </div>
                
                <div className="flex space-x-3 mt-4 sm:mt-0">
                  {/* Mobile Filter Button */}
                  <div className="lg:hidden">
                    <Badge count={getActiveFiltersCount()} offset={[-5, 5]}>
                      <Button 
                        icon={<FilterOutlined />} 
                        onClick={() => setShowFilters(true)}
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
                      style={{ width: 180 }}
                    >
                      <Option value="createdAt,desc">{t('product:filters.newest')}</Option>
                      <Option value="price,asc">{t('product:filters.price_low_high')}</Option>
                      <Option value="price,desc">{t('product:filters.price_high_low')}</Option>
                      <Option value="viewCount,desc">{t('product:filters.popularity')}</Option>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Active Filters */}
              {getActiveFiltersCount() > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Text strong className="dark:text-white">
                      {t('product:active_filters')}:
                    </Text>
                    
                    {filters.keyword && (
                      <Tag 
                        closable 
                        onClose={() => {
                          const updatedFilters = { ...filters, keyword: undefined, page: 0 };
                          dispatch(setFilters(updatedFilters));
                          updateURLParams(updatedFilters);
                        }}
                      >
                        {t('product:search')}: {filters.keyword}
                      </Tag>
                    )}
                    
                    {filters.categoryId && (
                      <Tag 
                        color="blue" 
                        closable 
                        onClose={() => {
                          const updatedFilters = { ...filters, categoryId: undefined, page: 0 };
                          dispatch(setFilters(updatedFilters));
                          updateURLParams(updatedFilters);
                        }}
                      >
                        {t('product:category')}: {filters.categoryId}
                      </Tag>
                    )}
                    
                    {filters.regionId && (
                      <Tag 
                        color="green" 
                        closable 
                        onClose={() => {
                          const updatedFilters = { ...filters, regionId: undefined, page: 0 };
                          dispatch(setFilters(updatedFilters));
                          updateURLParams(updatedFilters);
                        }}
                      >
                        {t('product:region')}: {filters.regionId}
                      </Tag>
                    )}
                    
                    {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                      <Tag 
                        color="orange" 
                        closable 
                        onClose={() => {
                          const updatedFilters = { 
                            ...filters, 
                            minPrice: undefined, 
                            maxPrice: undefined,
                            page: 0 
                          };
                          dispatch(setFilters(updatedFilters));
                          updateURLParams(updatedFilters);
                          setPriceRange([0, 1000]);
                        }}
                      >
                        {t('product:price')}: ${filters.minPrice || 0} - ${filters.maxPrice || 1000}
                      </Tag>
                    )}
                    
                    {filters.featured !== undefined && (
                      <Tag 
                        color="purple" 
                        closable 
                        onClose={() => toggleFeaturedFilter(true)}
                      >
                        {t('product:featured')}
                      </Tag>
                    )}
                    
                    {filters.active !== undefined && (
                      <Tag 
                        color="cyan" 
                        closable 
                        onClose={() => toggleActiveFilter(true)}
                      >
                        {t('product:in_stock')}
                      </Tag>
                    )}
                    
                    <Button 
                      type="link" 
                      icon={<CloseCircleOutlined />} 
                      onClick={handleResetFilters}
                      className="text-red-500"
                    >
                      {t('product:filters.clear_all')}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Product Grid */}
              {loading ? (
                <div className="py-12 flex justify-center">
                  <Spin size="large" />
                </div>
              ) : products.length > 0 ? (
                <ProductsGrid 
                  products={products} 
                  cols={3}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              ) : (
                <Empty
                  description={t('product:no_products_found')}
                  className="py-12"
                />
              )}
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    current={pagination.currentPage + 1} // Convert 0-based to 1-based
                    total={pagination.totalElements}
                    pageSize={pagination.pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                  />
                </div>
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
              transition={{ type: 'tween' }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <Title level={4} className="m-0 dark:text-white">
                  {t('product:filters.filter')}
                </Title>
                <Button 
                  type="text" 
                  icon={<CloseCircleOutlined />} 
                  onClick={() => setShowFilters(false)}
                />
              </div>
              
              <Divider />
              
              {/* Mobile Filters Content */}
              <Collapse defaultActiveKey={['1', '2', '3']} className="bg-transparent border-0">
                {/* Search */}
                <Panel 
                  header={<Text strong className="dark:text-white">{t('common:search.title')}</Text>} 
                  key="1" 
                  className="mb-2"
                >
                  <Input 
                    placeholder={t('common:search.placeholder')}
                    prefix={<SearchOutlined />}
                    value={localFilters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    className="mb-4"
                  />
                </Panel>
                
                {/* Price Range */}
                <Panel 
                  header={<Text strong className="dark:text-white">{t('product:filters.price_range')}</Text>} 
                  key="2" 
                  className="mb-2"
                >
                  <Slider 
                    range 
                    min={0} 
                    max={1000} 
                    step={10}
                    value={priceRange}
                    onChange={(value) => handlePriceRangeChange(value as [number, number])}
                    tooltip={{
                      formatter: (value) => `$${value}`,
                    }}
                    className="mb-4"
                  />
                  <div className="flex justify-between mb-4">
                    <Text className="text-gray-500 dark:text-gray-400">
                      ${priceRange[0]}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400">
                      ${priceRange[1]}
                    </Text>
                  </div>
                </Panel>
                
                {/* Categories */}
                <Panel 
                  header={<Text strong className="dark:text-white">{t('product:filters.categories')}</Text>} 
                  key="3" 
                  className="mb-2"
                >
                  <div className="flex flex-col space-y-2 mb-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="m-cat-womens" 
                        className="mr-2" 
                        checked={localFilters.categoryId === '123'}
                        onChange={(e) => handleFilterChange('categoryId', e.target.checked ? '123' : undefined)}
                      />
                      <label htmlFor="m-cat-womens" className="dark:text-gray-300">
                        {t('product:categories.womens')}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="m-cat-mens" 
                        className="mr-2" 
                        checked={localFilters.categoryId === '456'}
                        onChange={(e) => handleFilterChange('categoryId', e.target.checked ? '456' : undefined)}
                      />
                      <label htmlFor="m-cat-mens" className="dark:text-gray-300">
                        {t('product:categories.mens')}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="m-cat-accessories" 
                        className="mr-2" 
                        checked={localFilters.categoryId === '789'}
                        onChange={(e) => handleFilterChange('categoryId', e.target.checked ? '789' : undefined)}
                      />
                      <label htmlFor="m-cat-accessories" className="dark:text-gray-300">
                        {t('product:categories.accessories')}
                      </label>
                    </div>
                  </div>
                </Panel>
                
                {/* Regions */}
                <Panel 
                  header={<Text strong className="dark:text-white">{t('product:filters.regions')}</Text>} 
                  key="4" 
                  className="mb-2"
                >
                  <div className="flex flex-col space-y-2 mb-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="m-region-north" 
                        className="mr-2" 
                        checked={localFilters.regionId === '111'}
                        onChange={(e) => handleFilterChange('regionId', e.target.checked ? '111' : undefined)}
                      />
                      <label htmlFor="m-region-north" className="dark:text-gray-300">
                        {t('product:regions.north')}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="m-region-central" 
                        className="mr-2" 
                        checked={localFilters.regionId === '222'}
                        onChange={(e) => handleFilterChange('regionId', e.target.checked ? '222' : undefined)}
                      />
                      <label htmlFor="m-region-central" className="dark:text-gray-300">
                        {t('product:regions.central')}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="m-region-south" 
                        className="mr-2" 
                        checked={localFilters.regionId === '333'}
                        onChange={(e) => handleFilterChange('regionId', e.target.checked ? '333' : undefined)}
                      />
                      <label htmlFor="m-region-south" className="dark:text-gray-300">
                        {t('product:regions.south')}
                      </label>
                    </div>
                  </div>
                </Panel>
                
                {/* Special Filters */}
                <Panel 
                  header={<Text strong className="dark:text-white">{t('product:filters.special')}</Text>} 
                  key="5" 
                  className="mb-2"
                >
                  <div className="flex flex-col space-y-2 mb-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="m-featured" 
                        className="mr-2" 
                        checked={localFilters.featured === true}
                        onChange={(e) => handleFilterChange('featured', e.target.checked ? true : undefined)}
                      />
                      <label htmlFor="m-featured" className="dark:text-gray-300">
                        {t('product:filters.featured_only')}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="m-in-stock" 
                        className="mr-2" 
                        checked={localFilters.active === true}
                        onChange={(e) => handleFilterChange('active', e.target.checked ? true : undefined)}
                      />
                      <label htmlFor="m-in-stock" className="dark:text-gray-300">
                        {t('product:filters.in_stock_only')}
                      </label>
                    </div>
                  </div>
                </Panel>
              </Collapse>
              
              <div className="mt-6 sticky bottom-0 bg-white dark:bg-gray-800 pt-4 pb-2">
                <div className="flex space-x-3">
                  <Button onClick={handleResetFilters} className="flex-1">
                    {t('product:filters.clear')}
                  </Button>
                  <Button type="primary" onClick={applyFilters} className="flex-1">
                    {t('product:filters.apply')}
                  </Button>
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