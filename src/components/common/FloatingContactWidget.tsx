import React, { useState } from 'react';
import { Button, Tooltip, Badge } from 'antd';
import { 
  PhoneOutlined, 
  MessageOutlined, 
  CloseOutlined,
  FacebookOutlined,
  WechatOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import ContactInfo from './ContactInfo';

interface ContactOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string;
  gradient: string;
  action: () => void;
}

const FloatingContactWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const contactOptions: ContactOption[] = [
    {
      id: 'phone',
      icon: <PhoneOutlined className="text-lg" />,
      label: 'Gọi ngay - 0833 223 299',
      href: 'tel:+84833223299',
      color: '#52c41a',
      gradient: 'from-green-500 to-emerald-600',
      action: () => window.open('tel:+84833223299', '_self')
    },
    {
      id: 'zalo',
      icon: <WechatOutlined className="text-lg" />,
      label: 'Chat Zalo',
      href: 'https://zalo.me/0833223299',
      color: '#1890ff',
      gradient: 'from-blue-500 to-cyan-600',
      action: () => window.open('https://zalo.me/0833223299', '_blank')
    },
    {
      id: 'facebook',
      icon: <FacebookOutlined className="text-lg" />,
      label: 'Facebook Messenger',
      href: 'https://m.me/mosaicstore.story',
      color: '#1877f2',
      gradient: 'from-blue-600 to-blue-700',
      action: () => window.open('https://m.me/mosaicstore.story', '_blank')
    },
    {
      id: 'email',
      icon: <MailOutlined className="text-lg" />,
      label: 'Email hỗ trợ',
      href: 'mailto:mosaic.threadsstory@gmail.com',
      color: '#722ed1',
      gradient: 'from-purple-500 to-indigo-600',
      action: () => window.open('mailto:mosaic.threadsstory@gmail.com', '_self')
    },
    {
      id: 'contact',
      icon: <MessageOutlined className="text-lg" />,
      label: 'Thông tin liên hệ',
      href: '#',
      color: '#fa8c16',
      gradient: 'from-orange-500 to-red-600',
      action: () => setShowContactModal(true)
    }
  ];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionClick = (option: ContactOption) => {
    option.action();
    setIsExpanded(false);
  };

  // Animation variants
  const mainButtonVariants = {
    hover: { 
      scale: 1.1,
      boxShadow: "0 20px 40px rgba(24, 144, 255, 0.3)"
    },
    tap: { scale: 0.95 }
  };

  const optionVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      x: 20,
      transition: { duration: 0.2 }
    },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }),
    exit: {
      opacity: 0,
      scale: 0.8,
      x: 20,
      transition: { duration: 0.2 }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.3, 1],
      opacity: [0.7, 0.3, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Contact Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        {/* Contact Options */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className="flex flex-col space-y-3"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {contactOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  variants={optionVariants}
                  custom={index}
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Tooltip title={option.label} placement="left">
                    <Button
                      className={`
                        h-12 px-4 rounded-full shadow-lg border-0 text-white font-medium
                        bg-gradient-to-r ${option.gradient}
                        hover:shadow-xl transition-all duration-300
                        flex items-center space-x-2 min-w-max
                      `}
                      onClick={() => handleOptionClick(option)}
                      style={{ 
                        background: `linear-gradient(135deg, ${option.color}, ${option.color}dd)`,
                        border: 'none'
                      }}
                    >
                      {option.icon}
                      <span className="hidden sm:inline text-sm">{option.label}</span>
                    </Button>
                  </Tooltip>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <div className="relative">
          {/* Pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500 opacity-30"
            variants={pulseVariants}
            animate="pulse"
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500 opacity-20"
            variants={pulseVariants}
            animate="pulse"
            style={{ animationDelay: '0.5s' }}
          />
          
          {/* Badge for notifications */}
          <Badge count={isExpanded ? 0 : '💬'} offset={[-8, 8]}>
            <motion.div
              variants={mainButtonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                type="primary"
                shape="circle"
                size="large"
                className="w-16 h-16 shadow-2xl border-0 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                onClick={toggleExpanded}
                style={{
                  background: 'linear-gradient(135deg, #1890ff, #52c41a)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isExpanded ? (
                    <CloseOutlined className="text-xl text-white" />
                  ) : (
                    <MessageOutlined className="text-xl text-white" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
          </Badge>

          {/* Minimize button */}
          <motion.div
            className="absolute -top-2 -left-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <Tooltip title="Ẩn widget" placement="left">
              <Button
                type="text"
                size="small"
                shape="circle"
                className="w-6 h-6 bg-gray-800/70 hover:bg-gray-800/90 text-white border-0 shadow-lg backdrop-blur-sm"
                onClick={() => setIsVisible(false)}
              >
                <CloseOutlined className="text-xs" />
              </Button>
            </Tooltip>
          </motion.div>
        </div>

        {/* Quick action tooltip */}
        {!isExpanded && (
          <motion.div
            className="absolute -top-2 right-20 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm shadow-lg"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            style={{ display: 'none' }} // Will show after 3 seconds via animation
          >
            Cần hỗ trợ? Click để chat!
            <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45" />
          </motion.div>
        )}
      </div>

      {/* Contact Info Modal */}
      {showContactModal && (
        <ContactInfo
          trigger={null}
        />
      )}

      {/* Restore widget button when hidden */}
      {!isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Tooltip title="Hiện widget liên hệ" placement="left">
            <Button
              type="primary"
              shape="circle"
              size="small"
              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 shadow-lg border-0"
              onClick={() => setIsVisible(true)}
            >
              <MessageOutlined className="text-sm" />
            </Button>
          </Tooltip>
        </motion.div>
      )}

      {/* Mobile-specific styles */}
      <style>{`
        @media (max-width: 768px) {
          .floating-contact-widget {
            bottom: 80px !important;
            right: 16px !important;
          }
          
          .floating-contact-widget .contact-option {
            min-width: auto !important;
          }
          
          .floating-contact-widget .contact-option span {
            display: none !important;
          }
        }
        
        @media (max-width: 480px) {
          .floating-contact-widget {
            bottom: 70px !important;
            right: 12px !important;
          }
          
          .floating-contact-widget .main-button {
            width: 56px !important;
            height: 56px !important;
          }
          
          .floating-contact-widget .contact-option {
            height: 48px !important;
            padding: 0 12px !important;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingContactWidget;