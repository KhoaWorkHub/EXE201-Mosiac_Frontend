import React, { useEffect } from 'react';
import { Layout, Card, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { AuthService } from '@/services/auth.service';
import LoginForm from '../components/LoginForm';
import LanguageSelector from '@/components/common/LanguageSelector';
import ThemeToggle from '@/components/common/ThemeToggle';
import { motion } from 'framer-motion';

const { Content } = Layout;
const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Handle redirect after OAuth login
  useEffect(() => {
    if (location.pathname === '/oauth2/redirect') {
      const urlParams = new URLSearchParams(location.search);
      const authResponse = AuthService.handleOAuth2Redirect(urlParams);
      
      if (authResponse) {
        dispatch(setCredentials(authResponse));
        navigate('/');
      }
    }
  }, [location, dispatch, navigate]);

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
        
        {/* Left column - Image */}
        <motion.div 
          className="hidden md:flex md:w-1/2 bg-primary-600 relative overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900 opacity-90"></div>
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <img 
              src="/logo-white.svg" 
              alt="MOSIAC" 
              className="h-16 mb-8" 
            />
            <Title level={2} className="text-white text-center mb-6">
              {t('auth:login.welcome')}
            </Title>
            <Text className="text-white text-center text-lg max-w-md">
              {t('auth:login.description')}
            </Text>
          </div>
          <div className="absolute bottom-8 left-0 right-0 text-center text-white text-sm">
            &copy; {new Date().getFullYear()} MOSIAC. {t('footer.rights')}
          </div>
        </motion.div>
        
        {/* Right column - Form */}
        <motion.div 
          className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-gray-900 p-4 sm:p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full max-w-md">
            <div className="mb-8 text-center md:hidden">
              <img 
                src="/logo.svg" 
                alt="MOSIAC" 
                className="h-12 mx-auto mb-4" 
              />
              <Title level={3} className="dark:text-white">
                {t('auth:login.welcome')}
              </Title>
            </div>
            
            <Card 
              bordered={false} 
              className="w-full rounded-xl shadow-lg dark:bg-gray-800"
            >
              <div className="py-6">
                <LoginForm />
              </div>
            </Card>
            
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 md:hidden">
              &copy; {new Date().getFullYear()} MOSIAC. {t('footer.rights')}
            </div>
          </div>
        </motion.div>
      </Content>
    </Layout>
  );
};

export default LoginPage;