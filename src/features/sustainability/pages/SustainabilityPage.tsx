import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Card, Row, Col, Progress, Timeline, Statistic, Button } from 'antd';
import { 
  LeftOutlined,
  EyeOutlined,
  HeartOutlined,
  TeamOutlined,
  GlobalOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
  StarOutlined
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;

const SustainabilityPage: React.FC = () => {
  const initiatives = [
    {
      icon: <EyeOutlined />,
      title: 'Vật liệu tái chế',
      description: 'Sử dụng 85% cotton hữu cơ và vật liệu tái chế trong sản xuất',
      progress: 85,
      color: 'from-green-500 to-emerald-600',
      achievements: ['Giảm 60% chất thải', 'Tiết kiệm 40% nước', 'Carbon footprint thấp']
    },
    {
      icon: <LeftOutlined />,
      title: 'Sản xuất xanh',
      description: 'Quy trình sản xuất thân thiện môi trường, không sử dụng hóa chất độc hại',
      progress: 92,
      color: 'from-blue-500 to-cyan-600',
      achievements: ['100% thuốc nhuộm thân thiện', 'Năng lượng tái tạo', 'Zero waste đến 2025']
    },
    {
      icon: <HeartOutlined />,
      title: 'Trách nhiệm xã hội',
      description: 'Hỗ trợ nghệ nhân địa phương và tạo việc làm bền vững cho cộng đồng',
      progress: 78,
      color: 'from-purple-500 to-pink-600',
      achievements: ['50+ việc làm tạo ra', 'Hỗ trợ 20 gia đình nghệ nhân', 'Đào tạo kỹ năng miễn phí']
    },
    {
      icon: <GlobalOutlined />,
      title: 'Tác động toàn cầu',
      description: 'Mang văn hóa Việt Nam ra thế giới thông qua sản phẩm bền vững',
      progress: 65,
      color: 'from-orange-500 to-red-600',
      achievements: ['5 tỉnh thành Việt Nam', 'Kế hoạch mở rộng quốc tế', 'Đại sứ văn hóa']
    }
  ];

  const sustainabilityGoals = [
    {
      year: '2024',
      goal: 'Carbon Neutral',
      description: 'Đạt mục tiêu trung hòa carbon trong toàn bộ quy trình sản xuất',
      status: 'Đang thực hiện',
      progress: 75,
      color: '#52c41a'
    },
    {
      year: '2025',
      goal: 'Zero Waste',
      description: 'Không có chất thải ra môi trường, tái chế 100% phụ phẩm',
      status: 'Trong kế hoạch',
      progress: 45,
      color: '#1890ff'
    },
    {
      year: '2026',
      goal: 'Fair Trade',
      description: 'Đạt chứng nhận thương mại công bằng cho tất cả sản phẩm',
      status: 'Chuẩn bị',
      progress: 30,
      color: '#722ed1'
    },
    {
      year: '2027',
      goal: 'Global Impact',
      description: 'Mở rộng mô hình bền vững ra 10 quốc gia trên thế giới',
      status: 'Tầm nhìn',
      progress: 15,
      color: '#fa8c16'
    }
  ];

  const environmentalStats = [
    {
      title: 'CO2 tiết kiệm',
      value: 2.5,
      suffix: ' tấn',
      description: 'So với sản xuất truyền thống',
      icon: <LeftOutlined />,
      color: 'green'
    },
    {
      title: 'Nước tiết kiệm',
      value: 15000,
      suffix: ' lít',
      description: 'Từ quy trình sản xuất xanh',
      icon: <EnvironmentOutlined />,
      color: 'blue'
    },
    {
      title: 'Nghệ nhân hỗ trợ',
      value: 25,
      suffix: ' người',
      description: 'Tạo việc làm bền vững',
      icon: <TeamOutlined />,
      color: 'purple'
    },
    {
      title: 'Sản phẩm xanh',
      value: 95,
      suffix: '%',
      description: 'Sử dụng vật liệu thân thiện',
      icon: <EyeOutlined />,
      color: 'orange'
    }
  ];

  const greenPractices = [
    {
      practice: 'Sử dụng cotton hữu cơ',
      description: 'Cotton được trồng không sử dụng thuốc trừ sâu và phân bón hóa học',
      impact: 'Giảm 88% tác động môi trường so với cotton thông thường',
      icon: '🌱'
    },
    {
      practice: 'Thuốc nhuộm thực vật',
      description: 'Sử dụng màu tự nhiên từ thực vật như nghệ, chàm, vỏ cây',
      impact: 'Không độc hại, phân hủy sinh học 100%',
      icon: '🎨'
    },
    {
      practice: 'Bao bì tái chế',
      description: 'Hộp đựng làm từ giấy tái chế, túi từ vật liệu phân hủy sinh học',
      impact: 'Giảm 70% rác thải bao bì',
      icon: '📦'
    },
    {
      practice: 'Vận chuyển xanh',
      description: 'Ưu tiên vận chuyển bằng xe điện và tối ưu hóa tuyến đường',
      impact: 'Giảm 50% khí thải từ vận chuyển',
      icon: '🚚'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20">
        {/* Animated background */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              animate={{
                y: [0, -40, 0],
                x: [0, Math.sin(i * 0.6) * 30, 0],
                rotate: [0, 360],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: Math.random() * 12 + 8,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            >
              {['🌱', '🌍', '♻️', '💚', '🌿', '⚡'][i % 6]}
            </motion.div>
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
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="text-8xl">🌍</div>
            </motion.div>

            <Title level={1} className="mb-6 text-5xl md:text-7xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Phát triển bền vững
            </Title>
            
            <Paragraph className="text-xl md:text-2xl dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
              MOSAIC cam kết tạo ra những sản phẩm không chỉ đẹp mà còn có trách nhiệm với môi trường và xã hội
            </Paragraph>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-bold shadow-lg">
                🌱 Xanh 100%
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-bold shadow-lg">
                ♻️ Tái chế
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full font-bold shadow-lg">
                💚 Trách nhiệm
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sustainability Initiatives */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-4">
              Sáng kiến phát triển bền vững
            </Title>
            <Paragraph className="text-center text-lg dark:text-gray-300 mb-16 max-w-3xl mx-auto">
              Chúng tôi không ngừng đổi mới để tạo ra tác động tích cực đến môi trường và xã hội
            </Paragraph>
            
            <Row gutter={[32, 32]}>
              {initiatives.map((initiative, index) => (
                <Col xs={24} lg={12} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${initiative.color} opacity-5`} />
                      
                      <div className="relative z-10">
                        <div className="flex items-center mb-6">
                          <motion.div
                            className={`w-16 h-16 bg-gradient-to-br ${initiative.color} rounded-full flex items-center justify-center text-3xl text-white shadow-lg mr-4`}
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            transition={{ duration: 0.3 }}
                          >
                            {initiative.icon}
                          </motion.div>
                          <div className="flex-1">
                            <Title level={4} className="mb-2">{initiative.title}</Title>
                            <div className="flex items-center space-x-2">
                              <Progress 
                                percent={initiative.progress} 
                                size="small" 
                                strokeColor={{
                                  '0%': '#52c41a',
                                  '100%': '#73d13d',
                                }}
                                className="flex-1"
                              />
                              <Text strong className="text-green-600">{initiative.progress}%</Text>
                            </div>
                          </div>
                        </div>
                        
                        <Paragraph className="dark:text-gray-300 mb-6 leading-relaxed">
                          {initiative.description}
                        </Paragraph>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <Text strong className="block mb-3 text-green-600">Thành tích đạt được:</Text>
                          <ul className="space-y-2">
                            {initiative.achievements.map((achievement, idx) => (
                              <li key={idx} className="flex items-start text-sm">
                                <StarOutlined className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Environmental Stats */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-16">
              Tác động môi trường tích cực
            </Title>
            
            <Row gutter={[32, 32]}>
              {environmentalStats.map((stat, index) => (
                <Col xs={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card className="text-center h-full hover:shadow-lg transition-all duration-300">
                      <div className={`text-4xl mb-4 text-${stat.color}-500`}>
                        {stat.icon}
                      </div>
                      <Statistic
                        title={stat.title}
                        value={stat.value}
                        suffix={stat.suffix}
                        valueStyle={{
                          color: stat.color === 'green' ? '#52c41a' : 
                                 stat.color === 'blue' ? '#1890ff' :
                                 stat.color === 'purple' ? '#722ed1' : '#fa8c16',
                          fontWeight: 'bold'
                        }}
                      />
                      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">
                        {stat.description}
                      </Text>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Green Practices */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-16">
              Thực hành xanh của MOSAIC
            </Title>
            
            <Row gutter={[32, 32]}>
              {greenPractices.map((practice, index) => (
                <Col xs={24} md={12} key={index}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -3 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl flex-shrink-0">{practice.icon}</div>
                        <div className="flex-1">
                          <Title level={4} className="mb-3 text-green-600">
                            {practice.practice}
                          </Title>
                          <Paragraph className="dark:text-gray-300 mb-4 leading-relaxed">
                            {practice.description}
                          </Paragraph>
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                            <Text strong className="text-green-700 dark:text-green-400">
                              💡 Tác động: 
                            </Text>
                            <Text className="block text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {practice.impact}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Sustainability Goals Timeline */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} className="text-center mb-16">
              Lộ trình phát triển bền vững
            </Title>
            
            <div className="max-w-4xl mx-auto">
              <Timeline mode="left">
                {sustainabilityGoals.map((goal, index) => (
                  <Timeline.Item
                    key={index}
                    dot={
                      <motion.div
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg text-white font-bold text-lg"
                        style={{ backgroundColor: goal.color }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {goal.year}
                      </motion.div>
                    }
                    color={goal.color}
                  >
                    <motion.div
                      whileInView={{ x: 0, opacity: 1 }}
                      initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <Title level={4} className="mb-0" style={{ color: goal.color }}>
                            {goal.goal}
                          </Title>
                          <Text className="text-sm font-medium px-3 py-1 rounded-full" 
                                style={{ 
                                  backgroundColor: `${goal.color}20`, 
                                  color: goal.color 
                                }}>
                            {goal.status}
                          </Text>
                        </div>
                        <Paragraph className="dark:text-gray-300 mb-4 leading-relaxed">
                          {goal.description}
                        </Paragraph>
                        <div className="flex items-center space-x-3">
                          <Progress 
                            percent={goal.progress} 
                            strokeColor={goal.color}
                            className="flex-1"
                          />
                          <Text strong style={{ color: goal.color }}>
                            {goal.progress}%
                          </Text>
                        </div>
                      </Card>
                    </motion.div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partnership & Community */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <Title level={2} className="mb-8">
                Cộng đồng & Đối tác
              </Title>
              
              <Paragraph className="text-xl leading-relaxed dark:text-gray-300 mb-12">
                MOSAIC hợp tác với các tổ chức, nghệ nhân và cộng đồng địa phương 
                để tạo ra tác động tích cực và phát triển bền vững.
              </Paragraph>

              <Row gutter={[24, 24]} className="mb-12">
                <Col xs={24} md={8}>
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                    <TeamOutlined className="text-4xl text-blue-500 mb-4" />
                    <Title level={4}>Nghệ nhân địa phương</Title>
                    <Paragraph className="text-gray-600 dark:text-gray-300">
                      Hợp tác với 25+ nghệ nhân tại 5 tỉnh thành, tạo việc làm bền vững
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                    <GlobalOutlined className="text-4xl text-green-500 mb-4" />
                    <Title level={4}>Tổ chức môi trường</Title>
                    <Paragraph className="text-gray-600 dark:text-gray-300">
                      Liên kết với các NGO về môi trường để nghiên cứu và phát triển
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300">
                    <HeartOutlined className="text-4xl text-red-500 mb-4" />
                    <Title level={4}>Cộng đồng khách hàng</Title>
                    <Paragraph className="text-gray-600 dark:text-gray-300">
                      Xây dựng cộng đồng những người yêu thích sản phẩm bền vững
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-5xl mb-6">🌱</div>
            <Title level={2} className="text-white mb-4">
              Cùng chúng tôi tạo nên sự thay đổi
            </Title>
            <Paragraph className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Mỗi sản phẩm bạn chọn là một bước tiến hướng tới tương lai bền vững cho hành tinh
            </Paragraph>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="large"
                  className="bg-white text-green-600 border-white hover:bg-gray-100 h-12 px-8 font-semibold"
                  icon={<ShoppingOutlined />}
                  href="/products"
                >
                  Mua sản phẩm xanh
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="large"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-green-600 h-12 px-8 font-semibold"
                  icon={<HeartOutlined />}
                  href="/about"
                >
                  Tìm hiểu thêm
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SustainabilityPage;