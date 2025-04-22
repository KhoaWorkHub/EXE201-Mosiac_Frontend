import React from 'react';
import { Spin } from 'antd';
import { motion } from 'framer-motion';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ fullScreen = true, message }) => {
  if (fullScreen) {
    return (
      <motion.div 
        className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16" viewBox="0 0 24 24">
              <motion.path
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                strokeLinecap="round"
                d="M 12, 2 A 10, 10 0 1 0 12, 22 A 10, 10 0 1 0 12, 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="text-primary"
              />
            </svg>
          </div>
          {message && (
            <p className="text-gray-600 dark:text-gray-300 text-lg">{message}</p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex justify-center py-8">
      <Spin size="large" />
      {message && (
        <p className="ml-3 text-gray-600 dark:text-gray-300">{message}</p>
      )}
    </div>
  );
};

export default Loading;