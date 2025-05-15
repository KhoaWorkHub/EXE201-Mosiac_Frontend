import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, Spin, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface DestinationMapProps {
  city: string;
  inView: boolean;
}

const DestinationMap: React.FC<DestinationMapProps> = ({ city, inView }) => {
  const { t } = useTranslation(['destination']);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // In a real-world scenario, we would use a proper map library like Google Maps, Mapbox, or Leaflet
  // For this demo, we'll simulate a map with a static image

  useEffect(() => {
    if (inView && !mapLoaded) {
      // Simulate loading a map
      const timer = setTimeout(() => {
        setMapLoaded(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [inView, mapLoaded]);

  // Coordinates for Da Nang, Vietnam
  const coordinates = {
    lat: 16.0544,
    lng: 108.2022
  };
  
  // Points of interest in Da Nang
  const attractions = [
    { name: "Golden Bridge", lat: 16.0296, lng: 108.0035 },
    { name: "Marble Mountains", lat: 16.0016, lng: 108.2658 },
    { name: "My Khe Beach", lat: 16.0595, lng: 108.2470 },
    { name: "Dragon Bridge", lat: 16.0617, lng: 108.2280 },
    { name: "Son Tra Peninsula", lat: 16.1028, lng: 108.2747 },
    { name: "Hai Van Pass", lat: 16.1856, lng: 108.1470 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden">
        <Title level={3} className="mb-4 dark:text-white">
          {t('destination:map.title')}
        </Title>
        
        <div 
          ref={mapRef} 
          className="relative w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
        >
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {/* Map image (simulated) */}
              <div className="w-full h-full relative">
                <img 
                  src={`/assets/destinations/${city}/map.jpg`} 
                  alt={`Map of ${city}`} 
                  className="w-full h-full object-cover"
                />
                
                {/* City marker */}
                <div 
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    left: `calc(50% + ${(coordinates.lng - 108.2022) * 100}px)`, 
                    top: `calc(50% - ${(coordinates.lat - 16.0544) * 100}px)` 
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="w-10 h-10 bg-primary bg-opacity-30 rounded-full flex items-center justify-center"
                  >
                    <div className="w-5 h-5 bg-primary rounded-full pulse-animation"></div>
                  </motion.div>
                </div>
                
                {/* Attraction markers */}
                {attractions.map((attraction, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className="absolute"
                    style={{ 
                      left: `calc(50% + ${(attraction.lng - 108.2022) * 100}px)`, 
                      top: `calc(50% - ${(attraction.lat - 16.0544) * 100}px)` 
                    }}
                  >
                    <Tooltip title={attraction.name}>
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
                        <EnvironmentOutlined className="text-white text-xs" />
                      </div>
                    </Tooltip>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="mt-4 dark:text-gray-300">
          <Text>
            {t('destination:map.description')}
          </Text>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            {attractions.map((attraction, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                <Text className="dark:text-gray-300">{attraction.name}</Text>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DestinationMap;
