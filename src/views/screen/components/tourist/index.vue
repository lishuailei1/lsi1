<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">可预约总量<span>99999</span>人</p>
    </div>
    <div class="number">
      <span v-for="(item,index) in people" :key="index">{{ item }}</span>
    </div>
    <div ref="charts" class="charts"></div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import * as echarts from 'echarts'
import 'echarts-liquidfill'

const people = ref('216908人')
const charts = ref()
onMounted(() => {
  const myCharts = echarts.init(charts.value)
  myCharts.setOption({
    title: {
      text: '水球图'
    },
    xAxis: {},
    yAxis: {},
    series: {
      type: 'liquidFill',
      data: [0.6,0.4],
      radius:'100%'
    },
    grid:{
      left:0,
      top:0,
      right:0,
      bottom:0
    }
  })
})
</script>

<style lang="scss" scoped>
.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    margin-left: 20px;

    .title {
      color: white;
      font-size: 20px;

    }

    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 20px;
    }

    .right {
      float: right;
      font-size: 18px;
      color: white;

      span {
        color: orange;
        font-size: 16px;
      }
    }
  }

  .number {
    display: flex;
    padding: 10px;
    margin-top: 30px;

    span {
      height: 47px;
      line-height: 47px;
      flex: 1;
      background: url(../../images/total.png);
      color: #29fcff;
      text-align: center;
      font-size: 20px;
    }
  }
  .charts{
    width: 100%;
    height: 250px;
  }
}
</style>
