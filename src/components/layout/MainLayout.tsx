import React, { ReactNode, useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Drawer } from 'antd';
import { 
  UserOutlined, 
  MenuOutlined, 
  HeartOutlined,
  SearchOutlined,
  CloseOutlined,
  HomeOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ReadOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSelector from '../common/LanguageSelector';
import CartButton from  '@/components/cart/CardButton';
import { MenuProps } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '@/types/auth.types';

const { Header, Content, Footer } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Listen for scroll events to apply header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { key: '/', label: t('nav.home'), icon: <HomeOutlined /> },
    { key: '/products', label: t('nav.products'), icon: <AppstoreOutlined /> },
    { key: '/regions', label: t('nav.regions'), icon: <EnvironmentOutlined /> },
    { key: '/about', label: t('nav.about'), icon: <InfoCircleOutlined /> },
    { key: '/blog', label: t('nav.blog'), icon: <ReadOutlined /> },
    { key: '/contact', label: t('nav.contact'), icon: <PhoneOutlined /> },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: <Link to="/profile">{t('nav.profile')}</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'orders',
      label: <Link to="/orders">{t('nav.orders')}</Link>,
      icon: <ShoppingCartOutlined />,
    },
    {
      key: 'wishlist',
      label: <Link to="/wishlist">{t('nav.wishlist')}</Link>,
      icon: <HeartOutlined />,
    },
    {
      key: 'logout',
      label: <span onClick={handleLogout}>{t('actions.logout')}</span>,
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

  // Search panel animation
  const searchVariants = {
    closed: { 
      opacity: 0, 
      y: '-100%',
      transition: { duration: 0.3 }
    },
    open: { 
      opacity: 1, 
      y: '0%',
      transition: { duration: 0.4 }
    }
  };

  return (
    <Layout className="min-h-screen">
      {/* Header - changes style on scroll */}
      <Header 
        className={`px-4 md:px-6 fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white dark:bg-gray-900 shadow-md py-2' 
            : 'bg-transparent dark:bg-transparent py-4'
        }`}
        style={{ padding: 0, height: 'auto' }}
      >
        <div className="container mx-auto flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center mr-6">
              <img 
                src="/logo.svg" 
                alt="MOSIAC" 
                className={`h-8 w-auto mr-2 transition-all duration-300 ${scrolled ? 'opacity-100' : 'opacity-80'}`}
              />
              <span className={`hidden md:inline text-xl font-bold transition-colors duration-300 ${
                scrolled 
                  ? 'text-primary dark:text-white' 
                  : 'text-white dark:text-white'
              }`}>
              </span>
            </Link>
            
            <div className="hidden lg:block">
              <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                className={`border-none transition-colors duration-300 ${
                  scrolled 
                    ? 'bg-transparent text-gray-800 dark:text-white' 
                    : 'bg-transparent text-white dark:text-gray-200'
                }`}
                items={navItems.map(item => ({
                  key: item.key,
                  label: <Link to={item.key}>{item.label}</Link>,
                  className: scrolled 
                    ? 'hover:text-primary dark:hover:text-primary' 
                    : 'hover:text-gray-300 dark:hover:text-gray-300'
                }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`transition-colors duration-300 ${
              scrolled 
                ? 'text-gray-800 dark:text-white' 
                : 'text-white dark:text-gray-200'
            }`}>
              <Button 
                type="text" 
                icon={<SearchOutlined className="text-xl" />} 
                onClick={() => setSearchOpen(true)}
                className={`hover:bg-transparent ${
                  scrolled 
                    ? 'hover:text-primary dark:hover:text-primary' 
                    : 'hover:text-gray-300 dark:hover:text-gray-300'
                }`}
              />
            </div>
            
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            
            <div className="hidden md:block">
              <LanguageSelector />
            </div>
            
            {/* Cart Button */}
            <CartButton 
              className={scrolled 
                ? 'text-gray-800 dark:text-white hover:text-primary dark:hover:text-primary' 
                : 'text-white dark:text-gray-200 hover:text-gray-300 dark:hover:text-gray-300'
              } 
            />

            {isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <div className="cursor-pointer flex items-center">
                  <Avatar size="small" icon={<UserOutlined />} className="bg-primary" />
                  <span className={`ml-2 hidden md:inline transition-colors duration-300 ${
                    scrolled 
                      ? 'text-gray-800 dark:text-white' 
                      : 'text-white dark:text-gray-200'
                  }`}>
                    {user?.fullName}
                  </span>
                </div>
              </Dropdown>
            ) : (
              <Link to="/login">
                <Button 
                  type={scrolled ? "primary" : "default"} 
                  className={!scrolled ? "text-white border-white hover:text-gray-300 hover:border-gray-300" : ""}
                >
                  {t('actions.login')}
                </Button>
              </Link>
            )}

            <div className="block lg:hidden">
              <Button 
                type="text" 
                icon={<MenuOutlined className="text-xl" />} 
                onClick={() => setMobileMenuOpen(true)}
                className={`hover:bg-transparent ${
                  scrolled 
                    ? 'text-gray-800 dark:text-white hover:text-primary dark:hover:text-primary' 
                    : 'text-white dark:text-gray-200 hover:text-gray-300 dark:hover:text-gray-300'
                }`}
              />
            </div>
          </div>
        </div>
      </Header>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="/logo.svg" alt="MOSIAC" className="h-8 w-auto mr-2" />
            </div>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <Menu
              mode="vertical"
              selectedKeys={[location.pathname]}
              className="border-none"
              items={navItems.map(item => ({
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
              <span className="text-sm font-medium">{t('theme.title')}</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('language.title')}</span>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </Drawer>
      
      {/* Search Panel */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            className="fixed inset-0 bg-white dark:bg-gray-900 z-50 p-4 flex flex-col"
            initial="closed"
            animate="open"
            exit="closed"
            variants={searchVariants}
          >
            <div className="container mx-auto pt-16 pb-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {t('search.title')}
                </h2>
                <Button 
                  type="text" 
                  icon={<CloseOutlined className="text-xl" />} 
                  onClick={() => setSearchOpen(false)}
                  className="text-gray-800 dark:text-white hover:text-primary dark:hover:text-primary"
                />
              </div>
              
              <div className="relative mb-8">
                <input 
                  type="text" 
                  placeholder={t('search.placeholder')}
                  className="w-full py-3 px-4 pr-12 border-b-2 border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:border-primary dark:focus:border-primary text-gray-800 dark:text-white"
                  autoFocus
                />
                <SearchOutlined className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xl" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
                  {t('search.recent')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button className="border-gray-300 dark:border-gray-700 dark:text-gray-300">
                    Ao Dai
                  </Button>
                  <Button className="border-gray-300 dark:border-gray-700 dark:text-gray-300">
                    Summer Collection
                  </Button>
                  <Button className="border-gray-300 dark:border-gray-700 dark:text-gray-300">
                    Handmade Crafts
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <Content className="pt-16">
        <div className="min-h-screen">
          {children}
        </div>
      </Content>

      {/* Footer */}
      <Footer className="bg-gray-100 dark:bg-gray-900 dark:text-gray-400 pt-16 pb-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-4">
                <img src="/logo.svg" alt="MOSIAC" className="h-8 w-auto mr-2" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('footer.description')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{t('footer.shop')}</h3>
              <ul className="space-y-2">
                <li><Link to="/products/new" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('nav.new_arrivals')}</Link></li>
                <li><Link to="/products/bestsellers" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('nav.bestsellers')}</Link></li>
                <li><Link to="/products/sale" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('nav.sale')}</Link></li>
                <li><Link to="/products/womens" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('product:categories.womens')}</Link></li>
                <li><Link to="/products/mens" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('product:categories.mens')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{t('footer.about')}</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('nav.about')}</Link></li>
                <li><Link to="/our-story" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('nav.our_story')}</Link></li>
                <li><Link to="/artisans" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('nav.artisans')}</Link></li>
                <li><Link to="/sustainability" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('nav.sustainability')}</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('nav.contact')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{t('footer.customer_service')}</h3>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('nav.faq')}</Link></li>
                <li><Link to="/shipping" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('nav.shipping')}</Link></li>
                <li><Link to="/returns" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('nav.returns')}</Link></li>
                <li><Link to="/size-guide" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('nav.size_guide')}</Link></li>
                <li><Link to="/privacy-policy" className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">{t('nav.privacy_policy')}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} MOSIAC. {t('footer.rights')}
              </p>
              <div className="flex space-x-4">
                <Link to="/terms" className="text-sm text-gray-500 hover:text-primary dark:text-gray-500 dark:hover:text-primary">{t('footer.terms')}</Link>
                <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary dark:text-gray-500 dark:hover:text-primary">{t('footer.privacy')}</Link>
                <Link to="/cookies" className="text-sm text-gray-500 hover:text-primary dark:text-gray-500 dark:hover:text-primary">{t('footer.cookies')}</Link>
              </div>
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default MainLayout;