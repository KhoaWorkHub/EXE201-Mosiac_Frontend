import React, { useState } from "react";
import { Modal, Button } from "antd";
import { motion } from "framer-motion";
import { ExpandOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface PhotoGalleryProps {
  city: string;
  inView: boolean;
}

// Define images for each city
const cityImages: Record<string, string[]> = {
  quangninh: [
    `/assets/destinations/quangninh/Chùa Yên Tử 2.jpg`,
    `/assets/destinations/quangninh/Chùa Ba Vàng 2.jpg`,
    `/assets/destinations/quangninh/Đảo Cô tô 1.jpg`,
    `/assets/destinations/quangninh/sontra.png`,
    `/assets/destinations/quangninh/bai-tu-long-bay.jpg`,
    `/assets/destinations/quangninh/daotiptop.png`,
    `/assets/destinations/quangninh/Chùa Lôi Âm 1.webp`,
    `/assets/destinations/quangninh/Vịnh Hạ Long 1.jpeg`,
  ],
  khanhhoa: [
    `/assets/destinations/khanhhoa/yang-bay-waterfall.jpg`,
    `/assets/destinations/khanhhoa/vinpearl-land.jpg`,
    `/assets/destinations/khanhhoa/po-nagar-towers.jpg`,
    `/assets/destinations/khanhhoa/nha-trang-beach.jpg`,
    `/assets/destinations/khanhhoa/mud-bath.jpg`,
    `/assets/destinations/khanhhoa/island-hopping.jpg`,
    `/assets/destinations/khanhhoa/nhatrang.png`,
    `/assets/destinations/khanhhoa/biennhatrang.png`,
  ],
  hcm: [
    `/assets/destinations/hcm/ben-thanh-market.jpg`,
    `/assets/destinations/hcm/landmark-81.jpg`,
    `/assets/destinations/hcm/independence-palace.jpg`,
    `/assets/destinations/hcm/war-remnants-museum.jpg`,
    `/assets/destinations/hcm/notre-dame-cathedral.jpg`,
    `/assets/destinations/hcm/central-post-office.jpg`,
    `/assets/destinations/hcm/caphe.png`,
    `/assets/destinations/hcm/goicuon.png`,
  ],
  danang: [
    "/assets/destinations/danang/my-khe-beach.jpg",
    `/assets/destinations/danang/son-tra.jpg`,
    `/assets/destinations/danang/my-khe-beach.jpg`,
    `/assets/destinations/danang/danangcity.jpg`,
    `/assets/destinations/danang/golden-bridge.jpg`,
    `/assets/destinations/danang/danangoverview.jpg`,
    `/assets/destinations/danang/hai-van-pass.jpg`,
    `/assets/destinations/danang/marble-mountains.jpg`,
  ],
  hanoi: [
    '/assets/destinations/hanoi/hoan-kiem-lake.jpg',
    '/assets/destinations/hanoi/old-quarter.jpg',
    '/assets/destinations/hanoi/temple-literature.jpg',
    '/assets/destinations/hanoi/ho-chi-minh-mausoleum.jpg',
    '/assets/destinations/hanoi/one-pillar-pagoda.jpg',
    '/assets/destinations/hanoi/opera-house.jpg',
    `/assets/destinations/hanoi/hanoihohoankiem.jpg`,
    `/assets/destinations/hanoi/hanoicity.jpg`,
  ],
  // Add more cities as needed
};

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ city, inView }) => {
  const { t } = useTranslation(["destinationdanang", "common"]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Get images for the specific city, fallback to empty array if city not found
  const galleryImages = cityImages[city.toLowerCase()] || [];

  // If no images available for this city, don't render anything
  if (galleryImages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          {t(
            "common:no_images_available",
            "No images available for this destination."
          )}
        </p>
      </div>
    );
  }

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
    setCurrentImage(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Dynamic grid layout based on number of images
  const getGridLayout = (imageCount: number, index: number) => {
    if (imageCount >= 8) {
      // For 8+ images, use the original layout with featured images
      return index === 0 || index === 3 ? "md:col-span-2 md:row-span-2" : "";
    } else if (imageCount >= 6) {
      // For 6-7 images, make first image featured
      return index === 0 ? "md:col-span-2 md:row-span-2" : "";
    } else {
      // For fewer images, use simple grid
      return "";
    }
  };

  // Get image height based on layout
  const getImageHeight = (imageCount: number, index: number) => {
    if (imageCount >= 8 && (index === 0 || index === 3)) {
      return "300px";
    } else if (imageCount >= 6 && index === 0) {
      return "300px";
    }
    return "150px";
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
            className={`relative overflow-hidden rounded-lg ${getGridLayout(
              galleryImages.length,
              index
            )}`}
          >
            <div
              className="group cursor-pointer w-full h-full"
              onClick={() => openModal(index)}
            >
              <img
                src={image}
                alt={`${city} photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{
                  minHeight: getImageHeight(galleryImages.length, index),
                }}
                onError={(e) => {
                  // Hide broken images
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                loading="lazy"
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
            alt={`${city} photo ${currentImage + 1}`}
            className="w-full h-full object-contain"
          />

          <Button
            type="primary"
            shape="circle"
            icon={<LeftOutlined />}
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100"
            disabled={galleryImages.length <= 1}
          />

          <Button
            type="primary"
            shape="circle"
            icon={<RightOutlined />}
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100"
            disabled={galleryImages.length <= 1}
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
