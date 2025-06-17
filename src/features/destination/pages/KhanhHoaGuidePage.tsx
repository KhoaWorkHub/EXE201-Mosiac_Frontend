import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button, Typography, Tabs, Card, Tag, message } from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  CompassOutlined,
  PictureOutlined,
  CoffeeOutlined,
  ShopOutlined,
  CarOutlined,
  FireOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import MainLayout from "@/components/layout/MainLayout";
import KhanhHoaTourGuideSteps from "../components/KhanhHoaTourGuideSteps";
import PhotoGallery from "../components/PhotoGallery";
import KhanhHoaAttractionCard from "../components/KhanhHoaAttractionCard";
import KhanhHoaWeatherWidget from "../components/KhanhHoaWeatherWidget";
import DestinationHeader from "../components/DestinationHeader";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Khánh Hòa images with beautiful coastal views
const khanhHoaImages = [
  "/assets/destinations/khanhhoa/nha-trang-beach.jpg", // Nha Trang Bay aerial view
  "/assets/destinations/khanhhoa/vinpearl-land.jpg", // Vinpearl cable car
  "/assets/destinations/khanhhoa/island-hopping.jpg", // Po Nagar Cham Towers
  "/assets/destinations/khanhhoa/po-nagar-towers.jpg", // Sunset beach scene
];

// Khánh Hòa attractions with coastal and cultural highlights
const attractionsData = [
  {
    id: 1,
    name: "Nha Trang Beach",
    nameVi: "Bãi biển Nha Trang",
    image: "/assets/destinations/khanhhoa/nha-trang-beach.jpg",
    location: "Nha Trang City, Khánh Hòa",
    duration: "Full day",
    rating: 4.8,
    description:
      "One of Vietnam's most beautiful beaches with crystal clear turquoise waters, white sand, and perfect conditions for swimming and water sports.",
    descriptionVi:
      "Một trong những bãi biển đẹp nhất Việt Nam với làn nước trong xanh như ngọc, cát trắng mịn và điều kiện hoàn hảo cho bơi lội và thể thao dưới nước.",
  },
  {
    id: 2,
    name: "Vinpearl Land",
    nameVi: "Vinpearl Land",
    image: "/assets/destinations/khanhhoa/vinpearl-land.jpg",
    location: "Hon Tre Island, Khánh Hòa",
    duration: "6-8 hours",
    rating: 4.7,
    description:
      "A world-class entertainment complex accessible by the world's longest sea-crossing cable car, featuring theme parks, water parks, and luxury resorts.",
    descriptionVi:
      "Khu phức hợp giải trí đẳng cấp thế giới với cáp treo vượt biển dài nhất thế giới, bao gồm công viên chủ đề, công viên nước và resort cao cấp.",
  },
  {
    id: 3,
    name: "Po Nagar Cham Towers",
    nameVi: "Tháp Po Nagar",
    image: "/assets/destinations/khanhhoa/po-nagar-towers.jpg",
    location: "Nha Trang City, Khánh Hòa",
    duration: "1-2 hours",
    rating: 4.5,
    description:
      "Ancient Cham temple complex built between 7th-12th centuries, dedicated to Po Nagar goddess, offering insights into Cham culture and stunning city views.",
    descriptionVi:
      "Quần thể đền Chăm cổ được xây dựng từ thế kỷ 7-12, thờ nữ thần Po Nagar, mang đến cái nhìn sâu sắc về văn hóa Chăm và tầm nhìn tuyệt đẹp ra thành phố.",
  },
  {
    id: 4,
    name: "Mud Baths (I-Resort)",
    nameVi: "Tắm bùn I-Resort",
    image: "/assets/destinations/khanhhoa/mud-bath.jpg",
    location: "Cam Duc, Khánh Hòa",
    duration: "3-4 hours",
    rating: 4.6,
    description:
      "Unique therapeutic mud bathing experience with mineral-rich mud from local hot springs, offering relaxation and skin benefits in a beautiful natural setting.",
    descriptionVi:
      "Trải nghiệm tắm bùn trị liệu độc đáo với bùn giàu khoáng chất từ suối nước nóng địa phương, mang lại sự thư giãn và lợi ích cho da trong khung cảnh thiên nhiên tuyệt đẹp.",
  },
  {
    id: 5,
    name: "Island Hopping Tour",
    nameVi: "Tour khám phá các đảo",
    image: "/assets/destinations/khanhhoa/island-hopping.jpg",
    location: "Nha Trang Bay, Khánh Hòa",
    duration: "Full day",
    rating: 4.7,
    description:
      "Explore the pristine islands of Nha Trang Bay including Hon Mun, Hon Tam, and Hon Mieu, perfect for snorkeling, diving, and beach relaxation.",
    descriptionVi:
      "Khám phá các hòn đảo hoang sơ của vịnh Nha Trang bao gồm Hòn Mun, Hòn Tằm và Hòn Miễu, hoàn hảo cho lặn với ống thở, lặn biển và thư giãn trên bãi biển.",
  },
  {
    id: 6,
    name: "Yang Bay Waterfall",
    nameVi: "Thác Yang Bay",
    image: "/assets/destinations/khanhhoa/yang-bay-waterfall.jpg",
    location: "Khanh Son, Khánh Hòa",
    duration: "4-5 hours",
    rating: 4.4,
    description:
      "A spectacular eco-tourism site featuring multi-tiered waterfalls, crocodile farm, elephant rides, and lush tropical forest perfect for nature lovers.",
    descriptionVi:
      "Điểm du lịch sinh thái nspectacular với thác nước nhiều tầng, trại cá sấu, cưỡi voi và rừng nhiệt đới tươi tốt hoàn hảo cho những người yêu thiên nhiên.",
  },
];

const KhanhHoaGuidePage: React.FC = () => {
  const { t, i18n } = useTranslation(["destinationkhanhhoa", "common"]);
  const [showTourGuide, setShowTourGuide] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Hero image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<{
    [key: number]: boolean;
  }>({});

  interface WeatherData {
    temperature: number;
    condition: string;
    humidity: number;
    wind: number;
    forecast: {
      day: string;
      temp: number;
      condition: string;
    }[];
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const controls = useAnimation();

  // Animation refs
  const [overviewRef, overviewInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [attractionsRef, attractionsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [galleryRef, galleryInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const headerRef = useRef<HTMLDivElement>(null);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % khanhHoaImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Loading simulation with ocean waves effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Weather data for Khánh Hòa (tropical coastal climate)
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherData = {
          temperature: 28,
          condition: "Sunny",
          humidity: 78,
          wind: 18,
          forecast: [
            { day: "Mon", temp: 28, condition: "Sunny" },
            { day: "Tue", temp: 29, condition: "Sunny" },
            { day: "Wed", temp: 30, condition: "Cloudy" },
            { day: "Thu", temp: 27, condition: "Rain" },
            { day: "Fri", temp: 28, condition: "Sunny" },
          ],
        };

        setWeatherData(weatherData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  // Enhanced parallax effect with wave motion
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollPosition = window.scrollY;
        headerRef.current.style.backgroundPositionY = `${
          scrollPosition * 0.3
        }px`;
        headerRef.current.style.transform = `translateY(${
          scrollPosition * 0.1
        }px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation trigger
  useEffect(() => {
    if (overviewInView) {
      controls.start("visible");
    }
  }, [controls, overviewInView]);

  const closeTourGuide = () => {
    setShowTourGuide(false);
    message.success(t("tour_guide.close_success"));
  };

  const restartTourGuide = () => {
    setShowTourGuide(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: t("overview.title"),
          text: t("overview.intro"),
          url: window.location.href,
        })
        .catch(() => message.info(t("common:share.cancelled")));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => message.success(t("common:share.copied")))
        .catch(() => message.error(t("common:share.error")));
    }
  };

  // Carousel navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % khanhHoaImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + khanhHoaImages.length) % khanhHoaImages.length
    );
  };

  const handleImageError = (index: number) => {
    setImageLoadErrors((prev) => ({ ...prev, [index]: true }));
  };

  // Get current image with fallback
  const getCurrentImage = () => {
    // Filter out images that failed to load
    const validImages = khanhHoaImages.filter(
      (_, index) => !imageLoadErrors[index]
    );
    if (validImages.length === 0) {
      return "/assets/destinations/khanhhoa/default-hero.jpg"; // fallback image
    }

    const validIndex = currentImageIndex % validImages.length;
    return validImages[validIndex];
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const waveVariants = {
    animate: {
      x: [0, -100],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 8,
          ease: "linear",
        },
      },
    },
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900 dark:via-cyan-900 dark:to-teal-900 relative overflow-hidden">
          {/* Animated ocean waves background */}
          <div className="absolute inset-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute bottom-0 w-full h-32 bg-gradient-to-t ${
                  i === 0
                    ? "from-blue-400/30 to-transparent"
                    : i === 1
                    ? "from-cyan-400/20 to-transparent"
                    : "from-teal-400/10 to-transparent"
                }`}
                animate={{
                  x: ["-100%", "100%"],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
                style={{
                  clipPath: "polygon(0 50%, 100% 80%, 100% 100%, 0 100%)",
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-3xl"
              >
                🌊
              </motion.div>

              {/* Wave rings */}
              <motion.div
                className="absolute inset-0 border-4 border-white/30 rounded-full"
                animate={{
                  scale: [1, 2, 2.5],
                  opacity: [0.6, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </motion.div>
            <motion.p
              className="mt-4 text-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent font-bold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Diving into Khánh Hòa paradise...
            </motion.p>
          </div>

          {/* Floating bubbles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-blue-400/30 rounded-full opacity-60"
              animate={{
                y: [window.innerHeight, -50],
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                scale: [0, 1, 0],
                opacity: [0, 0.7, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 8 + 4,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 4,
              }}
              style={{
                left: Math.random() * 100 + "%",
              }}
            />
          ))}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Tour Guide */}
      <AnimatePresence>
        {showTourGuide && <KhanhHoaTourGuideSteps onClose={closeTourGuide} />}
      </AnimatePresence>

      {/* Hero Section with Image Carousel */}
      <section ref={headerRef} className="relative h-screen overflow-hidden">
        {/* Image Carousel Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${getCurrentImage()})`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
          />
        </AnimatePresence>

        {/* Dynamic gradient overlay with wave effects */}
        <div className="absolute inset-0 bg-black/15"></div>

        {/* Carousel Navigation */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
          <Button
            type="primary"
            shape="circle"
            icon={<LeftOutlined />}
            onClick={prevImage}
            className="bg-white/20 border-white/30 backdrop-blur-sm hover:bg-white/30 text-white"
            size="large"
          />
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
          <Button
            type="primary"
            shape="circle"
            icon={<RightOutlined />}
            onClick={nextImage}
            className="bg-white/20 border-white/30 backdrop-blur-sm hover:bg-white/30 text-white"
            size="large"
          />
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {khanhHoaImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Preload images */}
        <div className="hidden">
          {khanhHoaImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Preload ${index}`}
              onError={() => handleImageError(index)}
            />
          ))}
        </div>

        {/* Animated wave layers */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              variants={waveVariants}
              animate="animate"
              className={`absolute bottom-0 w-[200%] h-32 ${
                i === 0
                  ? "bg-gradient-to-r from-blue-500/40 to-cyan-500/40"
                  : i === 1
                  ? "bg-gradient-to-r from-cyan-500/30 to-teal-500/30"
                  : i === 2
                  ? "bg-gradient-to-r from-teal-500/20 to-blue-500/20"
                  : "bg-gradient-to-r from-blue-400/10 to-cyan-400/10"
              }`}
              style={{
                clipPath: `polygon(0 ${40 + i * 10}%, 100% ${
                  60 + i * 5
                }%, 100% 100%, 0 100%)`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Floating water particles */}
        <div className="absolute inset-0 z-10">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              animate={{
                y: [Math.random() * window.innerHeight, -50],
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                opacity: [0, 1, 0],
                scale: [0, Math.random() * 2 + 1, 0],
              }}
              transition={{
                duration: Math.random() * 12 + 8,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 5,
              }}
              style={{
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-20">
          <DestinationHeader
            title={i18n.language === "vi" ? "Khánh Hòa" : "Khánh Hòa"}
            subtitle={t("overview.subtitle")}
            onShare={handleShare}
            onStartTour={restartTourGuide}
          />
        </div>

        {/* Enhanced scroll indicator with wave motion */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white text-center z-30">
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center mb-2 backdrop-blur-sm bg-white/10">
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-4 bg-white rounded-full mt-2"
              />
            </div>
            <p className="text-sm font-medium">
              {t("common:actions.scroll_down")}
            </p>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-2"
            >
              🌊
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-16 bg-white dark:bg-gray-800 relative overflow-hidden">
        {/* Background wave pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 1200 120" className="w-full h-full">
            <path
              d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-blue-500"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Enhanced Tab Design with Ocean Theme */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="khanhhoa-tabs"
            centered
            size={isMobile ? "small" : "large"}
          >
            <TabPane
              tab={
                <span className="tab-item flex items-center">
                  <InfoCircleOutlined className="mr-2" />
                  {t("tabs.overview")}
                </span>
              }
              key="overview"
            >
              <motion.div
                ref={overviewRef}
                variants={containerVariants}
                initial="hidden"
                animate={overviewInView ? "visible" : "hidden"}
                className="py-4 md:py-8"
              >
                <motion.div variants={itemVariants} className="mb-6 md:mb-8">
                  <div className="flex flex-col md:flex-row md:items-center mb-4">
                    <Title
                      level={2}
                      className="mb-2 md:mb-0 dark:text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
                    >
                      {t("overview.title")}
                    </Title>
                    <Tag
                      color="blue"
                      className="ml-0 md:ml-4 text-sm md:text-lg px-3 py-1 w-fit"
                    >
                      <EnvironmentOutlined className="mr-1" />{" "}
                      {t("overview.region")}
                    </Tag>
                  </div>

                  <Paragraph className="text-base md:text-lg dark:text-gray-300">
                    {t("overview.intro")}
                  </Paragraph>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                  <motion.div variants={itemVariants}>
                    <Card className="h-full khanhhoa-gradient-card">
                      <Title
                        level={4}
                        className="mb-4 dark:text-white text-lg md:text-xl"
                      >
                        {t("overview.why_visit.title")}
                      </Title>
                      <ul className="list-disc pl-5 space-y-2 md:space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <motion.li
                            key={index}
                            className="dark:text-gray-300 text-sm md:text-base"
                            whileHover={{ x: 5, color: "#0891b2" }}
                            transition={{ duration: 0.2 }}
                          >
                            {t(`overview.why_visit.reasons.${index}`)}
                          </motion.li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="h-full khanhhoa-gradient-card">
                      <Title
                        level={4}
                        className="mb-4 dark:text-white text-lg md:text-xl"
                      >
                        {t("overview.best_time.title")}
                      </Title>
                      <Paragraph className="dark:text-gray-300 text-sm md:text-base">
                        {t("overview.best_time.description")}
                      </Paragraph>
                      <div className="mt-4">
                        <KhanhHoaWeatherWidget data={weatherData} />
                      </div>
                    </Card>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="mb-8 md:mb-12">
                  <Card className="khanhhoa-gradient-card">
                    <Title
                      level={4}
                      className="mb-4 dark:text-white text-lg md:text-xl"
                    >
                      {t("overview.cultural_significance.title")}
                    </Title>
                    <Paragraph className="dark:text-gray-300 text-sm md:text-base">
                      {t("overview.cultural_significance.description")}
                    </Paragraph>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="text-center khanhhoa-gradient-card h-full">
                        <CompassOutlined className="text-3xl md:text-4xl text-blue-500 mb-4" />
                        <Title
                          level={5}
                          className="dark:text-white text-base md:text-lg"
                        >
                          {t("overview.quick_facts.location")}
                        </Title>
                        <Text className="dark:text-gray-300 text-sm md:text-base">
                          {t("overview.quick_facts.location_value")}
                        </Text>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="text-center khanhhoa-gradient-card h-full">
                        <ClockCircleOutlined className="text-3xl md:text-4xl text-cyan-500 mb-4" />
                        <Title
                          level={5}
                          className="dark:text-white text-base md:text-lg"
                        >
                          {t("overview.quick_facts.time_zone")}
                        </Title>
                        <Text className="dark:text-gray-300 text-sm md:text-base">
                          {t("overview.quick_facts.time_zone_value")}
                        </Text>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="text-center khanhhoa-gradient-card h-full">
                        <EnvironmentOutlined className="text-3xl md:text-4xl text-teal-500 mb-4" />
                        <Title
                          level={5}
                          className="dark:text-white text-base md:text-lg"
                        >
                          {t("overview.quick_facts.population")}
                        </Title>
                        <Text className="dark:text-gray-300 text-sm md:text-base">
                          {t("overview.quick_facts.population_value")}
                        </Text>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </TabPane>

            <TabPane
              tab={
                <span className="tab-item flex items-center">
                  <PictureOutlined className="mr-2" />
                  {t("tabs.attractions")}
                </span>
              }
              key="attractions"
            >
              <motion.div
                ref={attractionsRef}
                variants={containerVariants}
                initial="hidden"
                animate={attractionsInView ? "visible" : "hidden"}
                className="py-4 md:py-8"
              >
                <motion.div variants={itemVariants} className="mb-6 md:mb-8">
                  <Title
                    level={2}
                    className="mb-4 dark:text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
                  >
                    {t("attractions.title")}
                  </Title>
                  <Paragraph className="text-base md:text-lg dark:text-gray-300">
                    {t("attractions.intro")}
                  </Paragraph>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
                >
                  {attractionsData.map((attraction) => (
                    <motion.div key={attraction.id} variants={itemVariants}>
                      <KhanhHoaAttractionCard
                        attraction={attraction}
                        language={i18n.language}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </TabPane>

            {/* Food Tab */}
            <TabPane
              tab={
                <span className="tab-item flex items-center">
                  <CoffeeOutlined className="mr-2" />
                  {t("tabs.food_and_drink")}
                </span>
              }
              key="food"
            >
              <div className="py-4 md:py-8">
                <Title
                  level={2}
                  className="mb-4 dark:text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
                >
                  {t("food.title")}
                </Title>
                <Paragraph className="text-base md:text-lg dark:text-gray-300 mb-6 md:mb-8">
                  {t("food.intro")}
                </Paragraph>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="khanhhoa-gradient-card h-full">
                        <div className="flex flex-col md:flex-row md:items-start">
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg mb-4 md:mb-0 md:mr-4 overflow-hidden flex items-center justify-center mx-auto md:mx-0 flex-shrink-0">
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="text-2xl md:text-3xl"
                            >
                              {index === 0
                                ? "🦐"
                                : index === 1
                                ? "🐟"
                                : index === 2
                                ? "🦀"
                                : "🦞"}
                            </motion.div>
                          </div>
                          <div className="text-center md:text-left flex-grow">
                            <Title
                              level={5}
                              className="mb-1 dark:text-white text-blue-700 text-base md:text-lg"
                            >
                              {t(`food.dishes.${index}.name`)}
                            </Title>
                            <Paragraph className="dark:text-gray-300 mb-2 text-sm md:text-base">
                              {t(`food.dishes.${index}.description`)}
                            </Paragraph>
                            <Tag color="blue" className="text-xs md:text-sm">
                              {t(`food.dishes.${index}.where_to_try`)}
                            </Tag>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabPane>

            {/* Shopping Tab */}
            <TabPane
              tab={
                <span className="tab-item flex items-center">
                  <ShopOutlined className="mr-2" />
                  {t("tabs.shopping")}
                </span>
              }
              key="shopping"
            >
              <div className="py-4 md:py-8">
                <Title
                  level={2}
                  className="mb-4 dark:text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
                >
                  {t("shopping.title")}
                </Title>
                <Paragraph className="text-base md:text-lg dark:text-gray-300 mb-6 md:mb-8">
                  {t("shopping.intro")}
                </Paragraph>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full khanhhoa-gradient-card">
                        <Title
                          level={4}
                          className="mb-2 dark:text-white text-blue-700 text-base md:text-lg"
                        >
                          {t(`shopping.places.${index}.name`)}
                        </Title>
                        <Paragraph className="dark:text-gray-300 mb-3 text-sm md:text-base">
                          {t(`shopping.places.${index}.description`)}
                        </Paragraph>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabPane>

            {/* Transport Tab */}
            <TabPane
              tab={
                <span className="tab-item flex items-center">
                  <CarOutlined className="mr-2" />
                  {t("tabs.getting_around")}
                </span>
              }
              key="transport"
            >
              <div className="py-4 md:py-8">
                <Title
                  level={2}
                  className="mb-4 dark:text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
                >
                  {t("transport.title")}
                </Title>
                <Paragraph className="text-base md:text-lg dark:text-gray-300 mb-6 md:mb-8">
                  {t("transport.intro")}
                </Paragraph>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full khanhhoa-gradient-card">
                        <Title
                          level={5}
                          className="mb-2 dark:text-white text-blue-700 text-base md:text-lg"
                        >
                          {t(`transport.options.${index}.name`)}
                        </Title>
                        <Paragraph className="dark:text-gray-300 text-sm md:text-base">
                          {t(`transport.options.${index}.description`)}
                        </Paragraph>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </section>

      {/* Photo Gallery with Ocean Effects */}
      <section
        ref={galleryRef}
        className="py-8 md:py-16 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-teal-900/20 relative overflow-hidden"
      >
        {/* Animated background waves */}
        <div className="absolute inset-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-full h-full opacity-10 ${
                i === 0
                  ? "bg-gradient-to-r from-blue-400 to-cyan-400"
                  : i === 1
                  ? "bg-gradient-to-r from-cyan-400 to-teal-400"
                  : "bg-gradient-to-r from-teal-400 to-blue-400"
              }`}
              animate={{
                x: ["-100%", "100%"],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 15 + i * 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
              style={{
                clipPath: `polygon(0 ${30 + i * 20}%, 100% ${
                  50 + i * 10
                }%, 100% ${70 + i * 10}%, 0 ${50 + i * 20}%)`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-6 md:mb-8">
            <Title
              level={2}
              className="mb-3 dark:text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
            >
              {t("photo_gallery.title")}
            </Title>
            <Paragraph className="text-base md:text-lg dark:text-gray-300 max-w-3xl mx-auto">
              {t("photo_gallery.description")}
            </Paragraph>
          </div>

          <PhotoGallery inView={galleryInView} city="khanhhoa" />
        </div>
      </section>

      {/* CTA with Ocean Wave Animation */}
      <section className="py-8 md:py-16 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Animated wave background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(59,130,246,0.8) 0%, rgba(6,182,212,0.8) 50%, rgba(20,184,166,0.8) 100%)",
              "linear-gradient(225deg, rgba(20,184,166,0.8) 0%, rgba(6,182,212,0.8) 50%, rgba(59,130,246,0.8) 100%)",
              "linear-gradient(45deg, rgba(59,130,246,0.8) 0%, rgba(6,182,212,0.8) 50%, rgba(20,184,166,0.8) 100%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Wave pattern overlay */}
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 1200 200"
            className="absolute bottom-0 w-full h-24 md:h-32"
          >
            <motion.path
              d="M0,100 C200,60 400,140 600,100 C800,60 1000,140 1200,100 L1200,200 L0,200 Z"
              fill="rgba(255,255,255,0.1)"
              animate={{
                d: [
                  "M0,100 C200,60 400,140 600,100 C800,60 1000,140 1200,100 L1200,200 L0,200 Z",
                  "M0,120 C200,80 400,160 600,120 C800,80 1000,160 1200,120 L1200,200 L0,200 Z",
                  "M0,100 C200,60 400,140 600,100 C800,60 1000,140 1200,100 L1200,200 L0,200 Z",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title
              level={2}
              className="text-white mb-4 text-xl md:text-2xl lg:text-3xl"
            >
              {t("cta.title")}
            </Title>
            <Paragraph className="text-base md:text-lg text-white mb-6 md:mb-8 max-w-3xl mx-auto">
              {t("cta.description")}
            </Paragraph>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="large"
                  onClick={restartTourGuide}
                  className="bg-white text-blue-600 h-12 font-bold hover:bg-gray-100 border-none shadow-lg w-full sm:w-auto"
                >
                  <FireOutlined className="mr-2" />
                  {t("cta.restart_tour")}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="large"
                  onClick={handleShare}
                  className="bg-transparent text-white border-white h-12 font-bold hover:bg-white hover:text-blue-600 shadow-lg w-full sm:w-auto"
                >
                  <ShareAltOutlined className="mr-2" />{" "}
                  {t("common:actions.share")}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating elements */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/20 text-2xl md:text-4xl"
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 20, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + Math.sin(i) * 30}%`,
              }}
            >
              {["🏖️", "🌊", "🐚", "🏝️", "⭐", "🌅", "🐠", "🦀"][i]}
            </motion.div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default KhanhHoaGuidePage;
