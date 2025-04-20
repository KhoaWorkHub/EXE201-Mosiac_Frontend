import React from 'react';
import { Dropdown, Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { MenuProps } from 'antd';

interface Language {
  key: string;
  label: string;
  flag: string;
}

const languages: Language[] = [
  { key: 'en', label: 'English', flag: '🇺🇸' },
  { key: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.key === i18n.language) || languages[0];
  };

  const items: MenuProps['items'] = languages.map(lang => ({
    key: lang.key,
    label: (
      <div className="flex items-center">
        <span className="mr-2">{lang.flag}</span>
        <span>{lang.label}</span>
      </div>
    ),
    onClick: () => changeLanguage(lang.key),
  }));

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button
        type="text"
        icon={<GlobalOutlined />}
        className="flex items-center"
      >
        <span className="ml-1 hidden sm:inline">
          {getCurrentLanguage().flag} {getCurrentLanguage().label}
        </span>
      </Button>
    </Dropdown>
  );
};

export default LanguageSelector;