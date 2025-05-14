import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Spin, 
  Empty, 
  Statistic, 
  Row, 
  Col, 
  Table, 
  DatePicker, 
  Select, 
  Button
} from 'antd';
import { 
  ScanOutlined, 
  BarChartOutlined, 
  UserOutlined, 
  GlobalOutlined,
  CalendarOutlined,
  ReloadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AdminProductService } from '@/admin/services/adminProductService';
import { QRScanResponse } from '@/admin/types/qrcode.types';
import { motion } from 'framer-motion';
import { Line, Pie } from 'react-chartjs-2';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import * as XLSX from 'xlsx';

dayjs.extend(weekOfYear);

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface QRAnalyticsProps {
  qrCodeId: string;
}

const QRAnalytics: React.FC<QRAnalyticsProps> = ({ qrCodeId }) => {
  const { t } = useTranslation(['admin', 'common']);
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState<QRScanResponse[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);
  const [chartType, setChartType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  useEffect(() => {
    fetchScanData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrCodeId]);
  
  const fetchScanData = async () => {
    try {
      setLoading(true);
      const data = await AdminProductService.getQRCodeScans(qrCodeId);
      setScans(data);
    } catch (error) {
      console.error('Failed to fetch QR code scan data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter scans by date range
  const filteredScans = scans.filter(scan => {
    const scanDate = dayjs(scan.scanDate);
    return scanDate.isAfter(dateRange[0]) && scanDate.isBefore(dateRange[1].add(1, 'day'));
  });
  
  // Get total scans
  const totalScans = filteredScans.length;
  
  // Get scans today
  const scansToday = filteredScans.filter(scan => 
    dayjs(scan.scanDate).isAfter(dayjs().startOf('day'))
  ).length;
  
  // Get scans this week
  const scansThisWeek = filteredScans.filter(scan => 
    dayjs(scan.scanDate).isAfter(dayjs().startOf('week'))
  ).length;
  
  // Prepare data for charts
  const prepareChartData = () => {
    // Group by date
    const scansByDate = filteredScans.reduce((acc, scan) => {
      let dateKey;
      
      if (chartType === 'daily') {
        dateKey = dayjs(scan.scanDate).format('YYYY-MM-DD');
      } else if (chartType === 'weekly') {
        dateKey = `${dayjs(scan.scanDate).year()}-W${dayjs(scan.scanDate).week()}`;
      } else {
        dateKey = dayjs(scan.scanDate).format('YYYY-MM');
      }
      
      if (!acc[dateKey]) {
        acc[dateKey] = 0;
      }
      
      acc[dateKey]++;
      return acc;
    }, {} as Record<string, number>);
    
    // Sort dates
    const sortedDates = Object.keys(scansByDate).sort();
    
    // Prepare labels and data for chart
    const labels = sortedDates.map(date => {
      if (chartType === 'daily') {
        return dayjs(date).format('MMM D');
      } else if (chartType === 'weekly') {
        const [year, week] = date.split('-W');
        return `${year} W${week}`;
      } else {
        return dayjs(date).format('MMM YYYY');
      }
    });
    
    const data = sortedDates.map(date => scansByDate[date]);
    
    return { labels, data };
  };
  
  // Prepare data for device chart
  const prepareDeviceData = () => {
    // Simple device detection - would be more sophisticated in production
    const deviceData = filteredScans.reduce((acc, scan) => {
      let device = 'Unknown';
      
      if (scan.userAgent) {
        if (scan.userAgent.includes('iPhone') || scan.userAgent.includes('iPad')) {
          device = 'iOS';
        } else if (scan.userAgent.includes('Android')) {
          device = 'Android';
        } else if (scan.userAgent.includes('Windows')) {
          device = 'Windows';
        } else if (scan.userAgent.includes('Macintosh')) {
          device = 'Mac';
        }
      }
      
      if (!acc[device]) {
        acc[device] = 0;
      }
      
      acc[device]++;
      return acc;
    }, {} as Record<string, number>);
    
    const labels = Object.keys(deviceData);
    const data = labels.map(device => deviceData[device]);
    
    return { labels, data };
  };
  
  // Prepare location chart data
  const prepareLocationData = () => {
    const locationData = filteredScans.reduce((acc, scan) => {
      const location = scan.geoLocation || 'Unknown';
      
      if (!acc[location]) {
        acc[location] = 0;
      }
      
      acc[location]++;
      return acc;
    }, {} as Record<string, number>);
    
    const labels = Object.keys(locationData);
    const data = labels.map(location => locationData[location]);
    
    return { labels, data };
  };
  
  const { labels: dateLabels, data: dateData } = prepareChartData();
  const { labels: deviceLabels, data: deviceData } = prepareDeviceData();
  const { labels: locationLabels, data: locationData } = prepareLocationData();
  
  // Line chart data
  const lineChartData = {
    labels: dateLabels,
    datasets: [
      {
        label: t('admin:products.scans'),
        data: dateData,
        fill: false,
        backgroundColor: 'rgba(0, 92, 78, 0.2)',
        borderColor: 'rgba(0, 92, 78, 1)',
        tension: 0.4
      }
    ]
  };
  
  // Device pie chart data
  const deviceChartData = {
    labels: deviceLabels,
    datasets: [
      {
        data: deviceData,
        backgroundColor: [
          'rgba(0, 92, 78, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Location pie chart data
  const locationChartData = {
    labels: locationLabels,
    datasets: [
      {
        data: locationData,
        backgroundColor: [
          'rgba(0, 92, 78, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Line chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const, // Use as const to specify the exact string literal type
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };
  
  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  };
  
  // Table columns
  const columns = [
    {
      title: t('admin:products.scan_date'),
      dataIndex: 'scanDate',
      key: 'scanDate',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: t('admin:products.device'),
      dataIndex: 'userAgent',
      key: 'userAgent',
      render: (text: string) => {
        if (!text) return 'Unknown';
        
        if (text.includes('iPhone') || text.includes('iPad')) {
          return 'iOS';
        } else if (text.includes('Android')) {
          return 'Android';
        } else if (text.includes('Windows')) {
          return 'Windows';
        } else if (text.includes('Macintosh')) {
          return 'Mac';
        }
        
        return 'Unknown';
      }
    },
    {
      title: t('admin:products.location'),
      dataIndex: 'geoLocation',
      key: 'geoLocation',
      render: (text: string) => text || 'Unknown'
    },
    {
      title: t('admin:products.ip_address'),
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      render: (text: string) => text || 'Unknown'
    }
  ];
  
  // Export scans to Excel
  const exportToExcel = () => {
    // Map scan data for export
    const data = filteredScans.map(scan => ({
      'Scan Date': dayjs(scan.scanDate).format('YYYY-MM-DD HH:mm:ss'),
      'IP Address': scan.ipAddress || 'Unknown',
      'User Agent': scan.userAgent || 'Unknown',
      'Location': scan.geoLocation || 'Unknown'
    }));
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'QR Code Scans');
    
    // Download file
    XLSX.writeFile(workbook, `qrcode-scans-${qrCodeId}.xlsx`);
  };
  
  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Spin size="large" />
      </div>
    );
  }
  
  if (!scans || scans.length === 0) {
    return (
      <Empty
        description={t('admin:products.no_scan_data')}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        className="py-8"
      >
        <Text type="secondary">
          {t('admin:products.scan_data_description')}
        </Text>
      </Empty>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4"
    >
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <RangePicker
            value={[dateRange[0], dateRange[1]]}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange([dates[0], dates[1]]);
              }
            }}
            className="w-52"
          />
          
          <Select
            value={chartType}
            onChange={setChartType}
            className="w-32"
          >
            <Option value="daily">{t('admin:products.daily')}</Option>
            <Option value="weekly">{t('admin:products.weekly')}</Option>
            <Option value="monthly">{t('admin:products.monthly')}</Option>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchScanData}
          >
            {t('admin:actions.refresh')}
          </Button>
          
          <Button
            icon={<DownloadOutlined />}
            onClick={exportToExcel}
          >
            {t('admin:actions.export')}
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('admin:products.total_scans')}
              value={totalScans}
              prefix={<ScanOutlined />}
              valueStyle={{ color: '#005c4e' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('admin:products.scans_today')}
              value={scansToday}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t('admin:products.scans_this_week')}
              value={scansThisWeek}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Charts */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={24}>
          <Card title={<div className="flex items-center"><BarChartOutlined className="mr-2" /> {t('admin:products.scan_trend')}</div>}>
            <div style={{ height: '300px' }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title={<div className="flex items-center"><UserOutlined className="mr-2" /> {t('admin:products.scans_by_device')}</div>}>
            <div style={{ height: '250px' }}>
              <Pie data={deviceChartData} options={pieChartOptions} />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title={<div className="flex items-center"><GlobalOutlined className="mr-2" /> {t('admin:products.scans_by_location')}</div>}>
            <div style={{ height: '250px' }}>
              <Pie data={locationChartData} options={pieChartOptions} />
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Scan data table */}
      <Card 
        title={<div className="flex items-center"><ScanOutlined className="mr-2" /> {t('admin:products.scan_details')}</div>}
        className="mb-6"
      >
        <Table
          dataSource={filteredScans}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </motion.div>
  );
};

export default QRAnalytics;