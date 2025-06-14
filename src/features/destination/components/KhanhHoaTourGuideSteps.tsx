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

interface KhanhHoaTourGuideStepsProps {
  onClose: () => void;
}

const KhanhHoaTourGuideSteps: React.FC<KhanhHoaTourGuideStepsProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation(['destinationkhanhhoa', 'common']);
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);

  // Save that the user has seen the tour guide
  useEffect(() => {
    localStorage.setItem('khanhhoaTourGuideShown', 'true');
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
      gradient: 'from-blue-500 to-cyan-500',
      bgEmoji: '🌊',
      content: (
        <div className="text-center py-6">
          <motion.div 
            className="w-36 h-36 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-6 flex items-center justify-center relative overflow-hidden"
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
              🏖️
            </motion.div>
            
            {/* Floating wave particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                animate={{
                  x: [0, Math.cos(i * 30 * Math.PI / 180) * 50],
                  y: [0, Math.sin(i * 30 * Math.PI / 180) * 50],
                  opacity: [0.7, 1, 0.7],
                  scale: [0.5, 1.5, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Ripple effect */}
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
      gradient: 'from-cyan-500 to-teal-500',
      bgEmoji: '🏝️',
      content: (
        <div className="py-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <motion.div 
              className="relative overflow-hidden rounded-xl shadow-2xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full md:w-64 h-48 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-6xl relative overflow-hidden">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  🏖️
                </motion.div>
                
                {/* Water ripple effect */}
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
              <Title level={5} className="dark:text-white text-blue-600 mb-3">
                {t('tour_guide.steps.attractions.highlight')}
              </Title>
              <Paragraph className="dark:text-gray-300 leading-relaxed">
                {t('tour_guide.steps.attractions.content')}
              </Paragraph>
              
              {/* Mini attraction preview with ocean theme */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { name: 'Nha Trang Beach', emoji: '🏖️', color: 'from-blue-400 to-cyan-400' },
                  { name: 'Vinpearl Land', emoji: '🎡', color: 'from-cyan-400 to-teal-400' },
                  { name: 'Po Nagar Towers', emoji: '🏛️', color: 'from-teal-400 to-blue-400' },
                  { name: 'Island Hopping', emoji: '⛵', color: 'from-blue-500 to-cyan-500' }
                ].map((attraction, i) => (
                  <motion.div
                    key={i}
                    className={`bg-gradient-to-r ${attraction.color} text-white p-3 rounded-lg text-center relative overflow-hidden`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ duration: 0.2 }}
                    animate={{ 
                      boxShadow: [
                        '0 4px 12px rgba(59, 130, 246, 0.2)',
                        '0 8px 20px rgba(6, 182, 212, 0.3)',
                        '0 4px 12px rgba(59, 130, 246, 0.2)'
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
                    
                    {/* Wave effect */}
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
      gradient: 'from-teal-500 to-emerald-500',
      bgEmoji: '🦐',
      content: (
        <div className="py-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { name: 'Fresh Seafood', emoji: '🦐', color: 'bg-gradient-to-br from-blue-400 to-cyan-500' },
              { name: 'Nem Nướng', emoji: '🍢', color: 'bg-gradient-to-br from-cyan-400 to-teal-500' },
              { name: 'Bánh Căn', emoji: '🥟', color: 'bg-gradient-to-br from-teal-400 to-emerald-500' },
              { name: 'Chả Cá', emoji: '🐟', color: 'bg-gradient-to-br from-emerald-400 to-blue-500' }
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
                  
                  {/* Sparkle effects */}
                  {Array.from({ length: 6 }).map((_, sparkleIndex) => (
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
      gradient: 'from-emerald-500 to-blue-500',
      bgEmoji: '🛍️',
      content: (
        <div className="py-6">
          <Paragraph className="dark:text-gray-300 mb-6 leading-relaxed">
            {t('tour_guide.steps.shopping.content')}
          </Paragraph>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Nha Trang Center', icon: '🏬', color: 'border-blue-300 hover:bg-blue-50' },
              { name: 'Dam Market', icon: '🏪', color: 'border-cyan-300 hover:bg-cyan-50' },
              { name: 'Vincom Plaza', icon: '🛒', color: 'border-teal-300 hover:bg-teal-50' },
              { name: 'Night Market', icon: '🌙', color: 'border-emerald-300 hover:bg-emerald-50' },
              { name: 'Sailing Club', icon: '⛵', color: 'border-blue-300 hover:bg-blue-50' },
              { name: 'Landmark', icon: '🗼', color: 'border-cyan-300 hover:bg-cyan-50' }
            ].map((place, i) => (
              <motion.div
                key={i}
                className={`border-2 ${place.color} rounded-lg p-3 text-center transition-all cursor-pointer relative overflow-hidden`}
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: '#0891b2',
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
                
                {/* Floating shine effect */}
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
      gradient: 'from-blue-500 to-purple-500',
      bgEmoji: '🚗',
      content: (
        <div className="py-6">
          <Paragraph className="dark:text-gray-300 mb-6 leading-relaxed">
            {t('tour_guide.steps.transport.content')}
          </Paragraph>
          
          <div className="space-y-4">
            {[
              { name: 'Taxi/Grab', icon: '🚕', color: 'bg-gradient-to-r from-blue-500 to-cyan-500', detail: 'Most convenient for tourists' },
              { name: 'Motorbike Taxi', icon: '🏍️', color: 'bg-gradient-to-r from-cyan-500 to-teal-500', detail: 'Quick for short distances' },
              { name: 'Cable Car', icon: '🚠', color: 'bg-gradient-to-r from-teal-500 to-emerald-500', detail: 'Scenic route to Vinpearl' },
              { name: 'Boat Tours', icon: '⛵', color: 'bg-gradient-to-r from-emerald-500 to-blue-500', detail: 'Island hopping adventures' }
            ].map((transport, i) => (
              <motion.div
                key={i}
                className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg relative overflow-hidden"
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
                  <p className="font-medium dark:text-white text-blue-700">{transport.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {transport.detail}
                  </p>
                </div>
                
                {/* Wave animation */}
                <motion.div
                  className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-blue-200/30 to-transparent"
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
      gradient: 'from-purple-500 to-pink-500',
      bgEmoji: '🎉',
      content: (
        <div className="text-center py-6">
          <motion.div 
            className="w-36 h-36 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 mx-auto mb-6 flex items-center justify-center relative overflow-hidden"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
              boxShadow: [
                '0 0 0 0 rgba(34, 197, 94, 0.4)',
                '0 0 0 30px rgba(34, 197, 94, 0)',
                '0 0 0 0 rgba(34, 197, 94, 0)'
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
            
            {/* Celebration particles */}
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][i % 5]
                }}
                animate={{
                  x: [0, Math.cos(i * 22.5 * Math.PI / 180) * 80],
                  y: [0, Math.sin(i * 22.5 * Math.PI / 180) * 80],
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
          <Title level={4} className="dark:text-white mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            {t('tour_guide.steps.conclusion.content_title')}
          </Title>
          <Paragraph className="dark:text-gray-300 leading-relaxed text-lg">
            {t('tour_guide.steps.conclusion.content')}
          </Paragraph>
          
          {/* Fun stats with ocean theme */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { number: '6+', label: 'Beaches & Islands', icon: '🏖️', color: 'from-blue-400 to-cyan-400' },
              { number: '50+', label: 'Seafood Dishes', icon: '🦐', color: 'from-cyan-400 to-teal-400' },
              { number: '∞', label: 'Ocean Memories', icon: '🌊', color: 'from-teal-400 to-emerald-400' }
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
                
                {/* Shimmer effect */}
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

  // Enhanced step navigator with ocean theme
  const renderEnhancedSteps = () => (
    <div className="flex justify-center items-center mb-8">
      <div className="flex bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-teal-900/20 p-3 rounded-full border-2 border-blue-200 dark:border-blue-700 shadow-xl relative overflow-hidden">
        {/* Wave background animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-cyan-200/30"
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
                  : 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30'
                }`}
              whileHover={{ scale: currentStep === index ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={currentStep === index ? {
                boxShadow: [
                  '0 0 0 0 rgba(59, 130, 246, 0.4)',
                  '0 0 0 15px rgba(59, 130, 246, 0)',
                  '0 0 0 0 rgba(59, 130, 246, 0)'
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
                  className="absolute inset-0 bg-green-500 rounded-full flex items-center justify-center text-white"
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
          {/* Background ocean animation */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
                animate={{
                  y: [window.innerHeight, -50],
                  x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                  opacity: [0, 0.7, 0],
                  scale: [0, 2, 0]
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
            className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-4 border-blue-200 dark:border-blue-700 mx-4"
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
                  <Title level={2} className="mb-3 dark:text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                    {i18n.language === 'vi' ? 'Hướng dẫn du lịch Khánh Hòa' : 'Khánh Hòa Travel Guide'}
                  </Title>
                  <Paragraph className="text-gray-500 dark:text-gray-400 text-lg">
                    {t('tour_guide.subtitle')}
                  </Paragraph>
                </motion.div>
              </div>

              {/* Enhanced step navigator */}
              {renderEnhancedSteps()}
            </div>

            <Card className="mb-8 border-2 border-blue-200 dark:border-blue-700 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 relative overflow-hidden">
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
                <Title level={4} className={`mb-6 pb-3 border-b-2 bg-gradient-to-r ${steps[currentStep].gradient} bg-clip-text text-transparent border-blue-200 dark:border-blue-700`}>
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
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 px-6 h-12"
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
                  className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 border-none hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 px-6 h-12 shadow-lg"
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
                  className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 h-3 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {/* Shimmer effect */}
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
                Step {currentStep + 1} of {steps.length} - Discover Khánh Hòa's wonders
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KhanhHoaTourGuideSteps;