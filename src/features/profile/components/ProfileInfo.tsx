import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Skeleton } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UserDto } from '@/types/auth.types';
import { UserProfileRequest } from '@/types/profile.types';

// Extend UserDto to include phoneNumber property
interface ExtendedUserDto extends UserDto {
  phoneNumber?: string;
}

interface ProfileInfoProps {
  profile: ExtendedUserDto | null;
  loading: boolean;
  updating: boolean;
  onUpdate: (data: UserProfileRequest) => Promise<void>;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  loading,
  updating,
  onUpdate,
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);

  const handleSubmit = async (values: UserProfileRequest) => {
    try {
      await onUpdate(values);
      message.success(t('profile:profile.success.profile_updated'));
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const cancelEditing = () => {
    form.resetFields();
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        title={
          <div className="flex items-center">
            <span className="text-xl font-medium dark:text-white">
              {t('profile:profile.personal_info')}
            </span>
            {!editing && !loading && (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => setEditing(true)}
                className="ml-auto"
              >
                {t('profile:profile.edit_profile')}
              </Button>
            )}
          </div>
        }
        className="shadow-md dark:bg-gray-800 border-0 rounded-lg overflow-hidden"
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              fullName: profile?.fullName || '',
              phoneNumber: profile?.phoneNumber || '',
            }}
            onFinish={handleSubmit}
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile:profile.email')}
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-gray-800 dark:text-gray-200">
                {profile?.email}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('common:form.email_cannot_change')}
              </p>
            </div>

            <Form.Item
              name="fullName"
              label={t('profile:profile.full_name')}
              rules={[
                {
                  required: true,
                  message: t('profile:profile.validation.full_name_required'),
                },
              ]}
            >
              {editing ? (
                <Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-gray-800 dark:text-gray-200">
                  {profile?.fullName}
                </div>
              )}
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label={t('profile:profile.phone_number')}
              rules={[
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: t('profile:profile.validation.phone_format'),
                },
              ]}
            >
              {editing ? (
                <Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-gray-800 dark:text-gray-200">
                  {profile?.phoneNumber || '-'}
                </div>
              )}
            </Form.Item>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile:profile.role')}
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-gray-800 dark:text-gray-200">
                {profile?.role || '-'}
              </div>
            </div>

            {editing && (
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={cancelEditing}
                  icon={<CloseOutlined />}
                  className="flex items-center"
                >
                  {t('profile:profile.cancel')}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updating}
                  icon={<SaveOutlined />}
                  className="flex items-center"
                >
                  {t('profile:profile.save_changes')}
                </Button>
              </div>
            )}
          </Form>
        )}
      </Card>
    </motion.div>
  );
};

export default ProfileInfo;