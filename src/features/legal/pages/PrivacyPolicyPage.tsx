import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Card, Row, Col, Timeline, Alert, Anchor } from 'antd';
import { 
  EyeInvisibleOutlined,
  LockOutlined,
  UserOutlined,
  DatabaseOutlined,
  SettingOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;
const { Link } = Anchor;

const PrivacyPolicyPage: React.FC = () => {
  const dataTypes = [
    {
      icon: <UserOutlined />,
      title: 'Thông tin cá nhân',
      description: 'Họ tên, email, số điện thoại, địa chỉ giao hàng',
      usage: 'Xử lý đơn hàng và liên lạc với khách hàng',
      color: 'blue'
    },
    {
      icon: <DatabaseOutlined />,
      title: 'Thông tin đơn hàng',
      description: 'Lịch sử mua hàng, sở thích sản phẩm',
      usage: 'Cải thiện dịch vụ và gợi ý sản phẩm phù hợp',
      color: 'green'
    },
    {
      icon: <SettingOutlined />,
      title: 'Dữ liệu kỹ thuật',
      description: 'IP address, trình duyệt, thời gian truy cập',
      usage: 'Phân tích và cải thiện trải nghiệm website',
      color: 'orange'
    }
  ];

  const protectionMeasures = [
    {
      measure: 'Mã hóa SSL',
      description: 'Tất cả dữ liệu được mã hóa khi truyền tải',
      icon: '🔒'
    },
    {
      measure: 'Firewall bảo mật',
      description: 'Hệ thống tường lửa ngăn chặn truy cập trái phép',
      icon: '🛡️'
    },
    {
      measure: 'Backup thường xuyên',
      description: 'Sao lưu dữ liệu định kỳ để phòng ngừa mất mát',
      icon: '💾'
    },
    {
      measure: 'Kiểm soát truy cập',
      description: 'Chỉ nhân viên được ủy quyền mới có thể truy cập',
      icon: '👥'
    }
  ];

  const userRights = [
    {
      right: 'Quyền được biết',
      description: 'Bạn có quyền biết chúng tôi thu thập và sử dụng dữ liệu như thế nào'
    },
    {
      right: 'Quyền truy cập',
      description: 'Bạn có thể yêu cầu xem thông tin cá nhân mà chúng tôi đang lưu trữ'
    },
    {
      right: 'Quyền chỉnh sửa',
      description: 'Bạn có thể yêu cầu sửa đổi thông tin cá nhân không chính xác'
    },
    {
      right: 'Quyền xóa',
      description: 'Bạn có thể yêu cầu xóa thông tin cá nhân trong một số trường hợp'
    },
    {
      right: 'Quyền từ chối',
      description: 'Bạn có thể từ chối nhận email marketing bất cứ lúc nào'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={1} className="mb-6 text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Chính sách bảo mật
            </Title>
            <Paragraph className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              MOSAIC cam kết bảo vệ thông tin cá nhân và quyền riêng tư của khách hàng một cách tối đa
            </Paragraph>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Cập nhật lần cuối: 15 tháng 6, 2025
            </Text>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4">
          <Anchor direction="horizontal" className="text-center">
            <Link href="#thu-thap" title="Thu thập thông tin" />
            <Link href="#su-dung" title="Sử dụng thông tin" />
            <Link href="#bao-mat" title="Bảo mật dữ liệu" />
            <Link href="#quyen-loi" title="Quyền lợi khách hàng" />
            <Link href="#lien-he" title="Liên hệ" />
          </Anchor>
        </div>
      </section>

      {/* Data Collection */}
      <section id="thu-thap" className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Thông tin chúng tôi thu thập
            </Title>
            <Row gutter={[24, 24]}>
              {dataTypes.map((type, index) => (
                <Col xs={24} lg={8} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 border-l-4" 
                          style={{ borderLeftColor: type.color === 'blue' ? '#1890ff' : type.color === 'green' ? '#52c41a' : '#fa8c16' }}>
                      <div className={`text-4xl mb-4 text-${type.color}-500`}>
                        {type.icon}
                      </div>
                      <Title level={4}>{type.title}</Title>
                      <Paragraph className="text-gray-600 dark:text-gray-300 mb-4">
                        <strong>Bao gồm:</strong> {type.description}
                      </Paragraph>
                      <div className={`bg-${type.color}-50 dark:bg-${type.color}-900/20 rounded-lg p-3`}>
                        <Text strong className={`text-${type.color}-600`}>Mục đích sử dụng:</Text>
                        <br />
                        <Text className="text-sm">{type.usage}</Text>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
            
            <Alert
              message="🛡️ Cam kết bảo mật"
              description="MOSAIC chỉ thu thập thông tin cần thiết và KHÔNG BAO GIỜ bán hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương mại."
              type="success"
              showIcon
              className="mt-8"
            />
          </motion.div>
        </div>
      </section>

      {/* Data Usage */}
      <section id="su-dung" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Cách chúng tôi sử dụng thông tin
            </Title>
            <div className="max-w-4xl mx-auto">
              <Timeline>
                <Timeline.Item 
                  dot={<UserOutlined className="text-blue-500" />}
                  color="blue"
                >
                  <Title level={4}>Xử lý đơn hàng</Title>
                  <Paragraph>
                    Sử dụng thông tin liên lạc và địa chỉ để xác nhận đơn hàng, 
                    giao hàng và hỗ trợ khách hàng.
                  </Paragraph>
                </Timeline.Item>
                
                <Timeline.Item 
                  dot={<MailOutlined className="text-green-500" />}
                  color="green"
                >
                  <Title level={4}>Gửi thông báo</Title>
                  <Paragraph>
                    Gửi email xác nhận đơn hàng, thông báo trạng thái giao hàng, 
                    và thông tin khuyến mãi (nếu bạn đồng ý).
                  </Paragraph>
                </Timeline.Item>
                
                <Timeline.Item 
                  dot={<SettingOutlined className="text-orange-500" />}
                  color="orange"
                >
                  <Title level={4}>Cải thiện dịch vụ</Title>
                  <Paragraph>
                    Phân tích hành vi mua sắm để cải thiện website, 
                    phát triển sản phẩm mới và cá nhân hóa trải nghiệm.
                  </Paragraph>
                </Timeline.Item>
                
                <Timeline.Item 
                  color="purple"
                >
                  <Title level={4}>Bảo mật & tuân thủ</Title>
                  <Paragraph>
                    Ngăn chặn gian lận, bảo vệ tài khoản và tuân thủ 
                    các quy định pháp luật về thương mại điện tử.
                  </Paragraph>
                </Timeline.Item>
              </Timeline>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Measures */}
      <section id="bao-mat" className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Biện pháp bảo mật
            </Title>
            <Row gutter={[24, 24]}>
              {protectionMeasures.map((measure, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="text-center h-full hover:shadow-lg transition-all duration-300">
                      <div className="text-5xl mb-4">{measure.icon}</div>
                      <Title level={4}>{measure.measure}</Title>
                      <Paragraph className="text-gray-600 dark:text-gray-300">
                        {measure.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
            
            <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="text-center">
                <LockOutlined className="text-4xl text-blue-500 mb-4" />
                <Title level={3}>Chứng nhận bảo mật</Title>
                <Paragraph className="text-lg mb-4">
                  Website MOSAIC được bảo vệ bởi chứng chỉ SSL 256-bit và tuân thủ 
                  các tiêu chuẩn bảo mật quốc tế.
                </Paragraph>
                <div className="flex justify-center space-x-4">
                  <div className="bg-white rounded-lg p-3 shadow-md">
                    <Text strong>🔒 SSL Secured</Text>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-md">
                    <Text strong>🛡️ GDPR Compliant</Text>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* User Rights */}
      <section id="quyen-loi" className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Quyền lợi của khách hàng
            </Title>
            <div className="max-w-4xl mx-auto">
              <Row gutter={[24, 24]}>
                {userRights.map((right, index) => (
                  <Col xs={24} md={12} key={index}>
                    <Card className="h-full hover:shadow-md transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <Title level={4} className="mb-2 text-purple-600">
                            {right.right}
                          </Title>
                          <Paragraph className="text-gray-600 dark:text-gray-300 mb-0">
                            {right.description}
                          </Paragraph>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
              
              <Alert
                message="💡 Cách thực hiện quyền của bạn"
                description="Để thực hiện bất kỳ quyền nào ở trên, vui lòng liên hệ với chúng tôi qua email mosaic.threadsstory@gmail.com hoặc hotline 0833 223 299. Chúng tôi sẽ phản hồi trong vòng 72 giờ."
                type="info"
                showIcon
                className="mt-8"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cookies Policy */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-8">
              Chính sách Cookie
            </Title>
            <div className="max-w-4xl mx-auto">
              <Card>
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={8}>
                    <div className="text-center">
                      <div className="text-4xl mb-4">🍪</div>
                      <Title level={4}>Cookie cần thiết</Title>
                      <Paragraph className="text-sm">
                        Giúp website hoạt động bình thường
                      </Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="text-center">
                      <div className="text-4xl mb-4">📊</div>
                      <Title level={4}>Cookie phân tích</Title>
                      <Paragraph className="text-sm">
                        Hiểu cách bạn sử dụng website
                      </Paragraph>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="text-center">
                      <div className="text-4xl mb-4">🎯</div>
                      <Title level={4}>Cookie marketing</Title>
                      <Paragraph className="text-sm">
                        Cá nhân hóa quảng cáo (tuỳ chọn)
                      </Paragraph>
                    </div>
                  </Col>
                </Row>
                
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Text strong>🔧 Quản lý Cookie: </Text>
                  Bạn có thể quản lý hoặc xóa cookie thông qua cài đặt trình duyệt. 
                  Tuy nhiên, việc vô hiệu hóa cookie có thể ảnh hưởng đến trải nghiệm sử dụng website.
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Data Sharing */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-8">
              Chia sẻ thông tin với bên thứ ba
            </Title>
            <div className="max-w-4xl mx-auto">
              <Alert
                message="🚫 KHÔNG chia sẻ vì mục đích thương mại"
                description="MOSAIC cam kết KHÔNG BAO GIỜ bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương mại."
                type="error"
                showIcon
                className="mb-6"
              />
              
              <Card title="Các trường hợp chia sẻ có thể xảy ra:">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <EyeInvisibleOutlined className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <Text strong>Đối tác vận chuyển: </Text>
                      Chia sẻ thông tin giao hàng cần thiết để giao sản phẩm đến bạn.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <EyeInvisibleOutlined className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <Text strong>Cơ quan pháp luật: </Text>
                      Khi có yêu cầu hợp pháp từ cơ quan có thẩm quyền.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <EyeInvisibleOutlined className="text-orange-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <Text strong>Dịch vụ thanh toán: </Text>
                      Thông tin cần thiết để xử lý thanh toán một cách an toàn.
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="lien-he" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-white mb-4">
              Có thắc mắc về chính sách bảo mật?
            </Title>
            <Paragraph className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Liên hệ với chúng tôi để được giải đáp mọi thắc mắc về việc bảo vệ thông tin cá nhân
            </Paragraph>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:mosaic.threadsstory@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 no-underline inline-flex items-center justify-center"
              >
                <MailOutlined className="mr-2" />
                mosaic.threadsstory@gmail.com
              </motion.a>
              <motion.a
                href="tel:+84833223299"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 no-underline inline-flex items-center justify-center"
              >
                <PhoneOutlined className="mr-2" />
                0833 223 299
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PrivacyPolicyPage;