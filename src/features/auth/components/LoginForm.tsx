import React from 'react';
import { Form, Input, Button, Divider, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';
import { AuthService } from '@/services/auth.service';
import { AuthenticationRequest } from '@/types/auth.types';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const onFinish = async (values: AuthenticationRequest) => {
    try {
      await dispatch(login(values)).unwrap();
      message.success(t('auth:login.success'));
      navigate('/');
    } catch (_) {
      message.error(t('auth:login.failed'));
    }
  };

  const handleGoogleLogin = () => {
    AuthService.googleLogin();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-center text-2xl font-bold mb-8 text-primary-600">
        {t('common:app.name')}
      </h1>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <Form
        name="login-form"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        className="space-y-4"
      >
        <Form.Item
          name="email"
          label={t('auth:login.email')}
          rules={[
            { required: true, message: t('auth:validation.email_required') },
            { type: 'email', message: t('auth:validation.email_valid') }
          ]}
        >
          <Input 
            prefix={<UserOutlined className="text-gray-400" />} 
            placeholder={t('auth:login.email_placeholder')}
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={t('auth:login.password')}
          rules={[
            { required: true, message: t('auth:validation.password_required') }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder={t('auth:login.password_placeholder')}
            size="large" 
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item className="mb-2">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-12 rounded-lg bg-primary hover:bg-primary-600 border-primary"
            size="large"
          >
            {t('common:actions.login')}
          </Button>
        </Form.Item>
      </Form>

      <Divider className="my-6">{t('auth:login.or')}</Divider>

      <Button
        onClick={handleGoogleLogin}
        className="w-full h-12 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        size="large"
      >
        <img 
          src="/google-logo.svg" 
          alt="Google" 
          className="w-5 h-5 mr-2" 
        />
        {t('auth:login.google')}
      </Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('auth:login.no_account')}{' '}
          <a href="/register" className="text-primary hover:underline font-semibold">
            {t('common:actions.register')}
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;