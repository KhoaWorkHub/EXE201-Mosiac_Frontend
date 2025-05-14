import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spin, Result } from 'antd';
import { QrcodeOutlined, ShoppingCartOutlined, LinkOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useTranslation } from 'react-i18next';
import api from '@/services/api';

const { Title, Text, Paragraph } = Typography;

const QRCodeLandingPage: React.FC = () => {
  const { t } = useTranslation(['product', 'common']);
  const { qrId } = useParams<Record<string, string | undefined>>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Get user's location for analytics (simplified)
    const getUserLocation = async () => {
      try {
        const response = await fetch('https://geolocation-db.com/json/');
        const data = await response.json();
        return data.country_name || 'Unknown';
      } catch (error) {
        console.error('Error getting location:', error);
        return 'Unknown';
      }
    };
    
    const scanQRCode = async () => {
      if (!qrId) {
        setError(t('product:qrcode.invalid_qrcode'));
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Get user location
        const location = await getUserLocation();
        
        // Record QR code scan
        const response = await api.post(`/products/qrcode/${qrId}/scan`, null, {
          params: {
            ipAddress: '127.0.0.1', // This would be handled on server side in production
            userAgent: navigator.userAgent,
            location: location
          }
        });
        
        // Set redirect URL
        setRedirectUrl(response.data.redirectUrl);
        
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          window.location.href = response.data.redirectUrl;
        }, 2000);
        
      } catch (error) {
        console.error('Error scanning QR code:', error);
        setError(t('product:qrcode.error_scanning'));
      } finally {
        setLoading(false);
      }
    };
    
    scanQRCode();
  }, [qrId, t]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Spin size="large" />
            <Title level={3} className="mt-4">
              {t('product:qrcode.validating')}
            </Title>
            <Paragraph className="text-gray-500">
              {t('product:qrcode.please_wait')}
            </Paragraph>
          </motion.div>
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Result
            status="error"
            title={t('product:qrcode.invalid_qrcode')}
            subTitle={error}
            extra={[
              <Button type="primary" key="home" onClick={() => navigate('/')}>
                {t('common:nav.home')}
              </Button>,
              <Button key="products" onClick={() => navigate('/products')}>
                {t('common:nav.products')}
              </Button>,
            ]}
          />
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Card className="shadow-lg border-primary">
            <div className="text-center mb-6">
              <QrcodeOutlined className="text-5xl text-primary mb-4" />
              <Title level={2} className="text-primary">
                {t('product:qrcode.valid_qrcode')}
              </Title>
              <Paragraph>
                {t('product:qrcode.redirecting')}
              </Paragraph>
            </div>
            
            <div className="text-center mb-6">
              <Spin />
              <Text className="block mt-2 text-gray-500">
                {t('product:qrcode.auto_redirect')}
              </Text>
            </div>
            
            {redirectUrl && (
              <div className="text-center">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<LinkOutlined />}
                  onClick={() => window.location.href = redirectUrl}
                  className="mb-2 w-full"
                >
                  {t('product:qrcode.continue_to_product')}
                </Button>
                
                <Button
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => navigate('/products')}
                  className="w-full"
                >
                  {t('common:nav.products')}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default QRCodeLandingPage;