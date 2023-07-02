import { createApp } from 'vue'
import '@/style/index.scss'
import 'virtual:svg-icons-register'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-ignore
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
// 引入自定义插件对象 注册整个项目的全局组件
import globalComponent from './components'
import router from './router'
import pinia from './store'
import './permisstons'
const app = createApp(App)
app.use(router)
app.use(pinia);
app.use(ElementPlus,{
  locale: zhCn,
})
// 安装自定义插件
app.use(globalComponent)
app.mount('#app')
