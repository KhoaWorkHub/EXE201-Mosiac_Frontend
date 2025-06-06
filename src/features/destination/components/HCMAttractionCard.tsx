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
  FireOutlined,
  EyeOutlined,
  CameraOutlined,
  ThunderboltOutlined
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

interface HCMAttractionCardProps {
  attraction: Attraction;
  language: string;
}

const HCMAttractionCard: React.FC<HCMAttractionCardProps> = ({ attraction, language }) => {
  const { t } = useTranslation(['destinationhcm', 'common']);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [, setIsHovered] = useState(false);

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
      rotateY: 5,
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
            className="h-full overflow-hidden hcm-attraction-card border-0 shadow-2xl bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20"
            cover={
              <div className="relative h-64 overflow-hidden">
                <motion.img 
                  src={attraction.image} 
                  alt={displayName} 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                
                {/* Dynamic gradient overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                  initial={{ opacity: 0.3 }}
                  whileHover={{ opacity: 0.7 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Floating rating badge */}
                <motion.div 
                  className="absolute top-4 right-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-3 py-1 shadow-lg backdrop-blur-sm">
                    <StarFilled className="mr-1 text-yellow-300" />
                    <span className="font-bold">{attraction.rating}</span>
                  </div>
                </motion.div>

                {/* Action buttons overlay */}
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  variants={overlayVariants}
                >
                  <div className="flex space-x-3">
                    <motion.div variants={buttonVariants}>
                      <Tooltip title={t('common:actions.view_details')}>
                        <button 
                          className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                          onClick={showModal}
                        >
                          <ExpandOutlined className="text-lg" />
                        </button>
                      </Tooltip>
                    </motion.div>
                    
                    <motion.div variants={buttonVariants}>
                      <Tooltip title={isLiked ? t('common:actions.unlike') : t('common:actions.like')}>
                        <button 
                          className={`w-14 h-14 rounded-full ${isLiked ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-white/90'} backdrop-blur-sm flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300`}
                          onClick={handleLike}
                        >
                          <HeartOutlined className={`text-lg ${isLiked ? 'text-white' : 'text-red-500'}`} />
                        </button>
                      </Tooltip>
                    </motion.div>
                    
                    <motion.div variants={buttonVariants}>
                      <Tooltip title={t('common:actions.share')}>
                        <button 
                          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                          onClick={handleShare}
                        >
                          <ShareAltOutlined className="text-lg" />
                        </button>
                      </Tooltip>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Animated corner decoration */}
                <motion.div 
                  className="absolute top-0 left-0 w-0 h-0 border-l-[30px] border-l-orange-500 border-b-[30px] border-b-transparent"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            }
            onClick={showModal}
          >
            <div className="p-4 relative">
              {/* Enhanced title with gradient */}
              <Title level={5} className="mb-3 dark:text-white bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-bold leading-tight line-clamp-2">
                {displayName}
              </Title>
              
              {/* Interactive rating */}
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
                  <FireOutlined className="text-orange-500" />
                </motion.div>
              </motion.div>
              
              {/* Enhanced location info */}
              <motion.div 
                className="flex items-center mb-2 text-gray-600 dark:text-gray-300"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-2">
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
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-2">
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
              
              {/* Interactive footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    type="link" 
                    className="p-0 text-orange-600 hover:text-red-600 font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
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
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <HeartOutlined className={`${isLiked ? 'text-red-500' : 'text-gray-400'} transition-colors`} />
                  </motion.button>
                  <motion.button 
                    onClick={handleShare} 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ShareAltOutlined className="text-gray-400 hover:text-blue-500 transition-colors" />
                  </motion.button>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  >
                    <EyeOutlined className="text-gray-400" />
                  </motion.div>
                </div>
              </div>

              {/* Floating elements for visual appeal */}
              <motion.div
                className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full opacity-60"
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
                className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-red-400 rounded-full opacity-60"
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
      
      {/* Enhanced Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mr-3">
                <CameraOutlined className="text-white" />
              </div>
              <Title level={4} className="m-0 dark:text-white mr-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {displayName}
              </Title>
              <div className="flex items-center bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 px-3 py-1 rounded-full">
                <StarFilled className="text-orange-500 mr-1" />
                <Text strong className="text-orange-700 dark:text-orange-300">{attraction.rating}</Text>
              </div>
            </div>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel} className="hover:border-orange-500">
            {t('common:actions.close')}
          </Button>,
          <Button key="share" type="primary" onClick={handleShare} className="bg-gradient-to-r from-orange-500 to-red-500 border-none hover:from-orange-600 hover:to-red-600">
            <ShareAltOutlined /> {t('common:actions.share')}
          </Button>
        ]}
        width={900}
        className="hcm-attraction-modal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 md:h-full overflow-hidden rounded-lg relative">
            <img 
              src={attraction.image} 
              alt={displayName} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          
          <div className="space-y-4">
            <div>
              <Title level={5} className="dark:text-white flex items-center text-orange-600">
                <InfoCircleOutlined className="mr-2 text-orange-600" />
                {t('destination:about')}
              </Title>
              <Paragraph className="dark:text-gray-300 leading-relaxed">
                {displayDescription}
              </Paragraph>
            </div>
            
            <div>
              <Title level={5} className="dark:text-white flex items-center text-orange-600">
                <EnvironmentOutlined className="mr-2 text-orange-600" />
                {t('destination:location')}
              </Title>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 px-4 py-2 rounded-lg">
                <Text className="dark:text-gray-300 font-medium">
                  {attraction.location}
                </Text>
              </div>
            </div>
            
            <div>
              <Title level={5} className="dark:text-white flex items-center text-orange-600">
                <ClockCircleOutlined className="mr-2 text-orange-600" />
                {t('destination:suggested_duration')}
              </Title>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-2 rounded-lg">
                <Text className="dark:text-gray-300 font-medium">
                  {attraction.duration}
                </Text>
              </div>
            </div>
            
            <div>
              <Title level={5} className="dark:text-white flex items-center text-orange-600">
                <ThunderboltOutlined className="mr-2 text-orange-600" />
                {t('destination:tips')}
              </Title>
              <ul className="list-disc list-inside dark:text-gray-300 space-y-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg">
                <li>Best time to visit is early morning for fewer crowds</li>
                <li>Wear comfortable walking shoes</li>
                <li>Bring a camera for stunning photo opportunities</li>
                {attraction.id === 1 && <li>Guided tours available in multiple languages</li>}
                {attraction.id === 2 && <li>Perfect for trying authentic Vietnamese street food</li>}
                {attraction.id === 3 && <li>Dress modestly when visiting this religious site</li>}
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HCMAttractionCard;