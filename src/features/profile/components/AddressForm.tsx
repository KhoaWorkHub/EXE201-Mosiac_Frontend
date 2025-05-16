import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Select, Checkbox, Spin, Modal, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AddressRequest } from '@/types/address.types';
import type { ProvinceResponse, DistrictResponse, WardResponse } from '@/types/address.types';

const { Option } = Select;

type AddressFormValues = AddressRequest;

interface AddressFormProps {
  initialValues?: AddressFormValues;
  provinces: ProvinceResponse[];
  districts: DistrictResponse[];
  wards: WardResponse[];
  loading: {
    provinces: boolean;
    districts: boolean;
    wards: boolean;
    submit: boolean;
  };
  visible: boolean;
  onCancel: () => void;
  onSave: (values: AddressFormValues) => Promise<void>;
  onProvinceChange: (provinceCode: string) => void;
  onDistrictChange: (districtCode: string) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  initialValues,
  provinces,
  districts,
  wards,
  loading,
  visible,
  onCancel,
  onSave,
  onProvinceChange,
  onDistrictChange,
}) => {
  const { t } = useTranslation(['profile']);
  const [form] = Form.useForm();
  
  // State to track all form values
  const [, setFormData] = useState<Partial<AddressFormValues>>({});
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>();
  const [formReady, setFormReady] = useState(false);
  
  // NEW: Track if initial data has been loaded to prevent infinite loops
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  
  // NEW: Use refs to keep track of whether province/district data was loaded
  const provinceLoadedRef = useRef(false);
  const districtLoadedRef = useRef(false);

  // Initialize form when modal becomes visible
  useEffect(() => {
    if (visible) {
      setFormReady(true);
      
      // If it's a new form or initial data already loaded, don't trigger API calls again
      if (!initialValues) {
        setFormData({ isDefault: false });
        setSelectedProvince(undefined);
        setSelectedDistrict(undefined);
        form.resetFields();
        form.setFieldsValue({ isDefault: false });
        setInitialDataLoaded(true);
        provinceLoadedRef.current = false;
        districtLoadedRef.current = false;
      } 
      // For editing existing address
      else if (!initialDataLoaded) {
        setFormData(initialValues);
        setSelectedProvince(initialValues.provinceCode);
        setSelectedDistrict(initialValues.districtCode);
        form.resetFields();
        form.setFieldsValue(initialValues);
        
        // MODIFIED: Only load dependent data once
        if (initialValues.provinceCode && !provinceLoadedRef.current) {
          onProvinceChange(initialValues.provinceCode);
          provinceLoadedRef.current = true;
        }
        
        // Delay loading districts slightly to ensure province data is loaded first
        if (initialValues.districtCode && !districtLoadedRef.current) {
          setTimeout(() => {
            onDistrictChange(initialValues.districtCode);
            districtLoadedRef.current = true;
          }, 100);
        }
        
        setInitialDataLoaded(true);
      }
    } else {
      // Reset state when modal closes
      setFormReady(false);
      setInitialDataLoaded(false);
      provinceLoadedRef.current = false;
      districtLoadedRef.current = false;
    }
  // MODIFIED: Removed dependencies that change frequently to prevent infinite loops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, form]);

  // NEW: Separate effect to update form with initialValues when they change
  useEffect(() => {
    if (visible && initialValues && form) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, visible, form]);

  // Update form data when values change
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormChange = (changedValues: any) => {
    setFormData(prev => ({ ...prev, ...changedValues }));
  };

  // Handle province selection changes
  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict(undefined);
    
    // Update form state
    setFormData(prev => ({
      ...prev,
      provinceCode: value,
      districtCode: undefined,
      wardCode: undefined
    }));
    
    // Update form fields but preserve other values
    const currentValues = form.getFieldsValue();
    form.setFieldsValue({
      ...currentValues,
      districtCode: undefined,
      wardCode: undefined
    });
    
    // Fetch districts
    onProvinceChange(value);
    districtLoadedRef.current = false;
  };

  // Handle district selection changes
  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    
    // Update form state
    setFormData(prev => ({
      ...prev,
      districtCode: value,
      wardCode: undefined
    }));
    
    // Update form fields but preserve other values
    const currentValues = form.getFieldsValue();
    form.setFieldsValue({
      ...currentValues,
      wardCode: undefined
    });
    
    // Fetch wards
    onDistrictChange(value);
  };

  // Handle form submission
  const handleSubmit = async (values: AddressFormValues) => {
    try {
      await onSave(values);
      form.resetFields();
    } catch (error) {
      message.error(
        typeof error === 'string' ? error : t('common:messages.something_went_wrong')
      );
    }
  };

  // NEW: Handle form cancelation
  const handleCancel = () => {
    setInitialDataLoaded(false);
    provinceLoadedRef.current = false;
    districtLoadedRef.current = false;
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="text-lg font-medium">
          {initialValues ? t('profile:address.edit') : t('profile:address.add_new')}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={600}
      footer={null}
      destroyOnClose
    >
      {formReady && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleFormChange}
          className="mt-4"
        >
          <Form.Item
            name="recipientName"
            label={t('profile:address.form.recipient_name')}
            rules={[
              {
                required: true,
                message: t('profile:address.form.error.recipient_required'),
              },
            ]}
          >
            <Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={t('profile:address.form.phone')}
            rules={[
              {
                required: true,
                message: t('profile:address.form.error.phone_required'),
              },
              {
                pattern: /^[0-9]{10,11}$/,
                message: t('profile:address.form.error.phone_format'),
              },
            ]}
          >
            <Input className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="provinceCode"
              label={t('profile:address.form.province')}
              rules={[
                {
                  required: true,
                  message: t('profile:address.form.error.province_required'),
                },
              ]}
            >
              <Select
                placeholder={t('profile:address.form.please_select')}
                onChange={handleProvinceChange}
                loading={loading.provinces}
                className="dark:bg-gray-700 dark:text-white"
                dropdownClassName="dark:bg-gray-800 dark:text-white"
                value={selectedProvince}
              >
                {provinces.map((province) => (
                  <Option key={province.code} value={province.code}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="districtCode"
              label={t('profile:address.form.district')}
              rules={[
                {
                  required: true,
                  message: t('profile:address.form.error.district_required'),
                },
              ]}
            >
              <Select
                placeholder={t('profile:address.form.please_select')}
                onChange={handleDistrictChange}
                loading={loading.districts}
                disabled={!selectedProvince || districts.length === 0}
                className="dark:bg-gray-700 dark:text-white"
                dropdownClassName="dark:bg-gray-800 dark:text-white"
                value={selectedDistrict}
              >
                {districts.map((district) => (
                  <Option key={district.code} value={district.code}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="wardCode"
            label={t('profile:address.form.ward')}
            rules={[
              {
                required: true,
                message: t('profile:address.form.error.ward_required'),
              },
            ]}
          >
            <Select
              placeholder={t('profile:address.form.please_select')}
              loading={loading.wards}
              disabled={!selectedDistrict || wards.length === 0}
              className="dark:bg-gray-700 dark:text-white"
              dropdownClassName="dark:bg-gray-800 dark:text-white"
            >
              {wards.map((ward) => (
                <Option key={ward.code} value={ward.code}>
                  {ward.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="streetAddress"
            label={t('profile:address.form.street_address')}
            rules={[
              {
                required: true,
                message: t('profile:address.form.error.street_required'),
              },
            ]}
          >
            <Input.TextArea
              rows={2}
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </Form.Item>

          <Form.Item name="isDefault" valuePropName="checked">
            <Checkbox className="dark:text-white">
              {t('profile:address.form.set_as_default')}
            </Checkbox>
          </Form.Item>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              onClick={handleCancel}
              icon={<CloseOutlined />}
              className="flex items-center"
            >
              {t('profile:profile.cancel')}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading.submit}
              icon={<SaveOutlined />}
              className="flex items-center"
            >
              {t('profile:address.form.save')}
            </Button>
          </div>
        </Form>
      )}

      {/* Show loading indicator when data is being fetched */}
      {loading.provinces || loading.districts || loading.wards ? (
        <div className="absolute inset-0 bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 flex items-center justify-center z-10 pointer-events-none">
          <Spin size="large" />
        </div>
      ) : null}
    </Modal>
  );
};

export default AddressForm;