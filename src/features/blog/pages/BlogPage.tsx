import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Typography, Divider, Tag, Button } from 'antd';
import { 
  CompassOutlined, 
  CalendarOutlined, 
  EnvironmentOutlined,
  FireOutlined,
  StarFilled,
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  RocketOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Text, Paragraph } = Typography;

// Enhanced tour guides list with Quảng Ninh featured
const tourGuides = [
  {
    id: 'quangninh',
    title: 'Quảng Ninh',
    titleVi: 'Quảng Ninh',
    description: 'destinationquangninh:overview.intro',
    image: '/assets/destinations/quangninh/banner-1.jpg',
    url: '/destinations/quangninh',
    date: '2025-06-14',
    region: 'Northeast Vietnam',
    regionVi: 'Đông Bắc Việt Nam',
    color: 'volcano',
    gradient: 'from-slate-600 to-stone-700',
    featured: true,
    rating: 4.9,
    icon: <span className="text-2xl">🗿</span>,
    views: '2.5K',
    likes: '1.2K',
    isNew: true,
    specialty: 'Limestone Karsts'
  },
  {
    id: 'khanhhoa',
    title: 'Khánh Hòa',
    titleVi: 'Khánh Hòa',
    description: 'destinationkhanhhoa:overview.intro',
    image: '/assets/destinations/khanhhoa/banner-1.jpg',
    url: '/destinations/khanhhoa',
    date: '2025-06-14',
    region: 'South Central Coast',
    regionVi: 'Duyên Hải Nam Trung Bộ',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    featured: false,
    rating: 4.9,
    icon: <span className="text-2xl">🌊</span>,
    views: '3.1K',
    likes: '1.8K',
    isNew: false,
    specialty: 'Coastal Paradise'
  },
  {
    id: 'hcm',
    title: 'Ho Chi Minh City',
    titleVi: 'TP. Hồ Chí Minh',
    description: 'destinationhcm:overview.intro',
    image: '/assets/destinations/hcm/banner-1.jpg',
    url: '/destinations/hcm',
    date: '2025-02-10',
    region: 'Southern Vietnam',
    regionVi: 'Miền Nam Việt Nam',
    color: 'volcano',
    gradient: 'from-orange-500 to-red-500',
    featured: false,
    rating: 4.9,
    icon: <FireOutlined />,
    views: '4.7K',
    likes: '2.3K',
    isNew: false,
    specialty: 'Urban Energy'
  },
  {
    id: 'danang',
    title: 'Da Nang',
    titleVi: 'Đà Nẵng',
    description: 'destinationdanang:overview.intro',
    image: '/assets/destinations/danang/banner-1.jpg',
    url: '/destinations/danang',
    date: '2025-02-15',
    region: 'Central Vietnam',
    regionVi: 'Miền Trung Việt Nam',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    featured: false,
    rating: 4.7,
    icon: <CompassOutlined />,
    views: '3.8K',
    likes: '1.9K',
    isNew: false,
    specialty: 'Beach Culture'
  },
  {
    id: 'hanoi',
    title: 'Hanoi',
    titleVi: 'Hà Nội',
    description: 'destinationhanoi:overview.intro',
    image: '/assets/destinations/hanoi/banner-1.jpg',
    url: '/destinations/hanoi',
    date: '2025-02-20',
    region: 'Northern Vietnam',
    regionVi: 'Miền Bắc Việt Nam',
    color: 'gold',
    gradient: 'from-yellow-500 to-orange-500',
    featured: false,
    rating: 4.8,
    icon: <StarFilled />,
    views: '4.2K',
    likes: '2.1K',
    isNew: false,
    specialty: 'Cultural Heritage'
  },
];

const BlogPage: React.FC = () => {
  const { t, i18n } = useTranslation(['destinationdanang', 'destinationhanoi', 'destinationhcm', 'destinationkhanhhoa', 'destinationquangninh', 'common']);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const featuredVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 50 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardHoverVariants = {
    rest: { y: 0, scale: 1 },
    hover: { 
      y: -8, 
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  // Get the featured destination (Quảng Ninh)
  const featuredDestination = tourGuides.find(guide => guide.featured);
  const otherDestinations = tourGuides.filter(guide => !guide.featured);
  
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Enhanced Hero Section */}
        <section className="relative py-20 md:py-28 px-4 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
                animate={{
                  y: [0, -100, 0],
                  x: [0, Math.sin(i) * 50, 0],
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: Math.random() * 8 + 6,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
                style={{
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%'
                }}
              />
            ))}
          </div>

          <div className="container mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl mr-4"
                >
                  <CompassOutlined className="text-white text-3xl" />
                </motion.div>
                <div className="text-left">
                  <Title level={1} className="dark:text-white mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-4xl md:text-6xl font-bold">
                    {t('common:nav.blog')}
                  </Title>
                  <Text className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
                    Vietnam Travel Guides
                  </Text>
                </div>
              </div>
              
              <Paragraph className="text-lg md:text-xl dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Explore our comprehensive travel guides and discover the beauty of Vietnam's most captivating destinations. 
                From limestone karsts to pristine beaches, cultural heritage to urban energy.
              </Paragraph>
            </motion.div>
            
            {/* Stats Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12"
            >
              {[
                { number: '5+', label: 'Destinations', icon: '🌍' },
                { number: '15K+', label: 'Travelers', icon: '👥' },
                { number: '4.8', label: 'Avg Rating', icon: '⭐' },
                { number: '50+', label: 'Attractions', icon: '🎯' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg"
                >
                  <div className="text-2xl md:text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.number}</div>
                  <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
        </div>
        </section>
        
        <Divider className="my-8 md:my-12" />

        {/* Featured Destination - Quảng Ninh with Limestone Theme */}
        {featuredDestination && (
          <section className="px-4 mb-16 md:mb-24">
            <div className="container mx-auto">
              <motion.div
                variants={featuredVariants}
                initial="hidden"
                animate="visible"
                className="mb-8 md:mb-12"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
                  <div className="flex items-center mb-4 md:mb-0">
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="text-4xl md:text-5xl mr-4"
                    >
                      🗿
                    </motion.div>
                    <div>
                      <Title level={2} className="dark:text-white m-0 text-2xl md:text-3xl">
                        Featured Limestone Wonder
                      </Title>
                      <Text className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                        UNESCO World Heritage Site
                      </Text>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    <Tag color="volcano" className="text-sm md:text-base px-3 py-1 rounded-full">
                      <CrownOutlined className="mr-1" />
                      FEATURED
                    </Tag>
                    {featuredDestination.isNew && (
                      <Tag color="green" className="text-sm md:text-base px-3 py-1 rounded-full">
                        <RocketOutlined className="mr-1" />
                        NEW
                      </Tag>
                    )}
                  </div>
                </div>
                
                <Link to={featuredDestination.url}>
                  <motion.div
                    whileHover={{ scale: 1.01, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      hoverable 
                      className="overflow-hidden shadow-2xl border-4 border-slate-200 dark:border-slate-700 relative bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-slate-900"
                      cover={
                        <div className="h-64 md:h-96 lg:h-[500px] overflow-hidden relative">
                          <img 
                            src={featuredDestination.image} 
                            alt={i18n.language === 'vi' ? featuredDestination.titleVi : featuredDestination.title} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                          {/* Limestone gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                          
                          {/* Animated limestone particles */}
                          <div className="absolute inset-0">
                            {Array.from({ length: 12 }).map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                                animate={{
                                  y: [100, -20],
                                  x: [Math.random() * 100, Math.random() * 100],
                                  scale: [0, 1, 0],
                                  opacity: [0, 0.8, 0]
                                }}
                                transition={{
                                  duration: Math.random() * 6 + 4,
                                  repeat: Infinity,
                                  delay: Math.random() * 3,
                                  ease: "easeOut"
                                }}
                                style={{
                                  left: Math.random() * 100 + '%',
                                  top: Math.random() * 100 + '%'
                                }}
                              />
                            ))}
                          </div>
                          
                          {/* Featured badge */}
                          <div className="absolute top-4 md:top-6 left-4 md:left-6">
                            <motion.div 
                              className={`bg-gradient-to-r ${featuredDestination.gradient} text-white px-4 py-2 rounded-full flex items-center font-bold shadow-lg backdrop-blur-sm`}
                              animate={{ 
                                boxShadow: [
                                  '0 0 0 0 rgba(71, 85, 105, 0.4)',
                                  '0 0 0 20px rgba(71, 85, 105, 0)',
                                  '0 0 0 0 rgba(71, 85, 105, 0)'
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {featuredDestination.icon}
                              <span className="ml-2 text-sm md:text-base">Featured</span>
                            </motion.div>
                          </div>

                          {/* Stats badges */}
                          <div className="absolute top-4 md:top-6 right-4 md:right-6 flex flex-col gap-2">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center text-sm md:text-base">
                              <StarFilled className="text-yellow-500 mr-1" />
                              <span className="font-bold text-gray-800">{featuredDestination.rating}</span>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center text-sm">
                              <EyeOutlined className="text-blue-500 mr-1" />
                              <span className="font-bold text-gray-800">{featuredDestination.views}</span>
                            </div>
                          </div>

                          {/* Content overlay */}
                          <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 text-white">
                            <Title level={2} className="text-white mb-2 text-xl md:text-3xl">
                              {i18n.language === 'vi' ? featuredDestination.titleVi : featuredDestination.title}
                            </Title>
                            <Paragraph className="text-gray-200 text-base md:text-lg mb-4 line-clamp-2 md:line-clamp-3">
                              {t(featuredDestination.description)}
                            </Paragraph>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                              <Tag color={featuredDestination.color} icon={<EnvironmentOutlined />} className="text-sm md:text-base px-3 py-1">
                                {i18n.language === 'vi' ? featuredDestination.regionVi : featuredDestination.region}
                              </Tag>
                              <Tag color="green" icon={<CalendarOutlined />} className="text-sm md:text-base px-3 py-1">
                                {new Date(featuredDestination.date).toLocaleDateString()}
                              </Tag>
                              <Tag color="blue" className="text-sm md:text-base px-3 py-1">
                                {featuredDestination.specialty}
                              </Tag>
                            </div>
                          </div>
                        </div>
                      }
                    />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </section>
        )}

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
                  <Title level={2} className="dark:text-white m-0 text-xl md:text-2xl">
                    More Amazing Destinations
                  </Title>
                </div>
                <Button type="primary" size="large" className="w-full md:w-auto">
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
                                alt={i18n.language === 'vi' ? guide.titleVi : guide.title} 
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              
                              {/* Stats overlay */}
                              <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center text-sm">
                                  <StarFilled className="text-yellow-500 mr-1" />
                                  <span className="font-bold text-gray-800">{guide.rating}</span>
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
                              <Title level={4} className="mb-0 dark:text-white text-base md:text-lg">
                                {i18n.language === 'vi' ? guide.titleVi : guide.title}
                              </Title>
                              <div className="text-xl md:text-2xl ml-2 flex-shrink-0">
                                {guide.icon}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Tag color={guide.color} icon={<EnvironmentOutlined />} className="text-xs md:text-sm">
                                {i18n.language === 'vi' ? guide.regionVi : guide.region}
                              </Tag>
                              <Tag color="green" icon={<CalendarOutlined />} className="text-xs md:text-sm">
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
                                  {t('common:actions.explore')}
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
                      opacity: [0, 0.6, 0]
                    }}
                    transition={{
                      duration: Math.random() * 8 + 6,
                      repeat: Infinity,
                      delay: Math.random() * 5,
                      ease: "easeInOut"
                    }}
                    style={{
                      left: Math.random() * 100 + '%',
                      top: Math.random() * 100 + '%'
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <Title level={3} className="dark:text-white mb-4 text-xl md:text-2xl">
                  More Amazing Destinations Coming Soon
                </Title>
                <Paragraph className="text-base md:text-lg dark:text-gray-300 mb-6">
                  We're constantly expanding our collection of travel guides to help you explore more of Vietnam's incredible destinations. 
                  Stay tuned for comprehensive guides to Hue, Hoi An, Sapa, Phu Quoc, and many more breathtaking locations!
                </Paragraph>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {[
                    { name: 'Hue', color: 'purple' },
                    { name: 'Hoi An', color: 'orange' },
                    { name: 'Sapa', color: 'green' },
                    { name: 'Phu Quoc', color: 'blue' },
                    { name: 'Dalat', color: 'pink' },
                    { name: 'Can Tho', color: 'cyan' },
                    { name: 'Ha Long Bay', color: 'emerald' },
                    { name: 'Mui Ne', color: 'amber' }
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