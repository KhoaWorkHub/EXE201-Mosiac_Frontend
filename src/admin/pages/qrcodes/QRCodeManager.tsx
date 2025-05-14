import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Popconfirm, 
  message, 
  Tooltip, 
  Empty, 
  Spin, 
  Tabs, 
  Badge, 
  Modal,
  Alert,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  QrcodeOutlined, 
  PlusOutlined, 
  SaveOutlined, 
  DeleteOutlined, 
  LinkOutlined, 
  ReloadOutlined,
  EyeOutlined,
  DownloadOutlined,
  ScanOutlined,
  ShareAltOutlined,
  EditOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AdminProductService } from '@/admin/services/adminProductService';
import { QRCodeRequest, QRCodeResponse } from '@/admin/types/qrcode.types';
import QRAnalytics from './QRAnalytics';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface QRCodeManagerProps {
  productId: string;
  qrCode: QRCodeResponse | null;
  onSuccess: () => void;
}

const QRCodeManager: React.FC<QRCodeManagerProps> = ({ 
  productId, 
  qrCode,
  onSuccess
}) => {
  const { t } = useTranslation(['admin', 'common']);
  const [form] = Form.useForm();
  
  // Component state
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  // Initialize form with QR code data
  useEffect(() => {
    if (qrCode) {
      form.setFieldsValue({
        redirectUrl: qrCode.redirectUrl,
        active: qrCode.active ?? true
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        redirectUrl: `${window.location.origin}/products/${productId}`,
        active: true
      });
    }
  }, [qrCode, form, productId]);
  
  // Generate QR code
  const handleGenerateQRCode = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const qrCodeRequest: QRCodeRequest = {
        redirectUrl: values.redirectUrl,
        active: values.active
      };
      
      await AdminProductService.generateQRCode(productId, qrCodeRequest);
      message.success(t('admin:products.qrcode_generated'));
      onSuccess();
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      message.error(t('admin:products.qrcode_generation_error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Update QR code
  const handleUpdateQRCode = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const qrCodeRequest: QRCodeRequest = {
        redirectUrl: values.redirectUrl,
        active: values.active
      };
      
      await AdminProductService.updateQRCode(productId, qrCodeRequest);
      message.success(t('admin:products.qrcode_updated'));
      onSuccess();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update QR code:', error);
      message.error(t('admin:products.qrcode_update_error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Delete QR code
  const handleDeleteQRCode = async () => {
    try {
      setLoading(true);
      await AdminProductService.deleteQRCode(productId);
      message.success(t('admin:products.qrcode_deleted'));
      onSuccess();
    } catch (error) {
      console.error('Failed to delete QR code:', error);
      message.error(t('admin:products.qrcode_delete_error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Download QR code image
  const handleDownloadQRCode = () => {
    if (!qrCode?.qrImageUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCode.qrImageUrl;
    link.download = `qrcode-${productId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success(t('admin:products.qrcode_downloaded'));
  };
  
  // Copy QR code URL
  const handleCopyLink = () => {
    if (!qrCode?.redirectUrl) return;
    
    navigator.clipboard.writeText(qrCode.redirectUrl);
    message.success(t('admin:products.link_copied'));
  };
  
  // Share QR code
  const handleShare = () => {
    if (!qrCode?.redirectUrl) return;
    
    if (navigator.share) {
      navigator.share({
        title: 'Product QR Code',
        url: qrCode.redirectUrl
      })
      .catch(() => {
        // Fall back to copy if sharing fails
        handleCopyLink();
      });
    } else {
      // Fall back to copy if Web Share API not available
      handleCopyLink();
    }
  };
  
  // No QR code yet - display creation form
  if (!qrCode && !isCreating) {
    return (
      <Card className="shadow-sm">
        <Empty
          image={<QrcodeOutlined style={{ fontSize: 64 }} className="text-gray-300" />}
          description={t('admin:products.no_qrcode')}
        >
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsCreating(true)}
          >
            {t('admin:products.generate_qrcode')}
          </Button>
        </Empty>
      </Card>
    );
  }
  
  // Create QR code form
  if (isCreating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          title={
            <div className="flex items-center">
              <QrcodeOutlined className="mr-2 text-primary" />
              <span>{t('admin:products.generate_qrcode')}</span>
            </div>
          }
          className="shadow-sm"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              redirectUrl: `${window.location.origin}/products/${productId}`,
              active: true
            }}
          >
            <Form.Item
              name="redirectUrl"
              label={t('admin:products.redirect_url')}
              rules={[
                { required: true, message: t('admin:validation.redirect_url_required') },
                { type: 'url', message: t('admin:validation.valid_url') }
              ]}
              help={t('admin:products.redirect_url_help')}
            >
              <Input prefix={<LinkOutlined />} />
            </Form.Item>
            
            <Form.Item
              name="active"
              label={t('admin:products.qrcode_active')}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            
            <Alert
              message={t('admin:products.qrcode_info')}
              description={t('admin:products.qrcode_description')}
              type="info"
              showIcon
              className="mb-4"
            />
            
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsCreating(false)}>
                {t('admin:actions.cancel')}
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleGenerateQRCode}
                loading={loading}
              >
                {t('admin:products.generate_qrcode')}
              </Button>
            </div>
          </Form>
        </Card>
      </motion.div>
    );
  }
  
  if (!qrCode) return <Spin size="large" />;
  
  // Edit QR code form
  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          title={
            <div className="flex items-center">
              <EditOutlined className="mr-2 text-primary" />
              <span>{t('admin:products.edit_qrcode')}</span>
            </div>
          }
          className="shadow-sm"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              redirectUrl: qrCode.redirectUrl,
              active: qrCode.active ?? true
            }}
          >
            <Form.Item
              name="redirectUrl"
              label={t('admin:products.redirect_url')}
              rules={[
                { required: true, message: t('admin:validation.redirect_url_required') },
                { type: 'url', message: t('admin:validation.valid_url') }
              ]}
              help={t('admin:products.redirect_url_help')}
            >
              <Input prefix={<LinkOutlined />} />
            </Form.Item>
            
            <Form.Item
              name="active"
              label={t('admin:products.qrcode_active')}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsEditing(false)}>
                {t('admin:actions.cancel')}
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleUpdateQRCode}
                loading={loading}
              >
                {t('admin:actions.save')}
              </Button>
            </div>
          </Form>
        </Card>
      </motion.div>
    );
  }
  
  // QR code details and management
  return (
    <Card className="shadow-sm">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="qrcode-tabs"
      >
        <TabPane
          tab={
            <span>
              <QrcodeOutlined /> {t('admin:products.qrcode_details')}
            </span>
          }
          key="details"
        >
          <div className="p-4">
            <Row gutter={24}>
              <Col xs={24} md={12} className="mb-6 md:mb-0">
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-colors duration-300"></div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-64 w-64">
                      <img
                        src={qrCode.qrImageUrl}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                        onClick={() => setPreviewVisible(true)}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Tooltip title={t('admin:actions.view')}>
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<EyeOutlined />}
                          onClick={() => setPreviewVisible(true)}
                          className="mr-2"
                        />
                      </Tooltip>
                      <Tooltip title={t('admin:actions.download')}>
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<DownloadOutlined />}
                          onClick={handleDownloadQRCode}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-4 space-x-2">
                  <Button
                    type="default"
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadQRCode}
                  >
                    {t('admin:actions.download')}
                  </Button>
                  <Button
                    type="default"
                    icon={<ShareAltOutlined />}
                    onClick={handleShare}
                  >
                    {t('admin:actions.share')}
                  </Button>
                </div>
              </Col>
              
              <Col xs={24} md={12}>
                <div>
                  <Title level={4} className="mb-4 flex items-center">
                    <QrcodeOutlined className="mr-2 text-primary" /> 
                    {t('admin:products.qrcode_info')}
                  </Title>
                  
                  <div className="mb-4">
                    <Text strong>{t('admin:products.qrcode_id')}:</Text>
                    <Paragraph copyable className="ml-2">{qrCode.id}</Paragraph>
                  </div>
                  
                  <div className="mb-4">
                    <Text strong>{t('admin:products.qrcode_data')}:</Text>
                    <Paragraph copyable className="ml-2">{qrCode.qrData}</Paragraph>
                  </div>
                  
                  <div className="mb-4">
                    <Text strong>{t('admin:products.redirect_url')}:</Text>
                    <div className="flex items-center mt-1">
                      <Input
                        value={qrCode.redirectUrl}
                        readOnly
                        addonAfter={
                          <Tooltip title={t('common:actions.copy')}>
                            <Button
                              type="text"
                              icon={<LinkOutlined />}
                              onClick={handleCopyLink}
                              size="small"
                              className="flex items-center"
                            />
                          </Tooltip>
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Text strong>{t('admin:products.status')}:</Text>
                    <div className="mt-1">
                      {qrCode.active ? (
                        <Badge status="success" text={t('admin:products.active')} />
                      ) : (
                        <Badge status="error" text={t('admin:products.inactive')} />
                      )}
                    </div>
                  </div>
                  
                  {qrCode.scanCount !== undefined && (
                    <div className="mb-4">
                      <Statistic
                        title={t('admin:products.scan_count')}
                        value={qrCode.scanCount}
                        prefix={<ScanOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </div>
                  )}
                  
                  <div className="flex space-x-2 mt-6">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setIsEditing(true)}
                    >
                      {t('admin:actions.edit')}
                    </Button>
                    <Button
                      type="default"
                      icon={<ReloadOutlined />}
                      onClick={onSuccess}
                    >
                      {t('admin:actions.refresh')}
                    </Button>
                    <Popconfirm
                      title={t('admin:products.qrcode_delete_confirm')}
                      onConfirm={handleDeleteQRCode}
                      okText={t('admin:actions.yes')}
                      cancelText={t('admin:actions.no')}
                      placement="topRight"
                    >
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                      >
                        {t('admin:actions.delete')}
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <ScanOutlined /> {t('admin:products.scan_analytics')}
            </span>
          }
          key="analytics"
        >
          <QRAnalytics qrCodeId={qrCode.id} />
        </TabPane>
      </Tabs>
      
      {/* QR code preview modal */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={400}
        centered
        title={t('admin:products.qrcode_preview')}
      >
        <div className="flex justify-center">
          <img
            src={qrCode.qrImageUrl}
            alt="QR Code"
            className="max-w-full"
          />
        </div>
        <div className="mt-4 text-center">
          <Text type="secondary">
            {t('admin:products.qrcode_scan_instructions')}
          </Text>
        </div>
        <div className="mt-4 flex justify-center">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadQRCode}
          >
            {t('admin:actions.download')}
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default QRCodeManager;