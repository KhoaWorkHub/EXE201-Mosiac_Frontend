import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Drawer } from 'antd';
import { 
  DashboardOutlined, 
  ShoppingOutlined, 
  AppstoreOutlined, 
  EnvironmentOutlined, 
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  HomeOutlined,
  UserOutlined,
  BellOutlined,
  CloseOutlined,
  MenuOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import ThemeToggle from '@/components/common/ThemeToggle';
import LanguageSelector from '@/components/common/LanguageSelector';
import { motion } from 'framer-motion';
import type { MenuProps } from 'antd';
import { UserRole } from '@/types/auth.types';

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t } = useTranslation(['admin', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  // Update screenWidth on resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto collapse sidebar on mobile
  useEffect(() => {
    if (screenWidth < 768) {
      setCollapsed(true);
    }
  }, [screenWidth]);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: t('admin:sidebar.dashboard') },
    { key: '/admin/products', icon: <ShoppingOutlined />, label: t('admin:sidebar.products') },
    { key: '/admin/categories', icon: <AppstoreOutlined />, label: t('admin:sidebar.categories') },
    { key: '/admin/regions', icon: <EnvironmentOutlined />, label: t('admin:sidebar.regions') },
  ];
  
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('admin:header.profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('admin:header.logout'),
      onClick: handleLogout,
      danger: true,
    },
  ];
  if (user?.role === UserRole.ADMIN) {
    userMenuItems.unshift({
      key: 'admin',
      icon: <SettingOutlined />, 
      label: <Link to="/admin">{t('nav.admin')}</Link>,
    });
  }
  
  return (
    <Layout className="min-h-screen">
      {/* Sidebar for desktop */}
      {screenWidth >= 768 && (
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sider 
            trigger={null} 
            collapsible 
            collapsed={collapsed}
            className="min-h-screen shadow-lg overflow-auto fixed left-0 top-0 bottom-0 z-10"
            style={{ height: '100vh' }}
            width={250}
          >
            <div className="p-4 flex items-center justify-center">
              <Link to="/">
                <img 
                  src="/logo.svg" 
                  alt="MOSIAC" 
                  className={`transition-all duration-300 ${collapsed ? 'w-12' : 'w-24'}`} 
                />
              </Link>
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              defaultSelectedKeys={['/admin']}
              items={menuItems.map(item => ({
                key: item.key,
                icon: item.icon,
                label: <Link to={item.key}>{item.label}</Link>,
              }))}
            />
          </Sider>
        </motion.div>
      )}
      
      <Layout className={screenWidth >= 768 ? (collapsed ? 'ml-[80px]' : 'ml-[250px]') : '0'}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Header className="p-0 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-4 h-16 sticky top-0 z-10">
            <div className="flex items-center">
              {screenWidth >= 768 ? (
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  className="text-lg"
                />
              ) : (
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setMobileMenuOpen(true)}
                  className="text-lg"
                />
              )}
              <h1 className="ml-4 text-xl font-semibold dark:text-white">
                {t('admin:header.title')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                type="primary" 
                icon={<HomeOutlined />} 
                onClick={() => navigate('/')}
                className="mr-2"
              >
                {screenWidth >= 768 ? t('admin:header.back_to_site') : ''}
              </Button>
              
              <Badge count={0} dot>
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  shape="circle"
                  className="flex items-center justify-center"
                />
              </Badge>
              
              {screenWidth >= 768 && <ThemeToggle />}
              
              {screenWidth >= 768 && <LanguageSelector />}
              
              <Dropdown menu={{ items: userMenuItems }}>
                <div className="cursor-pointer flex items-center">
                  <Avatar icon={<UserOutlined />} className="bg-primary" />
                  {screenWidth >= 768 && (
                    <span className="ml-2 dark:text-white">
                      {user?.fullName || 'Admin'}
                    </span>
                  )}
                </div>
              </Dropdown>
            </div>
          </Header>
        </motion.div>
        
        {/* Mobile menu drawer */}
        <Drawer
          title={
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img src="/logo.svg" alt="MOSIAC" className="h-8 w-auto mr-2" />
                <span className="text-xl font-semibold">{t('admin:header.title')}</span>
              </div>
              <Button 
                type="text" 
                icon={<CloseOutlined />} 
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>
          }
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          width={280}
        >
          <div className="flex flex-col h-full">
            <div className="flex-grow">
              <Menu
                mode="vertical"
                selectedKeys={[location.pathname]}
                items={menuItems.map(item => ({
                  key: item.key,
                  icon: item.icon,
                  label: (
                    <Link to={item.key} onClick={() => setMobileMenuOpen(false)}>
                      {item.label}
                    </Link>
                  ),
                }))}
              />
            </div>
            
            <div className="py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">{t('common:theme.title')}</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('common:language.title')}</span>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </Drawer>
        
        <Content className="m-4 md:m-6 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;