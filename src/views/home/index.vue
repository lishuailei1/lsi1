<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" class="avatar">
      <h1>{{getTime()}}{{userStore.username}}!</h1>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import useUserStore from "@/store/modules/user.ts";
import {getTime} from "@/utils/time.ts";

const userStore= useUserStore()
</script>
<style scoped lang="scss">
.box{
  display: flex;
  align-items: center;
  font-size: 25px;
  .avatar{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>
