import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Typography, Card, Row, Col, Switch, Button, Alert, Table, Tag } from 'antd';
import { 
  BookOutlined,
  SettingOutlined,
  EyeOutlined,
  BarChartOutlined,
  LockOutlined,
  DeleteOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;

const CookiesPage: React.FC = () => {
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true, // Always true, cannot be disabled
    functional: true,
    analytics: true,
    marketing: false
  });

  const cookieTypes = [
    {
      type: 'Necessary',
      icon: <LockOutlined />,
      title: 'Cookie cần thiết',
      description: 'Những cookie cần thiết để website hoạt động bình thường. Không thể tắt.',
      enabled: cookieSettings.necessary,
      canDisable: false,
      color: 'red',
      examples: ['Phiên đăng nhập', 'Giỏ hàng', 'Bảo mật', 'Tùy chọn ngôn ngữ'],
      duration: 'Phiên làm việc hoặc 1 năm'
    },
    {
      type: 'Functional',
      icon: <SettingOutlined />,
      title: 'Cookie chức năng',
      description: 'Giúp website ghi nhớ các tùy chọn của bạn để cải thiện trải nghiệm.',
      enabled: cookieSettings.functional,
      canDisable: true,
      color: 'blue',
      examples: ['Theme tối/sáng', 'Kích thước font', 'Vị trí địa lý', 'Tùy chọn hiển thị'],
      duration: '1 năm'
    },
    {
      type: 'Analytics',
      icon: <BarChartOutlined />,
      title: 'Cookie phân tích',
      description: 'Giúp chúng tôi hiểu cách bạn sử dụng website để cải thiện dịch vụ.',
      enabled: cookieSettings.analytics,
      canDisable: true,
      color: 'green',
      examples: ['Google Analytics', 'Heatmap', 'Thống kê truy cập', 'Báo cáo lỗi'],
      duration: '2 năm'
    },
    {
      type: 'Marketing',
      icon: <EyeOutlined />,
      title: 'Cookie marketing',
      description: 'Được sử dụng để hiển thị quảng cáo phù hợp với sở thích của bạn.',
      enabled: cookieSettings.marketing,
      canDisable: true,
      color: 'orange',
      examples: ['Facebook Pixel', 'Google Ads', 'Remarketing', 'Quảng cáo cá nhân hóa'],
      duration: '90 ngày'
    }
  ];

  const specificCookies = [
    {
      name: '_mosaic_session',
      purpose: 'Quản lý phiên đăng nhập',
      type: 'Necessary',
      duration: 'Phiên làm việc',
      domain: 'mosaicstore.vercel.app'
    },
    {
      name: '_mosaic_cart',
      purpose: 'Lưu trữ giỏ hàng',
      type: 'Necessary',
      duration: '7 ngày',
      domain: 'mosaicstore.vercel.app'
    },
    {
      name: '_mosaic_lang',
      purpose: 'Ghi nhớ ngôn ngữ',
      type: 'Functional',
      duration: '1 năm',
      domain: 'mosaicstore.vercel.app'
    },
    {
      name: '_mosaic_theme',
      purpose: 'Ghi nhớ theme tối/sáng',
      type: 'Functional',
      duration: '1 năm',
      domain: 'mosaicstore.vercel.app'
    },
    {
      name: '_ga',
      purpose: 'Google Analytics tracking',
      type: 'Analytics',
      duration: '2 năm',
      domain: '.mosaicstore.vercel.app'
    },
    {
      name: '_fbp',
      purpose: 'Facebook Pixel tracking',
      type: 'Marketing',
      duration: '90 ngày',
      domain: '.mosaicstore.vercel.app'
    }
  ];

  const handleCookieToggle = (type: string, enabled: boolean) => {
    setCookieSettings(prev => ({
      ...prev,
      [type]: enabled
    }));
  };

  const saveSettings = () => {
    // Save settings to localStorage or send to server
    localStorage.setItem('mosaic_cookie_preferences', JSON.stringify(cookieSettings));
    alert('Đã lưu tùy chọn cookie!');
  };

  const clearAllCookies = () => {
    // Clear all cookies except necessary ones
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    alert('Đã xóa tất cả cookie không cần thiết!');
  };

  const columns = [
    {
      title: 'Tên Cookie',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text code>{text}</Text>
    },
    {
      title: 'Mục đích',
      dataIndex: 'purpose',
      key: 'purpose'
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors: { [key: string]: string } = {
          'Necessary': 'red',
          'Functional': 'blue', 
          'Analytics': 'green',
          'Marketing': 'orange'
        };
        return <Tag color={colors[type]}>{type}</Tag>;
      }
    },
    {
      title: 'Thời hạn',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
      render: (text: string) => <Text type="secondary">{text}</Text>
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BookOutlined className="text-6xl text-orange-500 mb-6" />
            <Title level={1} className="mb-6 text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Chính sách Cookie
            </Title>
            <Paragraph className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Tìm hiểu về cách MOSAIC sử dụng cookie để cải thiện trải nghiệm của bạn trên website
            </Paragraph>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Cập nhật lần cuối: 15 tháng 6, 2025
            </Text>
          </motion.div>
        </div>
      </section>

      {/* What are Cookies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-4xl mx-auto">
              <Title level={2} className="text-center mb-8">
                Cookie là gì?
              </Title>
              
              <Card className="mb-8">
                <Row gutter={[24, 24]} align="middle">
                  <Col xs={24} md={8} className="text-center">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-8xl mb-4"
                    >
                      🍪
                    </motion.div>
                  </Col>
                  <Col xs={24} md={16}>
                    <Paragraph className="text-lg leading-relaxed dark:text-gray-300">
                      Cookie là những tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi bạn 
                      truy cập website. Chúng giúp website "ghi nhớ" thông tin về lượt truy cập 
                      của bạn, giúp cải thiện trải nghiệm sử dụng.
                    </Paragraph>
                    <Paragraph className="text-lg leading-relaxed dark:text-gray-300">
                      MOSAIC sử dụng cookie để đảm bảo website hoạt động tốt, cung cấp các tính năng 
                      được cá nhân hóa và phân tích cách sử dụng của bạn để cải thiện dịch vụ.
                    </Paragraph>
                  </Col>
                </Row>
              </Card>

              <Alert
                message="🔒 Cam kết bảo mật"
                description="MOSAIC cam kết bảo vệ quyền riêng tư của bạn. Chúng tôi chỉ sử dụng cookie cần thiết cho hoạt động của website và không chia sẻ thông tin cá nhân với bên thứ ba mà không có sự đồng ý của bạn."
                type="info"
                showIcon
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-16">
              Các loại Cookie chúng tôi sử dụng
            </Title>
            
            <Row gutter={[24, 24]}>
              {cookieTypes.map((cookie, index) => (
                <Col xs={24} lg={12} key={cookie.type}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`text-3xl text-${cookie.color}-500 mr-4`}>
                            {cookie.icon}
                          </div>
                          <div>
                            <Title level={4} className="mb-1">{cookie.title}</Title>
                            <Text className={`text-${cookie.color}-600 font-medium`}>
                              {cookie.type}
                            </Text>
                          </div>
                        </div>
                        <Switch
                          checked={cookie.enabled}
                          disabled={!cookie.canDisable}
                          onChange={(enabled) => handleCookieToggle(cookie.type.toLowerCase(), enabled)}
                          className={!cookie.canDisable ? 'opacity-50' : ''}
                        />
                      </div>
                      
                      <Paragraph className="dark:text-gray-300 mb-4 leading-relaxed">
                        {cookie.description}
                      </Paragraph>
                      
                      <div className="space-y-3">
                        <div>
                          <Text strong className="block mb-2">Ví dụ:</Text>
                          <div className="flex flex-wrap gap-1">
                            {cookie.examples.map((example, idx) => (
                              <Tag key={idx} color={cookie.color} className="mb-1">
                                {example}
                              </Tag>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <Text strong className="text-gray-700 dark:text-gray-300">
                            ⏱️ Thời hạn lưu trữ: {cookie.duration}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            {/* Cookie Settings Panel */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card title="🔧 Quản lý tùy chọn Cookie">
                <div className="space-y-4 mb-6">
                  <Alert
                    message="Lưu ý quan trọng"
                    description="Việc tắt một số cookie có thể ảnh hưởng đến trải nghiệm sử dụng website. Cookie cần thiết không thể được tắt vì chúng cần thiết cho hoạt động cơ bản của website."
                    type="warning"
                    showIcon
                  />
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      type="primary" 
                      icon={<CheckCircleOutlined />}
                      onClick={saveSettings}
                    >
                      Lưu tùy chọn
                    </Button>
                    <Button 
                      icon={<DeleteOutlined />}
                      onClick={clearAllCookies}
                    >
                      Xóa tất cả Cookie
                    </Button>
                    <Button 
                      type="dashed"
                      onClick={() => {
                        setCookieSettings({
                          necessary: true,
                          functional: true,
                          analytics: true,
                          marketing: true
                        });
                      }}
                    >
                      Chấp nhận tất cả
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Specific Cookies Table */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Chi tiết các Cookie cụ thể
            </Title>
            
            <Card>
              <Table
                columns={columns}
                dataSource={specificCookies}
                pagination={false}
                rowKey="name"
                scroll={{ x: 800 }}
                className="cookie-table"
              />
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How to Manage Cookies */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Cách quản lý Cookie trong trình duyệt
            </Title>
            
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-4">🌐</div>
                  <Title level={4}>Chrome</Title>
                  <Paragraph className="text-sm">
                    Settings → Privacy and security → Cookies and other site data
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-4">🦊</div>
                  <Title level={4}>Firefox</Title>
                  <Paragraph className="text-sm">
                    Options → Privacy & Security → Cookies and Site Data
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-4">🧭</div>
                  <Title level={4}>Safari</Title>
                  <Paragraph className="text-sm">
                    Preferences → Privacy → Manage Website Data
                  </Paragraph>
                </Card>
              </Col>
            </Row>

            <Card className="mt-8">
              <Title level={4} className="mb-4">📱 Trên thiết bị di động</Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <Title level={5}>iOS Safari:</Title>
                    <Text className="text-sm">
                      Settings → Safari → Advanced → Website Data
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <Title level={5}>Android Chrome:</Title>
                    <Text className="text-sm">
                      Chrome → Settings → Privacy → Clear browsing data
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BookOutlined className="text-5xl mb-6" />
            <Title level={2} className="text-white mb-4">
              Có thắc mắc về Cookie?
            </Title>
            <Paragraph className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Liên hệ với chúng tôi nếu bạn cần hỗ trợ thêm về chính sách cookie
            </Paragraph>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:mosaic.threadsstory@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 no-underline"
              >
                📧 Email hỗ trợ
              </motion.a>
              <motion.a
                href="tel:+84833223299"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300 no-underline"
              >
                📞 Hotline: 0833 223 299
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .cookie-table .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
        }
        
        .cookie-table .ant-table-tbody > tr:hover > td {
          background-color: #fff7e6;
        }
        
        @media (max-width: 768px) {
          .cookie-table .ant-table-thead > tr > th,
          .cookie-table .ant-table-tbody > tr > td {
            font-size: 12px;
            padding: 8px 4px;
          }
        }
      `}</style>
    </MainLayout>
  );
};

export default CookiesPage;