import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Button, Upload, Card, message, notification } from 'antd';
import { UploadOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminRegionService } from '@/admin/services/adminRegionService';
import { RegionRequest } from '@/admin/types';
import { RcFile } from 'antd/es/upload';

const { TextArea } = Input;

const RegionForm: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileList, setFileList] = useState<any[]>([]);
  
  const isEditing = !!id;
  
  // Fetch region data if editing
  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && id) {
        try {
          const region = await AdminRegionService.getRegionById(id);
          
          // Set form values
          form.setFieldsValue({
            name: region.name,
            slug: region.slug,
            description: region.description,
            active: region.active,
          });
          
          // Set image file list if exists
          if (region.imageUrl) {
            setFileList([
              {
                uid: '-1',
                name: 'region-image.jpg',
                status: 'done',
                url: region.imageUrl,
              },
            ]);
          }
        } catch (error) {
          notification.error({
            message: t('admin:regions.fetch_error'),
            description: error instanceof Error ? error.message : 'Unknown error',
          });
        }
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
      
      const regionData: RegionRequest = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        active: values.active,
        imageUrl: fileList.length > 0 ? (fileList[0].url || '') : '',
      };
      
      // Handle file upload if there's a new file
      const newFile = fileList.length > 0 && fileList[0].originFileObj;
      if (newFile) {
        // Here we should upload the file to server and get the URL
        // For now, let's assume the URL is set directly
        // In a real app, we would need to implement file upload logic
        regionData.imageUrl = 'https://example.com/uploaded-image.jpg';
      }
      
      if (isEditing && id) {
        await AdminRegionService.updateRegion(id, regionData);
        message.success(t('admin:regions.update_success'));
      } else {
        await AdminRegionService.createRegion(regionData);
        message.success(t('admin:regions.create_success'));
      }
      
      navigate('/admin/regions');
    } catch (error) {
      notification.error({
        message: isEditing 
          ? t('admin:regions.update_error') 
          : t('admin:regions.create_error'),
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
          {isEditing ? t('admin:regions.edit') : t('admin:regions.add')}
        </h1>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/regions')}
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
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="name"
              label={t('admin:regions.name')}
              rules={[
                { required: true, message: t('admin:validation.name_required') }
              ]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              name="slug"
              label={t('admin:regions.slug')}
              rules={[
                { required: true, message: t('admin:validation.slug_required') }
              ]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              name="description"
              label={t('admin:regions.description')}
              className="md:col-span-2"
            >
              <TextArea rows={4} />
            </Form.Item>
            
            <Form.Item
              label={t('admin:regions.image')}
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
              label={t('admin:regions.status')}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </div>
          
          <div className="flex justify-end mt-6 space-x-2">
            <Button
              onClick={() => navigate('/admin/regions')}
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

export default RegionForm;