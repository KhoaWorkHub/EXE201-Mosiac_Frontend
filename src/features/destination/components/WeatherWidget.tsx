import React from 'react';
import { Typography, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

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

const WeatherWidget: React.FC<WeatherProps> = ({ data }) => {
  const { t } = useTranslation(['destinationdanang', 'common']);
  
  if (!data) {
    return (
      <div className="flex justify-center items-center h-24 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <Text className="text-gray-500 dark:text-gray-400">
          {t('destination:weather.loading')}
        </Text>
      </div>
    );
  }
  
  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return '☀️';
      case 'cloudy':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'storm':
        return '⛈️';
      case 'snow':
        return '❄️';
      default:
        return '🌤️';
    }
  };
  
  return (
    <div className="weather-widget">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <div className="text-4xl mr-3">
            {getWeatherIcon(data.condition)}
          </div>
          <div>
            <Text className="text-2xl font-bold dark:text-white">
              {data.temperature}°C
            </Text>
            <Text className="block text-gray-500 dark:text-gray-400">
              {data.condition}
            </Text>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Tooltip title={t('destination:weather.humidity')}>
            <div className="text-center">
              <Text className="block text-gray-500 dark:text-gray-400 text-xs">
                {t('destination:weather.humidity')}
              </Text>
              <Text className="block dark:text-white">
                {data.humidity}%
              </Text>
            </div>
          </Tooltip>
          
          <Tooltip title={t('destination:weather.wind')}>
            <div className="text-center">
              <Text className="block text-gray-500 dark:text-gray-400 text-xs">
                {t('destination:weather.wind')}
              </Text>
              <Text className="block dark:text-white">
                {data.wind} km/h
              </Text>
            </div>
          </Tooltip>
        </div>
      </div>
      
      <div className="flex justify-between overflow-x-auto py-2">
        {data.forecast.map((day, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="text-center flex-shrink-0 px-2"
          >
            <Text className="block text-xs text-gray-500 dark:text-gray-400">
              {day.day}
            </Text>
            <div className="my-1">
              {getWeatherIcon(day.condition)}
            </div>
            <Text className="block dark:text-white text-sm">
              {day.temp}°
            </Text>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
