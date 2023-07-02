<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag"/>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import useLayOutSettingStore from "../../store/modules/settings";
import {watch, ref, nextTick} from "vue";
let LayOutSettingStore = useLayOutSettingStore()
let flag = ref(true)  //控制组件刷新是否销毁重建
watch(()=>LayOutSettingStore.refresh,()=>{
  flag.value = false  //点击刷新路由组件销毁
  nextTick(()=>{
    flag.value = true
  })
})
</script>

<style scoped lang="scss">
.fade-enter-from{
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active{
  transition: all 1s;
}
.fade-enter-to{
  opacity: 1;
  transform: scale(1);
}
</style>
