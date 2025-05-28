import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Card, Tooltip } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloseOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  CoffeeOutlined,
  ShopOutlined,
  CarOutlined,
  LeftOutlined,
  RightOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface HanoiTourGuideStepsProps {
  onClose: () => void;
}

const HanoiTourGuideSteps: React.FC<HanoiTourGuideStepsProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation(['destinationhanoi', 'common']);
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);

  // Save that the user has seen the tour guide
  useEffect(() => {
    localStorage.setItem('hanoiTourGuideShown', 'true');
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const steps = [
    {
      icon: <InfoCircleOutlined />,
      title: t('tour_guide.steps.welcome.title'),
      content: (
        <div className="text-center py-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
            <EnvironmentOutlined className="text-4xl text-yellow-600" />
          </div>
          <Paragraph className="dark:text-gray-300">
            {t('tour_guide.steps.welcome.content')}
          </Paragraph>
        </div>
      ),
    },
    {
      icon: <PictureOutlined />,
      title: t('tour_guide.steps.attractions.title'),
      content: (
        <div className="py-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <img 
              src="/assets/destinations/hanoi/hoan-kiem-lake.jpg" 
              alt="Hoan Kiem Lake" 
              className="w-full md:w-1/2 h-48 object-cover rounded-lg shadow-md"
            />
            <div>
              <Title level={5} className="dark:text-white text-yellow-700">
                {t('tour_guide.steps.attractions.highlight')}
              </Title>
              <Paragraph className="dark:text-gray-300">
                {t('tour_guide.steps.attractions.content')}
              </Paragraph>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <CoffeeOutlined />,
      title: t('tour_guide.steps.food.title'),
      content: (
        <div className="py-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <img 
                src="/assets/destinations/hanoi/food-1.jpg" 
                alt="Pho Bo" 
                className="w-full h-32 object-cover rounded-lg shadow-sm"
              />
              <p className="text-center font-medium dark:text-white text-sm">Phở Bò</p>
            </div>
            <div className="space-y-2">
              <img 
                src="/assets/destinations/hanoi/food-2.jpg" 
                alt="Bun Cha" 
                className="w-full h-32 object-cover rounded-lg shadow-sm"
              />
              <p className="text-center font-medium dark:text-white text-sm">Bún Chả</p>
            </div>
          </div>
          <Paragraph className="dark:text-gray-300">
            {t('tour_guide.steps.food.content')}
          </Paragraph>
        </div>
      ),
    },
    {
      icon: <ShopOutlined />,
      title: t('tour_guide.steps.shopping.title'),
      content: (
        <div className="py-4">
          <Paragraph className="dark:text-gray-300 mb-4">
            {t('tour_guide.steps.shopping.content')}
          </Paragraph>
          <div className="grid grid-cols-3 gap-2">
            <div className="border border-yellow-200 rounded-lg p-2 text-center hover:bg-yellow-50 transition-colors">
              <ShopOutlined className="text-xl text-yellow-600 mb-1" />
              <p className="text-xs dark:text-gray-300">Dong Xuan Market</p>
            </div>
            <div className="border border-yellow-200 rounded-lg p-2 text-center hover:bg-yellow-50 transition-colors">
              <ShopOutlined className="text-xl text-yellow-600 mb-1" />
              <p className="text-xs dark:text-gray-300">Old Quarter</p>
            </div>
            <div className="border border-yellow-200 rounded-lg p-2 text-center hover:bg-yellow-50 transition-colors">
              <ShopOutlined className="text-xl text-yellow-600 mb-1" />
              <p className="text-xs dark:text-gray-300">Vincom Center</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <CarOutlined />,
      title: t('tour_guide.steps.transport.title'),
      content: (
        <div className="py-4">
          <Paragraph className="dark:text-gray-300">
            {t('tour_guide.steps.transport.content')}
          </Paragraph>
          <div className="flex flex-wrap gap-2 mt-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 px-3 py-1 rounded-full text-sm border border-yellow-200 dark:border-yellow-700">
                {t(`tour_guide.steps.transport.options.${index}`)}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <HeartOutlined />,
      title: t('tour_guide.steps.conclusion.title'),
      content: (
        <div className="text-center py-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">🎉</span>
          </div>
          <Title level={4} className="dark:text-white mb-4 text-green-600">
            {t('tour_guide.steps.conclusion.content_title')}
          </Title>
          <Paragraph className="dark:text-gray-300">
            {t('tour_guide.steps.conclusion.content')}
          </Paragraph>
        </div>
      ),
    },
  ];

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 }
  };

  // Custom step navigator with enhanced styling
  const renderCustomSteps = () => (
    <div className="flex justify-center items-center mb-6">
      <div className="flex bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 p-1 rounded-full border border-yellow-200 dark:border-yellow-700">
        {steps.map((step, index) => (
          <Tooltip key={index} title={step.title}>
            <button
              onClick={() => setCurrentStep(index)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 mx-1
                ${currentStep === index 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg transform scale-110' 
                  : 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-800'
                }`}
            >
              {step.icon}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-yellow-200 dark:border-yellow-700"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10"
              onClick={handleClose}
            >
              <CloseOutlined />
            </button>

            <div className="mb-6">
              <div className="text-center mb-8">
                <Title level={3} className="mb-2 dark:text-white text-yellow-700">
                  {i18n.language === 'vi' ? 'Hướng dẫn du lịch Hà Nội' : 'Hanoi Tour Guide'}
                </Title>
                <Paragraph className="text-gray-500 dark:text-gray-400">
                  {t('tour_guide.subtitle')}
                </Paragraph>
              </div>

              {/* Enhanced step navigator */}
              {renderCustomSteps()}
            </div>

            <Card className="mt-6 mb-6 border-yellow-200 dark:border-yellow-700">
              <div className="min-h-[200px]">
                <Title level={4} className="mb-4 border-b pb-2 dark:text-white border-yellow-200 dark:border-yellow-700 text-yellow-700">
                  {steps[currentStep].title} 
                  <span className="text-gray-400 text-base ml-2 font-normal">
                    {currentStep + 1}/{steps.length}
                  </span>
                </Title>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {steps[currentStep].content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Card>

            <div className="flex justify-between">
              <Button
                onClick={handlePrev}
                disabled={currentStep === 0}
                icon={<LeftOutlined />}
                className="border-yellow-300 text-yellow-600 hover:bg-yellow-50 disabled:opacity-50"
              >
                {t('common:actions.previous')}
              </Button>
              <Button
                type="primary"
                onClick={handleNext}
                icon={currentStep < steps.length - 1 ? <RightOutlined /> : undefined}
                iconPosition="end"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 border-none hover:from-yellow-600 hover:to-orange-600"
              >
                {currentStep < steps.length - 1
                  ? t('common:actions.next')
                  : t('common:actions.finish')}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HanoiTourGuideSteps;