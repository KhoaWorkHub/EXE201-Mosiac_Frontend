import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { AuthService } from '@/services/auth.service';
import ThemeToggle from '@/components/common/ThemeToggle';
import LanguageSelector from '@/components/common/LanguageSelector';
import gsap from 'gsap';
import '@/features/auth/styles/luxury-login.css';


const LuxuryLoginPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoBgRef = useRef<HTMLDivElement>(null);
  
  // Animation references
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Collection of luxury Vietnamese fashion images for background
  const luxuryImages = [
    '/assets/auth/saigon.png',
    '/assets/auth/khanhhoa.png',
    '/assets/auth/danang.png',
    '/assets/auth/quangninh.png',
    '/assets/auth/hanoi.png',
  ];
  
  // Brand values to display in rotating fashion
  const brandValues = [
    { value: t('auth:brand_values.craftsmanship'), description: t('auth:brand_values.craftsmanship_desc') },
    { value: t('auth:brand_values.heritage'), description: t('auth:brand_values.heritage_desc') },
    { value: t('auth:brand_values.sustainability'), description: t('auth:brand_values.sustainability_desc') },
    { value: t('auth:brand_values.exclusivity'), description: t('auth:brand_values.exclusivity_desc') },
    { value: t('auth:brand_values.craftsmanship'), description: t('auth:brand_values.craftsmanship_desc') },
  ];
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle OAuth login
  const handleGoogleLogin = () => {
    setLoading(true);
    AuthService.googleLogin();
  };
  
  // Setup image carousel timer and animation
  useEffect(() => {
    // Rotate background images
    slideTimerRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % luxuryImages.length);
    }, 4000);
    
    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }
    };
  }, [luxuryImages.length]);
  
  // Logo ripple effect animation
  useEffect(() => {
    if (logoBgRef.current) {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
      tl.to(logoBgRef.current, {
        duration: 2.5,
        scale: 1.2,
        opacity: 0,
        ease: "power2.out"
      });
    }
  }, []);
  
  return (
    <div className="w-full h-screen overflow-hidden relative bg-black">
      {/* Language and theme toggle */}
      <div className="absolute top-5 right-5 z-50 flex items-center space-x-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>
      
      {/* Background gallery with parallax effect */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {luxuryImages.map((img, index) => (
            <motion.div
              key={img}
              ref={el => { imagesRef.current[index] = el; }}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: activeSlide === index ? 0.8 : 0,
                scale: activeSlide === index ? 1 : 1.1
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{
                zIndex: activeSlide === index ? 1 : 0,
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
      
      {/* Content container */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          <motion.div 
            className="relative mb-12 flex flex-col items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Animated logo background effect */}
            <div className="relative">
              <div 
                ref={logoBgRef} 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary opacity-30" 
              />
              
              <motion.img 
                src="/logo.svg" 
                alt="MOSIAC" 
                className="h-20 relative z-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </div>
            
            <motion.h1 
              className="mt-6 text-3xl sm:text-4xl font-serif font-light text-white tracking-wide uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              MOSIAC
            </motion.h1>
            
            <motion.div 
              className="w-16 h-[1px] bg-primary my-3"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 1 }}
            />
            
            <motion.p 
              className="text-gray-300 text-sm uppercase tracking-[0.2em] font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              {t('auth:luxury_tagline')}
            </motion.p>
          </motion.div>
          
          {/* Brand value carousel */}
          <div className="h-28 mb-10 relative overflow-hidden text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="h-full flex flex-col items-center justify-center"
              >
                <h2 className="text-primary text-xl font-serif mb-2">
                  {brandValues[activeSlide].value}
                </h2>
                <p className="text-gray-300 text-sm max-w-xs">
                  {brandValues[activeSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* OAuth Button - Google */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mb-6"
          >
            <motion.button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 py-4 px-6 rounded-md flex items-center justify-center space-x-4 group transition-all duration-300 transform hover:shadow-xl"
              disabled={loading}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium tracking-wide text-sm group-hover:tracking-wider transition-all duration-300">
                {t('auth:login.continue_with_google')}
              </span>
            </motion.button>
          </motion.div>
          
          {/* Legal info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="text-center text-xs text-gray-500"
          >
            <p>
              {t('auth:login.privacy_terms')} 
              <a href="/privacy" className="text-primary hover:text-primary-300 ml-1">
                {t('common:footer.privacy')}
              </a> &amp; 
              <a href="/terms" className="text-primary hover:text-primary-300 ml-1">
                {t('common:footer.terms')}
              </a>
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Animated bottom accent line */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[3px] bg-primary z-30"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.5, delay: 2, ease: "easeInOut" }}
      />
      
      {/* Footer */}
      <div className="absolute bottom-6 w-full z-30 text-center">
        <motion.p 
          className="text-gray-500 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          &copy; {new Date().getFullYear()} MOSAIC. {t('common:footer.rights')}
        </motion.p>
      </div>
    </div>
  );
};

export default LuxuryLoginPage;