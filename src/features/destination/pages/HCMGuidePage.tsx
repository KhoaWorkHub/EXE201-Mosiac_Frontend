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
  ThunderboltOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import MainLayout from "@/components/layout/MainLayout";
import HCMTourGuideSteps from "../components/HCMTourGuideSteps";
import PhotoGallery from "../components/PhotoGallery";
import HCMAttractionCard from "../components/HCMAttractionCard";
import HCMWeatherWidget from "../components/HCMWeatherWidget";
import DestinationHeader from "../components/DestinationHeader";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// HCM images with vibrant, modern cityscape
const hcmImages = [
  "/assets/destinations/hcm/notre-dame-cathedral.jpg",
  "/assets/destinations/hcm/independence-palace.jpg",
  "/assets/destinations/hcm/ben-thanh-market.jpg",
  "/assets/destinations/hcm/central-post-office.jpg",
];

// HCM attractions with dynamic, modern feel
const attractionsData = [
  {
    id: 1,
    name: "Independence Palace",
    nameVi: "Dinh Độc Lập",
    image: "/assets/destinations/hcm/independence-palace.jpg",
    location: "District 1, Ho Chi Minh City",
    duration: "1-2 hours",
    rating: 4.6,
    description:
      "Historic presidential palace and symbol of Vietnamese independence, featuring stunning 1960s architecture and preserved war rooms.",
    descriptionVi:
      "Dinh thự tổng thống lịch sử và biểu tượng của nền độc lập Việt Nam, với kiến trúc tuyệt đẹp những năm 1960 và các phòng chiến tranh được bảo tồn.",
  },
  {
    id: 2,
    name: "Ben Thanh Market",
    nameVi: "Chợ Bến Thành",
    image: "/assets/destinations/hcm/ben-thanh-market.jpg",
    location: "District 1, Ho Chi Minh City",
    duration: "2-3 hours",
    rating: 4.4,
    description:
      "Iconic central market offering authentic Vietnamese street food, souvenirs, and a glimpse into local daily life.",
    descriptionVi:
      "Chợ trung tâm biểu tượng cung cấp đồ ăn đường phố Việt Nam chính thống, quà lưu niệm và cái nhìn về cuộc sống hàng ngày của người dân địa phương.",
  },
  {
    id: 3,
    name: "Notre-Dame Cathedral Basilica",
    nameVi: "Nhà thờ Đức Bà Sài Gòn",
    image: "/assets/destinations/hcm/notre-dame-cathedral.jpg",
    location: "District 1, Ho Chi Minh City",
    duration: "30-45 minutes",
    rating: 4.5,
    description:
      "Stunning French colonial architecture masterpiece built with materials imported from France, standing as a testament to Saigon's heritage.",
    descriptionVi:
      "Kiệt tác kiến trúc thuộc địa Pháp tuyệt đẹp được xây dựng bằng vật liệu nhập khẩu từ Pháp, đứng như một minh chứng cho di sản của Sài Gòn.",
  },
  {
    id: 4,
    name: "Landmark 81",
    nameVi: "Landmark 81",
    image: "/assets/destinations/hcm/landmark-81.jpg",
    location: "Binh Thanh District, Ho Chi Minh City",
    duration: "1-2 hours",
    rating: 4.7,
    description:
      "Southeast Asia's tallest building offering breathtaking 360-degree views of the bustling metropolis from the SkyBar observation deck.",
    descriptionVi:
      "Tòa nhà cao nhất Đông Nam Á mang đến tầm nhìn 360 độ ngoạn mục của đô thị nhộn nhịp từ đài quan sát SkyBar.",
  },
  {
    id: 5,
    name: "War Remnants Museum",
    nameVi: "Bảo tàng Chứng tích Chiến tranh",
    image: "/assets/destinations/hcm/war-remnants-museum.jpg",
    location: "District 3, Ho Chi Minh City",
    duration: "2-3 hours",
    rating: 4.6,
    description:
      "Powerful museum documenting the impact of war with authentic artifacts, photographs, and military equipment.",
    descriptionVi:
      "Bảo tàng mạnh mẽ ghi lại tác động của chiến tranh với các hiện vật chính thống, hình ảnh và thiết bị quân sự.",
  },
  {
    id: 6,
    name: "Saigon Central Post Office",
    nameVi: "Bưu điện Trung tâm Sài Gòn",
    image: "/assets/destinations/hcm/central-post-office.jpg",
    location: "District 1, Ho Chi Minh City",
    duration: "30 minutes",
    rating: 4.4,
    description:
      "Magnificent French colonial post office designed by Gustave Eiffel, featuring beautiful maps and intricate architecture.",
    descriptionVi:
      "Bưu điện thuộc địa Pháp tráng lệ được thiết kế bởi Gustave Eiffel, có các bản đồ đẹp và kiến trúc phức tạp.",
  },
];

const HCMGuidePage: React.FC = () => {
  const { t, i18n } = useTranslation(["destinationhcm", "common"]);

  // Always show tour guide on page load - removed localStorage check
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
      setCurrentImageIndex((prev) => (prev + 1) % hcmImages.length);
    }, 5000);

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

  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Weather data for HCM (tropical climate)
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherData = {
          temperature: 32,
          condition: "Sunny",
          humidity: 82,
          wind: 15,
          forecast: [
            { day: "Mon", temp: 32, condition: "Sunny" },
            { day: "Tue", temp: 31, condition: "Cloudy" },
            { day: "Wed", temp: 33, condition: "Sunny" },
            { day: "Thu", temp: 30, condition: "Rain" },
            { day: "Fri", temp: 32, condition: "Storm" },
          ],
        };

        setWeatherData(weatherData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  // Enhanced parallax effect
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
    setCurrentImageIndex((prev) => (prev + 1) % hcmImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + hcmImages.length) % hcmImages.length
    );
  };

  const handleImageError = (index: number) => {
    setImageLoadErrors((prev) => ({ ...prev, [index]: true }));
  };

  // Get current image with fallback
  const getCurrentImage = () => {
    const validImages = hcmImages.filter((_, index) => !imageLoadErrors[index]);
    if (validImages.length === 0) {
      return "/assets/destinations/hcm/default-hero.jpg";
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

  const energyVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-900 dark:via-red-900 dark:to-pink-900 relative overflow-hidden">
          {/* Animated energy particles background */}
          <div className="absolute inset-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute bg-gradient-to-t ${
                  i === 0
                    ? "from-orange-400/30 to-transparent"
                    : i === 1
                    ? "from-red-400/20 to-transparent"
                    : i === 2
                    ? "from-pink-400/15 to-transparent"
                    : i === 3
                    ? "from-orange-500/10 to-transparent"
                    : "from-red-500/5 to-transparent"
                }`}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.sin(i) * 15, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 6 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
                style={{
                  left: 15 + i * 20 + "%",
                  bottom: 0,
                  width: 60 + i * 25 + "px",
                  height: 120 + i * 40 + "px",
                  clipPath: `polygon(${25 + i * 5}% 0%, ${
                    75 - i * 5
                  }% 0%, 85% 100%, 15% 100%)`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
                y: [0, -15, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-3xl"
              >
                🏙️
              </motion.div>

              {/* Energy rings */}
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
              className="mt-4 text-xl bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent font-bold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Discovering vibrant Ho Chi Minh City...
            </motion.p>
          </div>

          {/* Floating energy sparks */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-60"
              animate={{
                y: [window.innerHeight, -50],
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 6 + 4,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 3,
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
      {/* Tour Guide - Always show on page load */}
      <AnimatePresence>
        {showTourGuide && <HCMTourGuideSteps onClose={closeTourGuide} />}
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

        {/* Dynamic gradient overlay */}
        <div className="absolute inset-0 bg-black/25"></div>

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
          {hcmImages.map((_, index) => (
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
          {hcmImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Preload ${index}`}
              onError={() => handleImageError(index)}
            />
          ))}
        </div>

        {/* Animated energy sparks */}
        <div className="absolute inset-0 z-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              animate={{
                y: [Math.random() * window.innerHeight, -100],
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                opacity: [0, 1, 0],
                scale: [0, Math.random() * 2 + 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
              style={{
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
            />
          ))}
        </div>

        {/* Urban energy elements */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              variants={energyVariants}
              animate="animate"
              className={`absolute bottom-0 ${
                i === 0
                  ? "w-28 h-32 bg-gradient-to-t from-orange-500/30 to-transparent"
                  : i === 1
                  ? "w-24 h-40 bg-gradient-to-t from-red-500/25 to-transparent"
                  : i === 2
                  ? "w-32 h-28 bg-gradient-to-t from-pink-500/20 to-transparent"
                  : "w-20 h-36 bg-gradient-to-t from-orange-400/15 to-transparent"
              }`}
              style={{
                left: i * 20 + 10 + "%",
                clipPath: `polygon(${20 + i * 3}% 0%, ${
                  80 - i * 3
                }% 0%, 90% 100%, 10% 100%)`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-20">
          <DestinationHeader
            title={
              i18n.language === "vi" ? "TP. Hồ Chí Minh" : "Ho Chi Minh City"
            }
            subtitle={t("overview.subtitle")}
            onShare={handleShare}
            onStartTour={restartTourGuide}
          />
        </div>

        {/* Enhanced scroll indicator */}
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
              🏙️
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-16 bg-white dark:bg-gray-800 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 1200 120" className="w-full h-full">
            <path
              d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-orange-500"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Enhanced Tab Design */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="hcm-tabs"
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
                      className="mb-2 md:mb-0 dark:text-white bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
                    >
                      {t("overview.title")}
                    </Title>
                    <Tag
                      color="volcano"
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
                    <Card className="h-full hcm-gradient-card">
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
                            whileHover={{ x: 5, color: "#ea580c" }}
                            transition={{ duration: 0.2 }}
                          >
                            {t(`overview.why_visit.reasons.${index}`)}
                          </motion.li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="h-full hcm-gradient-card">
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
                        <HCMWeatherWidget data={weatherData} />
                      </div>
                    </Card>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="mb-8 md:mb-12">
                  <Card className="hcm-gradient-card">
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
                      <Card className="text-center hcm-gradient-card h-full">
                        <CompassOutlined className="text-3xl md:text-4xl text-orange-500 mb-4" />
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
                      <Card className="text-center hcm-gradient-card h-full">
                        <ClockCircleOutlined className="text-3xl md:text-4xl text-red-500 mb-4" />
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
                      <Card className="text-center hcm-gradient-card h-full">
                        <EnvironmentOutlined className="text-3xl md:text-4xl text-pink-500 mb-4" />
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
                    className="mb-4 dark:text-white bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
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
                      <HCMAttractionCard
                        attraction={attraction}
                        language={i18n.language}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </TabPane>
          </Tabs>
        </div>
      </section>

      {/* Photo Gallery with Enhanced Effects */}
      <section
        ref={galleryRef}
        className="py-8 md:py-16 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 relative overflow-hidden"
      >
        {/* Animated background energy */}
        <div className="absolute inset-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-full h-full opacity-10 ${
                i === 0
                  ? "bg-gradient-to-r from-orange-400 to-red-400"
                  : i === 1
                  ? "bg-gradient-to-r from-red-400 to-pink-400"
                  : "bg-gradient-to-r from-pink-400 to-orange-400"
              }`}
              animate={{
                x: ["-100%", "100%"],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 12 + i * 3,
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
              className="mb-3 dark:text-white bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
            >
              {t("photo_gallery.title")}
            </Title>
            <Paragraph className="text-base md:text-lg dark:text-gray-300 max-w-3xl mx-auto">
              {t("photo_gallery.description")}
            </Paragraph>
          </div>

          <PhotoGallery inView={galleryInView} city="hcm" />
        </div>
      </section>

      {/* CTA with Dynamic Gradient */}
      <section className="py-8 md:py-16 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(249,115,22,0.8) 0%, rgba(239,68,68,0.8) 50%, rgba(236,72,153,0.8) 100%)",
              "linear-gradient(225deg, rgba(236,72,153,0.8) 0%, rgba(239,68,68,0.8) 50%, rgba(249,115,22,0.8) 100%)",
              "linear-gradient(45deg, rgba(249,115,22,0.8) 0%, rgba(239,68,68,0.8) 50%, rgba(236,72,153,0.8) 100%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

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
                  className="bg-white text-orange-600 h-12 font-bold hover:bg-gray-100 border-none shadow-lg w-full sm:w-auto"
                >
                  <ThunderboltOutlined className="mr-2" />
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
                  className="bg-transparent text-white border-white h-12 font-bold hover:bg-white hover:text-orange-600 shadow-lg w-full sm:w-auto"
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
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + Math.sin(i) * 30}%`,
              }}
            >
              {["🏙️", "🌆", "🏢", "🛵", "🍜", "☕", "🏛️", "🎭"][i]}
            </motion.div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default HCMGuidePage;
