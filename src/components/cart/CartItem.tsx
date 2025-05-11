import React, { useState, useEffect } from "react";
import { Card, Button, Popconfirm, Tooltip, message } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CartItemResponse } from "@/types/cart.types";
import { formatCurrency } from "@/utils/formatters";
import CartQuantityPicker from "./CartQuantityPicker";
import { useCart } from '@/contexts/CartContext';
import type { UUID } from 'crypto';

interface CartItemProps {
  item: CartItemResponse;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  loading?: boolean;
  isRemoving?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
  loading = false,
  isRemoving = false,
}) => {
  const { t } = useTranslation(["cart", "product"]);
  const { state, getItemStockRemaining } = useCart();
  const [stockLimit, setStockLimit] = useState<number>(99);
  const [showStockWarning, setShowStockWarning] = useState(false);
  
  // Determine max quantity available from stock
  useEffect(() => {
    const remaining = getItemStockRemaining(
      item.productId as UUID, 
      item.variantId as UUID | undefined
    );
    
    // If we have stock info, use it as limit
    if (remaining > 0) {
      setStockLimit(remaining + item.quantity); // Add current quantity since it's already counted in cart
    } else {
      // Otherwise try to get stock info from the product directly
      // This is a fallback in case stock wasn't tracked yet
      const stockInfo = state.stockQuantities[`${item.productId}${item.variantId ? `-${item.variantId}` : ''}`];
      if (stockInfo) {
        setStockLimit(stockInfo);
      }
    }
  }, [item, state.stockQuantities, getItemStockRemaining]);
  
  // Show warning when quantity is close to stock limit
  useEffect(() => {
    if (stockLimit && item.quantity >= stockLimit - 1) {
      setShowStockWarning(true);
    } else {
      setShowStockWarning(false);
    }
  }, [item.quantity, stockLimit]);

  const handleQuantityChange = (value: number | null) => {
    if (!value || value <= 0) return;
    
    // Check against stock limit
    if (stockLimit && value > stockLimit) {
      message.warning(t('cart:notifications.quantity_exceeds_stock'));
      onQuantityChange(item.id, stockLimit);
      return;
    }
    
    onQuantityChange(item.id, value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      layout
      whileHover={{ scale: 1.01 }}
    >
      <Card
        className="mb-4 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
        bodyStyle={{ padding: 0 }}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Product Image */}
          <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 dark:bg-gray-700 overflow-hidden">
            <Link to={`/products/${item.productSlug}`}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-full h-full"
              >
                <img
                  src={item.productImage || '/placeholder-product.jpg'}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </Link>
          </div>

          {/* Product Info */}
          <div className="flex-grow p-4 flex flex-col sm:flex-row">
            <div className="flex-grow">
              <h3 className="text-base font-medium mb-1 dark:text-white">
                <Link
                  to={`/products/${item.productId}`}
                  className="hover:text-primary transition-colors duration-300"
                >
                  {item.productName}
                </Link>
              </h3>

              {item.variantInfo && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {item.variantInfo}
                </p>
              )}

              <div className="flex items-center">
                <p className="text-primary font-semibold">
                  {formatCurrency(item.price)}
                </p>
                
                {/* Unit price display */}
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {t("product_details.per_unit")}
                </p>
              </div>
              
              {/* Stock warning */}
              <AnimatePresence>
                {showStockWarning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                  >
                    <p className="text-xs text-yellow-500 flex items-center">
                      <InfoCircleOutlined className="mr-1" />
                      {t('cart:notifications.only_x_in_stock', { count: stockLimit })}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quantity Control */}
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center">
              <div className="flex items-center">
                <span className="mr-3 dark:text-white text-sm">
                  {t("product_details.quantity")}:
                </span>
                <CartQuantityPicker
                  value={item.quantity}
                  min={1}
                  max={stockLimit}
                  onChange={handleQuantityChange}
                  disabled={loading}
                  showStockWarning={item.quantity >= stockLimit - 2}
                />
              </div>

              {/* Actions */}
              <div className="mt-2 sm:mt-0 sm:ml-4 flex items-center">
                <Tooltip title={`${t("product_details.view")}`}>
                  <Link to={`/products/${item.productSlug}`}>
                    <Button
                      type="text"
                      icon={<LinkOutlined />}
                      className="text-gray-500 hover:text-primary"
                    />
                  </Link>
                </Tooltip>

                <Popconfirm
                  title={t("cart:cart.remove")}
                  description={`${t("cart:cart.remove")} "${
                    item.productName
                  }"?`}
                  onConfirm={() => onRemove(item.id)}
                  okText={t("actions.yes")}
                  cancelText={t("actions.no")}
                  placement="topRight"
                  icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    loading={isRemoving}
                  />
                </Popconfirm>
              </div>
            </div>
          </div>
        </div>

        {/* Subtotal with colored background to emphasize */}
        <div className="bg-gray-50 dark:bg-gray-700 p-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300 font-medium">
            {t("cart:cart.subtotal")}
          </span>
          <motion.span 
            className="text-lg font-medium text-primary"
            key={item.subtotal}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {formatCurrency(item.subtotal)}
          </motion.span>
        </div>
        
        {/* Stock limit indicator for items at max capacity */}
        {item.quantity === stockLimit && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 text-center border-t border-yellow-100 dark:border-yellow-800">
            <span className="text-xs text-yellow-700 dark:text-yellow-500 flex items-center justify-center">
              <InfoCircleOutlined className="mr-1" />
              {t('cart:notifications.max_quantity_reached')}
            </span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default CartItem;