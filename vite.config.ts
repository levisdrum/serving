import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const ghPagesBase = repoName ? `/${repoName}/` : '/';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? ghPagesBase : '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          const segments = id.split('node_modules/');
          const afterNodeModules = segments[segments.length - 1];
          if (!afterNodeModules) return 'vendor';
          const parts = afterNodeModules.split('/');
          const packageName = parts[0].startsWith('@') ? `${parts[0]}-${parts[1]}` : parts[0];
          if (packageName === 'client-only') return undefined;
          return `vendor-${packageName.replace('@', '').replace('/', '-')}`;
        }
      }
    }
  }
});
