import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import path from 'path';

// ✅ Ensure we explicitly export the Vite config object
export const viteConfigObj = {
  plugins: [viteReact()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'), // Alias for imports like `@/components`
    },
  },
};

export default defineConfig(viteConfigObj);
