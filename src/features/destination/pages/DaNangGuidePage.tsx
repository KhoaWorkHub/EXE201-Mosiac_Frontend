import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button, Typography, Affix, Spin, message, Badge } from 'antd';
import { 
  ArrowDownOutlined, 
  EnvironmentOutlined,
  CompassOutlined,
  CameraOutlined,
  CoffeeOutlined,
  CarOutlined,
  ReadOutlined,
  BulbOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import InteractiveGuide from '../components/InteractiveGuide';
import LanguageSwitcher from '../components/LanguageSwitcher';
import WeatherWidget from '../components/WeatherWidget';
import { useParallaxScrolling } from '../hooks/useParallaxScrolling';
import ImmersiveTourGuide from '../components/ImmersiveTourGuide';

const { Title, Paragraph, Text } = Typography;

// Navigation sections for the guide
const SECTIONS = [
  { id: 'intro', icon: <CompassOutlined />, color: '#4096ff' },
  { id: 'attractions', icon: <CameraOutlined />, color: '#ff4d4f' },
  { id: 'cuisine', icon: <CoffeeOutlined />, color: '#ffa940' },
  { id: 'culture', icon: <ReadOutlined />, color: '#73d13d' },
  { id: 'travel', icon: <CarOutlined />, color: '#9254de' },
  { id: 'tips', icon: <BulbOutlined />, color: '#36cfc9' },
];

const EnhancedDaNangGuidePage: React.FC = () => {
  const { t } = useTranslation(['destinations/danang', 'destination']);
  const [currentSection, setCurrentSection] = useState('intro');
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  interface WeatherData {
    temperature: number;
    condition: string;
    humidity: number;
    wind: number;
    forecast: Array<{
      day: string;
      temp: number;
      condition: string;
    }>;
  }
  
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [showTourGuide, setShowTourGuide] = useState(true);
  
  // Refs for each section to track visibility
  const introRef = useRef<HTMLDivElement>(null);
  const attractionsRef = useRef<HTMLDivElement>(null);
  const cuisineRef = useRef<HTMLDivElement>(null);
  const cultureRef = useRef<HTMLDivElement>(null);
  const travelRef = useRef<HTMLDivElement>(null);
  const tipsRef = useRef<HTMLDivElement>(null);
  
  const sectionRefs = useMemo(() => ({
    intro: introRef,
    attractions: attractionsRef,
    cuisine: cuisineRef,
    culture: cultureRef,
    travel: travelRef,
    tips: tipsRef,
  }), []);
  
  // Parallax effects for hero section
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 0.5], [1, 1.1]);
  const heroY = useTransform(heroScrollProgress, [0, 0.5], [0, 100]);
  
  // Apply parallax to other sections
  const attractionsParallax = useParallaxScrolling(sectionRefs.attractions as React.RefObject<HTMLElement>, 0.3);
  const cuisineParallax = useParallaxScrolling(sectionRefs.cuisine as React.RefObject<HTMLElement>, 0.2);
  const cultureParallax = useParallaxScrolling(sectionRefs.culture as React.RefObject<HTMLElement>, 0.4);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Simulate weather data
  useEffect(() => {
    setWeatherData({
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
    });
  }, []);
  
  // Track which section is in view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id);
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all section refs
    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    
    return () => observer.disconnect();
  }, [sectionRefs]);
  
  // Navigation Scroll Handler
  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs[sectionId as keyof typeof sectionRefs]?.current;
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };
  
  // Open Interactive Guide
  const openInteractiveGuide = (guideId: string) => {
    setActiveGuide(guideId);
  };
  
  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t('destinations/danang:share.title'),
        text: t('destinations/danang:share.text'),
        url: window.location.href,
      })
      .catch(() => message.info(t('destinations/danang:share.cancelled')));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => message.success(t('destinations/danang:share.copied')))
        .catch(() => message.error(t('destinations/danang:share.error')));
    }
  };
  
  const handleTourComplete = () => {
    setShowTourGuide(false);
  };
  
  const handleTourSkip = () => {
    setShowTourGuide(false);
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-xl">{t('destination:loading')}</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Fixed Navigation */}
      <Affix offsetTop={70} className="hidden md:block">
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
          <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-2">
            <div className="flex flex-col items-center space-y-4">
              {SECTIONS.map(section => (
                <Badge key={section.id} dot={currentSection === section.id}>
                  <Button 
                    type="text"
                    shape="circle"
                    icon={section.icon}
                    className={`text-lg ${currentSection === section.id ? 'text-primary' : ''}`}
                    onClick={() => scrollToSection(section.id)}
                    style={{ 
                      color: currentSection === section.id ? section.color : ''
                    }}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Affix>
      
      {/* Floating Language Switcher */}
      <div className="fixed top-24 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
      {/* Hero Section with Parallax */}
      <motion.section 
        ref={heroRef}
        className="relative h-screen overflow-hidden"
        style={{
          backgroundImage: `url(/assets/destinations/danang/hero-night.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-40"
          style={{ opacity: heroOpacity }}
        />
        
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4"
          style={{ 
            scale: heroScale,
            y: heroY
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="mb-6">
              <Badge 
                color="blue" 
                text={
                  <span className="text-white text-lg flex items-center">
                    <EnvironmentOutlined className="mr-1" /> 
                    {t('destinations/danang:region')}
                  </span>
                }
              />
            </div>
            
            <Title level={1} className="text-5xl md:text-7xl text-white font-bold mb-6 leading-tight">
              {t('destinations/danang:hero.title')}
            </Title>
            
            <Paragraph className="text-xl md:text-2xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
              {t('destinations/danang:hero.subtitle')}
            </Paragraph>
            
            <Button 
              type="primary" 
              size="large" 
              className="mt-8 text-lg h-12 px-6"
              onClick={() => scrollToSection('intro')}
            >
              {t('destinations/danang:hero.cta')}
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Scroll Down Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDownOutlined className="text-2xl mb-2" />
          <p className="text-sm">{t('destination:scroll_down')}</p>
        </motion.div>
      </motion.section>
      
      {/* Introduction Section */}
      <section 
        id="intro" 
        ref={sectionRefs.intro}
        className="py-20 bg-white dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Title level={2} className="text-4xl mb-6 text-center dark:text-white">
                {t('destinations/danang:intro.title')}
              </Title>
              
              <div className="mb-8 text-center">
                <WeatherWidget data={weatherData} />
              </div>
              
              <Paragraph className="text-lg mb-6 dark:text-gray-300">
                {t('destinations/danang:intro.paragraph1')}
              </Paragraph>
              
              <Paragraph className="text-lg mb-8 dark:text-gray-300">
                {t('destinations/danang:intro.paragraph2')}
              </Paragraph>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                  <CompassOutlined className="text-4xl text-blue-500 mb-4" />
                  <Title level={4} className="mb-2 dark:text-white">
                    {t('destinations/danang:intro.highlights.location.title')}
                  </Title>
                  <Text className="dark:text-gray-300">
                    {t('destinations/danang:intro.highlights.location.description')}
                  </Text>
                </div>
                
                <div className="bg-green-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                  <CameraOutlined className="text-4xl text-green-500 mb-4" />
                  <Title level={4} className="mb-2 dark:text-white">
                    {t('destinations/danang:intro.highlights.attractions.title')}
                  </Title>
                  <Text className="dark:text-gray-300">
                    {t('destinations/danang:intro.highlights.attractions.description')}
                  </Text>
                </div>
                
                <div className="bg-orange-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                  <CoffeeOutlined className="text-4xl text-orange-500 mb-4" />
                  <Title level={4} className="mb-2 dark:text-white">
                    {t('destinations/danang:intro.highlights.cuisine.title')}
                  </Title>
                  <Text className="dark:text-gray-300">
                    {t('destinations/danang:intro.highlights.cuisine.description')}
                  </Text>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  type="primary" 
                  onClick={() => openInteractiveGuide('welcome')}
                  size="large"
                >
                  {t('destinations/danang:buttons.explore_interactive')}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Attractions Section - with Parallax */}
      <section 
        id="attractions" 
        ref={sectionRefs.attractions}
        className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <motion.div
            style={attractionsParallax}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Title level={2} className="text-4xl mb-8 text-center dark:text-white">
                {t('destinations/danang:attractions.title')}
              </Title>
              
              <Paragraph className="text-lg mb-12 text-center dark:text-gray-300">
                {t('destinations/danang:attractions.intro')}
              </Paragraph>
              
              <div className="mb-12">
                <div className="relative rounded-xl overflow-hidden h-96 mb-8">
                  <img 
                    src="/assets/destinations/danang/golden-bridge.jpg" 
                    alt={t('destinations/danang:attractions.golden_bridge.title')} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-8 text-white">
                    <Title level={3} className="text-white mb-2">
                      {t('destinations/danang:attractions.golden_bridge.title')}
                    </Title>
                    <Text className="text-white text-lg opacity-90">
                      {t('destinations/danang:attractions.golden_bridge.subtitle')}
                    </Text>
                  </div>
                </div>
                
                <Paragraph className="text-lg mb-6 dark:text-gray-300">
                  {t('destinations/danang:attractions.golden_bridge.description')}
                </Paragraph>
                
                <div className="mb-6">
                  <Title level={4} className="mb-4 dark:text-white">
                    {t('destinations/danang:attractions.golden_bridge.story.title')}
                  </Title>
                  <Paragraph className="text-lg italic border-l-4 border-primary pl-4 py-2 dark:text-gray-300">
                    {t('destinations/danang:attractions.golden_bridge.story.content')}
                  </Paragraph>
                </div>
                
                <div className="text-center mt-8">
                  <Button 
                    type="primary" 
                    onClick={() => openInteractiveGuide('golden_bridge')}
                    size="large"
                  >
                    {t('destinations/danang:buttons.explore_interactive')}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src="/assets/destinations/danang/marble-mountains.jpg" 
                      alt={t('destinations/danang:attractions.marble_mountains.title')} 
                      className="w-full h-full object-cover transition duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <Title level={4} className="mb-2 dark:text-white">
                      {t('destinations/danang:attractions.marble_mountains.title')}
                    </Title>
                    <Paragraph className="mb-4 dark:text-gray-300">
                      {t('destinations/danang:attractions.marble_mountains.description')}
                    </Paragraph>
                    <Button 
                      type="primary" 
                      onClick={() => openInteractiveGuide('marble_mountains')}
                    >
                      {t('destinations/danang:buttons.discover_more')}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src="/assets/destinations/danang/my-khe-beach.jpg" 
                      alt={t('destinations/danang:attractions.my_khe_beach.title')} 
                      className="w-full h-full object-cover transition duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <Title level={4} className="mb-2 dark:text-white">
                      {t('destinations/danang:attractions.my_khe_beach.title')}
                    </Title>
                    <Paragraph className="mb-4 dark:text-gray-300">
                      {t('destinations/danang:attractions.my_khe_beach.description')}
                    </Paragraph>
                    <Button 
                      type="primary" 
                      onClick={() => openInteractiveGuide('my_khe_beach')}
                    >
                      {t('destinations/danang:buttons.discover_more')}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => openInteractiveGuide('all_attractions')}
                >
                  {t('destinations/danang:buttons.see_all_attractions')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Cuisine Section */}
      <section 
        id="cuisine" 
        ref={sectionRefs.cuisine}
        className="py-20 bg-white dark:bg-gray-800 overflow-hidden"
        style={{
          backgroundImage: "url(/assets/destinations/danang/food-texture.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundBlendMode: "overlay"
        }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            style={cuisineParallax}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-8 rounded-xl shadow-xl"
            >
              <Title level={2} className="text-4xl mb-8 text-center dark:text-white">
                {t('destinations/danang:cuisine.title')}
              </Title>
              
              <Paragraph className="text-lg mb-12 text-center dark:text-gray-300">
                {t('destinations/danang:cuisine.intro')}
              </Paragraph>
              
              <div className="mb-12">
                <div className="relative rounded-xl overflow-hidden h-80 mb-8">
                  <img 
                    src="/assets/destinations/danang/mi-quang.jpg" 
                    alt={t('destinations/danang:cuisine.mi_quang.title')} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 p-8 text-white">
                    <Title level={3} className="text-white mb-2">
                      {t('destinations/danang:cuisine.mi_quang.title')}
                    </Title>
                    <Text className="text-white text-lg opacity-90">
                      {t('destinations/danang:cuisine.mi_quang.subtitle')}
                    </Text>
                  </div>
                </div>
                
                <Paragraph className="text-lg mb-6 dark:text-gray-300">
                  {t('destinations/danang:cuisine.mi_quang.description')}
                </Paragraph>
                
                <div className="mb-6">
                  <Title level={4} className="mb-4 dark:text-white">
                    {t('destinations/danang:cuisine.mi_quang.story.title')}
                  </Title>
                  <Paragraph className="text-lg italic border-l-4 border-primary pl-4 py-2 dark:text-gray-300">
                    {t('destinations/danang:cuisine.mi_quang.story.content')}
                  </Paragraph>
                </div>
                
                <div className="text-center mt-8">
                  <Button 
                    type="primary" 
                    onClick={() => openInteractiveGuide('mi_quang')}
                    size="large"
                  >
                    {t('destinations/danang:buttons.explore_interactive')}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {['banh_xeo', 'seafood', 'coffee'].map((food) => (
                  <div key={food} className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={`/assets/destinations/danang/${food}.jpg`}
                        alt={t(`destinations/danang:cuisine.${food}.title`)}
                        className="w-full h-full object-cover transition duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <Title level={4} className="mb-2 dark:text-white">
                        {t(`destinations/danang:cuisine.${food}.title`)}
                      </Title>
                      <Paragraph className="mb-4 dark:text-gray-300">
                        {t(`destinations/danang:cuisine.${food}.short_description`)}
                      </Paragraph>
                      <Button 
                        type="primary" 
                        onClick={() => openInteractiveGuide(food)}
                      >
                        {t('destinations/danang:buttons.learn_more')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => openInteractiveGuide('all_cuisine')}
                >
                  {t('destinations/danang:buttons.see_all_cuisine')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Culture Section */}
      <section 
        id="culture" 
        ref={sectionRefs.culture}
        className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <motion.div
            style={cultureParallax}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Title level={2} className="text-4xl mb-8 text-center dark:text-white">
                {t('destinations/danang:culture.title')}
              </Title>
              
              <Paragraph className="text-lg mb-12 text-center dark:text-gray-300">
                {t('destinations/danang:culture.intro')}
              </Paragraph>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                  <div className="rounded-xl overflow-hidden h-96 mb-4">
                    <img 
                      src="/assets/destinations/danang/champa-culture.jpg" 
                      alt={t('destinations/danang:culture.champa.title')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {t('destinations/danang:culture.champa.image_caption')}
                  </Text>
                </div>
                
                <div>
                  <Title level={3} className="mb-4 dark:text-white">
                    {t('destinations/danang:culture.champa.title')}
                  </Title>
                  <Paragraph className="text-lg mb-6 dark:text-gray-300">
                    {t('destinations/danang:culture.champa.paragraph1')}
                  </Paragraph>
                  <Paragraph className="text-lg mb-6 dark:text-gray-300">
                    {t('destinations/danang:culture.champa.paragraph2')}
                  </Paragraph>
                  <Button 
                    type="primary" 
                    onClick={() => openInteractiveGuide('champa_culture')}
                  >
                    {t('destinations/danang:buttons.explore_interactive')}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {['festivals', 'arts', 'traditions'].map((culture) => (
                  <div key={culture} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={`/assets/destinations/danang/${culture}.jpg`}
                        alt={t(`destinations/danang:culture.${culture}.title`)}
                        className="w-full h-full object-cover transition duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <Title level={4} className="mb-2 dark:text-white">
                        {t(`destinations/danang:culture.${culture}.title`)}
                      </Title>
                      <Paragraph className="mb-4 dark:text-gray-300">
                        {t(`destinations/danang:culture.${culture}.short_description`)}
                      </Paragraph>
                      <Button 
                        type="primary" 
                        onClick={() => openInteractiveGuide(culture)}
                      >
                        {t('destinations/danang:buttons.discover_more')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Travel Information Section */}
      <section 
        id="travel" 
        ref={sectionRefs.travel}
        className="py-20 bg-white dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Title level={2} className="text-4xl mb-8 text-center dark:text-white">
                {t('destinations/danang:travel.title')}
              </Title>
              
              <Paragraph className="text-lg mb-12 text-center dark:text-gray-300">
                {t('destinations/danang:travel.intro')}
              </Paragraph>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-md">
                  <Title level={3} className="mb-4 flex items-center dark:text-white">
                    <CarOutlined className="mr-2 text-primary" />
                    {t('destinations/danang:travel.transportation.title')}
                  </Title>
                  
                  <div className="space-y-4">
                    {['motorbike', 'taxi', 'bus', 'bicycle'].map((transport) => (
                      <div key={transport} className="flex items-start">
                        <div className="bg-primary bg-opacity-20 rounded-full p-2 mr-4 mt-1">
                          <div className="w-6 h-6 flex items-center justify-center">
                            <img 
                              src={`/assets/destinations/danang/icon-${transport}.svg`}
                              alt={transport}
                              className="w-4 h-4"
                            />
                          </div>
                        </div>
                        <div>
                          <Title level={5} className="mb-1 dark:text-white">
                            {t(`destinations/danang:travel.transportation.${transport}.title`)}
                          </Title>
                          <Paragraph className="dark:text-gray-300">
                            {t(`destinations/danang:travel.transportation.${transport}.description`)}
                          </Paragraph>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      type="primary" 
                      onClick={() => openInteractiveGuide('transportation')}
                    >
                      {t('destinations/danang:buttons.explore_interactive')}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-md">
                  <Title level={3} className="mb-4 flex items-center dark:text-white">
                    <EnvironmentOutlined className="mr-2 text-primary" />
                    {t('destinations/danang:travel.accommodation.title')}
                  </Title>
                  
                  <div className="space-y-4">
                    {['luxury', 'midrange', 'budget'].map((accom) => (
                      <div key={accom} className="mb-6">
                        <Title level={5} className="mb-2 dark:text-white">
                          {t(`destinations/danang:travel.accommodation.${accom}.title`)}
                        </Title>
                        <Paragraph className="mb-2 dark:text-gray-300">
                          {t(`destinations/danang:travel.accommodation.${accom}.description`)}
                        </Paragraph>
                        <div className="text-primary">
                          {t(`destinations/danang:travel.accommodation.${accom}.price_range`)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      type="primary" 
                      onClick={() => openInteractiveGuide('accommodation')}
                    >
                      {t('destinations/danang:buttons.explore_interactive')}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-md mb-8">
                <Title level={3} className="mb-4 dark:text-white">
                  {t('destinations/danang:travel.seasons.title')}
                </Title>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Paragraph className="mb-4 text-lg dark:text-gray-300">
                      {t('destinations/danang:travel.seasons.description')}
                    </Paragraph>
                    
                    <div className="space-y-4">
                      {['dry', 'rainy'].map((season) => (
                        <div key={season} className="mb-4">
                          <Title level={5} className="mb-1 dark:text-white">
                            {t(`destinations/danang:travel.seasons.${season}.title`)}
                          </Title>
                          <Paragraph className="dark:text-gray-300">
                            {t(`destinations/danang:travel.seasons.${season}.description`)}
                          </Paragraph>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                      <Title level={4} className="mb-4 text-center dark:text-white">
                        {t('destinations/danang:travel.seasons.best_time')}
                      </Title>
                      
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map((month, index) => {
                          const isRecommended = index >= 1 && index <= 4; // Feb to May
                          return (
                            <div 
                              key={month} 
                              className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                                isRecommended 
                                  ? 'bg-primary text-white' 
                                  : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {t(`destinations/danang:travel.seasons.months.${month}`)}
                            </div>
                          );
                        })}
                      </div>
                      
                      <Paragraph className="text-center text-gray-600 dark:text-gray-400">
                        {t('destinations/danang:travel.seasons.recommendation')}
                      </Paragraph>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Tips and Practical Info */}
      <section 
        id="tips" 
        ref={sectionRefs.tips}
        className="py-20 bg-gray-50 dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Title level={2} className="text-4xl mb-8 text-center dark:text-white">
                {t('destinations/danang:tips.title')}
              </Title>
              
              <Paragraph className="text-lg mb-12 text-center dark:text-gray-300">
                {t('destinations/danang:tips.intro')}
              </Paragraph>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {['safety', 'etiquette', 'money'].map((tip) => (
                  <div key={tip} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                    <div className="bg-primary bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <img 
                        src={`/assets/destinations/danang/icon-${tip}.svg`}
                        alt={tip}
                        className="w-6 h-6"
                      />
                    </div>
                    
                    <Title level={4} className="mb-4 dark:text-white">
                      {t(`destinations/danang:tips.${tip}.title`)}
                    </Title>
                    
                    <ul className="space-y-2">
                      {[0, 1, 2].map((i) => (
                        <li key={i} className="flex items-start">
                          <div className="bg-primary w-5 h-5 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                            <span className="text-white text-xs">{i+1}</span>
                          </div>
                          <Paragraph className="dark:text-gray-300 mb-0">
                            {t(`destinations/danang:tips.${tip}.items.${i}`)}
                          </Paragraph>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      type="link" 
                      className="p-0 mt-4"
                      onClick={() => openInteractiveGuide(`tips_${tip}`)}
                    >
                      {t('destinations/danang:buttons.read_more')}
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md mb-12">
                <Title level={3} className="mb-6 text-center dark:text-white">
                  {t('destinations/danang:tips.insider.title')}
                </Title>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <img 
                      src="/assets/destinations/danang/local-perspective.jpg"
                      alt={t('destinations/danang:tips.insider.local_name')}
                      className="w-full h-72 object-cover rounded-xl mb-4"
                    />
                    <div className="text-center">
                      <Title level={5} className="mb-1 dark:text-white">
                        {t('destinations/danang:tips.insider.local_name')}
                      </Title>
                      <Text className="text-gray-500 dark:text-gray-400">
                        {t('destinations/danang:tips.insider.local_occupation')}
                      </Text>
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl mb-4">
                      <Text className="text-4xl">❝</Text>
                      <Paragraph className="text-lg italic mb-4 dark:text-gray-300">
                        {t('destinations/danang:tips.insider.quote')}
                      </Paragraph>
                    </div>
                    
                    <Title level={4} className="mb-2 dark:text-white">
                      {t('destinations/danang:tips.insider.secret_spots.title')}
                    </Title>
                    
                    <ul className="space-y-2 mb-4">
                      {[0, 1, 2].map((i) => (
                        <li key={i} className="flex items-start">
                          <div className="text-primary mr-2">•</div>
                          <Paragraph className="dark:text-gray-300 mb-0">
                            {t(`destinations/danang:tips.insider.secret_spots.items.${i}`)}
                          </Paragraph>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      type="primary" 
                      onClick={() => openInteractiveGuide('insider_tips')}
                    >
                      {t('destinations/danang:buttons.explore_interactive')}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => openInteractiveGuide('all_tips')}
                >
                  {t('destinations/danang:buttons.see_all_tips')}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Title level={2} className="text-4xl text-white mb-4">
              {t('destinations/danang:cta.title')}
            </Title>
            
            <Paragraph className="text-xl text-white mb-8 max-w-3xl mx-auto">
              {t('destinations/danang:cta.description')}
            </Paragraph>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="large" 
                className="bg-white text-primary h-12 px-8 font-bold border-none shadow-lg hover:bg-gray-100"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {t('destinations/danang:cta.restart')}
              </Button>
              
              <Button 
                size="large" 
                className="bg-transparent text-white border-white h-12 px-8 font-bold hover:bg-white hover:bg-opacity-10"
                onClick={handleShare}
              >
                <ShareAltOutlined className="mr-2" />
                {t('destinations/danang:cta.share')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Immersive Tour Guide */}
      <AnimatePresence>
        {showTourGuide && (
          <ImmersiveTourGuide 
            onComplete={handleTourComplete} 
            onSkip={handleTourSkip}
            sectionRefs={sectionRefs as unknown as Record<string, React.RefObject<HTMLElement>>}
          />
        )}
      </AnimatePresence>
      
      {/* Interactive Guide Modal */}
      <AnimatePresence>
        {activeGuide && (
          <InteractiveGuide
            guideId={activeGuide}
            onClose={() => setActiveGuide(null)}
          />
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default EnhancedDaNangGuidePage;