import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Card, Row, Col, Timeline, Table, Tag, Steps } from 'antd';
import { 
  TruckOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  GiftOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;

const ShippingPage: React.FC = () => {
  const shippingZones = [
    {
      zone: 'Nội thành TP.HCM & Hà Nội',
      time: '1-2 ngày',
      fee: '30.000đ',
      freeShipCondition: 'Miễn phí từ 500.000đ',
      color: 'green'
    },
    {
      zone: 'Các tỉnh thành lớn',
      time: '2-3 ngày',
      fee: '30.000đ',
      freeShipCondition: 'Miễn phí từ 500.000đ',
      color: 'blue'
    },
    {
      zone: 'Các tỉnh thành khác',
      time: '3-5 ngày',
      fee: '35.000đ',
      freeShipCondition: 'Miễn phí từ 700.000đ',
      color: 'orange'
    },
    {
      zone: 'Vùng xa & hải đảo',
      time: '5-7 ngày',
      fee: '45.000đ',
      freeShipCondition: 'Miễn phí từ 1.000.000đ',
      color: 'red'
    }
  ];

  const shippingSteps = [
    {
      title: 'Xác nhận đơn hàng',
      description: 'Chúng tôi xác nhận và xử lý đơn hàng trong vòng 2-4 giờ',
      icon: <CheckCircleOutlined />
    },
    {
      title: 'Chuẩn bị hàng',
      description: 'Đóng gói cẩn thận và kiểm tra chất lượng',
      icon: <GiftOutlined />
    },
    {
      title: 'Bàn giao vận chuyển',
      description: 'Gửi hàng qua đối tác vận chuyển uy tín',
      icon: <TruckOutlined />
    },
    {
      title: 'Giao hàng thành công',
      description: 'Khách hàng nhận hàng và thanh toán (nếu COD)',
      icon: <SafetyOutlined />
    }
  ];

  const partners = [
    { name: 'Giao Hàng Nhanh (GHN)', coverage: 'Toàn quốc', speciality: 'Nhanh, uy tín' },
    { name: 'Giao Hàng Tiết Kiệm (GHTK)', coverage: 'Toàn quốc', speciality: 'Tiết kiệm, đa dạng' },
    { name: 'ViettelPost', coverage: 'Toàn quốc', speciality: 'Vùng xa' },
    { name: 'J&T Express', coverage: 'Thành phố lớn', speciality: 'Tốc độ cao' }
  ];

  const columns = [
    {
      title: 'Khu vực',
      dataIndex: 'zone',
      key: 'zone',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (text: string, record: any) => (
        <Tag color={record.color} icon={<ClockCircleOutlined />}>
          {text}
        </Tag>
      )
    },
    {
      title: 'Phí ship',
      dataIndex: 'fee',
      key: 'fee',
      render: (text: string) => (
        <Text strong className="text-red-500">
          {text}
        </Text>
      )
    },
    {
      title: 'Điều kiện freeship',
      dataIndex: 'freeShipCondition',
      key: 'freeShipCondition',
      render: (text: string) => (
        <Tag color="gold" icon={<GiftOutlined />}>
          {text}
        </Tag>
      )
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <TruckOutlined className="text-6xl text-blue-500 mb-6" />
            <Title level={1} className="mb-6 text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Chính sách vận chuyển
            </Title>
            <Paragraph className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              MOSAIC cam kết giao hàng nhanh chóng, an toàn và tiết kiệm trên toàn quốc
            </Paragraph>
          </motion.div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Row gutter={[24, 24]} className="mb-16">
            <Col xs={24} sm={12} lg={6}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="text-center h-full border-green-200 hover:shadow-xl transition-all duration-300">
                  <ClockCircleOutlined className="text-4xl text-green-500 mb-4" />
                  <Title level={4}>Giao hàng nhanh</Title>
                  <Paragraph>1-2 ngày nội thành<br />2-7 ngày toàn quốc</Paragraph>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="text-center h-full border-blue-200 hover:shadow-xl transition-all duration-300">
                  <DollarOutlined className="text-4xl text-blue-500 mb-4" />
                  <Title level={4}>Phí ship cố định</Title>
                  <Paragraph>Chỉ từ 30.000đ<br />Freeship từ 500.000đ</Paragraph>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="text-center h-full border-purple-200 hover:shadow-xl transition-all duration-300">
                  <SafetyOutlined className="text-4xl text-purple-500 mb-4" />
                  <Title level={4}>Đóng gói cẩn thận</Title>
                  <Paragraph>Bao bì chống nước<br />Kiểm tra kỹ trước gửi</Paragraph>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="text-center h-full border-orange-200 hover:shadow-xl transition-all duration-300">
                  <EnvironmentOutlined className="text-4xl text-orange-500 mb-4" />
                  <Title level={4}>Phủ sóng toàn quốc</Title>
                  <Paragraph>Giao đến 63 tỉnh thành<br />Kể cả vùng xa</Paragraph>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Shipping Zones Table */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-8">
              Bảng phí và thời gian vận chuyển
            </Title>
            <Card className="shadow-lg">
              <Table
                columns={columns}
                dataSource={shippingZones}
                pagination={false}
                rowKey="zone"
                className="responsive-table"
              />
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Text strong className="text-yellow-700 dark:text-yellow-300">
                  💡 Lưu ý: Thời gian giao hàng có thể chậm hơn 1-2 ngày trong các dịp lễ tết hoặc thời tiết xấu.
                </Text>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Shipping Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Quy trình vận chuyển
            </Title>
            <div className="max-w-4xl mx-auto">
              <Steps
                direction="vertical"
                size="default"
                className="custom-steps"
              >
                {shippingSteps.map((step, index) => (
                  <Steps.Step
                    key={index}
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                  />
                ))}
              </Steps>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Shipping Partners */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Đối tác vận chuyển
            </Title>
            <Row gutter={[24, 24]}>
              {partners.map((partner, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="text-center h-full hover:shadow-lg transition-all duration-300">
                      <TruckOutlined className="text-3xl text-blue-500 mb-4" />
                      <Title level={4}>{partner.name}</Title>
                      <Paragraph className="text-gray-600 dark:text-gray-300">
                        <strong>Phủ sóng:</strong> {partner.coverage}<br />
                        <strong>Đặc điểm:</strong> {partner.speciality}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card title="📋 Lưu ý quan trọng" className="h-full">
                  <ul className="space-y-3">
                    <li>• Đơn hàng sẽ được xử lý trong giờ hành chính (8h-17h, T2-T6)</li>
                    <li>• Khách hàng vui lòng kiểm tra kỹ thông tin địa chỉ trước khi đặt hàng</li>
                    <li>• Với đơn COD, khách hàng vui lòng chuẩn bị đủ tiền mặt khi nhận hàng</li>
                    <li>• Nếu gọi điện 3 lần không liên lạc được, đơn hàng sẽ được hoàn về</li>
                    <li>• Phí ship COD sẽ được tính thêm 10.000đ</li>
                  </ul>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card title="🎁 Chương trình đặc biệt" className="h-full">
                  <Timeline>
                    <Timeline.Item color="green">
                      <strong>Freeship toàn quốc</strong><br />
                      Đơn hàng từ 500.000đ
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                      <strong>Giao hàng nhanh</strong><br />
                      Same-day delivery tại TP.HCM & HN
                    </Timeline.Item>
                    <Timeline.Item color="purple">
                      <strong>Đóng gói quà tặng</strong><br />
                      Miễn phí cho đơn từ 300.000đ
                    </Timeline.Item>
                    <Timeline.Item color="orange">
                      <strong>Bảo hiểm hàng hóa</strong><br />
                      Đền bù 100% nếu thất lạc
                    </Timeline.Item>
                  </Timeline>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-white mb-4">
              Cần hỗ trợ về vận chuyển?
            </Title>
            <Paragraph className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Liên hệ ngay với chúng tôi để được tư vấn và hỗ trợ tốt nhất
            </Paragraph>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="tel:+84833223299"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 no-underline"
              >
                📞 Hotline: 0833 223 299
              </motion.a>
              <motion.a
                href="mailto:mosaic.threadsstory@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 no-underline"
              >
                ✉️ Email support
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .custom-steps .ant-steps-item-icon {
          border-color: #1890ff;
        }
        
        .custom-steps .ant-steps-item-process .ant-steps-item-icon {
          background-color: #1890ff;
        }
        
        .responsive-table .ant-table {
          overflow-x: auto;
        }
        
        @media (max-width: 768px) {
          .custom-steps {
            direction: vertical;
          }
          
          .responsive-table .ant-table-thead > tr > th,
          .responsive-table .ant-table-tbody > tr > td {
            font-size: 12px;
            padding: 8px 4px;
          }
        }
      `}</style>
    </MainLayout>
  );
};

export default ShippingPage;