import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import progress from 'vite-plugin-progress'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), progress()]
})
