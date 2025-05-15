import React, { useState, useEffect } from 'react';
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
  Space,
  Spin
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
import { AdminProductService } from '@/admin/services/adminProductService';
import type { ProductResponse } from '@/admin/types';
import type { QRCodeRequest } from '@/admin/types/qrcode.types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const QRCodeForm: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // State
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  // Load products without QR codes
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    setProductLoading(true);
    try {
      // Fetch all products
      const response = await AdminProductService.getAllProducts(0, 100);
      
      // Filter products that don't already have QR codes
      const productsWithoutQRCodes = response.content.filter(product => !product.qrCode);
      setProducts(productsWithoutQRCodes);
    } catch (error) {
      console.error('Error loading products:', error);
      message.error(t('admin:products.fetch_error'));
    } finally {
      setProductLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (!selectedProduct) {
        message.error(t('admin:qrcodes.select_product_required'));
        return;
      }
      
      setLoading(true);
      
      // Validate form fields
      const values = await form.validateFields();
      
      // Create QR code request object
      const qrCodeRequest: QRCodeRequest = {
        redirectUrl: values.redirectUrl,
        active: values.active
      };
      
      // Call API to generate QR code
      await AdminProductService.generateQRCode(selectedProduct, qrCodeRequest);
      
      message.success(t('admin:qrcodes.create_success'));
      navigate('/admin/qrcodes');
    } catch (error) {
      console.error('Error creating QR code:', error);
      message.error(t('admin:qrcodes.create_error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Handle product selection
  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
    
    // Set a default redirect URL based on the selected product
    const selectedProductInfo = products.find(p => p.id === productId);
    if (selectedProductInfo) {
      const baseUrl = window.location.origin;
      form.setFieldValue('redirectUrl', `${baseUrl}/products/${selectedProductInfo.slug}`);
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
              {productLoading ? (
                <div className="flex items-center space-x-2">
                  <Spin size="small" />
                  <span>{t('admin:loading')}</span>
                </div>
              ) : (
                <Select
                  placeholder={t('admin:qrcodes.select_product_placeholder')}
                  onChange={handleProductChange}
                  className="w-full"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {products.map(product => (
                    <Option key={product.id} value={product.id}>{product.name}</Option>
                  ))}
                </Select>
              )}
              {products.length === 0 && !productLoading && (
                <div className="mt-2">
                  <Alert
                    message={t('admin:qrcodes.no_products_available')}
                    description={t('admin:qrcodes.no_products_description')}
                    type="warning"
                    showIcon
                  />
                </div>
              )}
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
                  disabled={!selectedProduct}
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