import React, { useState, useEffect, useRef } from 'react';
import { Button, Carousel } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ScanOutlined, 
  EnvironmentOutlined, 
  ZoomInOutlined,
  HighlightOutlined
} from '@ant-design/icons';
import type { CarouselRef } from 'antd/es/carousel';

interface OnboardingProps {
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const AROnboarding: React.FC<OnboardingProps> = ({
  visible,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSkipPrompt, setShowSkipPrompt] = useState(false);
  const carouselRef = useRef<CarouselRef>(null);

  // Automatically mark tutorial as viewed in local storage
  useEffect(() => {
    if (visible) {
      localStorage.setItem('ar_tutorial_viewed', 'true');
    }
  }, [visible]);

  // Sync carousel with currentStep
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.goTo(currentStep, false);
    }
  }, [currentStep]);

  // Go to next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  // Go to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Tutorial steps
  const steps = [
    {
      title: 'Allow Camera Access',
      description: 'The AR experience needs your camera to detect markers and display the 3D model in your environment.',
      icon: <ScanOutlined />,
      image: '/assets/onboarding/camera-permission.png',
    },
    {
      title: 'Explore Patterns',
      icon: <HighlightOutlined />,
      image: '/assets/onboarding/tap-patterns.png',
    },
    {
      title: 'Move & Rotate',
      description: 'Use your fingers to rotate, drag and position the 3D model in your space for the best view angle.',
      icon: <EnvironmentOutlined />,
      image: '/assets/onboarding/move-rotate.png',
    },
    {
      title: 'Zoom In & Out',
      description: 'Pinch to zoom in for a detailed view of the patterns and craftsmanship.',
      icon: <ZoomInOutlined />,
      image: '/assets/onboarding/zoom.png',
    },
  ];

  // Skip tutorial confirmation
  const handleSkipClick = () => {
    setShowSkipPrompt(true);
    setTimeout(() => {
      setShowSkipPrompt(false);
    }, 2000);
  };

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden max-w-md w-full max-h-[80vh] flex flex-col"
      >
        <div className="relative">
          {/* Carousel */}
          <Carousel
            ref={carouselRef}
            dots={false}
            effect="fade"
            autoplay={false}
          >
            {steps.map((step, index) => (
              <div key={index} className="pb-4">
                <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {step.image ? (
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl text-primary">
                      {step.icon}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Carousel>

          {/* Progress indicator */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep ? 'w-6 bg-primary' : 'w-1.5 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {steps[currentStep].title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
            {steps[currentStep].description}
          </p>

          <div className="flex justify-between items-center">
            <AnimatePresence mode="wait">
              {showSkipPrompt ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <Button type="text" danger onClick={onSkip}>
                    Yes, skip tutorial
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="skip"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <Button type="text" onClick={handleSkipClick}>
                    Skip
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex space-x-2">
              {currentStep > 0 && (
                <Button onClick={prevStep}>
                  Back
                </Button>
              )}
              <Button type="primary" onClick={nextStep}>
                {currentStep < steps.length - 1 ? 'Next' : 'Start Experience'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AROnboarding;