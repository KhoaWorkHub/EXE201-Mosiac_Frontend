// src/features/about/pages/OurStoryPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Card, Row, Col, Timeline, Statistic } from 'antd';
import { 
  RocketOutlined,
  BulbOutlined,
  HeartOutlined,
  TeamOutlined,
  TrophyOutlined,
  GlobalOutlined,
  BookOutlined,
  StarOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;

const OurStoryPage: React.FC = () => {
  const milestones = [
    {
      date: 'Tháng 1, 2024',
      title: 'Ý tưởng khởi đầu',
      description: 'Trong một giờ học EXE201, 6 sinh viên FPT University nảy sinh ý tưởng tạo ra thương hiệu áo thun mang đậm bản sắc Việt Nam.',
      icon: <BulbOutlined />,
      color: '#faad14'
    },
    {
      date: 'Tháng 2, 2024',
      title: 'Nghiên cứu thị trường',
      description: 'Khảo sát 500+ bạn trẻ về nhu cầu áo thun in địa danh. Kết quả: 78% mong muốn có sản phẩm độc đáo thể hiện tình yêu quê hương.',
      icon: <BookOutlined />,
      color: '#1890ff'
    },
    {
      date: 'Tháng 3, 2024',
      title: 'Thành lập team',
      description: 'Chính thức thành lập đội ngũ MOSAIC với 6 thành viên, mỗi người đảm nhận vai trò riêng biệt từ thiết kế đến marketing.',
      icon: <TeamOutlined />,
      color: '#52c41a'
    },
    {
      date: 'Tháng 4, 2024',
      title: 'Thiết kế đầu tiên',
      description: 'Hoàn thành 5 thiết kế đầu tiên cho 5 tỉnh thành. Mỗi design đều được research kỹ lưỡng về văn hóa và địa danh đặc trưng.',
      icon: <StarOutlined />,
      color: '#eb2f96'
    },
    {
      date: 'Tháng 5, 2024',
      title: 'Sản phẩm đầu tiên',
      description: 'Ra mắt batch đầu tiên với 100 chiếc áo. Sold out trong vòng 48 giờ, đặc biệt được giới trẻ Sài Gòn yêu thích.',
      icon: <RocketOutlined />,
      color: '#722ed1'
    },
    {
      date: 'Tháng 6, 2024',
      title: 'Nhận giải thưởng',
      description: 'Đạt giải "Best Startup Idea" trong cuộc thi khởi nghiệp của FPT University. Nguồn động lực lớn để phát triển tiếp.',
      icon: <TrophyOutlined />,
      color: '#fa541c'
    }
  ];

  const values = [
    {
      icon: <HeartOutlined />,
      title: 'Tình yêu Việt Nam',
      description: 'Mỗi thiết kế là một lời tỏ tình với đất nước, từ Hạ Long hùng vĩ đến Sài Gòn sôi động',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: <StarOutlined />,
      title: 'Chất lượng tuyệt đối',
      description: 'Từ ý tưởng thiết kế đến sản phẩm cuối cùng, chúng tôi không bao giờ thỏa hiệp về chất lượng',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <TeamOutlined />,
      title: 'Tinh thần đội nhóm',
      description: 'Sức mạnh của MOSAIC đến từ sự gắn kết và đam mê chung của 6 con người',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <GlobalOutlined />,
      title: 'Tầm nhìn toàn cầu',
      description: 'Mang văn hóa Việt Nam ra thế giới thông qua những sản phẩm thời trang đẳng cấp',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const teamMembers = [
    {
      name: 'Trần Ngọc Bảo Trân',
      role: 'Founder & Head of Content',
      story: 'Người khởi xướng ý tưởng MOSAIC. Với niềm đam mê văn hóa Việt và kinh nghiệm content, Trân đã biến giấc mơ thành hiện thực.',
      avatar: '/assets/about-us/tran.jpg',
      quote: '"Tôi muốn mọi người trên thế giới biết đến vẻ đẹp Việt Nam qua những chiếc áo thun."'
    },
    {
      name: 'Nguyễn Minh Quân',
      role: 'Co-founder & Web Developer',
      story: 'Bộ não công nghệ của MOSAIC. Quân đã xây dựng nên website và hệ thống vận hành hoàn chỉnh cho thương hiệu.',
      avatar: '/assets/about-us/quan.png',
      quote: '"Code không chỉ là công việc, mà là cách tôi góp phần xây dựng giấc mơ chung."'
    },
    {
      name: 'Lê Vũ Đức Lương',
      role: 'Backend Developer',
      story: 'Kiến trúc sư hệ thống backend của MOSAIC. Lương đảm bảo mọi giao dịch và dữ liệu đều được xử lý một cách mượt mà.',
      avatar: '/assets/about-us/luong.png',
      quote: '"Backend tốt là nền tảng cho mọi trải nghiệm tuyệt vời."'
    },
    {
      name: 'Trần Đăng Khoa',
      role: 'Frontend Developer',
      story: 'Người tạo nên giao diện đẹp mắt cho website MOSAIC. Khoa biến những ý tưởng design thành trải nghiệm người dùng hoàn hảo.',
      avatar: '/assets/about-us/khoa2.png',
      quote: '"UI/UX đẹp không chỉ thu hút mắt mà còn chạm đến trái tim khách hàng."'
    },
    {
      name: 'Hà Duy Thịnh',
      role: 'Media Strategist',
      story: 'Chiến lược gia truyền thông của MOSAIC. Thịnh đã xây dựng thương hiệu và kết nối với hàng nghìn khách hàng trẻ.',
      avatar: '/assets/about-us/thinh.png',
      quote: '"Mỗi campaign là một câu chuyện, mỗi câu chuyện kết nối một trái tim."'
    },
    {
      name: 'Cường',
      role: 'UI/UX Designer',
      story: 'Nghệ sĩ thiết kế của MOSAIC. Cường tạo ra những design độc đáo và phát triển merchandise thương hiệu.',
      avatar: '🎨',
      quote: '"Thiết kế tốt là khi vẻ đẹp gặp gỡ công năng."'
    }
  ];

  const stats = [
    { title: 'Khách hàng hài lòng', value: 1200, suffix: '+' },
    { title: 'Sản phẩm đã bán', value: 5000, suffix: '+' },
    { title: 'Thiết kế độc quyền', value: 25, suffix: '' },
    { title: 'Tỉnh thành phủ sóng', value: 5, suffix: '' }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20">
        {/* Animated background */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 opacity-30"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.sin(i) * 50, 0],
                scale: [0, 1.5, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="mb-8"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img
                src="/assets/about-us/mascot.png"
                alt="MOSAIC Mascot"
                className="w-32 h-32 mx-auto object-contain drop-shadow-2xl"
              />
            </motion.div>

            <Title level={1} className="mb-6 text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Câu chuyện MOSAIC
            </Title>
            
            <Paragraph className="text-xl md:text-2xl dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
              Từ giảng đường đại học đến thương hiệu áo thun được yêu thích - 
              hành trình khởi nghiệp đầy cảm hứng của 6 bạn trẻ FPT University
            </Paragraph>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-bold shadow-lg">
                🎓 Sinh viên FPT
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-bold shadow-lg">
                🚀 Khởi nghiệp
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full font-bold shadow-lg">
                ❤️ Yêu Việt Nam
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-16 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Giá trị cốt lõi
            </Title>
            <Row gutter={[32, 32]}>
              {values.map((value, index) => (
                <Col xs={24} md={12} lg={6} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full text-center hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-5`} />
                      <div className="relative z-10">
                        <motion.div
                          className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg`}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-white">{value.icon}</div>
                        </motion.div>
                        <Title level={4} className="mb-4">{value.title}</Title>
                        <Paragraph className="dark:text-gray-300 leading-relaxed">
                          {value.description}
                        </Paragraph>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-16">
              Hành trình phát triển
            </Title>
            <div className="max-w-4xl mx-auto">
              <Timeline mode="left" className="custom-timeline">
                {milestones.map((milestone, index) => (
                  <Timeline.Item
                    key={index}
                    dot={
                      <motion.div
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl text-white text-xl"
                        style={{ backgroundColor: milestone.color }}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {milestone.icon}
                      </motion.div>
                    }
                    color={milestone.color}
                  >
                    <motion.div
                      whileInView={{ x: 0, opacity: 1 }}
                      initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center mb-3">
                          <Text className="text-gray-500 dark:text-gray-400 font-medium text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                            {milestone.date}
                          </Text>
                        </div>
                        <Title level={4} className="mb-3 text-blue-600">
                          {milestone.title}
                        </Title>
                        <Paragraph className="dark:text-gray-300 leading-relaxed">
                          {milestone.description}
                        </Paragraph>
                      </Card>
                    </motion.div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-4">
              Những con người đằng sau MOSAIC
            </Title>
            <Paragraph className="text-center text-lg dark:text-gray-300 mb-16 max-w-3xl mx-auto">
              Mỗi thành viên đều có câu chuyện riêng, nhưng tất cả đều cùng chung một giấc mơ
            </Paragraph>
            
            <Row gutter={[32, 32]}>
              {teamMembers.map((member, index) => (
                <Col xs={24} lg={12} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-500">
                      <div className="flex items-start space-x-4 mb-6">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          {member.avatar.startsWith('/') ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-16 h-16 rounded-full object-cover shadow-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
                              {member.avatar}
                            </div>
                          )}
                        </motion.div>
                        <div>
                          <Title level={4} className="mb-1">{member.name}</Title>
                          <Text className="text-blue-600 font-semibold">{member.role}</Text>
                        </div>
                      </div>
                      
                      <Paragraph className="dark:text-gray-300 mb-4 leading-relaxed">
                        {member.story}
                      </Paragraph>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                        <Text italic className="text-gray-600 dark:text-gray-400">
                          {member.quote}
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

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10 text-6xl"
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 30, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
              style={{
                left: `${5 + i * 5}%`,
                top: `${10 + Math.sin(i) * 80}%`
              }}
            >
              {['🎯', '⭐', '🚀', '💎', '🏆'][i % 5]}
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-white text-center mb-16">
              Con số ấn tượng
            </Title>
            <Row gutter={[32, 32]}>
              {stats.map((stat, index) => (
                <Col xs={12} lg={6} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                      <Statistic
                        title={<span className="text-white/80 font-medium">{stat.title}</span>}
                        value={stat.value}
                        suffix={stat.suffix}
                        valueStyle={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '2.5rem'
                        }}
                      />
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Vision for Future */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <Title level={2} className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Tương lai của MOSAIC
              </Title>
              
              <Paragraph className="text-xl leading-relaxed dark:text-gray-300 mb-12">
                Chúng tôi không chỉ dừng lại ở 5 tỉnh thành. MOSAIC hướng đến việc trở thành 
                thương hiệu thời trang đại diện cho cả 63 tỉnh thành Việt Nam, và cuối cùng 
                là mang văn hóa Việt ra thế giới.
              </Paragraph>

              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                    <div className="text-4xl mb-4">🌏</div>
                    <Title level={4}>Mở rộng toàn cầu</Title>
                    <Paragraph className="text-gray-600 dark:text-gray-300">
                      Xuất khẩu sản phẩm đến 10 quốc gia trong 2 năm tới
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                    <div className="text-4xl mb-4">🎨</div>
                    <Title level={4}>Đa dạng sản phẩm</Title>
                    <Paragraph className="text-gray-600 dark:text-gray-300">
                      Phát triển thêm hoodie, tote bag và các item thời trang khác
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                    <div className="text-4xl mb-4">🤝</div>
                    <Title level={4}>Hợp tác bền vững</Title>
                    <Paragraph className="text-gray-600 dark:text-gray-300">
                      Liên kết với nghệ nhân địa phương để tạo ra giá trị bền vững
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .custom-timeline .ant-timeline-item-head {
          background-color: transparent;
          border: none;
        }
        
        .custom-timeline .ant-timeline-item-tail {
          border-left: 2px solid #d9d9d9;
        }
        
        @media (max-width: 768px) {
          .custom-timeline .ant-timeline {
            padding-left: 20px;
          }
        }
      `}</style>
    </MainLayout>
  );
};

export default OurStoryPage;