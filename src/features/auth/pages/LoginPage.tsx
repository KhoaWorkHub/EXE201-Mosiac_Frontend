import React, { useEffect } from 'react';
import { Layout, Card, Typography } from 'antd';
import {  useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
// import { setCredentials } from '@/store/slices/authSlice';
// import { AuthService } from '@/services/auth.service';
import LoginForm from '../components/LoginForm';
import LanguageSelector from '@/components/common/LanguageSelector';
import ThemeToggle from '@/components/common/ThemeToggle';
import { motion } from 'framer-motion';

const { Content } = Layout;
const { Title, Text } = Typography;

// Animated patterns component
const AnimatedPatterns = () => (
  <motion.div 
    className="absolute inset-0 w-full h-full overflow-hidden z-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.15 }}
    transition={{ duration: 1.5 }}
  >
    <div className="absolute top-0 right-0 w-full h-full">
      <svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pattern1" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1" height="1" fill="currentColor" />
          </pattern>
          <pattern id="pattern2" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill="currentColor" />
          </pattern>
          <pattern id="pattern3" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M0,40 L40,0 L80,40 L40,80 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern1)" />
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern2)" />
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern3)" />
      </svg>
    </div>
  </motion.div>
);

const LoginPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  // const dispatch = useAppDispatch();
  // const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Handle redirect after OAuth login
  // useEffect(() => {
  //   if (location.pathname === '/oauth2/redirect') {
  //     const urlParams = new URLSearchParams(location.search);
  //     const authResponse = AuthService.handleOAuth2Redirect(urlParams);
      
  //     if (authResponse) {
  //       dispatch(setCredentials(authResponse));
  //       navigate('/');
  //     }
  //   }
  // }, [location, dispatch, navigate]);

  // If already authenticated, redirect to home page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Layout className="min-h-screen">
      <Content className="flex items-stretch min-h-screen">
        <div className="absolute top-4 right-4 flex items-center space-x-4 z-10">
          <LanguageSelector />
          <ThemeToggle />
        </div>
        
        {/* Left column - Image & Branding */}
        <motion.div 
          className="hidden md:flex md:w-1/2 bg-primary-600 relative overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900 opacity-90"></div>
          
          {/* Decorative patterns */}
          <AnimatedPatterns />
          
          {/* Floating shapes animation */}
          <motion.div 
            className="absolute"
            animate={{ 
              x: [0, 30, 0], 
              y: [0, 20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 20,
              ease: "easeInOut" 
            }}
            style={{ left: '20%', top: '30%' }}
          >
            <svg width="120" height="120" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M165.962 24.4321C179.686 41.9011 179.366 66.9464 182.524 91.9917C185.682 117.037 192.319 142.082 184.362 162.272C176.406 182.462 153.856 197.797 131.306 201.594C108.756 205.39 86.2062 197.797 67.1559 182.798C48.1056 167.798 32.5545 145.392 24.9177 120.392C17.281 95.3922 17.4601 67.8 26.7081 46.8321C36.0351 25.8643 54.4208 11.5 78.0922 4.98214C101.764 -1.53571 152.238 6.89286 165.962 24.4321Z" fill="rgba(255, 255, 255, 0.1)"/>
            </svg>
          </motion.div>
          
          <motion.div 
            className="absolute"
            animate={{ 
              x: [0, -20, 0], 
              y: [0, 30, 0],
              rotate: [0, -8, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 25,
              ease: "easeInOut" 
            }}
            style={{ right: '15%', bottom: '25%' }}
          >
            <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M39.1076 34.3362C63.8566 11.0239 110.644 26.5004 139.287 54.3505C167.93 82.2005 178.428 122.124 165.597 151.086C152.766 180.047 116.606 198.048 81.3522 197.104C46.0981 196.161 11.7498 176.272 3.15345 144.902C-5.44286 113.531 11.709 70.6784 39.1076 34.3362Z" fill="rgba(255, 255, 255, 0.1)"/>
            </svg>
          </motion.div>
          
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <img 
                src="/logo.svg" 
                alt={t('common:brand.name')} 
                className="h-16 mb-8" 
              />
            </motion.div>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Title level={2} className="text-white text-center mb-6">
                {t('auth:login.welcome')}
              </Title>
            </motion.div>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Text className="text-white text-center text-lg max-w-md">
                {t('auth:login.description')}
              </Text>
            </motion.div>
            
            {/* Features section */}
            <motion.div 
              className="mt-12 grid grid-cols-2 gap-6 w-full max-w-md"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t('common:features.quality.title')}</h3>
                  <p className="text-xs text-white text-opacity-80">{t('common:features.quality.description')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v1h-2V8a1 1 0 00-1-1H6a1 1 0 00-1 1v7h1.05a2.5 2.5 0 014.9 0H15V8a1 1 0 00-1-1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t('common:features.shipping.title')}</h3>
                  <p className="text-xs text-white text-opacity-80">{t('common:features.shipping.description')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t('common:features.flash_sales.title')}</h3>
                  <p className="text-xs text-white text-opacity-80">{t('common:features.flash_sales.description')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11zm8.921 2.012a1 1 0 01.831 1.145 19.86 19.86 0 01-.545 2.436 1 1 0 11-1.92-.558c.207-.713.371-1.445.49-2.192a1 1 0 011.144-.83z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 10a1 1 0 011 1c0 2.236-.46 4.368-1.29 6.304a1 1 0 01-1.838-.789A13.952 13.952 0 009 11a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t('common:features.support.title')}</h3>
                  <p className="text-xs text-white text-opacity-80">{t('common:features.support.description')}</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="absolute bottom-8 left-0 right-0 text-center text-white text-opacity-70 text-sm">
            &copy; {new Date().getFullYear()} {t('common:brand.name')}. {t('common:footer.rights')}
          </div>
        </motion.div>
        
        {/* Right column - Form */}
        <motion.div 
          className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-gray-900 p-4 sm:p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-full max-w-md">
            <div className="mb-8 text-center md:hidden">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src="/logo.svg" 
                  alt={t('common:brand.name')} 
                  className="h-12 mx-auto mb-4" 
                />
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Title level={3} className="dark:text-white mb-2">
                  {t('auth:login.welcome')}
                </Title>
                <Text className="text-gray-600 dark:text-gray-400">
                  {t('auth:login.description')}
                </Text>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full"
            >
              <Card 
                bordered={false} 
                className="w-full rounded-xl shadow-xl dark:bg-gray-800 backdrop-filter backdrop-blur-sm bg-opacity-90"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)' }}
              >
                <div className="py-6">
                  <LoginForm />
                </div>
              </Card>
            </motion.div>
            
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 md:hidden">
              &copy; {new Date().getFullYear()} {t('common:brand.name')}. {t('common:footer.rights')}
            </div>
          </div>
        </motion.div>
      </Content>
    </Layout>
  );
};

export default LoginPage;