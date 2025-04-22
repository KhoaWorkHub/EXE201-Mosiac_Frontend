import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Switch, Button, Upload, Card, message, notification, InputNumber } from 'antd';
import { UploadOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminCategoryService } from '@/admin/services/adminCategoryService';
import { CategoryRequest, CategoryResponse } from '@/admin/types';
import { RcFile } from 'antd/es/upload';

const { Option } = Select;
const { TextArea } = Input;

const CategoryForm: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileList, setFileList] = useState<any[]>([]);
  
  const isEditing = !!id;
  
  // Fetch categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await AdminCategoryService.getAllCategories();
        setCategories(categoriesResponse);
        
        // If editing, fetch category details
        if (isEditing && id) {
          const category = await AdminCategoryService.getCategoryById(id);
          
          // Set form values
          form.setFieldsValue({
            name: category.name,
            slug: category.slug,
            description: category.description,
            parentId: category.parent?.id,
            displayOrder: category.displayOrder,
            active: category.active,
          });
          
          // Set image file list if exists
          if (category.imageUrl) {
            setFileList([
              {
                uid: '-1',
                name: 'category-image.jpg',
                status: 'done',
                url: category.imageUrl,
              },
            ]);
          }
        }
      } catch (error) {
        notification.error({
          message: t('admin:categories.fetch_error'),
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };
    
    fetchData();
  }, [id, form, isEditing, t]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };
  
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error(t('admin:validation.image_only'));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t('admin:validation.image_size'));
    }
    return isImage && isLt2M;
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      
      const categoryData: CategoryRequest = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        parentId: values.parentId,
        displayOrder: values.displayOrder,
        active: values.active,
        imageUrl: fileList.length > 0 ? (fileList[0].url || '') : '',
      };
      
      // Handle file upload if there's a new file
      const newFile = fileList.length > 0 && fileList[0].originFileObj;
      if (newFile) {
        // Here we should upload the file to server and get the URL
        // For now, let's assume the URL is set directly
        // In a real app, we would need to implement file upload logic
        categoryData.imageUrl = 'https://example.com/uploaded-image.jpg';
      }
      
      if (isEditing && id) {
        await AdminCategoryService.updateCategory(id, categoryData);
        message.success(t('admin:categories.update_success'));
      } else {
        await AdminCategoryService.createCategory(categoryData);
        message.success(t('admin:categories.create_success'));
      }
      
      navigate('/admin/categories');
    } catch (error) {
      notification.error({
        message: isEditing 
          ? t('admin:categories.update_error') 
          : t('admin:categories.create_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">
          {isEditing ? t('admin:categories.edit') : t('admin:categories.add')}
        </h1>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/categories')}
        >
          {t('admin:actions.back')}
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            active: true,
            displayOrder: 0,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="name"
              label={t('admin:categories.name')}
              rules={[
                { required: true, message: t('admin:validation.name_required') }
              ]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              name="slug"
              label={t('admin:categories.slug')}
              rules={[
                { required: true, message: t('admin:validation.slug_required') }
              ]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              name="parentId"
              label={t('admin:categories.parent')}
            >
              <Select 
                placeholder={t('admin:categories.select_parent')}
                allowClear
              >
                {categories
                  .filter(cat => !isEditing || cat.id !== id) // exclude current category if editing
                  .map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))
                }
              </Select>
            </Form.Item>
            
            <Form.Item
              name="displayOrder"
              label={t('admin:categories.display_order')}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            
            <Form.Item
              name="description"
              label={t('admin:categories.description')}
              className="md:col-span-2"
            >
              <TextArea rows={4} />
            </Form.Item>
            
            <Form.Item
              label={t('admin:categories.image')}
              className="md:col-span-2"
            >
              <Upload
                listType="picture"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>{t('admin:actions.upload')}</Button>
              </Upload>
            </Form.Item>
            
            <Form.Item
              name="active"
              label={t('admin:categories.status')}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button
              onClick={() => navigate('/admin/categories')}
              disabled={loading}
            >
              {t('admin:actions.cancel')}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              {t('admin:actions.save')}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CategoryForm;