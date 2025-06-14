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

interface KhanhHoaAttractionCardProps {
  attraction: Attraction;
  language: string;
}

const KhanhHoaAttractionCard: React.FC<KhanhHoaAttractionCardProps> = ({ attraction, language }) => {
  const { t } = useTranslation(['destinationkhanhhoa', 'common']);
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

  // Animation variants
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
            className="h-full overflow-hidden khanhhoa-attraction-card border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20"
            cover={
              <div className="relative h-64 overflow-hidden">
                <motion.img 
                  src={attraction.image} 
                  alt={displayName} 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                
                {/* Dynamic ocean gradient overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent"
                  initial={{ opacity: 0.3 }}
                  whileHover={{ opacity: 0.7 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Wave effect overlay */}
                <div className="absolute bottom-0 left-0 w-full h-20 overflow-hidden">
                  <motion.div
                    className="absolute bottom-0 w-[200%] h-20 bg-gradient-to-r from-blue-500/40 to-cyan-500/40"
                    animate={{
                      x: ['-50%', '0%']
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      clipPath: 'polygon(0 60%, 100% 40%, 100% 100%, 0 100%)'
                    }}
                  />
                  <motion.div
                    className="absolute bottom-0 w-[200%] h-16 bg-gradient-to-r from-cyan-500/30 to-teal-500/30"
                    animate={{
                      x: ['0%', '50%']
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      clipPath: 'polygon(0 70%, 100% 50%, 100% 100%, 0 100%)'
                    }}
                  />
                </div>
                
                {/* Floating rating badge with ocean theme */}
                <motion.div 
                  className="absolute top-4 right-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full px-3 py-1 shadow-lg backdrop-blur-sm">
                    <StarFilled className="mr-1 text-yellow-300" />
                    <span className="font-bold">{attraction.rating}</span>
                  </div>
                </motion.div>

                {/* Action buttons overlay with wave effects */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  variants={overlayVariants}
                >
                  <div className="flex space-x-3">
                    <motion.div variants={buttonVariants}>
                      <Tooltip title={t('common:actions.view_details')}>
                        <button 
                          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 relative overflow-hidden"
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
                          className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 relative"
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

                {/* Animated corner decoration with ocean pattern */}
                <motion.div 
                  className="absolute top-0 left-0 w-0 h-0 border-l-[30px] border-l-blue-500 border-b-[30px] border-b-transparent"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Floating bubbles */}
                {isHovered && Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/60 rounded-full"
                    animate={{
                      y: [64 * 4, 0],
                      x: [Math.random() * 256, Math.random() * 256],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.3,
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
              {/* Enhanced title with ocean gradient */}
              <Title level={5} className="mb-3 dark:text-white bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold leading-tight line-clamp-2">
                {displayName}
              </Title>
              
              {/* Interactive rating with waves */}
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
                  🌊
                </motion.div>
              </motion.div>
              
              {/* Enhanced location info with ocean icon */}
              <motion.div 
                className="flex items-center mb-2 text-gray-600 dark:text-gray-300"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-2">
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
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center mr-2">
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
              
              {/* Interactive footer with ocean theme */}
              <div className="flex items-center justify-between pt-3 border-t border-blue-100 dark:border-blue-700">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    type="link" 
                    className="p-0 text-blue-600 hover:text-cyan-600 font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
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
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-700 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <HeartOutlined className={`${isLiked ? 'text-red-500' : 'text-gray-400'} transition-colors`} />
                  </motion.button>
                  <motion.button 
                    onClick={handleShare} 
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-700 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ShareAltOutlined className="text-gray-400 hover:text-blue-500 transition-colors" />
                  </motion.button>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                  >
                    <EyeOutlined className="text-gray-400" />
                  </motion.div>
                </div>
              </div>

              {/* Floating ocean elements for visual appeal */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full opacity-60"
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
                className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-60"
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
      
      {/* Enhanced Modal with Ocean Theme */}
      <Modal
        title={
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-3">
                <CameraOutlined className="text-white" />
              </div>
              <Title level={4} className="m-0 dark:text-white mr-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {displayName}
              </Title>
              <div className="flex items-center bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 px-3 py-1 rounded-full">
                <StarFilled className="text-blue-500 mr-1" />
                <Text strong className="text-blue-700 dark:text-blue-300">{attraction.rating}</Text>
              </div>
            </div>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel} className="hover:border-blue-500">
            {t('common:actions.close')}
          </Button>,
          <Button key="share" type="primary" onClick={handleShare} className="bg-gradient-to-r from-blue-500 to-cyan-500 border-none hover:from-blue-600 hover:to-cyan-600">
            <ShareAltOutlined /> {t('common:actions.share')}
          </Button>
        ]}
        width={900}
        className="khanhhoa-attraction-modal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 md:h-full overflow-hidden rounded-lg relative">
            <img 
              src={attraction.image} 
              alt={displayName} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
            
            {/* Floating ocean elements in modal */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-2xl"
              >
                🌊
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="text-2xl"
              >
                🏖️
              </motion.div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Title level={5} className="dark:text-white flex items-center text-blue-600">
                <InfoCircleOutlined className="mr-2 text-blue-600" />
                {t('destination:about')}
              </Title>
              <Paragraph className="dark:text-gray-300 leading-relaxed">
                {displayDescription}
              </Paragraph>
            </div>
            
            <div>
              <Title level={5} className="dark:text-white flex items-center text-blue-600">
                <EnvironmentOutlined className="mr-2 text-blue-600" />
                {t('destination:location')}
              </Title>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 px-4 py-2 rounded-lg">
                <Text className="dark:text-gray-300 font-medium">
                  {attraction.location}
                </Text>
              </div>
            </div>
            
            <div>
              <Title level={5} className="dark:text-white flex items-center text-blue-600">
                <ClockCircleOutlined className="mr-2 text-blue-600" />
                {t('destination:suggested_duration')}
              </Title>
              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 px-4 py-2 rounded-lg">
                <Text className="dark:text-gray-300 font-medium">
                  {attraction.duration}
                </Text>
              </div>
            </div>
            
            <div>
              <Title level={5} className="dark:text-white flex items-center text-blue-600">
                <FireOutlined className="mr-2 text-blue-600" />
                {t('destination:tips')}
              </Title>
              <ul className="list-disc list-inside dark:text-gray-300 space-y-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg">
                <li>Best time to visit is early morning for perfect lighting</li>
                <li>Bring sunscreen and stay hydrated in the tropical climate</li>
                <li>Don't miss the sunset views - absolutely spectacular!</li>
                {attraction.id === 1 && <li>Perfect for swimming and water sports</li>}
                {attraction.id === 2 && <li>Take the cable car for amazing aerial views</li>}
                {attraction.id === 3 && <li>Dress modestly when visiting this cultural site</li>}
                {attraction.id === 4 && <li>Book in advance for the best mud bath experience</li>}
                {attraction.id === 5 && <li>Bring underwater camera for snorkeling</li>}
                {attraction.id === 6 && <li>Wear comfortable shoes for jungle trekking</li>}
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default KhanhHoaAttractionCard;