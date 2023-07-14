<template>
  <div class="container">
    <div ref="screen" class="screen">
      <div class="top">
        <Top/>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"/>
          <Sex class="sex"/>
          <Age class="age"/>
        </div>
        <div class="center">
          <Map class="map"/>
          <Line class="line"/>
        </div>
        <div class="right">右</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Top from './components/top/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
import Tourist from './components/tourist/index.vue'
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
import {onMounted, ref} from "vue";
//获取数据大屏展示内容盒子的dom元素
const screen = ref()
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`

})

//定义大屏缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w;
  const wh = window.innerHeight / h;
  return ww < wh ? ww : wh;
}
//监听视口变化
window.onresize = () =>{
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;

  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    .top{
      width: 100%;
      height: 40px;
    }
    .bottom{
      display: flex;
      .left{
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;
        .tourist{
          flex: 1.1;
        }
        .sex{
          flex: 1;
          background-color: #8c939d;
        }
        .age{
          flex: 1;
          background-color: white;
        }
      }
      .right{
        flex: 1;
      }
      .center{
        flex: 2;
        display: flex;
        flex-direction: column;
        .map{
          flex: 3;

        }
        .line{
          flex: 1;

        }
      }
    }
  }
}
</style>
