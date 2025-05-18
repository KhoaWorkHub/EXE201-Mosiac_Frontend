import React, { useState, useEffect } from 'react';
import { Card, Radio, Row, Col, Skeleton, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRevenueAnalytics, fetchOrderAnalytics } from '@/admin/store/slices/orderSlice';
import { OrderStatus, OrderStatusColors } from '@/admin/types/order.types';
import { formatCurrency } from '@/utils/formatters';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const OrderAnalytics: React.FC = () => {
  const { t } = useTranslation(['admin-orders', 'common']);
  const dispatch = useAppDispatch();
  const { analytics } = useAppSelector(state => state.orders);
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('day');
  
  useEffect(() => {
    // Load both analytics when component mounts or time period changes
    dispatch(fetchOrderAnalytics());
    dispatch(fetchRevenueAnalytics(timePeriod));
  }, [dispatch, timePeriod]);
  
  // Prepare data for status distribution chart
  const getStatusDistributionData = () => {
    if (!analytics.countByStatus) return [];
    
    return Object.entries(analytics.countByStatus).map(([status, count]) => ({
      name: t(`admin-orders:orders.statuses.${status.toLowerCase()}`),
      value: count,
      status
    }));
  };
  
  const getRevenueData = () => {
    // Check if revenueData exists and has a data property that is an array
    if (!analytics.revenueData || !Array.isArray(analytics.revenueData) || analytics.revenueData.length === 0) {
      // Generate placeholder data if no real data exists
      const placeholderData = [];
      const labels =
        timePeriod === 'day'
          ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          : timePeriod === 'week'
          ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
          : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
      for (let i = 0; i < labels.length; i++) {
        placeholderData.push({
          name: labels[i],
          revenue: 0,
          orders: 0,
        });
      }
  
      return placeholderData;
    }
  
    // Aggregate data based on timePeriod
    if (timePeriod === 'week' || timePeriod === 'month') {
      interface AggregatedData {
        [key: string]: { revenue: number; orders: number };
      }
      
      const aggregatedData: AggregatedData = {};
      
      analytics.revenueData.forEach((item) => {
        const date = new Date(item.label);
        let key;
  
        if (timePeriod === 'week') {
          // Group by week (assuming week starts on Monday)
          const weekNumber = Math.floor((date.getDate() - 1) / 7) + 1;
          key = `Week ${weekNumber}`;
        } else {
          // Group by month
          key = date.toLocaleString('default', { month: 'short' });
        }
  
        if (!aggregatedData[key]) {
          aggregatedData[key] = { revenue: 0, orders: 0 };
        }
        aggregatedData[key].revenue += item.value || 0;
        aggregatedData[key].orders += item.count || 0;
      });
  
      return Object.keys(aggregatedData).map((name) => ({
        name,
        revenue: aggregatedData[name].revenue,
        orders: aggregatedData[name].orders,
      }));
    }
  
    // Format daily data from the API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return analytics.revenueData.map((item: { label: any; value: any; count: any; }) => ({
      name: item.label,
      revenue: item.value || 0,
      orders: item.count || 0,
    }));
  };
  
  // Custom tooltip formatter for revenue chart
  const revenueTooltipFormatter = (value: number, name: string) => {
    if (name === 'revenue') {
      return [formatCurrency(value), t('admin-orders:orders.analytics.revenue')];
    }
    return [value, t('admin-orders:orders.analytics.orders_count')];
  };
  
  // Check if we have any meaningful data to display
  const hasData = analytics.countByStatus && 
    Object.values(analytics.countByStatus).some(count => count > 0);
  
  if (!hasData && !analytics.loading) {
    return (
      <Card title={t('admin-orders:orders.analytics.title')}>
        <Empty 
          description={t('admin-orders:orders.analytics.no_data')} 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        title={t('admin-orders:orders.analytics.title')}
        extra={
          <Radio.Group
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="day">{t('admin-orders:orders.analytics.daily')}</Radio.Button>
            <Radio.Button value="week">{t('admin-orders:orders.analytics.weekly')}</Radio.Button>
            <Radio.Button value="month">{t('admin-orders:orders.analytics.monthly')}</Radio.Button>
          </Radio.Group>
        }
      >
        <Row gutter={[16, 16]}>
          {/* Revenue Chart */}
          <Col xs={24} lg={16}>
            <Card title={t('admin-orders:orders.analytics.revenue_trend')} bordered={false}>
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
                      <YAxis 
                        yAxisId="left"
                        orientation="left" 
                        stroke="#8884d8"
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right" 
                        stroke="#82ca9d"
                      />
                      <RechartsTooltip formatter={revenueTooltipFormatter} />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8884d8" 
                        name={t('admin-orders:orders.analytics.revenue')}
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#82ca9d" 
                        name={t('admin-orders:orders.analytics.orders')}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </Col>
          
          {/* Status Distribution */}
          <Col xs={24} sm={12} lg={8}>
            <Card title={t('admin-orders:orders.analytics.status_distribution')} bordered={false}>
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
                            fill={OrderStatusColors[entry.status as OrderStatus] || "#000000"}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => [value, t('admin-orders:orders.analytics.orders')]} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </Col>
          
          {/* Orders Count Chart */}
          <Col xs={24}>
            <Card title={t('admin-orders:orders.analytics.orders_count')} bordered={false}>
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
                      <RechartsTooltip formatter={(value) => [`${value}`, t('admin-orders:orders.analytics.orders')]} />
                      <Legend />
                      <Bar 
                        dataKey="orders" 
                        fill="#82ca9d" 
                        name={t('admin-orders:orders.analytics.orders_count')} 
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