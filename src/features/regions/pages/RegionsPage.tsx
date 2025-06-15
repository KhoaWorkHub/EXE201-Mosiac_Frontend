import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Card, Typography, Row, Col, Tag, Button } from 'antd';
import { 
  EnvironmentOutlined, 
  EyeOutlined, 
  ArrowRightOutlined,
  ThunderboltOutlined,
  StarOutlined,
  CrownOutlined,
  FireOutlined,
  CompassOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;

const RegionsPage: React.FC = () => {
  const { i18n } = useTranslation(['common']);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const regionsRef = useRef<HTMLDivElement>(null);
  
  // Fixed useInView usage
  const mapInView = useInView(mapRef, { amount: 0.1 });
  const regionsInView = useInView(regionsRef, { amount: 0.1 });

  // Enhanced parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (mapRef.current) {
        const scrollPosition = window.scrollY;
        const rect = mapRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          mapRef.current.style.transform = `translateY(${scrollPosition * 0.1}px) scale(${1 + scrollPosition * 0.0001})`;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Vietnam regions data
  const regions = [
    {
      id: 'north',
      name: 'Northern Vietnam',
      nameVi: 'Miền Bắc',
      description: 'Mountains, heritage, and cultural heart of Vietnam',
      descriptionVi: 'Núi non, di sản và trái tim văn hóa của Việt Nam',
      destinations: [
        { 
          name: 'Hanoi', 
          nameVi: 'Hà Nội', 
          url: '/destinations/hanoi',
          status: 'available',
          highlight: 'Capital Heritage'
        },
        { 
          name: 'Quang Ninh', 
          nameVi: 'Quảng Ninh', 
          url: '/destinations/quangninh',
          status: 'available',
          highlight: 'UNESCO Wonder'
        },
        { 
          name: 'Sapa', 
          nameVi: 'Sa Pa', 
          url: '/destinations/sapa',
          status: 'coming_soon',
          highlight: 'Mountain Paradise'
        }
      ],
      color: 'from-green-500 to-emerald-600',
      icon: '🏔️',
      stats: { destinations: 3, attractions: 25, heritage: 5 }
    },
    {
      id: 'central',
      name: 'Central Vietnam', 
      nameVi: 'Miền Trung',
      description: 'Ancient cities, imperial history, and pristine beaches',
      descriptionVi: 'Cố đô, lịch sử hoàng gia và bãi biển hoang sơ',
      destinations: [
        { 
          name: 'Da Nang', 
          nameVi: 'Đà Nẵng', 
          url: '/destinations/danang',
          status: 'available',
          highlight: 'Modern Coastal'
        },
        { 
          name: 'Hue', 
          nameVi: 'Huế', 
          url: '/destinations/hue',
          status: 'coming_soon',
          highlight: 'Imperial City'
        },
        { 
          name: 'Hoi An', 
          nameVi: 'Hội An', 
          url: '/destinations/hoian',
          status: 'coming_soon',
          highlight: 'Ancient Town'
        }
      ],
      color: 'from-blue-500 to-cyan-600',
      icon: '🏛️',
      stats: { destinations: 3, attractions: 30, heritage: 8 }
    },
    {
      id: 'south',
      name: 'Southern Vietnam',
      nameVi: 'Miền Nam', 
      description: 'Dynamic cities, tropical beaches, and vibrant culture',
      descriptionVi: 'Thành phố năng động, biển nhiệt đới và văn hóa sôi động',
      destinations: [
        { 
          name: 'Ho Chi Minh City', 
          nameVi: 'TP. Hồ Chí Minh', 
          url: '/destinations/hcm',
          status: 'available',
          highlight: 'Economic Hub'
        },
        { 
          name: 'Khanh Hoa', 
          nameVi: 'Khánh Hòa', 
          url: '/destinations/khanhhoa',
          status: 'available',
          highlight: 'Coastal Paradise'
        },
        { 
          name: 'Phu Quoc', 
          nameVi: 'Phú Quốc', 
          url: '/destinations/phuquoc',
          status: 'coming_soon',
          highlight: 'Pearl Island'
        }
      ],
      color: 'from-orange-500 to-red-600',
      icon: '🏙️',
      stats: { destinations: 3, attractions: 35, heritage: 4 }
    }
  ];

  // Interactive map SVG paths for Vietnam regions
  const regionPaths = {
    north: "M150,50 L250,50 L300,120 L280,180 L200,200 L120,180 L100,120 Z",
    central: "M120,180 L280,180 L300,220 L280,300 L200,320 L120,300 L100,220 Z", 
    south: "M120,300 L280,300 L300,350 L250,420 L150,420 L100,350 Z"
  };

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
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const mapVariants = {
    hidden: { scale: 0.8, opacity: 0, rotateY: -15 },
    visible: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  };

  const getRegionData = (regionId: string) => {
    return regions.find(r => r.id === regionId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'coming_soon': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available Now';
      case 'coming_soon': return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 dark:from-blue-900/20 dark:via-green-900/20 dark:to-orange-900/20">
        {/* Dynamic background elements */}
        <div className="absolute inset-0">
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: ['#10b981', '#3b82f6', '#f59e0b'][i % 3],
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Title level={1} className="mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-orange-600 bg-clip-text text-transparent text-5xl md:text-7xl font-bold">
              Explore Vietnam
            </Title>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Paragraph className="text-xl md:text-2xl dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
                Discover the three magnificent regions of Vietnam, each offering unique experiences, 
                rich culture, and breathtaking landscapes waiting to be explored.
              </Paragraph>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Tag color="green" className="px-4 py-2 text-lg font-medium rounded-full">
                  <CompassOutlined className="mr-2" />
                  3 Regions
                </Tag>
                <Tag color="blue" className="px-4 py-2 text-lg font-medium rounded-full">
                  <StarOutlined className="mr-2" />
                  5 Destinations
                </Tag>
                <Tag color="orange" className="px-4 py-2 text-lg font-medium rounded-full">
                  <CrownOutlined className="mr-2" />
                  90+ Attractions
                </Tag>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated compass */}
        <motion.div
          className="absolute bottom-20 right-20 hidden lg:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 via-blue-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
            <CompassOutlined className="text-3xl text-white" />
          </div>
        </motion.div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 bg-white dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-blue-50/30 to-orange-50/30 dark:from-green-900/10 dark:via-blue-900/10 dark:to-orange-900/10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={mapInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <Title level={2} className="mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-orange-600 bg-clip-text text-transparent">
                Interactive Vietnam Map
              </Title>
              <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
                Click on any region to explore its destinations and discover what makes each area unique
              </Paragraph>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Interactive SVG Map */}
              <motion.div
                ref={mapRef}
                variants={mapVariants}
                className="relative"
              >
                <div className="relative w-full max-w-md mx-auto">
                  <svg
                    viewBox="0 0 400 470"
                    className="w-full h-auto drop-shadow-2xl"
                    style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.15))' }}
                  >
                    {/* Map background */}
                    <defs>
                      <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f0fdf4" />
                        <stop offset="50%" stopColor="#eff6ff" />
                        <stop offset="100%" stopColor="#fef7f0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Region paths */}
                    {Object.entries(regionPaths).map(([regionId, path]) => {
                      const isSelected = selectedRegion === regionId;
                      const isHovered = hoveredRegion === regionId;
                      
                      return (
                        <motion.path
                          key={regionId}
                          d={path}
                          fill={isSelected || isHovered ? 
                            `url(#${regionId}Gradient)` : 
                            'rgba(156, 163, 175, 0.3)'
                          }
                          stroke={isSelected || isHovered ? 
                            ['#10b981', '#3b82f6', '#f59e0b'][regions.findIndex(r => r.id === regionId)] : 
                            '#9ca3af'
                          }
                          strokeWidth={isSelected || isHovered ? 3 : 2}
                          className="cursor-pointer transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedRegion(regionId)}
                          onMouseEnter={() => setHoveredRegion(regionId)}
                          onMouseLeave={() => setHoveredRegion(null)}
                          animate={{
                            fill: isSelected || isHovered ? 
                              undefined : 
                              ['rgba(16, 185, 129, 0.2)', 'rgba(59, 130, 246, 0.2)', 'rgba(245, 158, 11, 0.2)'][regions.findIndex(r => r.id === regionId)]
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      );
                    })}

                    {/* Gradients for regions */}
                    <defs>
                      <linearGradient id="northGradient">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.6" />
                      </linearGradient>
                      <linearGradient id="centralGradient">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.6" />
                      </linearGradient>
                      <linearGradient id="southGradient">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>

                    {/* Region labels */}
                    {regions.map((region, index) => {
                      const positions = [
                        { x: 200, y: 100 }, // North
                        { x: 200, y: 240 }, // Central  
                        { x: 200, y: 360 }  // South
                      ];
                      
                      return (
                        <motion.g key={region.id}>
                          <motion.text
                            x={positions[index].x}
                            y={positions[index].y}
                            textAnchor="middle"
                            className="fill-current text-gray-700 dark:text-gray-300 font-bold text-lg"
                            whileHover={{ scale: 1.1 }}
                          >
                            {region.icon}
                          </motion.text>
                          <motion.text
                            x={positions[index].x}
                            y={positions[index].y + 25}
                            textAnchor="middle"
                            className="fill-current text-gray-600 dark:text-gray-400 text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                          >
                            {i18n.language === 'vi' ? region.nameVi : region.name}
                          </motion.text>
                        </motion.g>
                      );
                    })}
                  </svg>

                  {/* Floating particles around map */}
                  {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: ['#10b981', '#3b82f6', '#f59e0b'][i % 3],
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%'
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1.5, 0.5]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Region Details */}
              <motion.div variants={itemVariants} className="space-y-6">
                <AnimatePresence mode="wait">
                  {selectedRegion ? (
                    <motion.div
                      key={selectedRegion}
                      initial={{ opacity: 0, x: 50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -50, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    >
                      {(() => {
                        const region = getRegionData(selectedRegion);
                        if (!region) return null;
                        
                        return (
                          <Card className={`bg-gradient-to-br ${region.color.replace('to-', 'to-')}/10 border-2 border-current shadow-xl`}>
                            <div className="space-y-6">
                              <div className="flex items-center space-x-4">
                                <motion.div
                                  className={`w-16 h-16 bg-gradient-to-br ${region.color} rounded-full flex items-center justify-center text-3xl shadow-lg`}
                                  whileHover={{ scale: 1.1, rotate: 10 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {region.icon}
                                </motion.div>
                                <div>
                                  <Title level={3} className="mb-1">
                                    {i18n.language === 'vi' ? region.nameVi : region.name}
                                  </Title>
                                  <Text className="text-gray-600 dark:text-gray-400">
                                    {i18n.language === 'vi' ? region.descriptionVi : region.description}
                                  </Text>
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="grid grid-cols-3 gap-4">
                                {Object.entries(region.stats).map(([key, value]) => (
                                  <div key={key} className="text-center">
                                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                      {value}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                      {key.replace('_', ' ')}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Destinations */}
                              <div className="space-y-3">
                                <Title level={5} className="mb-3 flex items-center">
                                  <EnvironmentOutlined className="mr-2" />
                                  Destinations
                                </Title>
                                {region.destinations.map((dest, idx) => (
                                  <motion.div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-300"
                                    whileHover={{ x: 5, scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="text-lg">
                                        {dest.status === 'available' ? '🌟' : '🚧'}
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          {i18n.language === 'vi' ? dest.nameVi : dest.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                          {dest.highlight}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Tag color={getStatusColor(dest.status)} className="text-xs">
                                        {getStatusText(dest.status)}
                                      </Tag>
                                      {dest.status === 'available' && (
                                        <Link to={dest.url}>
                                          <Button
                                            type="primary"
                                            size="small"
                                            icon={<ArrowRightOutlined />}
                                            className="bg-gradient-to-r from-blue-500 to-cyan-500 border-none hover:shadow-lg"
                                          />
                                        </Link>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </Card>
                        );
                      })()}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl"
                    >
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        🗺️
                      </motion.div>
                      <Title level={4} className="mb-2">Select a Region</Title>
                      <Paragraph className="dark:text-gray-300">
                        Click on any region on the map to explore its destinations and learn more about what makes it special.
                      </Paragraph>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Regions Overview Cards */}
      <section 
        ref={regionsRef}
        className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={regionsInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <Title level={2} className="mb-4 bg-gradient-to-r from-green-600 via-blue-600 to-orange-600 bg-clip-text text-transparent">
                Discover All Regions
              </Title>
              <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
                Each region of Vietnam offers a unique tapestry of experiences, from ancient heritage to modern marvels
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {regions.map((region, index) => (
                <Col xs={24} lg={8} key={region.id}>
                  <motion.div
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      className="h-full hover:shadow-2xl transition-all duration-500 relative overflow-hidden cursor-pointer"
                      onClick={() => setSelectedRegion(region.id)}
                    >
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${region.color} opacity-5`} />
                      
                      <div className="relative z-10 text-center">
                        <motion.div
                          className={`w-20 h-20 bg-gradient-to-br ${region.color} rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          {region.icon}
                        </motion.div>
                        
                        <Title level={3} className="mb-3">
                          {i18n.language === 'vi' ? region.nameVi : region.name}
                        </Title>
                        
                        <Paragraph className="dark:text-gray-300 mb-4 leading-relaxed">
                          {i18n.language === 'vi' ? region.descriptionVi : region.description}
                        </Paragraph>

                        {/* Quick stats */}
                        <div className="grid grid-cols-3 gap-2 mb-6">
                          {Object.entries(region.stats).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-xl font-bold text-gray-800 dark:text-white">
                                {value}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {key}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Available destinations count */}
                        <div className="flex justify-center space-x-2 mb-4">
                          <Tag color="success" className="text-sm">
                            <EyeOutlined className="mr-1" />
                            {region.destinations.filter(d => d.status === 'available').length} Available
                          </Tag>
                          <Tag color="warning" className="text-sm">
                            <ThunderboltOutlined className="mr-1" />
                            {region.destinations.filter(d => d.status === 'coming_soon').length} Coming Soon
                          </Tag>
                        </div>

                        <Button
                          type="primary"
                          className={`bg-gradient-to-r ${region.color} border-none hover:shadow-lg`}
                          icon={<ArrowRightOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRegion(region.id);
                            // Scroll to map section
                            mapRef.current?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          Explore Region
                        </Button>
                      </div>

                      {/* Floating decorative elements */}
                      <motion.div
                        className="absolute top-4 right-4 text-2xl opacity-20"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        {region.icon}
                      </motion.div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-500 via-blue-500 to-orange-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated background patterns */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10 text-4xl"
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 30, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
              style={{
                left: `${3 + i * 3.2}%`,
                top: `${10 + Math.sin(i) * 80}%`
              }}
            >
              {['🏔️', '🏛️', '🏙️', '🌟', '🗺️', '✨'][i % 6]}
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-white mb-6">
              Ready to Start Your Vietnam Adventure?
            </Title>
            <Paragraph className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              From the mountainous north to the vibrant south, Vietnam awaits your discovery. 
              Choose your region and begin an unforgettable journey.
            </Paragraph>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="large"
                  className="bg-white text-blue-600 h-12 font-bold hover:bg-gray-100 border-none shadow-lg"
                  icon={<CompassOutlined />}
                >
                  Start Exploring
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/blog">
                  <Button
                    size="large"
                    className="bg-transparent text-white border-white h-12 font-bold hover:bg-white hover:text-blue-600 shadow-lg"
                    icon={<FireOutlined />}
                  >
                    View All Guides
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default RegionsPage;