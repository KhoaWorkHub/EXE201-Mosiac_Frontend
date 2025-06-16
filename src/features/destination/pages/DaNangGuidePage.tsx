import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button, Typography, Tabs, Card, Tag, message } from 'antd';
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
  ThunderboltOutlined,
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import TourGuideSteps from '../components/TourGuideSteps';
import PhotoGallery from '../components/PhotoGallery';
import AttractionCard from '../components/AttractionCard';
import WeatherWidget from '../components/WeatherWidget';
import DestinationHeader from '../components/DestinationHeader';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Enhanced Da Nang images with more variety
const daNangImages = [
  '/assets/destinations/danang/golden-bridge.jpg',
  '/assets/destinations/danang/my-khe-beach.jpg',
  '/assets/destinations/danang/marble-mountains.jpg',
  '/assets/destinations/danang/son-tra.jpg',
  '/assets/destinations/danang/dragon-bridge.jpg',
  '/assets/destinations/danang/hai-van-pass.jpg',
];

// Enhanced attractions data
const attractionsData = [
  {
    id: 1,
    name: 'Golden Bridge',
    nameVi: 'Cầu Vàng',
    image: '/assets/destinations/danang/golden-bridge.jpg',
    location: 'Ba Na Hills',
    duration: '2-3 hours',
    rating: 4.8,
    description: 'The world-famous Golden Bridge held up by giant stone hands, offering breathtaking panoramic views of the Da Nang mountains and coastline.',
    descriptionVi: 'Cây cầu Vàng nổi tiếng thế giới được nâng đỡ bởi những bàn tay đá khổng lồ, mang đến tầm nhìn toàn cảnh ngoạn mục về núi non và bờ biển Đà Nẵng.',
  },
  {
    id: 2,
    name: 'Marble Mountains',
    nameVi: 'Ngũ Hành Sơn',
    image: '/assets/destinations/danang/marble-mountains.jpg',
    location: 'Ngu Hanh Son District',
    duration: '2-4 hours',
    rating: 4.6,
    description: 'A sacred cluster of five marble and limestone hills with mystical caves, ancient temples, and Buddhist sanctuaries.',
    descriptionVi: 'Một quần thể thiêng liêng gồm năm ngọn núi đá cẩm thạch và đá vôi với hang động huyền bí, đền cổ và các thánh địa Phật giáo.',
  },
  {
    id: 3,
    name: 'My Khe Beach',
    nameVi: 'Biển Mỹ Khê',
    image: '/assets/destinations/danang/my-khe-beach.jpg',
    location: 'Da Nang City',
    duration: 'Half to full day',
    rating: 4.7,
    description: 'One of the world\'s most beautiful beaches with pristine white sand, crystal-clear waters, and perfect waves for surfing.',
    descriptionVi: 'Một trong những bãi biển đẹp nhất thế giới với cát trắng tinh khiết, làn nước trong như pha lê và sóng hoàn hảo để lướt sóng.',
  },
  {
    id: 4,
    name: 'Dragon Bridge',
    nameVi: 'Cầu Rồng',
    image: '/assets/destinations/danang/dragon-bridge.jpg',
    location: 'Da Nang City Center',
    duration: '1-2 hours',
    rating: 4.5,
    description: 'An architectural marvel shaped like a golden dragon that breathes fire and water every weekend, symbolizing Da Nang\'s power and prosperity.',
    descriptionVi: 'Một kỳ quan kiến trúc có hình dạng con rồng vàng phun lửa và nước mỗi cuối tuần, tượng trưng cho sức mạnh và sự thịnh vượng của Đà Nẵng.',
  },
  {
    id: 5,
    name: 'Son Tra Peninsula',
    nameVi: 'Bán đảo Sơn Trà',
    image: '/assets/destinations/danang/son-tra.jpg',
    location: '10km from Da Nang',
    duration: 'Half to full day',
    rating: 4.6,
    description: 'A pristine natural reserve featuring the majestic Lady Buddha statue, endangered red-shanked douc langurs, and untouched beaches.',
    descriptionVi: 'Khu bảo tồn thiên nhiên hoang sơ với tượng Phật Bà uy nghi, loài voọc chà vá chân nâu quý hiếm và những bãi biển hoang sơ.',
  },
  {
    id: 6,
    name: 'Hai Van Pass',
    nameVi: 'Đèo Hải Vân',
    image: '/assets/destinations/danang/hai-van-pass.jpg',
    location: 'Between Da Nang and Hue',
    duration: '2-3 hours',
    rating: 4.9,
    description: 'The legendary "Sea Cloud Pass" offering the most spectacular coastal mountain views in Vietnam, featured in Top Gear as one of the world\'s most beautiful roads.',
    descriptionVi: 'Đèo "Hải Vân" huyền thoại mang đến cảnh quan núi biển ngoạn mục nhất Việt Nam, được giới thiệu trong Top Gear như một trong những con đường đẹp nhất thế giới.',
  },
];

const DaNangGuidePage: React.FC = () => {
  const { t, i18n } = useTranslation(['destinationdanang', 'common']);
  
  // Always show tour guide on first visit
  const [showTourGuide, setShowTourGuide] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Enhanced hero carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<{[key: number]: boolean}>({});
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
  const [overviewRef, overviewInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [attractionsRef, attractionsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [galleryRef, galleryInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  const headerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Enhanced auto-advance carousel with pause on hover
  useEffect(() => {
    if (isAutoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % daNangImages.length);
      }, 6000);
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
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Enhanced loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Enhanced weather data for Da Nang
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherData = {
          temperature: 28,
          condition: 'Sunny',
          humidity: 72,
          wind: 15,
          forecast: [
            { day: 'Mon', temp: 28, condition: 'Sunny' },
            { day: 'Tue', temp: 30, condition: 'Sunny' },
            { day: 'Wed', temp: 27, condition: 'Cloudy' },
            { day: 'Thu', temp: 26, condition: 'Rain' },
            { day: 'Fri', temp: 29, condition: 'Sunny' },
          ]
        };
        
        setWeatherData(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    
    fetchWeatherData();
  }, []);
  
  // Enhanced parallax effect with mountain mist
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollPosition = window.scrollY;
        headerRef.current.style.backgroundPositionY = `${scrollPosition * 0.3}px`;
        headerRef.current.style.transform = `translateY(${scrollPosition * 0.15}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Animation trigger
  useEffect(() => {
    if (overviewInView) {
      controls.start('visible');
    }
  }, [controls, overviewInView]);
  
  const closeTourGuide = () => {
    setShowTourGuide(false);
    message.success(t('tour_guide.close_success'));
  };
  
  const restartTourGuide = () => {
    setShowTourGuide(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t('overview.title'),
        text: t('overview.intro'),
        url: window.location.href,
      })
      .catch(() => message.info(t('common:share.cancelled')));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => message.success(t('common:share.copied')))
        .catch(() => message.error(t('common:share.error')));
    }
  };
  
  // Enhanced carousel navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % daNangImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + daNangImages.length) % daNangImages.length);
  };
  
  const handleImageError = (index: number) => {
    setImageLoadErrors(prev => ({ ...prev, [index]: true }));
  };
  
  // Get current image with fallback
  const getCurrentImage = () => {
    const validImages = daNangImages.filter((_, index) => !imageLoadErrors[index]);
    if (validImages.length === 0) {
      return '/assets/destinations/danang/default-hero.jpg';
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
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const mountainVariants = {
    animate: {
      y: [0, -15, 0],
      x: [0, 5, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 8,
          ease: "easeInOut",
        },
        x: {
          repeat: Infinity,
          repeatType: "reverse", 
          duration: 12,
          ease: "easeInOut",
        },
      },
    },
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 relative overflow-hidden">
          {/* Animated Da Nang mountains background */}
          <div className="absolute inset-0">
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute bg-gradient-to-t ${
                  i === 0 ? 'from-amber-400/40 to-transparent' :
                  i === 1 ? 'from-orange-400/30 to-transparent' :
                  i === 2 ? 'from-yellow-400/25 to-transparent' :
                  i === 3 ? 'from-amber-500/20 to-transparent' :
                  i === 4 ? 'from-orange-500/15 to-transparent' :
                  i === 5 ? 'from-yellow-500/12 to-transparent' :
                  'from-amber-600/8 to-transparent'
                }`}
                animate={{
                  y: [0, -25, 0],
                  x: [0, Math.sin(i) * 15, 0],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.8,
                }}
                style={{
                  left: 8 + i * 12 + '%',
                  bottom: 0,
                  width: 120 + i * 25 + 'px',
                  height: 180 + i * 35 + 'px',
                  clipPath: `polygon(${12 + i * 4}% 0%, ${88 - i * 4}% 0%, 95% 100%, 5% 100%)`,
                }}
              />
            ))}
          </div>
          
          {/* Golden Bridge hands effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-8xl opacity-10"
            >
              🌉
            </motion.div>
          </div>
          
          <div className="relative z-10">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 360],
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-28 h-28 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="text-4xl"
              >
                🏔️
              </motion.div>
              
              {/* Mountain mist rings */}
              <motion.div
                className="absolute inset-0 border-4 border-white/40 rounded-full"
                animate={{
                  scale: [1, 2.5, 3],
                  opacity: [0.8, 0.3, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              <motion.div
                className="absolute inset-0 border-2 border-amber-300/60 rounded-full"
                animate={{
                  scale: [1, 2, 2.5],
                  opacity: [0.6, 0.2, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5
                }}
              />
            </motion.div>
            <motion.p 
              className="mt-4 text-xl bg-gradient-to-r from-amber-700 via-orange-700 to-yellow-800 bg-clip-text text-transparent font-bold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              Discovering Da Nang wonders...
            </motion.p>
          </div>
          
          {/* Floating golden particles */}
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-70"
              animate={{
                y: [window.innerHeight, -80],
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                scale: [0, 1.5, 0],
                opacity: [0, 0.9, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: Math.random() * 10 + 8,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 6,
              }}
              style={{
                left: Math.random() * 100 + '%',
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
        {showTourGuide && (
          <TourGuideSteps onClose={closeTourGuide} />
        )}
      </AnimatePresence>
      
      {/* Enhanced Hero Section with Da Nang Mountain Theme */}
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
            initial={{ opacity: 0, scale: 1.2, rotate: 0.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: -0.5 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${getCurrentImage()})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover'
            }}
          />
        </AnimatePresence>
        
        {/* Dynamic gradient overlay with Da Nang golden theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-orange-800/70 to-yellow-700/60"></div>
        
        {/* Enhanced mountain silhouette layers */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              variants={mountainVariants}
              animate="animate"
              className={`absolute bottom-0 ${
                i === 0 ? 'w-40 h-64 bg-gradient-to-t from-amber-800/70 to-transparent' :
                i === 1 ? 'w-36 h-72 bg-gradient-to-t from-orange-800/60 to-transparent' :
                i === 2 ? 'w-44 h-56 bg-gradient-to-t from-yellow-800/50 to-transparent' :
                i === 3 ? 'w-32 h-68 bg-gradient-to-t from-amber-700/40 to-transparent' :
                i === 4 ? 'w-48 h-52 bg-gradient-to-t from-orange-700/35 to-transparent' :
                i === 5 ? 'w-28 h-76 bg-gradient-to-t from-yellow-700/30 to-transparent' :
                i === 6 ? 'w-52 h-48 bg-gradient-to-t from-amber-600/25 to-transparent' :
                'w-24 h-80 bg-gradient-to-t from-orange-600/20 to-transparent'
              }`}
              style={{
                left: i * 12 + 3 + '%',
                clipPath: `polygon(${10 + i * 5}% 0%, ${90 - i * 5}% 0%, 95% 100%, 5% 100%)`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>
        
        {/* Enhanced Carousel Navigation */}
        <div className="absolute top-1/2 left-6 transform -translate-y-1/2 z-20">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              type="primary"
              shape="circle"
              icon={<LeftOutlined />}
              onClick={prevImage}
              className="bg-gradient-to-r from-amber-500/80 to-orange-500/80 border-none backdrop-blur-sm hover:from-amber-600/90 hover:to-orange-600/90 text-white shadow-2xl"
              size="large"
            />
          </motion.div>
        </div>
        
        <div className="absolute top-1/2 right-6 transform -translate-y-1/2 z-20">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              type="primary"
              shape="circle"
              icon={<RightOutlined />}
              onClick={nextImage}
              className="bg-gradient-to-r from-amber-500/80 to-orange-500/80 border-none backdrop-blur-sm hover:from-amber-600/90 hover:to-orange-600/90 text-white shadow-2xl"
              size="large"
            />
          </motion.div>
        </div>
        
        {/* Enhanced image indicators */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {daNangImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-all duration-500 ${
                index === currentImageIndex 
                  ? 'w-8 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg' 
                  : 'w-3 h-3 bg-white/60 rounded-full hover:bg-white/80'
              }`}
            />
          ))}
        </div>
        
        {/* Preload images */}
        <div className="hidden">
          {daNangImages.map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`Preload ${index}`}
              onError={() => handleImageError(index)}
            />
          ))}
        </div>
        
        {/* Floating golden mist particles */}
        <div className="absolute inset-0 z-10">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-amber-300/80 to-orange-400/60 rounded-full"
              animate={{
                y: [Math.random() * window.innerHeight, -100],
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                opacity: [0, 1, 0],
                scale: [0, Math.random() * 3 + 1, 0],
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 8,
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
        
        {/* Golden Bridge inspired floating hands */}
        <div className="absolute inset-0 z-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-6xl opacity-20"
              animate={{
                y: [0, -40, 0],
                x: [0, Math.sin(i * 2) * 20, 0],
                rotate: [0, 10, -10, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 3,
              }}
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + Math.sin(i) * 20}%`,
              }}
            >
              🤲
            </motion.div>
          ))}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <DestinationHeader 
            title={i18n.language === 'vi' ? 'Đà Nẵng' : 'Da Nang'}
            subtitle={t('overview.subtitle')}
            onShare={handleShare}
            onSave={() => message.info('Save feature coming soon!')}
            onStartTour={restartTourGuide}
          />
        </div>
        
        {/* Enhanced scroll indicator with mountain theme */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white text-center z-20">
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <div className="w-10 h-16 border-2 border-white/80 rounded-full flex justify-center mb-3 backdrop-blur-sm bg-gradient-to-b from-white/10 to-transparent">
              <motion.div
                animate={{ y: [0, 24, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-2 h-6 bg-gradient-to-b from-amber-300 to-orange-400 rounded-full mt-3"
              />
            </div>
            <p className="text-sm font-medium mb-2">{t('common:actions.scroll_down')}</p>
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-2 text-2xl"
            >
              🏔️
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced Content Section */}
      <section className="py-8 md:py-16 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20 dark:from-gray-800 dark:via-amber-900/10 dark:to-orange-900/10 relative overflow-hidden">
        {/* Background mountain pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 1200 120" className="w-full h-full">
            <path d="M0,60 C200,30 400,90 600,60 C800,30 1000,90 1200,60 L1200,120 L0,120 Z" fill="currentColor" className="text-amber-600"/>
            <path d="M0,80 C150,50 350,110 600,80 C850,50 1050,110 1200,80 L1200,120 L0,120 Z" fill="currentColor" className="text-orange-600"/>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Enhanced Tab Design with Da Nang Golden Theme */}
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="danang-tabs"
            centered
            size={isMobile ? "small" : "large"}
          >
            <TabPane 
              tab={
                <span className="tab-item flex items-center">
                  <InfoCircleOutlined className="mr-2" />
                  {t('tabs.overview')}
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
                    <Title level={2} className="mb-2 md:mb-0 dark:text-white bg-gradient-to-r from-amber-700 via-orange-700 to-yellow-800 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl">
                      {t('overview.title')}
                    </Title>
                    <Tag color="orange" className="ml-0 md:ml-4 text-sm md:text-lg px-3 py-1 w-fit">
                      <EnvironmentOutlined className="mr-1" /> {t('overview.region')}
                    </Tag>
                  </div>
                  
                  <Paragraph className="text-base md:text-lg dark:text-gray-300">
                    {t('overview.intro')}
                  </Paragraph>
                </motion.div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                  <motion.div variants={itemVariants}>
                    <Card className="h-full danang-gradient-card">
                      <Title level={4} className="mb-4 dark:text-white text-lg md:text-xl">
                        {t('overview.why_visit.title')}
                      </Title>
                      <ul className="list-disc pl-5 space-y-2 md:space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <motion.li 
                            key={index} 
                            className="dark:text-gray-300 text-sm md:text-base"
                            whileHover={{ x: 5, color: '#d97706' }}
                            transition={{ duration: 0.2 }}
                          >
                            {t(`overview.why_visit.reasons.${index}`)}
                          </motion.li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Card className="h-full danang-gradient-card">
                      <Title level={4} className="mb-4 dark:text-white text-lg md:text-xl">
                        {t('overview.best_time.title')}
                      </Title>
                      <Paragraph className="dark:text-gray-300 text-sm md:text-base">
                        {t('overview.best_time.description')}
                      </Paragraph>
                      <div className="mt-4">
                        <WeatherWidget data={weatherData} />
                      </div>
                    </Card>
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants} className="mb-8 md:mb-12">
                  <Card className="danang-gradient-card">
                    <Title level={4} className="mb-4 dark:text-white text-lg md:text-xl">
                      {t('overview.cultural_significance.title')}
                    </Title>
                    <Paragraph className="dark:text-gray-300 text-sm md:text-base">
                      {t('overview.cultural_significance.description')}
                    </Paragraph>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                      <Card className="text-center danang-gradient-card h-full">
                        <CompassOutlined className="text-3xl md:text-4xl text-amber-600 mb-4" />
                        <Title level={5} className="dark:text-white text-base md:text-lg">
                          {t('overview.quick_facts.location')}
                        </Title>
                        <Text className="dark:text-gray-300 text-sm md:text-base">
                          {t('overview.quick_facts.location_value')}
                        </Text>
                      </Card>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                      <Card className="text-center danang-gradient-card h-full">
                        <ClockCircleOutlined className="text-3xl md:text-4xl text-orange-600 mb-4" />
                        <Title level={5} className="dark:text-white text-base md:text-lg">
                          {t('overview.quick_facts.time_zone')}
                        </Title>
                        <Text className="dark:text-gray-300 text-sm md:text-base">
                          {t('overview.quick_facts.time_zone_value')}
                        </Text>
                      </Card>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                      <Card className="text-center danang-gradient-card h-full">
                        <EnvironmentOutlined className="text-3xl md:text-4xl text-yellow-600 mb-4" />
                        <Title level={5} className="dark:text-white text-base md:text-lg">
                          {t('overview.quick_facts.population')}
                        </Title>
                        <Text className="dark:text-gray-300 text-sm md:text-base">
                          {t('overview.quick_facts.population_value')}
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
                  {t('tabs.attractions')}
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
                  <Title level={2} className="mb-4 dark:text-white bg-gradient-to-r from-amber-700 via-orange-700 to-yellow-800 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl">
                    {t('attractions.title')}
                  </Title>
                  <Paragraph className="text-base md:text-lg dark:text-gray-300">
                    {t('attractions.intro')}
                  </Paragraph>
                </motion.div>
                
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
                >
                  {attractionsData.map((attraction) => (
                    <motion.div key={attraction.id} variants={itemVariants}>
                      <AttractionCard 
                        attraction={attraction}
                        language={i18n.language}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </TabPane>
            
            {/* Other tabs with similar enhancements... */}
            <TabPane 
              tab={
                <span className="tab-item flex items-center">
                  <CoffeeOutlined className="mr-2" />
                  {t('tabs.food_and_drink')}
                </span>
              } 
              key="food"
            >
              <div className="py-4 md:py-8">
                <Title level={2} className="mb-4 dark:text-white bg-gradient-to-r from-amber-700 via-orange-700 to-yellow-800 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl">
                  {t('food.title')}
                </Title>
                <Paragraph className="text-base md:text-lg dark:text-gray-300 mb-6 md:mb-8">
                  {t('food.intro')}
                </Paragraph>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="danang-gradient-card h-full">
                        <div className="flex flex-col md:flex-row md:items-start">
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-4 md:mb-0 md:mr-4 overflow-hidden flex items-center justify-center mx-auto md:mx-0 flex-shrink-0">
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="text-2xl md:text-3xl"
                            >
                              {index === 0 ? '🍜' : index === 1 ? '🥞' : index === 2 ? '🦐' : '🥘'}
                            </motion.div>
                          </div>
                          <div className="text-center md:text-left flex-grow">
                            <Title level={5} className="mb-1 dark:text-white text-amber-700 text-base md:text-lg">
                              {t(`food.dishes.${index}.name`)}
                            </Title>
                            <Paragraph className="dark:text-gray-300 mb-2 text-sm md:text-base">
                              {t(`food.dishes.${index}.description`)}
                            </Paragraph>
                            <Tag color="orange" className="text-xs md:text-sm">
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
                  {t('tabs.shopping')}
                </span>
              } 
              key="shopping"
            >
              <div className="py-4 md:py-8">
                <Title level={2} className="mb-4 dark:text-white bg-gradient-to-r from-amber-700 via-orange-700 to-yellow-800 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl">
                  {t('shopping.title')}
                </Title>
                <Paragraph className="text-base md:text-lg dark:text-gray-300 mb-6 md:mb-8">
                  {t('shopping.intro')}
                </Paragraph>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full danang-gradient-card">
                        <Title level={4} className="mb-2 dark:text-white text-amber-700 text-base md:text-lg">
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
                  {t('tabs.getting_around')}
                </span>
              } 
              key="transport"
            >
              <div className="py-4 md:py-8">
                <Title level={2} className="mb-4 dark:text-white bg-gradient-to-r from-amber-700 via-orange-700 to-yellow-800 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl">
                  {t('transport.title')}
                </Title>
                <Paragraph className="text-base md:text-lg dark:text-gray-300 mb-6 md:mb-8">
                  {t('transport.intro')}
                </Paragraph>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full danang-gradient-card">
                        <Title level={5} className="mb-2 dark:text-white text-amber-700 text-base md:text-lg">
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
      <section ref={galleryRef} className="py-8 md:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-6 md:mb-8">
            <Title level={2} className="mb-3 dark:text-white bg-gradient-to-r from-amber-700 via-orange-700 to-yellow-800 bg-clip-text text-transparent text-xl md:text-2xl lg:text-3xl">
              {t('photo_gallery.title')}
            </Title>
            <Paragraph className="text-base md:text-lg dark:text-gray-300 max-w-3xl mx-auto">
              {t('photo_gallery.description')}
            </Paragraph>
          </div>
          
          <PhotoGallery inView={galleryInView} city="danang" />
        </div>
      </section>
      
      {/* Enhanced CTA Section */}
      <section className="py-8 md:py-16 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Animated Da Nang themed background */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(245,158,11,0.8) 0%, rgba(251,146,60,0.8) 50%, rgba(245,158,11,0.8) 100%)',
              'linear-gradient(225deg, rgba(251,146,60,0.8) 0%, rgba(245,158,11,0.8) 50%, rgba(251,146,60,0.8) 100%)',
              'linear-gradient(45deg, rgba(245,158,11,0.8) 0%, rgba(251,146,60,0.8) 50%, rgba(245,158,11,0.8) 100%)'
            ]
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title level={2} className="text-white mb-4 text-xl md:text-2xl lg:text-3xl">
              {t('cta.title')}
            </Title>
            <Paragraph className="text-base md:text-lg text-white mb-6 md:mb-8 max-w-3xl mx-auto">
              {t('cta.description')}
            </Paragraph>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="large" 
                  onClick={restartTourGuide} 
                  className="bg-white text-amber-700 h-12 font-bold hover:bg-gray-100 border-none shadow-lg w-full sm:w-auto"
                >
                  <ThunderboltOutlined className="mr-2" />
                  {t('cta.restart_tour')}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="large" 
                  onClick={handleShare} 
                  className="bg-transparent text-white border-white h-12 font-bold hover:bg-white hover:text-amber-700 shadow-lg w-full sm:w-auto"
                >
                  <ShareAltOutlined className="mr-2" /> {t('common:actions.share')}
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Floating Da Nang elements */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/20 text-2xl md:text-4xl"
              animate={{
                y: [0, -40, 0],
                x: [0, Math.sin(i) * 30, 0],
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
              style={{
                left: `${8 + i * 8}%`,
                top: `${15 + Math.sin(i) * 40}%`,
              }}
            >
              {['🌉', '🏔️', '⛰️', '🏖️', '🐉', '🌊', '🏛️', '🍜', '🥞', '🦐', '🛵', '🌸'][i]}
            </motion.div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default DaNangGuidePage;