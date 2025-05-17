import React, { useState, useEffect } from 'react';
import { Card, Radio, Row, Col, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRevenueAnalytics } from '@/admin/store/slices/orderSlice';
import { OrderStatus } from '@/admin/types/order.types';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const OrderAnalytics: React.FC = () => {
  const { t } = useTranslation(['admin']);
  const dispatch = useAppDispatch();
  const { analytics } = useAppSelector(state => state.orders);
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('day');
  
  useEffect(() => {
    dispatch(fetchRevenueAnalytics(timePeriod));
  }, [dispatch, timePeriod]);
  
  // Prepare data for status distribution chart
  const getStatusDistributionData = () => {
    if (!analytics.countByStatus) return [];
    
    const statusData = Object.entries(analytics.countByStatus).map(([status, count]) => ({
      name: t(`admin:orders.statuses.${status.toLowerCase()}`),
      value: count,
      status
    }));
    
    return statusData;
  };
  
  // Mock revenue data (replace with actual data from API)
  const getRevenueData = () => {
    if (!analytics.revenueData) {
      // Mock data if API data not available
      const mockData = [];
      const labels = timePeriod === 'day' 
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : timePeriod === 'week'
        ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] 
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      
      for (let i = 0; i < labels.length; i++) {
        mockData.push({
          name: labels[i],
          revenue: Math.floor(Math.random() * 5000) + 1000,
          orders: Math.floor(Math.random() * 20) + 5
        });
      }
      
      return mockData;
    }
    
    return analytics.revenueData;
  };
  
  // Pie chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF0000'];
  
  // Status colors
  const statusColors = {
    [OrderStatus.PENDING_PAYMENT]: '#ffa940',
    [OrderStatus.PAID]: '#2f54eb',
    [OrderStatus.PROCESSING]: '#13c2c2',
    [OrderStatus.SHIPPING]: '#1890ff',
    [OrderStatus.DELIVERED]: '#52c41a',
    [OrderStatus.CANCELLED]: '#f5222d'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        title={t('admin:orders.analytics.title')}
        extra={
          <Radio.Group
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="day">{t('admin:orders.analytics.daily')}</Radio.Button>
            <Radio.Button value="week">{t('admin:orders.analytics.weekly')}</Radio.Button>
            <Radio.Button value="month">{t('admin:orders.analytics.monthly')}</Radio.Button>
          </Radio.Group>
        }
      >
        <Row gutter={[16, 16]}>
          {/* Revenue Chart */}
          <Col xs={24} lg={16}>
            <Card title={t('admin:orders.analytics.revenue_trend')} bordered={false}>
              {analytics.loading ? (
                <Skeleton active paragraph={{ rows: 5 }} />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getRevenueData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8884d8" 
                        name={t('admin:orders.analytics.revenue')}
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </Col>
          
          {/* Status Distribution */}
          <Col xs={24} sm={12} lg={8}>
            <Card title={t('admin:orders.analytics.status_distribution')} bordered={false}>
              {analytics.loading ? (
                <Skeleton active paragraph={{ rows: 5 }} />
              ) : (
                <div className="h-64 flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getStatusDistributionData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getStatusDistributionData().map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={statusColors[entry.status as OrderStatus] || COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, t('admin:orders.analytics.orders')]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </Col>
          
          {/* Orders Count Chart */}
          <Col xs={24}>
            <Card title={t('admin:orders.analytics.orders_count')} bordered={false}>
              {analytics.loading ? (
                <Skeleton active paragraph={{ rows: 5 }} />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getRevenueData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="orders" 
                        fill="#82ca9d" 
                        name={t('admin:orders.analytics.orders_count')} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    </motion.div>
  );
};

export default OrderAnalytics;