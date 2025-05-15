import React from 'react';
import { Typography, Tag } from 'antd';
import { motion } from 'framer-motion';
import { EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface DestinationHeaderProps {
  title: string;
  subtitle: string;
}

const DestinationHeader: React.FC<DestinationHeaderProps> = ({ title, subtitle }) => {
  const { t } = useTranslation(['destination', 'common']);
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full relative z-10 text-white text-center">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-4xl"
      >
        <motion.div variants={item}>
          <Tag 
            color="blue" 
            icon={<GlobalOutlined />} 
            className="mb-4 px-3 py-1 rounded-full text-sm font-medium"
          >
            {t('destination:vietnam')}
          </Tag>
        </motion.div>
        
        <motion.div variants={item}>
          <Title 
            level={1} 
            className="text-4xl md:text-6xl text-white font-bold mb-4"
          >
            {title}
          </Title>
        </motion.div>
        
        <motion.div variants={item}>
          <Text 
            className="text-xl md:text-2xl text-white opacity-90 mb-8 block"
          >
            {subtitle}
          </Text>
        </motion.div>
        
        <motion.div variants={item} className="flex justify-center">
          <div className="flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-md rounded-full">
            <EnvironmentOutlined className="text-white mr-2" />
            <Text className="text-white">
              {t('destination:central_vietnam')}
            </Text>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DestinationHeader;
