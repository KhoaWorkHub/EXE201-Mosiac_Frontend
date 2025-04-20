import React, { ReactNode } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd';
import { ShoppingCartOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSelector from '../common/LanguageSelector';
import { MenuProps } from 'antd';

const { Header, Content, Footer } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { key: '/', label: t('nav.home') },
    { key: '/products', label: t('nav.products') },
    { key: '/regions', label: t('nav.regions') },
    { key: '/about', label: t('nav.about') },
    { key: '/contact', label: t('nav.contact') },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: <Link to="/profile">{t('nav.profile')}</Link>,
    },
    {
      key: 'orders',
      label: <Link to="/orders">{t('nav.orders')}</Link>,
    },
    {
      key: 'logout',
      label: <span onClick={handleLogout}>{t('actions.logout')}</span>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white dark:bg-gray-900 px-4 md:px-6 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-6">
            <img src="/logo.svg" alt="MOSIAC" className="h-8 w-auto mr-2" />
            <span className="hidden md:inline text-xl font-bold text-primary dark:text-white">
              MOSIAC
            </span>
          </Link>
          
          <div className="hidden md:block">
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              className="border-none bg-transparent"
              items={navItems.map(item => ({
                key: item.key,
                label: <Link to={item.key}>{item.label}</Link>,
              }))}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <LanguageSelector />
          
          <Link to="/cart">
            <Badge count={0} showZero={false}>
              <ShoppingCartOutlined className="text-xl" />
            </Badge>
          </Link>

          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="cursor-pointer flex items-center">
                <Avatar size="small" icon={<UserOutlined />} />
                <span className="ml-2 hidden md:inline">{user?.fullName}</span>
              </div>
            </Dropdown>
          ) : (
            <Link to="/login" className="text-sm font-medium">
              {t('actions.login')}
            </Link>
          )}

          <div className="block md:hidden">
            <Dropdown
              menu={{ 
                items: navItems.map(item => ({
                  key: item.key, 
                  label: <Link to={item.key}>{item.label}</Link>
                }))
              }}
              trigger={['click']}
            >
              <MenuOutlined className="text-lg" />
            </Dropdown>
          </div>
        </div>
      </Header>

      <Content>
        <div className="site-layout-content">
          {children}
        </div>
      </Content>

      <Footer className="text-center py-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
        <div className="container mx-auto">
          <div className="mb-4">
            <Link to="/" className="mr-4 text-gray-600 dark:text-gray-400 hover:text-primary">
              {t('nav.home')}
            </Link>
            <Link to="/products" className="mr-4 text-gray-600 dark:text-gray-400 hover:text-primary">
              {t('nav.products')}
            </Link>
            <Link to="/about" className="mr-4 text-gray-600 dark:text-gray-400 hover:text-primary">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary">
              {t('nav.contact')}
            </Link>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} MOSIAC. {t('footer.rights')}
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;