import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Tag, Input, Card, message, notification } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminCategoryService } from '@/admin/services/adminCategoryService';
import { CategoryResponse } from '@/admin/types';

const CategoryList: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState<string>('');
  
  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [pagination.current, pagination.pageSize]);
  
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await AdminCategoryService.getCategories(
        pagination.current - 1, // API uses 0-based indexing
        pagination.pageSize,
        'displayOrder,asc'
      );
      
      setCategories(response.content);
      setPagination({
        ...pagination,
        total: response.totalElements,
      });
    } catch (error) {
      notification.error({
        message: t('admin:categories.fetch_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await AdminCategoryService.deleteCategory(id);
      message.success(t('admin:categories.delete_success'));
      fetchCategories();
    } catch (error) {
      notification.error({
        message: t('admin:categories.delete_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  const searchFiltered = (value: string) => {
    return categories.filter(
      category => 
        category.name.toLowerCase().includes(value.toLowerCase()) ||
        (category.description || '').toLowerCase().includes(value.toLowerCase())
    );
  };

  const filteredCategories = searchText 
    ? searchFiltered(searchText)
    : categories;
  
  const columns = [
    {
      title: t('admin:categories.image'),
      dataIndex: 'imageUrl',
      key: 'image',
      render: (imageUrl: string) => (
        imageUrl ? (
          <img 
            src={imageUrl} 
            alt="category" 
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
            <AppstoreOutlined className="text-gray-400" />
          </div>
        )
      ),
    },
    {
      title: t('admin:categories.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a: CategoryResponse, b: CategoryResponse) => a.name.localeCompare(b.name),
    },
    {
      title: t('admin:categories.parent'),
      dataIndex: ['parent', 'name'],
      key: 'parent',
      render: ( record: CategoryResponse) => 
        record.parent ? record.parent.name : '-',
    },
    {
      title: t('admin:categories.display_order'),
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      sorter: (a: CategoryResponse, b: CategoryResponse) => 
        (a.displayOrder || 0) - (b.displayOrder || 0),
    },
    {
      title: t('admin:categories.status'),
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? t('admin:categories.active') : t('admin:categories.inactive')}
        </Tag>
      ),
    },
    {
      title: t('admin:categories.actions'),
      key: 'action',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: CategoryResponse) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/categories/edit/${record.id}`)}
          >
            {t('admin:actions.edit')}
          </Button>
          <Popconfirm
            title={t('admin:categories.delete_confirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('admin:actions.yes')}
            cancelText={t('admin:actions.no')}
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />}
            >
              {t('admin:actions.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">
          {t('admin:categories.title')}
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/categories/new')}
        >
          {t('admin:categories.add')}
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <div className="mb-6">
          <Input
            placeholder={t('admin:categories.search_placeholder')}
            prefix={<SearchOutlined />}
            className="w-full md:w-64"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>
        
        <Table
          columns={columns}
          dataSource={filteredCategories}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default CategoryList;