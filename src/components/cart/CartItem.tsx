import React from "react";
import { Card, Button, InputNumber, Popconfirm, Tooltip } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CartItemResponse } from "@/types/cart.types";
import { formatCurrency } from "@/utils/formatters";

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

  const handleQuantityChange = (value: number | null) => {
    if (value && value > 0) {
      onQuantityChange(item.id, value);
    }
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
            </div>

            {/* Quantity Control */}
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center">
              <div className="flex items-center">
                <span className="mr-3 dark:text-white text-sm">
                  {t("product_details.quantity")}:
                </span>
                <InputNumber
                  min={1}
                  max={99}
                  value={item.quantity}
                  onChange={handleQuantityChange}
                  className="w-16"
                  disabled={loading}
                />
              </div>

              {/* Actions */}
              <div className="mt-2 sm:mt-0 sm:ml-4 flex items-center">
                <Tooltip title={`${t("product:product_details.view")}`}>
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
                  okText={t("common:actions.yes")}
                  cancelText={t("common:actions.no")}
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
      </Card>
    </motion.div>
  );
};

export default CartItem;
