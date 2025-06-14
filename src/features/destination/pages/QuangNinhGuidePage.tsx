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
  FireOutlined,
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import QuangNinhTourGuideSteps from '../components/QuangNinhTourGuideSteps';
import PhotoGallery from '../components/PhotoGallery';
import QuangNinhAttractionCard from '../components/QuangNinhAttractionCard';
import QuangNinhWeatherWidget from '../components/QuangNinhWeatherWidget';
import DestinationHeader from '../components/DestinationHeader';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Quảng Ninh images with majestic limestone landscapes
const quangNinhImages = [
  '/assets/destinations/quangninh/banner-1.jpg', // Hạ Long Bay aerial view
  '/assets/destinations/quangninh/banner-2.jpg', // Limestone karsts at sunset
  '/assets/destinations/quangninh/banner-3.jpg', // Traditional junk boats
  '/assets/destinations/quangninh/banner-4.jpg', // Cave exploration scene
];

// Quảng Ninh attractions with limestone cave and bay highlights
const attractionsData = [
  {
    id: 1,
    name: 'Hạ Long Bay',
    nameVi: 'Vịnh Hạ Long',
    image: '/assets/destinations/quangninh/ha-long-bay.jpg',
    location: 'Hạ Long City, Quảng Ninh',
    duration: 'Full day to 3 days',
    rating: 4.9,
    description: 'UNESCO World Heritage Site featuring over 1,600 limestone karsts and islets rising from emerald waters, creating one of the world\'s most spectacular seascapes.',
    descriptionVi: 'Di sản Thế giới UNESCO với hơn 1.600 hòn đảo đá vôi và đảo nhỏ sừng sững trên mặt nước màu ngọc lục bảo, tạo nên một trong những cảnh biển ngoạn mục nhất thế giới.',
  },
  {
    id: 2,
    name: 'Sơn Trà Cave',
    nameVi: 'Hang Sơn Trà',
    image: '/assets/destinations/quangninh/son-tra-cave.jpg',
    location: 'Hạ Long Bay, Quảng Ninh',
    duration: '2-3 hours',
    rating: 4.7,
    description: 'Magnificent limestone cave system with stunning stalactites and stalagmites, accessible by boat and offering mystical underground chambers.',
    descriptionVi: 'Hệ thống hang động đá vôi tuyệt đẹp với thạch nhũ và măng đá ấn tượng, có thể tiếp cận bằng thuyền và khám phá những căn phòng ngầm huyền bí.',
  },
  {
    id: 3,
    name: 'Titop Island',
    nameVi: 'Đảo Titop',
    image: '/assets/destinations/quangninh/titop-island.jpg',
    location: 'Hạ Long Bay, Quảng Ninh',
    duration: '2-4 hours',
    rating: 4.6,
    description: 'Pristine island with white sandy beach and hiking trail to panoramic viewpoint offering breathtaking 360-degree views of Hạ Long Bay.',
    descriptionVi: 'Hòn đảo hoang sơ với bãi cát trắng mịn và đường mòn leo núi đến điểm ngắm cảnh toàn cảnh, mang đến tầm nhìn 360 độ ngoạn mục của Vịnh Hạ Long.',
  },
  {
    id: 4,
    name: 'Queen Cable Car',
    nameVi: 'Cáp Treo Nữ Hoàng',
    image: '/assets/destinations/quangninh/queen-cable-car.jpg',
    location: 'Bãi Cháy, Quảng Ninh',
    duration: '1-2 hours',
    rating: 4.5,
    description: 'Spectacular cable car journey offering aerial views of Hạ Long Bay\'s limestone formations and connecting to beautiful beaches below.',
    descriptionVi: 'Hành trình cáp treo ngoạn mục mang đến tầm nhìn từ trên cao xuống các khối đá vôi của Vịnh Hạ Long và kết nối với những bãi biển đẹp phía dưới.',
  },
  {
    id: 5,
    name: 'Bái Tử Long Bay',
    nameVi: 'Vịnh Bái Tử Long',
    image: '/assets/destinations/quangninh/bai-tu-long-bay.jpg',
    location: 'Cẩm Phả, Quảng Ninh',
    duration: 'Full day',
    rating: 4.8,
    description: 'Less crowded extension of Hạ Long Bay with equally stunning limestone karsts, perfect for kayaking through sea caves and exploring hidden lagoons.',
    descriptionVi: 'Phần mở rộng ít đông đúc hơn của Vịnh Hạ Long với những hòn đảo đá vôi cũng ngoạn mục, hoàn hảo cho chèo kayak qua hang biển và khám phá những đầm phá ẩn giấu.',
  },
  {
    id: 6,
    name: 'Floating Villages',
    nameVi: 'Làng Chài Nổi',
    image: '/assets/destinations/quangninh/floating-villages.jpg',
    location: 'Hạ Long Bay, Quảng Ninh',
    duration: '2-3 hours',
    rating: 4.4,
    description: 'Traditional fishing communities living on floating houses, offering authentic cultural experiences and insights into centuries-old maritime traditions.',
    descriptionVi: 'Cộng đồng đánh cá truyền thống sống trên nhà nổi, mang đến trải nghiệm văn hóa chính thống và hiểu biết về truyền thống hàng hải hàng thế kỷ.',
  },
];

const QuangNinhGuidePage: React.FC = () => {
  const { t, i18n } = useTranslation(['destinationquangninh', 'common']);
  const [showTourGuide, setShowTourGuide] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
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
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Loading simulation with limestone cave effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Weather data for Quảng Ninh (subtropical climate)
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherData = {
          temperature: 25,
          condition: 'Cloudy',
          humidity: 75,
          wind: 12,
          forecast: [
            { day: 'Mon', temp: 25, condition: 'Cloudy' },
            { day: 'Tue', temp: 27, condition: 'Sunny' },
            { day: 'Wed', temp: 24, condition: 'Rain' },
            { day: 'Thu', temp: 26, condition: 'Sunny' },
            { day: 'Fri', temp: 23, condition: 'Storm' },
          ]
        };
        
        setWeatherData(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    
    fetchWeatherData();
  }, []);
  
  // Enhanced parallax effect with limestone motion
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollPosition = window.scrollY;
        headerRef.current.style.backgroundPositionY = `${scrollPosition * 0.3}px`;
        headerRef.current.style.transform = `translateY(${scrollPosition * 0.1}px)`;
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

  const karstVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 6,
          ease: "easeInOut",
        },
      },
    },
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-stone-50 to-slate-100 dark:from-slate-900 dark:via-stone-900 dark:to-slate-800 relative overflow-hidden">
          {/* Animated limestone formations background */}
          <div className="absolute inset-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute bg-gradient-to-t ${
                  i === 0 ? 'from-slate-400/30 to-transparent' :
                  i === 1 ? 'from-stone-400/20 to-transparent' :
                  i === 2 ? 'from-slate-500/15 to-transparent' :
                  i === 3 ? 'from-stone-500/10 to-transparent' :
                  'from-slate-600/5 to-transparent'
                }`}
                animate={{
                  y: [0, -20, 0],
                  x: [0, Math.sin(i) * 10, 0],
                }}
                transition={{
                  duration: 8 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
                style={{
                  left: 10 + i * 18 + '%',
                  bottom: 0,
                  width: 80 + i * 20 + 'px',
                  height: 150 + i * 30 + 'px',
                  clipPath: `polygon(${20 + i * 5}% 0%, ${80 - i * 5}% 0%, 90% 100%, 10% 100%)`,
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 360],
                y: [0, -15, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 bg-gradient-to-r from-slate-600 via-stone-600 to-slate-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-3xl"
              >
                🗿
              </motion.div>
              
              {/* Cave depth rings */}
              <motion.div
                className="absolute inset-0 border-4 border-white/30 rounded-full"
                animate={{
                  scale: [1, 2, 2.5],
                  opacity: [0.6, 0.3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            </motion.div>
            <motion.p 
              className="mt-4 text-xl bg-gradient-to-r from-slate-700 via-stone-700 to-slate-800 bg-clip-text text-transparent font-bold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Exploring limestone wonders...
            </motion.p>
          </div>
          
          {/* Floating cave gems */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-r from-slate-400 to-stone-500 rounded-full opacity-60"
              animate={{
                y: [window.innerHeight, -50],
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 4,
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
          <QuangNinhTourGuideSteps onClose={closeTourGuide} />
        )}
      </AnimatePresence>
      
      {/* Hero Section with Limestone Karst Theme */}
      <section ref={headerRef} className="relative h-screen bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${quangNinhImages[0]})` }}>
        {/* Dynamic gradient overlay with limestone effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-stone-800/60 to-slate-700/70"></div>
        
        {/* Animated limestone karst layers */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              variants={karstVariants}
              animate="animate"
              className={`absolute bottom-0 ${
                i === 0 ? 'w-32 h-48 bg-gradient-to-t from-slate-700/60 to-transparent' :
                i === 1 ? 'w-28 h-56 bg-gradient-to-t from-stone-700/50 to-transparent' :
                i === 2 ? 'w-36 h-44 bg-gradient-to-t from-slate-600/40 to-transparent' :
                i === 3 ? 'w-24 h-52 bg-gradient-to-t from-stone-600/30 to-transparent' :
                i === 4 ? 'w-40 h-40 bg-gradient-to-t from-slate-500/20 to-transparent' :
                'w-20 h-60 bg-gradient-to-t from-stone-500/10 to-transparent'
              }`}
              style={{
                left: i * 15 + 5 + '%',
                clipPath: `polygon(${15 + i * 3}% 0%, ${85 - i * 3}% 0%, 90% 100%, 10% 100%)`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
        
        {/* Floating limestone particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              animate={{
                y: [Math.random() * window.innerHeight, -50],
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                opacity: [0, 1, 0],
                scale: [0, Math.random() * 2 + 1, 0],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 5,
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
        
        <DestinationHeader 
          title={i18n.language === 'vi' ? 'Quảng Ninh' : 'Quảng Ninh'}
          subtitle={t('overview.subtitle')}
        />
        
        {/* Enhanced scroll indicator with limestone motion */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center">
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
            <p className="text-sm font-medium">{t('common:actions.scroll_down')}</p>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-2"
            >
              🗿
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <section className="py-16 bg-white dark:bg-gray-800 relative overflow-hidden">
        {/* Background limestone pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 1200 120" className="w-full h-full">
            <path d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z" fill="currentColor" className="text-slate-600"/>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Enhanced Tab Design with Limestone Theme */}
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="quangninh-tabs"
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
                className="py-8"
              >
                <motion.div variants={itemVariants} className="mb-8">
                  <div className="flex items-center mb-4">
                    <Title level={2} className="mb-0 dark:text-white bg-gradient-to-r from-slate-700 via-stone-700 to-slate-800 bg-clip-text text-transparent">
                      {t('overview.title')}
                    </Title>
                    <Tag color="blue" className="ml-4 text-lg px-4 py-1">
                      <EnvironmentOutlined className="mr-1" /> {t('overview.region')}
                    </Tag>
                  </div>
                  
                  <Paragraph className="text-lg dark:text-gray-300">
                    {t('overview.intro')}
                  </Paragraph>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <motion.div variants={itemVariants}>
                    <Card className="h-full quangninh-gradient-card">
                      <Title level={4} className="mb-4 dark:text-white">
                        {t('overview.why_visit.title')}
                      </Title>
                      <ul className="list-disc pl-5 space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <motion.li 
                            key={index} 
                            className="dark:text-gray-300"
                            whileHover={{ x: 5, color: '#475569' }}
                            transition={{ duration: 0.2 }}
                          >
                            {t(`overview.why_visit.reasons.${index}`)}
                          </motion.li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Card className="h-full quangninh-gradient-card">
                      <Title level={4} className="mb-4 dark:text-white">
                        {t('overview.best_time.title')}
                      </Title>
                      <Paragraph className="dark:text-gray-300">
                        {t('overview.best_time.description')}
                      </Paragraph>
                      <div className="mt-4">
                        <QuangNinhWeatherWidget data={weatherData} />
                      </div>
                    </Card>
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants} className="mb-12">
                  <Card className="quangninh-gradient-card">
                    <Title level={4} className="mb-4 dark:text-white">
                      {t('overview.cultural_significance.title')}
                    </Title>
                    <Paragraph className="dark:text-gray-300">
                      {t('overview.cultural_significance.description')}
                    </Paragraph>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                      <Card className="text-center quangninh-gradient-card">
                        <CompassOutlined className="text-4xl text-slate-600 mb-4" />
                        <Title level={5} className="dark:text-white">
                          {t('overview.quick_facts.location')}
                        </Title>
                        <Text className="dark:text-gray-300">
                          {t('overview.quick_facts.location_value')}
                        </Text>
                      </Card>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                      <Card className="text-center quangninh-gradient-card">
                        <ClockCircleOutlined className="text-4xl text-stone-600 mb-4" />
                        <Title level={5} className="dark:text-white">
                          {t('overview.quick_facts.time_zone')}
                        </Title>
                        <Text className="dark:text-gray-300">
                          {t('overview.quick_facts.time_zone_value')}
                        </Text>
                      </Card>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                      <Card className="text-center quangninh-gradient-card">
                        <EnvironmentOutlined className="text-4xl text-slate-700 mb-4" />
                        <Title level={5} className="dark:text-white">
                          {t('overview.quick_facts.population')}
                        </Title>
                        <Text className="dark:text-gray-300">
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
                className="py-8"
              >
                <motion.div variants={itemVariants} className="mb-8">
                  <Title level={2} className="mb-4 dark:text-white bg-gradient-to-r from-slate-700 via-stone-700 to-slate-800 bg-clip-text text-transparent">
                    {t('attractions.title')}
                  </Title>
                  <Paragraph className="text-lg dark:text-gray-300">
                    {t('attractions.intro')}
                  </Paragraph>
                </motion.div>
                
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {attractionsData.map((attraction) => (
                    <motion.div key={attraction.id} variants={itemVariants}>
                      <QuangNinhAttractionCard 
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
                  {t('tabs.food_and_drink')}
                </span>
              } 
              key="food"
            >
              <div className="py-8">
                <Title level={2} className="mb-4 dark:text-white bg-gradient-to-r from-slate-700 via-stone-700 to-slate-800 bg-clip-text text-transparent">
                  {t('food.title')}
                </Title>
                <Paragraph className="text-lg dark:text-gray-300 mb-8">
                  {t('food.intro')}
                </Paragraph>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="quangninh-gradient-card">
                        <div className="flex items-start">
                          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-stone-100 rounded-lg mr-4 overflow-hidden flex items-center justify-center">
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="text-3xl"
                            >
                              🦑🐟🦐🪱
                            </motion.div>
                          </div>
                          <div>
                            <Title level={5} className="mb-1 dark:text-white text-slate-700">
                              {t(`food.dishes.${index}.name`)}
                            </Title>
                            <Paragraph className="dark:text-gray-300 mb-2">
                              {t(`food.dishes.${index}.description`)}
                            </Paragraph>
                            <Tag color="blue">
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
                  {t('tabs.shopping')}
                </span>
              } 
              key="shopping"
            >
              <div className="py-8">
                <Title level={2} className="mb-4 dark:text-white bg-gradient-to-r from-slate-700 via-stone-700 to-slate-800 bg-clip-text text-transparent">
                  {t('shopping.title')}
                </Title>
                <Paragraph className="text-lg dark:text-gray-300 mb-8">
                  {t('shopping.intro')}
                </Paragraph>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full quangninh-gradient-card">
                        <Title level={4} className="mb-2 dark:text-white text-slate-700">
                          {t(`shopping.places.${index}.name`)}
                        </Title>
                        <Paragraph className="dark:text-gray-300 mb-3">
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
                  {t('tabs.getting_around')}
                </span>
              } 
              key="transport"
            >
              <div className="py-8">
                <Title level={2} className="mb-4 dark:text-white bg-gradient-to-r from-slate-700 via-stone-700 to-slate-800 bg-clip-text text-transparent">
                  {t('transport.title')}
                </Title>
                <Paragraph className="text-lg dark:text-gray-300 mb-8">
                  {t('transport.intro')}
                </Paragraph>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full quangninh-gradient-card">
                        <Title level={5} className="mb-2 dark:text-white text-slate-700">
                          {t(`transport.options.${index}.name`)}
                        </Title>
                        <Paragraph className="dark:text-gray-300">
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
      
      {/* Photo Gallery with Limestone Effects */}
      <section ref={galleryRef} className="py-16 bg-gradient-to-br from-slate-50 via-stone-50 to-slate-100 dark:from-slate-900/20 dark:via-stone-900/20 dark:to-slate-800/20 relative overflow-hidden">
        {/* Animated background limestone formations */}
        <div className="absolute inset-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-full h-full opacity-10 ${
                i === 0 ? 'bg-gradient-to-r from-slate-400 to-stone-400' :
                i === 1 ? 'bg-gradient-to-r from-stone-400 to-slate-500' :
                i === 2 ? 'bg-gradient-to-r from-slate-500 to-stone-500' :
                'bg-gradient-to-r from-stone-500 to-slate-600'
              }`}
              animate={{
                x: ['-100%', '100%'],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 2,
              }}
              style={{
                clipPath: `polygon(0 ${30 + i * 20}%, 100% ${50 + i * 10}%, 100% ${70 + i * 10}%, 0 ${50 + i * 20}%)`,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <Title level={2} className="mb-3 dark:text-white bg-gradient-to-r from-slate-700 via-stone-700 to-slate-800 bg-clip-text text-transparent">
              {t('photo_gallery.title')}
            </Title>
            <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
              {t('photo_gallery.description')}
            </Paragraph>
          </div>
          
          <PhotoGallery inView={galleryInView} city="quangninh" />
        </div>
      </section>
      
      {/* CTA with Dramatic Limestone Animation */}
      <section className="py-16 bg-gradient-to-r from-slate-600 via-stone-600 to-slate-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Animated limestone karst background */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(71,85,105,0.8) 0%, rgba(120,113,108,0.8) 50%, rgba(71,85,105,0.8) 100%)',
              'linear-gradient(225deg, rgba(120,113,108,0.8) 0%, rgba(71,85,105,0.8) 50%, rgba(120,113,108,0.8) 100%)',
              'linear-gradient(45deg, rgba(71,85,105,0.8) 0%, rgba(120,113,108,0.8) 50%, rgba(71,85,105,0.8) 100%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        {/* Limestone pattern overlay */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 1200 200" className="absolute bottom-0 w-full h-32">
            <motion.path 
              d="M0,100 C200,60 400,140 600,100 C800,60 1000,140 1200,100 L1200,200 L0,200 Z" 
              fill="rgba(255,255,255,0.1)"
              animate={{
                d: [
                  "M0,100 C200,60 400,140 600,100 C800,60 1000,140 1200,100 L1200,200 L0,200 Z",
                  "M0,120 C200,80 400,160 600,120 C800,80 1000,160 1200,120 L1200,200 L0,200 Z",
                  "M0,100 C200,60 400,140 600,100 C800,60 1000,140 1200,100 L1200,200 L0,200 Z"
                ]
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
            <Title level={2} className="text-white mb-4">
              {t('cta.title')}
            </Title>
            <Paragraph className="text-lg text-white mb-8 max-w-3xl mx-auto">
              {t('cta.description')}
            </Paragraph>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="large" 
                  onClick={restartTourGuide} 
                  className="bg-white text-slate-700 h-12 font-bold hover:bg-gray-100 border-none shadow-lg"
                >
                  <FireOutlined className="mr-2" />
                  {t('cta.restart_tour')}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="large" 
                  onClick={handleShare} 
                  className="bg-transparent text-white border-white h-12 font-bold hover:bg-white hover:text-slate-700 shadow-lg"
                >
                  <ShareAltOutlined className="mr-2" /> {t('common:actions.share')}
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Floating limestone elements */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/20 text-4xl"
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 20, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              style={{
                left: `${10 + i * 10}%`,
                top: `${20 + Math.sin(i) * 30}%`,
              }}
            >
              {['🗿', '🏔️', '🏞️', '⛰️', '🌊', '🛥️', '🕳️', '💎', '🏝️', '⚓'][i]}
            </motion.div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default QuangNinhGuidePage;