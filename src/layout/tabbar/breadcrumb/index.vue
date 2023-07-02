<template>
    <el-icon style="margin-right: 10px" @click="changeIcon">
      <component :is="LayOutSettingStore.fold?'Fold':'Expand'"></component>
    </el-icon>
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="(item,index) in route.matched" :key="index" v-show="item.meta.title" :to="item.path">
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span style="vertical-align: top;margin: 5px">{{item.meta.title}}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import {ref} from "vue";
import useLayOutSettingStore from '@/store/modules/settings'
import {useRoute} from "vue-router";
let LayOutSettingStore = useLayOutSettingStore()
//获取路由对象
let route = useRoute()
const changeIcon = ()=>{
  LayOutSettingStore.fold=!LayOutSettingStore.fold
}
</script>

<style scoped lang="scss">

</style>
