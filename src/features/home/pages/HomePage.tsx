import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Rate, message, Card, Tag } from 'antd';
import { ArrowRightOutlined, FireOutlined, GiftOutlined, StarFilled, ShoppingOutlined, CompassOutlined, EyeOutlined, HeartOutlined, EnvironmentOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFeaturedProducts, fetchLatestProducts } from '@/store/slices/productSlice';
import ProductCarousel from '@/features/products/components/ProductCarousel';
import ProductsGrid from '@/features/products/components/ProductsGrid';
import type { ProductResponse } from '@/types/product.types';
import { useCart } from '@/contexts/CartContext';
import type { UUID } from 'crypto';

const { Title, Text, Paragraph } = Typography;

// Enhanced Hero Section Component
const EnhancedHeroSection: React.FC = () => {
  const { i18n } = useTranslation(['common', 'product']);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);

  // Hero destinations with Áo dài collections
  const heroDestinations = [
    {
      id: 'hanoi',
      title: 'Hanoi Royal Collection',
      titleVi: 'Bộ Sưu Tập Hoàng Gia Hà Nội',
      subtitle: 'Imperial Heritage Áo Dài',
      subtitleVi: 'Áo Dài Di Sản Hoàng Gia',
      description: 'Inspired by the ancient capital\'s royal elegance, featuring golden silk and traditional patterns',
      descriptionVi: 'Lấy cảm hứng từ vẻ thanh lịch hoàng gia của kinh đô, với lụa vàng và họa tiết truyền thống',
      image: '/assets/destinations/hanoi/ho-chi-minh-mausoleum.jpg',
      productImage: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      url: '/destinations/hanoi',
      productUrl: '/products?region=hanoi',
      gradient: 'from-amber-600 via-yellow-600 to-orange-600',
      overlayGradient: 'from-amber-900/80 via-yellow-900/60 to-transparent',
      aoColor: 'Vàng Hoàng Gia',
      aoColorEn: 'Royal Gold',
      aoStyle: 'Imperial Traditional',
      aoPrice: '$349',
      icon: '🏛️',
      specialty: 'Cultural Heritage',
      rating: 4.8,
      views: '12.5K',
      region: 'Northern Vietnam',
      regionVi: 'Miền Bắc Việt Nam'
    },
    {
      id: 'hcm',
      title: 'Saigon Modern Elegance',
      titleVi: 'Thanh Lịch Hiện Đại Sài Gòn',
      subtitle: 'Contemporary Fusion Áo Dài',
      subtitleVi: 'Áo Dài Fusion Đương Đại',
      description: 'Bold and vibrant designs reflecting the dynamic spirit of Vietnam\'s economic hub',
      descriptionVi: 'Thiết kế táo bạo và sống động phản ánh tinh thần năng động của trung tâm kinh tế Việt Nam',
      image: '/assets/destinations/hcm/landmark-81.jpg',
      productImage: 'https://images.unsplash.com/photo-1624371711241-e15e6d554040?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      url: '/destinations/hcm',
      productUrl: '/products?region=hcm',
      gradient: 'from-red-600 via-orange-600 to-pink-600',
      overlayGradient: 'from-red-900/80 via-orange-900/60 to-transparent',
      aoColor: 'Đỏ Rực',
      aoColorEn: 'Vibrant Red',
      aoStyle: 'Urban Chic',
      aoPrice: '$329',
      icon: '🏙️',
      specialty: 'Modern Fusion',
      rating: 4.9,
      views: '18.2K',
      region: 'Southern Vietnam',
      regionVi: 'Miền Nam Việt Nam'
    },
    {
      id: 'danang',
      title: 'Central Coast Breeze',
      titleVi: 'Gió Biển Miền Trung',
      subtitle: 'Coastal Elegance Áo Dài',
      subtitleVi: 'Áo Dài Thanh Lịch Biển Cả',
      description: 'Light, flowing designs inspired by ocean waves and mountain landscapes',
      descriptionVi: 'Thiết kế nhẹ nhàng, bay bổng lấy cảm hứng từ sóng biển và cảnh quan núi non',
      image: '/assets/destinations/danang/danangcity.jpg',
      productImage: 'https://images.unsplash.com/photo-1557750255-c76072a7fdf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      url: '/destinations/danang',
      productUrl: '/products?region=danang',
      gradient: 'from-sky-600 via-blue-600 to-indigo-600',
      overlayGradient: 'from-sky-900/80 via-blue-900/60 to-transparent',
      aoColor: 'Xanh Dương',
      aoColorEn: 'Azure Blue',
      aoStyle: 'Coastal Breeze',
      aoPrice: '$289',
      icon: '🏖️',
      specialty: 'Beach Elegance',
      rating: 4.7,
      views: '15.8K',
      region: 'Central Vietnam',
      regionVi: 'Miền Trung Việt Nam'
    },
    {
      id: 'khanhhoa',
      title: 'Nha Trang Paradise',
      titleVi: 'Thiên Đường Nha Trang',
      subtitle: 'Tropical Resort Áo Dài',
      subtitleVi: 'Áo Dài Resort Nhiệt Đới',
      description: 'Luxurious resort-style designs with tropical motifs and ocean-inspired colors',
      descriptionVi: 'Thiết kế sang trọng phong cách resort với họa tiết nhiệt đới và màu sắc cảm hứng đại dương',
      image: '/assets/destinations/khanhhoa/biennhatrang.png',
      productImage: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      url: '/destinations/khanhhoa',
      productUrl: '/products?region=khanhhoa',
      gradient: 'from-cyan-600 via-blue-600 to-teal-700',
      overlayGradient: 'from-cyan-900/80 via-blue-900/60 to-transparent',
      aoColor: 'Xanh Biển',
      aoColorEn: 'Ocean Blue',
      aoStyle: 'Tropical Paradise',
      aoPrice: '$269',
      icon: '🌊',
      specialty: 'Resort Luxury',
      rating: 4.9,
      views: '16.3K',
      region: 'South Central Coast',
      regionVi: 'Duyên Hải Nam Trung Bộ'
    },
    {
      id: 'quangninh',
      title: 'Ha Long Mystique',
      titleVi: 'Huyền Bí Hạ Long',
      subtitle: 'Heritage Limestone Áo Dài',
      subtitleVi: 'Áo Dài Di Sản Núi Đá Vôi',
      description: 'Mysterious and elegant designs inspired by the UNESCO World Heritage limestone karsts',
      descriptionVi: 'Thiết kế huyền bí và thanh lịch lấy cảm hứng từ di sản thế giới núi đá vôi UNESCO',
      image: '/assets/destinations/quangninh/daotiptop.png',
      productImage: 'https://images.unsplash.com/photo-1621164078873-a944ea50a9a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      url: '/destinations/quangninh',
      productUrl: '/products?region=quangninh',
      gradient: 'from-slate-600 via-stone-600 to-slate-700',
      overlayGradient: 'from-slate-900/80 via-stone-900/60 to-transparent',
      aoColor: 'Xanh Thiên Thanh',
      aoColorEn: 'Sky Blue',
      aoStyle: 'Mystical Heritage',
      aoPrice: '$299',
      icon: '🗿',
      specialty: 'UNESCO Heritage',
      rating: 4.9,
      views: '14.7K',
      region: 'Northeast Vietnam',
      regionVi: 'Đông Bắc Việt Nam'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroDestinations.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isPlaying, heroDestinations.length]);

  const currentDestination = heroDestinations[currentSlide];

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Floating particles animation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FloatingParticles = ({ destination: _destination }: { destination: any }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i * 0.8) * 30, 0],
            rotate: [0, 360],
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 8,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut"
          }}
          style={{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%'
          }}
        >
          <div className="text-white/20 text-3xl">
            {['👘', '🌸', '⭐', '💎', '🎋', '🌙'][i % 6]}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[80vh] md:h-[90vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {/* Background Image with Ken Burns Effect */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${currentDestination.image})`,
              }}
              animate={{
                scale: [1, 1.15],
              }}
              transition={{ duration: 4, ease: "linear" }}
            />

            {/* Dynamic Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentDestination.overlayGradient}`} />
            
            {/* Floating Particles */}
            <FloatingParticles destination={currentDestination} />

            {/* Content Grid */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                  
                  {/* Left Column - Collection Info (8 columns) */}
                  <motion.div
                    className="lg:col-span-7"
                    initial={{ opacity: 0, x: -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    {/* Collection Badge */}
                    <motion.div
                      className="inline-flex items-center mb-6"
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 1, -1, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div className={`bg-gradient-to-r ${currentDestination.gradient} px-6 py-3 rounded-full flex items-center shadow-2xl backdrop-blur-sm border border-white/30`}>
                        <span className="text-2xl mr-3">{currentDestination.icon}</span>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm uppercase tracking-wider">New Collection</span>
                          <span className="text-xs opacity-90">{currentDestination.specialty}</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Main Title */}
                    <div className="mb-6">
                      <Title 
                        level={1} 
                        className="text-white mb-3 text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
                        style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.8)' }}
                      >
                        {i18n.language === 'vi' ? currentDestination.titleVi : currentDestination.title}
                      </Title>
                      
                      <Title 
                        level={3} 
                        className="text-gray-200 mb-0 text-lg md:text-xl font-medium opacity-90"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}
                      >
                        {i18n.language === 'vi' ? currentDestination.subtitleVi : currentDestination.subtitle}
                      </Title>
                    </div>

                    {/* Description */}
                    <Paragraph 
                      className="text-gray-200 text-base md:text-lg mb-8 leading-relaxed max-w-2xl"
                      style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}
                    >
                      {i18n.language === 'vi' ? currentDestination.descriptionVi : currentDestination.description}
                    </Paragraph>

                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-4 mb-8">
                      <div className="bg-white/15 backdrop-blur-md rounded-full px-4 py-2 flex items-center border border-white/25">
                        <StarFilled className="text-yellow-400 mr-2 text-lg" />
                        <span className="font-bold text-white">{currentDestination.rating}</span>
                        <span className="text-white/80 ml-1 text-sm">rating</span>
                      </div>
                      <div className="bg-white/15 backdrop-blur-md rounded-full px-4 py-2 flex items-center border border-white/25">
                        <EyeOutlined className="text-blue-400 mr-2 text-lg" />
                        <span className="font-bold text-white">{currentDestination.views}</span>
                        <span className="text-white/80 ml-1 text-sm">views</span>
                      </div>
                      <div className="bg-white/15 backdrop-blur-md rounded-full px-4 py-2 flex items-center border border-white/25">
                        <EnvironmentOutlined className="text-green-400 mr-2 text-lg" />
                        <span className="text-white text-sm">
                          {i18n.language === 'vi' ? currentDestination.regionVi : currentDestination.region}
                        </span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to={currentDestination.productUrl}>
                        <Button
                          type="primary"
                          size="large"
                          className={`bg-gradient-to-r ${currentDestination.gradient} border-none hover:shadow-2xl transition-all duration-500 h-14 px-10 text-lg font-semibold`}
                          icon={<ShoppingOutlined className="text-xl" />}
                        >
                          <span className="ml-2">Shop Collection</span>
                        </Button>
                      </Link>
                      
                      <Link to={currentDestination.url}>
                        <Button
                          size="large"
                          className="bg-white/15 border-white/25 text-white hover:bg-white/25 hover:border-white/35 backdrop-blur-md transition-all duration-500 h-14 px-10 text-lg font-semibold"
                          icon={<CompassOutlined className="text-xl" />}
                        >
                          <span className="ml-2">Explore Region</span>
                        </Button>
                      </Link>
                    </div>
                  </motion.div>

                  {/* Right Column - Áo Dài Product Showcase (4 columns) */}
                  <motion.div
                    className="lg:col-span-5"
                    initial={{ opacity: 0, x: 80, rotateY: 15 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                  >
                    <Card
                      className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden"
                      bodyStyle={{ padding: 0 }}
                    >
                      {/* Product Image */}
                      <div className="relative h-80 overflow-hidden">
                        <motion.img 
                          src={currentDestination.productImage}
                          alt={`Áo Dài ${currentDestination.title}`}
                          className="w-full h-full object-cover"
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Floating Fashion Elements */}
                        <div className="absolute inset-0">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute text-white/30 text-2xl"
                              animate={{
                                y: [0, -20, 0],
                                x: [0, Math.sin(i) * 10, 0],
                                rotate: [0, 360],
                                opacity: [0.2, 0.6, 0.2]
                              }}
                              transition={{
                                duration: Math.random() * 6 + 4,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "easeInOut"
                              }}
                              style={{
                                left: Math.random() * 80 + 10 + '%',
                                top: Math.random() * 80 + 10 + '%'
                              }}
                            >
                              {'✨'}
                            </motion.div>
                          ))}
                        </div>

                        {/* Price Tag */}
                        <div className="absolute top-4 right-4">
                          <motion.div 
                            className={`bg-gradient-to-r ${currentDestination.gradient} text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg`}
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            {currentDestination.aoPrice}
                          </motion.div>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-6">
                        <div className="text-center mb-6">
                          <Title level={4} className="text-white mb-2 text-xl">
                            Áo Mosaic Collection
                          </Title>
                          
                          <Text className="text-gray-300 block mb-4 text-lg">
                            {i18n.language === 'vi' ? currentDestination.aoColor : currentDestination.aoColorEn}
                          </Text>
                          
                          <div className="flex justify-center gap-2 mb-6">
                            <Tag 
                              color="processing" 
                              className="border-white/20 bg-blue-500/20 text-white px-3 py-1"
                            >
                              {currentDestination.aoStyle}
                            </Tag>
                            <Tag 
                              color="success" 
                              className="border-white/20 bg-green-500/20 text-white px-3 py-1"
                            >
                              Premium Silk
                            </Tag>
                            <Tag 
                              color="gold" 
                              className="border-white/20 bg-yellow-500/20 text-white px-3 py-1"
                            >
                              Handcrafted
                            </Tag>
                          </div>
                          
                          <div className="bg-white/5 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <Text className="text-white/80 text-sm block">Starting from</Text>
                                <Title level={2} className="text-white m-0 text-3xl">
                                  {currentDestination.aoPrice}
                                </Title>
                              </div>
                              <div className="text-right">
                                <Text className="text-white/80 text-sm block">Available</Text>
                                <Text className="text-green-400 font-bold text-lg">In Stock</Text>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Link to={currentDestination.productUrl} className="flex-1">
                            <Button
                              type="primary"
                              block
                              size="large"
                              className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/40 backdrop-blur-sm h-12 font-semibold"
                              icon={<ShoppingOutlined />}
                            >
                              Shop Now
                            </Button>
                          </Link>
                          <Button
                            size="large"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm px-4"
                            icon={<HeartOutlined />}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center gap-6 bg-black/25 backdrop-blur-xl rounded-full px-8 py-4 border border-white/20 shadow-2xl">
            {/* Play/Pause Button */}
            <Button
              type="text"
              size="large"
              className="text-white hover:text-white/80 hover:bg-white/10 rounded-full p-3"
              icon={<PlayCircleOutlined className={`text-2xl ${isPlaying ? 'opacity-100' : 'opacity-50'}`} />}
              onClick={togglePlayPause}
            />

            {/* Dots Navigation */}
            <div className="flex gap-3">
              {heroDestinations.map((_, index) => (
                <motion.button
                  key={index}
                  className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                    currentSlide === index
                      ? 'w-12 h-4 bg-white shadow-lg'
                      : 'w-4 h-4 bg-white/40 hover:bg-white/60'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {currentSlide === index && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 4,
                        ease: "linear",
                        repeat: Infinity
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Slide Info */}
            <div className="text-white/90 text-sm font-medium flex items-center gap-2">
              <span>{currentSlide + 1}</span>
              <span className="w-4 h-px bg-white/40"></span>
              <span>{heroDestinations.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
            animate={{
              width: isPlaying ? ['0%', '100%'] : '0%'
            }}
            transition={{
              duration: 4,
              ease: "linear",
              repeat: Infinity
            }}
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 z-10">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-20 h-20 border-2 border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <span className="text-white/60 text-2xl">✨</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Categories data (keeping existing)
const categories = [
  {
    id: 'womens',
    image: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlldG5hbWVzZSUyMGFvJTIwZGFpfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    count: 152,
    url: '/products?category=womens'
  },
  {
    id: 'mens',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmlldG5hbWVzZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    count: 98,
    url: '/products?category=mens'
  },
  {
    id: 'accessories',
    image: 'https://images.unsplash.com/photo-1621164078873-a944ea50a9a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dmlldG5hbWVzZSUyMGFjY2Vzc29yaWVzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    count: 64,
    url: '/products?category=accessories'
  },
  {
    id: 'home',
    image: 'https://images.unsplash.com/photo-1616486395688-b8d1438bd3bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHZpZXRuYW1lc2UlMjBkZWNvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    count: 47,
    url: '/products?category=home'
  }
];

// Region sections (keeping existing)
const regions = [
  {
    id: 'north',
    image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNhcGElMjB2aWV0bmFtfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    url: '/regions/north'
  },
  {
    id: 'central',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aHVlJTIwdmlldG5hbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    url: '/regions/central'
  },
  {
    id: 'south',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVrb25nJTIwZGVsdGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    url: '/regions/south'
  }
];

// Testimonials (keeping existing)
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, USA',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Toronto, Canada',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4
  },
  {
    id: 3,
    name: 'Emma Nguyen',
    location: 'Sydney, Australia',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    rating: 5
  }
];

// Animation variants (keeping existing)
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Category Card Component (keeping existing)
interface CategoryCardProps {
  category: {
    id: string;
    image: string;
    count: number;
    url: string;
  };
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { t } = useTranslation(['common']);
  
  return (
    <motion.div variants={fadeInUp}>
      <Link to={category.url}>
        <div className="relative overflow-hidden rounded-lg group cursor-pointer">
          <div className="h-64 overflow-hidden">
            <img 
              src={category.image} 
              alt={t(`common:categories.${category.id}.name`)} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80"></div>
          <div className="absolute bottom-0 left-0 p-5 text-white">
            <h3 className="text-xl font-bold mb-1">{t(`common:categories.${category.id}.name`)}</h3>
            <p className="text-sm text-gray-200">{category.count} {t('common:categories.items')}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Testimonial Card Component (keeping existing)
interface TestimonialCardProps {
  testimonial: {
    id: number;
    name: string;
    location: string;
    avatar: string;
    rating: number;
  };
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const { t } = useTranslation(['common']);
  
  return (
    <motion.div variants={fadeInUp}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full">
        <div className="flex items-center mb-4">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white">{testimonial.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.location}</p>
          </div>
        </div>
        <Rate disabled defaultValue={testimonial.rating} className="mb-3" />
        <p className="text-gray-700 dark:text-gray-300 italic">
          {t(`common:testimonials.${testimonial.id}.text`)}
        </p>
      </div>
    </motion.div>
  );
};

const HomePage: React.FC = () => {
  const { t } = useTranslation(['common', 'product']);
  const dispatch = useAppDispatch();
  const { 
    latestProducts, 
    featuredProducts, 
    loading 
  } = useAppSelector(state => state.products);
  
  useEffect(() => {
    // Fetch latest products (6 products)
    dispatch(fetchLatestProducts({ size: 6 }));
    
    // Fetch featured products (6 products)
    dispatch(fetchFeaturedProducts({ size: 6 }));
  }, [dispatch]);
  
  // Handle add to cart
  const { addToCart } = useCart();

  const handleAddToCart = async (product: ProductResponse) => {
    try {
      await addToCart({
        productId: product.id as UUID,
        quantity: 1,
      }, product);
      // The notification will be shown by the CartNotification component
    } catch (error) {
      console.error('Failed to add to cart:', error);
      message.error(t('cart:notifications.error_adding'));
    }
  };
  
  // Handle add to wishlist
  const handleAddToWishlist = (product: ProductResponse) => {
    // Will implement actual wishlist functionality later
    message.success(`${product.name} added to wishlist!`);
  };
  
  return (
    <MainLayout>
      {/* Enhanced Hero Section */}
      <EnhancedHeroSection />

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{t('common:features.craftsmanship.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('common:features.craftsmanship.description')}</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v1h-2V8a1 1 0 00-1-1H6a1 1 0 00-1 1v7h1.05a2.5 2.5 0 014.9 0H15V8a1 1 0 00-1-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{t('common:features.shipping.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('common:features.shipping.description')}</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{t('common:features.returns.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('common:features.returns.description')}</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{t('common:features.sustainable.title')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('common:features.sustainable.description')}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2} className="mb-2 dark:text-white">{t('common:nav.new_arrivals')}</Title>
              <Text className="text-gray-600 dark:text-gray-400">
                {t('common:sections.featured_products.subtitle')}
              </Text>
            </div>
            <Link to="/products?sort=createdAt,desc">
              <Button type="link" className="font-semibold">
                {t('common:actions.view_all')} <ArrowRightOutlined />
              </Button>
            </Link>
          </div>
          
          <ProductCarousel 
            products={latestProducts} 
            loading={loading}
            autoplay={true}
            slidesToShow={4}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="mb-2 dark:text-white">{t('common:sections.categories.title')}</Title>
            <Text className="text-gray-600 dark:text-gray-400">{t('common:sections.categories.subtitle')}</Text>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {categories.map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2} className="mb-2 dark:text-white">{t('common:sections.featured_products.title')}</Title>
              <Text className="text-gray-600 dark:text-gray-400">{t('common:sections.featured_products.subtitle')}</Text>
            </div>
            <Link to="/products?featured=true">
              <Button type="link" className="font-semibold">
                {t('common:actions.view_all')} <ArrowRightOutlined />
              </Button>
            </Link>
          </div>
          
          <ProductsGrid 
            products={featuredProducts} 
            loading={loading}
            cols={4}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </div>
      </section>

      {/* Special Offer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-xl bg-primary text-white">
            <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1590548784585-643d2b9f2925?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlldG5hbWVzZSUyMGFvJTIwZGFpfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60" 
                alt={t('common:special_offer.image_alt')} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 md:p-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-4">
                    <FireOutlined className="text-2xl mr-3" />
                    <span className="text-xl font-bold">{t('common:special_offer.label')}</span>
                  </div>
                  <Title level={2} className="text-white text-3xl md:text-4xl mb-4">
                    {t('common:special_offer.title')}
                  </Title>
                  <Paragraph className="text-gray-100 mb-8 text-lg">
                    {t('common:special_offer.description')}
                  </Paragraph>
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <span className="text-2xl font-bold">00</span>
                        <p className="text-xs">{t('common:special_offer.countdown.days')}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <span className="text-2xl font-bold">12</span>
                        <p className="text-xs">{t('common:special_offer.countdown.hours')}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <span className="text-2xl font-bold">45</span>
                        <p className="text-xs">{t('common:special_offer.countdown.mins')}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <span className="text-2xl font-bold">30</span>
                        <p className="text-xs">{t('common:special_offer.countdown.secs')}</p>
                      </div>
                    </div>
                  </div>
                  <Link to="/products?category=aodai">
                    <Button size="large" className="bg-white text-primary hover:bg-gray-100 border-white">
                      {t('common:special_offer.button')} <ArrowRightOutlined />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Collections */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="mb-2 dark:text-white">{t('common:sections.regions.title')}</Title>
            <Text className="text-gray-600 dark:text-gray-400">{t('common:sections.regions.subtitle')}</Text>
          </div>

          {regions.map((region, index) => (
            <motion.div 
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 mb-12 last:mb-0`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="lg:w-1/2">
                <div className="overflow-hidden rounded-lg h-full">
                  <img 
                    src={region.image} 
                    alt={t(`common:regions.${region.id}.name`)} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="lg:w-1/2 flex flex-col justify-center">
                <Title level={3} className="mb-3 dark:text-white">{t(`common:regions.${region.id}.name`)}</Title>
                <Paragraph className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  {t(`common:regions.${region.id}.description`)}
                </Paragraph>
                <Link to={region.url}>
                  <Button type="primary" size="large" className="max-w-max">
                    {t('common:actions.explore_collection')} <ArrowRightOutlined />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Title level={2} className="mb-2 dark:text-white">{t('common:sections.testimonials.title')}</Title>
            <Text className="text-gray-600 dark:text-gray-400">{t('common:sections.testimonials.subtitle')}</Text>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {testimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <GiftOutlined className="text-4xl mb-4" />
            <Title level={2} className="text-white mb-3">{t('common:newsletter.title')}</Title>
            <Paragraph className="text-gray-100 mb-8 text-lg">
              {t('common:newsletter.description')}
            </Paragraph>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder={t('common:newsletter.placeholder')} 
                className="flex-grow py-3 px-4 rounded-lg text-gray-800 focus:outline-none"
              />
              <Button size="large" className="bg-white text-primary hover:bg-gray-100 border-white">
                {t('common:newsletter.button')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;