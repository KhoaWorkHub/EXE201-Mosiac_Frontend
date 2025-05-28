import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button, Typography, Tabs, Card, Tag, Spin, message } from 'antd';
import { 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  InfoCircleOutlined, 
  ArrowRightOutlined,
  ShareAltOutlined,
  StarFilled,
  CompassOutlined,
  PictureOutlined,
  CoffeeOutlined,
  ShopOutlined,
  CarOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import HanoiTourGuideSteps from '../components/HanoiTourGuideSteps';
import DestinationMap from '../components/DestinationMap';
import PhotoGallery from '../components/PhotoGallery';
import HanoiAttractionCard from '../components/HanoiAttractionCard';
import HanoiWeatherWidget from '../components/HanoiWeatherWidget';
import DestinationHeader from '../components/DestinationHeader';
import Recommendations from '../components/Recommendations';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Hanoi images with more diverse and authentic representations
const hanoiImages = [
  '/assets/destinations/hanoi/banner-1.jpg', // Hoan Kiem Lake with red bridge
  '/assets/destinations/hanoi/banner-2.jpg', // Old Quarter street scene
  '/assets/destinations/hanoi/banner-3.jpg', // Temple of Literature
  '/assets/destinations/hanoi/banner-4.jpg', // Ho Chi Minh Mausoleum
];

// Hanoi attractions data with authentic local information
const attractionsData = [
  {
    id: 1,
    name: 'Hoan Kiem Lake',
    nameVi: 'Hồ Hoàn Kiếm',
    image: '/assets/destinations/hanoi/hoan-kiem-lake.jpg',
    location: 'Hoan Kiem District, Hanoi',
    duration: '1-2 hours',
    rating: 4.7,
    description: 'The spiritual heart of Hanoi, featuring the iconic red Huc Bridge and Ngoc Son Temple, perfect for morning walks.',
    descriptionVi: 'Trái tim tinh thần của Hà Nội, với cây cầu Thê Húc màu đỏ biểu tượng và đền Ngọc Sơn, hoàn hảo cho những buổi đi bộ sáng sớm.',
  },
  {
    id: 2,
    name: 'Old Quarter',
    nameVi: 'Phố Cổ Hà Nội',
    image: '/assets/destinations/hanoi/old-quarter.jpg',
    location: 'Hoan Kiem District, Hanoi',
    duration: '3-4 hours',
    rating: 4.6,
    description: 'A maze of narrow streets with traditional shophouses, each street specializing in different trades, showcasing authentic Vietnamese life.',
    descriptionVi: 'Một mê cung những con phố hẹp với nhà ống truyền thống, mỗi phố chuyên về nghề khác nhau, thể hiện cuộc sống Việt Nam chính thống.',
  },
  {
    id: 3,
    name: 'Temple of Literature',
    nameVi: 'Văn Miếu',
    image: '/assets/destinations/hanoi/temple-literature.jpg',
    location: 'Dong Da District, Hanoi',
    duration: '1-2 hours',
    rating: 4.8,
    description: 'Vietnam\'s first university, dedicated to Confucius and literature, featuring beautiful traditional architecture and peaceful gardens.',
    descriptionVi: 'Trường đại học đầu tiên của Việt Nam, dành riêng cho Khổng Tử và văn học, với kiến trúc truyền thống đẹp mắt và khu vườn yên bình.',
  },
  {
    id: 4,
    name: 'Ho Chi Minh Mausoleum',
    nameVi: 'Lăng Chủ tịch Hồ Chí Minh',
    image: '/assets/destinations/hanoi/ho-chi-minh-mausoleum.jpg',
    location: 'Ba Dinh District, Hanoi',
    duration: '2-3 hours (including museum)',
    rating: 4.5,
    description: 'The final resting place of Vietnam\'s beloved leader, surrounded by beautiful gardens and historical significance.',
    descriptionVi: 'Nơi an nghỉ cuối cùng của vị lãnh tụ kính yêu của Việt Nam, được bao quanh bởi những khu vườn đẹp và ý nghĩa lịch sử.',
  },
  {
    id: 5,
    name: 'One Pillar Pagoda',
    nameVi: 'Chùa Một Cột',
    image: '/assets/destinations/hanoi/one-pillar-pagoda.jpg',
    location: 'Ba Dinh District, Hanoi',
    duration: '30 minutes',
    rating: 4.4,
    description: 'A historic Buddhist temple built in 1049, famous for its unique architecture resembling a lotus blossom emerging from water.',
    descriptionVi: 'Một ngôi chùa Phật giáo lịch sử được xây dựng năm 1049, nổi tiếng với kiến trúc độc đáo giống như hoa sen nổi trên mặt nước.',
  },
  {
    id: 6,
    name: 'Hanoi Opera House',
    nameVi: 'Nhà hát Lớn Hà Nội',
    image: '/assets/destinations/hanoi/opera-house.jpg',
    location: 'Hoan Kiem District, Hanoi',
    duration: '1 hour (tour) or 2-3 hours (performance)',
    rating: 4.6,
    description: 'A beautiful example of French colonial architecture, hosting world-class performances and offering guided tours.',
    descriptionVi: 'Một ví dụ đẹp mắt của kiến trúc thuộc địa Pháp, tổ chức các buổi biểu diễn đẳng cấp thế giới và tour tham quan có hướng dẫn.',
  },
];

const HanoiGuidePage: React.FC = () => {
  const { t, i18n } = useTranslation(['destinationhanoi', 'common']);
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
  
  // For animation triggers based on scroll
  const [overviewRef, overviewInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [attractionsRef, attractionsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [mapRef, mapInView] = useInView({ triggerOnce: true, threshold: 0.1 });
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
  
  // Simulating loading
  useEffect(() => {
    // Simulate loading the destination guide data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate fetching weather data for Hanoi
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Simulated weather data for Hanoi
        const weatherData = {
          temperature: 26,
          condition: 'Cloudy',
          humidity: 78,
          wind: 8,
          forecast: [
            { day: 'Mon', temp: 26, condition: 'Cloudy' },
            { day: 'Tue', temp: 24, condition: 'Rain' },
            { day: 'Wed', temp: 28, condition: 'Sunny' },
            { day: 'Thu', temp: 25, condition: 'Cloudy' },
            { day: 'Fri', temp: 27, condition: 'Sunny' },
          ]
        };
        
        setWeatherData(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    
    fetchWeatherData();
  }, []);
  
  // Animation for the parallax effect
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
  
  // Animation for sections based on scroll
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
    // Scroll to top to start the tour properly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // For sharing the page
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
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-xl">{t('common:loading.experience')}</p>
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
          <HanoiTourGuideSteps onClose={closeTourGuide} />
        )}
      </AnimatePresence>
      
      {/* Hero Section with Parallax - Hanoi themed */}
      <section ref={headerRef} className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${hanoiImages[0]})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <DestinationHeader 
          title={i18n.language === 'vi' ? 'Hà Nội' : 'Hanoi'}
          subtitle={t('overview.subtitle')}
        />
        
        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRightOutlined className="transform rotate-90 text-2xl mb-2" />
            <p className="text-sm">{t('common:actions.scroll_down')}</p>
          </motion.div>
        </div>
      </section>
      
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          {/* Destination Tabs */}
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="destination-tabs"
            centered
            size={isMobile ? "small" : "large"}
          >
            <TabPane 
              tab={<span className="tab-item"><InfoCircleOutlined />{t('tabs.overview')}</span>} 
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
                    <Title level={2} className="mb-0 dark:text-white">
                      {t('overview.title')}
                    </Title>
                    <Tag color="gold" className="ml-4">
                      <EnvironmentOutlined /> {t('overview.region')}
                    </Tag>
                  </div>
                  
                  <Paragraph className="text-lg dark:text-gray-300">
                    {t('overview.intro')}
                  </Paragraph>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <motion.div variants={itemVariants}>
                    <Card className="h-full">
                      <Title level={4} className="mb-4 dark:text-white">
                        {t('overview.why_visit.title')}
                      </Title>
                      <ul className="list-disc pl-5 space-y-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <li key={index} className="dark:text-gray-300">
                            {t(`overview.why_visit.reasons.${index}`)}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Card className="h-full">
                      <Title level={4} className="mb-4 dark:text-white">
                        {t('overview.best_time.title')}
                      </Title>
                      <Paragraph className="dark:text-gray-300">
                        {t('overview.best_time.description')}
                      </Paragraph>
                      <div className="mt-4">
                        <HanoiWeatherWidget data={weatherData} />
                      </div>
                    </Card>
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants} className="mb-12">
                  <Card>
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
                    <Card className="text-center">
                      <CompassOutlined className="text-4xl text-primary mb-4" />
                      <Title level={5} className="dark:text-white">
                        {t('overview.quick_facts.location')}
                      </Title>
                      <Text className="dark:text-gray-300">
                        {t('overview.quick_facts.location_value')}
                      </Text>
                    </Card>
                    
                    <Card className="text-center">
                      <ClockCircleOutlined className="text-4xl text-primary mb-4" />
                      <Title level={5} className="dark:text-white">
                        {t('overview.quick_facts.time_zone')}
                      </Title>
                      <Text className="dark:text-gray-300">
                        {t('overview.quick_facts.time_zone_value')}
                      </Text>
                    </Card>
                    
                    <Card className="text-center">
                      <EnvironmentOutlined className="text-4xl text-primary mb-4" />
                      <Title level={5} className="dark:text-white">
                        {t('overview.quick_facts.population')}
                      </Title>
                      <Text className="dark:text-gray-300">
                        {t('overview.quick_facts.population_value')}
                      </Text>
                    </Card>
                  </div>
                </motion.div>
              </motion.div>
            </TabPane>
            
            <TabPane 
              tab={<span className="tab-item"><PictureOutlined />{t('tabs.attractions')}</span>} 
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
                  <Title level={2} className="mb-4 dark:text-white">
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
                      <HanoiAttractionCard 
                        attraction={attraction}
                        language={i18n.language}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </TabPane>
            
            <TabPane 
              tab={<span className="tab-item"><CoffeeOutlined />{t('tabs.food_and_drink')}</span>} 
              key="food"
            >
              <div className="py-8">
                <Title level={2} className="mb-4 dark:text-white">
                  {t('food.title')}
                </Title>
                <Paragraph className="text-lg dark:text-gray-300 mb-8">
                  {t('food.intro')}
                </Paragraph>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index}>
                      <div className="flex items-start">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg mr-4 overflow-hidden">
                          <img 
                            src={`/assets/destinations/hanoi/food-${index + 1}.jpg`} 
                            alt={t(`food.dishes.${index}.name`)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Title level={5} className="mb-1 dark:text-white">
                            {t(`food.dishes.${index}.name`)}
                          </Title>
                          <Paragraph className="dark:text-gray-300 mb-2">
                            {t(`food.dishes.${index}.description`)}
                          </Paragraph>
                          <Tag color="green">
                            {t(`food.dishes.${index}.where_to_try`)}
                          </Tag>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Title level={3} className="mb-4 dark:text-white">
                  {t('food.restaurants.title')}
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="h-full">
                      <Title level={5} className="mb-2 dark:text-white">
                        {t(`food.restaurants.list.${index}.name`)}
                      </Title>
                      <div className="flex items-center mb-2">
                        <StarFilled className="text-yellow-500 mr-1" />
                        <Text className="dark:text-gray-300">
                          {t(`food.restaurants.list.${index}.rating`)}
                        </Text>
                      </div>
                      <Paragraph className="dark:text-gray-300 mb-2">
                        {t(`food.restaurants.list.${index}.description`)}
                      </Paragraph>
                      <div className="flex items-center">
                        <EnvironmentOutlined className="mr-1 text-gray-500" />
                        <Text className="text-gray-500 dark:text-gray-400">
                          {t(`food.restaurants.list.${index}.address`)}
                        </Text>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabPane>
            
            <TabPane 
              tab={<span className="tab-item"><ShopOutlined />{t('tabs.shopping')}</span>} 
              key="shopping"
            >
              <div className="py-8">
                <Title level={2} className="mb-4 dark:text-white">
                  {t('shopping.title')}
                </Title>
                <Paragraph className="text-lg dark:text-gray-300 mb-8">
                  {t('shopping.intro')}
                </Paragraph>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="h-full">
                      <Title level={4} className="mb-2 dark:text-white">
                        {t(`shopping.places.${index}.name`)}
                      </Title>
                      <Paragraph className="dark:text-gray-300 mb-3">
                        {t(`shopping.places.${index}.description`)}
                      </Paragraph>
                      <div className="flex items-center mb-2">
                        <EnvironmentOutlined className="mr-2 text-gray-500" />
                        <Text className="text-gray-500 dark:text-gray-400">
                          {t(`shopping.places.${index}.location`)}
                        </Text>
                      </div>
                      <div className="flex items-center">
                        <ClockCircleOutlined className="mr-2 text-gray-500" />
                        <Text className="text-gray-500 dark:text-gray-400">
                          {t(`shopping.places.${index}.hours`)}
                        </Text>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Title level={3} className="mb-4 dark:text-white">
                  {t('shopping.souvenirs.title')}
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="text-center h-full">
                      <div className="w-20 h-20 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <img 
                          src={`/assets/destinations/hanoi/souvenir-${index + 1}.svg`} 
                          alt="Souvenir"
                          className="w-12 h-12"
                        />
                      </div>
                      <Title level={5} className="mb-2 dark:text-white">
                        {t(`shopping.souvenirs.items.${index}.name`)}
                      </Title>
                      <Paragraph className="dark:text-gray-300">
                        {t(`shopping.souvenirs.items.${index}.description`)}
                      </Paragraph>
                    </Card>
                  ))}
                </div>
              </div>
            </TabPane>
            
            <TabPane 
              tab={<span className="tab-item"><CarOutlined />{t('tabs.getting_around')}</span>} 
              key="transport"
            >
              <div className="py-8">
                <Title level={2} className="mb-4 dark:text-white">
                  {t('transport.title')}
                </Title>
                <Paragraph className="text-lg dark:text-gray-300 mb-8">
                  {t('transport.intro')}
                </Paragraph>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="h-full">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                          <img 
                            src={`/assets/destinations/hanoi/transport-${index + 1}.svg`} 
                            alt="Transport"
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <Title level={5} className="mb-2 dark:text-white">
                            {t(`transport.options.${index}.name`)}
                          </Title>
                          <Paragraph className="dark:text-gray-300 mb-2">
                            {t(`transport.options.${index}.description`)}
                          </Paragraph>
                          <div className="flex items-center">
                            <Tag color="blue">
                              {t(`transport.options.${index}.cost`)}
                            </Tag>
                            <Tag color="green" className="ml-2">
                              {t(`transport.options.${index}.convenience`)}
                            </Tag>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Card className="mb-8">
                  <Title level={4} className="mb-4 dark:text-white">
                    {t('transport.tips.title')}
                  </Title>
                  <ul className="list-disc pl-5 space-y-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <li key={index} className="dark:text-gray-300">
                        {t(`transport.tips.list.${index}`)}
                      </li>
                    ))}
                  </ul>
                </Card>
                
                <div ref={mapRef}>
                  <DestinationMap city="hanoi" inView={mapInView} />
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </section>
      
      {/* Photo Gallery Section */}
      <section ref={galleryRef} className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Title level={2} className="mb-3 dark:text-white">
              {t('photo_gallery.title')}
            </Title>
            <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
              {t('photo_gallery.description')}
            </Paragraph>
          </div>
          
          <PhotoGallery inView={galleryInView} city="hanoi" />
        </div>
      </section>
      
      {/* Recommendations Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Title level={2} className="mb-3 dark:text-white">
              {t('recommendations.title')}
            </Title>
            <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
              {t('recommendations.description')}
            </Paragraph>
          </div>
          
          <Recommendations city="hanoi" />
        </div>
      </section>
      
      {/* Call to Action - Hanoi themed with golden colors */}
      <section className="py-16 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Title level={2} className="text-white mb-4">
            {t('cta.title')}
          </Title>
          <Paragraph className="text-lg text-white mb-8 max-w-3xl mx-auto">
            {t('cta.description')}
          </Paragraph>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="large" type="default" onClick={restartTourGuide} className="bg-white text-yellow-600 h-12 font-bold hover:bg-gray-100">
              {t('cta.restart_tour')}
            </Button>
            <Button size="large" type="default" onClick={handleShare} className="bg-transparent text-white border-white h-12 font-bold hover:bg-white hover:text-yellow-600">
              <ShareAltOutlined /> {t('common:actions.share')}
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HanoiGuidePage;