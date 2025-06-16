import React from 'react';
import { Card, Tag, Typography, Button, Rate, Tooltip, Badge } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, HeartOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { formatVND } from '@/utils/formatters'; // ✅ Thay đổi từ formatCurrency sang formatVND
import type { ProductResponse } from '@/types/product.types';

const { Title, Text } = Typography;

interface ProductCardProps {
  product: ProductResponse;
  onAddToCart?: (product: ProductResponse) => void;
  onAddToWishlist?: (product: ProductResponse) => void;
  priceFormatter?: (amount: number) => string; // ✅ Thêm optional formatter prop
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onAddToWishlist,
  priceFormatter = formatVND // ✅ Default sử dụng formatVND
}) => {
  const { t } = useTranslation(['product', 'common']);
  
  const primaryImage = product.images?.find((img) => img.isPrimary)?.imageUrl || 
                      product.images?.[0]?.imageUrl || 
                      '/placeholder-product.jpg';
                     
  const isNew = () => {
    if (!product.createdAt) return false;
    const createdDate = new Date(product.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };
  
  const isOnSale = () => {
    return product.originalPrice && product.price < product.originalPrice;
  };
  
  const discountPercentage = () => {
    if (isOnSale() && product.originalPrice) {
      return Math.round((1 - product.price / product.originalPrice) * 100);
    }
    return 0;
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToWishlist) onAddToWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Badge.Ribbon 
        text={isOnSale() ? `${discountPercentage()}% ${t('product:product_card.off')}` : ''} 
        color="red"
        style={{ display: isOnSale() ? 'block' : 'none' }}
      >
        <Card 
          hoverable
          className="overflow-hidden rounded-lg border-gray-200 h-full transition-shadow duration-300 hover:shadow-lg"
          styles={{ body: { padding: '16px' } }}
          cover={
            <div className="relative h-64 bg-gray-100 group">
              <Link to={`/products/${product.slug}`} className="block h-full">
                <img 
                  alt={product.name} 
                  src={primaryImage} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </Link>
              {isNew() && (
                <div className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded z-10">
                  {t('product:product_card.new')}
                </div>
              )}
              {(product.stockQuantity <= 0) && (
                <div className="absolute top-3 right-3 bg-gray-700 text-white text-xs px-2 py-1 rounded z-10">
                  {t('product:product_card.sold_out')}
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                <Tooltip title={t('common:actions.view')}>
                  <Link to={`/products/${product.slug}`}>
                    <Button shape="circle" icon={<EyeOutlined />} className="bg-white hover:bg-primary hover:text-white transition-colors" />
                  </Link>
                </Tooltip>
                <Tooltip title={t('common:actions.add_to_cart')}>
                  <Button 
                    shape="circle" 
                    icon={<ShoppingCartOutlined />} 
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity <= 0}
                    className="bg-white hover:bg-primary hover:text-white transition-colors"
                  />
                </Tooltip>
                <Tooltip title={t('product:product_details.add_to_wishlist')}>
                  <Button 
                    shape="circle" 
                    icon={<HeartOutlined />} 
                    onClick={handleAddToWishlist}
                    className="bg-white hover:bg-primary hover:text-white transition-colors"
                  />
                </Tooltip>
              </div>
            </div>
          }
        >
          <div className="mb-2 flex flex-wrap gap-1">
            {product.category && (
              <Tag color="default">
                <Link to={`/products?categoryId=${product.category.id}`} onClick={(e) => e.stopPropagation()}>
                  {product.category.name}
                </Link>
              </Tag>
            )}
            {product.region && (
              <Tag color="processing">
                <Link to={`/products?regionId=${product.region.id}`} onClick={(e) => e.stopPropagation()}>
                  {product.region.name}
                </Link>
              </Tag>
            )}
          </div>
          <Link to={`/products/${product.slug}`}>
            <Title level={5} className="mb-1 text-gray-800 dark:text-gray-100 line-clamp-2">
              {product.name}
            </Title>
          </Link>
          <div className="flex items-center mb-2">
            <Rate disabled defaultValue={4.5} style={{ fontSize: '12px' }} />
            <span className="text-xs text-gray-500 ml-1">({Math.floor(Math.random() * 50) + 10})</span>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div>
              {isOnSale() ? (
                <div className="flex items-center">
                  <Text className="text-primary font-bold">
                    {priceFormatter(product.price)} {/* ✅ Thay đổi từ formatCurrency sang priceFormatter */}
                  </Text>
                  <Text className="text-gray-400 line-through text-sm ml-2">
                    {priceFormatter(product.originalPrice || 0)} {/* ✅ Thay đổi từ formatCurrency sang priceFormatter */}
                  </Text>
                </div>
              ) : (
                <Text className="text-primary font-bold">
                  {priceFormatter(product.price)} {/* ✅ Thay đổi từ formatCurrency sang priceFormatter */}
                </Text>
              )}
            </div>
            <div className="text-xs">
              {product.stockQuantity > 10 ? (
                <span className="text-green-600">{t('product:product_details.in_stock')}</span>
              ) : product.stockQuantity > 0 ? (
                <span className="text-orange-500">{t('product:product_details.limited_stock')}</span>
              ) : (
                <span className="text-red-500">{t('product:product_details.out_of_stock')}</span>
              )}
            </div>
          </div>
        </Card>
      </Badge.Ribbon>
    </motion.div>
  );
};

export default ProductCard;