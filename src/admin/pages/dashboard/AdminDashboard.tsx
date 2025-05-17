import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography } from 'antd';
import { 
  ShoppingOutlined, 
  DollarOutlined, 
  UserOutlined, 
  ShoppingCartOutlined 
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

import RecentOrdersWidget from './RecentOrdersWidget';
const { Title, Text } = Typography;

// Mock data (would be replaced with actual API calls)
const salesData = [
  { name: 'T1', sales: 4000 },
  { name: 'T2', sales: 3000 },
  { name: 'T3', sales: 5000 },
  { name: 'T4', sales: 2780 },
  { name: 'T5', sales: 1890 },
  { name: 'T6', sales: 2390 },
  { name: 'T7', sales: 3490 },
];

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation(['admin', 'common', 'admin-orders']);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalProducts: 124,
        totalOrders: 85,
        totalRevenue: 12580,
        totalUsers: 45,
      });
      setLoading(false);
    }, 1000);
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Spin />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <Title level={2} className="mb-1 dark:text-white">
          {t('admin:dashboard.title')}
        </Title>
        <Text className="text-gray-500 dark:text-gray-400">
          {t('admin:dashboard.welcome')}
        </Text>
      </div>
      
      {/* Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title={t('admin:dashboard.total_products')}
                value={stats.totalProducts}
                prefix={<ShoppingOutlined className="text-blue-500" />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title={t('admin:dashboard.total_orders')}
                value={stats.totalOrders}
                prefix={<ShoppingCartOutlined className="text-green-500" />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title={t('admin:dashboard.total_revenue')}
                value={stats.totalRevenue}
                prefix={<DollarOutlined className="text-red-500" />}
                valueStyle={{ color: '#cf1322' }}
                suffix="$"
              />
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title={t('common:users')}
                value={stats.totalUsers}
                prefix={<UserOutlined className="text-purple-500" />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card
              title={t('admin:dashboard.sales_over_time')}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`$${value}`, 'Sales']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card
              title={t('admin:dashboard.popular_categories')}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'T-Shirts', sales: 65 },
                      { name: 'Hoodies', sales: 40 },
                      { name: 'Accessories', sales: 25 },
                      { name: 'Hats', sales: 15 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value: number) => [`${value}`, 'Sales']} />
                    <Legend />
                    <Bar dataKey="sales" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <RecentOrdersWidget />
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;