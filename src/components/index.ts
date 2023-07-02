// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'  //element全部图标
import Category from './Category/index.vue'
// 全局对象
const allGlobalComponent = { SvgIcon, Pagination ,Category}
// 对外暴露插件对象
export default {
  install(app) {
    // 注册项目全部的全局组件
    Object.keys(allGlobalComponent).forEach(key => {
      app.component(key, allGlobalComponent[key])
    });
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }

  }
}
