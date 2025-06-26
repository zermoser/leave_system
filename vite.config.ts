import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/leave_system/',
  server: {
    open: true,
    port: 3017
  }
});
