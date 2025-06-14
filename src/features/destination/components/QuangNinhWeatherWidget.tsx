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

const QuangNinhWeatherWidget: React.FC<WeatherProps> = ({ data }) => {
  const { t } = useTranslation(['destinationquangninh', 'common']);
  
  if (!data) {
    return (
      <Card className="quangninh-weather-widget">
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
            <div className="w-20 h-20 bg-gradient-to-r from-slate-600 to-stone-600 rounded-full flex items-center justify-center relative overflow-hidden">
              <CloudOutlined className="text-white text-3xl z-10" />
              
              {/* Cave depth effect inside loading circle */}
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
            
            {/* Floating limestone particles around loading */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-slate-500 rounded-full"
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
  
  // Enhanced weather icons with limestone cave theme
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
  
  // Get condition text with limestone cave descriptions
  const getConditionText = (condition: string) => {
    const conditionMap: Record<string, { en: string; vi: string }> = {
      'sunny': { en: 'Perfect Cave Exploration Weather', vi: 'Thời tiết hoàn hảo khám phá hang động' },
      'cloudy': { en: 'Ideal for Karst Viewing', vi: 'Lý tưởng để ngắm núi đá vôi' },
      'rain': { en: 'Mystical Cave Atmosphere', vi: 'Không khí hang động huyền bí' },
      'storm': { en: 'Dramatic Limestone Landscape', vi: 'Cảnh quan đá vôi hùng vĩ' }
    };
    
    const lang = t('common:language') === 'vi' ? 'vi' : 'en';
    return conditionMap[condition.toLowerCase()]?.[lang] || condition;
  };

  // Get temperature color based on cave climate
  const getTempColor = (temp: number) => {
    if (temp >= 32) return 'text-red-500';
    if (temp >= 28) return 'text-orange-500';
    if (temp >= 25) return 'text-yellow-500';
    if (temp >= 22) return 'text-green-500';
    return 'text-slate-600';
  };

  // Get humidity color for cave moisture
  const getHumidityColor = (humidity: number) => {
    if (humidity >= 85) return 'text-slate-700';
    if (humidity >= 70) return 'text-stone-600';
    if (humidity >= 60) return 'text-slate-500';
    return 'text-stone-500';
  };

  // Get wind color for limestone cliffs
  const getWindColor = (wind: number) => {
    if (wind >= 25) return 'text-red-500';
    if (wind >= 20) return 'text-orange-500';
    if (wind >= 15) return 'text-yellow-500';
    if (wind >= 10) return 'text-green-500';
    return 'text-slate-600';
  };
  
  return (
    <Card className="quangninh-weather-widget border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden">
      <div className="relative">
        {/* Animated limestone background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-slate-600 via-stone-600 to-slate-700"></div>
        </div>
        
        {/* Floating cave elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-slate-400 rounded-full opacity-50"
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
        
        {/* Stalactite pattern at top */}
        <div className="absolute top-0 left-0 w-full h-16 overflow-hidden">
          <motion.div
            className="absolute top-0 w-[200%] h-16 bg-gradient-to-r from-slate-300/20 to-stone-300/20"
            animate={{
              x: ['-50%', '0%']
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              clipPath: 'polygon(0 0%, 100% 0%, 90% 100%, 10% 100%)'
            }}
          />
          <motion.div
            className="absolute top-0 w-[200%] h-12 bg-gradient-to-r from-stone-300/15 to-slate-300/15"
            animate={{
              x: ['0%', '50%']
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              clipPath: 'polygon(0 0%, 100% 0%, 95% 100%, 5% 100%)'
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
                
                {/* Radial cave glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-radial from-slate-400/20 via-stone-400/10 to-transparent rounded-full blur-2xl"
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
                  
                  {/* Temperature indicator with cave theme */}
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
                      <span className="text-2xl">🗿</span>
                    ) : (
                      <span className="text-2xl">🏔️</span>
                    )}
                  </motion.div>
                </motion.div>
                
                <Text className="block text-gray-600 dark:text-gray-300 font-semibold text-xl mt-1">
                  {getConditionText(data.condition)}
                </Text>
                
                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <EnvironmentOutlined className="mr-2 text-slate-600" />
                  <span>Quảng Ninh Province, Vietnam</span>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="ml-2"
                  >
                    🏞️
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Enhanced weather details with limestone theme */}
            <div className="grid grid-cols-2 gap-4">
              <Tooltip title={t('destination:weather.humidity')}>
                <motion.div 
                  className="text-center p-4 bg-gradient-to-br from-slate-50 to-stone-50 dark:from-slate-800/30 dark:to-stone-800/30 rounded-xl border-2 border-slate-300 dark:border-slate-700 shadow-lg relative overflow-hidden"
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
                    <EyeOutlined className="text-slate-600 text-3xl mb-2" />
                  </motion.div>
                  <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                    {t('destination:weather.humidity')}
                  </Text>
                  <Text className={`block font-bold text-xl dark:text-white ${getHumidityColor(data.humidity)}`}>
                    {data.humidity}%
                  </Text>
                  
                  {/* Cave moisture level indicator */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <motion.div 
                      className="bg-gradient-to-r from-slate-500 to-stone-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${data.humidity}%` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </div>
                  
                  {/* Floating cave mist */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-slate-500 rounded-full"
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
                  className="text-center p-4 bg-gradient-to-br from-stone-50 to-slate-50 dark:from-stone-800/30 dark:to-slate-800/30 rounded-xl border-2 border-stone-300 dark:border-stone-700 shadow-lg relative overflow-hidden"
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
                    <ThunderboltOutlined className="text-stone-600 text-3xl mb-2" />
                  </motion.div>
                  <Text className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                    {t('destination:weather.wind')}
                  </Text>
                  <Text className={`block font-bold text-xl dark:text-white ${getWindColor(data.wind)}`}>
                    {data.wind} km/h
                  </Text>
                  
                  {/* Cave wind direction indicator */}
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-r-2 border-stone-600 mx-auto mt-2"
                  />
                  
                  {/* Cave wind flow lines */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-8 h-0.5 bg-stone-400/50"
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
          
          {/* Enhanced forecast with limestone cave theme */}
          <div className="border-t-2 border-gradient-to-r from-slate-300 to-stone-300 dark:from-slate-700 dark:to-stone-700 pt-6">
            <Text className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-4 flex items-center">
              <DropboxOutlined className="mr-2 text-slate-600" />
              5-Day Limestone Weather Forecast
            </Text>
            <div className="flex justify-between overflow-x-auto pb-2 space-x-3">
              {data.forecast.map((day, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="text-center flex-shrink-0 px-4 py-3 rounded-xl hover:bg-gradient-to-br hover:from-slate-50 hover:to-stone-50 dark:hover:from-slate-800/20 dark:hover:to-stone-800/20 transition-all min-w-[80px] cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-slate-700 relative overflow-hidden"
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
                  
                  {/* Day temperature bar with cave gradient */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                    <motion.div 
                      className="bg-gradient-to-r from-slate-500 via-stone-600 to-slate-700 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.temp / 35) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    />
                  </div>
                  
                  {/* Hover cave echo effect */}
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-slate-400/20 to-stone-400/20"
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
          
          {/* Travel tip for Quảng Ninh limestone weather */}
          <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 via-stone-50 to-slate-50 dark:from-slate-800/20 dark:via-stone-800/20 dark:to-slate-800/20 rounded-xl border-2 border-slate-300 dark:border-slate-700 relative overflow-hidden">
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
                <span className="text-3xl">🏔️</span>
              </motion.div>
              <Text className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                <strong>Limestone Cave Weather Tip:</strong> Perfect conditions for exploring Hạ Long Bay's magnificent karsts! Early morning offers the best visibility for cave exploration and stunning photography. Bring layers for temperature changes in deep caves.
              </Text>
            </motion.div>
            
            {/* Background cave animation */}
            <motion.div
              className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-slate-300/30 to-stone-300/30"
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

export default QuangNinhWeatherWidget;