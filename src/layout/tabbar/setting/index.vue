<template>
    <el-button size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
    <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
    <el-button size="small" icon="Setting" circle ></el-button>
    <img :src="userStore.avatar" style="width: 24px;height: 24px;margin: 0 10px;border-radius: 50%" >

    <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import useLayOutSettingStore from "../../../store/modules/settings";
import useUserStore from "../../../store/modules/user";
import {useRoute, useRouter} from "vue-router";
let userStore = useUserStore()
let LayOutSettingStore = useLayOutSettingStore()
const router = useRouter()
const route = useRoute()
// 点击刷新事件回调
const updateRefresh = () =>{
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
// 点击全屏事件回调
const fullScreen = () =>{
  //dom 对象的一个属性，判断当前是否为全屏模式，全屏：true，不是全屏：null
  let full = document.fullscreenElement
  if(!full){
    //切换全屏模式
    document.documentElement.requestFullscreen()
  }else{
    //退出全屏模式
    document.exitFullscreen()
  }
}
//退出登录
const logout =async () =>{
  await userStore.userLogOut()
  await router.push({path: '/login', query: {redirect: route.path}})
}

</script>
<style scoped lang="scss">

</style>
