
<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="">
    <p>{{setting.title}}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '../../setting'
</script>
<style scoped lang="scss">
$base-menu-logo-height:50px;
$base-logo-title-fontSize:20px;
.logo{
  display: flex;
  align-items: center;
  width: 100%;
  height: $base-menu-logo-height;
  //color: #333;
  padding:0 10px;
  img{
    width: 35px;
    height: 35px;
  }
  p{
    font-size: $base-logo-title-fontSize;
    margin-left: 25px;
    white-space: nowrap;
  }
}
</style>
