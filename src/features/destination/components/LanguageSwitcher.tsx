import React, { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { GlobalOutlined, CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  ];
  
  const handleChangeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <Tooltip title="Change Language" placement="left">
        <Button
          type="default"
          shape="circle"
          icon={<GlobalOutlined />}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white bg-opacity-80 backdrop-blur-sm shadow-md"
        />
      </Tooltip>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="py-2">
              {languages.map((language) => (
                <div
                  key={language.code}
                  className={`px-4 py-2 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    i18n.language === language.code ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                  onClick={() => handleChangeLanguage(language.code)}
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{language.flag}</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {language.name}
                    </span>
                  </div>
                  {i18n.language === language.code && (
                    <CheckOutlined className="text-primary" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
