import React from 'react';
import { Button, Input } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

interface CartQuantityPickerProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
}

const CartQuantityPicker: React.FC<CartQuantityPickerProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
  size = 'middle',
}) => {
  const handleDecrease = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      if (newValue < min) {
        onChange(min);
      } else if (newValue > max) {
        onChange(max); // Enforce max limit
      } else if (!disabled) {
        onChange(newValue);
      }
    }
  };

  // Set sizes based on the size prop
  const buttonSize = size === 'small' ? 24 : size === 'large' ? 36 : 32;
  const inputWidth = size === 'small' ? 40 : size === 'large' ? 56 : 48;
  const fontSize = size === 'small' ? 12 : size === 'large' ? 16 : 14;

  return (
    <div className="flex items-center">
      <motion.div whileTap={{ scale: 0.9 }}>
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
      
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className="mx-1 text-center dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        style={{ 
          width: inputWidth, 
          height: buttonSize, 
          fontSize, 
          padding: 0 
        }}
      />
      
      <motion.div whileTap={{ scale: 0.9 }}>
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
    </div>
  );
};

export default CartQuantityPicker;