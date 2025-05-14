import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Switch,
  Divider,
  message,
  Select,
  Breadcrumb,
  Alert,
  Space
} from 'antd';
import {
  QrcodeOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';


const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const QRCodeForm: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // State
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  // Mock function to load products
  const loadProducts = async () => {
    setProductLoading(true);
    try {
      // In a real application, this would be an API call
      setTimeout(() => {
        const mockProducts = [
          { id: '1', name: 'Traditional Ao Dai' },
          { id: '2', name: 'Vietnamese Craft Pottery' },
          { id: '3', name: 'Handmade Jewelry' }
        ];
        setProducts(mockProducts);
        setProductLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading products:', error);
      message.error('Failed to load products');
      setProductLoading(false);
    }
  };
  
  // Load products when the component mounts
  React.useEffect(() => {
    loadProducts();
  }, []);
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      
      if (!selectedProduct) {
        message.error('Please select a product');
        return;
      }
      
      setLoading(true);
      

      
      // Here we use the actual API method from AdminProductService
      try {
        // This would be the real API call in a production app:
        // await AdminProductService.generateQRCode(selectedProduct, qrCodeData);
        
        // For demo purposes, we'll simulate it:
        setTimeout(() => {
          setLoading(false);
          message.success('QR code created successfully');
          navigate('/admin/qrcodes');
        }, 1500);
      } catch (error) {
        console.error('Error creating QR code:', error);
        message.error('Failed to create QR code');
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Error creating QR code:', error);
      message.error('Failed to create QR code');
      setLoading(false);
    }
  };
  
  // Handle product selection
  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
    
    // Set a default redirect URL based on the selected product
    const selectedProductInfo = products.find(p => p.id === productId);
    if (selectedProductInfo) {
      form.setFieldValue('redirectUrl', `https://example.com/products/${selectedProductInfo.name.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Breadcrumb className="mb-2">
            <Breadcrumb.Item>
              <Link to="/admin">{t('admin:dashboard.title')}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/admin/qrcodes">{t('admin:qrcodes.title')}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{t('admin:qrcodes.create')}</Breadcrumb.Item>
          </Breadcrumb>
          
          <Title level={2} className="mb-0 dark:text-white flex items-center">
            <QrcodeOutlined className="mr-2" />
            {t('admin:qrcodes.create')}
          </Title>
          
          <Text className="text-gray-500 dark:text-gray-400">
            {t('admin:qrcodes.create_description')}
          </Text>
        </div>
        
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/qrcodes')}
          className="flex items-center"
        >
          {t('admin:actions.back')}
        </Button>
      </div>
      
      {/* Content card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm dark:bg-gray-800">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              redirectUrl: '',
              active: true
            }}
          >
            <Form.Item
              label={t('admin:qrcodes.select_product')}
              required
              tooltip={t('admin:qrcodes.select_product_tooltip')}
            >
              <Select
                placeholder={t('admin:qrcodes.select_product_placeholder')}
                onChange={handleProductChange}
                loading={productLoading}
                className="w-full"
              >
                {products.map(product => (
                  <Option key={product.id} value={product.id}>{product.name}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Divider />
            
            <Form.Item
              name="redirectUrl"
              label={t('admin:qrcodes.redirect_url')}
              rules={[
                { required: true, message: t('admin:validation.redirect_url_required') },
                { type: 'url', message: t('admin:validation.valid_url') }
              ]}
              tooltip={t('admin:qrcodes.redirect_url_tooltip')}
            >
              <Input
                prefix={<LinkOutlined className="text-gray-400" />}
                placeholder="https://example.com/products/product-name"
              />
            </Form.Item>
            
            <Form.Item
              name="active"
              label={t('admin:qrcodes.status')}
              valuePropName="checked"
              tooltip={t('admin:qrcodes.status_tooltip')}
            >
              <Switch
                checkedChildren={<CheckCircleOutlined />}
                unCheckedChildren={<CloseCircleOutlined />}
              />
            </Form.Item>
            
            <Alert
              message={t('admin:qrcodes.tracking_info')}
              description={t('admin:qrcodes.tracking_description')}
              type="info"
              showIcon
              className="mb-6"
            />
            
            <Form.Item>
              <Space>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />} 
                  onClick={handleSubmit}
                  loading={loading}
                >
                  {t('admin:qrcodes.generate')}
                </Button>
                
                <Button 
                  onClick={() => navigate('/admin/qrcodes')}
                  disabled={loading}
                >
                  {t('admin:actions.cancel')}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
        
        <Card className="shadow-sm dark:bg-gray-800">
          <Title level={4} className="mb-4 dark:text-white">
            {t('admin:qrcodes.help_title')}
          </Title>
          
          <Paragraph className="text-gray-600 dark:text-gray-300 mb-4">
            {t('admin:qrcodes.help_description')}
          </Paragraph>
          
          <Alert
            message={t('admin:qrcodes.tips_title')}
            description={
              <ul className="list-disc pl-5 mt-2">
                <li>{t('admin:qrcodes.tip_1')}</li>
                <li>{t('admin:qrcodes.tip_2')}</li>
                <li>{t('admin:qrcodes.tip_3')}</li>
              </ul>
            }
            type="success"
            showIcon
            className="mb-4"
          />
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <Title level={5} className="mb-2 dark:text-white">
              {t('admin:qrcodes.benefits_title')}
            </Title>
            
            <ul className="list-disc pl-5">
              <li className="mb-1">{t('admin:qrcodes.benefit_1')}</li>
              <li className="mb-1">{t('admin:qrcodes.benefit_2')}</li>
              <li className="mb-1">{t('admin:qrcodes.benefit_3')}</li>
              <li>{t('admin:qrcodes.benefit_4')}</li>
            </ul>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default QRCodeForm;