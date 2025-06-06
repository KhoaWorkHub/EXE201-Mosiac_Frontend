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

  FireOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import HCMTourGuideSteps from '../components/HCMTourGuideSteps';
// import DestinationMap from '../components/DestinationMap';
import PhotoGallery from '../components/PhotoGallery';
import HCMAttractionCard from '../components/HCMAttractionCard';
import HCMWeatherWidget from '../components/HCMWeatherWidget';
import DestinationHeader from '../components/DestinationHeader';
// import Recommendations from '../components/Recommendations';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// HCM images with vibrant, modern cityscape
const hcmImages = [
  '/assets/destinations/hcm/banner-1.jpg', // Skyline with Landmark 81
  '/assets/destinations/hcm/banner-2.jpg', // Ben Thanh Market street
  '/assets/destinations/hcm/banner-3.jpg', // Independence Palace
  '/assets/destinations/hcm/banner-4.jpg', // Saigon River at night
];

// HCM attractions with dynamic, modern feel
const attractionsData = [
  {
    id: 1,
    name: 'Independence Palace',
    nameVi: 'Dinh Độc Lập',
    image: '/assets/destinations/hcm/independence-palace.jpg',
    location: 'District 1, Ho Chi Minh City',
    duration: '1-2 hours',
    rating: 4.6,
    description: 'Historic presidential palace and symbol of Vietnamese independence, featuring stunning 1960s architecture and preserved war rooms.',
    descriptionVi: 'Dinh thự tổng thống lịch sử và biểu tượng của nền độc lập Việt Nam, với kiến trúc tuyệt đẹp những năm 1960 và các phòng chiến tranh được bảo tồn.',
  },
  {
    id: 2,
    name: 'Ben Thanh Market',
    nameVi: 'Chợ Bến Thành',
    image: '/assets/destinations/hcm/ben-thanh-market.jpg',
    location: 'District 1, Ho Chi Minh City',
    duration: '2-3 hours',
    rating: 4.4,
    description: 'Iconic central market offering authentic Vietnamese street food, souvenirs, and a glimpse into local daily life.',
    descriptionVi: 'Chợ trung tâm biểu tượng cung cấp đồ ăn đường phố Việt Nam chính thống, quà lưu niệm và cái nhìn về cuộc sống hàng ngày của người dân địa phương.',
  },
  {
    id: 3,
    name: 'Notre-Dame Cathedral Basilica',
    nameVi: 'Nhà thờ Đức Bà Sài Gòn',
    image: '/assets/destinations/hcm/notre-dame-cathedral.jpg',
    location: 'District 1, Ho Chi Minh City',
    duration: '30-45 minutes',
    rating: 4.5,
    description: 'Stunning French colonial architecture masterpiece built with materials imported from France, standing as a testament to Saigon\'s heritage.',
    descriptionVi: 'Kiệt tác kiến trúc thuộc địa Pháp tuyệt đẹp được xây dựng bằng vật liệu nhập khẩu từ Pháp, đứng như một minh chứng cho di sản của Sài Gòn.',
  },
  {
    id: 4,
    name: 'Landmark 81',
    nameVi: 'Landmark 81',
    image: '/assets/destinations/hcm/landmark-81.jpg',
    location: 'Binh Thanh District, Ho Chi Minh City',
    duration: '1-2 hours',
    rating: 4.7,
    description: 'Southeast Asia\'s tallest building offering breathtaking 360-degree views of the bustling metropolis from the SkyBar observation deck.',
    descriptionVi: 'Tòa nhà cao nhất Đông Nam Á mang đến tầm nhìn 360 độ ngoạn mục của đô thị nhộn nhịp từ đài quan sát SkyBar.',
  },
  {
    id: 5,
    name: 'War Remnants Museum',
    nameVi: 'Bảo tàng Chứng tích Chiến tranh',
    image: '/assets/destinations/hcm/war-remnants-museum.jpg',
    location: 'District 3, Ho Chi Minh City',
    duration: '2-3 hours',
    rating: 4.6,
    description: 'Powerful museum documenting the impact of war with authentic artifacts, photographs, and military equipment.',
    descriptionVi: 'Bảo tàng mạnh mẽ ghi lại tác động của chiến tranh với các hiện vật chính thống, hình ảnh và thiết bị quân sự.',
  },
  {
    id: 6,
    name: 'Saigon Central Post Office',
    nameVi: 'Bưu điện Trung tâm Sài Gòn',
    image: '/assets/destinations/hcm/central-post-office.jpg',
    location: 'District 1, Ho Chi Minh City',
    duration: '30 minutes',
    rating: 4.4,
    description: 'Magnificent French colonial post office designed by Gustave Eiffel, featuring beautiful maps and intricate architecture.',
    descriptionVi: 'Bưu điện thuộc địa Pháp tráng lệ được thiết kế bởi Gustave Eiffel, có các bản đồ đẹp và kiến trúc phức tạp.',
  },
];

const HCMGuidePage: React.FC = () => {
  const { t, i18n } = useTranslation(['destinationhcm', 'common']);
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
//   const [mapRef, mapInView] = useInView({ triggerOnce: true, threshold: 0.1 });
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
  
  // Loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Weather data for HCM (tropical climate)
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const weatherData = {
          temperature: 32,
          condition: 'Sunny',
          humidity: 82,
          wind: 15,
          forecast: [
            { day: 'Mon', temp: 32, condition: 'Sunny' },
            { day: 'Tue', temp: 31, condition: 'Cloudy' },
            { day: 'Wed', temp: 33, condition: 'Sunny' },
            { day: 'Thu', temp: 30, condition: 'Rain' },
            { day: 'Fri', temp: 32, condition: 'Storm' },
          ]
        };
        
        setWeatherData(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    
    fetchWeatherData();
  }, []);
  
  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollPosition = window.scrollY;
        headerRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
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
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900">
          <div className="text-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              <FireOutlined className="text-white text-2xl" />
            </motion.div>
            <p className="mt-4 text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold">
              {t('common:loading.experience')}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Tour Guide */}
      <AnimatePresence>
        {showTourGuide && (
          <HCMTourGuideSteps onClose={closeTourGuide} />
        )}
      </AnimatePresence>
      
      {/* Hero Section with Dynamic Gradient */}
      <section ref={headerRef} className="relative h-screen bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${hcmImages[0]})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/70 via-red-900/50 to-pink-900/70"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              animate={{
                y: [Math.random() * window.innerHeight, -100],
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
        
        <DestinationHeader 
          title={i18n.language === 'vi' ? 'TP. Hồ Chí Minh' : 'Ho Chi Minh City'}
          subtitle={t('overview.subtitle')}
        />
        
        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center mb-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-white rounded-full mt-2"
              />
            </div>
            <p className="text-sm">{t('common:actions.scroll_down')}</p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
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
                    <Title level={2} className="mb-0 dark:text-white bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {t('overview.title')}
                    </Title>
                    <Tag color="volcano" className="ml-4 text-lg px-4 py-1">
                      <EnvironmentOutlined className="mr-1" /> {t('overview.region')}
                    </Tag>
                  </div>
                  
                  <Paragraph className="text-lg dark:text-gray-300">
                    {t('overview.intro')}
                  </Paragraph>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <motion.div variants={itemVariants}>
                    <Card className="h-full hcm-gradient-card">
                      <Title level={4} className="mb-4 dark:text-white">
                        {t('overview.why_visit.title')}
                      </Title>
                      <ul className="list-disc pl-5 space-y-3">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <motion.li 
                            key={index} 
                            className="dark:text-gray-300"
                            whileHover={{ x: 5, color: '#ea580c' }}
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
                      <Title level={4} className="mb-4 dark:text-white">
                        {t('overview.best_time.title')}
                      </Title>
                      <Paragraph className="dark:text-gray-300">
                        {t('overview.best_time.description')}
                      </Paragraph>
                      <div className="mt-4">
                        <HCMWeatherWidget data={weatherData} />
                      </div>
                    </Card>
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants} className="mb-12">
                  <Card className="hcm-gradient-card">
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
                      <Card className="text-center hcm-gradient-card">
                        <CompassOutlined className="text-4xl text-orange-500 mb-4" />
                        <Title level={5} className="dark:text-white">
                          {t('overview.quick_facts.location')}
                        </Title>
                        <Text className="dark:text-gray-300">
                          {t('overview.quick_facts.location_value')}
                        </Text>
                      </Card>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                      <Card className="text-center hcm-gradient-card">
                        <ClockCircleOutlined className="text-4xl text-red-500 mb-4" />
                        <Title level={5} className="dark:text-white">
                          {t('overview.quick_facts.time_zone')}
                        </Title>
                        <Text className="dark:text-gray-300">
                          {t('overview.quick_facts.time_zone_value')}
                        </Text>
                      </Card>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                      <Card className="text-center hcm-gradient-card">
                        <EnvironmentOutlined className="text-4xl text-pink-500 mb-4" />
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
                  <Title level={2} className="mb-4 dark:text-white bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
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
                      <HCMAttractionCard 
                        attraction={attraction}
                        language={i18n.language}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </TabPane>
            
            {/* Similar structure for other tabs... */}
            
          </Tabs>
        </div>
      </section>
      
      {/* Photo Gallery with Enhanced Effects */}
      <section ref={galleryRef} className="py-16 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Title level={2} className="mb-3 dark:text-white bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {t('photo_gallery.title')}
            </Title>
            <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
              {t('photo_gallery.description')}
            </Paragraph>
          </div>
          
          <PhotoGallery inView={galleryInView} city="hcm" />
        </div>
      </section>
      
      {/* CTA with Dynamic Gradient */}
      <section className="py-16 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(249,115,22,0.8) 0%, rgba(239,68,68,0.8) 50%, rgba(236,72,153,0.8) 100%)',
              'linear-gradient(225deg, rgba(236,72,153,0.8) 0%, rgba(239,68,68,0.8) 50%, rgba(249,115,22,0.8) 100%)',
              'linear-gradient(45deg, rgba(249,115,22,0.8) 0%, rgba(239,68,68,0.8) 50%, rgba(236,72,153,0.8) 100%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
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
                  className="bg-white text-orange-600 h-12 font-bold hover:bg-gray-100 border-none shadow-lg"
                >
                  <ThunderboltOutlined className="mr-2" />
                  {t('cta.restart_tour')}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="large" 
                  onClick={handleShare} 
                  className="bg-transparent text-white border-white h-12 font-bold hover:bg-white hover:text-orange-600 shadow-lg"
                >
                  <ShareAltOutlined className="mr-2" /> {t('common:actions.share')}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HCMGuidePage;