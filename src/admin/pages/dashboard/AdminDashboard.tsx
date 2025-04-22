// src/admin/pages/dashboard/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, List, Avatar, Spin } from 'antd';
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
  const { t } = useTranslation(['admin', 'common']);
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
  
  const recentOrders = [
    { id: 1, customer: 'Nguyễn Văn A', total: 125.99, status: 'Delivered', date: '2023-01-15' },
    { id: 2, customer: 'Trần Thị B', total: 89.99, status: 'Processing', date: '2023-01-14' },
    { id: 3, customer: 'Lê Văn C', total: 199.99, status: 'Shipped', date: '2023-01-13' },
    { id: 4, customer: 'Phạm Thị D', total: 59.99, status: 'Pending', date: '2023-01-12' },
    { id: 5, customer: 'Hoàng Văn E', total: 149.99, status: 'Delivered', date: '2023-01-11' },
  ];
  
  const popularProducts = [
    { id: 1, name: 'Northern Vietnam T-Shirt', sales: 28, image: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Hanoi Old Quarter Tee', sales: 23, image: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Ha Long Bay QR Shirt', sales: 20, image: 'https://via.placeholder.com/40' },
    { id: 4, name: 'Hue Imperial Shirt', sales: 15, image: 'https://via.placeholder.com/40' },
  ];
  
  const orderColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('common:checkout.customer'),
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: t('common:checkout.total'),
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total}`,
    },
    {
      title: t('common:checkout.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        if (status === 'Processing') color = 'blue';
        if (status === 'Shipped') color = 'orange';
        if (status === 'Pending') color = 'gold';
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: t('common:checkout.date'),
      dataIndex: 'date',
      key: 'date',
    },
  ];
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white mb-6">
          {t('admin:dashboard.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {t('admin:dashboard.welcome')}
        </p>
      </div>
      
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
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card
              title={t('admin:dashboard.recent_orders')}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <Table
                columns={orderColumns}
                dataSource={recentOrders}
                pagination={false}
                rowKey="id"
                size="small"
              />
            </Card>
          </motion.div>
        </Col>
        
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card
              title={t('admin:dashboard.popular_products')}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <List
                itemLayout="horizontal"
                dataSource={popularProducts}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.image} />}
                      title={item.name}
                      description={`${item.sales} sold`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;