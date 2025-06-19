/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Card, Radio, Checkbox, Button } from 'antd';
import { EnvironmentOutlined, ClearOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Enhanced regions data
export const regions = [
  { 
    id: 'fb6aade5-1e65-49b0-8f3a-3ea10f8022d3', 
    name: 'Hồ Chí Minh', 
    nameEn: 'Ho Chi Minh City',
    slug: 'ho-chi-minh',
    description: 'Đô thị sôi động',
    color: '#ff9800',
    icon: '🌆',
    gradient: 'from-orange-500 to-red-500'
  },
  { 
    id: 'dc7bfe72-0d2d-4e96-8f22-4f1454b633bf', 
    name: 'Khánh Hoà', 
    nameEn: 'Khanh Hoa',
    slug: 'khanh-hoa',
    description: 'Thiên đường biển đảo',
    color: '#00bcd4',
    icon: '🏖️',
    gradient: 'from-cyan-500 to-blue-500'
  },
  { 
    id: 'b3287fef-5ef1-48c1-85d9-bce90fc0111f', 
    name: 'Đà Nẵng', 
    nameEn: 'Da Nang',
    slug: 'da-nang',
    description: 'Thành phố đáng sống',
    color: '#2196f3',
    icon: '🌉',
    gradient: 'from-blue-500 to-blue-600'
  },
  { 
    id: '6fd8f36c-1a6e-4f60-b1a0-d8769303ddfd', 
    name: 'Quảng Ninh', 
    nameEn: 'Quang Ninh',
    slug: 'quang-ninh',
    description: 'Vịnh rồng huyền thoại',
    color: '#4caf50',
    icon: '🗻',
    gradient: 'from-green-500 to-emerald-600'
  },
  { 
    id: 'b9f6eb71-6e9b-41a4-af6f-0dd59543afa6', 
    name: 'Hà Nội', 
    nameEn: 'Hanoi',
    slug: 'ha-noi',
    description: 'Thủ đô nghìn năm văn hiến',
    color: '#d32f2f',
    icon: '🏛️',
    gradient: 'from-red-500 to-red-600'
  },
];

export interface RegionData {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  gradient: string;
}

interface RegionFilterCardProps {
  region: RegionData;
  isSelected: boolean;
  onClick: () => void;
  showDescription?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const RegionFilterCard: React.FC<RegionFilterCardProps> = ({ 
  region, 
  isSelected, 
  onClick,
  showDescription = true,
  size = 'medium'
}) => {
  const { i18n } = useTranslation();
  
  const sizeClasses = {
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6'
  };
  
  const iconSizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden ${
        isSelected 
          ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md bg-white dark:bg-gray-800'
      }`}
    >
      {/* Gradient background for selected state */}
      {isSelected && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${region.gradient} opacity-5`}
        />
      )}
      
      <div className="flex items-center space-x-3 relative z-10">
        <div className={`${iconSizes[size]} flex-shrink-0`}>
          {region.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-800 dark:text-white truncate">
            {i18n.language === 'vi' ? region.name : region.nameEn}
          </div>
          {showDescription && (
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {region.description}
            </div>
          )}
        </div>
        {isSelected && (
          <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0 shadow-md">
            <div className="w-full h-full rounded-full bg-white opacity-30"></div>
          </div>
        )}
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 -skew-x-12 transform translate-x-full group-hover:translate-x-[-100%]"></div>
    </motion.div>
  );
};

interface RegionQuickFilterProps {
  selectedRegionId?: string;
  onRegionChange: (regionId?: string) => void;
  showTitle?: boolean;
  cardSize?: 'small' | 'medium' | 'large';
  columns?: number;
}

export const RegionQuickFilter: React.FC<RegionQuickFilterProps> = ({
  selectedRegionId,
  onRegionChange,
  showTitle = true,
  cardSize = 'medium',
  columns = 5
}) => {
  const { t } = useTranslation(['product']);
  
  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  return (
    <Card className="shadow-sm border-gray-200 dark:border-gray-700">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <EnvironmentOutlined className="text-primary text-lg mr-2" />
            <span className="font-medium dark:text-white">
              {t('product:filters.filter_by_region')}
            </span>
          </div>
          {selectedRegionId && (
            <Button 
              size="small"
              icon={<ClearOutlined />}
              onClick={() => onRegionChange(undefined)}
              type="text"
              className="text-gray-500 hover:text-red-500"
            >
              {t('product:filters.clear')}
            </Button>
          )}
        </div>
      )}
      
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:${gridClasses[columns as keyof typeof gridClasses]} gap-3`}>
        {regions.map(region => (
          <RegionFilterCard
            key={region.id}
            region={region}
            isSelected={selectedRegionId === region.id}
            onClick={() => onRegionChange(
              selectedRegionId === region.id ? undefined : region.id
            )}
            size={cardSize}
          />
        ))}
      </div>
    </Card>
  );
};

interface RegionListFilterProps {
  selectedRegionId?: string;
  onRegionChange: (regionId?: string) => void;
  showAllOption?: boolean;
}

export const RegionListFilter: React.FC<RegionListFilterProps> = ({
  selectedRegionId,
  onRegionChange,
  showAllOption = true
}) => {
  const { t, i18n } = useTranslation(['product']);

  return (
    <div className="space-y-2">
      <Radio.Group
        value={selectedRegionId}
        onChange={(e) => onRegionChange(e.target.value)}
        className="w-full"
      >
        <div className="space-y-2">
          {showAllOption && (
            <Radio value={undefined} className="w-full">
              <span className="dark:text-gray-300 font-medium">
                🌍 {t('product:filters.all_regions')}
              </span>
            </Radio>
          )}
          {regions.map(region => (
            <Radio key={region.id} value={region.id} className="w-full">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{region.icon}</span>
                <div>
                  <span className="dark:text-gray-300 font-medium">
                    {i18n.language === 'vi' ? region.name : region.nameEn}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {region.description}
                  </div>
                </div>
              </div>
            </Radio>
          ))}
        </div>
      </Radio.Group>
    </div>
  );
};

interface RegionCheckboxFilterProps {
  selectedRegionIds: string[];
  onRegionChange: (regionIds: string[]) => void;
  maxSelections?: number;
}

export const RegionCheckboxFilter: React.FC<RegionCheckboxFilterProps> = ({
  selectedRegionIds,
  onRegionChange,
  maxSelections
}) => {
  const { i18n } = useTranslation();

  const handleRegionToggle = (regionId: string, checked: boolean) => {
    if (checked) {
      if (maxSelections && selectedRegionIds.length >= maxSelections) {
        return; // Don't allow more selections
      }
      onRegionChange([...selectedRegionIds, regionId]);
    } else {
      onRegionChange(selectedRegionIds.filter(id => id !== regionId));
    }
  };

  return (
    <div className="space-y-3">
      {regions.map(region => (
        <div key={region.id} className="flex items-start space-x-3">
          <Checkbox
            checked={selectedRegionIds.includes(region.id)}
            onChange={(e) => handleRegionToggle(region.id, e.target.checked)}
            disabled={!!maxSelections && !selectedRegionIds.includes(region.id) && selectedRegionIds.length >= maxSelections}
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{region.icon}</span>
              <span className="dark:text-gray-300 font-medium">
                {i18n.language === 'vi' ? region.name : region.nameEn}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {region.description}
            </div>
          </div>
        </div>
      ))}
      {maxSelections && (
        <div className="text-xs text-gray-500 dark:text-gray-400 italic">
          Maximum {maxSelections} selections allowed
        </div>
      )}
    </div>
  );
};

// Utility functions
export const getRegionById = (regionId: string): RegionData | undefined => {
  return regions.find(r => r.id === regionId);
};

export const getRegionBySlug = (slug: string): RegionData | undefined => {
  return regions.find(r => r.slug === slug);
};

export const getRegionName = (regionId: string, language: 'vi' | 'en' = 'vi'): string => {
  const region = getRegionById(regionId);
  if (!region) return '';
  return language === 'vi' ? region.name : region.nameEn;
};

export default RegionQuickFilter;