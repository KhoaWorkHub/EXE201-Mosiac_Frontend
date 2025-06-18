import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Card, Row, Col, Steps, Timeline, Alert, Button } from 'antd';
import { 
  UndoOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  CustomerServiceOutlined,
  SafetyOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;

const ReturnsPage: React.FC = () => {
  const returnConditions = [
    {
      icon: <ClockCircleOutlined />,
      title: 'Thời gian',
      description: 'Trong vòng 7 ngày kể từ ngày nhận hàng',
      valid: true
    },
    {
      icon: <SafetyOutlined />,
      title: 'Tình trạng sản phẩm',
      description: 'Còn nguyên tem mác, chưa qua sử dụng',
      valid: true
    },
    {
      icon: <CheckCircleOutlined />,
      title: 'Bao bì',
      description: 'Còn nguyên bao bì gốc hoặc túi zip',
      valid: true
    },
    {
      icon: <ExclamationCircleOutlined />,
      title: 'Không mùi lạ',
      description: 'Sản phẩm không có mùi nước hoa, thuốc lá',
      valid: true
    }
  ];

  const freeReturnCases = [
    'Sản phẩm bị lỗi từ nhà sản xuất',
    'Giao sai mẫu, sai size so với đơn hàng',
    'Sản phẩm bị hư hỏng trong quá trình vận chuyển',
    'Chất lượng sản phẩm không đúng như mô tả'
  ];

  const customerReturnCases = [
    'Khách hàng đổi ý, không thích sản phẩm',
    'Chọn sai size (không có size khác để đổi)',
    'Không vừa ý như mong đợi'
  ];

  const returnSteps = [
    {
      title: 'Liên hệ MOSAIC',
      description: 'Gọi hotline hoặc inbox fanpage trong vòng 7 ngày',
      icon: <PhoneOutlined />
    },
    {
      title: 'Cung cấp thông tin',
      description: 'Mã đơn hàng, lý do đổi trả, ảnh sản phẩm',
      icon: <ExclamationCircleOutlined />
    },
    {
      title: 'Xác nhận đổi trả',
      description: 'MOSAIC xác nhận và hướng dẫn cách gửi trả',
      icon: <CheckCircleOutlined />
    },
    {
      title: 'Gửi sản phẩm',
      description: 'Đóng gói cẩn thận và gửi về địa chỉ được cung cấp',
      icon: <UndoOutlined />
    },
    {
      title: 'Xử lý hoàn tất',
      description: 'Nhận sản phẩm mới hoặc hoàn tiền trong 3-7 ngày',
      icon: <DollarOutlined />
    }
  ];

  const refundTimeline = [
    {
      time: 'Ngay lập tức',
      event: 'Khách hàng liên hệ đổi trả',
      color: 'blue'
    },
    {
      time: '1-2 ngày',
      event: 'MOSAIC xác nhận và hướng dẫn',
      color: 'green'
    },
    {
      time: '2-3 ngày',
      event: 'Khách hàng gửi sản phẩm về',
      color: 'orange'
    },
    {
      time: '1 ngày',
      event: 'MOSAIC kiểm tra sản phẩm',
      color: 'purple'
    },
    {
      time: '3-7 ngày',
      event: 'Hoàn tiền hoặc gửi sản phẩm mới',
      color: 'red'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <UndoOutlined className="text-6xl text-red-500 mb-6" />
            <Title level={1} className="mb-6 text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Chính sách đổi trả
            </Title>
            <Paragraph className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              MOSAIC cam kết đổi trả dễ dàng, minh bạch và công bằng cho khách hàng
            </Paragraph>
          </motion.div>
        </div>
      </section>

      {/* Return Conditions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Điều kiện đổi trả
            </Title>
            <Row gutter={[24, 24]}>
              {returnConditions.map((condition, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="text-center h-full border-green-200 hover:shadow-xl transition-all duration-300">
                      <div className="text-4xl text-green-500 mb-4">
                        {condition.icon}
                      </div>
                      <Title level={4}>{condition.title}</Title>
                      <Paragraph className="text-gray-600 dark:text-gray-300">
                        {condition.description}
                      </Paragraph>
                      <CheckCircleOutlined className="text-2xl text-green-500 mt-2" />
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Free vs Paid Returns */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <Title level={2} className="text-center mb-12">
            Phân loại đổi trả
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card 
                  title={
                    <div className="flex items-center">
                      <CheckCircleOutlined className="text-green-500 mr-2 text-xl" />
                      <span className="text-green-600">Đổi trả MIỄN PHÍ</span>
                    </div>
                  }
                  className="h-full border-green-200"
                >
                  <ul className="space-y-3">
                    {freeReturnCases.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleOutlined className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Alert
                    message="MOSAIC chịu toàn bộ phí ship và xử lý nhanh chóng"
                    type="success"
                    showIcon
                    className="mt-4"
                  />
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card 
                  title={
                    <div className="flex items-center">
                      <DollarOutlined className="text-orange-500 mr-2 text-xl" />
                      <span className="text-orange-600">Đổi trả CÓ PHÍ</span>
                    </div>
                  }
                  className="h-full border-orange-200"
                >
                  <ul className="space-y-3">
                    {customerReturnCases.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <ExclamationCircleOutlined className="text-orange-500 mr-2 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Alert
                    message="Khách hàng chi trả phí ship 2 chiều (khoảng 60.000đ)"
                    type="warning"
                    showIcon
                    className="mt-4"
                  />
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Quy trình đổi trả
            </Title>
            <div className="max-w-4xl mx-auto">
              <Steps
                direction="vertical"
                size="default"
                className="custom-return-steps"
              >
                {returnSteps.map((step, index) => (
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

      {/* Refund Timeline */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Timeline hoàn tiền
            </Title>
            <div className="max-w-3xl mx-auto">
              <Timeline mode="left">
                {refundTimeline.map((item, index) => (
                  <Timeline.Item
                    key={index}
                    color={item.color}
                    label={<Text strong className="text-sm">{item.time}</Text>}
                  >
                    <Text className="text-base">{item.event}</Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
            <div className="text-center mt-8">
              <Alert
                message="Tổng thời gian xử lý: 7-14 ngày"
                description="Từ lúc liên hệ đến khi hoàn tất đổi trả/hoàn tiền"
                type="info"
                showIcon
                className="inline-block"
              />
            </div>
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
                <Card title="⚠️ Lưu ý quan trọng" className="h-full">
                  <ul className="space-y-3">
                    <li>• Không chấp nhận đổi trả sản phẩm đã qua giặt/sử dụng</li>
                    <li>• Sản phẩm sale/khuyến mãi chỉ được đổi size, không hoàn tiền</li>
                    <li>• Phải có hóa đơn mua hàng hoặc mã đơn hàng</li>
                    <li>• Không đổi trả sản phẩm order riêng theo yêu cầu</li>
                    <li>• Thời gian đổi trả tính từ ngày ghi trên hóa đơn giao hàng</li>
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
                <Card title="💡 Tips hữu ích" className="h-full">
                  <ul className="space-y-3">
                    <li>• Chụp ảnh unboxing để làm bằng chứng nếu cần</li>
                    <li>• Giữ nguyên túi zip và tem mác khi thử sản phẩm</li>
                    <li>• Liên hệ sớm để được hỗ trợ tốt nhất</li>
                    <li>• Đóng gói cẩn thận khi gửi trả để tránh hư hỏng</li>
                    <li>• Chọn dịch vụ ship có tracking để theo dõi</li>
                  </ul>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Câu hỏi thường gặp
            </Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8}>
                <Card className="h-full">
                  <Title level={4}>❓ Có thể đổi sang size khác không?</Title>
                  <Paragraph>
                    Có, bạn có thể đổi sang size khác nếu còn hàng. Nếu hết size cần đổi, 
                    chúng tôi sẽ hoàn tiền cho bạn.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card className="h-full">
                  <Title level={4}>💰 Khi nào được hoàn tiền?</Title>
                  <Paragraph>
                    Hoàn tiền trong vòng 3-7 ngày làm việc sau khi chúng tôi 
                    nhận được sản phẩm và xác nhận đạt điều kiện.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card className="h-full">
                  <Title level={4}>📦 Ai trả phí ship khi đổi trả?</Title>
                  <Paragraph>
                    Nếu lỗi từ MOSAIC: chúng tôi trả phí ship. 
                    Nếu khách hàng đổi ý: khách hàng trả phí ship 2 chiều.
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-r from-red-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <CustomerServiceOutlined className="text-5xl mb-6" />
            <Title level={2} className="text-white mb-4">
              Cần hỗ trợ đổi trả?
            </Title>
            <Paragraph className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Đội ngũ CSKH MOSAIC sẵn sàng hỗ trợ bạn 24/7
            </Paragraph>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  type="primary"
                  size="large"
                  icon={<PhoneOutlined />}
                  className="bg-white text-red-600 border-white hover:bg-gray-100 h-12 px-8 font-semibold"
                  href="tel:+84833223299"
                >
                  Gọi ngay: 0833 223 299
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="large"
                  icon={<MailOutlined />}
                  className="bg-transparent border-white text-white hover:bg-white hover:text-red-600 h-12 px-8 font-semibold"
                  href="mailto:mosaic.threadsstory@gmail.com"
                >
                  Email hỗ trợ
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .custom-return-steps .ant-steps-item-icon {
          border-color: #f5222d;
        }
        
        .custom-return-steps .ant-steps-item-process .ant-steps-item-icon {
          background-color: #f5222d;
        }
        
        .custom-return-steps .ant-steps-item-finish .ant-steps-item-icon {
          background-color: #52c41a;
          border-color: #52c41a;
        }
        
        .custom-return-steps .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon {
          color: white;
        }
        
        @media (max-width: 768px) {
          .custom-return-steps {
            direction: vertical;
          }
        }
      `}</style>
    </MainLayout>
  );
};

export default ReturnsPage;