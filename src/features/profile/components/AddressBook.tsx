import React, { useState, useCallback } from 'react';
import { Card, Button, Empty, Skeleton, Tag, Popconfirm, message } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  PhoneOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux'; // Add this
import { AddressResponse, AddressRequest } from '@/types/address.types';
import AddressForm from './AddressForm';

interface AddressBookProps {
  addresses: AddressResponse[];
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provinces: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  districts: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wards: any[];
  loadingStates: {
    addresses: boolean;
    provinces: boolean;
    districts: boolean;
    wards: boolean;
    createUpdate: boolean;
    delete: boolean;
  };
  onCreateAddress: (address: AddressRequest) => Promise<void>;
  onUpdateAddress: (id: string, address: AddressRequest) => Promise<void>;
  onDeleteAddress: (id: string) => Promise<void>;
  onSetDefaultAddress: (id: string) => Promise<void>;
  onProvinceChange: (provinceCode: string) => void;
  onDistrictChange: (districtCode: string) => void;
}

const AddressBook: React.FC<AddressBookProps> = ({
  addresses,
  loading,
  provinces,
  districts,
  wards,
  loadingStates,
  onCreateAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onProvinceChange,
  onDistrictChange,
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const [formVisible, setFormVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<AddressResponse | null>(null);
  useDispatch(); // Add this

  // Use useCallback to prevent function recreation on every render
  const handleProvinceChange = useCallback((provinceCode: string) => {
    onProvinceChange(provinceCode);
  }, [onProvinceChange]);

  const handleDistrictChange = useCallback((districtCode: string) => {
    onDistrictChange(districtCode);
  }, [onDistrictChange]);

  const handleAddNew = () => {
    setCurrentAddress(null);
    setFormVisible(true);
  };

  const handleEdit = (address: AddressResponse) => {
    setCurrentAddress(address);
    setFormVisible(true);
  };

  const handleSave = async (values: AddressRequest) => {
    try {
      if (currentAddress) {
        await onUpdateAddress(currentAddress.id, values);
        message.success(t('profile:profile.success.address_updated'));
      } else {
        await onCreateAddress(values);
        message.success(t('profile:profile.success.address_created'));
      }
      setFormVisible(false);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteAddress(id);
      message.success(t('profile:profile.success.address_deleted'));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await onSetDefaultAddress(id);
      message.success(t('profile:profile.success.default_address_set'));
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  // Map current address to form values if editing
  const getInitialValues = (): AddressRequest | undefined => {
    if (!currentAddress) return undefined;

    return {
      recipientName: currentAddress.recipientName,
      phone: currentAddress.phone,
      provinceCode: currentAddress.province.code,
      districtCode: currentAddress.district.code,
      wardCode: currentAddress.ward.code,
      streetAddress: currentAddress.streetAddress,
      isDefault: currentAddress.isDefault,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card
        title={
          <div className="flex items-center">
            <span className="text-xl font-medium dark:text-white">
              {t('profile:address.title')}
            </span>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              className="ml-auto flex items-center"
            >
              {t('profile:address.add_new')}
            </Button>
          </div>
        }
        className="shadow-md dark:bg-gray-800 border-0 rounded-lg overflow-hidden"
      >
        {loading ? (
          <div className="space-y-4">
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : addresses.length === 0 ? (
          <div className="py-8">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <h4 className="text-lg font-medium dark:text-white mb-2">
                    {t('profile:address.empty.title')}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {t('profile:address.empty.message')}
                  </p>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                    {t('profile:address.empty.add_first')}
                  </Button>
                </div>
              }
            />
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 gap-4">
              {addresses.map((address) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative"
                >
                  {/* Same address card content as before */}
                  {address.isDefault && (
                    <Tag
                      color="success"
                      className="absolute top-4 right-4 flex items-center"
                      icon={<StarFilled />}
                    >
                      {t('profile:address.default_badge')}
                    </Tag>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <div className="mb-3 flex items-start">
                        <UserOutlined className="mt-1 mr-2 text-primary" />
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {address.recipientName}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300 flex items-center">
                            <PhoneOutlined className="mr-1" />
                            {address.phone}
                          </div>
                        </div>
                      </div>
                      <div className="flex">
                        <EnvironmentOutlined className="mt-1 mr-2 text-primary" />
                        <div className="text-gray-600 dark:text-gray-300">
                          <div>{address.streetAddress}</div>
                          <div>
                            {`${address.ward.name}, ${address.district.name}, ${address.province.name}`}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center space-y-2 md:justify-end md:items-end">
                      <div className="flex space-x-2">
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(address)}
                          className="flex items-center"
                        >
                          {t('profile:address.edit')}
                        </Button>
                        <Popconfirm
                          title={t('profile:address.confirm_delete.title')}
                          description={t('profile:address.confirm_delete.message')}
                          onConfirm={() => handleDelete(address.id)}
                          okText={t('profile:address.confirm_delete.yes')}
                          cancelText={t('profile:address.confirm_delete.no')}
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            loading={loadingStates.delete}
                            className="flex items-center"
                          >
                            {t('profile:address.delete')}
                          </Button>
                        </Popconfirm>
                      </div>
                      {!address.isDefault && (
                        <Button
                          icon={<StarOutlined />}
                          onClick={() => handleSetDefault(address.id)}
                          loading={loadingStates.createUpdate}
                          className="flex items-center"
                        >
                          {t('profile:address.set_default')}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        <AddressForm
          initialValues={getInitialValues()}
          provinces={provinces}
          districts={districts}
          wards={wards}
          loading={{
            provinces: loadingStates.provinces,
            districts: loadingStates.districts,
            wards: loadingStates.wards,
            submit: loadingStates.createUpdate,
          }}
          visible={formVisible}
          onCancel={() => setFormVisible(false)}
          onSave={handleSave}
          onProvinceChange={handleProvinceChange}
          onDistrictChange={handleDistrictChange}
        />
      </Card>
    </motion.div>
  );
};

export default AddressBook;