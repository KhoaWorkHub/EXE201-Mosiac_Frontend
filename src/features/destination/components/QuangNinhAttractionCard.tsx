import React, { useState } from 'react';
import { Card, Typography, Tooltip, Rate, Modal, Button } from 'antd';
import { motion } from 'framer-motion';
import { 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  ExpandOutlined,
  StarFilled,
  HeartOutlined,
  ShareAltOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  CameraOutlined,
  ThunderboltOutlined,
  FireOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

interface Attraction {
  id: number;
  name: string;
  nameVi: string;
  image: string;
  location: string;
  duration: string;
  rating: number;
  description: string;
  descriptionVi: string;
}

interface QuangNinhAttractionCardProps {
  attraction: Attraction;
  language: string;
}

const QuangNinhAttractionCard: React.FC<QuangNinhAttractionCardProps> = ({ attraction, language }) => {
  const { t } = useTranslation(['destinationquangninh', 'common']);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: displayName,
        text: displayDescription,
        url: window.location.href,
      });
    }
  };

  // Determine display content based on language
  const displayName = language === 'vi' ? attraction.nameVi : attraction.name;
  const displayDescription = language === 'vi' ? attraction.descriptionVi : attraction.description;

  // Animation variants with limestone cave theme
  const cardVariants = {
    rest: { 
      scale: 1,
      rotateY: 0,
      z: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: { 
      scale: 1.05,
      rotateY: 3,
      z: 50,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const overlayVariants = {
    rest: { 
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    },
    hover: { 
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, staggerChildren: 0.1 }
    }
  };

  const buttonVariants = {
    rest: { y: 20, opacity: 0 },
    hover: { y: 0, opacity: 1 }
  };

  return (
    <>
      <motion.div
        className="h-full perspective-1000"
        variants={cardVariants}
        initial="rest"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="relative group cursor-pointer h-full">
          <Card 
            hoverable 
            className="h-full overflow-hidden quangninh-attraction-card border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-slate-900/20"
            cover={
              <div className="relative h-64 overflow-hidden">
                <motion.img 
                  src={attraction.image} 
                  alt={displayName} 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                
                {/* Dynamic limestone gradient overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"
                  initial={{ opacity: 0.3 }}
                  whileHover={{ opacity: 0.7 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Cave stalactite effect */}
                <div className="absolute top-0 left-0 w-full h-20 overflow-hidden">
                  <motion.div
                    className="absolute top-0 w-[200%] h-20 bg-gradient-to-r from-slate-700/40 to-stone-700/40"
                    animate={{
                      x: ['-50%', '0%']
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      clipPath: 'polygon(0 0%, 100% 0%, 90% 100%, 10% 100%)'
                    }}
                  />
                  <motion.div
                    className="absolute top-0 w-[200%] h-16 bg-gradient-to-r from-stone-600/30 to-slate-600/30"
                    animate={{
                      x: ['0%', '50%']
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      clipPath: 'polygon(0 0%, 100% 0%, 95% 100%, 5% 100%)'
                    }}
                  />
                </div>
                
                {/* Floating rating badge with limestone theme */}
                <motion.div 
                  className="absolute top-4 right-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center bg-gradient-to-r from-slate-600 to-stone-600 text-white rounded-full px-3 py-1 shadow-lg backdrop-blur-sm">
                    <StarFilled className="mr-1 text-amber-300" />
                    <span className="font-bold">{attraction.rating}</span>
                  </div>
                </motion.div>

                {/* Action buttons overlay with cave exploration theme */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  variants={overlayVariants}
                >
                  <div className="flex space-x-3">
                    <motion.div variants={buttonVariants}>
                      <Tooltip title={t('common:actions.view_details')}>
                        <button 
                          className="w-14 h-14 rounded-full bg-gradient-to-r from-slate-600 to-stone-600 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm hover:from-slate-700 hover:to-stone-700 transition-all duration-300 relative overflow-hidden"
                          onClick={showModal}
                        >
                          <ExpandOutlined className="text-lg z-10" />
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            animate={{
                              scale: [0, 2, 0],
                              opacity: [0.5, 0, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeOut"
                            }}
                          />
                        </button>
                      </Tooltip>
                    </motion.div>
                    
                    <motion.div variants={buttonVariants}>
                      <Tooltip title={isLiked ? t('common:actions.unlike') : t('common:actions.like')}>
                        <button 
                          className={`w-14 h-14 rounded-full ${isLiked ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-white/90'} backdrop-blur-sm flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 relative overflow-hidden`}
                          onClick={handleLike}
                        >
                          <HeartOutlined className={`text-lg ${isLiked ? 'text-white' : 'text-red-500'} z-10`} />
                          {isLiked && (
                            <motion.div
                              className="absolute inset-0"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0, 0.3]
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity
                              }}
                            />
                          )}
                        </button>
                      </Tooltip>
                    </motion.div>
                    
                    <motion.div variants={buttonVariants}>
                      <Tooltip title={t('common:actions.share')}>
                        <button 
                          className="w-14 h-14 rounded-full bg-gradient-to-r from-stone-600 to-slate-600 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm hover:from-stone-700 hover:to-slate-700 transition-all duration-300 relative"
                          onClick={handleShare}
                        >
                          <ShareAltOutlined className="text-lg z-10" />
                          <motion.div
                            className="absolute inset-0 border-2 border-white rounded-full"
                            animate={{
                              scale: [1, 1.3],
                              opacity: [0.5, 0]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity
                            }}
                          />
                        </button>
                      </Tooltip>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Animated corner decoration with cave pattern */}
                <motion.div 
                  className="absolute top-0 left-0 w-0 h-0 border-l-[30px] border-l-slate-600 border-b-[30px] border-b-transparent"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Floating cave crystals/gems */}
                {isHovered && Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-slate-400 to-stone-400 rounded-full opacity-70"
                    animate={{
                      y: [64 * 4, 0],
                      x: [Math.random() * 256, Math.random() * 256],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeOut"
                    }}
                    style={{
                      bottom: 0,
                      left: Math.random() * 100 + '%'
                    }}
                  />
                ))}
              </div>
            }
            onClick={showModal}
          >
            <div className="p-4 relative">
              {/* Enhanced title with limestone gradient */}
              <Title level={5} className="mb-3 dark:text-white bg-gradient-to-r from-slate-700 to-stone-700 bg-clip-text text-transparent font-bold leading-tight line-clamp-2">
                {displayName}
              </Title>
              
              {/* Interactive rating with cave theme */}
              <motion.div 
                className="flex items-center mb-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Rate 
                  disabled 
                  value={attraction.rating} 
                  allowHalf 
                  className="text-sm"
                />
                <Text className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  ({attraction.rating})
                </Text>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="ml-2"
                >
                  🗿
                </motion.div>
              </motion.div>
              
              {/* Enhanced location info with cave icon */}
              <motion.div 
                className="flex items-center mb-2 text-gray-600 dark:text-gray-300"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-slate-600 to-stone-600 flex items-center justify-center mr-2">
                  <EnvironmentOutlined className="text-white text-xs" />
                </div>
                <Text className="text-sm truncate font-medium">
                  {attraction.location}
                </Text>
              </motion.div>
              
              {/* Enhanced duration info */}
              <motion.div 
                className="flex items-center mb-4 text-gray-600 dark:text-gray-300"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-stone-600 to-slate-600 flex items-center justify-center mr-2">
                  <ClockCircleOutlined className="text-white text-xs" />
                </div>
                <Text className="text-sm font-medium">
                  {attraction.duration}
                </Text>
              </motion.div>
              
              {/* Enhanced description */}
              <Paragraph 
                ellipsis={{ rows: 3 }} 
                className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4"
              >
                {displayDescription}
              </Paragraph>
              
              {/* Interactive footer with limestone theme */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    type="link" 
                    className="p-0 text-slate-700 hover:text-stone-700 font-bold bg-gradient-to-r from-slate-700 to-stone-700 bg-clip-text text-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      showModal();
                    }}
                  >
                    {t('common:actions.learn_more')} <ThunderboltOutlined className="ml-1" />
                  </Button>
                </motion.div>
                
                <div className="flex items-center space-x-2">
                  <motion.button 
                    onClick={handleLike} 
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <HeartOutlined className={`${isLiked ? 'text-red-500' : 'text-gray-400'} transition-colors`} />
                  </motion.button>
                  <motion.button 
                    onClick={handleShare} 
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ShareAltOutlined className="text-gray-400 hover:text-slate-600 transition-colors" />
                  </motion.button>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                  >
                    <EyeOutlined className="text-gray-400" />
                  </motion.div>
                </div>
              </div>

              {/* Floating limestone elements for visual appeal */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 bg-slate-500 rounded-full opacity-60"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
              <motion.div
                className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-stone-500 rounded-full opacity-60"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  delay: 1
                }}
              />
            </div>
          </Card>
        </div>
      </motion.div>
      
      {/* Enhanced Modal with Cave Exploration Theme */}
      <Modal
        title={
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-600 to-stone-600 flex items-center justify-center mr-3">
                <CameraOutlined className="text-white" />
              </div>
              <Title level={4} className="m-0 dark:text-white mr-3 bg-gradient-to-r from-slate-700 to-stone-700 bg-clip-text text-transparent">
                {displayName}
              </Title>
              <div className="flex items-center bg-gradient-to-r from-slate-100 to-stone-100 dark:from-slate-800 dark:to-stone-800 px-3 py-1 rounded-full">
                <StarFilled className="text-slate-600 mr-1" />
                <Text strong className="text-slate-700 dark:text-slate-300">{attraction.rating}</Text>
              </div>
            </div>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel} className="hover:border-slate-600">
            {t('common:actions.close')}
          </Button>,
          <Button key="share" type="primary" onClick={handleShare} className="bg-gradient-to-r from-slate-600 to-stone-600 border-none hover:from-slate-700 hover:to-stone-700">
            <ShareAltOutlined /> {t('common:actions.share')}
          </Button>
        ]}
        width={900}
        className="quangninh-attraction-modal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 md:h-full overflow-hidden rounded-lg relative">
            <img 
              src={attraction.image} 
              alt={displayName} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            
            {/* Floating limestone elements in modal */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-2xl"
              >
                🗿
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="text-2xl"
              >
                🏔️
              </motion.div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Title level={5} className="dark:text-white flex items-center text-slate-700">
                <InfoCircleOutlined className="mr-2 text-slate-700" />
                {t('destination:about')}
              </Title>
              <Paragraph className="dark:text-gray-300 leading-relaxed">
                {displayDescription}
              </Paragraph>
            </div>
            
            <div>
              <Title level={5} className="dark:text-white flex items-center text-slate-700">
                <EnvironmentOutlined className="mr-2 text-slate-700" />
                {t('destination:location')}
              </Title>
              <div className="bg-gradient-to-r from-slate-50 to-stone-50 dark:from-slate-800/20 dark:to-stone-800/20 px-4 py-2 rounded-lg">
                <Text className="dark:text-gray-300 font-medium">
                  {attraction.location}
                </Text>
              </div>
            </div>
            
            <div>
              <Title level={5} className="dark:text-white flex items-center text-slate-700">
                <ClockCircleOutlined className="mr-2 text-slate-700" />
                {t('destination:suggested_duration')}
              </Title>
              <div className="bg-gradient-to-r from-stone-50 to-slate-50 dark:from-stone-800/20 dark:to-slate-800/20 px-4 py-2 rounded-lg">
                <Text className="dark:text-gray-300 font-medium">
                  {attraction.duration}
                </Text>
              </div>
            </div>
            
            <div>
              <Title level={5} className="dark:text-white flex items-center text-slate-700">
                <FireOutlined className="mr-2 text-slate-700" />
                {t('destination:tips')}
              </Title>
              <ul className="list-disc list-inside dark:text-gray-300 space-y-2 bg-gradient-to-r from-slate-50 to-stone-50 dark:from-slate-800/20 dark:to-stone-800/20 p-4 rounded-lg">
                <li>Best explored in the early morning for optimal lighting</li>
                <li>Wear comfortable shoes suitable for cave exploration</li>
                <li>Bring a waterproof camera for stunning limestone formations</li>
                {attraction.id === 1 && <li>Take a traditional junk boat for the authentic experience</li>}
                {attraction.id === 2 && <li>Book guided tours for safe cave exploration</li>}
                {attraction.id === 3 && <li>Visit during low tide for better access to sea caves</li>}
                {attraction.id === 4 && <li>Allow extra time for the scenic cable car journey</li>}
                {attraction.id === 5 && <li>Perfect for kayaking and close-up limestone viewing</li>}
                {attraction.id === 6 && <li>Learn about local fishing culture and floating villages</li>}
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QuangNinhAttractionCard;