import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './styles/theme.css'
import App from './App.vue'
import router from './router/index.js'
import { i18n } from './locales/index.js'

const app = createApp(App)

app.use(ElementPlus)
for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, component)
}
app.use(i18n)
app.use(router)
app.mount('#app')
