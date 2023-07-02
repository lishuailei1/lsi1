
<template>
  <div class="layout_container">
<!--    左侧菜单-->
    <div class="layout_slider"  style="white-space: nowrap">
      <Logo></Logo>
<!--    展示菜单-->
      <el-scrollbar  class="scrollbar">
        <el-menu :default-active="route.path"
                  style="border-right: none" background-color="#ffffff" text-color="#303133"
                  :collapse="LayOutSettingStore.fold?true:false"
                  :collapse-transition="false"
                 >
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
<!--    顶部导航-->
    <div class="layout_tabbar" :class="{fold:LayOutSettingStore.fold?true:false}">
      <Tabbar></Tabbar>
    </div>
<!--    内容区-->
    <div class="layout_main" :class="{fold:LayOutSettingStore.fold?true:false}">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'  // 引入logo组件
import  Menu from './menu/index.vue'  // 引入菜单组件
import Tabbar from './tabbar/index.vue' //引入顶部tabbar
import useUserStore from "../store/modules/user";
import Main from '@/layout/main/index.vue'
import useLayOutSettingStore from "../store/modules/settings";
import {useRoute} from "vue-router";
let userStore = useUserStore()
let LayOutSettingStore = useLayOutSettingStore()
const route = useRoute()
</script>
<style scoped lang="scss">
$base-menu-width:260px;
$base-menu-background:#001529;
$base-tabbar-height:50px;
$base-menu-logo-height:50px;
$base-menu-min-width:50px;
.layout_container{
  width: 100%;
  height: 100vh;
  .layout_slider{
    width:$base-menu-width;
    height: 100vh;
    color: #fff;
    background-color: #fff;
    transition: all .3s;
    .scrollbar{
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);
    }
    &.fold{
      width: $base-menu-min-width;
    }
  }
  .layout_tabbar{
    position: fixed;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    transition: all .3s;
    &.fold{
      width:calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main{
    position: absolute;
    left: $base-menu-width;
    top:  $base-tabbar-height;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    padding: 20px;
    overflow: auto;
    background-color: #fcfcfc;
    transition: all .3s;
    &.fold{
      width:calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
