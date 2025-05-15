import React, { useState } from 'react';
import { Card, Typography, Tooltip, Rate, Badge, Modal } from 'antd';
import { motion } from 'framer-motion';
import { 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  ExpandOutlined,
  StarFilled 
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

interface AttractionCardProps {
  attraction: Attraction;
  language: string;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction, language }) => {
  const { t } = useTranslation(['destination', 'common']);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Determine the name and description based on language
  const displayName = language === 'vi' ? attraction.nameVi : attraction.name;
  const displayDescription = language === 'vi' ? attraction.descriptionVi : attraction.description;

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Badge.Ribbon 
          text={`${attraction.rating}/5`} 
          color="orange"
        >
          <Card 
            hoverable 
            className="h-full overflow-hidden"
            cover={
              <div className="relative h-48 overflow-hidden group">
                <img 
                  src={attraction.image} 
                  alt={displayName} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Tooltip title={t('common:actions.view_details')}>
                    <button 
                      className="w-10 h-10 rounded-full bg-white bg-opacity-80 flex items-center justify-center"
                      onClick={showModal}
                    >
                      <ExpandOutlined className="text-primary" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            }
            onClick={showModal}
          >
            <Title level={5} className="mb-2 dark:text-white">
              {displayName}
            </Title>
            
            <div className="flex items-center mb-2">
              <Rate 
                disabled 
                defaultValue={attraction.rating} 
                allowHalf 
                className="text-sm"
              />
              <Text className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                ({attraction.rating})
              </Text>
            </div>
            
            <div className="flex items-center mb-2">
              <EnvironmentOutlined className="text-primary mr-2" />
              <Text className="text-gray-600 dark:text-gray-300 text-sm">
                {attraction.location}
              </Text>
            </div>
            
            <div className="flex items-center mb-3">
              <ClockCircleOutlined className="text-primary mr-2" />
              <Text className="text-gray-600 dark:text-gray-300 text-sm">
                {attraction.duration}
              </Text>
            </div>
            
            <Paragraph 
              ellipsis={{ rows: 2 }} 
              className="text-gray-600 dark:text-gray-300 text-sm"
            >
              {displayDescription}
            </Paragraph>
          </Card>
        </Badge.Ribbon>
      </motion.div>
      
      <Modal
        title={
          <div className="flex items-center">
            <Title level={4} className="m-0 dark:text-white">
              {displayName}
            </Title>
            <div className="ml-auto flex items-center">
              <StarFilled className="text-yellow-500 mr-1" />
              <Text strong>{attraction.rating}</Text>
            </div>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        className="attraction-modal"
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
              <Title level={5} className="dark:text-white">
                {t('destination:about')}
              </Title>
              <Paragraph className="dark:text-gray-300">
                {displayDescription}
              </Paragraph>
            </div>
            
            <div className="mb-4">
              <Title level={5} className="dark:text-white">
                {t('destination:location')}
              </Title>
              <div className="flex items-center">
                <EnvironmentOutlined className="text-primary mr-2" />
                <Text className="dark:text-gray-300">
                  {attraction.location}
                </Text>
              </div>
            </div>
            
            <div className="mb-4">
              <Title level={5} className="dark:text-white">
                {t('destination:suggested_duration')}
              </Title>
              <div className="flex items-center">
                <ClockCircleOutlined className="text-primary mr-2" />
                <Text className="dark:text-gray-300">
                  {attraction.duration}
                </Text>
              </div>
            </div>
            
            <div className="mb-4">
              <Title level={5} className="dark:text-white">
                {t('destination:tips')}
              </Title>
              <ul className="list-disc list-inside dark:text-gray-300">
                <li>{t('destination:attractions.tips.1')}</li>
                <li>{t('destination:attractions.tips.2')}</li>
                <li>{t('destination:attractions.tips.3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AttractionCard;
