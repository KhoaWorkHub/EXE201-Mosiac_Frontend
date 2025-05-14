import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Input, 
  Space, 
  Tag, 
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
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QRCodeResponse } from '@/admin/types/qrcode.types';
import { motion } from 'framer-motion';
import QRAnalytics from './QRAnalytics';

const { Title, Text } = Typography;

const QRCodeList: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const navigate = useNavigate();
  
  // State
  const [qrCodes, setQRCodes] = useState<QRCodeResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedQRCode, setSelectedQRCode] = useState<QRCodeResponse | null>(null);
  const [analyticsVisible, setAnalyticsVisible] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  
  // Fetch QR codes
  useEffect(() => {
    fetchQRCodes();
  }, []);
  
  const fetchQRCodes = async () => {
    setLoading(true);
    try {
      // This is a mock implementation - in a real app, you would need to implement
      // a method in AdminProductService to fetch all QR codes
      // For now, we'll simulate fetching data with a timeout
      setTimeout(() => {
        // Mock data for demonstration
        const mockData: QRCodeResponse[] = [
          {
            id: '1',
            qrImageUrl: 'https://via.placeholder.com/150',
            qrData: 'https://example.com/qr/1',
            redirectUrl: 'https://example.com/products/ao-dai-traditional',
            active: true,
            scanCount: 245
          },
          {
            id: '2',
            qrImageUrl: 'https://via.placeholder.com/150',
            qrData: 'https://example.com/qr/2',
            redirectUrl: 'https://example.com/products/vietnamese-craft',
            active: true,
            scanCount: 187
          },
          {
            id: '3',
            qrImageUrl: 'https://via.placeholder.com/150',
            qrData: 'https://example.com/qr/3',
            redirectUrl: 'https://example.com/products/handmade-jewelry',
            active: false,
            scanCount: 32
          }
        ];
        
        setQRCodes(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      message.error('Failed to fetch QR codes');
      setLoading(false);
    }
  };
  
  // Filter QR codes based on search text
  const filteredQRCodes = searchText
    ? qrCodes.filter(qr => 
        qr.redirectUrl.toLowerCase().includes(searchText.toLowerCase()) ||
        qr.qrData.toLowerCase().includes(searchText.toLowerCase())
      )
    : qrCodes;
  
  // Handle QR code deletion
  const handleDelete = async (id: string) => {
    try {
      // In a real app, you would call a method like:
      // await AdminProductService.deleteQRCode(id);
      
      message.success('QR code deleted successfully');
      
      // Update the list after deletion
      setQRCodes(qrCodes.filter(qr => qr.id !== id));
    } catch (error) {
      console.error('Error deleting QR code:', error);
      message.error('Failed to delete QR code');
    }
  };
  
  // Handle view analytics
  const handleViewAnalytics = (qrCode: QRCodeResponse) => {
    setSelectedQRCode(qrCode);
    setAnalyticsVisible(true);
  };
  
  // Handle preview
  const handlePreview = (qrCode: QRCodeResponse) => {
    setSelectedQRCode(qrCode);
    setPreviewVisible(true);
  };
  
  // Handle download QR code
  const handleDownload = (qrCode: QRCodeResponse) => {
    // Create a link element to download the image
    const link = document.createElement('a');
    link.href = qrCode.qrImageUrl;
    link.download = `qrcode-${qrCode.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success('QR code downloaded');
  };
  
  // Table columns
  const columns = [
    {
      title: 'QR Code',
      dataIndex: 'qrImageUrl',
      key: 'qrImage',
      render: (url: string) => (
        <div className="w-16 h-16 flex items-center justify-center">
          <img src={url} alt="QR Code" className="max-w-full max-h-full" />
        </div>
      ),
    },
    {
      title: t('admin:qrcodes.redirect_url'),
      dataIndex: 'redirectUrl',
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
      title: t('admin:qrcodes.status'),
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'error'}>
          {active ? t('admin:qrcodes.active') : t('admin:qrcodes.inactive')}
        </Tag>
      ),
    },
    {
      title: t('admin:qrcodes.scan_count'),
      dataIndex: 'scanCount',
      key: 'scanCount',
      sorter: (a: QRCodeResponse, b: QRCodeResponse) => (a.scanCount || 0) - (b.scanCount || 0),
      render: (count: number) => <span className="font-medium">{count || 0}</span>,
    },
    {
      title: t('admin:actions.actions'),
      key: 'actions',
      render: (_: unknown, record: QRCodeResponse) => (
        <Space size="small">
          <Tooltip title={t('admin:actions.preview')}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
              className="flex items-center justify-center"
            />
          </Tooltip>
          
          <Tooltip title={t('admin:actions.download')}>
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
              className="flex items-center justify-center"
            />
          </Tooltip>
          
          <Tooltip title={t('admin:qrcodes.view_analytics')}>
            <Button
              type="text"
              icon={<ScanOutlined />}
              onClick={() => handleViewAnalytics(record)}
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
            <Breadcrumb.Item>{t('admin:dashboard.title')}</Breadcrumb.Item>
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
        ) : filteredQRCodes.length === 0 ? (
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
            dataSource={filteredQRCodes}
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