// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@admin': path.resolve(__dirname, 'src/admin')
        },
    },
    server: {
        port: 5173,
        proxy: {
            // Proxy rõ ràng cho API endpoint đăng nhập
            '/auth/login': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/auth': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            },
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            // Chỉ proxy authorization URL, không proxy redirect
            '/oauth2/authorization': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            }
        },
    }
});
