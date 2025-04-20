import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={theme === 'dark'}
        onChange={toggleTheme}
        checkedChildren={<BulbOutlined />}
        unCheckedChildren={<BulbFilled />}
        className="bg-gray-300 dark:bg-gray-700"
      />
      <span className="text-sm hidden sm:inline">
        {theme === 'dark' ? t('theme.light') : t('theme.dark')}
      </span>
    </div>
  );
};

export default ThemeToggle;