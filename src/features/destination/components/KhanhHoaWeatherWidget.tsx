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

const KhanhHoaWeatherWidget: React.FC<WeatherProps> = ({ data }) => {
  const { t } = useTranslation(['destinationkhanhhoa', 'common']);
  
  if (!data) {
    return (
      <Card className="khanhhoa-weather-widget">
        <div className="flex justify-center items-center h-32">
          <motion.div
            className="relative"
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center relative overflow-hidden">
              <CloudOutlined className="text-white text-3xl z-10" />
              
              {/* Wave effect inside loading circle */}
              <motion.div
                className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-white/30 to-transparent"
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  clipPath: 'polygon(0 60%, 100% 40%, 100% 100%, 0 100%)'
                }}
              />
            </div>
            
            {/* Floating water droplets around loading */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                animate={{
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 40],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 40],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.5, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
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
  
  // Enhanced weather icons with coastal theme
  const getWeatherIcon = (condition: string) => {
    const iconStyle = "text-5xl drop-shadow-xl";
    switch (condition.toLowerCase()) {
      case 'sunny':
        return (
          <motion.span 
            className={`${iconStyle} text-yellow-500`}
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.15, 1]
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
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
              y: [0, -8, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            ☁️
          </motion.span>
        );
      case 'rain':
        return (
          <motion.span 
            className={`${iconStyle} text-blue-500`}
            animate={{ 
              y: [0, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            🌧️
          </motion.span>
        );
      case 'storm':
        return (
          <motion.span 
            className={`${iconStyle} text-purple-600`}
            animate={{ 
              x: [-3, 3, -3],
              scale: [1, 1.2, 1],
              filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            ⛈️
          </motion.span>
        );
      default:
        return <span className={`${iconStyle} text-orange-500`}>🌤️</span>;
    }
  };
  
  // Get condition text in Vietnamese/English with coastal descriptions
  const getConditionText = (condition: string) => {
    const conditionMap: Record<string, { en: string; vi: string }> = {
      'sunny': { en: 'Perfect Beach Weather', vi: 'Thời tiết biển hoàn hảo' },
      'cloudy': { en: 'Partly Cloudy Coast', vi: 'Bờ biển có mây' },
      'rain': { en: 'Tropical Shower', vi: 'Mưa nhiệt đới' },
      'storm': { en: 'Coastal Storm', vi: 'Bão biển' }
    };
    
    const lang = t('common:language') === 'vi' ? 'vi' : 'en';
    return conditionMap[condition.toLowerCase()]?.[lang] || condition;
  };

  // Get temperature color based on coastal climate
  const getTempColor = (temp: number) => {
    if (temp >= 32) return 'text-red-500';
    if (temp >= 28) return 'text-orange-500';
    if (temp >= 25) return 'text-yellow-500';
    if (temp >= 22) return 'text-green-500';
    return 'text-blue-500';
  };

  // Get humidity color for coastal climate
  const getHumidityColor = (humidity: number) => {
    if (humidity >= 85) return 'text-blue-600';
    if (humidity >= 70) return 'text-cyan-500';
    if (humidity >= 60) return 'text-teal-500';
    return 'text-green-500';
  };

  // Get wind color for coastal winds
  const getWindColor = (wind: number) => {
    if (wind >= 25) return 'text-red-500';
    if (wind >= 20) return 'text-orange-500';
    if (wind >= 15) return 'text-yellow-500';
    if (wind >= 10) return 'text-green-500';
    return 'text-blue-500';
  };
  
  return (
    <Card className="khanhhoa-weather-widget border-blue-200 dark:border-blue-700 shadow-2xl overflow-hidden">
      <div className="relative">
        {/* Animated ocean background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500"></div>
        </div>
        
        {/* Floating ocean elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-50"
              animate={{
                x: [Math.random() * 400, Math.random() * 400],
                y: [Math.random() * 300, Math.random() * 300],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{
                duration: Math.random() * 12 + 8,
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
        
        {/* Wave pattern at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-16 overflow-hidden">
          <motion.div
            className="absolute bottom-0 w-[200%] h-16 bg-gradient-to-r from-blue-200/20 to-cyan-200/20"
            animate={{
              x: ['-50%', '0%']
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              clipPath: 'polygon(0 50%, 100% 70%, 100% 100%, 0 100%)'
            }}
          />
          <motion.div
            className="absolute bottom-0 w-[200%] h-12 bg-gradient-to-r from-cyan-200/15 to-teal-200/15"
            animate={{
              x: ['0%', '50%']
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              clipPath: 'polygon(0 60%, 100% 40%, 100% 100%, 0 100%)'
            }}
          />
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
                
                {/* Radial glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-radial from-blue-400/20 via-cyan-400/10 to-transparent rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>
              
              <div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex items-baseline"
                >
                  <Text className={`text-6xl font-bold dark:text-white ${getTempColor(data.temperature)} drop-shadow-lg`}>
                    {data.temperature}
                  </Text>
                  <span className="text-3xl text-gray-500 ml-1">°C</span>
                  
                  {/* Temperature indicator with ocean theme */}
                  <motion.div
                    className="ml-3"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    {data.temperature >= 30 ? (
                      <FireOutlined className="text-red-500 text-2xl" />
                    ) : data.temperature >= 25 ? (
                      <span className="text-2xl">🌊</span>
                    ) : (
                      <span className="text-2xl">🏖️</span>
                    )}
                  </motion.div>
                </motion.div>
                
                <Text className="block text-gray-600 dark:text-gray-300 font-semibold text-xl mt-1">
                  {getConditionText(data.condition)}
                </Text>
                
                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <EnvironmentOutlined className="mr-2 text-blue-500" />
                  <span>Khánh Hòa Province, Vietnam</span>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="ml-2"
                  >
                    🏝️
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Enhanced weather details with ocean theme */}
            <div className="grid grid-cols-2 gap-4">
              <Tooltip title={t('destination:weather.humidity')}>
                <motion.div 
                  className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-lg relative overflow-hidden"
                  whileHover={{ scale: 1.08, y: -3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -3, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <EyeOutlined className="text-blue-500 text-3xl mb-2" />
                  </motion.div>
                  <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                    {t('destination:weather.humidity')}
                  </Text>
                  <Text className={`block font-bold text-xl dark:text-white ${getHumidityColor(data.humidity)}`}>
                    {data.humidity}%
                  </Text>
                  
                  {/* Humidity level indicator */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${data.humidity}%` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </div>
                  
                  {/* Floating water drops */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full"
                      animate={{
                        y: [-10, 50],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                      style={{
                        left: 20 + i * 25 + '%',
                        top: 10
                      }}
                    />
                  ))}
                </motion.div>
              </Tooltip>
              
              <Tooltip title={t('destination:weather.wind')}>
                <motion.div 
                  className="text-center p-4 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-xl border-2 border-cyan-200 dark:border-cyan-700 shadow-lg relative overflow-hidden"
                  whileHover={{ scale: 1.08, y: -3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <ThunderboltOutlined className="text-cyan-500 text-3xl mb-2" />
                  </motion.div>
                  <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                    {t('destination:weather.wind')}
                  </Text>
                  <Text className={`block font-bold text-xl dark:text-white ${getWindColor(data.wind)}`}>
                    {data.wind} km/h
                  </Text>
                  
                  {/* Wind direction indicator */}
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-r-2 border-cyan-500 mx-auto mt-2"
                  />
                  
                  {/* Wind lines effect */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-8 h-0.5 bg-cyan-300/50"
                      animate={{
                        x: [-20, 80],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                      style={{
                        top: 30 + i * 8,
                        left: 10
                      }}
                    />
                  ))}
                </motion.div>
              </Tooltip>
            </div>
          </div>
          
          {/* Enhanced forecast with ocean theme */}
          <div className="border-t-2 border-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-700 dark:to-cyan-700 pt-6">
            <Text className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4 flex items-center">
              <DropboxOutlined className="mr-2 text-blue-500" />
              5-Day Coastal Forecast
            </Text>
            <div className="flex justify-between overflow-x-auto pb-2 space-x-3">
              {data.forecast.map((day, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="text-center flex-shrink-0 px-4 py-3 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all min-w-[80px] cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-700 relative overflow-hidden"
                  whileHover={{ scale: 1.08, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                    {day.day}
                  </Text>
                  <div className="my-3 flex justify-center relative">
                    <motion.div
                      whileHover={{ scale: 1.3, rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {getWeatherIcon(day.condition)}
                    </motion.div>
                  </div>
                  <Text className={`block text-sm font-bold ${getTempColor(day.temp)}`}>
                    {day.temp}°
                  </Text>
                  
                  {/* Day temperature bar with ocean gradient */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.temp / 35) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    />
                  </div>
                  
                  {/* Hover wave effect */}
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300/20 to-cyan-300/20"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.2
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Travel tip for Khánh Hòa coastal weather */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-teal-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700 relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="flex items-center relative z-10"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mr-3"
              >
                <span className="text-3xl">🏖️</span>
              </motion.div>
              <Text className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                <strong>Coastal Weather Tip:</strong> Perfect beach conditions year-round! Best time for island hopping is 8-11 AM or 3-6 PM. Don't forget sunscreen and stay hydrated!
              </Text>
            </motion.div>
            
            {/* Background wave animation */}
            <motion.div
              className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-blue-200/30 to-cyan-200/30"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                clipPath: 'polygon(0 40%, 100% 60%, 100% 100%, 0 100%)'
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KhanhHoaWeatherWidget;