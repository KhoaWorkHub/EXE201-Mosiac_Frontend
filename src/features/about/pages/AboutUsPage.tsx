import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Card, Typography, Timeline, Row, Col, Statistic, Avatar, Tag } from 'antd';
import { 
  RocketOutlined, 
  TeamOutlined, 
  BulbOutlined, 
  TrophyOutlined,
  HeartOutlined,
  GlobalOutlined,
  StarOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Paragraph, Text } = Typography;

const AboutUsPage: React.FC = () => {
  useTranslation(['common']);
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const missionInView = useInView(missionRef, { amount: 0.1 });
  const teamInView = useInView(teamRef, { amount: 0.1 });
  const timelineInView = useInView(timelineRef, { amount: 0.1 });
  const statsInView = useInView(statsRef, { amount: 0.1 });

  // Enhanced parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollPosition * 0.5}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Team members data
  const teamMembers = [
    {
      name: 'Bảo Trân',
      role: 'CEO & Founder',
      major: 'Business Administration',
      avatar: '/team/member1.jpg',
      description: 'Passionate about travel technology and sustainable tourism',
      skills: ['Leadership', 'Strategy', 'Vision'],
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Minh Quân | Đức Lương | Khoa',
      role: 'CTO & Co-Founder', 
      major: 'Software Engineering',
      avatar: '/team/member2.jpg',
      description: 'Full-stack developer with expertise in modern web technologies',
      skills: ['React', 'Node.js', 'AI/ML'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Cường',
      role: 'Head of Design',
      major: 'Digital Arts & Design',
      avatar: '/team/member3.jpg', 
      description: 'Creative designer focused on user experience and visual storytelling',
      skills: ['UI/UX', 'Branding', 'Motion Design'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Duy Thịnh',
      role: 'Marketing Director',
      major: 'Digital Marketing',
      avatar: '/team/member4.jpg',
      description: 'Digital marketing expert specializing in travel industry growth',
      skills: ['SEO', 'Social Media', 'Analytics'],
      color: 'from-green-500 to-emerald-500'
    }
  ];

  // Company milestones
  const milestones = [
    {
      title: 'Inception',
      date: '2024 Q1',
      description: 'MOSAIC was born from a class project in EXE101 - Entrepreneurship course at FPTU',
      icon: <BulbOutlined />,
      color: '#faad14'
    },
    {
      title: 'MVP Launch',
      date: '2024 Q2', 
      description: 'Launched our first destination guide for Da Nang with interactive features',
      icon: <RocketOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Platform Expansion',
      date: '2024 Q3',
      description: 'Added Ho Chi Minh City, Quang Ninh, and Khanh Hoa destination guides',
      icon: <GlobalOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Recognition',
      date: '2024 Q4',
      description: 'Won Best Startup Idea Award in FPT University Entrepreneurship Competition',
      icon: <TrophyOutlined />,
      color: '#eb2f96'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0, rotateY: -15 },
    visible: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-30"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.sin(i) * 100, 0],
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
            />
          ))}
        </div>

        <div ref={heroRef} className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Logo Animation */}
            <motion.div
              className="mb-8"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="text-5xl text-white"
                >
                  🧩
                </motion.div>
                
                {/* Pulse rings */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-4 border-white/30 rounded-full"
                    animate={{
                      scale: [1, 2 + i * 0.5, 3 + i * 0.5],
                      opacity: [0.8, 0.4, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <Title level={1} className="mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent text-5xl md:text-7xl font-bold">
              MOSAIC
            </Title>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Paragraph className="text-xl md:text-2xl dark:text-gray-300 mb-6 leading-relaxed">
                Crafting extraordinary travel experiences through innovative technology
              </Paragraph>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Tag color="orange" className="px-4 py-2 text-lg font-medium rounded-full">
                  <RocketOutlined className="mr-2" />
                  FPT University Startup
                </Tag>
                <Tag color="red" className="px-4 py-2 text-lg font-medium rounded-full">
                  <HeartOutlined className="mr-2" />
                  EXE202 Project
                </Tag>
                <Tag color="pink" className="px-4 py-2 text-lg font-medium rounded-full">
                  <CrownOutlined className="mr-2" />
                  Award Winner
                </Tag>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-orange-500 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-orange-500 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision Section */}
      <section ref={missionRef} className="py-20 bg-white dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-900/10 dark:to-red-900/10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <Title level={2} className="mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Our Mission & Vision
              </Title>
              <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
                Revolutionizing travel experiences in Vietnam through cutting-edge technology and passionate storytelling
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              <Col xs={24} lg={12}>
                <motion.div variants={cardVariants}>
                  <Card className="h-full bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700 hover:shadow-2xl transition-all duration-500">
                    <div className="text-center">
                      <motion.div
                        className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <BulbOutlined className="text-3xl text-white" />
                      </motion.div>
                      <Title level={3} className="mb-4 text-orange-600">Our Mission</Title>
                      <Paragraph className="dark:text-gray-300 leading-relaxed">
                        To democratize travel planning by providing immersive, interactive destination guides 
                        that showcase the authentic beauty and culture of Vietnam. We believe every traveler 
                        deserves access to insider knowledge and extraordinary experiences.
                      </Paragraph>
                    </div>
                  </Card>
                </motion.div>
              </Col>

              <Col xs={24} lg={12}>
                <motion.div variants={cardVariants}>
                  <Card className="h-full bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700 hover:shadow-2xl transition-all duration-500">
                    <div className="text-center">
                      <motion.div
                        className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6"
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <GlobalOutlined className="text-3xl text-white" />
                      </motion.div>
                      <Title level={3} className="mb-4 text-blue-600">Our Vision</Title>
                      <Paragraph className="dark:text-gray-300 leading-relaxed">
                        To become the leading digital platform for Southeast Asian travel, connecting millions 
                        of explorers with hidden gems and local experiences. We envision a world where 
                        technology enhances rather than replaces human connection and cultural discovery.
                      </Paragraph>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <Title level={2} className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Meet Our Team
              </Title>
              <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
                Young entrepreneurs from FPT University, united by passion for travel and innovation
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {teamMembers.map((member, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full text-center hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-5`} />
                      
                      <div className="relative z-10">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4"
                        >
                          <Avatar 
                            size={100} 
                            src={member.avatar}
                            className={`mx-auto bg-gradient-to-r ${member.color} shadow-lg`}
                          />
                        </motion.div>
                        
                        <Title level={4} className="mb-2">{member.name}</Title>
                        <Text className={`text-transparent bg-gradient-to-r ${member.color} bg-clip-text font-semibold`}>
                          {member.role}
                        </Text>
                        <Paragraph className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {member.major}
                        </Paragraph>
                        <Paragraph className="dark:text-gray-300 text-sm leading-relaxed mt-3">
                          {member.description}
                        </Paragraph>
                        
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {member.skills.map((skill, idx) => (
                            <Tag key={idx} color="processing" className="text-xs">
                              {skill}
                            </Tag>
                          ))}
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

      {/* Company Timeline */}
      <section ref={timelineRef} className="py-20 bg-white dark:bg-gray-800 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={timelineInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <Title level={2} className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Our Journey
              </Title>
              <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
                From classroom idea to award-winning startup - the MOSAIC story
              </Paragraph>
            </motion.div>

            <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
              <Timeline mode="left" className="custom-timeline">
                {milestones.map((milestone, index) => (
                  <Timeline.Item
                    key={index}
                    dot={
                      <motion.div
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: milestone.color }}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-white text-lg">
                          {milestone.icon}
                        </div>
                      </motion.div>
                    }
                    color={milestone.color}
                  >
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <Title level={4} className="mb-2">{milestone.title}</Title>
                        <Text className="text-gray-500 dark:text-gray-400 font-medium">
                          {milestone.date}
                        </Text>
                        <Paragraph className="dark:text-gray-300 mt-2">
                          {milestone.description}
                        </Paragraph>
                      </Card>
                    </motion.div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Floating elements */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10 text-4xl"
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
                delay: i * 0.5
              }}
              style={{
                left: `${5 + i * 5}%`,
                top: `${10 + Math.sin(i) * 80}%`
              }}
            >
              {['🚀', '💡', '🏆', '🌟', '🎯', '⭐', '🔥', '💎'][i % 8]}
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <Title level={2} className="text-white mb-4">
                Our Impact
              </Title>
              <Paragraph className="text-xl text-white/90 max-w-3xl mx-auto">
                Numbers that reflect our commitment to excellence and innovation
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]}>
              {[
                { title: 'Destinations Covered', value: 5, suffix: '+', icon: <GlobalOutlined /> },
                { title: 'Active Users', value: 1200, suffix: '+', icon: <TeamOutlined /> },
                { title: 'Features Delivered', value: 50, suffix: '+', icon: <ThunderboltOutlined /> },
                { title: 'Awards Won', value: 3, suffix: '', icon: <TrophyOutlined /> }
              ].map((stat, index) => (
                <Col xs={12} lg={6} key={index}>
                  <motion.div
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="text-center bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                      <motion.div
                        className="text-4xl text-white mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      >
                        {stat.icon}
                      </motion.div>
                      <Statistic
                        title={<span className="text-white/80">{stat.title}</span>}
                        value={stat.value}
                        suffix={stat.suffix}
                        valueStyle={{ color: 'white', fontWeight: 'bold', fontSize: '2rem' }}
                      />
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <Title level={2} className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Core Values
              </Title>
              <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
                The principles that guide every decision and innovation at MOSAIC
              </Paragraph>
            </motion.div>

            <Row gutter={[24, 24]}>
              {[
                {
                  icon: <HeartOutlined />,
                  title: 'Passion',
                  description: 'We pour our hearts into every feature, driven by genuine love for travel and technology',
                  color: 'from-red-500 to-pink-500'
                },
                {
                  icon: <StarOutlined />,
                  title: 'Excellence',
                  description: 'We never settle for good enough, constantly pushing boundaries to deliver exceptional experiences',
                  color: 'from-yellow-500 to-orange-500'
                },
                {
                  icon: <TeamOutlined />,
                  title: 'Collaboration',
                  description: 'Together we achieve more, fostering a culture of openness, respect, and shared success',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: <RocketOutlined />,
                  title: 'Innovation',
                  description: 'We embrace new ideas and cutting-edge technology to solve real problems for real people',
                  color: 'from-purple-500 to-indigo-500'
                }
              ].map((value, index) => (
                <Col xs={24} md={12} lg={6} key={index}>
                  <motion.div
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full text-center hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-5`} />
                      
                      <div className="relative z-10">
                        <motion.div
                          className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-2xl text-white">
                            {value.icon}
                          </div>
                        </motion.div>
                        
                        <Title level={4} className="mb-3">{value.title}</Title>
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
    </MainLayout>
  );
};

export default AboutUsPage;