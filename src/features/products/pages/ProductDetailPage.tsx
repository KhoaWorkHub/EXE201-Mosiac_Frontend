import React, { useEffect, useState, useRef } from "react";
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
  const [selectedImage, setSelectedImage] = useState(0);
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
  const handleAddToCart = async () => {
    if (!currentProduct) return;

    if (!isInStock()) {
      message.error(t("product:product_details.out_of_stock"));
      return;
    }

    try {
      // Start animation
      setShowAnimation(true);

      // Add to cart in the backend
      await addToCart({
        productId: currentProduct.id as UUID,
        variantId: selectedVariant?.id as UUID | undefined,
        quantity,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error(t("cart:notifications.error_adding"));
    }
  };

  // Handle animation complete
  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  // Handle buy now
  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/checkout");
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
    setSelectedImage(0);
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
  const isNew = () => {
    if (!currentProduct.createdAt) return false;
    const createdDate = new Date(currentProduct.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

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
              <div className="relative" ref={productImageRef}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="aspect-square"
                  >
                    {/* Main Product Image */}
                    <img
                      src={
                        currentProduct.images?.[selectedImage]?.imageUrl ||
                        "/placeholder-product.jpg"
                      }
                      alt={
                        currentProduct.images?.[selectedImage]?.altText ||
                        currentProduct.name
                      }
                      className="w-full h-full object-cover"
                    />

                    {/* Overlays for Sale or New */}
                    {isNew() && (
                      <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full z-10">
                        {t("product:product_card.new")}
                      </div>
                    )}

                    {isOnSale() && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full z-10">
                        -{discountPercentage()}% {t("product:product_card.off")}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Image Navigation Buttons */}
                {currentProduct.images && currentProduct.images.length > 1 && (
                  <>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<LeftOutlined />}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 opacity-70 hover:opacity-100"
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === 0
                            ? currentProduct.images!.length - 1
                            : prev - 1
                        )
                      }
                    />
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<RightOutlined />}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 opacity-70 hover:opacity-100"
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev === currentProduct.images!.length - 1
                            ? 0
                            : prev + 1
                        )
                      }
                    />
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {currentProduct.images && currentProduct.images.length > 1 && (
                <div className="px-4 py-3 flex space-x-2 overflow-x-auto">
                  {currentProduct.images.map((image, index) => (
                    <div
                      key={image.id}
                      className={`w-16 h-16 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image.imageUrl}
                        alt={image.altText || currentProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
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
                  {/* Placeholder rating count - would come from API */}
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
                {/* Placeholder for reviews - would come from API */}
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
