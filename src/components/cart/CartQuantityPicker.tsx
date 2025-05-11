import React, { useState, useEffect } from 'react';
import { Button, Input, Tooltip, message } from 'antd';
import { PlusOutlined, MinusOutlined, WarningOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface CartQuantityPickerProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  showStockWarning?: boolean;
}

const CartQuantityPicker: React.FC<CartQuantityPickerProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
  size = 'middle',
  showStockWarning = true,
}) => {
  const { t } = useTranslation(['cart']);
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [showMaxWarning, setShowMaxWarning] = useState<boolean>(false);
  
  // Update input value when the prop changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);
  
  // Show warning when near max capacity
  useEffect(() => {
    if (value >= max - 1 && showStockWarning) {
      setShowMaxWarning(true);
      
      // Hide warning after 3 seconds
      const timer = setTimeout(() => {
        setShowMaxWarning(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [value, max, showStockWarning]);

  const handleDecrease = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
      
      // Show warning message if we're at max after this increase
      if (value + 1 >= max && showStockWarning) {
        message.warning(t('cart:notifications.max_quantity_reached'));
      }
    } else if (value >= max && showStockWarning) {
      // Already at max, show warning
      message.warning(t('cart:notifications.max_quantity_reached'));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow empty string during typing
    if (newValue === '') {
      setInputValue('');
      return;
    }
    
    // Only allow numbers
    if (!/^\d+$/.test(newValue)) {
      return;
    }
    
    setInputValue(newValue);
  };
  
  const handleInputBlur = () => {
    // Convert to number and validate
    let newValue = parseInt(inputValue || '0', 10);
    
    // Handle invalid input
    if (isNaN(newValue)) {
      newValue = value;
    }
    
    // Enforce min/max
    if (newValue < min) {
      newValue = min;
      if (showStockWarning) {
        message.info(`${t('cart:product_details.quantity')} ${t('common:validation.min_value')} ${min}`);
      }
    } else if (newValue > max) {
      newValue = max;
      if (showStockWarning) {
        message.warning(t('cart:notifications.quantity_exceeds_stock'));
      }
    }
    
    // Update state and trigger onChange
    setInputValue(newValue.toString());
    if (newValue !== value) {
      onChange(newValue);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  // Set sizes based on the size prop
  const buttonSize = size === 'small' ? 24 : size === 'large' ? 36 : 32;
  const inputWidth = size === 'small' ? 40 : size === 'large' ? 56 : 48;
  const fontSize = size === 'small' ? 12 : size === 'large' ? 16 : 14;

  return (
    <div className="relative">
      <div className="flex items-center">
        <Tooltip title={value <= min ? t('common:validation.min_value') : ''}>
          <motion.div 
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: value <= min || disabled ? 0.5 : 1,
              scale: value <= min || disabled ? 0.95 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            <Button
              icon={<MinusOutlined />}
              onClick={handleDecrease}
              disabled={disabled || value <= min}
              className={`flex items-center justify-center dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 ${
                value <= min ? 'dark:text-gray-600' : ''
              }`}
              style={{ width: buttonSize, height: buttonSize, padding: 0 }}
            />
          </motion.div>
        </Tooltip>
        
        <Tooltip title={showMaxWarning ? t('cart:notifications.only_x_in_stock', { count: max }) : ''}>
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`mx-1 text-center dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              value >= max ? 'border-yellow-500 dark:border-yellow-600' : ''
            }`}
            style={{ 
              width: inputWidth, 
              height: buttonSize, 
              fontSize, 
              padding: 0 
            }}
          />
        </Tooltip>
        
        <Tooltip title={value >= max ? t('cart:notifications.max_quantity_reached') : ''}>
          <motion.div 
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 1 }}
            animate={{ 
              opacity: value >= max || disabled ? 0.5 : 1,
              scale: value >= max || disabled ? 0.95 : 1 
            }}
            transition={{ duration: 0.2 }}
          >
            <Button
              icon={<PlusOutlined />}
              onClick={handleIncrease}
              disabled={disabled || value >= max}
              className={`flex items-center justify-center dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 ${
                value >= max ? 'dark:text-gray-600' : ''
              }`}
              style={{ width: buttonSize, height: buttonSize, padding: 0 }}
            />
          </motion.div>
        </Tooltip>
      </div>
      
      {/* Stock warning indicator */}
      <AnimatePresence>
        {showMaxWarning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-6 left-0 right-0 text-xs text-yellow-600 dark:text-yellow-500 flex items-center justify-center"
          >
            <WarningOutlined className="mr-1" />
            <span>{t('cart:notifications.only_x_in_stock', { count: max })}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartQuantityPicker;