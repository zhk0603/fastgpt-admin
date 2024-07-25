import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// 加载 .env 文件中的环境变量
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/admin'
  // resolve: {
  //   alias: {
  //     '@tushan': path.resolve(__dirname, './tushan')
  //   }
  // }
});
