import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main:           path.resolve(__dirname, 'index.html'),
          privacyPolicy:  path.resolve(__dirname, 'privacy-policy.html'),
          termsOfService: path.resolve(__dirname, 'terms-of-service.html'),
          blogIndex:      path.resolve(__dirname, 'blog/index.html'),
          blogPost1:      path.resolve(__dirname, 'blog/manfaat-les-musik-untuk-anak.html'),
          blogTemplate:   path.resolve(__dirname, 'blog/post-template.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
