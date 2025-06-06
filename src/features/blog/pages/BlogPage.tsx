import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Typography, Divider, Space, Tag } from 'antd';
import { 
  CompassOutlined, 
  CalendarOutlined, 
  EnvironmentOutlined,
  FireOutlined,
  StarFilled,
  ThunderboltOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Text, Paragraph } = Typography;

// Updated list of available tour guides with HCM
const tourGuides = [
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
    featured: true,
    rating: 4.9,
    icon: <FireOutlined />
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
    icon: <CompassOutlined />
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
    icon: <StarFilled />
  },
];

const BlogPage: React.FC = () => {
  const { t, i18n } = useTranslation(['destinationdanang', 'destinationhanoi', 'destinationhcm', 'common']);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const featuredVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  // Get the featured destination (HCM)
  const featuredDestination = tourGuides.find(guide => guide.featured);
  const otherDestinations = tourGuides.filter(guide => !guide.featured);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title level={1} className="dark:text-white mb-4">
            {t('common:nav.blog')}
          </Title>
          <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
            Explore our comprehensive travel guides and discover the beauty of Vietnam's most captivating destinations
          </Paragraph>
        </motion.div>
        
        <Divider className="mb-12" />

        {/* Featured Destination - HCM */}
        {featuredDestination && (
          <motion.div
            variants={featuredVariants}
            initial="hidden"
            animate="visible"
            className="mb-16"
          >
            <div className="flex items-center mb-6">
              <ThunderboltOutlined className="text-orange-500 text-2xl mr-3" />
              <Title level={2} className="dark:text-white m-0">
                Featured Destination
              </Title>
              <Tag color="volcano" className="ml-3 px-3 py-1">
                NEW
              </Tag>
            </div>
            
            <Link to={featuredDestination.url}>
              <Card 
                hoverable 
                className="overflow-hidden shadow-2xl border-4 border-orange-200 dark:border-orange-700 relative"
                cover={
                  <div className="h-96 overflow-hidden relative">
                    <img 
                      src={featuredDestination.image} 
                      alt={i18n.language === 'vi' ? featuredDestination.titleVi : featuredDestination.title} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Featured badge */}
                    <div className="absolute top-6 left-6">
                      <div className={`bg-gradient-to-r ${featuredDestination.gradient} text-white px-4 py-2 rounded-full flex items-center font-bold shadow-lg`}>
                        {featuredDestination.icon}
                        <span className="ml-2">Featured</span>
                      </div>
                    </div>

                    {/* Rating badge */}
                    <div className="absolute top-6 right-6">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center">
                        <StarFilled className="text-yellow-500 mr-1" />
                        <span className="font-bold text-gray-800">{featuredDestination.rating}</span>
                      </div>
                    </div>

                    {/* Content overlay */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <Title level={2} className="text-white mb-2">
                        {i18n.language === 'vi' ? featuredDestination.titleVi : featuredDestination.title}
                      </Title>
                      <Paragraph className="text-gray-200 text-lg mb-4">
                        {t(featuredDestination.description)}
                      </Paragraph>
                      <div className="flex flex-wrap gap-3">
                        <Tag color={featuredDestination.color} icon={<EnvironmentOutlined />} className="text-base px-3 py-1">
                          {i18n.language === 'vi' ? featuredDestination.regionVi : featuredDestination.region}
                        </Tag>
                        <Tag color="green" icon={<CalendarOutlined />} className="text-base px-3 py-1">
                          {new Date(featuredDestination.date).toLocaleDateString()}
                        </Tag>
                      </div>
                    </div>
                  </div>
                }
              />
            </Link>
          </motion.div>
        )}

        {/* Other Destinations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center mb-8">
            <CompassOutlined className="text-primary text-2xl mr-3" />
            <Title level={2} className="dark:text-white m-0">
              More Destinations
            </Title>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherDestinations.map((guide) => (
              <motion.div key={guide.id} variants={itemVariants}>
                <Link to={guide.url}>
                  <Card 
                    hoverable 
                    cover={
                      <div className="h-64 overflow-hidden relative">
                        <img 
                          src={guide.image} 
                          alt={i18n.language === 'vi' ? guide.titleVi : guide.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Rating */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                            <StarFilled className="text-yellow-500 mr-1 text-sm" />
                            <span className="font-bold text-gray-800 text-sm">{guide.rating}</span>
                          </div>
                        </div>
                      </div>
                    }
                    className="h-full shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <Title level={3} className="mb-2 dark:text-white">
                      {i18n.language === 'vi' ? guide.titleVi : guide.title}
                    </Title>
                    
                    <Space className="mb-4">
                      <Tag color={guide.color} icon={<EnvironmentOutlined />}>
                        {i18n.language === 'vi' ? guide.regionVi : guide.region}
                      </Tag>
                      <Tag color="green" icon={<CalendarOutlined />}>
                        {new Date(guide.date).toLocaleDateString()}
                      </Tag>
                    </Space>
                    
                    <Paragraph className="dark:text-gray-300">
                      {t(guide.description)}
                    </Paragraph>
                    
                    <div className="flex items-center mt-4 text-primary">
                      {guide.icon}
                      <Text strong className="dark:text-primary ml-2">
                        {t('common:actions.explore')}
                      </Text>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Call to Action for more destinations */}
        <motion.div 
          className="text-center mt-16 p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Title level={3} className="dark:text-white mb-4">
            More Amazing Destinations Coming Soon
          </Title>
          <Paragraph className="text-lg dark:text-gray-300 mb-6">
            We're constantly expanding our collection of travel guides to help you explore more of Vietnam's incredible destinations. 
            Stay tuned for comprehensive guides to Hue, Hoi An, Sapa, Nha Trang, and many more breathtaking locations!
          </Paragraph>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'Hue', color: 'purple' },
              { name: 'Hoi An', color: 'orange' },
              { name: 'Sapa', color: 'green' },
              { name: 'Nha Trang', color: 'blue' },
              { name: 'Dalat', color: 'pink' },
              { name: 'Phu Quoc', color: 'cyan' },
              { name: 'Ha Long Bay', color: 'emerald' },
              { name: 'Can Tho', color: 'amber' }
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
                  className="px-3 py-1 text-sm font-medium cursor-pointer"
                >
                  {destination.name}
                </Tag>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default BlogPage;