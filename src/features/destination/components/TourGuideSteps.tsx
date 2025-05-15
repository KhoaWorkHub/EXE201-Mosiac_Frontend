import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Steps, Typography, Card } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloseOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  CoffeeOutlined,
  ShopOutlined,
  CarOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Step } = Steps;

interface TourGuideStepsProps {
  onClose: () => void;
}

const TourGuideSteps: React.FC<TourGuideStepsProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation(['destination', 'common']);
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save that the user has seen the tour guide
  useEffect(() => {
    localStorage.setItem('tourGuideShown', 'true');
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
      title: t('destination:tour_guide.steps.welcome.title'),
      description: t('destination:tour_guide.steps.welcome.description'),
      content: (
        <div className="text-center py-4">
          <div className="w-24 h-24 rounded-full bg-primary bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
            <EnvironmentOutlined className="text-4xl text-primary" />
          </div>
          <Paragraph className="dark:text-gray-300">
            {t('destination:tour_guide.steps.welcome.content')}
          </Paragraph>
        </div>
      ),
    },
    {
      icon: <PictureOutlined />,
      title: t('destination:tour_guide.steps.attractions.title'),
      description: t('destination:tour_guide.steps.attractions.description'),
      content: (
        <div className="py-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <img 
              src="/assets/destinations/danang/golden-bridge.jpg" 
              alt="Golden Bridge" 
              className="w-full md:w-1/2 h-48 object-cover rounded-lg"
            />
            <div>
              <Title level={5} className="dark:text-white">
                {t('destination:tour_guide.steps.attractions.highlight')}
              </Title>
              <Paragraph className="dark:text-gray-300">
                {t('destination:tour_guide.steps.attractions.content')}
              </Paragraph>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <CoffeeOutlined />,
      title: t('destination:tour_guide.steps.food.title'),
      description: t('destination:tour_guide.steps.food.description'),
      content: (
        <div className="py-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <img 
                src="/assets/destinations/danang/food-1.jpg" 
                alt="Mi Quang" 
                className="w-full h-32 object-cover rounded-lg"
              />
              <p className="text-center font-medium dark:text-white">Mi Quang</p>
            </div>
            <div className="space-y-2">
              <img 
                src="/assets/destinations/danang/food-2.jpg" 
                alt="Banh Xeo" 
                className="w-full h-32 object-cover rounded-lg"
              />
              <p className="text-center font-medium dark:text-white">Banh Xeo</p>
            </div>
          </div>
          <Paragraph className="dark:text-gray-300">
            {t('destination:tour_guide.steps.food.content')}
          </Paragraph>
        </div>
      ),
    },
    {
      icon: <ShopOutlined />,
      title: t('destination:tour_guide.steps.shopping.title'),
      description: t('destination:tour_guide.steps.shopping.description'),
      content: (
        <div className="py-4">
          <Paragraph className="dark:text-gray-300 mb-4">
            {t('destination:tour_guide.steps.shopping.content')}
          </Paragraph>
          <div className="grid grid-cols-3 gap-2">
            <div className="border rounded-lg p-2 text-center">
              <ShopOutlined className="text-xl text-primary mb-1" />
              <p className="text-xs dark:text-gray-300">Han Market</p>
            </div>
            <div className="border rounded-lg p-2 text-center">
              <ShopOutlined className="text-xl text-primary mb-1" />
              <p className="text-xs dark:text-gray-300">Vincom Plaza</p>
            </div>
            <div className="border rounded-lg p-2 text-center">
              <ShopOutlined className="text-xl text-primary mb-1" />
              <p className="text-xs dark:text-gray-300">Con Market</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <CarOutlined />,
      title: t('destination:tour_guide.steps.transport.title'),
      description: t('destination:tour_guide.steps.transport.description'),
      content: (
        <div className="py-4">
          <Paragraph className="dark:text-gray-300">
            {t('destination:tour_guide.steps.transport.content')}
          </Paragraph>
          <div className="flex flex-wrap gap-2 mt-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                {t(`destination:tour_guide.steps.transport.options.${index}`)}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <InfoCircleOutlined />,
      title: t('destination:tour_guide.steps.conclusion.title'),
      description: t('destination:tour_guide.steps.conclusion.description'),
      content: (
        <div className="text-center py-4">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">🎉</span>
          </div>
          <Title level={4} className="dark:text-white mb-4">
            {t('destination:tour_guide.steps.conclusion.content_title')}
          </Title>
          <Paragraph className="dark:text-gray-300">
            {t('destination:tour_guide.steps.conclusion.content')}
          </Paragraph>
        </div>
      ),
    },
  ];

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              onClick={handleClose}
            >
              <CloseOutlined />
            </button>

            <div className="mb-6">
              <div className="text-center mb-8">
                <Title level={3} className="mb-2 dark:text-white">
                  {i18n.language === 'vi' ? 'Hướng dẫn du lịch Đà Nẵng' : 'Da Nang Tour Guide'}
                </Title>
                <Paragraph className="text-gray-500 dark:text-gray-400">
                  {t('destination:tour_guide.subtitle')}
                </Paragraph>
              </div>

              <Steps 
                current={currentStep} 
                direction={isMobile ? "vertical" : "horizontal"}
                size={isMobile ? "small" : "default"}
              >
                {steps.map((step) => (
                  <Step key={step.title} title={step.title} icon={step.icon} />
                ))}
              </Steps>
            </div>

            <Card className="mt-6 mb-6">
              <div className="min-h-[200px]">
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
              >
                {t('common:actions.previous')}
              </Button>
              <Button
                type="primary"
                onClick={handleNext}
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

export default TourGuideSteps;
