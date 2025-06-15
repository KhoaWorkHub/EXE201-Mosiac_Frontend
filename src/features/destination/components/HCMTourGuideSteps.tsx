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
  FireOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  StarFilled,
  HeartFilled,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface HCMTourGuideStepsProps {
  onClose: () => void;
}

const HCMTourGuideSteps: React.FC<HCMTourGuideStepsProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation(['destinationhcm', 'common']);
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);

  // Save that the user has seen the tour guide
  useEffect(() => {
    localStorage.setItem('hcmTourGuideShown', 'true');
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
      gradient: 'from-orange-500 to-red-500',
      content: (
        <div className="text-center py-6">
          <motion.div 
            className="relative w-40 h-40 mx-auto mb-8"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {/* Main city icon */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-6xl"
              >
                🏙️
              </motion.div>
              
              {/* Energy rings */}
              <motion.div
                className="absolute inset-0 border-4 border-white/30 rounded-full"
                animate={{
                  scale: [1, 1.8, 2.2],
                  opacity: [0.8, 0.4, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              <motion.div
                className="absolute inset-0 border-4 border-white/20 rounded-full"
                animate={{
                  scale: [1, 1.5, 1.8],
                  opacity: [0.6, 0.3, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5
                }}
              />
            </div>
            
            {/* Floating urban elements */}
            {['🏢', '🛵', '🍜', '☕', '🏛️', '🌆', '🎭', '🛣️'].map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                animate={{
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                  opacity: [0.8, 1, 0.8],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Title level={3} className="dark:text-white bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              {t('tour_guide.steps.welcome.title')}
            </Title>
            <Paragraph className="dark:text-gray-300 text-lg leading-relaxed">
              {t('tour_guide.steps.welcome.content')}
            </Paragraph>
          </motion.div>
          
          {/* Floating energy sparks */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                animate={{
                  x: [Math.random() * 400, Math.random() * 400],
                  y: [Math.random() * 300, Math.random() * 300],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
                style={{
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <PictureOutlined />,
      title: t('tour_guide.steps.attractions.title'),
      gradient: 'from-red-500 to-pink-500',
      content: (
        <div className="py-6">
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <motion.div 
              className="relative overflow-hidden rounded-xl shadow-2xl lg:w-80"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="/assets/destinations/hcm/independence-palace.jpg" 
                alt="Independence Palace" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <Title level={5} className="text-white m-0">
                  {t('tour_guide.steps.attractions.highlight')}
                </Title>
              </div>
              
              {/* Floating attraction icons */}
              <div className="absolute top-2 right-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >
                  🏛️
                </motion.div>
              </div>
            </motion.div>
            
            <div className="flex-1">
              <Title level={5} className="dark:text-white text-red-600 mb-3 flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-2"
                >
                  ⭐
                </motion.div>
                {t('tour_guide.steps.attractions.highlight')}
              </Title>
              <Paragraph className="dark:text-gray-300 leading-relaxed">
                {t('tour_guide.steps.attractions.content')}
              </Paragraph>
              
              {/* Enhanced attraction preview with animations */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { name: 'Independence Palace', icon: '🏛️', color: 'from-red-400 to-pink-400' },
                  { name: 'Ben Thanh Market', icon: '🏪', color: 'from-orange-400 to-red-400' },
                  { name: 'Notre-Dame', icon: '⛪', color: 'from-pink-400 to-purple-400' },
                  { name: 'Landmark 81', icon: '🏢', color: 'from-purple-400 to-blue-400' }
                ].map((attraction, i) => (
                  <motion.div
                    key={i}
                    className={`bg-gradient-to-r ${attraction.color} p-3 rounded-lg text-center text-white relative overflow-hidden`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ duration: 0.2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        delay: i * 0.5 
                      }}
                      className="text-2xl mb-1"
                    >
                      {attraction.icon}
                    </motion.div>
                    <p className="text-xs font-medium">{attraction.name}</p>
                    
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.5,
                        repeatDelay: 3 
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
      gradient: 'from-pink-500 to-purple-500',
      content: (
        <div className="py-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { name: 'Phở', img: '/assets/destinations/hcm/pho.png', emoji: '🍜' },
              { name: 'Bánh Mì', img: '/assets/destinations/hcm/banhmi.png', emoji: '🥖' },
              { name: 'Gỏi Cuốn', img: '/assets/destinations/hcm/goicuon.png', emoji: '🥗' },
              { name: 'Cà Phê Sữa Đá', img: '/assets/destinations/hcm/caphe.png', emoji: '☕' }
            ].map((food, i) => (
              <motion.div 
                key={i}
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg group">
                  <img 
                    src={food.img}
                    alt={food.name}
                    className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  
                  {/* Floating food emoji */}
                  <motion.div
                    className="absolute top-2 right-2 text-2xl"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      delay: i * 0.3 
                    }}
                  >
                    {food.emoji}
                  </motion.div>
                  
                  {/* Steam effect for hot foods */}
                  {(i === 0 || i === 3) && (
                    <div className="absolute top-2 left-2">
                      {Array.from({ length: 3 }).map((_, steamIndex) => (
                        <motion.div
                          key={steamIndex}
                          className="w-1 h-1 bg-white rounded-full absolute"
                          animate={{
                            y: [0, -15, -25],
                            opacity: [0.8, 0.4, 0],
                            scale: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: steamIndex * 0.3
                          }}
                          style={{
                            left: steamIndex * 4 + 'px'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-center font-medium dark:text-white text-sm">{food.name}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Paragraph className="dark:text-gray-300 leading-relaxed">
              {t('tour_guide.steps.food.content')}
            </Paragraph>
          </motion.div>
          
          {/* Food rating stars animation */}
          <div className="flex justify-center mt-4 space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: i * 0.2 
                }}
              >
                <StarFilled className="text-yellow-500 text-xl" />
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <ShopOutlined />,
      title: t('tour_guide.steps.shopping.title'),
      gradient: 'from-purple-500 to-blue-500',
      content: (
        <div className="py-6">
          <Paragraph className="dark:text-gray-300 mb-6 leading-relaxed">
            {t('tour_guide.steps.shopping.content')}
          </Paragraph>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Ben Thanh Market', icon: '🏪', color: 'border-purple-300' },
              { name: 'Saigon Square', icon: '🛍️', color: 'border-blue-300' },
              { name: 'Vincom Center', icon: '🏬', color: 'border-indigo-300' },
              { name: 'Diamond Plaza', icon: '💎', color: 'border-pink-300' },
              { name: 'Nguyen Hue Street', icon: '🛣️', color: 'border-green-300' },
              { name: 'Dong Khoi Street', icon: '✨', color: 'border-yellow-300' }
            ].map((place, i) => (
              <motion.div
                key={i}
                className={`border-2 ${place.color} dark:border-purple-700 rounded-lg p-3 text-center hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all cursor-pointer relative overflow-hidden`}
                whileHover={{ scale: 1.05, borderColor: '#8b5cf6' }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.div 
                  className="text-2xl mb-2"
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: i * 0.2 
                  }}
                >
                  {place.icon}
                </motion.div>
                <p className="text-xs dark:text-gray-300 font-medium">{place.name}</p>
                
                {/* Shopping bag floating effect */}
                <motion.div
                  className="absolute top-1 right-1 opacity-30"
                  animate={{ 
                    y: [0, -5, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: i * 0.3 
                  }}
                >
                  🛒
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          {/* Money floating animation */}
          <div className="flex justify-center mt-6 space-x-2">
            {['💰', '💳', '🛍️'].map((icon, i) => (
              <motion.div
                key={i}
                className="text-2xl"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: i * 0.5 
                }}
              >
                {icon}
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <CarOutlined />,
      title: t('tour_guide.steps.transport.title'),
      gradient: 'from-blue-500 to-cyan-500',
      content: (
        <div className="py-6">
          <Paragraph className="dark:text-gray-300 mb-6 leading-relaxed">
            {t('tour_guide.steps.transport.content')}
          </Paragraph>
          
          <div className="space-y-4">
            {[
              { name: 'Grab/Taxi', icon: '🚕', color: 'bg-green-500', speed: 'fast' },
              { name: 'Motorbike Taxi', icon: '🏍️', color: 'bg-blue-500', speed: 'very-fast' },
              { name: 'City Bus', icon: '🚌', color: 'bg-yellow-500', speed: 'moderate' },
              { name: 'Walking', icon: '🚶', color: 'bg-purple-500', speed: 'slow' }
            ].map((transport, i) => (
              <motion.div
                key={i}
                className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg relative overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <motion.div 
                  className={`w-12 h-12 ${transport.color} rounded-full flex items-center justify-center text-white text-xl mr-4 relative`}
                  animate={{ 
                    rotate: transport.speed === 'very-fast' ? [0, 360] : [0, 15, -15, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: transport.speed === 'very-fast' ? 2 : 3,
                    repeat: Infinity,
                    ease: transport.speed === 'very-fast' ? "linear" : "easeInOut"
                  }}
                >
                  {transport.icon}
                  
                  {/* Speed indicator */}
                  {transport.speed === 'very-fast' && (
                    <motion.div
                      className="absolute -right-1 -top-1"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      💨
                    </motion.div>
                  )}
                </motion.div>
                <div className="flex-1">
                  <p className="font-medium dark:text-white">{transport.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t(`tour_guide.steps.transport.options.${i}`)}
                  </p>
                </div>
                
                {/* Moving background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: i * 0.5 
                  }}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Traffic light animation */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-1">
              {['red', 'yellow', 'green'].map((color, i) => (
                <motion.div
                  key={color}
                  className={`w-4 h-4 rounded-full bg-${color}-500`}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: i * 0.5 
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <FireOutlined />,
      title: t('tour_guide.steps.conclusion.title'),
      gradient: 'from-cyan-500 to-green-500',
      content: (
        <div className="text-center py-6">
          <motion.div 
            className="relative w-40 h-40 mx-auto mb-8"
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 0 0 rgba(34, 197, 94, 0.4)',
                '0 0 0 20px rgba(34, 197, 94, 0)',
                '0 0 0 0 rgba(34, 197, 94, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
              <motion.span 
                className="text-6xl"
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎉
              </motion.span>
            </div>
            
            {/* Celebration particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                animate={{
                  x: [0, Math.cos(i * 30 * Math.PI / 180) * 80],
                  y: [0, Math.sin(i * 30 * Math.PI / 180) * 80],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {['🎊', '✨', '🎈', '⭐'][i % 4]}
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Title level={4} className="dark:text-white mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t('tour_guide.steps.conclusion.content_title')}
            </Title>
            <Paragraph className="dark:text-gray-300 leading-relaxed text-lg">
              {t('tour_guide.steps.conclusion.content')}
            </Paragraph>
          </motion.div>
          
          {/* Enhanced fun stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { number: '6+', label: 'Attractions', icon: '🏛️' },
              { number: '100+', label: 'Food Places', icon: '🍜' },
              { number: '∞', label: 'Memories', icon: '💫' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <motion.div 
                  className="text-2xl mb-1"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: i * 0.5 
                  }}
                >
                  {stat.icon}
                </motion.div>
                <div className="font-bold text-lg text-green-600 dark:text-green-400">{stat.number}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                
                {/* Sparkle effect */}
                <motion.div
                  className="absolute top-1 right-1 text-xs"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: i * 0.7 
                  }}
                >
                  ✨
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          {/* Heart animation */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  y: [0, -10, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: i * 0.2 
                }}
              >
                <HeartFilled className="text-red-500 text-xl" />
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  // Enhanced step navigator with more animations
  const renderEnhancedSteps = () => (
    <div className="flex justify-center items-center mb-8">
      <div className="flex bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 p-2 rounded-full border-2 border-orange-200 dark:border-orange-700 shadow-lg">
        {steps.map((step, index) => (
          <Tooltip key={index} title={step.title}>
            <motion.button
              onClick={() => setCurrentStep(index)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 mx-1 relative overflow-hidden
                ${currentStep === index 
                  ? `bg-gradient-to-r ${step.gradient} text-white shadow-2xl transform scale-110` 
                  : 'text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-800/30'
                }`}
              whileHover={{ scale: currentStep === index ? 1.15 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={currentStep === index ? {
                boxShadow: [
                  '0 0 0 0 rgba(249, 115, 22, 0.4)',
                  '0 0 0 10px rgba(249, 115, 22, 0)',
                  '0 0 0 0 rgba(249, 115, 22, 0)'
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
              
              {/* Enhanced progress ring */}
              {currentStep === index && (
                <>
                  <motion.div
                    className="absolute inset-0 border-2 border-white rounded-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 border-2 border-white/50 rounded-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </>
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
          <motion.div
            className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-4 border-orange-200 dark:border-orange-700 mx-4"
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
                  <Title level={2} className="mb-3 dark:text-white bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                    {i18n.language === 'vi' ? 'Hướng dẫn du lịch TP. HCM' : 'Ho Chi Minh City Tour Guide'}
                    <motion.span 
                      className="inline-block ml-3"
                      animate={{ rotate: [0, 20, -20, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🏙️
                    </motion.span>
                  </Title>
                  <Paragraph className="text-gray-500 dark:text-gray-400 text-lg">
                    {t('tour_guide.subtitle')}
                  </Paragraph>
                </motion.div>
              </div>

              {/* Enhanced step navigator */}
              {renderEnhancedSteps()}
            </div>

            <Card className="mb-8 border-2 border-orange-200 dark:border-orange-700 shadow-xl bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/10">
              <div className="min-h-[300px]">
                <Title level={4} className={`mb-6 pb-3 border-b-2 border-gradient-to-r ${steps[currentStep].gradient} dark:text-white border-orange-200 dark:border-orange-700 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent`}>
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
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-50 px-6 h-12"
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
                  className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 border-none hover:from-orange-600 hover:via-red-600 hover:to-pink-600 px-6 h-12 shadow-lg"
                >
                  {currentStep < steps.length - 1
                    ? t('common:actions.next')
                    : t('common:actions.finish')}
                </Button>
              </motion.div>
            </div>

            {/* Enhanced progress indicator */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                Step {currentStep + 1} of {steps.length}
                <motion.span 
                  className="inline-block ml-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ⭐
                </motion.span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HCMTourGuideSteps;