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
  LeftOutlined,
  RightOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import MainLayout from "@/components/layout/MainLayout";
import HanoiTourGuideSteps from "../components/HanoiTourGuideSteps";
import PhotoGallery from "../components/PhotoGallery";
import HanoiAttractionCard from "../components/HanoiAttractionCard";
import HanoiWeatherWidget from "../components/HanoiWeatherWidget";
import DestinationHeader from "../components/DestinationHeader";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Enhanced Hanoi images with cultural diversity
const hanoiImages = [
  "/assets/destinations/hanoi/hoan-kiem-lake.jpg",
  "/assets/destinations/hanoi/old-quarter.jpg",
  "/assets/destinations/hanoi/temple-literature.jpg",
  "/assets/destinations/hanoi/ho-chi-minh-mausoleum.jpg",
  "/assets/destinations/hanoi/one-pillar-pagoda.jpg",
  "/assets/destinations/hanoi/opera-house.jpg",
  "/assets/destinations/hanoi/hanoihohoankiem.jpg",
  "/assets/destinations/hanoi/hanoicity.jpg",
];

// Enhanced attractions data with deeper cultural context
const attractionsData = [
  {
    id: 1,
    name: "Hoan Kiem Lake",
    nameVi: "Hồ Hoàn Kiếm",
    image: "/assets/destinations/hanoi/hoan-kiem-lake.jpg",
    location: "Hoan Kiem District, Hanoi",
    duration: "1-2 hours",
    rating: 4.7,
    description:
      'The legendary "Lake of the Returned Sword" at the heart of Hanoi, featuring the iconic red Huc Bridge and mystical Ngoc Son Temple, where locals gather for morning tai chi and evening strolls.',
    descriptionVi:
      'Hồ "Hoàn Kiếm" huyền thoại ở trái tim Hà Nội, với cây cầu Thê Húc màu đỏ biểu tượng và đền Ngọc Sơn huyền bí, nơi người dân tập thái cực chi buổi sáng và đi dạo buổi tối.',
  },
  {
    id: 2,
    name: "Old Quarter",
    nameVi: "Phố Cổ Hà Nội",
    image: "/assets/destinations/hanoi/old-quarter.jpg",
    location: "Hoan Kiem District, Hanoi",
    duration: "3-5 hours",
    rating: 4.6,
    description:
      "A 1000-year-old labyrinth of narrow streets, each named after traditional crafts, where ancient shophouses blend with bustling street food vendors and artisan workshops.",
    descriptionVi:
      "Mê cung 1000 năm tuổi với những con phố hẹp, mỗi phố được đặt tên theo nghề thủ công truyền thống, nơi nhà ống cổ kính hòa quyện với xe đẩy thức ăn đường phố và xưởng thủ công.",
  },
  {
    id: 3,
    name: "Temple of Literature",
    nameVi: "Văn Miếu",
    image: "/assets/destinations/hanoi/temple-literature.jpg",
    location: "Dong Da District, Hanoi",
    duration: "1.5-2 hours",
    rating: 4.8,
    description:
      'Vietnam\'s first university (1070), a magnificent Confucian temple complex with ancient stelae, peaceful courtyards, and the famous "Well of Heavenly Clarity" symbolizing knowledge.',
    descriptionVi:
      'Trường đại học đầu tiên của Việt Nam (1070), quần thể đền Khổng Tử tráng lệ với bia đá cổ, sân trong yên bình và "Giếng Thiên Quang" nổi tiếng tượng trưng cho tri thức.',
  },
  {
    id: 4,
    name: "Ho Chi Minh Mausoleum",
    nameVi: "Lăng Chủ tịch Hồ Chí Minh",
    image: "/assets/destinations/hanoi/ho-chi-minh-mausoleum.jpg",
    location: "Ba Dinh District, Hanoi",
    duration: "2-3 hours",
    rating: 4.5,
    description:
      "The solemn resting place of Vietnam's founding father, surrounded by the Presidential Palace, Ho Chi Minh Museum, and beautiful botanical gardens reflecting national pride.",
    descriptionVi:
      "Nơi an nghỉ trang nghiêm của cha đẻ nước Việt Nam, được bao quanh bởi Phủ Chủ tịch, Bảo tàng Hồ Chí Minh và vườn bách thảo đẹp mắt phản ánh niềm tự hào dân tộc.",
  },
  {
    id: 5,
    name: "One Pillar Pagoda",
    nameVi: "Chùa Một Cột",
    image: "/assets/destinations/hanoi/one-pillar-pagoda.jpg",
    location: "Ba Dinh District, Hanoi",
    duration: "30-45 minutes",
    rating: 4.4,
    description:
      "An architectural marvel built in 1049, resembling a lotus blossom emerging from water, representing the Buddhist philosophy of purity rising from earthly suffering.",
    descriptionVi:
      "Kỳ quan kiến trúc được xây dựng năm 1049, giống như hoa sen nổi trên mặt nước, thể hiện triết lý Phật giáo về sự trong sạch vượt lên khỏi khổ đau trần thế.",
  },
  {
    id: 6,
    name: "Hanoi Opera House",
    nameVi: "Nhà hát Lớn Hà Nội",
    image: "/assets/destinations/hanoi/opera-house.jpg",
    location: "Hoan Kiem District, Hanoi",
    duration: "1-3 hours",
    rating: 4.6,
    description:
      "A stunning example of French colonial architecture (1911) inspired by Paris Opéra, hosting world-class performances and serving as a cultural beacon of modern Hanoi.",
    descriptionVi:
      "Ví dụ tuyệt đẹp của kiến trúc thuộc địa Pháp (1911) lấy cảm hứng từ Paris Opéra, tổ chức các buổi biểu diễn đẳng cấp thế giới và là ngọn hải đăng văn hóa của Hà Nội hiện đại.",
  },
];

const HanoiGuidePage: React.FC = () => {
  const { t, i18n } = useTranslation(["destinationhanoi", "common"]);

  // Always show tour guide on first visit
  const [showTourGuide, setShowTourGuide] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Enhanced hero carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<{
    [key: number]: boolean;
  }>({});
  const [isAutoPlay, setIsAutoPlay] = useState(true);

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
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced auto-advance carousel with cultural timing
  useEffect(() => {
    if (isAutoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % hanoiImages.length);
      }, 7000); // Slightly slower for cultural appreciation
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlay]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Enhanced loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  // Enhanced Hanoi weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherData = {
          temperature: 24,
          condition: "Cloudy",
          humidity: 78,
          wind: 8,
          forecast: [
            { day: "Mon", temp: 24, condition: "Cloudy" },
            { day: "Tue", temp: 22, condition: "Rain" },
            { day: "Wed", temp: 26, condition: "Sunny" },
            { day: "Thu", temp: 23, condition: "Cloudy" },
            { day: "Fri", temp: 25, condition: "Sunny" },
          ],
        };

        setWeatherData(weatherData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

// Fixed parallax effect - no transform to prevent blur
useEffect(() => {
  const handleScroll = () => {
    if (headerRef.current) {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight;
      
      // Only apply subtle parallax when hero is visible and reduce the effect
      if (scrollPosition < heroHeight) {
        headerRef.current.style.backgroundPositionY = `${scrollPosition * 0.05}px`;
      }
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
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

  // Enhanced carousel navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hanoiImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + hanoiImages.length) % hanoiImages.length
    );
  };

  const handleImageError = (index: number) => {
    setImageLoadErrors((prev) => ({ ...prev, [index]: true }));
  };

  // Get current image with fallback
  const getCurrentImage = () => {
    const validImages = hanoiImages.filter(
      (_, index) => !imageLoadErrors[index]
    );
    if (validImages.length === 0) {
      return "/assets/destinations/hanoi/default-hero.jpg";
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

  const templeVariants = {
    animate: {
      y: [0, -12, 0],
      rotateY: [0, 2, -2, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 9,
          ease: "easeInOut",
        },
        rotateY: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 15,
          ease: "easeInOut",
        },
      },
    },
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-red-50 to-orange-50 dark:from-yellow-900/20 dark:via-red-900/20 dark:to-orange-900/20 relative overflow-hidden">
          {/* Animated Hanoi traditional architecture background */}
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute bg-gradient-to-t ${
                  i === 0
                    ? "from-yellow-400/40 to-transparent"
                    : i === 1
                    ? "from-red-400/35 to-transparent"
                    : i === 2
                    ? "from-orange-400/30 to-transparent"
                    : i === 3
                    ? "from-yellow-500/25 to-transparent"
                    : i === 4
                    ? "from-red-500/20 to-transparent"
                    : i === 5
                    ? "from-orange-500/18 to-transparent"
                    : i === 6
                    ? "from-yellow-600/15 to-transparent"
                    : "from-red-600/12 to-transparent"
                }`}
                animate={{
                  y: [0, -18, 0],
                  x: [0, Math.cos(i) * 12, 0],
                }}
                transition={{
                  duration: 12 + i * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.6,
                }}
                style={{
                  left: 6 + i * 11 + "%",
                  bottom: 0,
                  width: 100 + i * 18 + "px",
                  height: 160 + i * 25 + "px",
                  clipPath: `polygon(${20 + i * 2}% 0%, ${
                    80 - i * 2
                  }% 0%, 85% 100%, 15% 100%)`,
                }}
              />
            ))}
          </div>

          {/* Traditional Vietnamese patterns */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [0.7, 1.3, 0.7],
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-9xl opacity-8"
            >
              🏛️
            </motion.div>
          </div>

          {/* Floating traditional elements */}
          <div className="absolute inset-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-6xl opacity-15"
                animate={{
                  y: [0, -35, 0],
                  x: [0, Math.sin(i * 1.5) * 25, 0],
                  rotate: [0, 15, -15, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 2,
                }}
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + Math.cos(i) * 30}%`,
                }}
              >
                {["🏮", "🐉", "🏯", "⛩️", "🎋", "🌸"][i]}
              </motion.div>
            ))}
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 360],
                y: [0, -25, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-32 h-32 bg-gradient-to-r from-yellow-500 via-red-500 to-orange-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="text-5xl"
              >
                🏛️
              </motion.div>

              {/* Traditional Vietnamese cultural rings */}
              <motion.div
                className="absolute inset-0 border-4 border-white/50 rounded-full"
                animate={{
                  scale: [1, 2.8, 3.2],
                  opacity: [0.9, 0.3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute inset-0 border-3 border-yellow-300/70 rounded-full"
                animate={{
                  scale: [1, 2.3, 2.8],
                  opacity: [0.7, 0.2, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.8,
                }}
              />
              <motion.div
                className="absolute inset-0 border-2 border-red-300/60 rounded-full"
                animate={{
                  scale: [1, 1.8, 2.3],
                  opacity: [0.5, 0.15, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 1.5,
                }}
              />
            </motion.div>
            <motion.p
              className="mt-6 text-xl bg-gradient-to-r from-yellow-800 via-red-800 to-orange-900 bg-clip-text text-transparent font-bold"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Exploring Hanoi heritage...
            </motion.p>
          </div>

          {/* Floating cultural particles */}
          {Array.from({ length: 22 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 via-red-400 to-orange-500 rounded-full opacity-75"
              animate={{
                y: [window.innerHeight, -100],
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                scale: [0, 1.8, 0],
                opacity: [0, 0.95, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 12 + 10,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 8,
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
        {showTourGuide && <HanoiTourGuideSteps onClose={closeTourGuide} />}
      </AnimatePresence>

      {/* Enhanced Hero Section with Hanoi Cultural Theme */}
      <section
        ref={headerRef}
        className="relative h-screen overflow-hidden"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        {/* Enhanced Image Carousel Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.15, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -50 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${getCurrentImage()})`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
          />
        </AnimatePresence>

        {/* Dynamic gradient overlay with Hanoi golden-red theme */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Traditional Vietnamese architectural silhouettes */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={i}
              variants={templeVariants}
              animate="animate"
              className={`absolute bottom-0 ${
                i === 0
                  ? "w-44 h-72 bg-gradient-to-t from-yellow-800/75 to-transparent"
                  : i === 1
                  ? "w-38 h-84 bg-gradient-to-t from-red-800/65 to-transparent"
                  : i === 2
                  ? "w-52 h-64 bg-gradient-to-t from-orange-800/55 to-transparent"
                  : i === 3
                  ? "w-34 h-88 bg-gradient-to-t from-yellow-700/45 to-transparent"
                  : i === 4
                  ? "w-56 h-60 bg-gradient-to-t from-red-700/40 to-transparent"
                  : i === 5
                  ? "w-30 h-96 bg-gradient-to-t from-orange-700/35 to-transparent"
                  : i === 6
                  ? "w-60 h-56 bg-gradient-to-t from-yellow-600/30 to-transparent"
                  : i === 7
                  ? "w-26 h-100 bg-gradient-to-t from-red-600/25 to-transparent"
                  : "w-64 h-52 bg-gradient-to-t from-orange-600/20 to-transparent"
              }`}
              style={{
                left: i * 10 + 2 + "%",
                clipPath: `polygon(${15 + i * 3}% 0%, ${
                  85 - i * 3
                }% 0%, 90% 100%, 10% 100%)`,
                animationDelay: `${i * 0.9}s`,
              }}
            />
          ))}
        </div>

        {/* Enhanced Carousel Navigation with cultural styling */}
        <div className="absolute top-1/2 left-6 transform -translate-y-1/2 z-20">
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Button
              type="primary"
              shape="circle"
              icon={<LeftOutlined />}
              onClick={prevImage}
              className="bg-gradient-to-r from-yellow-600/80 to-red-600/80 border-none backdrop-blur-sm hover:from-yellow-700/90 hover:to-red-700/90 text-white shadow-2xl"
              size="large"
            />
          </motion.div>
        </div>

        <div className="absolute top-1/2 right-6 transform -translate-y-1/2 z-20">
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Button
              type="primary"
              shape="circle"
              icon={<RightOutlined />}
              onClick={nextImage}
              className="bg-gradient-to-r from-yellow-600/80 to-red-600/80 border-none backdrop-blur-sm hover:from-yellow-700/90 hover:to-red-700/90 text-white shadow-2xl"
              size="large"
            />
          </motion.div>
        </div>

        {/* Enhanced cultural image indicators */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
          {hanoiImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-all duration-600 ${
                index === currentImageIndex
                  ? "w-10 h-4 bg-gradient-to-r from-yellow-400 via-red-400 to-orange-500 rounded-full shadow-lg border-2 border-white/50"
                  : "w-4 h-4 bg-white/70 rounded-full hover:bg-white/90 border border-white/30"
              }`}
            />
          ))}
        </div>

        {/* Preload images */}
        <div className="hidden">
          {hanoiImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Preload ${index}`}
              onError={() => handleImageError(index)}
            />
          ))}
        </div>

        {/* Traditional Vietnamese lantern-like floating particles */}
        <div className="absolute inset-0 z-10">
          {Array.from({ length: 35 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-yellow-300/90 via-red-400/70 to-orange-400/80 rounded-full"
              animate={{
                y: [Math.random() * window.innerHeight, -120],
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                opacity: [0, 1, 0],
                scale: [0, Math.random() * 4 + 1, 0],
              }}
              transition={{
                duration: Math.random() * 18 + 16,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 10,
              }}
              style={{
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
            />
          ))}
        </div>

        {/* Traditional Vietnamese cultural symbols floating */}
        <div className="absolute inset-0 z-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-7xl opacity-15"
              animate={{
                y: [0, -50, 0],
                x: [0, Math.cos(i * 2.5) * 25, 0],
                rotate: [0, 15, -15, 0],
                scale: [0.7, 1.3, 0.7],
              }}
              transition={{
                duration: 14 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 4,
              }}
              style={{
                left: `${18 + i * 25}%`,
                top: `${25 + Math.sin(i) * 25}%`,
              }}
            >
              {["🏮", "🐉", "⛩️", "🎋"][i]}
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-20">
          <DestinationHeader
            title={i18n.language === "vi" ? "Hà Nội" : "Hanoi"}
            subtitle={t("overview.subtitle")}
            onShare={handleShare}
            onSave={() => message.info("Save feature coming soon!")}
            onStartTour={restartTourGuide}
          />
        </div>

        {/* Enhanced scroll indicator with traditional Vietnamese elements */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white text-center z-20">
          <motion.div
            animate={{ y: [0, 25, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-20 border-2 border-white/90 rounded-full flex justify-center mb-4 backdrop-blur-sm bg-gradient-to-b from-white/15 to-transparent">
              <motion.div
                animate={{ y: [0, 32, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-3 h-8 bg-gradient-to-b from-yellow-300 via-red-400 to-orange-400 rounded-full mt-4"
              />
            </div>
            <p className="text-sm font-medium mb-3">
              {t("common:actions.scroll_down")}
            </p>
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                rotate: [0, 20, -20, 0],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="mt-2 text-3xl"
            >
              🏛️
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Content Section */}
      <section className="py-8 md:py-16 bg-gradient-to-br from-white via-yellow-50/40 to-red-50/30 dark:from-gray-800 dark:via-yellow-900/15 dark:to-red-900/15 relative overflow-hidden">
        {/* Traditional Vietnamese pattern background */}
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 1200 120" className="w-full h-full">
            <path
              d="M0,60 C200,25 400,95 600,60 C800,25 1000,95 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-yellow-600"
            />
            <path
              d="M0,80 C150,45 350,115 600,80 C850,45 1050,115 1200,80 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-red-600"
            />
            <path
              d="M0,100 C100,65 300,135 600,100 C900,65 1100,135 1200,100 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-orange-600"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Enhanced Tab Design with Hanoi Cultural Golden-Red Theme */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="hanoi-tabs"
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
                      className="mb-2 md:mb-0 dark:text-white bg-gradient-to-r from-yellow-700 via-red-700 to-orange-800 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
                    >
                      {t("overview.title")}
                    </Title>
                    <Tag
                      color="gold"
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
                    <Card className="h-full hanoi-gradient-card">
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
                            whileHover={{ x: 5, color: "#d97706" }}
                            transition={{ duration: 0.2 }}
                          >
                            {t(`overview.why_visit.reasons.${index}`)}
                          </motion.li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="h-full hanoi-gradient-card">
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
                        <HanoiWeatherWidget data={weatherData} />
                      </div>
                    </Card>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="mb-8 md:mb-12">
                  <Card className="hanoi-gradient-card">
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
                      <Card className="text-center hanoi-gradient-card h-full">
                        <CompassOutlined className="text-3xl md:text-4xl text-yellow-600 mb-4" />
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
                      <Card className="text-center hanoi-gradient-card h-full">
                        <ClockCircleOutlined className="text-3xl md:text-4xl text-red-600 mb-4" />
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
                      <Card className="text-center hanoi-gradient-card h-full">
                        <EnvironmentOutlined className="text-3xl md:text-4xl text-orange-600 mb-4" />
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
                    className="mb-4 dark:text-white bg-gradient-to-r from-yellow-700 via-red-700 to-orange-800 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
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
                      <HanoiAttractionCard
                        attraction={attraction}
                        language={i18n.language}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </TabPane>

            {/* Food Tab with cultural enhancements */}
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
                  className="mb-4 dark:text-white bg-gradient-to-r from-yellow-700 via-red-700 to-orange-800 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
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
                      <Card className="hanoi-gradient-card h-full">
                        <div className="flex flex-col md:flex-row md:items-start">
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-yellow-100 to-red-100 rounded-lg mb-4 md:mb-0 md:mr-4 overflow-hidden flex items-center justify-center mx-auto md:mx-0 flex-shrink-0">
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="text-2xl md:text-3xl"
                            >
                              {index === 0
                                ? "🍜"
                                : index === 1
                                ? "🥘"
                                : index === 2
                                ? "☕"
                                : "🥢"}
                            </motion.div>
                          </div>
                          <div className="text-center md:text-left flex-grow">
                            <Title
                              level={5}
                              className="mb-1 dark:text-white text-yellow-700 text-base md:text-lg"
                            >
                              {t(`food.dishes.${index}.name`)}
                            </Title>
                            <Paragraph className="dark:text-gray-300 mb-2 text-sm md:text-base">
                              {t(`food.dishes.${index}.description`)}
                            </Paragraph>
                            <Tag color="gold" className="text-xs md:text-sm">
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
                  className="mb-4 dark:text-white bg-gradient-to-r from-yellow-700 via-red-700 to-orange-800 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
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
                      <Card className="h-full hanoi-gradient-card">
                        <Title
                          level={4}
                          className="mb-2 dark:text-white text-yellow-700 text-base md:text-lg"
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
                  className="mb-4 dark:text-white bg-gradient-to-r from-yellow-700 via-red-700 to-orange-800 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
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
                      <Card className="h-full hanoi-gradient-card">
                        <Title
                          level={5}
                          className="mb-2 dark:text-white text-yellow-700 text-base md:text-lg"
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

      {/* Enhanced Photo Gallery */}
      <section
        ref={galleryRef}
        className="py-8 md:py-16 bg-gradient-to-br from-yellow-50 via-red-50 to-orange-100 dark:from-yellow-900/20 dark:via-red-900/20 dark:to-orange-900/20 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-6 md:mb-8">
            <Title
              level={2}
              className="mb-3 dark:text-white bg-gradient-to-r from-yellow-700 via-red-700 to-orange-800 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl"
            >
              {t("photo_gallery.title")}
            </Title>
            <Paragraph className="text-base md:text-lg dark:text-gray-300 max-w-3xl mx-auto">
              {t("photo_gallery.description")}
            </Paragraph>
          </div>

          <PhotoGallery inView={galleryInView} city="hanoi" />
        </div>
      </section>

      {/* Enhanced CTA Section with Traditional Vietnamese Theme */}
      <section className="py-8 md:py-16 bg-gradient-to-r from-yellow-600 via-red-600 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/15"></div>

        {/* Animated Hanoi cultural background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(234,179,8,0.8) 0%, rgba(220,38,38,0.8) 50%, rgba(234,179,8,0.8) 100%)",
              "linear-gradient(225deg, rgba(220,38,38,0.8) 0%, rgba(234,179,8,0.8) 50%, rgba(220,38,38,0.8) 100%)",
              "linear-gradient(45deg, rgba(234,179,8,0.8) 0%, rgba(220,38,38,0.8) 50%, rgba(234,179,8,0.8) 100%)",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />

        {/* Traditional Vietnamese pattern overlay */}
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
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
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
                  className="bg-white text-yellow-700 h-12 font-bold hover:bg-gray-100 border-none shadow-lg w-full sm:w-auto"
                >
                  <HeartOutlined className="mr-2" />
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
                  className="bg-transparent text-white border-white h-12 font-bold hover:bg-white hover:text-yellow-700 shadow-lg w-full sm:w-auto"
                >
                  <ShareAltOutlined className="mr-2" />{" "}
                  {t("common:actions.share")}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating Hanoi cultural elements */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/25 text-2xl md:text-4xl"
              animate={{
                y: [0, -50, 0],
                x: [0, Math.sin(i) * 35, 0],
                rotate: [0, 360],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.2,
              }}
              style={{
                left: `${6 + i * 6.5}%`,
                top: `${10 + Math.sin(i) * 45}%`,
              }}
            >
              {
                [
                  "🏮",
                  "🐉",
                  "🏛️",
                  "⛩️",
                  "🎋",
                  "🌸",
                  "🍜",
                  "☕",
                  "🥢",
                  "🏯",
                  "🎭",
                  "🎨",
                  "📿",
                  "🛕",
                  "🎪",
                ][i]
              }
            </motion.div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default HanoiGuidePage;
