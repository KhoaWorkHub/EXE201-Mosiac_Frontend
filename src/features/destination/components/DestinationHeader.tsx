import React from 'react';
import { Typography, Button } from 'antd';
import { ShareAltOutlined, HeartOutlined, BookOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface DestinationHeaderProps {
  title: string;
  subtitle: string;
  onShare?: () => void;
  onSave?: () => void;
  onStartTour?: () => void;
}

const DestinationHeader: React.FC<DestinationHeaderProps> = ({
  title,
  subtitle,
  onShare,
  onSave,
  onStartTour
}) => {
  const { t } = useTranslation(['common']);

  return (
    <div className="absolute inset-0 flex items-center justify-center text-white z-10">
      <div className="text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <Title level={1} className="text-white mb-4 text-4xl md:text-6xl lg:text-7xl font-bold">
            {title}
          </Title>
          <Text className="text-lg md:text-xl lg:text-2xl text-gray-200 block">
            {subtitle}
          </Text>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            type="primary"
            size="large"
            onClick={onStartTour}
            className="bg-white text-gray-900 border-none hover:bg-gray-100 font-bold px-8 py-3 h-auto text-lg"
          >
            <BookOutlined className="mr-2" />
            {t('actions.start_tour')}
          </Button>
          
          <div className="flex gap-3">
            <Button
              type="default"
              size="large"
              onClick={onSave}
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
            >
              <HeartOutlined />
            </Button>
            
            <Button
              type="default"
              size="large"
              onClick={onShare}
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
            >
              <ShareAltOutlined />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationHeader;