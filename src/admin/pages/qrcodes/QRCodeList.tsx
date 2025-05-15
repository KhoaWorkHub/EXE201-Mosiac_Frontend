import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Input, 
  Space, 
  Tooltip, 
  Popconfirm, 
  message, 
  Empty,
  Typography, 
  Breadcrumb,
  Spin,
  Modal
} from 'antd';
import { 
  QrcodeOutlined, 
  SearchOutlined, 
  PlusOutlined, 
  ReloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  DownloadOutlined,
  ScanOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import QRAnalytics from './QRAnalytics';
import { AdminProductService } from '@/admin/services/adminProductService';
import type { ProductResponse } from '@/admin/types';

const { Title, Text } = Typography;

const QRCodeList: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const navigate = useNavigate();
  
  // State
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedQRCode, setSelectedQRCode] = useState<ProductResponse['qrCode'] | null>(null);
  const [analyticsVisible, setAnalyticsVisible] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  
  // Fetch QR codes (products with QR codes)
  useEffect(() => {
    fetchQRCodes();
  }, []);
  
  const fetchQRCodes = async () => {
    setLoading(true);
    try {
      // Fetch all products and filter those with QR codes
      const response = await AdminProductService.getAllProducts(0, 100);
      const productsWithQRCodes = response.content.filter(product => product.qrCode);
      setProducts(productsWithQRCodes);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      message.error(t('admin:qrcodes.fetch_error'));
    } finally {
      setLoading(false);
    }
  };
  
  // Filter products based on search text
  const filteredProducts = searchText
    ? products.filter(product => 
        product.qrCode?.redirectUrl.toLowerCase().includes(searchText.toLowerCase()) ||
        product.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : products;
  
  // Handle QR code deletion
  const handleDelete = async (productId: string) => {
    try {
      await AdminProductService.deleteQRCode(productId);
      message.success(t('admin:qrcodes.delete_success'));
      // Refresh the list
      fetchQRCodes();
    } catch (error) {
      console.error('Error deleting QR code:', error);
      message.error(t('admin:qrcodes.delete_error'));
    }
  };
  
  // Handle view analytics
  // Handle view analytics
  const handleViewAnalytics = (qrCode: ProductResponse['qrCode']) => {
    setSelectedQRCode(qrCode);
    setAnalyticsVisible(true);
  };
  // Handle preview
  const handlePreview = (qrCode: ProductResponse['qrCode']) => {
    setSelectedQRCode(qrCode);
    setPreviewVisible(true);
  };
  
  // Handle download QR code
  const handleDownload = (qrCode: ProductResponse['qrCode']) => {
    if (!qrCode || !qrCode.qrImageUrl) return;
    
    // Create a link element to download the image
    const link = document.createElement('a');
    link.href = qrCode.qrImageUrl;
    link.download = `qrcode-${qrCode.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success(t('admin:qrcodes.download_success'));
  };
  
  // Table columns
  const columns = [
    {
      title: 'QR Code',
      dataIndex: 'qrCode',
      key: 'qrImage',
      render: (qrCode: ProductResponse['qrCode']) => (
        <div className="w-16 h-16 flex items-center justify-center">
          <img 
            src={qrCode?.qrImageUrl} 
            alt="QR Code" 
            className="max-w-full max-h-full" 
          />
        </div>
      ),
    },
    {
      title: t('admin:products.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ProductResponse) => (
        <Link to={`/admin/products/${record.id}`}>
          {name}
        </Link>
      ),
    },
    {
      title: t('admin:qrcodes.redirect_url'),
      dataIndex: ['qrCode', 'redirectUrl'],
      key: 'redirectUrl',
      render: (url: string) => (
        <Tooltip title={url}>
          <div className="flex items-center">
            <LinkOutlined className="mr-2 text-gray-500" />
            <Text ellipsis style={{ maxWidth: 300 }}>{url}</Text>
          </div>
        </Tooltip>
      ),
    },
    {
      title: t('admin:qrcodes.scan_count'),
      dataIndex: ['qrCode', 'scanCount'],
      key: 'scanCount',
      sorter: (a: ProductResponse, b: ProductResponse) => 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((a.qrCode as any)?.scanCount || 0) - ((b.qrCode as any)?.scanCount || 0),
      render: (count: number) => <span className="font-medium">{count || 0}</span>,
    },
    {
      title: t('admin:actions.actions'),
      key: 'actions',
      render: (_: unknown, record: ProductResponse) => (
        <Space size="small">
          <Tooltip title={t('admin:actions.preview')}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record.qrCode)}
              className="flex items-center justify-center"
            />
          </Tooltip>
          
          <Tooltip title={t('admin:actions.download')}>
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record.qrCode)}
              className="flex items-center justify-center"
            />
          </Tooltip>
          
          <Tooltip title={t('admin:qrcodes.view_analytics')}>
            <Button
              type="text"
              icon={<ScanOutlined />}
              onClick={() => handleViewAnalytics(record.qrCode)}
              className="flex items-center justify-center"
            />
          </Tooltip>
          
          <Popconfirm
            title={t('admin:qrcodes.delete_confirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('admin:actions.yes')}
            cancelText={t('admin:actions.no')}
            placement="left"
          >
            <Tooltip title={t('admin:actions.delete')}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                className="flex items-center justify-center"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
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
            <Breadcrumb.Item>{t('admin:qrcodes.title')}</Breadcrumb.Item>
          </Breadcrumb>
          
          <Title level={2} className="mb-0 dark:text-white flex items-center">
            <QrcodeOutlined className="mr-2" />
            {t('admin:qrcodes.title')}
            <Tooltip title={t('admin:qrcodes.info')}>
              <InfoCircleOutlined className="ml-2 text-gray-400 text-lg" />
            </Tooltip>
          </Title>
          
          <Text className="text-gray-500 dark:text-gray-400">
            {t('admin:qrcodes.description')}
          </Text>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/qrcodes/new')}
            className="flex items-center"
          >
            {t('admin:qrcodes.create')}
          </Button>
          
          <Tooltip title={t('admin:actions.refresh')}>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchQRCodes}
              loading={loading}
              className="flex items-center justify-center"
            />
          </Tooltip>
        </div>
      </div>
      
      {/* Content card */}
      <Card className="shadow-sm dark:bg-gray-800">
        <div className="mb-4">
          <Input.Search
            placeholder={t('admin:qrcodes.search_placeholder')}
            allowClear
            enterButton
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined className="text-gray-400" />}
            className="max-w-md"
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description={
              searchText 
                ? t('admin:qrcodes.no_results') 
                : t('admin:qrcodes.no_qrcodes')
            }
          >
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => navigate('/admin/qrcodes/new')}
            >
              {t('admin:qrcodes.create')}
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="border border-gray-200 dark:border-gray-700 rounded-lg"
          />
        )}
      </Card>
      
      {/* QR Code Analytics Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <ScanOutlined className="mr-2 text-primary" />
            {t('admin:qrcodes.analytics_title')}
          </div>
        }
        open={analyticsVisible}
        onCancel={() => setAnalyticsVisible(false)}
        width={1000}
        footer={null}
        centered
      >
        {selectedQRCode && (
          <QRAnalytics qrCodeId={selectedQRCode.id} />
        )}
      </Modal>
      
      {/* QR Code Preview Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <QrcodeOutlined className="mr-2 text-primary" />
            {t('admin:qrcodes.preview_title')}
          </div>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        centered
      >
        {selectedQRCode && (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <img 
                src={selectedQRCode.qrImageUrl} 
                alt="QR Code" 
                className="max-w-full" 
                style={{ maxHeight: '300px' }}
              />
            </div>
            
            <div className="mb-4">
              <Title level={5}>{t('admin:qrcodes.redirect_url')}</Title>
              <div className="flex items-center justify-center">
                <LinkOutlined className="text-gray-500 mr-2" />
                <a href={selectedQRCode.redirectUrl} target="_blank" rel="noopener noreferrer">
                  {selectedQRCode.redirectUrl}
                </a>
              </div>
            </div>
            
            <div className="mb-4">
              <Title level={5}>{t('admin:qrcodes.qr_data')}</Title>
              <Text copyable>{selectedQRCode.qrData}</Text>
            </div>
            
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(selectedQRCode)}
            >
              {t('admin:actions.download')}
            </Button>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default QRCodeList;

