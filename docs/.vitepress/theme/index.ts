import DefaultTheme from 'vitepress/theme'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '../../../src/style.css' // Global styles from main repo
import MyLayout from './MyLayout.vue'
import GsapScrollImgs from '../components/GsapScrollImgs.vue'
import GsapText from '../components/GsapText.vue'
import { createI18n } from 'vue-i18n'
import en from '../../../src/locales/en.json'
import zh from '../../../src/locales/zh.json'

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app }) {
    const pinia = createPinia()
    
    // Configure i18n for VitePress
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      fallbackLocale: 'en',
      messages: {
        en,
        zh
      }
    })
    
    app.use(pinia)
    app.use(i18n)
    app.use(ElementPlus)
    app.component('GsapScrollImgs', GsapScrollImgs)
    app.component('GsapText', GsapText)
  }
}
