<template>
  <el-button circle icon="Refresh" size="small" @click="updateRefresh"></el-button>
  <el-button circle icon="FullScreen" size="small" @click="fullScreen"></el-button>
  <el-popover :width="260" placement="bottom" title="主题设置" trigger="hover">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker @change="setColor" v-model="color" :predefine="predefineColors" size="small" show-alpha/>
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch @change="changeDark" v-model="dark" size="small" active-icon="Sunny" inactive-icon="Moon" inline-prompt/>
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button circle icon="Setting" size="small"></el-button>
    </template>
  </el-popover>
  <img :src="userStore.avatar" style="width: 24px;height: 24px;margin: 0 10px;border-radius: 50%">
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down/>
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import useLayOutSettingStore from "../../../store/modules/settings";
import useUserStore from "../../../store/modules/user";
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
const dark = ref<boolean>(false)  //收集开关的数据
let userStore = useUserStore()
let LayOutSettingStore = useLayOutSettingStore()
const router = useRouter()
const route = useRoute()
// 点击刷新事件回调
const updateRefresh = () => {
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
// 点击全屏事件回调
const fullScreen = () => {
  //dom 对象的一个属性，判断当前是否为全屏模式，全屏：true，不是全屏：null
  let full = document.fullscreenElement
  if (!full) {
    //切换全屏模式
    document.documentElement.requestFullscreen()
  } else {
    //退出全屏模式
    document.exitFullscreen()
  }
}
//退出登录
const logout = async () => {
  await userStore.userLogOut()
  await router.push({path: '/login', query: {redirect: route.path}})
}

//主题颜色
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
//switch开关暗黑模式切换
const changeDark = () =>{
  //获取html根节点
  const html = document.documentElement
  dark.value?html.className='dark':html.className=''
}
//主题颜色切换
const setColor = () =>{
  const html = document.documentElement;
  html.style.setProperty('--el-color-primary',color.value);
}
</script>
<style lang="scss" scoped>

</style>
