import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Card, Row, Col, Rate, Tag, Button } from 'antd';
import { 
  UserOutlined,
  EnvironmentOutlined,
  StarOutlined,
  HeartOutlined,
  PhoneOutlined,
  CalendarOutlined,
  BackwardOutlined,
  TeamOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;

const ArtisansPage: React.FC = () => {
  const artisans = [
    {
      id: 1,
      name: 'Nguyễn Văn Minh',
      region: 'TP. Hồ Chí Minh',
      speciality: 'In lụa truyền thống',
      experience: '15 năm',
      rating: 4.9,
      avatar: '/assets/artisans/minh.jpg',
      story: 'Thầy Minh là nghệ nhân in lụa với hơn 15 năm kinh nghiệm. Từ những ngày đầu học nghề tại xưởng in truyền thống, thầy đã không ngừng sáng tạo và cải tiến kỹ thuật để tạo ra những sản phẩm chất lượng cao.',
      techniques: ['In lụa tay', 'Pha màu tự nhiên', 'Thiết kế pattern'],
      achievements: ['Huy chương vàng nghề in lụa TP.HCM 2020', 'Nghệ nhân ưu tú thành phố 2022'],
      products: 120,
      region_icon: '🏙️',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 2,
      name: 'Trần Thị Mai',
      region: 'Khánh Hòa',
      speciality: 'Thêu tay truyền thống',
      experience: '12 năm',
      rating: 4.8,
      avatar: '/assets/artisans/mai.jpg',
      story: 'Cô Mai sinh ra và lớn lên tại Nha Trang, nơi có truyền thống thêu rất phong phú. Với đôi bàn tay khéo léo và tâm hồn nghệ sĩ, cô đã tạo ra những họa tiết thêu tinh xảo cho các thiết kế MOSAIC.',
      techniques: ['Thêu tay Việt', 'Thêu họa tiết biển', 'Kết hợp màu sắc'],
      achievements: ['Giải nhất cuộc thi thêu Khánh Hòa 2021', 'Nghệ nhân trẻ xuất sắc 2023'],
      products: 85,
      region_icon: '🌊',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      name: 'Lê Văn Đức',
      region: 'Đà Nẵng',
      speciality: 'Chế tác kim loại',
      experience: '18 năm',
      rating: 4.9,
      avatar: '/assets/artisans/duc.jpg',
      story: 'Anh Đức chuyên tạo ra các chi tiết kim loại trang trí cho áo như nút, khuy, logo kim loại. Với kỹ thuật chế tác tinh vi, anh đã góp phần tạo nên những sản phẩm cao cấp của MOSAIC.',
      techniques: ['Khắc kim loại', 'Đúc logo', 'Mạ vàng/bạc'],
      achievements: ['Thợ kim hoàn giỏi Đà Nẵng 2019', 'Sản phẩm OCOP 4 sao 2022'],
      products: 200,
      region_icon: '🏖️',
      color: 'from-sky-500 to-blue-500'
    },
    {
      id: 4,
      name: 'Phạm Thị Lan',
      region: 'Quảng Ninh',
      speciality: 'Dệt thổ cẩm',
      experience: '20 năm',
      rating: 5.0,
      avatar: '/assets/artisans/lan.jpg',
      story: 'Bà Lan là người dân tộc Tày, kế thừa nghề dệt thổ cẩm truyền thống từ mẹ. Bà đã ứng dụng những họa tiết dân tộc vào các thiết kế hiện đại, tạo nên những sản phẩm độc đáo mang đậm bản sắc.',
      techniques: ['Dệt thổ cẩm tay', 'Nhuộm màu tự nhiên', 'Họa tiết dân tộc'],
      achievements: ['Nghệ nhân dân tộc ưu tú 2018', 'Bảo tồn văn hóa xuất sắc 2021'],
      products: 95,
      region_icon: '🗻',
      color: 'from-slate-500 to-stone-600'
    },
    {
      id: 5,
      name: 'Hoàng Văn Tuấn',
      region: 'Hà Nội',
      speciality: 'Thêu rồng phượng',
      experience: '25 năm',
      rating: 4.9,
      avatar: '/assets/artisans/tuan.jpg',
      story: 'Thầy Tuấn là nghệ nhân thêu rồng phượng lão làng tại Hà Nội. Với hơn 25 năm kinh nghiệm, thầy đã tạo ra những họa tiết thêu rồng phượng tuyệt đẹp cho các sản phẩm cao cấp của MOSAIC.',
      techniques: ['Thêu rồng phượng', 'Thêu chỉ vàng', 'Kỹ thuật thêu cung đình'],
      achievements: ['Nghệ nhân nhân dân 2020', 'Giải thưởng văn hóa Hà Nội 2022'],
      products: 150,
      region_icon: '🏛️',
      color: 'from-amber-500 to-yellow-600'
    },
    {
      id: 6,
      name: 'Nguyễn Thị Hương',
      region: 'Các tỉnh',
      speciality: 'Phối màu chuyên nghiệp',
      experience: '10 năm',
      rating: 4.8,
      avatar: '/assets/artisans/huong.jpg',
      story: 'Cô Hương là chuyên gia phối màu của MOSAIC, đảm bảo tất cả sản phẩm đều có sự hài hòa về màu sắc. Cô đã du lịch khắp 5 tỉnh thành để nghiên cứu màu sắc đặc trưng của từng vùng miền.',
      techniques: ['Phối màu chuyên nghiệp', 'Nghiên cứu màu sắc', 'Tư vấn thiết kế'],
      achievements: ['Chuyên gia màu sắc hàng đầu 2021', 'Cố vấn thiết kế xuất sắc 2023'],
      products: 300,
      region_icon: '🎨',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const craftingProcess = [
    {
      step: 1,
      title: 'Thiết kế ý tưởng',
      description: 'Nghệ nhân và team design cùng thảo luận, trao đổi ý tưởng thiết kế dựa trên đặc trưng của từng vùng miền',
      icon: '💡',
      duration: '2-3 ngày'
    },
    {
      step: 2,
      title: 'Chuẩn bị nguyên liệu',
      description: 'Tuyển chọn chất liệu cao cấp, chuẩn bị màu sắc và các công cụ chuyên dụng cho từng kỹ thuật',
      icon: '🧵',
      duration: '1-2 ngày'
    },
    {
      step: 3,
      title: 'Thực hiện thủ công',
      description: 'Nghệ nhân sử dụng kỹ thuật truyền thống kết hợp hiện đại để tạo ra sản phẩm hoàn hảo',
      icon: '✋',
      duration: '3-5 ngày'
    },
    {
      step: 4,
      title: 'Kiểm tra chất lượng',
      description: 'Mỗi sản phẩm đều được kiểm tra kỹ lưỡng về chất lượng trước khi đến tay khách hàng',
      icon: '🔍',
      duration: '1 ngày'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20">
        {/* Animated background */}
        <div className="absolute inset-0">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i * 0.8) * 20, 0],
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: Math.random() * 10 + 8,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            >
              {['🎨', '✋', '🧵', '⭐', '💎', '🌟'][i % 6]}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="mb-8">
              <motion.div
                className="inline-block text-8xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ✋
              </motion.div>
            </div>

            <Title level={1} className="mb-6 text-5xl md:text-7xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Nghệ nhân MOSAIC
            </Title>
            
            <Paragraph className="text-xl md:text-2xl dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
              Những bàn tay vàng đã tạo nên những sản phẩm tinh xảo, 
              mang đậm bản sắc văn hóa từng vùng miền Việt Nam
            </Paragraph>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold shadow-lg">
                🏆 6 Nghệ nhân
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold shadow-lg">
                ✋ Thủ công 100%
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-bold shadow-lg">
                ⭐ Chất lượng cao
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Artisans Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-4">
              Đội ngũ nghệ nhân
            </Title>
            <Paragraph className="text-center text-lg dark:text-gray-300 mb-16 max-w-3xl mx-auto">
              Mỗi nghệ nhân đều có chuyên môn riêng biệt, cùng nhau tạo nên những sản phẩm hoàn hảo
            </Paragraph>
            
            <Row gutter={[32, 32]}>
              {artisans.map((artisan, index) => (
                <Col xs={24} lg={12} xl={8} key={artisan.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -10 }}
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${artisan.color} opacity-5`} />
                      
                      <div className="relative z-10">
                        {/* Avatar and basic info */}
                        <div className="text-center mb-6">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                            className="relative inline-block mb-4"
                          >
                            {artisan.avatar.startsWith('/') ? (
                              <img
                                src={artisan.avatar}
                                alt={artisan.name}
                                className="w-24 h-24 rounded-full object-cover shadow-xl mx-auto border-4 border-white"
                              />
                            ) : (
                              <div className={`w-24 h-24 bg-gradient-to-br ${artisan.color} rounded-full flex items-center justify-center text-3xl shadow-xl mx-auto text-white`}>
                                <UserOutlined />
                              </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 text-3xl">
                              {artisan.region_icon}
                            </div>
                          </motion.div>
                          
                          <Title level={4} className="mb-2">{artisan.name}</Title>
                          <div className="flex items-center justify-center space-x-2 mb-3">
                            <EnvironmentOutlined className="text-gray-500" />
                            <Text className="text-gray-600 dark:text-gray-400">{artisan.region}</Text>
                          </div>
                          
                          <div className="flex items-center justify-center space-x-4 mb-4">
                            <Rate disabled defaultValue={artisan.rating} />
                            <Text strong className="text-yellow-600">{artisan.rating}</Text>
                          </div>
                        </div>

                        {/* Speciality and experience */}
                        <div className="space-y-4 mb-6">
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Text strong className="text-blue-600">Chuyên môn:</Text>
                              <CalendarOutlined className="text-gray-500" />
                            </div>
                            <Text className="block mb-2">{artisan.speciality}</Text>
                            <Text className="text-sm text-gray-500">Kinh nghiệm: {artisan.experience}</Text>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <Text strong className="text-green-600 block mb-2">Sản phẩm đã tạo:</Text>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold">{artisan.products}</span>
                              <span className="text-sm text-gray-500">sản phẩm</span>
                            </div>
                          </div>
                        </div>

                        {/* Story */}
                        <div className="mb-6">
                          <Text strong className="block mb-2">Câu chuyện:</Text>
                          <Paragraph className="text-sm dark:text-gray-300 leading-relaxed">
                            {artisan.story}
                          </Paragraph>
                        </div>

                        {/* Techniques */}
                        <div className="mb-6">
                          <Text strong className="block mb-3">Kỹ thuật đặc biệt:</Text>
                          <div className="flex flex-wrap gap-2">
                            {artisan.techniques.map((technique, idx) => (
                              <Tag key={idx} color="blue" className="mb-1">
                                {technique}
                              </Tag>
                            ))}
                          </div>
                        </div>

                        {/* Achievements */}
                        <div className="mb-6">
                          <div className="flex items-center mb-3">
                            <BackwardOutlined className="text-yellow-500 mr-2" />
                            <Text strong>Thành tích:</Text>
                          </div>
                          <ul className="space-y-1">
                            {artisan.achievements.map((achievement, idx) => (
                              <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                                <StarOutlined className="text-yellow-500 mr-2 mt-1 flex-shrink-0 text-xs" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Contact button */}
                        <Button 
                          type="primary" 
                          block 
                          className={`bg-gradient-to-r ${artisan.color} border-none hover:shadow-lg`}
                          icon={<PhoneOutlined />}
                        >
                          Liên hệ nghệ nhân
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Crafting Process */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-16">
              Quy trình chế tác thủ công
            </Title>
            
            <Row gutter={[32, 32]}>
              {craftingProcess.map((process, index) => (
                <Col xs={24} sm={12} lg={6} key={process.step}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card className="h-full text-center hover:shadow-xl transition-all duration-500">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg">
                          {process.icon}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {process.step}
                        </div>
                      </div>
                      
                      <Title level={4} className="mb-3">{process.title}</Title>
                      <Paragraph className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {process.description}
                      </Paragraph>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <Text strong className="text-blue-600">
                          ⏱️ Thời gian: {process.duration}
                        </Text>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <Title level={2} className="mb-8">
                Hợp tác cùng MOSAIC
              </Title>
              
              <Paragraph className="text-xl leading-relaxed dark:text-gray-300 mb-12">
                Bạn là nghệ nhân có tay nghề cao và muốn hợp tác với MOSAIC? 
                Chúng tôi luôn chào đón những người thợ tài năng gia nhập đại gia đình.
              </Paragraph>

              <Row gutter={[24, 24]} className="mb-12">
                <Col xs={24} md={8}>
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                    <HeartOutlined className="text-4xl text-red-500 mb-4" />
                    <Title level={4}>Môi trường thân thiện</Title>
                    <Paragraph className="text-gray-600 dark:text-gray-300">
                      Làm việc trong môi trường trẻ trung, sáng tạo và tôn trọng tay nghề
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                    <TeamOutlined className="text-4xl text-blue-500 mb-4" />
                    <Title level={4}>Đội ngũ chuyên nghiệp</Title>
                    <Paragraph className="text-gray-600 dark:text-gray-300">
                      Cùng làm việc với những người trẻ đam mê và chuyên nghiệp
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                    <BackwardOutlined className="text-4xl text-yellow-500 mb-4" />
                    <Title level={4}>Thu nhập hấp dẫn</Title>
                    <Paragraph className="text-gray-600 dark:text-gray-300">
                      Chế độ đãi ngộ xứng đáng với tay nghề và cống hiến
                    </Paragraph>
                  </Card>
                </Col>
              </Row>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<PhoneOutlined />}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 border-none h-12 px-8 font-semibold"
                    href="tel:+84833223299"
                  >
                    Liên hệ hợp tác: 0833 223 299
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="large"
                    icon={<UserOutlined />}
                    className="border-blue-500 text-blue-500 hover:bg-blue-50 h-12 px-8 font-semibold"
                    href="mailto:mosaic.threadsstory@gmail.com"
                  >
                    Gửi CV qua email
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-5xl mb-6">✋</div>
            <Title level={2} className="text-white mb-4">
              Cảm ơn những bàn tay vàng
            </Title>
            <Paragraph className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Nhờ có các nghệ nhân tài năng, MOSAIC mới có thể tạo ra những sản phẩm 
              mang đậm hồn Việt và chất lượng quốc tế.
            </Paragraph>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="large"
                className="bg-white text-orange-600 border-white hover:bg-gray-100 h-12 px-8 font-semibold"
                href="/products"
              >
                Khám phá sản phẩm thủ công
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ArtisansPage;