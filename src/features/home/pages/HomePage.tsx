import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Typography, Rate, message, Card, Tag } from "antd";
import {
  ArrowRightOutlined,
  FireOutlined,
  GiftOutlined,
  StarFilled,
  ShoppingOutlined,
  CompassOutlined,
  EyeOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchLatestProducts,
  fetchProducts,
} from "@/store/slices/productSlice";
import ProductCarousel from "@/features/products/components/ProductCarousel";
import type { ProductResponse } from "@/types/product.types";
import { useCart } from "@/contexts/CartContext";
import type { UUID } from "crypto";
import { formatVND } from "@/utils/formatters";

const { Title, Text, Paragraph } = Typography;

// Enhanced Hero Section Component with Real Product Images
const EnhancedHeroSection: React.FC = () => {
  const { i18n } = useTranslation(["common", "product"]);
  const dispatch = useAppDispatch();
  const { products, latestProducts, loading } = useAppSelector(
    (state) => state.products
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Fetch products for different regions
  useEffect(() => {
    // Fetch latest products to get real product images
    dispatch(fetchLatestProducts({ size: 10 }));

    // Also fetch products to have a good variety
    dispatch(fetchProducts({ size: 20, featured: true }));
  }, [dispatch]);

  // Get real product images or fallback to placeholders
  const getProductImage = (index: number) => {
    const allProducts = [...latestProducts, ...products];
    const product = allProducts[index % allProducts.length];

    if (product?.images?.length > 0) {
      const primaryImage = product.images.find((img) => img.isPrimary);
      return primaryImage?.imageUrl || product.images[0]?.imageUrl;
    }

    // Fallback images
    const fallbackImages = [
      "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1624371711241-e15e6d554040?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1557750255-c76072a7fdf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1621164078873-a944ea50a9a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ];

    return fallbackImages[index % fallbackImages.length];
  };

  // Get real product data or create enhanced mock data
  const getProductData = (index: number) => {
    const allProducts = [...latestProducts, ...products];
    const product = allProducts[index % allProducts.length];

    if (product) {
      return {
        name: product.name,
        price: formatVND(product.price),
        originalPrice: product.originalPrice
          ? formatVND(product.originalPrice)
          : null,
        stockStatus: product.stockQuantity > 0 ? "In Stock" : "Out of Stock",
        slug: product.slug,
        region: product.region?.name || "Vietnam",
        category: product.category?.name || "Áo Dài",
        shortDescription:
          product.shortDescription ||
          "Premium quality traditional Vietnamese dress",
        isOnSale:
          product.originalPrice && product.price < product.originalPrice,
      };
    }

    return null;
  };

  // Hero destinations with Mosaic T-Shirt collection integration
  const heroDestinations = [
    {
      id: "hcm",
      title: "Saigon Skyline Tee",
      titleVi: "Áo Thun Skyline Sài Gòn",
      subtitle: "Landmark 81 & Notre Dame Cathedral Design",
      subtitleVi: "Thiết Kế Landmark 81 & Nhà Thờ Đức Bà",
      description:
        "Urban-style t-shirt showcasing Ho Chi Minh City's iconic skyline with Landmark 81 and Notre Dame Cathedral silhouettes",
      descriptionVi:
        "Áo thun phong cách đô thị thể hiện đường chân trời biểu tượng TP.HCM với hình bóng Landmark 81 và Nhà Thờ Đức Bà",
      image: "/assets/destinations/hcm/landmark-81.jpg",
      productImage: getProductImage(1),
      productData: getProductData(1),
      url: "/destinations/hcm",
      productUrl: "/products?regionId=hcm",
      gradient: "from-red-600 via-orange-600 to-pink-600",
      overlayGradient: "from-red-900/80 via-orange-900/60 to-transparent",
      aoColor: "Đỏ Rực",
      aoColorEn: "Vibrant Red",
      aoStyle: "Urban Skyline",
      icon: "🏙️",
      specialty: "Metropolitan Print",
      rating: 4.9,
      views: "18.2K",
      region: "Southern Vietnam",
      regionVi: "Miền Nam Việt Nam",
    },
    {
      id: "khanhhoa",
      title: "Nha Trang Paradise Tee",
      titleVi: "Áo Thun Thiên Đường Nha Trang",
      subtitle: "Po Nagar Towers & Vinpearl Design",
      subtitleVi: "Thiết Kế Tháp Po Nagar & Vinpearl",
      description:
        "Beach-inspired t-shirt combining ancient Cham towers with modern Vinpearl resort in tropical color palette",
      descriptionVi:
        "Áo thun cảm hứng biển kết hợp tháp Chăm cổ kính với resort Vinpearl hiện đại trong bảng màu nhiệt đới",
      image: "/assets/destinations/khanhhoa/biennhatrang.png",
      productImage: getProductImage(0),
      productData: getProductData(0),
      url: "/destinations/khanhhoa",
      productUrl: "/products?regionId=khanhhoa",
      gradient: "from-cyan-600 via-blue-600 to-teal-700",
      overlayGradient: "from-cyan-900/80 via-blue-900/60 to-transparent",
      aoColor: "Xanh Biển",
      aoColorEn: "Ocean Blue",
      aoStyle: "Tropical Print",
      icon: "🌊",
      specialty: "Beach Resort Tee",
      rating: 4.9,
      views: "16.3K",
      region: "South Central Coast",
      regionVi: "Duyên Hải Nam Trung Bộ",
    },
    {
      id: "danang",
      title: "Da Nang Dragon Tee",
      titleVi: "Áo Thun Rồng Đà Nẵng",
      subtitle: "Dragon Bridge & Marble Mountains Design",
      subtitleVi: "Thiết Kế Cầu Rồng & Ngũ Hành Sơn",
      description:
        "Striking graphic tee featuring the famous Dragon Bridge breathing fire and the mystical Marble Mountains landscape",
      descriptionVi:
        "Áo thun graphic ấn tượng với hình ảnh Cầu Rồng phun lửa nổi tiếng và phong cảnh huyền bí Ngũ Hành Sơn",
      image: "/assets/destinations/danang/danangcity.jpg",
      productImage: getProductImage(4),
      productData: getProductData(4),
      url: "/destinations/danang",
      productUrl: "/products?regionId=danang",
      gradient: "from-sky-600 via-blue-600 to-indigo-600",
      overlayGradient: "from-sky-900/80 via-blue-900/60 to-transparent",
      aoColor: "Xanh Dương",
      aoColorEn: "Azure Blue",
      aoStyle: "Dragon Print",
      icon: "🏖️",
      specialty: "Coastal Landmark Tee",
      rating: 4.7,
      views: "15.8K",
      region: "Central Vietnam",
      regionVi: "Miền Trung Việt Nam",
    },
    {
      id: "quangninh",
      title: "Ha Long Bay Wonder Tee",
      titleVi: "Áo Thun Kỳ Quan Vịnh Hạ Long",
      subtitle: "Limestone Karsts & Floating Villages Design",
      subtitleVi: "Thiết Kế Núi Đá Vôi & Làng Chài",
      description:
        "UNESCO World Heritage inspired tee showcasing Ha Long Bay's majestic limestone formations and traditional fishing villages",
      descriptionVi:
        "Áo thun cảm hứng di sản thế giới UNESCO thể hiện tảng đá vôi hùng vĩ Vịnh Hạ Long và làng chài truyền thống",
      image: "/assets/destinations/quangninh/daotiptop.png",
      productImage: getProductImage(2),
      productData: getProductData(2),
      url: "/destinations/quangninh",
      productUrl: "/products?regionId=quangninh",
      gradient: "from-slate-600 via-stone-600 to-slate-700",
      overlayGradient: "from-slate-900/80 via-stone-900/60 to-transparent",
      aoColor: "Xanh Thiên Thanh",
      aoColorEn: "Sky Blue",
      aoStyle: "Heritage Print",
      icon: "🗿",
      specialty: "UNESCO Heritage Tee",
      rating: 4.9,
      views: "14.7K",
      region: "Northeast Vietnam",
      regionVi: "Đông Bắc Việt Nam",
    },
    {
      id: "hanoi",
      title: "Hanoi Heritage Tee",
      titleVi: "Áo Thun Di Sản Hà Nội",
      subtitle: "Temple of Literature & Hoan Kiem Lake Design",
      subtitleVi: "Thiết Kế Văn Miếu & Hồ Hoàn Kiếm",
      description:
        "Premium cotton tee featuring artistic prints of Temple of Literature and Hoan Kiem Lake with traditional Vietnamese motifs",
      descriptionVi:
        "Áo thun cotton cao cấp với bản in nghệ thuật Văn Miếu và Hồ Hoàn Kiếm cùng họa tiết truyền thống Việt Nam",
      image: "/assets/destinations/hanoi/ho-chi-minh-mausoleum.jpg",
      productImage: getProductImage(3),
      productData: getProductData(3),
      url: "/destinations/hanoi",
      productUrl: "/products?regionId=hanoi",
      gradient: "from-amber-600 via-yellow-600 to-orange-600",
      overlayGradient: "from-amber-900/80 via-yellow-900/60 to-transparent",
      aoColor: "Vàng Hoàng Gia",
      aoColorEn: "Royal Gold",
      aoStyle: "Heritage Print",
      icon: "🏛️",
      specialty: "Cultural Heritage Tee",
      rating: 4.8,
      views: "12.5K",
      region: "Northern Vietnam",
      regionVi: "Miền Bắc Việt Nam",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || loading) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroDestinations.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isPlaying, heroDestinations.length, loading]);

  const currentDestination = heroDestinations[currentSlide];

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Floating particles animation
  const FloatingParticles = ({
    destination: _destination,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    destination: any;
  }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i * 0.8) * 30, 0],
            rotate: [0, 360],
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 8,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
          style={{
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
          }}
        >
          <div className="text-white/20 text-3xl">
            {["👘", "🌸", "⭐", "💎", "🎋", "🌙"][i % 6]}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[80vh] md:h-[90vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {/* Background Image with Ken Burns Effect */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${currentDestination.image})`,
              }}
              animate={{
                scale: [1, 1.15],
              }}
              transition={{ duration: 4, ease: "linear" }}
            />

            {/* Dynamic Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${currentDestination.overlayGradient}`}
            />

            {/* Floating Particles */}
            <FloatingParticles destination={currentDestination} />

            {/* Content Grid */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                  {/* Left Column - Collection Info (8 columns) */}
                  <motion.div
                    className="lg:col-span-7"
                    initial={{ opacity: 0, x: -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    {/* Collection Badge */}
                    <motion.div
                      className="inline-flex items-center mb-6"
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 1, -1, 0],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div
                        className={`bg-gradient-to-r ${currentDestination.gradient} px-6 py-3 rounded-full flex items-center shadow-2xl backdrop-blur-sm border border-white/30`}
                      >
                        <span className="text-2xl mr-3">
                          {currentDestination.icon}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm uppercase tracking-wider">
                            New Collection
                          </span>
                          <span className="text-xs opacity-90">
                            {currentDestination.specialty}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Main Title */}
                    <div className="mb-6">
                      <Title
                        level={1}
                        className="mb-3 text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
                        style={{
                          color: "white",
                          textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
                        }}
                      >
                        {i18n.language === "vi"
                          ? currentDestination.titleVi
                          : currentDestination.title}
                      </Title>

                      <Title
                        level={3}
                        className="text-gray-200 mb-0 text-lg md:text-xl font-medium opacity-90"
                        style={{
                          color: "white",
                          textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
                        }}
                      >
                        {i18n.language === "vi"
                          ? currentDestination.subtitleVi
                          : currentDestination.subtitle}
                      </Title>
                    </div>

                    {/* Description */}
                    <Paragraph
                      className="text-gray-200 text-base md:text-lg mb-8 leading-relaxed max-w-2xl"
                      style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
                    >
                      {i18n.language === "vi"
                        ? currentDestination.descriptionVi
                        : currentDestination.description}
                    </Paragraph>

                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-4 mb-8">
                      <div className="bg-white/15 backdrop-blur-md rounded-full px-4 py-2 flex items-center border border-white/25">
                        <StarFilled className="text-yellow-400 mr-2 text-lg" />
                        <span className="font-bold text-white">
                          {currentDestination.rating}
                        </span>
                        <span className="text-white/80 ml-1 text-sm">
                          rating
                        </span>
                      </div>
                      <div className="bg-white/15 backdrop-blur-md rounded-full px-4 py-2 flex items-center border border-white/25">
                        <EyeOutlined className="text-blue-400 mr-2 text-lg" />
                        <span className="font-bold text-white">
                          {currentDestination.views}
                        </span>
                        <span className="text-white/80 ml-1 text-sm">
                          views
                        </span>
                      </div>
                      <div className="bg-white/15 backdrop-blur-md rounded-full px-4 py-2 flex items-center border border-white/25">
                        <EnvironmentOutlined className="text-green-400 mr-2 text-lg" />
                        <span className="text-white text-sm">
                          {i18n.language === "vi"
                            ? currentDestination.regionVi
                            : currentDestination.region}
                        </span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to={currentDestination.productUrl}>
                        <Button
                          type="primary"
                          size="large"
                          className={`bg-gradient-to-r ${currentDestination.gradient} border-none hover:shadow-2xl transition-all duration-500 h-14 px-10 text-lg font-semibold`}
                          icon={<ShoppingOutlined className="text-xl" />}
                        >
                          <span className="ml-2">Shop Collection</span>
                        </Button>
                      </Link>

                      <Link to={currentDestination.url}>
                        <Button
                          size="large"
                          className="bg-white/15 border-white/25 text-white hover:bg-white/25 hover:border-white/35 backdrop-blur-md transition-all duration-500 h-14 px-10 text-lg font-semibold"
                          icon={<CompassOutlined className="text-xl" />}
                        >
                          <span className="ml-2">Explore Region</span>
                        </Button>
                      </Link>
                    </div>
                  </motion.div>

                  {/* Right Column - Enhanced Áo Dài Product Showcase */}
                  <motion.div
                    className="lg:col-span-5"
                    initial={{ opacity: 0, x: 80, rotateY: 15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                  >
                    <Card
                      className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden"
                      bodyStyle={{ padding: 0 }}
                    >
                      {/* Enhanced Product Image with better aspect ratio */}
                      <div className="relative h-96 overflow-hidden group">
                        <motion.div
                          className="absolute inset-0"
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <img
                            src={currentDestination.productImage}
                            alt={`Áo Dài ${currentDestination.title}`}
                            className="w-full h-full object-cover object-center"
                            style={{
                              objectPosition: "center 20%", // Focus on upper part where áo dài details are
                            }}
                          />
                        </motion.div>

                        {/* Enhanced Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Premium Quality Badge */}
                        <div className="absolute top-4 left-4">
                          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center">
                            <span className="mr-1">⭐</span>
                            Premium Quality
                          </div>
                        </div>

                        {/* Real Product Price or Fallback */}
                        <div className="absolute top-4 right-4">
                          <motion.div
                            className={`bg-gradient-to-r ${currentDestination.gradient} text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg`}
                            animate={{
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            {currentDestination.productData?.price || "$289"}
                          </motion.div>
                        </div>

                        {/* Sale Badge if product is on sale */}
                        {currentDestination.productData?.isOnSale && (
                          <div className="absolute top-16 right-4">
                            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                              SALE!
                            </div>
                          </div>
                        )}

                        {/* Enhanced Floating Elements */}
                        <div className="absolute inset-0">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute text-white/40 text-xl"
                              animate={{
                                y: [0, -30, 0],
                                x: [0, Math.sin(i) * 15, 0],
                                rotate: [0, 360],
                                opacity: [0.2, 0.8, 0.2],
                                scale: [0.8, 1.2, 0.8],
                              }}
                              transition={{
                                duration: Math.random() * 8 + 6,
                                repeat: Infinity,
                                delay: Math.random() * 3,
                                ease: "easeInOut",
                              }}
                              style={{
                                left: Math.random() * 80 + 10 + "%",
                                top: Math.random() * 80 + 10 + "%",
                              }}
                            >
                              {["✨", "🌸", "🦋", "💫"][i % 4]}
                            </motion.div>
                          ))}
                        </div>

                        {/* Hover Interaction Hint */}
                        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            Click to explore ✨
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Product Info */}
                      <div className="p-6">
                        <div className="text-center mb-6">
                          <Title level={4} className="text-white mb-2 text-xl">
                            {currentDestination.productData?.name ||
                              "Áo Mosaic Collection"}
                          </Title>

                          <Text className="text-gray-300 block mb-4 text-lg">
                            {i18n.language === "vi"
                              ? currentDestination.aoColor
                              : currentDestination.aoColorEn}
                          </Text>

                          {/* Enhanced Tags */}
                          <div className="flex justify-center gap-2 mb-6 flex-wrap">
                            <Tag
                              color="processing"
                              className="border-white/20 bg-blue-500/20 text-white px-3 py-1 text-xs"
                            >
                              {currentDestination.aoStyle}
                            </Tag>
                            <Tag
                              color="success"
                              className="border-white/20 bg-green-500/20 text-white px-3 py-1 text-xs"
                            >
                              Premium Silk
                            </Tag>
                            <Tag
                              color="gold"
                              className="border-white/20 bg-yellow-500/20 text-white px-3 py-1 text-xs"
                            >
                              Handcrafted
                            </Tag>
                            {currentDestination.productData?.region && (
                              <Tag
                                color="purple"
                                className="border-white/20 bg-purple-500/20 text-white px-3 py-1 text-xs"
                              >
                                {currentDestination.productData.region}
                              </Tag>
                            )}
                          </div>

                          {/* Enhanced Price Display */}
                          <div className="bg-white/5 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <Text className="text-white/80 text-sm block">
                                  {currentDestination.productData?.originalPrice
                                    ? "Sale Price"
                                    : "Starting from"}
                                </Text>
                                <div className="flex items-center gap-2">
                                  <Title
                                    level={2}
                                    className="text-white m-0 text-2xl"
                                  >
                                    {currentDestination.productData?.price ||
                                      "$289"}
                                  </Title>
                                  {currentDestination.productData
                                    ?.originalPrice && (
                                    <Text className="text-gray-400 line-through text-sm">
                                      {
                                        currentDestination.productData
                                          .originalPrice
                                      }
                                    </Text>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <Text className="text-white/80 text-sm block">
                                  Status
                                </Text>
                                <Text
                                  className={`font-bold text-lg ${
                                    currentDestination.productData
                                      ?.stockStatus === "In Stock"
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {currentDestination.productData
                                    ?.stockStatus || "In Stock"}
                                </Text>
                              </div>
                            </div>
                          </div>

                          {/* Product Description */}
                          {currentDestination.productData?.shortDescription && (
                            <Text className="text-gray-300 text-sm mb-4 block">
                              {currentDestination.productData.shortDescription}
                            </Text>
                          )}
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className="flex gap-3">
                          <Link
                            to={
                              currentDestination.productData?.slug
                                ? `/products/${currentDestination.productData.slug}`
                                : currentDestination.productUrl
                            }
                            className="flex-1"
                          >
                            <Button
                              type="primary"
                              block
                              size="large"
                              className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/40 backdrop-blur-sm h-12 font-semibold transition-all duration-300"
                              icon={<ShoppingOutlined />}
                            >
                              {currentDestination.productData
                                ? "View Details"
                                : "Shop Now"}
                            </Button>
                          </Link>
                          <Button
                            size="large"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm px-4 transition-all duration-300"
                            icon={<HeartOutlined />}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center gap-6 bg-black/25 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 shadow-2xl">
            {/* Play/Pause Button */}
            <Button
              type="text"
              size="large"
              className="text-white hover:text-white/80 hover:bg-white/10 rounded-full p-3"
              icon={
                isPlaying ? (
                  <PauseCircleOutlined className="text-2xl" />
                ) : (
                  <PlayCircleOutlined className="text-2xl" />
                )
              }
              onClick={togglePlayPause}
            />

            {/* Dots Navigation */}
            <div className="flex gap-3">
              {heroDestinations.map((_, index) => (
                <motion.button
                  key={index}
                  className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                    currentSlide === index
                      ? "w-12 h-4 bg-white shadow-lg"
                      : "w-4 h-4 bg-white/40 hover:bg-white/60"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {currentSlide === index && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 4,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Slide Info */}
            <div className="text-white/90 text-sm font-medium flex items-center gap-2">
              <span>{currentSlide + 1}</span>
              <span className="w-4 h-px bg-white/40"></span>
              <span>{heroDestinations.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
            animate={{
              width: isPlaying ? ["0%", "100%"] : "0%",
            }}
            transition={{
              duration: 4,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        </div>

        {/* Enhanced Decorative Elements */}
        <div className="absolute top-10 right-10 z-10">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-20 h-20 border-2 border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <span className="text-white/60 text-2xl">✨</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Special Offer Section with Real Product Images
const EnhancedSpecialOfferSection: React.FC = () => {
  const { t } = useTranslation(["common"]);
  const { products, latestProducts } = useAppSelector(
    (state) => state.products
  );
  const [countdownTime, setCountdownTime] = useState({
    days: 5,
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  // Get multiple product images for the showcase
  const getSpecialOfferProducts = () => {
    const allProducts = [...latestProducts, ...products];
    return Array.from({ length: 5 }, (_, index) => {
      const product = allProducts[index % allProducts.length];

      if (product?.images?.length > 0) {
        const primaryImage = product.images.find((img) => img.isPrimary);
        return {
          image: primaryImage?.imageUrl || product.images[0]?.imageUrl,
          name: product.name,
          price: formatVND(product.price),
          originalPrice: product.originalPrice
            ? formatVND(product.originalPrice)
            : null,
          slug: product.slug,
        };
      }

      // Fallback products
      const fallbackProducts = [
        {
          image:
            "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          name: "Traditional Áo Dài",
          price: "$289",
          originalPrice: "$389",
          slug: "traditional-ao-dai",
        },
        {
          image:
            "https://images.unsplash.com/photo-1624371711241-e15e6d554040?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          name: "Modern Silk Áo Dài",
          price: "$359",
          originalPrice: "$459",
          slug: "modern-silk-ao-dai",
        },
        {
          image:
            "https://images.unsplash.com/photo-1557750255-c76072a7fdf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          name: "Royal Collection Áo Dài",
          price: "$489",
          originalPrice: "$589",
          slug: "royal-collection-ao-dai",
        },
        {
          image:
            "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          name: "Elegant Evening Áo Dài",
          price: "$399",
          originalPrice: "$499",
          slug: "elegant-evening-ao-dai",
        },
      ];

      return fallbackProducts[index % fallbackProducts.length];
    });
  };

  const specialProducts = getSpecialOfferProducts();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownTime((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Floating elements for special offer
  const FloatingOfferElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/20 text-2xl"
          animate={{
            y: [0, -80, 0],
            x: [0, Math.sin(i * 1.2) * 40, 0],
            rotate: [0, 360],
            scale: [0.5, 1.5, 0.5],
            opacity: [0.1, 0.7, 0.1],
          }}
          transition={{
            duration: Math.random() * 12 + 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
          style={{
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
          }}
        >
          {["🔥", "💎", "⚡", "🌟", "💫", "✨"][i % 6]}
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 text-white shadow-2xl">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
                `,
              }}
            />
          </div>

          {/* Floating Elements */}
          <FloatingOfferElements />

          {/* Content Grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Offer Details */}
            <div className="lg:col-span-7 p-10 md:p-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {/* Mega Sale Badge */}
                <motion.div
                  className="inline-flex items-center mb-6"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full flex items-center shadow-2xl border-4 border-white/30">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <FireOutlined className="text-3xl mr-4" />
                    </motion.div>
                    <div className="flex flex-col">
                      <span className="font-black text-lg uppercase tracking-wider">
                        {t("common:special_offer.label")}
                      </span>
                      <span className="text-sm font-semibold opacity-80">
                        Limited Time Only
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Main Title with Gradient Text */}
                <div className="mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Title
                      level={1}
                      className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-4"
                      style={{
                        background:
                          "linear-gradient(45deg, #ffffff, #f0f0f0, #ffffff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textShadow: "0 0 30px rgba(255,255,255,0.5)",
                      }}
                    >
                      {t("common:special_offer.title")}
                    </Title>
                  </motion.div>

                  {/* Discount Badge */}
                  <motion.div
                    className="inline-flex items-center mb-6"
                    animate={{
                      scale: [1, 1.15, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-black px-8 py-3 rounded-full flex items-center shadow-xl">
                      <ThunderboltOutlined className="text-2xl mr-3" />
                      <span className="font-black text-2xl">UP TO 30% OFF</span>
                    </div>
                  </motion.div>
                </div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Paragraph className="text-gray-100 mb-8 text-xl leading-relaxed max-w-2xl">
                    {t("common:special_offer.description")}
                  </Paragraph>
                </motion.div>

                {/* Enhanced Countdown */}
                <motion.div
                  className="mb-10"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="flex items-center mb-4">
                    <CrownOutlined className="text-yellow-400 text-2xl mr-3" />
                    <span className="text-xl font-bold uppercase tracking-wider">
                      Hurry Up! Offer Ends In:
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {[
                      {
                        value: countdownTime.days,
                        label: t("common:special_offer.countdown.days"),
                      },
                      {
                        value: countdownTime.hours,
                        label: t("common:special_offer.countdown.hours"),
                      },
                      {
                        value: countdownTime.minutes,
                        label: t("common:special_offer.countdown.mins"),
                      },
                      {
                        value: countdownTime.seconds,
                        label: t("common:special_offer.countdown.secs"),
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="text-center"
                        animate={{
                          scale: index === 3 ? [1, 1.1, 1] : 1,
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-xl">
                          <motion.span
                            className="text-4xl md:text-5xl font-black block mb-2"
                            animate={{
                              color:
                                index === 3
                                  ? ["#ffffff", "#ffff00", "#ffffff"]
                                  : "#ffffff",
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            {String(item.value).padStart(2, "0")}
                          </motion.span>
                          <p className="text-sm font-bold uppercase tracking-wider opacity-80">
                            {item.label}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Link to="/products?category">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="large"
                        className="bg-white text-red-600 hover:bg-gray-100 border-none h-16 px-12 text-xl font-bold rounded-2xl shadow-2xl"
                        icon={<ShoppingOutlined className="text-2xl" />}
                      >
                        <span className="ml-3">
                          {t("common:special_offer.button")}
                        </span>
                        <ArrowRightOutlined className="ml-3 text-xl" />
                      </Button>
                    </motion.div>
                  </Link>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/products?category">
                      <Button
                        size="large"
                        className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:border-white/60 h-16 px-12 text-xl font-bold rounded-2xl backdrop-blur-sm"
                        icon={<GiftOutlined className="text-2xl" />}
                      >
                        <span className="ml-3">View All Deals</span>
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - Product Showcase Grid */}
            <div className="lg:col-span-5 p-6 lg:p-8">
              <motion.div
                className="grid grid-cols-2 gap-4 h-full"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {specialProducts.map((product, index) => (
                  <motion.div
                    key={index}
                    className={`relative overflow-hidden rounded-2xl group ${
                      index === 0 ? "col-span-2 h-64" : "h-48"
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    {/* Product Image */}
                    <div className="absolute inset-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Sale Badge */}
                    <div className="absolute top-3 left-3">
                      <motion.div
                        className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        30% OFF
                      </motion.div>
                    </div>

                    {/* Product Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="text-white font-bold text-sm mb-2 line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-lg">
                            {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-300 line-through text-sm">
                              {product.originalPrice}
                            </span>
                          )}
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Link to={`/products/${product.slug}`}>
                            <Button
                              type="text"
                              size="small"
                              className="text-white hover:text-yellow-400 p-1"
                              icon={<StarOutlined />}
                            />
                          </Link>
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Special Offer Features */}
              <motion.div
                className="mt-6 grid grid-cols-1 gap-3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {[
                  { icon: "🚚", text: "Free Worldwide Shipping" },
                  { icon: "🎁", text: "Free Gift Wrapping" },
                  { icon: "⚡", text: "24h Express Delivery" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/15 backdrop-blur-md rounded-xl p-3 flex items-center border border-white/20"
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(255,255,255,0.2)",
                    }}
                  >
                    <span className="text-2xl mr-3">{feature.icon}</span>
                    <span className="text-white font-semibold text-sm">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Bottom Decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500" />
        </div>
      </div>
    </section>
  );
};

// Rest of the component remains the same...
const regions = [
  {
    id: "north",
    image:
      "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNhcGElMjB2aWV0bmFtfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    url: "/regions/north",
  },
  {
    id: "central",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aHVlJTIwdmlldG5hbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    url: "/regions/central",
  },
  {
    id: "south",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVrb25nJTIwZGVsdGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    url: "/regions/south",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Toronto, Canada",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
  },
  {
    id: 3,
    name: "Emma Nguyen",
    location: "Sydney, Australia",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 5,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

interface TestimonialCardProps {
  testimonial: {
    id: number;
    name: string;
    location: string;
    avatar: string;
    rating: number;
  };
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const { t } = useTranslation(["common"]);

  return (
    <motion.div variants={fadeInUp}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full">
        <div className="flex items-center mb-4">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white">
              {testimonial.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {testimonial.location}
            </p>
          </div>
        </div>
        <Rate disabled defaultValue={testimonial.rating} className="mb-3" />
        <p className="text-gray-700 dark:text-gray-300 italic">
          {t(`common:testimonials.${testimonial.id}.text`)}
        </p>
      </div>
    </motion.div>
  );
};

const HomePage: React.FC = () => {
  const { t } = useTranslation(["common", "product"]);
  const dispatch = useAppDispatch();
  const { latestProducts, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchLatestProducts({ size: 6 }));
  }, [dispatch]);

  const { addToCart } = useCart();

  const handleAddToCart = async (product: ProductResponse) => {
    try {
      await addToCart(
        {
          productId: product.id as UUID,
          quantity: 1,
        },
        product
      );
    } catch (error) {
      console.error("Failed to add to cart:", error);
      message.error(t("cart:notifications.error_adding"));
    }
  };

  const handleAddToWishlist = (product: ProductResponse) => {
    message.success(`${product.name} added to wishlist!`);
  };

  return (
    <MainLayout>
      {/* Enhanced Hero Section */}
      <EnhancedHeroSection />

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                {t("common:features.craftsmanship.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("common:features.craftsmanship.description")}
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v1h-2V8a1 1 0 00-1-1H6a1 1 0 00-1 1v7h1.05a2.5 2.5 0 014.9 0H15V8a1 1 0 00-1-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                {t("common:features.shipping.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("common:features.shipping.description")}
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                {t("common:features.returns.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("common:features.returns.description")}
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                {t("common:features.sustainable.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("common:features.sustainable.description")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2} className="mb-2 dark:text-white">
                {t("common:nav.new_arrivals")}
              </Title>
              <Text className="text-gray-600 dark:text-gray-400">
                {t("common:sections.featured_products.subtitle")}
              </Text>
            </div>
            <Link to="/products?sort=createdAt,desc">
              <Button type="link" className="font-semibold">
                {t("common:actions.view_all")} <ArrowRightOutlined />
              </Button>
            </Link>
          </div>

          <ProductCarousel
            products={latestProducts}
            loading={loading}
            autoplay={true}
            slidesToShow={4}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </div>
      </section>

      {/* Enhanced Special Offer Section */}
      <EnhancedSpecialOfferSection />

      {/* Regional Collections */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="mb-2 dark:text-white">
              {t("common:sections.regions.title")}
            </Title>
            <Text className="text-gray-600 dark:text-gray-400">
              {t("common:sections.regions.subtitle")}
            </Text>
          </div>

          {regions.map((region, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 mb-12 last:mb-0`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="lg:w-1/2">
                <div className="overflow-hidden rounded-lg h-full">
                  <img
                    src={region.image}
                    alt={t(`common:regions.${region.id}.name`)}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="lg:w-1/2 flex flex-col justify-center">
                <Title level={3} className="mb-3 dark:text-white">
                  {t(`common:regions.${region.id}.name`)}
                </Title>
                <Paragraph className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  {t(`common:regions.${region.id}.description`)}
                </Paragraph>
                <Link to={region.url}>
                  <Button type="primary" size="large" className="max-w-max">
                    {t("common:actions.explore_collection")}{" "}
                    <ArrowRightOutlined />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="mb-2 dark:text-white">
              {t("common:sections.testimonials.title")}
            </Title>
            <Text className="text-gray-600 dark:text-gray-400">
              {t("common:sections.testimonials.subtitle")}
            </Text>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <GiftOutlined className="text-4xl mb-4" />
            <Title level={2} className="text-white mb-3">
              {t("common:newsletter.title")}
            </Title>
            <Paragraph className="text-gray-100 mb-8 text-lg">
              {t("common:newsletter.description")}
            </Paragraph>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={t("common:newsletter.placeholder")}
                className="flex-grow py-3 px-4 rounded-lg text-gray-800 focus:outline-none"
              />
              <Button
                size="large"
                className="bg-white text-primary hover:bg-gray-100 border-white"
              >
                {t("common:newsletter.button")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
