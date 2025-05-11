import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider, theme } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from './store';
import AppRoutes from './routes';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { CartProvider, useCart } from './contexts/CartContext';
import CartNotification from '@/components/cart/CartNotfication';
import './locales/i18n';
import './index.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Antd config provider wrapper with theme
const AntdConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme: currentTheme } = useTheme();
  
  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#005c4e',
          borderRadius: 8,
          // Adjust other token values as needed
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

const GlobalCartNotification: React.FC = () => {
  const { lastAddedProduct, lastAddedQuantity, resetLastAdded } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  
  useEffect(() => {
    if (lastAddedProduct) {
      setShowNotification(true);
    }
  }, [lastAddedProduct]);
  
  const handleClose = () => {
    setShowNotification(false);
    resetLastAdded();
  };
  
  return (
    <CartNotification 
      open={showNotification}
      onClose={handleClose}
      product={lastAddedProduct}
      quantity={lastAddedQuantity}
    />
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <AntdConfigProvider>
              <CartProvider>
                <AppRoutes />
                <GlobalCartNotification />
              </CartProvider>
            </AntdConfigProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;