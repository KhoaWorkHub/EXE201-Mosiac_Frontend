import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Typography, Divider, Space, Tag } from 'antd';
import { CompassOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';

const { Title, Text, Paragraph } = Typography;

// List of available tour guides
const tourGuides = [
  {
    id: 'danang',
    title: 'Da Nang',
    description: 'destination:danang.overview.intro',
    image: '/assets/destinations/danang/banner-1.jpg',
    url: '/destinations/danang',
    date: '2025-02-15',
    region: 'Central Vietnam'
  },
  // You can add more destinations here in the future
];

const BlogPage: React.FC = () => {
  const { t } = useTranslation(['destination', 'common']);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Title level={1} className="dark:text-white">
            {t('common:nav.blog')}
          </Title>
          <Paragraph className="text-lg dark:text-gray-300 max-w-3xl mx-auto">
            Explore our travel guides and discover the beauty of Vietnam
          </Paragraph>
        </div>
        
        <Divider className="mb-12" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tourGuides.map((guide) => (
            <Link to={guide.url} key={guide.id}>
              <Card 
                hoverable 
                cover={
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={guide.image} 
                      alt={guide.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                }
                className="h-full"
              >
                <Title level={3} className="mb-2 dark:text-white">
                  {guide.title}
                </Title>
                
                <Space className="mb-4">
                  <Tag color="blue" icon={<EnvironmentOutlined />}>
                    {guide.region}
                  </Tag>
                  <Tag color="green" icon={<CalendarOutlined />}>
                    {new Date(guide.date).toLocaleDateString()}
                  </Tag>
                </Space>
                
                <Paragraph className="dark:text-gray-300">
                  {t(guide.description)}
                </Paragraph>
                
                <div className="flex items-center mt-4 text-primary">
                  <CompassOutlined className="mr-2" />
                  <Text strong className="dark:text-primary">
                    {t('common:actions.explore')}
                  </Text>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogPage;