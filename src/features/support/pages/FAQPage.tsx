import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Collapse, Typography, Input, Tag, Card, Row, Col } from 'antd';
import { 
  SearchOutlined, 
  QuestionCircleOutlined,
  ShoppingOutlined,
  TruckOutlined,
  CreditCardOutlined,
  CustomerServiceOutlined,
  SafetyOutlined,
  GiftOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const faqCategories = [
    {
      id: 'general',
      title: 'Thông tin chung',
      icon: <QuestionCircleOutlined />,
      color: 'blue',
      items: [
        {
          question: 'MOSAIC là gì? Câu chuyện thương hiệu ra đời như thế nào?',
          answer: 'MOSAIC là thương hiệu áo thun khởi nghiệp ra đời từ dự án lớp học EXE201 tại FPT University. Chúng tôi chuyên thiết kế và sản xuất áo thun in hình các địa danh nổi bật của 5 tỉnh thành: TP.HCM, Khánh Hòa, Đà Nẵng, Quảng Ninh, và Hà Nội. Sứ mệnh của chúng tôi là mang văn hóa Việt Nam đến với thế giới qua từng sản phẩm thủ công tinh tế.'
        },
        {
          question: 'Tại sao lại chọn 5 tỉnh thành này?',
          answer: 'Chúng tôi chọn 5 tỉnh thành này vì chúng đại diện cho ba miền Bắc - Trung - Nam của Việt Nam, mỗi nơi đều có những địa danh và văn hóa đặc trưng riêng biệt. Từ Hà Nội cổ kính, Quảng Ninh hùng vĩ, Đà Nẵng hiện đại, Khánh Hòa biển xanh đến TP.HCM sôi động.'
        },
        {
          question: 'Sản phẩm có thực sự được sản xuất tại Việt Nam không?',
          answer: 'Có, tất cả sản phẩm của MOSAIC đều được thiết kế và sản xuất tại Việt Nam bởi các nghệ nhân và xưởng may địa phương. Chúng tôi cam kết sử dụng nguyên liệu chất lượng cao và quy trình sản xuất bền vững.'
        }
      ]
    },
    {
      id: 'products',
      title: 'Sản phẩm & Chất lượng',
      icon: <ShoppingOutlined />,
      color: 'green',
      items: [
        {
          question: 'Chất liệu áo thun như thế nào?',
          answer: 'Áo thun MOSAIC được làm từ 100% cotton cao cấp, mềm mại, thoáng khí và thấm hút mồ hôi tốt. Chúng tôi sử dụng công nghệ in chuyển nhiệt cao cấp đảm bảo hình in sắc nét, bền màu và không bong tróc sau nhiều lần giặt.'
        },
        {
          question: 'Có những size nào? Làm sao để chọn size phù hợp?',
          answer: 'Chúng tôi có đầy đủ size từ S đến XXL. Bảng size chi tiết được cung cấp trên từng trang sản phẩm. Nếu bạn không chắc chắn về size, hãy liên hệ với team tư vấn qua hotline 0833 223 299 hoặc chat trực tuyến.'
        },
        {
          question: 'Thiết kế có thực sự độc quyền không?',
          answer: 'Có, tất cả thiết kế trên áo thun MOSAIC đều do team design nội bộ tự thiết kế, lấy cảm hứng từ các địa danh thực tế. Mỗi design đều mang tính nghệ thuật cao và thể hiện nét đẹp văn hóa đặc trưng của từng vùng miền.'
        },
        {
          question: 'Có thể đặt thiết kế riêng không?',
          answer: 'Hiện tại chúng tôi chưa nhận đặt thiết kế riêng, nhưng đây là kế hoạch trong tương lai gần. Hãy theo dõi fanpage và website để cập nhật thông tin mới nhất về dịch vụ này.'
        }
      ]
    },
    {
      id: 'ordering',
      title: 'Đặt hàng & Thanh toán',
      icon: <CreditCardOutlined />,
      color: 'orange',
      items: [
        {
          question: 'Làm thế nào để đặt hàng?',
          answer: 'Bạn có thể đặt hàng trực tiếp trên website mosaicstore.vercel.app, qua Facebook fanpage, hoặc gọi điện đến hotline 0833 223 299. Quy trình đặt hàng rất đơn giản: chọn sản phẩm → chọn size → thêm vào giỏ hàng → thanh toán.'
        },
        {
          question: 'Có những hình thức thanh toán nào?',
          answer: 'Chúng tôi hỗ trợ nhiều hình thức thanh toán: COD (thanh toán khi nhận hàng), chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay), và thẻ tín dụng/ghi nợ. Tất cả đều an toàn và bảo mật.'
        },
        {
          question: 'Có giảm giá khi mua số lượng lớn không?',
          answer: 'Có, chúng tôi có chính sách giảm giá đặc biệt cho đơn hàng từ 5 chiếc trở lên. Liên hệ trực tiếp để được báo giá ưu đãi nhất.'
        },
        {
          question: 'Có thể hủy đơn hàng không?',
          answer: 'Bạn có thể hủy đơn hàng trong vòng 2 giờ sau khi đặt hàng mà không mất phí. Sau thời gian này, nếu sản phẩm chưa được sản xuất, chúng tôi vẫn có thể hỗ trợ hủy đơn.'
        }
      ]
    },
    {
      id: 'shipping',
      title: 'Vận chuyển & Giao hàng',
      icon: <TruckOutlined />,
      color: 'purple',
      items: [
        {
          question: 'Thời gian giao hàng là bao lâu?',
          answer: 'Thời gian giao hàng phụ thuộc vào khu vực: TP.HCM và Hà Nội: 1-2 ngày, các tỉnh thành khác: 2-4 ngày, vùng xa: 4-7 ngày. Đối với sản phẩm order riêng, thời gian có thể lâu hơn 3-5 ngày.'
        },
        {
          question: 'Phí ship là bao nhiêu?',
          answer: 'Phí ship tiêu chuẩn là 30.000đ toàn quốc. MIỄN PHÍ SHIP cho đơn hàng từ 500.000đ trở lên. Chúng tôi thường xuyên có các chương trình freeship đặc biệt.'
        },
        {
          question: 'Có giao hàng nước ngoài không?',
          answer: 'Hiện tại chúng tôi chỉ giao hàng trong nước. Tuy nhiên, chúng tôi đang nghiên cứu mở rộng dịch vụ giao hàng quốc tế trong tương lai gần.'
        },
        {
          question: 'Làm thế nào để theo dõi đơn hàng?',
          answer: 'Sau khi đặt hàng, bạn sẽ nhận được mã tracking qua SMS/email. Bạn có thể theo dõi trạng thái đơn hàng trực tiếp trên website hoặc app của đơn vị vận chuyển.'
        }
      ]
    },
    {
      id: 'returns',
      title: 'Đổi trả & Bảo hành',
      icon: <SafetyOutlined />,
      color: 'red',
      items: [
        {
          question: 'Chính sách đổi trả như thế nào?',
          answer: 'Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện: sản phẩm còn nguyên tem mác, chưa giặt, không có mùi lạ, và còn trong tình trạng như khi nhận hàng.'
        },
        {
          question: 'Trường hợp nào được đổi trả miễn phí?',
          answer: 'Đổi trả miễn phí trong các trường hợp: sản phẩm lỗi từ nhà sản xuất, giao sai mẫu/size, sản phẩm bị hư hỏng trong quá trình vận chuyển.'
        },
        {
          question: 'Quy trình đổi trả như thế nào?',
          answer: 'Liên hệ hotline 0833 223 299 hoặc inbox fanpage → cung cấp thông tin đơn hàng → gửi ảnh sản phẩm → được hướng dẫn gửi trả → nhận sản phẩm mới hoặc hoàn tiền.'
        },
        {
          question: 'Bao lâu để được hoàn tiền?',
          answer: 'Thời gian hoàn tiền là 3-7 ngày làm việc sau khi chúng tôi nhận được sản phẩm trả lại và xác nhận đạt điều kiện đổi trả.'
        }
      ]
    },
    {
      id: 'support',
      title: 'Hỗ trợ khách hàng',
      icon: <CustomerServiceOutlined />,
      color: 'cyan',
      items: [
        {
          question: 'Làm thế nào để liên hệ với MOSAIC?',
          answer: 'Bạn có thể liên hệ qua: Hotline: 0833 223 299 (8h-22h hàng ngày), Email: mosaic.threadsstory@gmail.com, Facebook: mosaicstore.story, Instagram: mosaicstore.story, hoặc chat trực tiếp trên website.'
        },
        {
          question: 'Thời gian phản hồi là bao lâu?',
          answer: 'Chúng tôi cam kết phản hồi trong vòng 2 giờ đối với các kênh online và ngay lập tức qua hotline trong giờ hành chính.'
        },
        {
          question: 'Có chương trình khách hàng thân thiết không?',
          answer: 'Có, chúng tôi có chương trình tích điểm và ưu đãi đặc biệt cho khách hàng thân thiết. Hãy đăng ký thành viên trên website để nhận được những ưu đãi độc quyền.'
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-cyan-900/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={1} className="mb-6 text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Câu hỏi thường gặp
            </Title>
            <Paragraph className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Tìm câu trả lời cho những thắc mắc về sản phẩm, dịch vụ và chính sách của MOSAIC
            </Paragraph>

            {/* Search */}
            <div className="max-w-md mx-auto">
              <Search
                placeholder="Tìm kiếm câu hỏi..."
                allowClear
                size="large"
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Quick Category Navigation */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Title level={3} className="text-center mb-8">Danh mục câu hỏi</Title>
            <Row gutter={[16, 16]}>
              {faqCategories.map((category) => (
                <Col xs={12} sm={8} md={6} lg={4} key={category.id}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      className={`text-center cursor-pointer transition-all duration-300 ${
                        activeCategory === category.id
                          ? 'border-primary shadow-lg bg-primary/5'
                          : 'hover:shadow-md'
                      }`}
                      bodyStyle={{ padding: '20px 16px' }}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <div className={`text-3xl mb-3 text-${category.color}-500`}>
                        {category.icon}
                      </div>
                      <Title level={5} className="mb-2">
                        {category.title}
                      </Title>
                      <Tag color={category.color}>
                        {category.items.length} câu hỏi
                      </Tag>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>

          {/* FAQ Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {filteredFAQs.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                className="mb-12"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center mb-6">
                  <div className={`text-3xl mr-4 text-${category.color}-500`}>
                    {category.icon}
                  </div>
                  <Title level={2} className="mb-0">
                    {category.title}
                  </Title>
                </div>

                <Collapse
                  ghost
                  expandIconPosition="end"
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  {category.items.map((item, index) => (
                    <Panel
                      header={
                        <div className="font-semibold text-gray-800 dark:text-white">
                          {item.question}
                        </div>
                      }
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <Paragraph className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.answer}
                      </Paragraph>
                    </Panel>
                  ))}
                </Collapse>
              </motion.div>
            ))}

            {filteredFAQs.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <Title level={3}>Không tìm thấy kết quả</Title>
                <Paragraph className="text-gray-500">
                  Hãy thử với từ khóa khác hoặc liên hệ trực tiếp với chúng tôi để được hỗ trợ.
                </Paragraph>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GiftOutlined className="text-5xl mb-6" />
            <Title level={2} className="text-white mb-4">
              Không tìm thấy câu trả lời bạn cần?
            </Title>
            <Paragraph className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Đội ngũ hỗ trợ của MOSAIC luôn sẵn sàng giúp đỡ bạn 24/7
            </Paragraph>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="tel:+84833223299"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 no-underline"
              >
                📞 Gọi ngay: 0833 223 299
              </motion.a>
              <motion.a
                href="mailto:mosaic.threadsstory@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 no-underline"
              >
                ✉️ Email hỗ trợ
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default FAQPage;