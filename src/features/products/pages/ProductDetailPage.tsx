/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Typography,
  Breadcrumb,
  Tabs,
  Button,
  Rate,
  Divider,
  Badge,
  message,
  Spin,
  Tag,
  Modal,
  Tooltip,
} from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  LeftOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  QrcodeOutlined,
  SafetyOutlined,
  ReloadOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ExpandOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  FullscreenOutlined,
  StarFilled,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductBySlug, fetchProducts } from "@/store/slices/productSlice";
import { formatCurrency } from "@/utils/formatters";
import ProductsGrid from "../components/ProductsGrid";
import CartQuantityPicker from "@/components/cart/CartQuantityPicker";
import AddToCartButton from "@/components/cart/AddToCartButton";
import AddToCartAnimation from "@/components/cart/AddToCartAnimation";
import { useCart } from "@/contexts/CartContext";
import type { ProductVariantResponse } from "@/types/product.types";
import type { UUID } from "crypto";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Enhanced Image Gallery Component
const ProductImageGallery: React.FC<{
  images: any[];
  productName: string;
  onImageClick?: () => void;
}> = ({ images = [], productName, }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play functionalitys
  useEffect(() => {
    if (isAutoPlay && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setSelectedImage(prev => (prev + 1) % images.length);
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlay, images.length]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1);
    setIsImageLoading(true);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedImage(prev => (prev + 1) % images.length);
    setIsImageLoading(true);
  }, [images.length]);

  // Lightbox navigation
  const lightboxPrevious = useCallback(() => {
    setLightboxImage(prev => prev === 0 ? images.length - 1 : prev - 1);
  }, [images.length]);

  const lightboxNext = useCallback(() => {
    setLightboxImage(prev => (prev + 1) % images.length);
  }, [images.length]);

  // Mouse zoom functionality
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  }, [isZoomed]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        switch (e.key) {
          case 'ArrowLeft':
            lightboxPrevious();
            break;
          case 'ArrowRight':
            lightboxNext();
            break;
          case 'Escape':
            setIsLightboxOpen(false);
            break;
        }
      } else {
        switch (e.key) {
          case 'ArrowLeft':
            goToPrevious();
            break;
          case 'ArrowRight':
            goToNext();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isLightboxOpen, lightboxPrevious, lightboxNext, goToPrevious, goToNext]);

  const openLightbox = useCallback((index: number) => {
    setLightboxImage(index);
    setIsLightboxOpen(true);
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Text>No images available</Text>
      </div>
    );
  }

  const currentImage = images[selectedImage];

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative group">
        <div 
          ref={containerRef}
          className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 cursor-zoom-in group rounded-lg overflow-hidden shadow-lg"
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          {/* Loading Spinner */}
          <AnimatePresence>
            {isImageLoading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 dark:bg-gray-800/80"
              >
                <Spin size="large" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Image */}
          <motion.img
            key={selectedImage}
            src={currentImage.imageUrl}
            alt={currentImage.altText || productName}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : {}
            }
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: isZoomed ? 1.5 : 1 }}
            transition={{ duration: 0.3 }}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />

          {/* Primary Badge */}
          {currentImage.isPrimary && (
            <div className="absolute top-4 left-4 z-20">
              <Badge
                count={<StarFilled className="text-yellow-400" />}
                style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
              />
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
              >
                <LeftOutlined className="text-lg" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
              >
                <RightOutlined className="text-lg" />
              </motion.button>
            </>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <Tooltip title={isZoomed ? "Zoom Out" : "Zoom In"}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
              >
                <ZoomInOutlined />
              </motion.button>
            </Tooltip>

            <Tooltip title="View Fullscreen">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(selectedImage);
                }}
                className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
              >
                <ExpandOutlined />
              </motion.button>
            </Tooltip>
          </div>

          {/* Auto-play Controls */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <Tooltip title={isAutoPlay ? "Pause Slideshow" : "Start Slideshow"}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAutoPlay(!isAutoPlay);
                  }}
                  className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
                >
                  {isAutoPlay ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                </motion.button>
              </Tooltip>
            </div>
          )}

          {/* Progress Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Gallery ({images.length} images)
            </h4>
            {images.length > 6 && (
              <Button
                type="link"
                size="small"
                onClick={() => openLightbox(0)}
                className="p-0 h-auto"
              >
                View All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto">
            {images.map((image: any, index: number) => (
              <motion.div
                key={image.id}
                layoutId={`thumbnail-${image.id}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative cursor-pointer rounded-md overflow-hidden group ${
                  selectedImage === index
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'ring-1 ring-gray-200 dark:ring-gray-700'
                }`}
                onClick={() => {
                  setSelectedImage(index);
                  setIsImageLoading(true);
                }}
              >
                <div className="aspect-square">
                  <img
                    src={image.imageUrl}
                    alt={image.altText || `${productName} ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
                    loading="lazy"
                  />
                </div>

                {/* Primary indicator on thumbnail */}
                {image.isPrimary && (
                  <div className="absolute top-1 right-1">
                    <StarFilled className="text-yellow-400 text-xs drop-shadow-md" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                
                {/* Active indicator */}
                {selectedImage === index && (
                  <motion.div
                    layoutId="active-thumbnail"
                    className="absolute inset-0 bg-primary/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <Modal
        open={isLightboxOpen}
        onCancel={() => setIsLightboxOpen(false)}
        footer={null}
        width="90vw"
        style={{ maxWidth: '1200px', top: 20 }}
        className="lightbox-modal"
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      >
        <div className="relative">
          {/* Lightbox Image */}
          <div className="relative max-h-[80vh] flex items-center justify-center">
            <motion.img
              key={lightboxImage}
              src={images[lightboxImage]?.imageUrl}
              alt={images[lightboxImage]?.altText || productName}
              className="max-w-full max-h-full object-contain"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Lightbox Navigation */}
          {images.length > 1 && (
            <>
              <Button
                type="text"
                size="large"
                icon={<LeftOutlined />}
                onClick={lightboxPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full"
              />
              <Button
                type="text"
                size="large"
                icon={<RightOutlined />}
                onClick={lightboxNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full"
              />
            </>
          )}

          {/* Lightbox Info */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
            {lightboxImage + 1} / {images.length}
          </div>

          {/* Lightbox Controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Tooltip title="Fullscreen">
              <Button
                type="text"
                icon={<FullscreenOutlined />}
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen();
                  }
                }}
                className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full"
              />
            </Tooltip>
          </div>
        </div>

        {/* Lightbox Thumbnail Strip */}
        {images.length > 1 && (
          <div className="mt-4 flex justify-center">
            <div className="flex gap-2 max-w-full overflow-x-auto p-2">
              {images.map((image: any, index: number) => (
                <motion.div
                  key={image.id}
                  whileHover={{ scale: 1.1 }}
                  className={`flex-shrink-0 w-16 h-16 rounded cursor-pointer overflow-hidden ${
                    lightboxImage === index
                      ? 'ring-2 ring-primary'
                      : 'ring-1 ring-gray-300'
                  }`}
                  onClick={() => setLightboxImage(index)}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText || `${productName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .lightbox-modal .ant-modal-content {
          background: transparent;
          box-shadow: none;
        }
        
        .lightbox-modal .ant-modal-body {
          padding: 0;
        }
        
        .lightbox-modal .ant-modal-close {
          color: white;
          top: 16px;
          right: 16px;
        }
        
        .lightbox-modal .ant-modal-close:hover {
          color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(["product", "common", "cart"]);
  const dispatch = useAppDispatch();

  const { currentProduct, products, loading, error } = useAppSelector(
    (state) => state.products
  );
  const { addToCart } = useCart();

  // Refs for animation
  const productImageRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLDivElement>(null);

  // Component state
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [wishListed, setWishListed] = useState(false);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantResponse | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  // Get the current price (either variant price or product price)
  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return currentProduct?.price || 0;
  };

  // Get stock quantity (either variant or product)
  const getStockQuantity = () => {
    if (selectedVariant) {
      return selectedVariant.stockQuantity;
    }
    return currentProduct?.stockQuantity || 0;
  };

  // Check if product is in stock
  const isInStock = () => {
    return getStockQuantity() > 0;
  };

  // Handle quantity change
  const handleQuantityChange = (value: number) => {
    setQuantity(value);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    // Only trigger the animation, no cart API call
    setShowAnimation(true);
  };

  // Handle animation complete
  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!currentProduct) return;
    
    if (!isInStock()) {
      message.error(t("product:product_details.out_of_stock"));
      return;
    }
    
    try {
      await addToCart({
        productId: currentProduct.id as UUID,
        variantId: selectedVariant?.id as UUID | undefined,
        quantity,
      });
      navigate("/checkout");
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error(t('cart:notifications.error_adding'));
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    setWishListed(!wishListed);

    if (!wishListed) {
      message.success(t("cart:notifications.added_to_wishlist"));
    } else {
      message.info(t("cart:notifications.removed_from_wishlist"));
    }
  };

  // Handle variant selection
  const handleVariantSelect = (variant: ProductVariantResponse) => {
    setSelectedVariant(variant);
    if (variant.stockQuantity < quantity) {
      setQuantity(Math.max(1, variant.stockQuantity));
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: currentProduct?.name || "",
          text: currentProduct?.shortDescription || "",
          url: window.location.href,
        })
        .catch(() => message.info("Share canceled"));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => message.success("Link copied to clipboard!"))
        .catch(() => message.error("Failed to copy link"));
    }
  };

  // Load product data on component mount
  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
  }, [dispatch, slug]);

  // Load related products
  useEffect(() => {
    if (currentProduct?.category?.id) {
      dispatch(
        fetchProducts({
          categoryId: currentProduct.category.id,
          size: 4,
        })
      );
    }
  }, [dispatch, currentProduct]);

  // Reset selected variant and quantity when product changes
  useEffect(() => {
    setSelectedVariant(null);
    setQuantity(1);
  }, [currentProduct]);

  // If product is loading or not found
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-24 flex justify-center items-center">
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (error || !currentProduct) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <Title level={3} className="text-red-500 mb-4">
            {t("product:product_not_found")}
          </Title>
          <Button type="primary" onClick={() => navigate("/products")}>
            {t("common:actions.back_to_products")}
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Determine if the product is new (within 7 days)

  // Determine if the product is on sale
  const isOnSale = () => {
    return (
      currentProduct.originalPrice &&
      getCurrentPrice() < currentProduct.originalPrice
    );
  };

  // Calculate discount percentage
  const discountPercentage = () => {
    if (isOnSale() && currentProduct.originalPrice) {
      return Math.round(
        (1 - getCurrentPrice() / currentProduct.originalPrice) * 100
      );
    }
    return 0;
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Link to="/">{t("common:nav.home")}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/products">{t("common:nav.products")}</Link>
          </Breadcrumb.Item>
          {currentProduct.category && (
            <Breadcrumb.Item>
              <Link to={`/products?categoryId=${currentProduct.category.id}`}>
                {currentProduct.category.name}
              </Link>
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item>{currentProduct.name}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Product Detail Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-12">
          <Row gutter={[0, 0]}>
            {/* Product Images Section */}
            <Col xs={24} lg={12} className="p-0">
              <div ref={productImageRef} className="p-6">
                <ProductImageGallery
                  images={currentProduct.images || []}
                  productName={currentProduct.name}
                  onImageClick={handleAddToCart}
                />
              </div>
            </Col>

            {/* Product Info Section */}
            <Col xs={24} lg={12} className="p-6 lg:p-8">
              {/* Product Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Title level={2} className="mb-2 dark:text-white">
                  {currentProduct.name}
                </Title>
              </motion.div>

              {/* SKU & Categories */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-wrap items-center gap-2 mb-4"
              >
                {currentProduct.sku && (
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    SKU: {selectedVariant?.sku || currentProduct.sku}
                  </Text>
                )}

                {currentProduct.category && (
                  <Tag color="default">
                    <Link
                      to={`/products?categoryId=${currentProduct.category.id}`}
                    >
                      {currentProduct.category.name}
                    </Link>
                  </Tag>
                )}

                {currentProduct.region && (
                  <Tag color="processing">
                    <Link to={`/products?regionId=${currentProduct.region.id}`}>
                      {currentProduct.region.name}
                    </Link>
                  </Tag>
                )}
              </motion.div>

              {/* Ratings */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center mb-4"
              >
                <Rate disabled defaultValue={4.5} className="text-primary" />
                <Text className="ml-2 text-gray-500 dark:text-gray-400">
                  (24 {t("product:product_details.reviews")})
                </Text>
              </motion.div>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-6"
              >
                {isOnSale() ? (
                  <div className="flex items-center">
                    <Title level={3} className="text-primary m-0">
                      {formatCurrency(getCurrentPrice())}
                    </Title>
                    <Text
                      delete
                      className="ml-3 text-gray-500 dark:text-gray-400 text-lg"
                    >
                      {formatCurrency(currentProduct.originalPrice || 0)}
                    </Text>
                    <Badge
                      count={`-${discountPercentage()}%`}
                      style={{ backgroundColor: "#ff4d4f" }}
                      className="ml-4"
                    />
                  </div>
                ) : (
                  <Title level={3} className="text-primary m-0">
                    {formatCurrency(getCurrentPrice())}
                  </Title>
                )}
              </motion.div>

              {/* Short Description */}
              {currentProduct.shortDescription && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-6"
                >
                  <Paragraph className="text-gray-700 dark:text-gray-300">
                    {currentProduct.shortDescription}
                  </Paragraph>
                </motion.div>
              )}

              <Divider className="my-6" />

              {/* Variants */}
              {currentProduct.variants &&
                currentProduct.variants.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mb-6"
                  >
                    <Text strong className="block mb-3 dark:text-white">
                      {t("product:product_details.variants")}:
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {currentProduct.variants.map((variant) => (
                        <Badge.Ribbon
                          key={variant.id}
                          text={
                            !variant.active
                              ? t("product:product_card.sold_out")
                              : ""
                          }
                          color="red"
                          style={{
                            display: !variant.active ? "block" : "none",
                          }}
                        >
                          <Button
                            type={
                              selectedVariant?.id === variant.id
                                ? "primary"
                                : "default"
                            }
                            className={`min-w-[80px] ${
                              !variant.active && "opacity-60"
                            }`}
                            onClick={() => handleVariantSelect(variant)}
                            disabled={!variant.active}
                          >
                            {variant.name}
                          </Button>
                        </Badge.Ribbon>
                      ))}
                      {selectedVariant && (
                        <Button
                          type="text"
                          icon={<SwapOutlined />}
                          onClick={() => setSelectedVariant(null)}
                        >
                          {t("product:product_details.reset_variant")}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}

              {/* Quantity & Add to Cart */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-6"
              >
                <Text strong className="block mb-3 dark:text-white">
                  {t("product:product_details.quantity")}:
                </Text>
                <div className="flex items-center space-x-4">
                  <CartQuantityPicker
                    value={quantity}
                    min={1}
                    max={getStockQuantity()}
                    onChange={handleQuantityChange}
                    disabled={!isInStock()}
                    size="middle"
                  />

                  <div
                    className={`${
                      isInStock() ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isInStock() ? (
                      <>
                        <CheckCircleOutlined className="mr-1" />
                        {getStockQuantity() > 10
                          ? t("product:product_details.in_stock")
                          : `${getStockQuantity()} ${t(
                              "product:product_details.left_in_stock"
                            )}`}
                      </>
                    ) : (
                      <>
                        <ClockCircleOutlined className="mr-1" />
                        {t("product:product_details.out_of_stock")}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <div ref={cartButtonRef}>
                  <AddToCartButton
                    product={currentProduct}
                    variant={selectedVariant}
                    quantity={quantity}
                    size="large"
                    showText={true}
                    onSuccess={handleAddToCart}
                  />
                </div>

                <Button
                  type="default"
                  size="large"
                  onClick={handleBuyNow}
                  disabled={!isInStock()}
                  className="bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600 hover:text-white flex items-center"
                >
                  {t("common:actions.buy_now")}
                </Button>

                <Button
                  type="default"
                  size="large"
                  icon={
                    wishListed ? (
                      <HeartFilled className="text-red-500" />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  onClick={handleWishlistToggle}
                  className={`flex items-center ${
                    wishListed ? "border-red-500 text-red-500" : ""
                  }`}
                >
                  {t("product:product_details.add_to_wishlist")}
                </Button>

                <Button
                  type="text"
                  size="large"
                  icon={<ShareAltOutlined />}
                  onClick={handleShare}
                  className="flex items-center"
                >
                  {t("product:product_details.share")}
                </Button>
              </motion.div>

              {/* Product features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <SafetyOutlined className="text-primary text-xl mr-3" />
                    <div>
                      <Text strong className="block dark:text-white">
                        {t("common:features.quality.title")}
                      </Text>
                      <Text className="text-sm text-gray-500 dark:text-gray-400">
                        {t("common:features.quality.description")}
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <ReloadOutlined className="text-primary text-xl mr-3" />
                    <div>
                      <Text strong className="block dark:text-white">
                        {t("common:features.returns.title")}
                      </Text>
                      <Text className="text-sm text-gray-500 dark:text-gray-400">
                        {t("common:features.returns.description")}
                      </Text>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* QR Code if available */}
              {currentProduct.qrCode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center">
                    <QrcodeOutlined className="text-primary text-2xl mr-3" />
                    <div>
                      <Text strong className="block dark:text-white">
                        {t("product:product_details.scan_for_authenticity")}
                      </Text>
                      <Text className="text-sm text-gray-500 dark:text-gray-400">
                        {t("product:product_details.scan_instructions")}
                      </Text>
                    </div>
                    {currentProduct.qrCode.qrImageUrl && (
                      <img
                        src={currentProduct.qrCode.qrImageUrl}
                        alt="QR Code"
                        className="ml-auto w-16 h-16"
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </Col>
          </Row>
        </div>

        {/* Product Detail Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-12">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="px-6 pt-4"
            tabBarGutter={32}
          >
            <TabPane
              tab={t("product:product_details.description")}
              key="description"
            >
              <div className="p-6">
                {currentProduct.description ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentProduct.description,
                    }}
                    className="prose max-w-none dark:prose-invert prose-headings:text-gray-800 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300"
                  />
                ) : (
                  <Text className="text-gray-500 dark:text-gray-400 italic">
                    {t("product:product_details.no_description")}
                  </Text>
                )}
              </div>
            </TabPane>
            <TabPane tab={t("product:product_details.reviews")} key="reviews">
              <div className="p-6">
                <Text className="text-gray-500 dark:text-gray-400 italic">
                  {t("product:product_details.no_reviews")}
                </Text>
              </div>
            </TabPane>
            <TabPane tab={t("product:product_details.shipping")} key="shipping">
              <div className="p-6">
                <Title level={4}>
                  {t("product:product_details.shipping_info")}
                </Title>
                <Paragraph className="text-gray-700 dark:text-gray-300">
                  {t("product:product_details.shipping_text")}
                </Paragraph>

                <Title level={4} className="mt-6">
                  {t("product:product_details.returns_info")}
                </Title>
                <Paragraph className="text-gray-700 dark:text-gray-300">
                  {t("product:product_details.returns_text")}
                </Paragraph>
              </div>
            </TabPane>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <Title level={3} className="m-0 dark:text-white">
              {t("product:product_details.related_products")}
            </Title>
          </div>

          <ProductsGrid
            products={products
              .filter((p) => p.id !== currentProduct.id)
              .slice(0, 4)}
            loading={loading}
            cols={4}
            onAddToCart={handleAddToCart}
            onAddToWishlist={(_product) => setWishListed(!wishListed)}
          />
        </div>
      </div>

      {/* Cart Animation */}
      <AddToCartAnimation
        sourceRef={productImageRef as React.RefObject<HTMLElement>}
        destinationRef={cartButtonRef as React.RefObject<HTMLElement>}
        imageUrl={currentProduct.images?.[0]?.imageUrl}
        animate={showAnimation}
        onComplete={handleAnimationComplete}
      />
    </MainLayout>
  );
};

export default ProductDetailPage;