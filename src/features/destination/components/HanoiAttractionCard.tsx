import React, { useState } from 'react';
import { Card, Typography, Tooltip, Rate, Badge, Modal, Button } from 'antd';
import { motion } from 'framer-motion';
import { 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  ExpandOutlined,
  StarFilled,
  HeartOutlined,
  ShareAltOutlined,
  InfoCircleOutlined
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

interface HanoiAttractionCardProps {
  attraction: Attraction;
  language: string;
}

const HanoiAttractionCard: React.FC<HanoiAttractionCardProps> = ({ attraction, language }) => {
  const { t } = useTranslation(['destinationhanoi', 'common']);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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

  // Determine the name and description based on language
  const displayName = language === 'vi' ? attraction.nameVi : attraction.name;
  const displayDescription = language === 'vi' ? attraction.descriptionVi : attraction.description;

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Badge.Ribbon 
          text={`${attraction.rating}/5`} 
          color="#f59e0b"
          className="z-10"
        >
          <Card 
            hoverable 
            className="h-full overflow-hidden hanoi-attraction-card border-l-4 border-l-yellow-500 shadow-lg hover:shadow-2xl transition-all duration-500"
            cover={
              <div className="relative h-48 overflow-hidden group">
                <img 
                  src={attraction.image} 
                  alt={displayName} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Action buttons overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex space-x-2">
                    <Tooltip title={t('common:actions.view_details')}>
                      <button 
                        className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                        onClick={showModal}
                      >
                        <ExpandOutlined className="text-yellow-600" />
                      </button>
                    </Tooltip>
                    
                    <Tooltip title={isLiked ? t('common:actions.unlike') : t('common:actions.like')}>
                      <button 
                        className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                        onClick={handleLike}
                      >
                        <HeartOutlined className={`${isLiked ? 'text-red-500' : 'text-gray-500'} transition-colors`} />
                      </button>
                    </Tooltip>
                    
                    <Tooltip title={t('common:actions.share')}>
                      <button 
                        className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                        onClick={handleShare}
                      >
                        <ShareAltOutlined className="text-blue-500" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                
                {/* Rating badge */}
                <div className="absolute top-3 left-3">
                  <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm font-medium">
                    <StarFilled className="text-yellow-500 mr-1 text-xs" />
                    <span className="text-gray-800">{attraction.rating}</span>
                  </div>
                </div>
              </div>
            }
            onClick={showModal}
          >
            <div className="p-2">
              <Title level={5} className="mb-3 dark:text-white text-gray-800 line-clamp-2">
                {displayName}
              </Title>
              
              <div className="flex items-center mb-2">
                <Rate 
                  disabled 
                  value={attraction.rating} 
                  allowHalf 
                  className="text-sm"
                />
                <Text className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({attraction.rating})
                </Text>
              </div>
              
              <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                <EnvironmentOutlined className="text-yellow-600 mr-2 flex-shrink-0" />
                <Text className="text-sm truncate">
                  {attraction.location}
                </Text>
              </div>
              
              <div className="flex items-center mb-3 text-gray-600 dark:text-gray-300">
                <ClockCircleOutlined className="text-yellow-600 mr-2 flex-shrink-0" />
                <Text className="text-sm">
                  {attraction.duration}
                </Text>
              </div>
              
              <Paragraph 
                ellipsis={{ rows: 3 }} 
                className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
              >
                {displayDescription}
              </Paragraph>
              
              {/* Interactive elements */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <Button 
                  type="link" 
                  className="p-0 text-yellow-600 hover:text-yellow-700 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    showModal();
                  }}
                >
                  {t('common:actions.learn_more')}
                </Button>
                
                <div className="flex items-center space-x-2">
                  <button onClick={handleLike} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <HeartOutlined className={`${isLiked ? 'text-red-500' : 'text-gray-400'} transition-colors`} />
                  </button>
                  <button onClick={handleShare} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <ShareAltOutlined className="text-gray-400 hover:text-blue-500 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </Badge.Ribbon>
      </motion.div>
      
      {/* Enhanced Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Title level={4} className="m-0 dark:text-white mr-3">
                {displayName}
              </Title>
              <div className="flex items-center bg-yellow-50 dark:bg-yellow-900 px-2 py-1 rounded-full">
                <StarFilled className="text-yellow-500 mr-1" />
                <Text strong className="text-yellow-700 dark:text-yellow-300">{attraction.rating}</Text>
              </div>
            </div>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            {t('common:actions.close')}
          </Button>,
          <Button key="share" type="primary" onClick={handleShare} className="bg-yellow-500 border-yellow-500 hover:bg-yellow-600">
            <ShareAltOutlined /> {t('common:actions.share')}
          </Button>
        ]}
        width={900}
        className="hanoi-attraction-modal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 md:h-full overflow-hidden rounded-lg">
            <img 
              src={attraction.image} 
              alt={displayName} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <div className="mb-4">
              <Title level={5} className="dark:text-white flex items-center">
                <InfoCircleOutlined className="mr-2 text-yellow-600" />
                {t('destination:about')}
              </Title>
              <Paragraph className="dark:text-gray-300 leading-relaxed">
                {displayDescription}
              </Paragraph>
            </div>
            
            <div className="mb-4">
              <Title level={5} className="dark:text-white flex items-center">
                <EnvironmentOutlined className="mr-2 text-yellow-600" />
                {t('destination:location')}
              </Title>
              <Text className="dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg inline-block">
                {attraction.location}
              </Text>
            </div>
            
            <div className="mb-4">
              <Title level={5} className="dark:text-white flex items-center">
                <ClockCircleOutlined className="mr-2 text-yellow-600" />
                {t('destination:suggested_duration')}
              </Title>
              <Text className="dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg inline-block">
                {attraction.duration}
              </Text>
            </div>
            
            <div className="mb-4">
              <Title level={5} className="dark:text-white flex items-center">
                <InfoCircleOutlined className="mr-2 text-yellow-600" />
                {t('destination:tips')}
              </Title>
              <ul className="list-disc list-inside dark:text-gray-300 space-y-1 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <li>{t('destination:attractions.tips.1')}</li>
                <li>{t('destination:attractions.tips.2')}</li>
                <li>{t('destination:attractions.tips.3')}</li>
                {attraction.id === 1 && <li>Best time to visit is early morning around sunrise</li>}
                {attraction.id === 2 && <li>Wear comfortable walking shoes for exploring narrow streets</li>}
                {attraction.id === 3 && <li>Show respect when visiting this sacred place</li>}
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HanoiAttractionCard;