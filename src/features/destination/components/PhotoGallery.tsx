import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { motion } from 'framer-motion';
import { ExpandOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface PhotoGalleryProps {
  city: string;
  inView: boolean;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ city, inView }) => {
  useTranslation(['destination']);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  
  // Simulated gallery images - in production, these would come from an API
  const galleryImages = [
    `/assets/destinations/${city}/gallery-1.jpg`,
    `/assets/destinations/${city}/gallery-2.jpg`,
    `/assets/destinations/${city}/gallery-3.jpg`,
    `/assets/destinations/${city}/gallery-4.jpg`,
    `/assets/destinations/${city}/gallery-5.jpg`,
    `/assets/destinations/${city}/gallery-6.jpg`,
    `/assets/destinations/${city}/gallery-7.jpg`,
    `/assets/destinations/${city}/gallery-8.jpg`,
  ];
  
  const openModal = (index: number) => {
    setCurrentImage(index);
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
  };
  
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % galleryImages.length);
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {galleryImages.map((image, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`relative overflow-hidden rounded-lg ${
              index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : ''
            }`}
          >
            <div 
              className="group cursor-pointer w-full h-full"
              onClick={() => openModal(index)}
            >
              <img
                src={image}
                alt={`Da Nang photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ minHeight: index === 0 || index === 3 ? '300px' : '150px' }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center">
                  <ExpandOutlined className="text-primary" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <Modal
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
        width="80%"
        centered
        className="photo-gallery-modal"
        bodyStyle={{ padding: 0 }}
      >
        <div className="relative h-screen max-h-[80vh]">
          <img 
            src={galleryImages[currentImage]} 
            alt={`Da Nang photo ${currentImage + 1}`} 
            className="w-full h-full object-contain"
          />
          
          <Button
            type="primary"
            shape="circle"
            icon={<LeftOutlined />}
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100"
          />
          
          <Button
            type="primary"
            shape="circle"
            icon={<RightOutlined />}
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100"
          />
          
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="bg-black bg-opacity-50 text-white inline-block px-4 py-1 rounded-full">
              {currentImage + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PhotoGallery;
