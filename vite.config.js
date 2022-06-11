import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd()+"/env/", ''), ...loadEnv('deploy', process.cwd()+"/env/", '')};

  // import.meta.env.VITE_NAME available here with: process.env.VITE_NAME
  // import.meta.env.VITE_PORT available here with: process.env.VITE_PORT
  //console.log(process.env)
  return defineConfig({
      plugins: [vue()],
      envDir: 'env',
      base: process.env.EXP_DEPLOY_BASE_PATH + '/' + process.env.VITE_PROJECT_NAME + '/'
  });
}
