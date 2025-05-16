import React, { useEffect } from 'react';
import { Typography, Tabs, Breadcrumb, Divider } from 'antd';
import { UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import MainLayout from '@/components/layout/MainLayout';
import ProfileInfo from '@/features/profile/components/ProfileInfo';
import AddressBook from '@/features/profile/components/AddressBook';
import { UserProfileRequest } from '@/types/profile.types';
import { AddressRequest } from '@/types/address.types';
import '@/features/profile/styles/profile.css';

// Import Redux actions
import { fetchUserProfile, updateUserProfile } from '@/store/slices/userProfileSlice';
import {
  fetchUserAddresses,
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '@/store/slices/addressSlice';

const { Title } = Typography;
const { TabPane } = Tabs;

const ProfilePage: React.FC = () => {
  const { t } = useTranslation(['profile', 'common']);
  const dispatch = useAppDispatch();
  
  // Select state from Redux store
  const { profile, loading, updating } = useAppSelector((state) => state.userProfile);
  const {
    addresses,
    provinces,
    districts,
    wards,
    loading: addressLoading,
  } = useAppSelector((state) => state.address);

  // Load profile and addresses on component mount
  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserAddresses());
    dispatch(fetchProvinces());
  }, [dispatch]);

  // Handlers for profile actions
  const handleUpdateProfile = async (data: UserProfileRequest) => {
    await dispatch(updateUserProfile(data)).unwrap();
  };

  // Handlers for address actions
  const handleProvinceChange = (provinceCode: string) => {
    dispatch(fetchDistricts(provinceCode));
  };

  const handleDistrictChange = (districtCode: string) => {
    dispatch(fetchWards(districtCode));
  };

  const handleCreateAddress = async (address: AddressRequest) => {
    await dispatch(createAddress(address)).unwrap();
  };

  const handleUpdateAddress = async (id: string, address: AddressRequest) => {
    await dispatch(updateAddress({ id, request: address })).unwrap();
  };

  const handleDeleteAddress = async (id: string) => {
    await dispatch(deleteAddress(id)).unwrap();
  };

  const handleSetDefaultAddress = async (id: string) => {
    await dispatch(setDefaultAddress(id)).unwrap();
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Link to="/">{t('common:nav.home')}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t('profile:profile.title')}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-8">
          <Title level={2} className="m-0 dark:text-white">
            {t('profile:profile.title')}
          </Title>
          <Divider className="mt-4 mb-8" />
        </div>

        {/* Profile Tabs */}
        <Tabs defaultActiveKey="profile" size="large" className="profile-tabs">
          <TabPane
            tab={
              <span className="flex items-center">
                <UserOutlined className="mr-2" />
                {t('profile:profile.personal_info')}
              </span>
            }
            key="profile"
          >
            <div className="my-6">
              <ProfileInfo
                profile={profile}
                loading={loading}
                updating={updating}
                onUpdate={handleUpdateProfile}
              />
            </div>
          </TabPane>

          <TabPane
            tab={
              <span className="flex items-center">
                <EnvironmentOutlined className="mr-2" />
                {t('profile:profile.address_book')}
              </span>
            }
            key="addresses"
          >
            <div className="my-6">
              <AddressBook
                addresses={addresses}
                loading={addressLoading.addresses}
                provinces={provinces}
                districts={districts}
                wards={wards}
                loadingStates={{
                  addresses: addressLoading.addresses,
                  provinces: addressLoading.provinces,
                  districts: addressLoading.districts,
                  wards: addressLoading.wards,
                  createUpdate: addressLoading.createUpdate,
                  delete: addressLoading.delete,
                }}
                onCreateAddress={handleCreateAddress}
                onUpdateAddress={handleUpdateAddress}
                onDeleteAddress={handleDeleteAddress}
                onSetDefaultAddress={handleSetDefaultAddress}
                onProvinceChange={handleProvinceChange}
                onDistrictChange={handleDistrictChange}
              />
            </div>
          </TabPane>
        </Tabs>
      </motion.div>
    </MainLayout>
  );
};

export default ProfilePage;