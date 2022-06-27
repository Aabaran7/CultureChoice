/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd()+"/env/", ''), ...loadEnv('deploy', process.cwd()+"/env/", ''), ...loadEnv('git', process.cwd()+"/env/", '')};

  // import.meta.env.VITE_NAME available here with: process.env.VITE_NAME
  // import.meta.env.VITE_PORT available here with: process.env.VITE_PORT
  return defineConfig({
      plugins: [vue()],
      envDir: 'env',
      base: process.env.VITE_DEPLOY_BASE_PATH,
      server: {
        port: process.env.VITE_DEV_PORT_NUM,
        strictPort: true
      },
      test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
          reporter: ['text', 'json', 'html'],
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
  });
}
