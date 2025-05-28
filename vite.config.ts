import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Always use EC2 endpoint for testing
  const apiEndpoint = 'http://54.169.96.88'; // Remove mode-based switching for now
  //const apiEndpoint = 'http://localhost:8080'; // For local development

  console.log(`Using API endpoint: ${apiEndpoint} in ${mode} mode`);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@admin': path.resolve(__dirname, 'src/admin'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiEndpoint,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^/, ''), // Remove /api prefix
        },
        '/auth': {
          target: apiEndpoint,
          changeOrigin: true,
          secure: false,
        },
        '/oauth2/authorization': {
          target: apiEndpoint,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});