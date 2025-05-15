import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Typography, Button, Spin, Result, Divider } from 'antd';
import { QrcodeOutlined, ShoppingCartOutlined, LinkOutlined, MobileOutlined, ScanOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import { useTranslation } from 'react-i18next';
//import api from '@/services/api';

const { Title, Paragraph } = Typography;

const QRCodeLandingPage: React.FC = () => {
  const { t } = useTranslation(['product', 'common']);
  const { qrId } = useParams<Record<string, string | undefined>>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  //const [productInfo, setProductInfo] = useState<any>(null);
  const [showAROption, setShowAROption] = useState(false);
  
  useEffect(() => {
    // Get user's location for analytics (simplified)
    // const getUserLocation = async () => {
    //   try {
    //     const response = await fetch('https://geolocation-db.com/json/');
    //     const data = await response.json();
    //     return data.country_name || 'Unknown';
    //   } catch (error) {
    //     console.error('Error getting location:', error);
    //     return 'Unknown';
    //   }
    // };
    
    const scanQRCode = async () => {
      if (!qrId) {
        setError(t('product:qrcode.invalid_qrcode'));
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Get user location
        //const location = await getUserLocation();
        
        // Record QR code scan
        // const response = await api.post(`/products/qrcode/${qrId}/scan`, null, {
        //   params: {
        //     ipAddress: '127.0.0.1', // This would be handled on server side in production
        //     userAgent: navigator.userAgent,
        //     location: location
        //   }
        // });
        
        // Set redirect URL and product info
        // setRedirectUrl(response.data.redirectUrl);
        // setProductInfo(response.data.productInfo || null);
        
        // Check if AR is available for this product
        // In a real app, this would be determined by the server response
        setShowAROption(true);
        
        setLoading(false);
      } catch (error) {
        console.error('Error scanning QR code:', error);
        setError(t('product:qrcode.error_scanning'));
        setLoading(false);
      }
    };
    
    scanQRCode();
  }, [qrId, t]);
  
  // Check if AR is supported on this device
  const isARSupported = () => {
    // Basic check for AR support - in a real app we'd do more thorough detection
    return (
      'mediaDevices' in navigator &&
      'getUserMedia' in navigator.mediaDevices &&
      (window.isSecureContext || window.location.protocol === 'https:')
    );
  };
  
  // Navigate to product page
  // const handleViewProduct = () => {
  //   if (redirectUrl) {
  //     window.location.href = redirectUrl;
  //   } else {
  //     navigate('/products');
  //   }
  // };
  
  // Launch AR experience
  const handleLaunchAR = () => {
    navigate(`/ar/${qrId}`, { state: { from: location.pathname } });
  };
  
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
      <div className="flex justify-center items-center min-h-[60vh] py-8 px-4">
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
              
              {/* {productInfo && (
                <div className="mb-4">
                  <img 
                    src={productInfo.image || '/placeholder-product.jpg'} 
                    alt={productInfo.name || 'Product'} 
                    className="w-32 h-32 object-cover mx-auto mb-3 rounded-lg"
                  />
                  <Title level={4} className="mb-1">
                    {productInfo.name || 'Traditional Vietnamese Clothing'}
                  </Title>
                  <Text className="text-gray-500">
                    {productInfo.region || 'Da Nang, Vietnam'}
                  </Text>
                </div>
              )}
              
              <Paragraph>
                {productInfo
                  ? t('product:qrcode.product_scanned')
                  : t('product:qrcode.redirecting')}
              </Paragraph> */}
            </div>
            
            {/* AR Feature Section */}
            {showAROption && isARSupported() && (
              <>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                  <div className="flex items-center mb-3">
                    <MobileOutlined className="text-2xl text-primary mr-3" />
                    <Title level={4} className="m-0">
                      {t('product:qrcode.ar_experience')}
                    </Title>
                  </div>
                  <Paragraph className="mb-4">
                    Experience this traditional clothing in augmented reality! See detailed cultural patterns and discover their meaning.
                  </Paragraph>
                  <Button 
                    type="primary" 
                    size="large" 
                    block
                    icon={<ScanOutlined />}
                    onClick={handleLaunchAR}
                    className="bg-primary mb-2"
                  >
                    Launch AR Experience
                  </Button>
                </div>
                <Divider>{t('product:qrcode.or')}</Divider>
              </>
            )}
            
            <div className="text-center">
              <Button 
                type="primary" 
                size="large" 
                icon={<LinkOutlined />}
                //onClick={handleViewProduct}
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
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default QRCodeLandingPage;