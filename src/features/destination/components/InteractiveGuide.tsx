import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Typography, Steps, Card } from 'antd';
import {
  CloseOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  CoffeeOutlined,
  ShopOutlined,
  CarOutlined,
  CheckOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

interface InteractiveGuideProps {
  guideId: string;
  onClose: () => void;
}

// This component replaces the current TourGuideSteps with a more contextual approach
const InteractiveGuide: React.FC<InteractiveGuideProps> = ({ guideId, onClose }) => {
  const { t } = useTranslation(['destinations/danang', 'destination']);
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

  const handleNext = () => {
    if (currentStep < getSteps().length - 1) {
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

  // Get steps based on guide ID
  const getSteps = () => {
    // Different steps for different guides
    switch (guideId) {
      case 'welcome':
        return [
          {
            icon: <InfoCircleOutlined />,
            title: t('destinations/danang:guides.welcome.steps.0.title'),
            content: (
              <div className="text-center py-4">
                <div className="w-24 h-24 rounded-full bg-primary bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
                  <CompassIcon className="text-4xl text-primary" />
                </div>
                <Paragraph className="dark:text-gray-300">
                  {t('destinations/danang:guides.welcome.steps.0.content')}
                </Paragraph>
              </div>
            ),
          },
          {
            icon: <InfoCircleOutlined />,
            title: t('destinations/danang:guides.welcome.steps.1.title'),
            content: (
              <div className="text-center py-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <img 
                    src="/assets/destinations/danang/golden-bridge.jpg" 
                    alt="Golden Bridge" 
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <img 
                    src="/assets/destinations/danang/dragon-bridge.jpg" 
                    alt="Dragon Bridge" 
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <Paragraph className="dark:text-gray-300">
                  {t('destinations/danang:guides.welcome.steps.1.content')}
                </Paragraph>
              </div>
            ),
          },
          {
            icon: <InfoCircleOutlined />,
            title: t('destinations/danang:guides.welcome.steps.2.title'),
            content: (
              <div className="text-center py-4">
                <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-4 flex items-center justify-center">
                  <CheckOutlined className="text-4xl text-green-500" />
                </div>
                <Title level={4} className="dark:text-white mb-4">
                  {t('destinations/danang:guides.welcome.steps.2.subtitle')}
                </Title>
                <Paragraph className="dark:text-gray-300">
                  {t('destinations/danang:guides.welcome.steps.2.content')}
                </Paragraph>
              </div>
            ),
          },
        ];
      
      case 'golden_bridge':
        return [
          {
            icon: <PictureOutlined />,
            title: t('destinations/danang:guides.golden_bridge.steps.0.title'),
            content: (
              <div className="py-4">
                <div className="mb-4">
                  <img 
                    src="/assets/destinations/danang/golden-bridge-aerial.jpg" 
                    alt="Golden Bridge Aerial View" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <Paragraph className="dark:text-gray-300">
                  {t('destinations/danang:guides.golden_bridge.steps.0.content')}
                </Paragraph>
              </div>
            ),
          },
          {
            icon: <InfoCircleOutlined />,
            title: t('destinations/danang:guides.golden_bridge.steps.1.title'),
            content: (
              <div className="py-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <img 
                      src="/assets/destinations/danang/golden-bridge-hands.jpg" 
                      alt="Golden Bridge Hands" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <img 
                      src="/assets/destinations/danang/golden-bridge-mist.jpg" 
                      alt="Golden Bridge in the Mist" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                </div>
                <Paragraph className="dark:text-gray-300">
                  {t('destinations/danang:guides.golden_bridge.steps.1.content')}
                </Paragraph>
              </div>
            ),
          },
          {
            icon: <EnvironmentOutlined />,
            title: t('destinations/danang:guides.golden_bridge.steps.2.title'),
            content: (
              <div className="py-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <Title level={5} className="mb-2 dark:text-white">
                    {t('destinations/danang:guides.golden_bridge.steps.2.location_title')}
                  </Title>
                  <Paragraph className="dark:text-gray-300 mb-0">
                    {t('destinations/danang:guides.golden_bridge.steps.2.location')}
                  </Paragraph>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Title level={5} className="mb-2 dark:text-white">
                      {t('destinations/danang:guides.golden_bridge.steps.2.hours_title')}
                    </Title>
                    <Paragraph className="dark:text-gray-300 mb-0">
                      {t('destinations/danang:guides.golden_bridge.steps.2.hours')}
                    </Paragraph>
                  </div>
                  <div>
                    <Title level={5} className="mb-2 dark:text-white">
                      {t('destinations/danang:guides.golden_bridge.steps.2.fee_title')}
                    </Title>
                    <Paragraph className="dark:text-gray-300 mb-0">
                      {t('destinations/danang:guides.golden_bridge.steps.2.fee')}
                    </Paragraph>
                  </div>
                </div>
              </div>
            ),
          },
        ];
      
      case 'mi_quang':
        return [
          {
            icon: <CoffeeOutlined />,
            title: t('destinations/danang:guides.mi_quang.steps.0.title'),
            content: (
              <div className="py-4">
                <div className="mb-4">
                  <img 
                    src="/assets/destinations/danang/mi-quang-full.jpg" 
                    alt="Mi Quang" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <Paragraph className="dark:text-gray-300">
                  {t('destinations/danang:guides.mi_quang.steps.0.content')}
                </Paragraph>
              </div>
            ),
          },
          {
            icon: <InfoCircleOutlined />,
            title: t('destinations/danang:guides.mi_quang.steps.1.title'),
            content: (
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {['noodles', 'broth', 'toppings', 'garnish'].map((item) => (
                    <div key={item} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <Title level={5} className="mb-1 text-sm dark:text-white">
                        {t(`destinations/danang:guides.mi_quang.steps.1.ingredients.${item}.name`)}
                      </Title>
                      <Text className="text-xs dark:text-gray-300">
                        {t(`destinations/danang:guides.mi_quang.steps.1.ingredients.${item}.description`)}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
          {
            icon: <EnvironmentOutlined />,
            title: t('destinations/danang:guides.mi_quang.steps.2.title'),
            content: (
              <div className="py-4">
                <div className="space-y-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <Title level={5} className="mb-1 dark:text-white">
                        {t(`destinations/danang:guides.mi_quang.steps.2.places.${i}.name`)}
                      </Title>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2 text-sm">
                        <EnvironmentOutlined className="mr-1" />
                        {t(`destinations/danang:guides.mi_quang.steps.2.places.${i}.address`)}
                      </div>
                      <Text className="dark:text-gray-300">
                        {t(`destinations/danang:guides.mi_quang.steps.2.places.${i}.description`)}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
        ];
      
      case 'transportation':
        return [
          {
            icon: <CarOutlined />,
            title: t('destinations/danang:guides.transportation.steps.0.title'),
            content: (
              <div className="py-4">
                <Paragraph className="dark:text-gray-300">
                  {t('destinations/danang:guides.transportation.steps.0.content')}
                </Paragraph>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <img 
                    src="/assets/destinations/danang/transport-motorbike.jpg" 
                    alt="Motorbike Rental" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <img 
                    src="/assets/destinations/danang/transport-taxi.jpg" 
                    alt="Taxi Service" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              </div>
            ),
          },
          {
            icon: <InfoCircleOutlined />,
            title: t('destinations/danang:guides.transportation.steps.1.title'),
            content: (
              <div className="py-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <Title level={5} className="mb-2 dark:text-white">
                    {t('destinations/danang:guides.transportation.steps.1.app_title')}
                  </Title>
                  <div className="flex items-center">
                    <img 
                      src="/assets/destinations/danang/grab-app.jpg" 
                      alt="Grab App" 
                      className="w-16 h-16 rounded-lg mr-4"
                    />
                    <div>
                      <Text className="dark:text-white font-medium block">Grab</Text>
                      <Text className="dark:text-gray-300 text-sm">
                        {t('destinations/danang:guides.transportation.steps.1.grab_description')}
                      </Text>
                    </div>
                  </div>
                </div>
                
                <Paragraph className="dark:text-gray-300">
                  {t('destinations/danang:guides.transportation.steps.1.content')}
                </Paragraph>
              </div>
            ),
          },
          {
            icon: <ShopOutlined />,
            title: t('destinations/danang:guides.transportation.steps.2.title'),
            content: (
              <div className="py-4">
                <div className="space-y-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                      <div className="flex items-start">
                        <img 
                          src={`/assets/destinations/danang/rental-${i}.jpg`}
                          alt={t(`destinations/danang:guides.transportation.steps.2.rentals.${i}.name`)}
                          className="w-16 h-16 object-cover rounded-lg mr-3"
                        />
                        <div>
                          <Title level={5} className="mb-0 dark:text-white">
                            {t(`destinations/danang:guides.transportation.steps.2.rentals.${i}.name`)}
                          </Title>
                          <Text className="text-gray-500 dark:text-gray-400 text-sm">
                            {t(`destinations/danang:guides.transportation.steps.2.rentals.${i}.address`)}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
        ];
      
      // Default welcome guide if guide ID doesn't match any specific guides
      default:
        return [
          {
            icon: <InfoCircleOutlined />,
            title: t('destinations/danang:guides.default.steps.0.title'),
            content: (
              <div className="text-center py-4">
                <div className="w-24 h-24 rounded-full bg-primary bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
                  <InfoCircleOutlined className="text-4xl text-primary" />
                </div>
                <Paragraph className="dark:text-gray-300">
                  {t('destinations/danang:guides.default.steps.0.content')}
                </Paragraph>
              </div>
            ),
          },
          {
            icon: <InfoCircleOutlined />,
            title: t('destinations/danang:guides.default.steps.1.title'),
            content: (
              <div className="text-center py-4">
                <Paragraph className="dark:text-gray-300">
                  {t('destinations/danang:guides.default.steps.1.content')}
                </Paragraph>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <img 
                    src="/assets/destinations/danang/attraction-1.jpg" 
                    alt="Attraction" 
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <img 
                    src="/assets/destinations/danang/food-1.jpg" 
                    alt="Food" 
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <img 
                    src="/assets/destinations/danang/culture-1.jpg" 
                    alt="Culture" 
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
              </div>
            ),
          },
        ];
    }
  };

  const steps = getSteps();

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const contentVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10"
              onClick={handleClose}
            >
              <CloseOutlined />
            </button>

            <div className="mb-6">
              <div className="text-center mb-8">
                <Title level={3} className="mb-2 dark:text-white">
                  {t(`destinations/danang:guides.${guideId}.title`, {
                    defaultValue: t('destinations/danang:guides.default.title')
                  })}
                </Title>
                <Paragraph className="text-gray-500 dark:text-gray-400">
                  {t(`destinations/danang:guides.${guideId}.subtitle`, {
                    defaultValue: t('destinations/danang:guides.default.subtitle')
                  })}
                </Paragraph>
              </div>

              <Steps 
                current={currentStep} 
                direction={isMobile ? "vertical" : "horizontal"}
                size={isMobile ? "small" : "default"}
              >
                {steps.map((step, index) => (
                  <Step 
                    key={index} 
                    title={step.title}
                    icon={step.icon} 
                  />
                ))}
              </Steps>
            </div>

            <Card className="mt-6 mb-6">
              <div className="min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    variants={contentVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
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
                {t('destination:buttons.previous')}
              </Button>
              <Button
                type="primary"
                onClick={handleNext}
              >
                {currentStep < steps.length - 1
                  ? t('destination:buttons.next')
                  : t('destination:buttons.finish')}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper component for custom icons
const CompassIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} width="1em" height="1em" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export default InteractiveGuide;