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
import TourGuideSteps from '../components/TourGuideSteps';
import DestinationMap from '../components/DestinationMap';
import PhotoGallery from '../components/PhotoGallery';
import AttractionCard from '../components/AttractionCard';
import WeatherWidget from '../components/WeatherWidget';
import DestinationHeader from '../components/DestinationHeader';
import Recommendations from '../components/Recommendations';
import LanguageSwitcher from '../components/LanguageSwitcher';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Da Nang images
const daNangImages = [
  '/assets/destinations/danang/banner-1.jpg',
  '/assets/destinations/danang/banner-2.jpg',
  '/assets/destinations/danang/banner-3.jpg',
  '/assets/destinations/danang/banner-4.jpg',
];

// Attractions data
const attractionsData = [
  {
    id: 1,
    name: 'Golden Bridge',
    nameVi: 'Cầu Vàng',
    image: '/assets/destinations/danang/golden-bridge.jpg',
    location: 'Ba Na Hills',
    duration: '2-3 hours',
    rating: 4.8,
    description: 'The famous Golden Bridge held up by giant stone hands, offering panoramic views of the mountains.',
    descriptionVi: 'Cây cầu Vàng nổi tiếng được nâng đỡ bởi những bàn tay đá khổng lồ, mang đến tầm nhìn toàn cảnh về núi non.',
  },
  {
    id: 2,
    name: 'Marble Mountains',
    nameVi: 'Ngũ Hành Sơn',
    image: '/assets/destinations/danang/marble-mountains.jpg',
    location: 'Ngu Hanh Son District',
    duration: '2-4 hours',
    rating: 4.6,
    description: 'A cluster of five marble and limestone hills with caves, tunnels, and Buddhist sanctuaries.',
    descriptionVi: 'Một quần thể gồm năm ngọn núi đá cẩm thạch và đá vôi với các hang động, đường hầm và các thánh địa Phật giáo.',
  },
  {
    id: 3,
    name: 'My Khe Beach',
    nameVi: 'Biển Mỹ Khê',
    image: '/assets/destinations/danang/my-khe-beach.jpg',
    location: 'Da Nang',
    duration: 'Half day',
    rating: 4.7,
    description: 'A beautiful white sand beach with crystal-clear waters, named by American troops during the Vietnam War.',
    descriptionVi: 'Một bãi biển cát trắng đẹp với làn nước trong như pha lê, được đặt tên bởi quân đội Mỹ trong thời kỳ Chiến tranh Việt Nam.',
  },
  {
    id: 4,
    name: 'Dragon Bridge',
    nameVi: 'Cầu Rồng',
    image: '/assets/destinations/danang/dragon-bridge.jpg',
    location: 'Da Nang City Center',
    duration: '1 hour (longer on weekends for the show)',
    rating: 4.5,
    description: 'A bridge in the shape of a dragon that breathes fire and water on weekend nights.',
    descriptionVi: 'Một cây cầu có hình dạng con rồng phun lửa và nước vào các đêm cuối tuần.',
  },
  {
    id: 5,
    name: 'Son Tra Peninsula',
    nameVi: 'Bán đảo Sơn Trà',
    image: '/assets/destinations/danang/son-tra.jpg',
    location: '10km from Da Nang',
    duration: 'Half to Full day',
    rating: 4.6,
    description: 'A natural reserve with stunning views, featuring the Lady Buddha statue and pristine beaches.',
    descriptionVi: 'Một khu bảo tồn thiên nhiên với cảnh quan tuyệt đẹp, có tượng Phật Bà và các bãi biển hoang sơ.',
  },
  {
    id: 6,
    name: 'Hai Van Pass',
    nameVi: 'Đèo Hải Vân',
    image: '/assets/destinations/danang/hai-van-pass.jpg',
    location: 'Between Da Nang and Hue',
    duration: '2-3 hours',
    rating: 4.9,
    description: 'A scenic mountain pass with breathtaking views of the coastline, featured in Top Gear.',
    descriptionVi: 'Một con đèo núi đẹp với cảnh biển tuyệt đẹp, đã được giới thiệu trong chương trình Top Gear.',
  },
];

const DaNangGuidePage: React.FC = () => {
  const { t, i18n } = useTranslation(['destination', 'common']);
  const [showTourGuide, setShowTourGuide] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [weatherData, setWeatherData] = useState<any>(null);
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
  
  // Simulate fetching weather data
  useEffect(() => {
    // This would be a real API call in production
    const fetchWeatherData = async () => {
      try {
        // Simulated weather data for Da Nang
        const weatherData = {
          temperature: 30,
          condition: 'Sunny',
          humidity: 75,
          wind: 12,
          forecast: [
            { day: 'Mon', temp: 30, condition: 'Sunny' },
            { day: 'Tue', temp: 29, condition: 'Cloudy' },
            { day: 'Wed', temp: 31, condition: 'Sunny' },
            { day: 'Thu', temp: 28, condition: 'Rain' },
            { day: 'Fri', temp: 29, condition: 'Cloudy' },
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
    message.success('Tour guide closed. You can restart it anytime!');
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
        title: 'Da Nang - Vietnam\'s Hidden Gem',
        text: 'Check out this amazing guide to Da Nang, Vietnam',
        url: window.location.href,
      })
      .catch(() => message.info('Share cancelled'));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => message.success('Link copied to clipboard!'))
        .catch(() => message.error('Failed to copy link'));
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
            <p className="mt-4 text-xl">Loading your Da Nang experience...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Floating Language Switcher */}
      <div className="fixed top-24 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
      {/* Tour Guide */}
      <AnimatePresence>
        {showTourGuide && (
          <TourGuideSteps onClose={closeTourGuide} />
        )}
      </AnimatePresence>
      
      {/* Hero Section with Parallax */}
      <section ref={headerRef} className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${daNangImages[0]})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <DestinationHeader 
          title={i18n.language === 'vi' ? 'Đà Nẵng' : 'Da Nang'}
          subtitle={i18n.language === 'vi' ? 'Viên ngọc của miền Trung Việt Nam' : 'The Gem of Central Vietnam'}
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
              tab={<span className="tab-item"><InfoCircleOutlined />{t('destination:tabs.overview')}</span>} 
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
                      {t('destination:danang.overview.title')}
                    </Title>
                    <Tag color="blue" className="ml-4">
                      <EnvironmentOutlined /> {t('destination:danang.overview.region')}
                    </Tag>
                  </div>
                  
                  <Paragraph className="text-lg dark:text-gray-300">
                    {t('destination:danang.overview.intro')}
                  </Paragraph>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <motion.div variants={itemVariants}>
                    <Card className="h-full">
                      <Title level={4} className="mb-4 dark:text-white">
                        {t('destination:danang.overview.why_visit.title')}
                      </Title>
                      <ul className="list-disc pl-5 space-y-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <li key={index} className="dark:text-gray-300">
                            {t(`destination:danang.overview.why_visit.reasons.${index}`)}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Card className="h-full">
                      <Title level={4} className="mb-4 dark:text-white">
                        {t('destination:danang.overview.best_time.title')}
                      </Title>
                      <Paragraph className="dark:text-gray-300">
                        {t('destination:danang.overview.best_time.description')}
                      </Paragraph>
                      <div className="mt-4">
                        <WeatherWidget data={weatherData} />
                      </div>
                    </Card>
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants} className="mb-12">
                  <Card>
                    <Title level={4} className="mb-4 dark:text-white">
                      {t('destination:danang.overview.cultural_significance.title')}
                    </Title>
                    <Paragraph className="dark:text-gray-300">
                      {t('destination:danang.overview.cultural_significance.description')}
                    </Paragraph>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="text-center">
                      <CompassOutlined className="text-4xl text-primary mb-4" />
                      <Title level={5} className="dark:text-white">
                        {t('destination:danang.overview.quick_facts.location')}
                      </Title>
                      <Text className="dark:text-gray-300">
                        {t('destination:danang.overview.quick_facts.location_value')}
                      </Text>
                    </Card>
                    
                    <Card className="text-center">
                      <ClockCircleOutlined className="text-4xl text-primary mb-4" />
                      <Title level={5} className="dark:text-white">
                        {t('destination:danang.overview.quick_facts.time_zone')}
                      </Title>
                      <Text className="dark:text-gray-300">
                        {t('destination:danang.overview.quick_facts.time_zone_value')}
                      </Text>
                    </Card>
                    
                    <Card className="text-center">
                      <EnvironmentOutlined className="text-4xl text-primary mb-4" />
                      <Title level={5} className="dark:text-white">
                        {t('destination:danang.overview.quick_facts.population')}
                      </Title>
                      <Text className="dark:text-gray-300">
                        {t('destination:danang.overview.quick_facts.population_value')}
                      </Text>
                    </Card>
                  </div>
                </motion.div>
              </motion.div>
            </TabPane>
            
            <TabPane 
              tab={<span className="tab-item"><PictureOutlined />{t('destination:tabs.attractions')}</span>} 
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
                    {t('destination:danang.attractions.title')}
                  </Title>
                  <Paragraph className="text-lg dark:text-gray-300">
                    {t('destination:danang.attractions.intro')}
                  </Paragraph>
                </motion.div>
                
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
            
            <TabPane 
              tab={<span className="tab-item"><CoffeeOutlined />{t('destination:tabs.food_and_drink')}</span>} 
              key="food"
            >
              <div className="py-8">
                <Title level={2} className="mb-4 dark:text-white">
                  {t('destination:danang.food.title')}
                </Title>
                <Paragraph className="text-lg dark:text-gray-300 mb-8">
                  {t('destination:danang.food.intro')}
                </Paragraph>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index}>
                      <div className="flex items-start">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg mr-4 overflow-hidden">
                          <img 
                            src={`/assets/destinations/danang/food-${index + 1}.jpg`} 
                            alt={t(`destination:danang.food.dishes.${index}.name`)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Title level={5} className="mb-1 dark:text-white">
                            {t(`destination:danang.food.dishes.${index}.name`)}
                          </Title>
                          <Paragraph className="dark:text-gray-300 mb-2">
                            {t(`destination:danang.food.dishes.${index}.description`)}
                          </Paragraph>
                          <Tag color="green">
                            {t(`destination:danang.food.dishes.${index}.where_to_try`)}
                          </Tag>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Title level={3} className="mb-4 dark:text-white">
                  {t('destination:danang.food.restaurants.title')}
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="h-full">
                      <Title level={5} className="mb-2 dark:text-white">
                        {t(`destination:danang.food.restaurants.list.${index}.name`)}
                      </Title>
                      <div className="flex items-center mb-2">
                        <StarFilled className="text-yellow-500 mr-1" />
                        <Text className="dark:text-gray-300">
                          {t(`destination:danang.food.restaurants.list.${index}.rating`)}
                        </Text>
                      </div>
                      <Paragraph className="dark:text-gray-300 mb-2">
                        {t(`destination:danang.food.restaurants.list.${index}.description`)}
                      </Paragraph>
                      <div className="flex items-center">
                        <EnvironmentOutlined className="mr-1 text-gray-500" />
                        <Text className="text-gray-500 dark:text-gray-400">
                          {t(`destination:danang.food.restaurants.list.${index}.address`)}
                        </Text>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabPane>
            
            <TabPane 
              tab={<span className="tab-item"><ShopOutlined />{t('destination:tabs.shopping')}</span>} 
              key="shopping"
            >
              <div className="py-8">
                <Title level={2} className="mb-4 dark:text-white">
                  {t('destination:danang.shopping.title')}
                </Title>
                <Paragraph className="text-lg dark:text-gray-300 mb-8">
                  {t('destination:danang.shopping.intro')}
                </Paragraph>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="h-full">
                      <Title level={4} className="mb-2 dark:text-white">
                        {t(`destination:danang.shopping.places.${index}.name`)}
                      </Title>
                      <Paragraph className="dark:text-gray-300 mb-3">
                        {t(`destination:danang.shopping.places.${index}.description`)}
                      </Paragraph>
                      <div className="flex items-center mb-2">
                        <EnvironmentOutlined className="mr-2 text-gray-500" />
                        <Text className="text-gray-500 dark:text-gray-400">
                          {t(`destination:danang.shopping.places.${index}.location`)}
                        </Text>
                      </div>
                      <div className="flex items-center">
                        <ClockCircleOutlined className="mr-2 text-gray-500" />
                        <Text className="text-gray-500 dark:text-gray-400">
                          {t(`destination:danang.shopping.places.${index}.hours`)}
                        </Text>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Title level={3} className="mb-4 dark:text-white">
                  {t('destination:danang.shopping.souvenirs.title')}
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="text-center h-full">
                      <div className="w-20 h-20 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <img 
                          src={`/assets/destinations/danang/souvenir-${index + 1}.svg`} 
                          alt="Souvenir"
                          className="w-12 h-12"
                        />
                      </div>
                      <Title level={5} className="mb-2 dark:text-white">
                        {t(`destination:danang.shopping.souvenirs.items.${index}.name`)}
                      </Title>
                      <Paragraph className="dark:text-gray-300">
                        {t(`destination:danang.shopping.souvenirs.items.${index}.description`)}
                      </Paragraph>
                    </Card>
                  ))}
                </div>
              </div>
            </TabPane>
            
            <TabPane 
              tab={<span className="tab-item"><CarOutlined />{t('destination:tabs.getting_around')}</span>} 
              key="transport"
            >
              <div className="py-8">
                <Title level={2} className="mb-4 dark:text-white">
                  {t('destination:danang.transport.title')}
                </Title>
                <Paragraph className="text-lg dark:text-gray-300 mb-8">
                  {t('destination:danang.transport.intro')}
                </Paragraph>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="h-full">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                          <img 
                            src={`/assets/destinations/danang/transport-${index + 1}.svg`} 
                            alt="Transport"
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <Title level={5} className="mb-2 dark:text-white">
                            {t(`destination:danang.transport.options.${index}.name`)}
                          </Title>
                          <Paragraph className="dark:text-gray-300 mb-2">
                            {t(`destination:danang.transport.options.${index}.description`)}
                          </Paragraph>
                          <div className="flex items-center">
                            <Tag color="blue">
                              {t(`destination:danang.transport.options.${index}.cost`)}
                            </Tag>
                            <Tag color="green" className="ml-2">
                              {t(`destination:danang.transport.options.${index}.convenience`)}
                            </Tag>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Card className="mb-8">
                  <Title level={4} className="mb-4 dark:text-white">
                    {t('destination:danang.transport.tips.title')}
                  </Title>
                  <ul className="list-disc pl-5 space-y-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <li key={index} className="dark:text-gray-300">
                        {t(`destination:danang.transport.tips.list.${index}`)}
                      </li>
                    ))}
                  </ul>
                </Card>
                
                <div ref={mapRef}>
                  <DestinationMap city="Da Nang" inView={mapInView} />
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
              {t('destination:photo_gallery.title')}
            </Title>
            <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
              {t('destination:photo_gallery.description')}
            </Paragraph>
          </div>
          
          <PhotoGallery inView={galleryInView} city="danang" />
        </div>
      </section>
      
      {/* Recommendations Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Title level={2} className="mb-3 dark:text-white">
              {t('destination:recommendations.title')}
            </Title>
            <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
              {t('destination:recommendations.description')}
            </Paragraph>
          </div>
          
          <Recommendations city="danang" />
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <Title level={2} className="text-white mb-4">
            {t('destination:cta.title')}
          </Title>
          <Paragraph className="text-lg text-white mb-8 max-w-3xl mx-auto">
            {t('destination:cta.description')}
          </Paragraph>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="large" type="default" onClick={restartTourGuide} className="bg-white text-primary h-12 font-bold">
              {t('destination:cta.restart_tour')}
            </Button>
            <Button size="large" type="default" onClick={handleShare} className="bg-transparent text-white border-white h-12 font-bold">
              <ShareAltOutlined /> {t('common:actions.share')}
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DaNangGuidePage;
