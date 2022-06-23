import DefaultTheme from 'vitepress/theme'
import DarkModeImage from './DarkModeImage.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('DarkModeImage', DarkModeImage)
  }
}