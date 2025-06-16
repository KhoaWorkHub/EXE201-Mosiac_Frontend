// src/utils/formatters.ts
/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: USD)
 * @param locale The locale for formatting (default: en-US)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  // Handle undefined or null
  if (amount === undefined || amount === null) {
    return '';
  }

  // Special handling for VND
  if (currency === 'VND') {
    try {
      // Try with vi-VN locale first
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0, // VND doesn't use decimal places
        maximumFractionDigits: 0,
      }).format(amount);
    } catch  {
      // Fallback: Manual formatting for VND
      const formattedNumber = new Intl.NumberFormat('vi-VN').format(amount);
      return `${formattedNumber} ₫`;
    }
  }

  // For other currencies, use the original logic
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch{
    // Fallback for unsupported currency/locale combinations
    return `${amount} ${currency}`;
  }
};

/**
 * Alternative VND formatter with better browser compatibility
 */
export const formatVND = (amount: number): string => {
  if (amount === undefined || amount === null) {
    return '';
  }

  // Format number with thousand separators
  const formattedNumber = amount.toLocaleString('vi-VN');
  return `${formattedNumber} ₫`;
};

/**
 * Format a date string or Date object
 * @param date The date to format
 * @param locale The locale for formatting (default: en-US)
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  locale: string = 'en-US'
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Format a number with thousand separators
 * @param value The number to format
 * @param locale The locale for formatting (default: en-US)
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  locale: string = 'en-US'
): string => {
  if (value === undefined || value === null) {
    return '';
  }
  
  return new Intl.NumberFormat(locale).format(value);
};

/**
 * Truncate text with ellipsis
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
};