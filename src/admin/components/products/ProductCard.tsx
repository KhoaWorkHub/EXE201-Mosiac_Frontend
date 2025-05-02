import React from "react";
import {
  Card,
  Tag,
  Typography,
  Button,
  Space,
  Badge,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  StarOutlined,
  StarFilled,
  DollarOutlined,
  TagsOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { ProductResponse } from "@/admin/types";
import { formatCurrency } from "@/utils/formatters";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

interface ProductCardProps {
  product: ProductResponse;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onView,
  onDelete,
  onToggleFeatured,
}) => {
  const { t } = useTranslation(["admin", "common"]);

  // Find primary image or use first image
  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card
        hoverable
        className="h-full border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300"
        cover={
          <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
            {primaryImage ? (
              <img
                src={primaryImage.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingOutlined className="text-4xl text-gray-300 dark:text-gray-600" />
              </div>
            )}

            <div className="absolute top-2 left-2">
              <Tag color={product.active ? "success" : "error"} className="m-0">
                {product.active
                  ? t("admin:products.active")
                  : t("admin:products.inactive")}
              </Tag>
            </div>

            {product.stockQuantity === 0 && (
              <div className="absolute top-2 right-2">
                <Tag color="error">{t("common:out_of_stock")}</Tag>
              </div>
            )}

            {product.featured && (
              <div className="absolute bottom-2 left-2">
                <Badge
                  count={<StarFilled style={{ color: "#fadb14" }} />}
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                />
              </div>
            )}
          </div>
        }
        actions={[
          <Tooltip title={t("common:view")}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(product.id)}
            />
          </Tooltip>,
          <Tooltip title={t("admin:actions.edit")}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(product.id)}
            />
          </Tooltip>,
          <Tooltip
            title={
              product.featured
                ? t("admin:products.unfeature")
                : t("admin:products.feature")
            }
          >
            <Button
              type="text"
              icon={
                product.featured ? (
                  <StarFilled className="text-yellow-400" />
                ) : (
                  <StarOutlined />
                )
              }
              onClick={() => onToggleFeatured(product.id, product.featured)}
            />
          </Tooltip>,
          <Popconfirm
            title={t("admin:products.delete_confirm")}
            onConfirm={() => onDelete(product.id)}
            okText={t("admin:actions.yes")}
            cancelText={t("admin:actions.no")}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>,
        ]}
      >
        <div className="px-1 py-2">
          <Space size={1} direction="vertical" className="w-full">
            <div className="flex justify-between">
              <Title
                level={5}
                className="m-0 text-ellipsis overflow-hidden whitespace-nowrap"
                style={{ maxWidth: "80%" }}
              >
                {product.name}
              </Title>
              {product.variants && product.variants.length > 0 && (
                <Badge
                  count={product.variants.length}
                  overflowCount={99}
                  color="blue"
                />
              )}
            </div>

            <Text type="secondary" className="text-xs">
              SKU: {product.sku || "-"}
            </Text>

            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <DollarOutlined className="mr-1 text-primary" />
                <Text strong className="text-primary">
                  {formatCurrency(Number(product.price))}
                </Text>
                {product.originalPrice &&
                  Number(product.originalPrice) > Number(product.price) && (
                    <Text delete className="text-gray-400 ml-2 text-sm">
                      {formatCurrency(Number(product.originalPrice))}
                    </Text>
                  )}
              </div>

              <Space>
                {product.category && (
                  <Tag color="processing" icon={<TagsOutlined />}>
                    {product.category.name}
                  </Tag>
                )}

                {product.region && (
                  <Tag color="green">{product.region.name}</Tag>
                )}
              </Space>
            </div>

            <div className="flex justify-between items-center mt-2">
              <div>
                <Text type="secondary" className="mr-2">
                  {t("admin:products.stock")}:
                </Text>
                <Tag
                  color={
                    (product.stockQuantity || 0) > 10
                      ? "success"
                      : (product.stockQuantity || 0) > 0
                      ? "warning"
                      : "error"
                  }
                >
                  {product.stockQuantity || 0}
                </Tag>
              </div>

              <Text type="secondary" className="text-xs">
                {t("admin:products.view_count")}: {product.viewCount || 0}
              </Text>
            </div>
          </Space>
        </div>
      </Card>
    </motion.div>
  );
};

export default React.memo(ProductCard);
