import React from 'react';
import { Typography, Tooltip, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  CloudOutlined, 
  EnvironmentOutlined,
  EyeOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface WeatherProps {
  data: {
    temperature: number;
    condition: string;
    humidity: number;
    wind: number;
    forecast: {
      day: string;
      temp: number;
      condition: string;
    }[];
  } | null;
}

const HanoiWeatherWidget: React.FC<WeatherProps> = ({ data }) => {
  const { t } = useTranslation(['destinationhanoi', 'common']);
  
  if (!data) {
    return (
      <Card className="hanoi-weather-widget">
        <div className="flex justify-center items-center h-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <CloudOutlined className="text-2xl text-yellow-500" />
          </motion.div>
          <Text className="ml-3 text-gray-500 dark:text-gray-400">
            {t('destination:weather.loading')}
          </Text>
        </div>
      </Card>
    );
  }
  
  // Get weather icon based on condition with enhanced variety
  const getWeatherIcon = (condition: string) => {
    const iconStyle = "text-2xl";
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <span className={`${iconStyle} text-yellow-500`}>☀️</span>;
      case 'cloudy':
        return <span className={`${iconStyle} text-gray-500`}>☁️</span>;
      case 'rain':
        return <span className={`${iconStyle} text-blue-500`}>🌧️</span>;
      case 'storm':
        return <span className={`${iconStyle} text-purple-500`}>⛈️</span>;
      case 'snow':
        return <span className={`${iconStyle} text-blue-200`}>❄️</span>;
      case 'fog':
        return <span className={`${iconStyle} text-gray-400`}>🌫️</span>;
      default:
        return <span className={`${iconStyle} text-orange-400`}>🌤️</span>;
    }
  };
  
  // Get condition description in Vietnamese/English
  const getConditionText = (condition: string) => {
    const conditionMap: Record<string, { en: string; vi: string }> = {
      'sunny': { en: 'Sunny', vi: 'Nắng' },
      'cloudy': { en: 'Cloudy', vi: 'Nhiều mây' },
      'rain': { en: 'Rainy', vi: 'Mưa' },
      'storm': { en: 'Stormy', vi: 'Bão' },
      'snow': { en: 'Snowy', vi: 'Tuyết' },
      'fog': { en: 'Foggy', vi: 'Sương mù' }
    };
    
    const lang = t('common:language') === 'vi' ? 'vi' : 'en';
    return conditionMap[condition.toLowerCase()]?.[lang] || condition;
  };

  // Get temperature color based on value
  const getTempColor = (temp: number) => {
    if (temp >= 35) return 'text-red-500';
    if (temp >= 30) return 'text-orange-500';
    if (temp >= 25) return 'text-yellow-500';
    if (temp >= 20) return 'text-green-500';
    if (temp >= 15) return 'text-blue-500';
    return 'text-cyan-500';
  };
  
  return (
    <Card className="hanoi-weather-widget border-yellow-200 dark:border-yellow-700">
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500"></div>
        </div>
        
        {/* Main weather info */}
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <motion.div 
                className="text-5xl mr-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {getWeatherIcon(data.condition)}
              </motion.div>
              <div>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Text className={`text-3xl font-bold dark:text-white ${getTempColor(data.temperature)}`}>
                    {data.temperature}°C
                  </Text>
                </motion.div>
                <Text className="block text-gray-600 dark:text-gray-300 font-medium">
                  {getConditionText(data.condition)}
                </Text>
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <EnvironmentOutlined className="mr-1" />
                  <span>Hanoi, Vietnam</span>
                </div>
              </div>
            </div>
            
            {/* Weather details */}
            <div className="grid grid-cols-2 gap-4">
              <Tooltip title={t('destination:weather.humidity')}>
                <motion.div 
                  className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <EyeOutlined className="text-blue-500 text-lg mb-1" />
                  <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('destination:weather.humidity')}
                  </Text>
                  <Text className="block font-semibold dark:text-white">
                    {data.humidity}%
                  </Text>
                </motion.div>
              </Tooltip>
              
              <Tooltip title={t('destination:weather.wind')}>
                <motion.div 
                  className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ThunderboltOutlined className="text-green-500 text-lg mb-1" />
                  <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('destination:weather.wind')}
                  </Text>
                  <Text className="block font-semibold dark:text-white">
                    {data.wind} km/h
                  </Text>
                </motion.div>
              </Tooltip>
            </div>
          </div>
          
          {/* Forecast */}
          <div className="border-t border-yellow-200 dark:border-yellow-700 pt-4">
            <Text className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
              5-Day Forecast
            </Text>
            <div className="flex justify-between overflow-x-auto pb-2">
              {data.forecast.map((day, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="text-center flex-shrink-0 px-3 py-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors min-w-[60px]"
                  whileHover={{ scale: 1.05 }}
                >
                  <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {day.day}
                  </Text>
                  <div className="my-2 flex justify-center">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <Text className={`block text-sm font-medium ${getTempColor(day.temp)}`}>
                    {day.temp}°
                  </Text>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Best time to visit hint */}
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <Text className="text-xs text-yellow-700 dark:text-yellow-300 flex items-center">
              <span className="mr-2">💡</span>
              Best time to visit Hanoi: September-November & March-April
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HanoiWeatherWidget;