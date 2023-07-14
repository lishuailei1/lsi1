<template>
<div class="box4" ref="map">

</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import chinaJson from './china.json'
import {onMounted, ref} from "vue";
const map = ref()
echarts.registerMap('china',chinaJson)
onMounted(()=>{
  let myChart = echarts.init(map.value)
  myChart.setOption({
    geo:{
      map:'china',
      roam:true,
      left:50,
      right:50,
      bottom:0,
      top:50,
      label:{
        show:true,
        color:'white',
        fontSize:12
      },
      itemStyle:{
        color:{
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#237' // 0% 处的颜色
          }, {
            offset: 1, color: '#491' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      opacity:.8

    },
    series:[
      {
        type:'lines',
        data:[
          {
            coords:[
                [ 116.405285, 39.904989],
                [ 121.472644,31.231706]
            ],
            lineStyle:{
              color:'pink',
              width:3,
              type:'dotted'
            }

          },
          {
            coords:[
              [ 119.306239,26.075302],
              [  106.278179, 38.46637]
            ],
            lineStyle:{
              color:'white',
              width:3,
              type:'dashed'
            }

          }
        ],
        effect:{
          show:true,
          symbol:'pin',
          color:'red',
          symbolSize:10
        }
      }
    ]




  })

})

</script>

<style scoped lang="scss">

</style>
