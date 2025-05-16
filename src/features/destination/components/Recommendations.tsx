import React from 'react';
import { Card, Typography, Button, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { 
  RightOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  FireOutlined,
  StarFilled 
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

interface RecommendationsProps {
  city: string;
}

const Recommendations: React.FC<RecommendationsProps> = ({ city }) => {
const { t, i18n } = useTranslation(['destinationdanang', 'common']);
  
  // This would typically come from an API
  const recommendations = [
    {
      id: 1,
      type: 'itinerary',
      title: {
        en: '3-Day Perfect Da Nang Itinerary',
        vi: 'Lịch trình 3 ngày hoàn hảo ở Đà Nẵng'
      },
      image: `/assets/destinations/${city}/itinerary-1.jpg`,
      description: {
        en: 'Explore the best of Da Nang in 3 days, covering all major attractions and hidden gems.',
        vi: 'Khám phá những điều tuyệt vời nhất của Đà Nẵng trong 3 ngày, bao gồm tất cả các điểm tham quan chính và những viên ngọc ẩn.'
      },
      rating: 4.8,
      reviews: 124,
      highlights: [
        { en: 'Golden Bridge', vi: 'Cầu Vàng' },
        { en: 'My Khe Beach', vi: 'Biển Mỹ Khê' },
        { en: 'Marble Mountains', vi: 'Ngũ Hành Sơn' }
      ]
    },
    {
      id: 2,
      type: 'hotel',
      title: {
        en: 'Best Beachfront Hotels',
        vi: 'Những khách sạn bên bờ biển tốt nhất'
      },
      image: `/assets/destinations/${city}/hotel-1.jpg`,
      description: {
        en: 'Luxury and mid-range beachfront accommodations with stunning views of the East Sea.',
        vi: 'Chỗ ở sang trọng và tầm trung bên bờ biển với tầm nhìn tuyệt đẹp ra Biển Đông.'
      },
      rating: 4.7,
      reviews: 89,
      highlights: [
        { en: 'Luxury options', vi: 'Lựa chọn sang trọng' },
        { en: 'Ocean views', vi: 'Tầm nhìn ra biển' },
        { en: 'Best locations', vi: 'Vị trí tốt nhất' }
      ]
    },
    {
      id: 3,
      type: 'food',
      title: {
        en: 'Must-Try Local Cuisine',
        vi: 'Ẩm thực địa phương nhất định phải thử'
      },
      image: `/assets/destinations/${city}/food-guide.jpg`,
      description: {
        en: 'A culinary guide to the unique flavors of Da Nang and where to find the best local dishes.',
        vi: 'Hướng dẫn ẩm thực về hương vị độc đáo của Đà Nẵng và nơi tìm thấy các món ăn địa phương ngon nhất.'
      },
      rating: 4.9,
      reviews: 156,
      highlights: [
        { en: 'Mi Quang', vi: 'Mì Quảng' },
        { en: 'Banh Xeo', vi: 'Bánh xèo' },
        { en: 'Seafood', vi: 'Hải sản' }
      ]
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  // Get icon based on recommendation type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'itinerary':
        return <ClockCircleOutlined />;
      case 'hotel':
        return <EnvironmentOutlined />;
      case 'food':
        return <FireOutlined />;
      default:
        return <StarFilled />;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {recommendations.map((rec) => (
        <motion.div 
          key={rec.id}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
            hoverable 
            className="h-full"
            cover={
              <div className="relative h-48">
                <img 
                  src={rec.image} 
                  alt={rec.title[i18n.language === 'vi' ? 'vi' : 'en']} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 m-3">
                  <div className="px-3 py-1 bg-primary text-white rounded-full flex items-center text-sm">
                    {getTypeIcon(rec.type)}
                    <span className="ml-1">
                      {t(`destinationdanang:recommendations.types.${rec.type}`)}
                    </span>
                  </div>
                </div>
              </div>
            }
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <Title level={5} className="mb-0 dark:text-white">
                  {rec.title[i18n.language === 'vi' ? 'vi' : 'en']}
                </Title>
                <div className="flex items-center">
                  <StarFilled className="text-yellow-500 mr-1" />
                  <Text className="text-sm">{rec.rating}</Text>
                </div>
              </div>
              
              <Paragraph 
                ellipsis={{ rows: 2 }} 
                className="text-gray-600 dark:text-gray-300 mb-4"
              >
                {rec.description[i18n.language === 'vi' ? 'vi' : 'en']}
              </Paragraph>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {rec.highlights.map((highlight, index) => (
                  <Tooltip key={index} title={t('destinationdanang:recommendations.highlight')}>
                    <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                      {highlight[i18n.language === 'vi' ? 'vi' : 'en']}
                    </div>
                  </Tooltip>
                ))}
              </div>
              
              <Button 
                type="primary" 
                className="w-full flex items-center justify-center"
              >
                {t('destinationdanang:recommendations.view_details')}
                <RightOutlined className="ml-1" />
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Recommendations;
