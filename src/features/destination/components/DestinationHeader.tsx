import React from 'react';
import { Typography, Button } from 'antd';
import { ShareAltOutlined, HeartOutlined, BookOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

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
  const { i18n } = useTranslation();

  return (
    <div className="absolute inset-0 flex items-center justify-center text-white z-10">
      <div className="text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          {/* Clean Title with Simple but Effective Visibility */}
          <div className="relative mb-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 relative">
              {/* Simple background for contrast */}
              <span className="relative inline-block">
                {/* Subtle background */}
                <span 
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl"
                  style={{
                    padding: '8px 16px',
                    margin: '-8px -16px',
                  }}
                ></span>
                
                {/* Clean text with moderate shadow */}
                <span 
                  className="relative text-white px-4 py-2 inline-block font-bold"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)'
                  }}
                >
                  {title}
                </span>
              </span>
            </h1>
          </div>
          
          {/* Enhanced Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="inline-block bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 shadow-xl">
              <Text 
                className="text-white text-lg md:text-xl lg:text-2xl font-medium block"
                style={{
                  textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)'
                }}
              >
                {subtitle}
              </Text>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Enhanced Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="primary"
              size="large"
              onClick={onStartTour}
              className="bg-gradient-to-r from-white to-gray-100 text-gray-900 border-none hover:from-gray-100 hover:to-white font-bold px-8 py-3 h-auto text-lg rounded-full shadow-xl"
            >
              <BookOutlined className="mr-2" />
              {i18n.language === 'vi' ? 'Bắt đầu tour' : 'Start Tour'}
            </Button>
          </motion.div>
          
          <div className="flex gap-3">
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
            >
              <Button
                type="default"
                size="large"
                onClick={onSave}
                className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm rounded-full shadow-lg"
              >
                <HeartOutlined />
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
            >
              <Button
                type="default"
                size="large"
                onClick={onShare}
                className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm rounded-full shadow-lg"
              >
                <ShareAltOutlined />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationHeader;