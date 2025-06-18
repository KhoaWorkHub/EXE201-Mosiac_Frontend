import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Card, Row, Col, Table, Alert, Button, Steps } from 'antd';
import { 
  UserOutlined,
  QuestionCircleOutlined,
  CustomerServiceOutlined,
  HeartOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;

const SizeGuidePage: React.FC = () => {

  // Size chart data
  const sizeChartData = {
    unisex: [
      {
        key: 'S',
        size: 'S',
        chest: '88-92',
        length: '66',
        shoulder: '42',
        weight: '45-55',
        height: '155-165'
      },
      {
        key: 'M',
        size: 'M',
        chest: '92-96',
        length: '68',
        shoulder: '44',
        weight: '55-65',
        height: '160-170'
      },
      {
        key: 'L',
        size: 'L',
        chest: '96-100',
        length: '70',
        shoulder: '46',
        weight: '65-75',
        height: '165-175'
      },
      {
        key: 'XL',
        size: 'XL',
        chest: '100-104',
        length: '72',
        shoulder: '48',
        weight: '75-85',
        height: '170-180'
      },
      {
        key: 'XXL',
        size: 'XXL',
        chest: '104-108',
        length: '74',
        shoulder: '50',
        weight: '85-95',
        height: '175-185'
      }
    ]
  };

  const columns = [
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (text: string) => <Text strong className="text-lg">{text}</Text>
    },
    {
      title: 'Ngực (cm)',
      dataIndex: 'chest',
      key: 'chest',
      render: (text: string) => <Text>{text}</Text>
    },
    {
      title: 'Dài áo (cm)',
      dataIndex: 'length',
      key: 'length',
      render: (text: string) => <Text>{text}</Text>
    },
    {
      title: 'Vai (cm)',
      dataIndex: 'shoulder',
      key: 'shoulder',
      render: (text: string) => <Text>{text}</Text>
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      key: 'weight',
      render: (text: string) => <Text className="text-blue-600">{text}</Text>
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
      key: 'height',
      render: (text: string) => <Text className="text-green-600">{text}</Text>
    }
  ];

  const measurementSteps = [
    {
      title: 'Vòng ngực',
      description: 'Đo quanh phần rộng nhất của ngực, giữ thước đo ngang',
      image: '/assets/size-guide/chest-measurement.jpg',
      tips: 'Thở bình thường, không hít sâu hay thở ra hết'
    },
    {
      title: 'Dài áo',
      description: 'Đo từ điểm cao nhất của vai xuống đến eo hoặc mông',
      image: '/assets/size-guide/length-measurement.jpg',
      tips: 'Đứng thẳng, để thước đo theo đường dọc cơ thể'
    },
    {
      title: 'Rộng vai',
      description: 'Đo từ mép vai này sang mép vai kia qua lưng',
      image: '/assets/size-guide/shoulder-measurement.jpg',
      tips: 'Thả lỏng hai vai, không cúi hay nghiêng người'
    }
  ];

  const fitGuide = [
    {
      fit: 'Slim Fit',
      description: 'Ôm vừa phải, tôn dáng',
      recommend: 'Chọn đúng size hoặc size nhỏ hơn 1 size',
      style: 'Modern, trẻ trung',
      icon: '👔'
    },
    {
      fit: 'Regular Fit',
      description: 'Vừa vặn thoải mái',
      recommend: 'Chọn đúng size theo bảng',
      style: 'Cổ điển, thoải mái',
      icon: '👕'
    },
    {
      fit: 'Oversized',
      description: 'Rộng rãi, phong cách street',
      recommend: 'Chọn size lớn hơn 1-2 size',
      style: 'Trendy, cá tính',
      icon: '🧥'
    }
  ];

  const commonQuestions = [
    {
      question: 'Tôi nằm giữa 2 size, nên chọn size nào?',
      answer: 'Nếu bạn thích mặc vừa vặn, chọn size nhỏ hơn. Nếu thích thoải mái hơn, chọn size lớn hơn. MOSAIC khuyến khích chọn size lớn hơn để thoải mái.'
    },
    {
      question: 'Áo có co rút sau khi giặt không?',
      answer: 'Áo thun MOSAIC được pre-shrunk, co rút tối đa 2-3%. Nếu lo lắng, bạn có thể chọn size lớn hơn 1 size.'
    },
    {
      question: 'Làm sao biết form áo phù hợp với dáng người?',
      answer: 'Người gầy: chọn Slim Fit. Người trung bình: Regular Fit. Người muốn che khuyết điểm: Oversized.'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={1} className="mb-6 text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Hướng dẫn chọn size
            </Title>
            <Paragraph className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Tìm size hoàn hảo cho bạn với hướng dẫn chi tiết và bảng size chuẩn của MOSAIC
            </Paragraph>
          </motion.div>
        </div>
      </section>

      {/* Quick Size Calculator */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Tìm size của bạn
            </Title>
            <Row gutter={[24, 24]} className="mb-12">
              <Col xs={24} sm={8}>
                <motion.div whileHover={{ scale: 1.05, y: -5 }}>
                  <Card className="text-center h-full border-purple-200 hover:shadow-xl transition-all duration-300">
                    <UserOutlined className="text-4xl text-purple-500 mb-4" />
                    <Title level={4}>Theo cân nặng & chiều cao</Title>
                    <Paragraph className="text-gray-600 dark:text-gray-300">
                      Cách nhanh nhất để tìm size phù hợp
                    </Paragraph>
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} sm={8}>
                <motion.div whileHover={{ scale: 1.05, y: -5 }}>
                  <Card className="text-center h-full border-blue-200 hover:shadow-xl transition-all duration-300">
                    <Title level={4}>Theo số đo cơ thể</Title>
                    <Paragraph className="text-gray-600 dark:text-gray-300">
                      Chính xác nhất, phù hợp mọi dáng người
                    </Paragraph>
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} sm={8}>
                <motion.div whileHover={{ scale: 1.05, y: -5 }}>
                  <Card className="text-center h-full border-green-200 hover:shadow-xl transition-all duration-300">
                    <CustomerServiceOutlined className="text-4xl text-green-500 mb-4" />
                    <Title level={4}>Tư vấn trực tiếp</Title>
                    <Paragraph className="text-gray-600 dark:text-gray-300">
                      Liên hệ để được hỗ trợ cá nhân hóa
                    </Paragraph>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Size Chart */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-8">
              Bảng size chi tiết
            </Title>
            <div className="max-w-6xl mx-auto">
              <Card className="shadow-lg">
                <div className="mb-6">
                  <Alert
                    message="💡 Lưu ý"
                    description="Tất cả số đo tính bằng cm. Bảng size này áp dụng cho áo thun unisex form regular."
                    type="info"
                    showIcon
                    className="mb-4"
                  />
                </div>
                
                <div className="overflow-x-auto">
                  <Table
                    columns={columns}
                    dataSource={sizeChartData.unisex}
                    pagination={false}
                    className="size-table"
                    scroll={{ x: 800 }}
                  />
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Text strong className="text-blue-600">Size phổ biến nhất</Text>
                    <div className="text-2xl font-bold text-blue-600 mt-2">M & L</div>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Phù hợp với 70% khách hàng
                    </Text>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Text strong className="text-green-600">Đổi size miễn phí</Text>
                    <div className="text-2xl font-bold text-green-600 mt-2">7 ngày</div>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Nếu size không vừa
                    </Text>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <Text strong className="text-purple-600">Tư vấn miễn phí</Text>
                    <div className="text-2xl font-bold text-purple-600 mt-2">24/7</div>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Hotline: 0833 223 299
                    </Text>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How to Measure */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Cách đo số đo cơ thể
            </Title>
            <div className="max-w-4xl mx-auto">
              <Steps direction="vertical" size="default" className="custom-measurement-steps">
                {measurementSteps.map((step, index) => (
                  <Steps.Step
                    key={index}
                    title={step.title}
                    description={
                      <div className="mt-4">
                        <Paragraph className="text-base mb-3">
                          {step.description}
                        </Paragraph>
                        <Alert
                          message={`💡 Mẹo: ${step.tips}`}
                          type="success"
                          showIcon={false}
                          className="mb-4"
                        />
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
                          <div className="text-4xl mb-2">📏</div>
                          <Text className="text-sm text-gray-600 dark:text-gray-400">
                            Hình minh họa sẽ được cập nhật
                          </Text>
                        </div>
                      </div>
                    }
                  />
                ))}
              </Steps>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fit Guide */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Hướng dẫn chọn form áo
            </Title>
            <Row gutter={[24, 24]}>
              {fitGuide.map((fit, index) => (
                <Col xs={24} lg={8} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full text-center hover:shadow-xl transition-all duration-300">
                      <div className="text-5xl mb-4">{fit.icon}</div>
                      <Title level={3} className="mb-3">{fit.fit}</Title>
                      <Paragraph className="text-gray-600 dark:text-gray-300 mb-4">
                        {fit.description}
                      </Paragraph>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                        <Text strong className="text-blue-600">Cách chọn: </Text>
                        <br />
                        <Text>{fit.recommend}</Text>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                        <Text strong className="text-purple-600">Phong cách: </Text>
                        <br />
                        <Text>{fit.style}</Text>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Câu hỏi thường gặp về size
            </Title>
            <div className="max-w-4xl mx-auto">
              <Row gutter={[24, 24]}>
                {commonQuestions.map((qa, index) => (
                  <Col xs={24} key={index}>
                    <Card className="hover:shadow-md transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <QuestionCircleOutlined className="text-2xl text-blue-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <Title level={4} className="mb-3 text-blue-600">
                            {qa.question}
                          </Title>
                          <Paragraph className="text-gray-600 dark:text-gray-300 mb-0">
                            {qa.answer}
                          </Paragraph>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Size Guarantee */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeartOutlined className="text-5xl mb-6" />
            <Title level={2} className="text-white mb-4">
              Cam kết về size
            </Title>
            <Paragraph className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              MOSAIC cam kết đổi size miễn phí nếu bạn chọn không vừa. 
              Sự hài lòng của khách hàng là ưu tiên hàng đầu của chúng tôi.
            </Paragraph>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="large"
                  className="bg-white text-green-600 border-white hover:bg-gray-100 h-12 px-8 font-semibold"
                  href="tel:+84833223299"
                >
                  📞 Tư vấn size: 0833 223 299
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="large"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-green-600 h-12 px-8 font-semibold"
                  href="/returns"
                >
                  📝 Xem chính sách đổi trả
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .size-table .ant-table-thead > tr > th {
          background-color: #f0f2f5;
          font-weight: 600;
          text-align: center;
        }
        
        .size-table .ant-table-tbody > tr > td {
          text-align: center;
          padding: 12px 8px;
        }
        
        .size-table .ant-table-tbody > tr:hover > td {
          background-color: #e6f7ff;
        }
        
        .custom-measurement-steps .ant-steps-item-icon {
          border-color: #722ed1;
        }
        
        .custom-measurement-steps .ant-steps-item-process .ant-steps-item-icon {
          background-color: #722ed1;
        }
        
        .custom-measurement-steps .ant-steps-item-finish .ant-steps-item-icon {
          background-color: #52c41a;
          border-color: #52c41a;
        }
        
        @media (max-width: 768px) {
          .size-table .ant-table-thead > tr > th,
          .size-table .ant-table-tbody > tr > td {
            font-size: 12px;
            padding: 8px 4px;
          }
          
          .custom-measurement-steps {
            direction: vertical;
          }
        }
      `}</style>
    </MainLayout>
  );
};

export default SizeGuidePage;