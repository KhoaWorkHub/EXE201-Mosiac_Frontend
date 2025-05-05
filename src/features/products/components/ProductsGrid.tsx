import React from 'react';
import { Row, Col, Empty, Spin } from 'antd';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { ProductResponse } from '@/types/product.types';

interface ProductsGridProps {
  products: ProductResponse[];
  loading?: boolean;
  cols?: number;
  gutter?: [number, number];
  onAddToCart?: (product: ProductResponse) => void;
  onAddToWishlist?: (product: ProductResponse) => void;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  loading = false,
  cols = 4, // Default to 4 columns
  gutter = [16, 24], // Default gutter
  onAddToCart,
  onAddToWishlist
}) => {
  // Calculate responsive columns
  const getResponsiveCols = () => {
    let xs = 1;  // Mobile: 1 column
    let sm = 2;  // Tablet: 2 columns
    let md = 3;  // Small desktop: 3 columns
    let lg = 4;  // Desktop: 4 columns
    
    if (cols === 3) {
      xs = 1;
      sm = 2;
      md = 2;
      lg = 3;
    } else if (cols === 2) {
      xs = 1;
      sm = 2;
      md = 2;
      lg = 2;
    } else if (cols === 1) {
      xs = 1;
      sm = 1;
      md = 1;
      lg = 1;
    }
    
    return { xs, sm, md, lg };
  };
  
  const responsiveCols = getResponsiveCols();

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" />
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="py-12">
        <Empty description="No products found" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Row gutter={gutter}>
        {products.map(product => (
          <Col
            key={product.id}
            xs={24 / responsiveCols.xs}
            sm={24 / responsiveCols.sm}
            md={24 / responsiveCols.md}
            lg={24 / responsiveCols.lg}
            className="mb-6"
          >
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
            />
          </Col>
        ))}
      </Row>
    </motion.div>
  );
};

export default ProductsGrid;