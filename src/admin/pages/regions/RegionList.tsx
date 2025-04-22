import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Tag, Input, Card, message, notification } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminRegionService } from '@/admin/services/adminRegionService';
import { RegionResponse } from '@/admin/types';

const RegionList: React.FC = () => {
  const { t } = useTranslation(['admin', 'common']);
  const navigate = useNavigate();
  
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState<string>('');
  
  // Fetch regions on mount
  useEffect(() => {
    fetchRegions();
  }, [pagination.current, pagination.pageSize]);
  
  const fetchRegions = async () => {
    setLoading(true);
    try {
      const response = await AdminRegionService.getRegions(
        pagination.current - 1, // API uses 0-based indexing
        pagination.pageSize,
        'name,asc'
      );
      
      setRegions(response.content);
      setPagination({
        ...pagination,
        total: response.totalElements,
      });
    } catch (error) {
      notification.error({
        message: t('admin:regions.fetch_error'),
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
      await AdminRegionService.deleteRegion(id);
      message.success(t('admin:regions.delete_success'));
      fetchRegions();
    } catch (error) {
      notification.error({
        message: t('admin:regions.delete_error'),
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  const searchFiltered = (value: string) => {
    return regions.filter(
      region => 
        region.name.toLowerCase().includes(value.toLowerCase()) ||
        (region.description || '').toLowerCase().includes(value.toLowerCase())
    );
  };

  const filteredRegions = searchText 
    ? searchFiltered(searchText)
    : regions;
  
  const columns = [
    {
      title: t('admin:regions.image'),
      dataIndex: 'imageUrl',
      key: 'image',
      render: (imageUrl: string) => (
        imageUrl ? (
          <img 
            src={imageUrl} 
            alt="region" 
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
            <EnvironmentOutlined className="text-gray-400" />
          </div>
        )
      ),
    },
    {
      title: t('admin:regions.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a: RegionResponse, b: RegionResponse) => a.name.localeCompare(b.name),
    },
    {
      title: t('admin:regions.slug'),
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: t('admin:regions.status'),
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? t('admin:regions.active') : t('admin:regions.inactive')}
        </Tag>
      ),
    },
    {
      title: t('admin:regions.actions'),
      key: 'action',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: RegionResponse) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/regions/edit/${record.id}`)}
          >
            {t('admin:actions.edit')}
          </Button>
          <Popconfirm
            title={t('admin:regions.delete_confirm')}
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
          {t('admin:regions.title')}
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/regions/new')}
        >
          {t('admin:regions.add')}
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <div className="mb-6">
          <Input
            placeholder={t('admin:regions.search_placeholder')}
            prefix={<SearchOutlined />}
            className="w-full md:w-64"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>
        
        <Table
          columns={columns}
          dataSource={filteredRegions}
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

export default RegionList;