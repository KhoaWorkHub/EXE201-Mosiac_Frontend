import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Card, Tooltip } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloseOutlined,
  PictureOutlined,
  CoffeeOutlined,
  ShopOutlined,
  CarOutlined,
  LeftOutlined,
  RightOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface QuangNinhTourGuideStepsProps {
  onClose: () => void;
}

const QuangNinhTourGuideSteps: React.FC<QuangNinhTourGuideStepsProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation(['destinationquangninh', 'common']);
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);

  // Save that the user has seen the tour guide
  useEffect(() => {
    localStorage.setItem('quangninhTourGuideShown', 'true');
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const steps = [
    {
      icon: <RocketOutlined />,
      title: t('tour_guide.steps.welcome.title'),
      gradient: 'from-slate-600 to-stone-600',
      bgEmoji: '🗿',
      content: (
        <div className="text-center py-6">
          <motion.div 
            className="w-36 h-36 rounded-full bg-gradient-to-r from-slate-600 to-stone-600 mx-auto mb-6 flex items-center justify-center relative overflow-hidden"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl"
            >
              🏔️
            </motion.div>
            
            {/* Floating limestone particles */}
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                animate={{
                  x: [0, Math.cos(i * 22.5 * Math.PI / 180) * 60],
                  y: [0, Math.sin(i * 22.5 * Math.PI / 180) * 60],
                  opacity: [0.7, 1, 0.7],
                  scale: [0.5, 1.5, 0.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Cave depth effect */}
            <motion.div
              className="absolute inset-0 border-4 border-white rounded-full"
              animate={{
                scale: [1, 2, 2.5],
                opacity: [0.8, 0.4, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.div>
          <Paragraph className="dark:text-gray-300 text-lg leading-relaxed">
            {t('tour_guide.steps.welcome.content')}
          </Paragraph>
        </div>
      ),
    },
    {
      icon: <PictureOutlined />,
      title: t('tour_guide.steps.attractions.title'),
      gradient: 'from-stone-600 to-slate-600',
      bgEmoji: '🏞️',
      content: (
        <div className="py-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <motion.div 
              className="relative overflow-hidden rounded-xl shadow-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full md:w-64 h-48 bg-gradient-to-br from-slate-500 to-stone-600 flex items-center justify-center text-white text-6xl relative overflow-hidden">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  🗿
                </motion.div>
                
                {/* Cave depth layers */}
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  animate={{
                    scale: [0, 3],
                    opacity: [0.5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <Title level={5} className="text-white m-0">
                  {t('tour_guide.steps.attractions.highlight')}
                </Title>
              </div>
            </motion.div>
            <div className="flex-1">
              <Title level={5} className="dark:text-white text-slate-700 mb-3">
                {t('tour_guide.steps.attractions.highlight')}
              </Title>
              <Paragraph className="dark:text-gray-300 leading-relaxed">
                {t('tour_guide.steps.attractions.content')}
              </Paragraph>
              
              {/* Mini attraction preview with limestone theme */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { name: 'Hạ Long Bay', emoji: '🏞️', color: 'from-slate-500 to-stone-500' },
                  { name: 'Sơn Trà Cave', emoji: '🕳️', color: 'from-stone-500 to-slate-500' },
                  { name: 'Titop Island', emoji: '🏝️', color: 'from-slate-600 to-stone-600' },
                  { name: 'Floating Villages', emoji: '🏘️', color: 'from-stone-600 to-slate-600' }
                ].map((attraction, i) => (
                  <motion.div
                    key={i}
                    className={`bg-gradient-to-r ${attraction.color} text-white p-3 rounded-lg text-center relative overflow-hidden`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ duration: 0.2 }}
                    animate={{ 
                      boxShadow: [
                        '0 4px 12px rgba(71, 85, 105, 0.2)',
                        '0 8px 20px rgba(120, 113, 108, 0.3)',
                        '0 4px 12px rgba(71, 85, 105, 0.2)'
                      ]
                    }}
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -3, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      className="text-2xl mb-1"
                    >
                      {attraction.emoji}
                    </motion.div>
                    <p className="text-xs font-medium">{attraction.name}</p>
                    
                    {/* Cave depth effect */}
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-1 bg-white/30"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.3
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <CoffeeOutlined />,
      title: t('tour_guide.steps.food.title'),
      gradient: 'from-slate-700 to-stone-700',
      bgEmoji: '🦐',
      content: (
        <div className="py-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { name: 'Chả Mực Hạ Long', emoji: '🦑', color: 'bg-gradient-to-br from-slate-500 to-stone-600' },
              { name: 'Sá Sùng', emoji: '🪱', color: 'bg-gradient-to-br from-stone-500 to-slate-600' },
              { name: 'Bánh Cuốn Hải Sản', emoji: '🍤', color: 'bg-gradient-to-br from-slate-600 to-stone-700' },
              { name: 'Cá Khoai Nướng', emoji: '🐟', color: 'bg-gradient-to-br from-stone-600 to-slate-700' }
            ].map((food, i) => (
              <motion.div 
                key={i}
                className="space-y-2"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <div className={`relative overflow-hidden rounded-lg shadow-lg ${food.color} h-28 flex items-center justify-center`}>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                    className="text-4xl"
                  >
                    {food.emoji}
                  </motion.div>
                  
                  {/* Stalactite effects */}
                  {Array.from({ length: 4 }).map((_, sparkleIndex) => (
                    <motion.div
                      key={sparkleIndex}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        x: [0, Math.random() * 40 - 20],
                        y: [0, Math.random() * 40 - 20]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                      style={{
                        left: '50%',
                        top: '50%'
                      }}
                    />
                  ))}
                </div>
                <p className="text-center font-medium dark:text-white text-sm">{food.name}</p>
              </motion.div>
            ))}
          </div>
          <Paragraph className="dark:text-gray-300 leading-relaxed">
            {t('tour_guide.steps.food.content')}
          </Paragraph>
        </div>
      ),
    },
    {
      icon: <ShopOutlined />,
      title: t('tour_guide.steps.shopping.title'),
      gradient: 'from-stone-700 to-slate-700',
      bgEmoji: '🛍️',
      content: (
        <div className="py-6">
          <Paragraph className="dark:text-gray-300 mb-6 leading-relaxed">
            {t('tour_guide.steps.shopping.content')}
          </Paragraph>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Hạ Long Night Market', icon: '🌙', color: 'border-slate-400 hover:bg-slate-50' },
              { name: 'Pearl Farms', icon: '🦪', color: 'border-stone-400 hover:bg-stone-50' },
              { name: 'Bãi Cháy Market', icon: '🏪', color: 'border-slate-500 hover:bg-slate-50' },
              { name: 'Coal Museum Shop', icon: '⛏️', color: 'border-stone-500 hover:bg-stone-50' },
              { name: 'Floating Markets', icon: '🛶', color: 'border-slate-600 hover:bg-slate-50' },
              { name: 'Cave Souvenirs', icon: '🗿', color: 'border-stone-600 hover:bg-stone-50' }
            ].map((place, i) => (
              <motion.div
                key={i}
                className={`border-2 ${place.color} rounded-lg p-3 text-center transition-all cursor-pointer relative overflow-hidden`}
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: '#475569',
                  y: -3
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <motion.div 
                  className="text-3xl mb-2"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                >
                  {place.icon}
                </motion.div>
                <p className="text-xs dark:text-gray-300 font-medium">{place.name}</p>
                
                {/* Floating cave echo effect */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <CarOutlined />,
      title: t('tour_guide.steps.transport.title'),
      gradient: 'from-slate-800 to-stone-800',
      bgEmoji: '🚗',
      content: (
        <div className="py-6">
          <Paragraph className="dark:text-gray-300 mb-6 leading-relaxed">
            {t('tour_guide.steps.transport.content')}
          </Paragraph>
          
          <div className="space-y-4">
            {[
              { name: 'Cruise Ships & Boats', icon: '🛥️', color: 'bg-gradient-to-r from-slate-600 to-stone-600', detail: 'Traditional junk boats for authentic experience' },
              { name: 'Tourist Buses', icon: '🚌', color: 'bg-gradient-to-r from-stone-600 to-slate-600', detail: 'Comfortable transport between attractions' },
              { name: 'Motorbikes & Scooters', icon: '🛵', color: 'bg-gradient-to-r from-slate-700 to-stone-700', detail: 'Explore coastal roads and hidden spots' },
              { name: 'Cable Cars', icon: '🚠', color: 'bg-gradient-to-r from-stone-700 to-slate-700', detail: 'Scenic aerial views of limestone karsts' }
            ].map((transport, i) => (
              <motion.div
                key={i}
                className="flex items-center p-4 bg-gradient-to-r from-slate-50 to-stone-50 dark:from-slate-800/20 dark:to-stone-800/20 rounded-lg relative overflow-hidden"
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <motion.div
                  className={`w-14 h-14 ${transport.color} rounded-full flex items-center justify-center text-white text-2xl mr-4 shadow-lg`}
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
                >
                  {transport.icon}
                </motion.div>
                <div className="flex-1">
                  <p className="font-medium dark:text-white text-slate-700">{transport.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {transport.detail}
                  </p>
                </div>
                
                {/* Cave echo animation */}
                <motion.div
                  className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-slate-200/30 to-transparent"
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    x: [20, 0, 20]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <HeartOutlined />,
      title: t('tour_guide.steps.conclusion.title'),
      gradient: 'from-stone-800 to-slate-900',
      bgEmoji: '🎉',
      content: (
        <div className="text-center py-6">
          <motion.div 
            className="w-36 h-36 rounded-full bg-gradient-to-r from-stone-600 to-slate-700 mx-auto mb-6 flex items-center justify-center relative overflow-hidden"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
              boxShadow: [
                '0 0 0 0 rgba(120, 113, 108, 0.4)',
                '0 0 0 30px rgba(120, 113, 108, 0)',
                '0 0 0 0 rgba(120, 113, 108, 0)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              🏆
            </motion.div>
            
            {/* Celebration limestone particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: ['#475569', '#78716c', '#64748b', '#a8a29e', '#71717a'][i % 5]
                }}
                animate={{
                  x: [0, Math.cos(i * 18 * Math.PI / 180) * 80],
                  y: [0, Math.sin(i * 18 * Math.PI / 180) * 80],
                  opacity: [1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: (i * 0.1) % 2,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
          <Title level={4} className="dark:text-white mb-4 bg-gradient-to-r from-stone-700 to-slate-800 bg-clip-text text-transparent">
            {t('tour_guide.steps.conclusion.content_title')}
          </Title>
          <Paragraph className="dark:text-gray-300 leading-relaxed text-lg">
            {t('tour_guide.steps.conclusion.content')}
          </Paragraph>
          
          {/* Fun stats with limestone theme */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { number: '1,600+', label: 'Limestone Karsts', icon: '🗿', color: 'from-slate-500 to-stone-600' },
              { number: '3', label: 'UNESCO Sites', icon: '🏛️', color: 'from-stone-500 to-slate-600' },
              { number: '∞', label: 'Cave Memories', icon: '🕳️', color: 'from-slate-600 to-stone-700' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className={`text-center p-4 bg-gradient-to-r ${stat.color} rounded-lg text-white relative overflow-hidden`}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <motion.div 
                  className="text-3xl mb-1"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >
                  {stat.icon}
                </motion.div>
                <div className="font-bold text-xl">{stat.number}</div>
                <div className="text-xs opacity-90">{stat.label}</div>
                
                {/* Cave shimmer effect */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  // Enhanced step navigator with limestone theme
  const renderEnhancedSteps = () => (
    <div className="flex justify-center items-center mb-8">
      <div className="flex bg-gradient-to-r from-slate-50 via-stone-50 to-slate-50 dark:from-slate-800/20 dark:via-stone-800/20 dark:to-slate-800/20 p-3 rounded-full border-2 border-slate-300 dark:border-slate-700 shadow-xl relative overflow-hidden">
        {/* Cave depth background animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-slate-300/30 to-stone-300/30"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {steps.map((step, index) => (
          <Tooltip key={index} title={step.title}>
            <motion.button
              onClick={() => setCurrentStep(index)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 mx-1 relative overflow-hidden z-10
                ${currentStep === index 
                  ? `bg-gradient-to-r ${step.gradient} text-white shadow-2xl transform scale-110` 
                  : 'text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/30'
                }`}
              whileHover={{ scale: currentStep === index ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={currentStep === index ? {
                boxShadow: [
                  '0 0 0 0 rgba(71, 85, 105, 0.4)',
                  '0 0 0 15px rgba(71, 85, 105, 0)',
                  '0 0 0 0 rgba(71, 85, 105, 0)'
                ]
              } : {}}
              transition={{ duration: 1.5, repeat: currentStep === index ? Infinity : 0 }}
            >
              <motion.div
                animate={currentStep === index ? {
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {step.icon}
              </motion.div>
              
              {/* Progress ring */}
              {currentStep === index && (
                <motion.div
                  className="absolute inset-0 border-2 border-white rounded-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              
              {/* Completion indicator */}
              {index < currentStep && (
                <motion.div
                  className="absolute inset-0 bg-emerald-600 rounded-full flex items-center justify-center text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          </Tooltip>
        ))}
      </div>
    </div>
  );

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 50 }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background limestone particles animation */}
          <div className="absolute inset-0">
            {Array.from({ length: 25 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-slate-400/30 rounded-full"
                animate={{
                  y: [window.innerHeight, -50],
                  x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                  opacity: [0, 0.7, 0],
                  scale: [0, 2, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: Math.random() * 8 + 4,
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
          
          <motion.div
            className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-4 border-slate-300 dark:border-slate-700 mx-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Enhanced close button */}
            <motion.button
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all shadow-lg z-10"
              onClick={handleClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <CloseOutlined />
            </motion.button>

            <div className="mb-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Title level={2} className="mb-3 dark:text-white bg-gradient-to-r from-slate-700 via-stone-700 to-slate-800 bg-clip-text text-transparent">
                    {i18n.language === 'vi' ? 'Hướng dẫn du lịch Quảng Ninh' : 'Quảng Ninh Travel Guide'}
                  </Title>
                  <Paragraph className="text-gray-500 dark:text-gray-400 text-lg">
                    {t('tour_guide.subtitle')}
                  </Paragraph>
                </motion.div>
              </div>

              {/* Enhanced step navigator */}
              {renderEnhancedSteps()}
            </div>

            <Card className="mb-8 border-2 border-slate-300 dark:border-slate-700 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-slate-900/10 relative overflow-hidden">
              {/* Background emoji animation */}
              <motion.div
                className="absolute top-4 right-4 text-6xl opacity-10"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {steps[currentStep].bgEmoji}
              </motion.div>
              
              <div className="min-h-[350px] relative z-10">
                <Title level={4} className={`mb-6 pb-3 border-b-2 bg-gradient-to-r ${steps[currentStep].gradient} bg-clip-text text-transparent border-slate-300 dark:border-slate-700`}>
                  {steps[currentStep].title} 
                  <span className="text-gray-400 text-base ml-3 font-normal">
                    {currentStep + 1}/{steps.length}
                  </span>
                </Title>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                  >
                    {steps[currentStep].content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Card>

            {/* Enhanced navigation buttons */}
            <div className="flex justify-between">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  icon={<LeftOutlined />}
                  size="large"
                  className="border-slate-400 text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/20 disabled:opacity-50 px-6 h-12"
                >
                  {t('common:actions.previous')}
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="primary"
                  onClick={handleNext}
                  icon={currentStep < steps.length - 1 ? <RightOutlined /> : <ThunderboltOutlined />}
                  iconPosition="end"
                  size="large"
                  className="bg-gradient-to-r from-slate-600 via-stone-600 to-slate-700 border-none hover:from-slate-700 hover:via-stone-700 hover:to-slate-800 px-6 h-12 shadow-lg"
                >
                  {currentStep < steps.length - 1
                    ? t('common:actions.next')
                    : t('common:actions.finish')}
                </Button>
              </motion.div>
            </div>

            {/* Enhanced progress indicator */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-slate-600 via-stone-600 to-slate-700 h-3 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {/* Cave shimmer effect */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                Step {currentStep + 1} of {steps.length} - Explore Quảng Ninh's limestone wonders
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuangNinhTourGuideSteps;