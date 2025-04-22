// src/features/auth/components/OAuth2RedirectHandler.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { AuthService } from '@/services/auth.service';
import { Spin } from 'antd';

const OAuth2RedirectHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Xử lý OAuth2 redirect
    const urlParams = new URLSearchParams(location.search);
    const authResponse = AuthService.handleOAuth2Redirect(urlParams);
    
    if (authResponse) {
      dispatch(setCredentials(authResponse));
      navigate('/');
    } else {
      // Nếu không thành công, chuyển hướng về trang đăng nhập
      navigate('/login');
    }
  }, [dispatch, location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      <Spin size="large" />
      <p className="mt-4">Đang xử lý đăng nhập...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;