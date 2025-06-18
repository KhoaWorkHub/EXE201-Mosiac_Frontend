import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Card, Row, Col, Alert, Anchor, Timeline, Divider } from 'antd';
import { 
  FileTextOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;
const { Link } = Anchor;

const TermsPage: React.FC = () => {
  const keyTerms = [
    {
      term: 'Khách hàng',
      definition: 'Người sử dụng dịch vụ mua sắm trên website mosaicstore.vercel.app'
    },
    {
      term: 'MOSAIC',
      definition: 'Thương hiệu áo thun khởi nghiệp thuộc về đội ngũ sinh viên FPT University'
    },
    {
      term: 'Sản phẩm',
      definition: 'Áo thun in hình các địa danh nổi bật của 5 tỉnh thành Việt Nam'
    },
    {
      term: 'Dịch vụ',
      definition: 'Toàn bộ dịch vụ mua sắm, giao hàng và hỗ trợ khách hàng của MOSAIC'
    }
  ];

  const obligations = [
    {
      title: 'Cung cấp thông tin chính xác',
      description: 'Khách hàng cam kết cung cấp thông tin đúng và đầy đủ khi đặt hàng',
      icon: <UserOutlined />
    },
    {
      title: 'Thanh toán đúng hạn',
      description: 'Thực hiện thanh toán theo đúng phương thức và thời hạn đã thỏa thuận',
      icon: <CreditCardOutlined />
    },
    {
      title: 'Nhận hàng đúng hẹn',
      description: 'Có mặt tại địa chỉ giao hàng vào thời gian đã hẹn',
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Sử dụng website đúng mục đích',
      description: 'Không sử dụng website để thực hiện các hành vi bất hợp pháp',
      icon: <ExclamationCircleOutlined />
    }
  ];

  const mosiacObligations = [
    {
      obligation: 'Cung cấp sản phẩm chất lượng',
      details: 'Đảm bảo sản phẩm đúng mô tả, chất lượng tốt và giao hàng đúng hẹn'
    },
    {
      obligation: 'Bảo mật thông tin khách hàng',
      details: 'Bảo vệ thông tin cá nhân và không chia sẻ cho bên thứ ba'
    },
    {
      obligation: 'Hỗ trợ khách hàng 24/7',
      details: 'Giải đáp thắc mắc và xử lý khiếu nại một cách nhanh chóng'
    },
    {
      obligation: 'Tuân thủ chính sách đổi trả',
      details: 'Thực hiện đúng cam kết về chính sách đổi trả trong vòng 7 ngày'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900/20 dark:via-gray-900/20 dark:to-zinc-900/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FileTextOutlined className="text-6xl text-slate-600 mb-6" />
            <Title level={1} className="mb-6 text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-600 bg-clip-text text-transparent">
              Điều khoản sử dụng
            </Title>
            <Paragraph className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Điều khoản và điều kiện sử dụng dịch vụ mua sắm tại MOSAIC
            </Paragraph>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Có hiệu lực từ: 15 tháng 6, 2025 | Cập nhật lần cuối: 15 tháng 6, 2025
            </Text>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4">
          <Anchor direction="horizontal" className="text-center">
            <Link href="#dinh-nghia" title="Định nghĩa" />
            <Link href="#su-dung" title="Điều kiện sử dụng" />
            <Link href="#nghia-vu" title="Nghĩa vụ các bên" />
            <Link href="#thanh-toan" title="Thanh toán" />
            <Link href="#tranh-chap" title="Giải quyết tranh chấp" />
            <Link href="#lien-he" title="Liên hệ" />
          </Anchor>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-4xl mx-auto">
              <Alert
                message="Quan trọng - Vui lòng đọc kỹ"
                description="Bằng việc truy cập và sử dụng website mosaicstore.vercel.app, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định dưới đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi."
                type="warning"
                showIcon
                className="mb-8"
              />

              <Card>
                <Title level={3}>Giới thiệu về MOSAIC</Title>
                <Paragraph className="text-lg leading-relaxed">
                  MOSAIC là thương hiệu áo thun khởi nghiệp được thành lập bởi đội ngũ sinh viên 
                  FPT University trong khuôn khổ dự án EXE201. Chúng tôi chuyên thiết kế và sản xuất 
                  áo thun in hình các địa danh nổi bật của 5 tỉnh thành: TP. Hồ Chí Minh, Khánh Hòa, 
                  Đà Nẵng, Quảng Ninh và Hà Nội.
                </Paragraph>
                <Paragraph className="text-lg leading-relaxed">
                  Sứ mệnh của chúng tôi là mang văn hóa Việt Nam đến với thế giới qua từng sản phẩm 
                  thủ công tinh tế, đồng thời tạo ra những trải nghiệm mua sắm tuyệt vời cho khách hàng.
                </Paragraph>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Definitions */}
      <section id="dinh-nghia" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Định nghĩa các thuật ngữ
            </Title>
            <Row gutter={[24, 24]}>
              {keyTerms.map((item, index) => (
                <Col xs={24} md={12} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full hover:shadow-md transition-all duration-300">
                      <Title level={4} className="text-blue-600 mb-3">
                        "{item.term}"
                      </Title>
                      <Paragraph className="text-gray-600 dark:text-gray-300 mb-0">
                        {item.definition}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Usage Conditions */}
      <section id="su-dung" className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Điều kiện sử dụng website
            </Title>
            <div className="max-w-4xl mx-auto">
              <Card>
                <Timeline>
                  <Timeline.Item 
                    dot={<UserOutlined className="text-blue-500" />}
                    color="blue"
                  >
                    <Title level={4}>Đối tượng sử dụng</Title>
                    <ul className="space-y-2">
                      <li>• Người từ đủ 18 tuổi trở lên có đầy đủ năng lực hành vi dân sự</li>
                      <li>• Người dưới 18 tuổi phải có sự đồng ý của cha mẹ/người giám hộ</li>
                      <li>• Các tổ chức, doanh nghiệp có nhu cầu mua sỉ</li>
                    </ul>
                  </Timeline.Item>
                  
                  <Timeline.Item 
                    dot={<SaveOutlined className="text-green-500" />}
                    color="green"
                  >
                    <Title level={4}>Quy tắc sử dụng</Title>
                    <ul className="space-y-2">
                      <li>• Không được sử dụng website để thực hiện các hành vi bất hợp pháp</li>
                      <li>• Không được can thiệp vào hệ thống hoặc làm ảnh hưởng đến hoạt động của website</li>
                      <li>• Không được sao chép, phân phối nội dung mà không có sự cho phép</li>
                      <li>• Tôn trọng quyền sở hữu trí tuệ và bản quyền của MOSAIC</li>
                    </ul>
                  </Timeline.Item>
                  
                  <Timeline.Item 
                    dot={<ExclamationCircleOutlined className="text-orange-500" />}
                    color="orange"
                  >
                    <Title level={4}>Hành vi cấm</Title>
                    <ul className="space-y-2">
                      <li>• Đăng ký tài khoản với thông tin giả mạo</li>
                      <li>• Sử dụng robot, bot hoặc các phương tiện tự động để truy cập website</li>
                      <li>• Gửi spam, virus hoặc bất kỳ mã độc hại nào</li>
                      <li>• Cố gắng truy cập trái phép vào hệ thống</li>
                    </ul>
                  </Timeline.Item>
                </Timeline>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Obligations */}
      <section id="nghia-vu" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Nghĩa vụ của các bên
            </Title>
            <Row gutter={[32, 32]}>
              {/* Customer Obligations */}
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <div className="flex items-center">
                      <UserOutlined className="text-blue-500 mr-2 text-xl" />
                      <span className="text-blue-600">Nghĩa vụ của Khách hàng</span>
                    </div>
                  }
                  className="h-full border-blue-200"
                >
                  <div className="space-y-4">
                    {obligations.map((obligation, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <div className="text-blue-500 text-xl mt-1">
                          {obligation.icon}
                        </div>
                        <div>
                          <Text strong className="block mb-1">{obligation.title}</Text>
                          <Text className="text-gray-600 dark:text-gray-300 text-sm">
                            {obligation.description}
                          </Text>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </Col>

              {/* MOSAIC Obligations */}
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <div className="flex items-center">
                      <SaveOutlined className="text-green-500 mr-2 text-xl" />
                      <span className="text-green-600">Nghĩa vụ của MOSAIC</span>
                    </div>
                  }
                  className="h-full border-green-200"
                >
                  <div className="space-y-4">
                    {mosiacObligations.map((obligation, index) => (
                      <motion.div
                        key={index}
                        className="p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <Text strong className="block mb-2 text-green-600">
                          {obligation.obligation}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-300 text-sm">
                          {obligation.details}
                        </Text>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Payment Terms */}
      <section id="thanh-toan" className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Điều khoản thanh toán
            </Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8}>
                <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                  <CreditCardOutlined className="text-4xl text-blue-500 mb-4" />
                  <Title level={4}>Phương thức thanh toán</Title>
                  <ul className="text-left space-y-2">
                    <li>• COD (Thanh toán khi nhận hàng)</li>
                    <li>• Chuyển khoản ngân hàng</li>
                    <li>• Ví điện tử (Momo, ZaloPay)</li>
                    <li>• Thẻ tín dụng/ghi nợ</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                  <FileTextOutlined className="text-4xl text-green-500 mb-4" />
                  <Title level={4}>Chính sách giá</Title>
                  <ul className="text-left space-y-2">
                    <li>• Giá hiển thị đã bao gồm VAT</li>
                    <li>• Phí ship tính riêng</li>
                    <li>• Giá có thể thay đổi không báo trước</li>
                    <li>• Áp dụng giá tại thời điểm đặt hàng</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                  <ExclamationCircleOutlined className="text-4xl text-orange-500 mb-4" />
                  <Title level={4}>Xử lý thanh toán</Title>
                  <ul className="text-left space-y-2">
                    <li>• Xác nhận đơn hàng trong 2-4 giờ</li>
                    <li>• Hoàn tiền trong 7-14 ngày</li>
                    <li>• Hỗ trợ khiếu nại 24/7</li>
                    <li>• Bảo mật thông tin thanh toán</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Dispute Resolution */}
      <section id="tranh-chap" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Giải quyết tranh chấp
            </Title>
            <div className="max-w-4xl mx-auto">
              <Card>
                <Timeline>
                  <Timeline.Item color="blue">
                    <Title level={4}>Bước 1: Liên hệ trực tiếp</Title>
                    <Paragraph>
                      Khi có tranh chấp, khách hàng nên liên hệ trực tiếp với MOSAIC qua:
                    </Paragraph>
                    <ul>
                      <li>• Hotline: 0833 223 299</li>
                      <li>• Email: mosaic.threadsstory@gmail.com</li>
                      <li>• Facebook: mosaicstore.story</li>
                    </ul>
                  </Timeline.Item>
                  
                  <Timeline.Item color="green">
                    <Title level={4}>Bước 2: Đàm phán hòa giải</Title>
                    <Paragraph>
                      MOSAIC cam kết giải quyết mọi khiếu nại trong vòng 72 giờ làm việc. 
                      Chúng tôi ưu tiên giải pháp thỏa mãn cả hai bên thông qua đàm phán thiện chí.
                    </Paragraph>
                  </Timeline.Item>
                  
                  <Timeline.Item color="orange">
                    <Title level={4}>Bước 3: Cơ quan có thẩm quyền</Title>
                    <Paragraph>
                      Nếu không thể giải quyết được, tranh chấp sẽ được đưa ra cơ quan có thẩm quyền 
                      theo quy định của pháp luật Việt Nam.
                    </Paragraph>
                  </Timeline.Item>
                </Timeline>
                
                <Divider />
                
                <Alert
                  message="🤝 Cam kết của MOSAIC"
                  description="Chúng tôi luôn nỗ lực giải quyết mọi vấn đề một cách công bằng, minh bạch và có lợi nhất cho khách hàng. Sự hài lòng của bạn là ưu tiên hàng đầu."
                  type="info"
                  showIcon
                />
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Legal Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-12">
              Thông tin pháp lý
            </Title>
            <div className="max-w-4xl mx-auto">
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card>
                    <Title level={4}>Quyền sở hữu trí tuệ</Title>
                    <Paragraph>
                      Tất cả thiết kế, logo, hình ảnh và nội dung trên website đều thuộc 
                      quyền sở hữu của MOSAIC. Việc sao chép mà không có sự cho phép 
                      sẽ bị xử lý theo pháp luật.
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card>
                    <Title level={4}>Thay đổi điều khoản</Title>
                    <Paragraph>
                      MOSAIC có quyền thay đổi, bổ sung các điều khoản bất cứ lúc nào. 
                      Thông báo thay đổi sẽ được đăng tại website và có hiệu lực 
                      ngay khi công bố.
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card>
                    <Title level={4}>Luật áp dụng</Title>
                    <Paragraph>
                      Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. 
                      Tòa án có thẩm quyền tại TP. Hồ Chí Minh sẽ giải quyết 
                      các tranh chấp phát sinh.
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card>
                    <Title level={4}>Hiệu lực</Title>
                    <Paragraph>
                      Điều khoản này có hiệu lực từ ngày 15/6/2025 và áp dụng 
                      cho tất cả giao dịch thực hiện trên website 
                      mosaicstore.vercel.app.
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="lien-he" className="bg-gradient-to-r from-slate-600 to-gray-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FileTextOutlined className="text-5xl mb-6" />
            <Title level={2} className="text-white mb-4">
              Cần hỗ trợ về điều khoản sử dụng?
            </Title>
            <Paragraph className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Đội ngũ pháp chế MOSAIC sẵn sàng giải đáp mọi thắc mắc về điều khoản và quyền lợi của bạn
            </Paragraph>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:mosaic.threadsstory@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-slate-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 no-underline inline-flex items-center justify-center"
              >
                <MailOutlined className="mr-2" />
                mosaic.threadsstory@gmail.com
              </motion.a>
              <motion.a
                href="tel:+84833223299"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-slate-700 transition-all duration-300 no-underline inline-flex items-center justify-center"
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

export default TermsPage;