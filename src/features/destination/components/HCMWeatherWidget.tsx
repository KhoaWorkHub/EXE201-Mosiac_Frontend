import React from 'react';
import { Typography, Tooltip, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  CloudOutlined, 
  EnvironmentOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  FireOutlined,
  DropboxOutlined
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

const HCMWeatherWidget: React.FC<WeatherProps> = ({ data }) => {
  const { t } = useTranslation(['destinationhcm', 'common']);
  
  if (!data) {
    return (
      <Card className="hcm-weather-widget">
        <div className="flex justify-center items-center h-32">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <CloudOutlined className="text-white text-2xl" />
            </div>
            
            {/* Floating particles around loading */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-orange-400 rounded-full"
                animate={{
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 30],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 30],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
          <Text className="ml-4 text-gray-500 dark:text-gray-400 text-lg">
            {t('destination:weather.loading')}
          </Text>
        </div>
      </Card>
    );
  }
  
  // Enhanced weather icons with tropical theme
  const getWeatherIcon = (condition: string) => {
    const iconStyle = "text-4xl drop-shadow-lg";
    switch (condition.toLowerCase()) {
      case 'sunny':
        return (
          <motion.span 
            className={`${iconStyle} text-orange-500`}
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            ☀️
          </motion.span>
        );
      case 'cloudy':
        return (
          <motion.span 
            className={`${iconStyle} text-gray-500`}
            animate={{ 
              y: [0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            ☁️
          </motion.span>
        );
      case 'rain':
        return (
          <motion.span 
            className={`${iconStyle} text-blue-500`}
            animate={{ 
              y: [0, 3, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🌧️
          </motion.span>
        );
      case 'storm':
        return (
          <motion.span 
            className={`${iconStyle} text-purple-600`}
            animate={{ 
              x: [-2, 2, -2],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ⛈️
          </motion.span>
        );
      default:
        return <span className={`${iconStyle} text-yellow-500`}>🌤️</span>;
    }
  };
  
  // Get condition text in Vietnamese/English
  const getConditionText = (condition: string) => {
    const conditionMap: Record<string, { en: string; vi: string }> = {
      'sunny': { en: 'Sunny & Hot', vi: 'Nắng nóng' },
      'cloudy': { en: 'Partly Cloudy', vi: 'Có mây' },
      'rain': { en: 'Tropical Rain', vi: 'Mưa nhiệt đới' },
      'storm': { en: 'Thunderstorm', vi: 'Giông bão' }
    };
    
    const lang = t('common:language') === 'vi' ? 'vi' : 'en';
    return conditionMap[condition.toLowerCase()]?.[lang] || condition;
  };

  // Get temperature color based on value (tropical climate)
  const getTempColor = (temp: number) => {
    if (temp >= 35) return 'text-red-600';
    if (temp >= 32) return 'text-orange-500';
    if (temp >= 28) return 'text-yellow-500';
    if (temp >= 25) return 'text-green-500';
    return 'text-blue-500';
  };

  // Get humidity color
  const getHumidityColor = (humidity: number) => {
    if (humidity >= 80) return 'text-blue-600';
    if (humidity >= 60) return 'text-cyan-500';
    return 'text-green-500';
  };
  
  return (
    <Card className="hcm-weather-widget border-orange-200 dark:border-orange-700 shadow-xl overflow-hidden">
      <div className="relative">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500"></div>
        </div>
        
        {/* Floating weather elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-300 rounded-full opacity-40"
              animate={{
                x: [Math.random() * 300, Math.random() * 300],
                y: [Math.random() * 200, Math.random() * 200],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: Math.random() * 8 + 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
        
        {/* Main weather content */}
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <motion.div 
                className="text-6xl mr-6 relative"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {getWeatherIcon(data.condition)}
                
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              
              <div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex items-baseline"
                >
                  <Text className={`text-5xl font-bold dark:text-white ${getTempColor(data.temperature)} drop-shadow-lg`}>
                    {data.temperature}
                  </Text>
                  <span className="text-2xl text-gray-500 ml-1">°C</span>
                  
                  {/* Temperature indicator */}
                  <motion.div
                    className="ml-3"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FireOutlined className="text-orange-500 text-xl" />
                  </motion.div>
                </motion.div>
                
                <Text className="block text-gray-600 dark:text-gray-300 font-semibold text-lg mt-1">
                  {getConditionText(data.condition)}
                </Text>
                
                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <EnvironmentOutlined className="mr-2 text-orange-500" />
                  <span>Ho Chi Minh City, Vietnam</span>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-2"
                  >
                    🏙️
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Enhanced weather details */}
            <div className="grid grid-cols-2 gap-4">
              <Tooltip title={t('destination:weather.humidity')}>
                <motion.div 
                  className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-lg"
                  whileHover={{ scale: 1.08, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -2, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <EyeOutlined className="text-blue-500 text-2xl mb-2" />
                  </motion.div>
                  <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                    {t('destination:weather.humidity')}
                  </Text>
                  <Text className={`block font-bold text-lg dark:text-white ${getHumidityColor(data.humidity)}`}>
                    {data.humidity}%
                  </Text>
                  
                  {/* Humidity level indicator */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-400 to-cyan-500 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${data.humidity}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              </Tooltip>
              
              <Tooltip title={t('destination:weather.wind')}>
                <motion.div 
                  className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border-2 border-green-200 dark:border-green-700 shadow-lg"
                  whileHover={{ scale: 1.08, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <ThunderboltOutlined className="text-green-500 text-2xl mb-2" />
                  </motion.div>
                  <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                    {t('destination:weather.wind')}
                  </Text>
                  <Text className="block font-bold text-lg dark:text-white text-green-600">
                    {data.wind} km/h
                  </Text>
                  
                  {/* Wind direction indicator */}
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 border-r-2 border-green-500 mx-auto mt-2"
                  />
                </motion.div>
              </Tooltip>
            </div>
          </div>
          
          {/* Enhanced forecast */}
          <div className="border-t-2 border-gradient-to-r from-orange-200 to-red-200 dark:from-orange-700 dark:to-red-700 pt-6">
            <Text className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-4 items-center">
              <DropboxOutlined className="mr-2 text-orange-500" />
              5-Day Tropical Forecast
            </Text>
            <div className="flex justify-between overflow-x-auto pb-2 space-x-2">
              {data.forecast.map((day, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="text-center flex-shrink-0 px-4 py-3 rounded-xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-900/20 dark:hover:to-red-900/20 transition-all min-w-[70px] cursor-pointer border border-transparent hover:border-orange-200"
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                    {day.day}
                  </Text>
                  <div className="my-3 flex justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {getWeatherIcon(day.condition)}
                    </motion.div>
                  </div>
                  <Text className={`block text-sm font-bold ${getTempColor(day.temp)}`}>
                    {day.temp}°
                  </Text>
                  
                  {/* Day temperature bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
                    <motion.div 
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-1 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.temp / 40) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Travel tip for HCM tropical weather */}
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 rounded-xl border-2 border-orange-200 dark:border-orange-700">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex items-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mr-3"
              >
                <span className="text-2xl">💡</span>
              </motion.div>
              <Text className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                <strong>Tropical Weather Tip:</strong> Best time to explore HCM is early morning (6-9 AM) or evening (5-8 PM) to avoid the intense midday heat and afternoon rains!
              </Text>
            </motion.div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HCMWeatherWidget;