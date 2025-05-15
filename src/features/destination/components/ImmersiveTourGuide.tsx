import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Typography, Progress } from 'antd';
import { 
  ArrowRightOutlined, 
  CloseOutlined,
  EnvironmentOutlined,
  CoffeeOutlined,
  ReadOutlined,
  CarOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const {  Paragraph } = Typography;

interface ImmersiveTourGuideProps {
  onComplete: () => void;
  onSkip: () => void;
  sectionRefs: Record<string, React.RefObject<HTMLElement>>;
}

const ImmersiveTourGuide: React.FC<ImmersiveTourGuideProps> = ({ 
  onComplete, 
  onSkip,
  sectionRefs
}) => {
  useTranslation(['destinations/danang', 'destination']);
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const tourContainerRef = useRef<HTMLDivElement>(null);
  
  // Define the tour steps with rich storytelling
  const tourSteps = [
    {
      title: "Welcome to Da Nang",
      content: "Let me take you on a journey through the soul of Central Vietnam. Da Nang isn't just a destination; it's an experience that will captivate your heart and awaken your senses.",
      icon: <InfoCircleOutlined />,
      image: "/assets/destinations/danang/tour-welcome.jpg",
      target: null, // No scroll target for intro
      color: "#4096ff"
    },
    {
      title: "Breathtaking Natural Beauty",
      content: "From the pristine beaches with soft white sand to the mystical Marble Mountains, Da Nang's landscape is a harmony of sea, mountains, and sky that changes with every hour of the day.",
      icon: <EnvironmentOutlined />,
      image: "/assets/destinations/danang/tour-nature.jpg",
      target: "attractions",
      color: "#ff4d4f"
    },
    {
      title: "A Feast for Your Senses",
      content: "The distinctive flavors of Mi Quang noodles, the aromatic coffee culture, and fresh seafood embody Da Nang's culinary soul - each dish tells the story of this coastal paradise.",
      icon: <CoffeeOutlined />,
      image: "/assets/destinations/danang/tour-food.jpg",
      target: "cuisine",
      color: "#ffa940"
    },
    {
      title: "Cultural Tapestry",
      content: "Witness the blending of ancient Champa heritage with modern Vietnamese life. Every temple, festival, and tradition here is a thread in Da Nang's rich cultural fabric.",
      icon: <ReadOutlined />,
      image: "/assets/destinations/danang/tour-culture.jpg",
      target: "culture",
      color: "#73d13d"
    },
    {
      title: "Your Journey Awaits",
      content: "Throughout your Da Nang experience, look for 'Explore Interactive' buttons to dive deeper into specific elements. Are you ready to discover the gem of Central Vietnam?",
      icon: <CarOutlined />,
      image: "/assets/destinations/danang/tour-journey.jpg",
      target: "travel",
      color: "#9254de"
    }
  ];

  // Handle scrolling to sections when advancing steps
  useEffect(() => {
    if (currentStep > 0 && tourSteps[currentStep].target && sectionRefs[tourSteps[currentStep].target]?.current) {
      const targetSection = sectionRefs[tourSteps[currentStep].target]?.current;
      if (targetSection) {
        setTimeout(() => {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, sectionRefs]);

  const handleNext = () => {
    if (animating) return;
    
    setAnimating(true);
    if (currentStep < tourSteps.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setAnimating(false);
      }, 300);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] 
      }
    },
    exit: { 
      opacity: 0, 
      y: 50,
      transition: { 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1] 
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { 
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };
  
  const currentTourStep = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={handleSkip}>
      <motion.div
        ref={tourContainerRef}
        className="relative max-w-3xl w-full mx-4 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0">
          <Progress 
            percent={progress} 
            showInfo={false}
            strokeColor={currentTourStep.color}
            className="tour-progress"
            strokeWidth={3}
          />
        </div>

        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 bg-opacity-80 text-gray-700 dark:text-gray-300 hover:bg-opacity-100 transition-colors"
          onClick={handleSkip}
        >
          <CloseOutlined />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image side */}
          <div className="h-64 md:h-auto relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 transform hover:scale-110"
              style={{ backgroundImage: `url(${currentTourStep.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50" />
            
            {/* Step indicator */}
            <div className="absolute left-6 bottom-6 text-white">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3" 
                  style={{ backgroundColor: currentTourStep.color }}
                >
                  {currentTourStep.icon}
                </div>
                <div>
                  <div className="text-xs font-medium opacity-80">
                    STEP {currentStep + 1} OF {tourSteps.length}
                  </div>
                  <div className="text-xl font-semibold">
                    {currentTourStep.title}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content side */}
          <div className="p-8 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex-grow"
              >
                <Paragraph className="text-lg dark:text-gray-300 mb-8">
                  {currentTourStep.content}
                </Paragraph>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-between items-center mt-6">
              <Button 
                onClick={handleSkip}
                className="hover:underline"
                type="text"
              >
                Skip tour
              </Button>
              
              <Button 
                type="primary" 
                onClick={handleNext}
                size="large"
                icon={<ArrowRightOutlined />}
                style={{ backgroundColor: currentTourStep.color, borderColor: currentTourStep.color }}
              >
                {currentStep < tourSteps.length - 1 ? 'Next' : 'Start exploring'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImmersiveTourGuide;