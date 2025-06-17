// src/components/common/ContactInfo.tsx
import React, { useState } from 'react';
import { Button, Modal, Tooltip, message } from 'antd';
import { PhoneOutlined, MailOutlined, GlobalOutlined, CloseOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Social Media Icons (Real SVG icons)
const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

interface ContactInfoProps {
  trigger?: React.ReactNode;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ trigger }) => {
  useTranslation(['common']);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const contactData = [
    {
      id: 'website',
      label: 'Website',
      value: 'mosaicstore.vercel.app',
      link: 'https://mosaicstore.vercel.app/',
      icon: <GlobalOutlined className="text-xl" />,
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20',
      description: 'Khám phá bộ sưu tập đầy đủ'
    },
    {
      id: 'facebook',
      label: 'Facebook',
      value: 'mosaicstore.story',
      link: 'https://www.facebook.com/mosaicstore.story',
      icon: <FacebookIcon />,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      description: 'Cập nhật tin tức mới nhất'
    },
    {
      id: 'instagram',
      label: 'Instagram',
      value: 'mosaicstore.story',
      link: 'https://www.instagram.com/mosaicstore.story/',
      icon: <InstagramIcon />,
      color: 'from-pink-500 via-red-500 to-yellow-500',
      bgColor: 'bg-gradient-to-r from-pink-50 via-red-50 to-yellow-50 dark:from-pink-900/20 dark:via-red-900/20 dark:to-yellow-900/20',
      description: 'Ảnh sản phẩm & behind the scenes'
    },
    {
      id: 'email',
      label: 'Email',
      value: 'mosaic.threadsstory@gmail.com',
      link: 'mailto:mosaic.threadsstory@gmail.com',
      icon: <MailOutlined className="text-xl" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      description: 'Liên hệ hỗ trợ & hợp tác'
    },
    {
      id: 'phone',
      label: 'Hotline',
      value: '0833 223 299',
      link: 'tel:+84833223299',
      icon: <PhoneOutlined className="text-xl" />,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      description: 'Hỗ trợ trực tiếp 24/7'
    }
  ];

  const handleContactClick = (item: typeof contactData[0]) => {
    window.open(item.link, '_blank');
    message.success(`Đang mở ${item.label}...`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    message.success(`Đã copy ${label}!`);
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const floatingParticles = Array.from({ length: 15 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute text-2xl opacity-10"
      style={{
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
      }}
      animate={{
        y: [0, -20, 0],
        x: [0, Math.sin(i * 0.5) * 10, 0],
        rotate: [0, 360],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration: Math.random() * 4 + 4,
        repeat: Infinity,
        delay: Math.random() * 2,
        ease: "easeInOut"
      }}
    >
      {['🌟', '✨', '💎', '🎯', '🚀', '💫'][i % 6]}
    </motion.div>
  ));

  return (
    <>
      <div 
        onClick={() => setIsModalVisible(true)}
        className="cursor-pointer"
      >
        {trigger || (
          <Button
            type="text"
            className="text-inherit hover:text-primary transition-colors duration-300"
          >
            Liên hệ
          </Button>
        )}
      </div>

      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        closable={false}
        width={680}
        className="contact-modal"
        style={{ top: 20 }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
      >
        <AnimatePresence>
          {isModalVisible && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative overflow-hidden"
            >
              {/* Background particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {floatingParticles}
              </div>

              {/* Close button */}
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setIsModalVisible(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center"
              />

              {/* Header */}
              <motion.div 
                className="text-center mb-8 relative z-10"
                variants={itemVariants}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-purple-600 rounded-full mb-4 shadow-2xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-3xl text-white">🧩</span>
                </motion.div>
                
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                  MOSAIC - Startup Story
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed text-sm px-4">
                  Câu chuyện khởi nghiệp với sứ mệnh mang văn hóa Việt Nam đến với thế giới qua từng sản phẩm thủ công tinh tế
                </p>
              </motion.div>

              {/* Contact Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10"
                variants={itemVariants}
              >
                {contactData.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.02,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setHoveredItem(item.id)}
                    onHoverEnd={() => setHoveredItem(null)}
                    className={`${item.bgColor} p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 cursor-pointer group transition-all duration-300 hover:shadow-xl relative overflow-hidden`}
                    onClick={() => handleContactClick(item)}
                  >
                    {/* Hover effect overlay */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />

                    {/* Shimmer effect */}
                    {hoveredItem === item.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />
                    )}

                    <div className="flex items-start space-x-3 relative z-10">
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-white shadow-lg flex-shrink-0`}
                        animate={{
                          scale: hoveredItem === item.id ? 1.1 : 1,
                          rotate: hoveredItem === item.id ? 5 : 0
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.icon}
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                            {item.label}
                          </h3>
                          <Tooltip title="Copy">
                            <Button
                              type="text"
                              size="small"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/50 text-xs w-6 h-6 p-0 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(
                                  item.id === 'phone' ? '0833223299' : 
                                  item.id === 'email' ? item.value :
                                  item.value,
                                  item.label
                                );
                              }}
                            >
                              📋
                            </Button>
                          </Tooltip>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-1 break-words">
                          {item.value}
                        </p>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Corner decoration */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-primary to-purple-600 rounded-full opacity-20 group-hover:opacity-60 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Footer */}
              <motion.div 
                className="text-center mt-8 relative z-10"
                variants={itemVariants}
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block mb-3"
                  >
                    <span className="text-2xl">🎯</span>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Kết nối cùng chúng tôi!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 px-4">
                    Hãy là một phần của hành trình mang văn hóa Việt Nam ra thế giới. 
                    <br className="hidden sm:block" />
                    Mỗi sản phẩm là một câu chuyện, mỗi khách hàng là một người bạn.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      <style>{`
        .contact-modal .ant-modal-content {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .dark .contact-modal .ant-modal-content {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        }

        .contact-modal .ant-modal-body {
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .contact-modal .ant-modal-body {
            padding: 1.5rem;
          }
          
          .contact-modal .ant-modal {
            margin: 0;
            max-width: calc(100vw - 32px);
          }
        }

        @media (max-width: 480px) {
          .contact-modal .ant-modal-body {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default ContactInfo;