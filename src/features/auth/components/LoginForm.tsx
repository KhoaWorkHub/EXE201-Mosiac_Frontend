import React, { useState } from "react";
import { Form, Input, Button, Divider, message, Checkbox, Tooltip } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { AuthService } from "@/services/auth.service";
import { AuthenticationRequest } from "@/types/auth.types";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const LoginForm: React.FC = () => {
  const { t } = useTranslation(["auth", "common"]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [rememberMe, setRememberMe] = useState(false);

  const onFinish = async (values: AuthenticationRequest) => {
    try {
      await dispatch(login(values)).unwrap();
      message.success(t("auth:login.success"));
      navigate("/");
    } catch (_) {
      message.error(t("auth:login.failed"));
    }
  };

  const handleGoogleLogin = () => {
    AuthService.googleLogin();
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t("auth:login.welcome")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t("common:app.tagline")}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center"
          >
            <span className="text-red-500 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            {error}
          </motion.div>
        )}

        <Form
          form={form}
          name="login-form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Form.Item
              name="email"
              label={t("auth:login.email")}
              rules={[
                {
                  required: true,
                  message: t("auth:validation.email_required"),
                },
                { type: "email", message: t("auth:validation.email_valid") },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder={t("auth:login.email_placeholder")}
                className="rounded-lg"
              />
            </Form.Item>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Form.Item
              name="password"
              label={t("auth:login.password")}
              rules={[
                {
                  required: true,
                  message: t("auth:validation.password_required"),
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder={t("auth:login.password_placeholder")}
                className="rounded-lg"
              />
            </Form.Item>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-between items-center mb-4"
          >
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              {t("auth:login.remember_me")}
            </Checkbox>

            <Tooltip title={t("auth:login.forgot_password")}>
              <Link
                to="/forgot-password"
                className="text-primary hover:text-primary-600 text-sm"
              >
                {t("auth:login.forgot_password")}
              </Link>
            </Tooltip>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 rounded-lg bg-primary hover:bg-primary-600 border-primary text-lg font-medium flex items-center justify-center"
                icon={
                  loading ? null : (
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )
                }
              >
                {t("common:actions.login")}
              </Button>
            </Form.Item>
          </motion.div>
        </Form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Divider className="my-6">
            <span className="text-gray-500 dark:text-gray-400">
              {t("auth:login.or")}
            </span>
          </Divider>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button
            onClick={handleGoogleLogin}
            className="w-full h-12 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors duration-300"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              ></path>
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              ></path>
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              ></path>
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              ></path>
            </svg>
            {t("auth:login.google")}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400">
            {t("auth:login.no_account")}{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary-600 font-semibold"
            >
              {t("common:actions.register")}
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
