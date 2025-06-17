import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, Typography, Divider, Tag, Button } from "antd";
import {
  CompassOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  FireOutlined,
  StarFilled,
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";

const { Title, Text, Paragraph } = Typography;

// Hero Section Component
const HeroSection: React.FC = () => {
  const { t, i18n } = useTranslation([
    "destinationdanang",
    "destinationhanoi",
    "destinationhcm",
    "destinationkhanhhoa",
    "destinationquangninh",
    "common",
  ]);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.useRef<any>(null);

  // Enhanced destinations data with product associations
  const destinations = [
    {
      id: "quangninh",
      title: "Quảng Ninh",
      titleVi: "Quảng Ninh",
      description: "destinationquangninh:overview.intro",
      image: "/assets/destinations/quangninh/daotiptop.png",
      url: "/destinations/quangninh",
      productUrl: "/products?region=quangninh",
      date: "2025-06-14",
      region: "Northeast Vietnam",
      regionVi: "Đông Bắc Việt Nam",
      color: "#64748b",
      gradient: "from-slate-700 via-stone-700 to-slate-800",
      overlayGradient: "from-slate-900/80 via-stone-900/60 to-transparent",
      featured: true,
      rating: 4.9,
      icon: "🗿",
      views: "2.5K",
      likes: "1.2K",
      specialty: "Limestone Karsts",
      aoMauSac: "Xanh Thiên Thanh",
      aoMauSacEn: "Sky Blue",
      aoStyle: "Elegant Traditional",
      aoPrice: "199999 VND",
    },
    {
      id: "khanhhoa",
      title: "Khánh Hòa",
      titleVi: "Khánh Hòa",
      description: "destinationkhanhhoa:overview.intro",
      image: "/assets/destinations/khanhhoa/biennhatrang.png",
      url: "/destinations/khanhhoa",
      productUrl: "/products?region=khanhhoa",
      date: "2025-06-14",
      region: "South Central Coast",
      regionVi: "Duyên Hải Nam Trung Bộ",
      color: "#0891b2",
      gradient: "from-cyan-600 via-blue-600 to-teal-700",
      overlayGradient: "from-cyan-900/80 via-blue-900/60 to-transparent",
      featured: false,
      rating: 4.9,
      icon: "🌊",
      views: "3.1K",
      likes: "1.8K",
      specialty: "Coastal Paradise",
      aoMauSac: "Xanh Biển",
      aoMauSacEn: "Ocean Blue",
      aoStyle: "Flowing Coastal",
      aoPrice: "199999 VND",
    },
    {
      id: "hcm",
      title: "Ho Chi Minh City",
      titleVi: "TP. Hồ Chí Minh",
      description: "destinationhcm:overview.intro",
      image: "/assets/destinations/hcm/landmark-81.jpg",
      url: "/destinations/hcm",
      productUrl: "/products?region=hcm",
      date: "2025-02-10",
      region: "Southern Vietnam",
      regionVi: "Miền Nam Việt Nam",
      color: "#dc2626",
      gradient: "from-red-600 via-orange-600 to-pink-600",
      overlayGradient: "from-red-900/80 via-orange-900/60 to-transparent",
      featured: false,
      rating: 4.9,
      icon: "🏙️",
      views: "4.7K",
      likes: "2.3K",
      specialty: "Urban Energy",
      aoMauSac: "Đỏ Rực",
      aoMauSacEn: "Vibrant Red",
      aoStyle: "Modern Chic",
      aoPrice: "199999 VND",
    },
    {
      id: "danang",
      title: "Da Nang",
      titleVi: "Đà Nẵng",
      description: "destinationdanang:overview.intro",
      image: "/assets/destinations/danang/danangcity.jpg",
      url: "/destinations/danang",
      productUrl: "/products?region=danang",
      date: "2025-02-15",
      region: "Central Vietnam",
      regionVi: "Miền Trung Việt Nam",
      color: "#0ea5e9",
      gradient: "from-sky-600 via-blue-600 to-indigo-600",
      overlayGradient: "from-sky-900/80 via-blue-900/60 to-transparent",
      featured: false,
      rating: 4.7,
      icon: "🏖️",
      views: "3.8K",
      likes: "1.9K",
      specialty: "Beach Culture",
      aoMauSac: "Xanh Dương",
      aoMauSacEn: "Azure Blue",
      aoStyle: "Breezy Coastal",
      aoPrice: "199999 VND",
    },
    {
      id: "hanoi",
      title: "Hanoi",
      titleVi: "Hà Nội",
      description: "destinationhanoi:overview.intro",
      image: "/assets/destinations/hanoi/ho-chi-minh-mausoleum.jpg",
      url: "/destinations/hanoi",
      productUrl: "/products?region=hanoi",
      date: "2025-02-20",
      region: "Northern Vietnam",
      regionVi: "Miền Bắc Việt Nam",
      color: "#d97706",
      gradient: "from-amber-600 via-yellow-600 to-orange-600",
      overlayGradient: "from-amber-900/80 via-yellow-900/60 to-transparent",
      featured: false,
      rating: 4.8,
      icon: "🏛️",
      views: "4.2K",
      likes: "2.1K",
      specialty: "Cultural Heritage",
      aoMauSac: "Vàng Hoàng Gia",
      aoMauSacEn: "Royal Gold",
      aoStyle: "Regal Traditional",
      aoPrice: "199999 VND",
    },
  ];

  // Auto-play functionality
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % destinations.length;
        return nextSlide;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, destinations.length]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Get current destination
  const currentDestination = destinations[currentSlide];

  // Floating elements animation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FloatingElements = ({ destination }: { destination: any }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/20 text-2xl md:text-4xl"
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i * 0.5) * 20, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
          style={{
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
          }}
        >
          {destination.icon}
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[85vh] md:h-[90vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Background Image with Parallax Effect */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${currentDestination.image})`,
              }}
              animate={{
                scale: [1, 1.1],
              }}
              transition={{ duration: 4, ease: "linear" }}
            />

            {/* Dynamic Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${currentDestination.overlayGradient}`}
            />

            {/* Floating Elements */}
            <FloatingElements destination={currentDestination} />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                  {/* Left Column - Destination Info */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-white"
                  >
                    {/* Destination Badge */}
                    <motion.div
                      className="inline-flex items-center mb-4 md:mb-6"
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 2, 0],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div
                        className={`bg-gradient-to-r ${currentDestination.gradient} px-4 py-2 rounded-full flex items-center shadow-2xl backdrop-blur-sm border border-white/20`}
                      >
                        <span className="text-2xl mr-2">
                          {currentDestination.icon}
                        </span>
                        <span className="font-bold text-sm md:text-base">
                          {currentDestination.specialty}
                        </span>
                      </div>
                    </motion.div>

                    {/* Title */}
<Title 
  level={1} 
  className="mb-4 md:mb-6 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
  style={{ 
    color: 'white',
    textShadow: '1px 1px 4px rgba(0,0,0,0.9)' 
  }}
>
  {i18n.language === 'vi' ? currentDestination.titleVi : currentDestination.title}
</Title>

                    {/* Description */}
                    <Paragraph
                      className="text-gray-200 text-lg md:text-xl mb-6 md:mb-8 leading-relaxed max-w-2xl"
                      style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.6)" }}
                    >
                      {t(currentDestination.description)}
                    </Paragraph>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mb-6 md:mb-8">
                      <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center border border-white/20">
                        <StarFilled className="text-yellow-400 mr-2" />
                        <span className="font-bold">
                          {currentDestination.rating}
                        </span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center border border-white/20">
                        <EyeOutlined className="text-blue-400 mr-2" />
                        <span className="font-bold">
                          {currentDestination.views}
                        </span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center border border-white/20">
                        <EnvironmentOutlined className="text-green-400 mr-2" />
                        <span className="text-sm">
                          {i18n.language === "vi"
                            ? currentDestination.regionVi
                            : currentDestination.region}
                        </span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to={currentDestination.url}>
                        <Button
                          type="primary"
                          size="large"
                          className={`bg-gradient-to-r ${currentDestination.gradient} border-none hover:shadow-2xl transition-all duration-300 h-12 px-8`}
                          icon={<CompassOutlined className="text-lg" />}
                        >
                          <span className="ml-2 font-semibold">
                            {t("common:actions.explore")}{" "}
                            {i18n.language === "vi"
                              ? currentDestination.titleVi
                              : currentDestination.title}
                          </span>
                        </Button>
                      </Link>

                      <Link to={currentDestination.productUrl}>
                        <Button
                          size="large"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300 h-12 px-8"
                          icon={<FireOutlined className="text-lg" />}
                        >
                          <span className="ml-2 font-semibold">
                            {t("common:actions.shop_now")}
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </motion.div>

                  {/* Right Column - Áo Dài Showcase */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex justify-center lg:justify-end"
                  >
                    <Card
                      className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl max-w-sm w-full"
                      bodyStyle={{ padding: "24px" }}
                    >
                      {/* Áo Dài Preview */}
                      <div className="text-center mb-6">
                        <motion.div
                          className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center shadow-2xl"
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <span className="text-6xl">🇻🇳👕</span>
                        </motion.div>

                        <Title level={4} className="text-white mb-2">
                          Áo Thun Mosaic{" "}
                          {i18n.language === "vi"
                            ? currentDestination.titleVi
                            : currentDestination.title}
                        </Title>

                        <Text className="text-gray-300 block mb-4">
                          {i18n.language === "vi"
                            ? currentDestination.aoMauSac
                            : currentDestination.aoMauSacEn}
                        </Text>

                        <div className="flex justify-center gap-2 mb-4">
                          <Tag color="processing" className="border-white/20">
                            {currentDestination.aoStyle}
                          </Tag>
                          <Tag color="success" className="border-white/20">
                            Premium Silk
                          </Tag>
                        </div>

                        <div className="flex justify-between items-center">
                          <Text className="text-white/80">Starting from</Text>
                          <Title level={3} className="text-white m-0">
                            {currentDestination.aoPrice}
                          </Title>
                        </div>
                      </div>

                      {/* Quick Preview Button */}
                      <Link to={currentDestination.productUrl}>
                        <Button
                          type="primary"
                          block
                          size="large"
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/40 backdrop-blur-sm"
                          icon={<FireOutlined />}
                        >
{i18n.language === 'vi' ? 'Xem bộ sưu tập' : 'View Collection'}
                        </Button>
                      </Link>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Custom Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center gap-4 bg-black/20 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
            {/* Play/Pause Button */}
            <Button
              type="text"
              size="large"
              className="text-white hover:text-white/80 hover:bg-white/10 rounded-full p-2"
              icon={
                <CompassOutlined
                  className={`text-xl ${
                    isPlaying ? "opacity-100" : "opacity-50"
                  }`}
                />
              }
              onClick={togglePlayPause}
            />

            {/* Dots Navigation */}
            <div className="flex gap-2">
              {destinations.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-white shadow-lg"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Slide Counter */}
            <div className="text-white/80 text-sm font-medium">
              {currentSlide + 1} / {destinations.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
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
      </div>
    </section>
  );
};

// Enhanced tour guides list with Quảng Ninh featured
const tourGuides = [
  {
    id: "quangninh",
    title: "Quảng Ninh",
    titleVi: "Quảng Ninh",
    description: "destinationquangninh:overview.intro",
    image: "/assets/destinations/quangninh/daotiptop.png",
    url: "/destinations/quangninh",
    date: "2025-06-14",
    region: "Northeast Vietnam",
    regionVi: "Đông Bắc Việt Nam",
    color: "volcano",
    gradient: "from-slate-600 to-stone-700",
    featured: false,
    rating: 4.9,
    icon: <span className="text-2xl">🗿</span>,
    views: "2.5K",
    likes: "1.2K",
    isNew: true,
    specialty: "Limestone Karsts",
  },
  {
    id: "khanhhoa",
    title: "Khánh Hòa",
    titleVi: "Khánh Hòa",
    description: "destinationkhanhhoa:overview.intro",
    image: `/assets/destinations/khanhhoa/biennhatrang.png`,
    url: "/destinations/khanhhoa",
    date: "2025-06-14",
    region: "South Central Coast",
    regionVi: "Duyên Hải Nam Trung Bộ",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    featured: false,
    rating: 4.9,
    icon: <span className="text-2xl">🌊</span>,
    views: "3.1K",
    likes: "1.8K",
    isNew: false,
    specialty: "Coastal Paradise",
  },
  {
    id: "hcm",
    title: "Ho Chi Minh City",
    titleVi: "TP. Hồ Chí Minh",
    description: "destinationhcm:overview.intro",
    image: "/assets/destinations/hcm/landmark-81.jpg",
    url: "/destinations/hcm",
    date: "2025-02-10",
    region: "Southern Vietnam",
    regionVi: "Miền Nam Việt Nam",
    color: "volcano",
    gradient: "from-orange-500 to-red-500",
    featured: false,
    rating: 4.9,
    icon: <FireOutlined />,
    views: "4.7K",
    likes: "2.3K",
    isNew: false,
    specialty: "Urban Energy",
  },
  {
    id: "danang",
    title: "Da Nang",
    titleVi: "Đà Nẵng",
    description: "destinationdanang:overview.intro",
    image: "/assets/destinations/danang/danangcity.jpg",
    url: "/destinations/danang",
    date: "2025-02-15",
    region: "Central Vietnam",
    regionVi: "Miền Trung Việt Nam",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    featured: false,
    rating: 4.7,
    icon: <CompassOutlined />,
    views: "3.8K",
    likes: "1.9K",
    isNew: false,
    specialty: "Beach Culture",
  },
  {
    id: "hanoi",
    title: "Hanoi",
    titleVi: "Hà Nội",
    description: "destinationhanoi:overview.intro",
    image: "/assets/destinations/hanoi/ho-chi-minh-mausoleum.jpg",
    url: "/destinations/hanoi",
    date: "2025-02-20",
    region: "Northern Vietnam",
    regionVi: "Miền Bắc Việt Nam",
    color: "gold",
    gradient: "from-yellow-500 to-orange-500",
    featured: false,
    rating: 4.8,
    icon: <StarFilled />,
    views: "4.2K",
    likes: "2.1K",
    isNew: false,
    specialty: "Cultural Heritage",
  },
];

const BlogPage: React.FC = () => {
  const { t, i18n } = useTranslation([
    "destinationdanang",
    "destinationhanoi",
    "destinationhcm",
    "destinationkhanhhoa",
    "destinationquangninh",
    "common",
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardHoverVariants = {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  // Get the other destinations (excluding featured)
  const otherDestinations = tourGuides.filter((guide) => !guide.featured);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Enhanced Hero Section */}
        <HeroSection />

        <Divider className="my-8 md:my-12" />

        {/* Other Destinations Grid */}
        <section className="px-4 mb-16 md:mb-24">
          <div className="container mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12">
                <div className="flex items-center mb-4 md:mb-0">
                  <CompassOutlined className="text-primary text-2xl md:text-3xl mr-3" />
                  <Title
                    level={2}
                    className="dark:text-white m-0 text-xl md:text-2xl"
                  >
                    More Amazing Destinations
                  </Title>
                </div>
                <Button
                  type="primary"
                  size="large"
                  className="w-full md:w-auto"
                >
                  View All Destinations
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {otherDestinations.map((guide, index) => (
                  <motion.div
                    key={guide.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <Link to={guide.url}>
                      <motion.div
                        variants={cardHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        className="h-full"
                      >
                        <Card
                          hoverable
                          cover={
                            <div className="h-48 md:h-64 overflow-hidden relative">
                              <img
                                src={guide.image}
                                alt={
                                  i18n.language === "vi"
                                    ? guide.titleVi
                                    : guide.title
                                }
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                              {/* Stats overlay */}
                              <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center text-sm">
                                  <StarFilled className="text-yellow-500 mr-1" />
                                  <span className="font-bold text-gray-800">
                                    {guide.rating}
                                  </span>
                                </div>
                              </div>

                              {/* Hover overlay with actions */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="flex gap-3">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                  >
                                    <EyeOutlined />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                  >
                                    <HeartOutlined />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                  >
                                    <ShareAltOutlined />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          }
                          className="h-full shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800"
                        >
                          <div className="p-4 md:p-6">
                            <div className="flex items-start justify-between mb-3">
                              <Title
                                level={4}
                                className="mb-0 dark:text-white text-base md:text-lg"
                              >
                                {i18n.language === "vi"
                                  ? guide.titleVi
                                  : guide.title}
                              </Title>
                              <div className="text-xl md:text-2xl ml-2 flex-shrink-0">
                                {guide.icon}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              <Tag
                                color={guide.color}
                                icon={<EnvironmentOutlined />}
                                className="text-xs md:text-sm"
                              >
                                {i18n.language === "vi"
                                  ? guide.regionVi
                                  : guide.region}
                              </Tag>
                              <Tag
                                color="green"
                                icon={<CalendarOutlined />}
                                className="text-xs md:text-sm"
                              >
                                {new Date(guide.date).toLocaleDateString()}
                              </Tag>
                            </div>

                            <Paragraph className="dark:text-gray-300 mb-4 text-sm md:text-base line-clamp-3">
                              {t(guide.description)}
                            </Paragraph>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center">
                                  <EyeOutlined className="mr-1" />
                                  {guide.views}
                                </span>
                                <span className="flex items-center">
                                  <HeartOutlined className="mr-1" />
                                  {guide.likes}
                                </span>
                              </div>

                              <motion.div
                                whileHover={{ x: 5 }}
                                className="flex items-center text-primary font-medium text-sm md:text-base"
                              >
                                {guide.icon}
                                <Text strong className="dark:text-primary ml-2">
                                  {t("common:actions.explore")}
                                </Text>
                              </motion.div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action for more destinations */}
        <section className="px-4 mb-16">
          <div className="container mx-auto">
            <motion.div
              className="text-center p-8 md:p-12 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-800 dark:via-cyan-900 dark:to-teal-900 rounded-2xl md:rounded-3xl shadow-lg relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
                    animate={{
                      y: [0, -100, 0],
                      x: [0, Math.sin(i * 0.5) * 50, 0],
                      scale: [0, 1, 0],
                      opacity: [0, 0.6, 0],
                    }}
                    transition={{
                      duration: Math.random() * 8 + 6,
                      repeat: Infinity,
                      delay: Math.random() * 5,
                      ease: "easeInOut",
                    }}
                    style={{
                      left: Math.random() * 100 + "%",
                      top: Math.random() * 100 + "%",
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <Title
                  level={3}
                  className="dark:text-white mb-4 text-xl md:text-2xl"
                >
                  More Amazing Destinations Coming Soon
                </Title>
                <Paragraph className="text-base md:text-lg dark:text-gray-300 mb-6">
                  We're constantly expanding our collection of travel guides to
                  help you explore more of Vietnam's incredible destinations.
                  Stay tuned for comprehensive guides to Hue, Hoi An, Sapa, Phu
                  Quoc, and many more breathtaking locations!
                </Paragraph>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {[
                    { name: "Hue", color: "purple" },
                    { name: "Hoi An", color: "orange" },
                    { name: "Sapa", color: "green" },
                    { name: "Phu Quoc", color: "blue" },
                    { name: "Dalat", color: "pink" },
                    { name: "Can Tho", color: "cyan" },
                    { name: "Ha Long Bay", color: "emerald" },
                    { name: "Mui Ne", color: "amber" },
                  ].map((destination, index) => (
                    <motion.div
                      key={destination.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Tag
                        color={destination.color}
                        className="px-3 py-1 text-sm md:text-base font-medium cursor-pointer transition-transform hover:scale-105"
                      >
                        {destination.name}
                      </Tag>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default BlogPage;
