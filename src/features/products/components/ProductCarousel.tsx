import React, { useRef, useState, useEffect } from 'react';
import { Carousel, Button, Spin, Empty } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { isMobile } from 'react-device-detect';
import type { ProductResponse } from '@/types/product.types';

interface ProductCarouselProps {
  products: ProductResponse[];
  loading?: boolean;
  autoplay?: boolean;
  slidesToShow?: number;
  onAddToCart?: (product: ProductResponse) => void;
  onAddToWishlist?: (product: ProductResponse) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  loading = false,
  autoplay = true,
  slidesToShow = 4,
  onAddToCart,
  onAddToWishlist
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const carouselRef = useRef<any>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [responsiveSlides, setResponsiveSlides] = useState(slidesToShow);

  // Update responsive slides based on window size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setResponsiveSlides(1); // Mobile
      } else if (width < 768) {
        setResponsiveSlides(2); // Tablet
      } else if (width < 1024) {
        setResponsiveSlides(3); // Small desktop
      } else {
        setResponsiveSlides(slidesToShow); // Desktop
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slidesToShow]);

  const next = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const prev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const handleSlideChange = (current: number) => {
    setActiveSlide(current);
  };

  // Carousel settings
  const settings = {
    dots: true,
    infinite: products.length > responsiveSlides,
    speed: 500,
    slidesToShow: responsiveSlides,
    slidesToScroll: 1,
    autoplay: autoplay && !isMobile,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    afterChange: handleSlideChange,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
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

  // If we have only one product or the same number as slidesToShow, no need for carousel
  if (products.length === 1 || products.length <= responsiveSlides) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id}>
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="product-carousel relative group">
      {/* Navigation buttons */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
        >
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            onClick={prev}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
        >
          <Button
            shape="circle"
            icon={<RightOutlined />}
            onClick={next}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md"
          />
        </motion.div>
      </AnimatePresence>

      {/* Carousel */}
      <div className="px-8">
        <Carousel ref={carouselRef} {...settings}>
          {products.map(product => (
            <div key={product.id} className="px-2 py-4">
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mt-4">
        <div className="flex space-x-1">
          {Array.from({ length: Math.ceil(products.length / responsiveSlides) }).map((_, index) => (
            <motion.div
              key={index}
              className={`h-1 rounded-full ${
                Math.floor(activeSlide / responsiveSlides) === index
                  ? 'bg-primary w-8'
                  : 'bg-gray-300 dark:bg-gray-700 w-4'
              } transition-all duration-300`}
              animate={{
                width: Math.floor(activeSlide / responsiveSlides) === index ? 32 : 16,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;