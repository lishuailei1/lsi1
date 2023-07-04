<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene==0">
        <el-button @click="addSpu" :disabled="categoryStore.c3Id?false:true" icon="Plus" type="primary">添加SPU</el-button>
        <el-table :data="records" border style="  margin: 10px 0">
          <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
          <el-table-column align="center" label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column align="center" label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="SPU操作">
            <template #="{row,$index}">
              <el-button @click="" icon="Plus" title="添加SKU" type="primary" @click="addSpu"></el-button>
              <el-button icon="Edit" title="修改SPU" type="warning" @click="updateSpu(row)"></el-button>
              <el-button icon="View" title="查看SKU列表" type="info"></el-button>
              <el-button icon="Delete" title="删除SPU" type="danger"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="pageNum"
            v-model:page-size="pageSize"
            :background="true"
            :page-sizes="[5, 10, 15, 20]"
            :total="total"
            layout="layout=prev,pager,next,jumper,->,sizes,total "
            @current-change="getHasSpu"
            @size-change="changeSize"
        />
      </div>
      <SpuForm ref="spu" v-show="scene==1" @changeScene="changeScene"></SpuForm>
      <SkuForm v-show="scene==2"></SkuForm>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import {ref, watch} from "vue";
import useCategoryStore from "@/store/modules/category";
import {reqHasSpu} from "@/api/product/spu";
import type {HasSpuResponseData, Records} from '@/api/product/spu/type'
import type {SpuData} from '@/api/product/spu/type'
const categoryStore = useCategoryStore()
const scene = ref<number>(0)
const pageNum = ref<number>(1)  //分页器默认页码
const pageSize = ref<number>(5)  //每页展示数据
const records = ref<Records>([])  //存储已有spu数据
const total = ref<number>(0)
//获取子组件实例Spu
const spu = ref<any>()
//监听三级分类id的变化
watch(() => categoryStore.c3Id, () => {
  if (!categoryStore.c3Id) return
  getHasSpu()
})
//获取三级分类下的spu
const getHasSpu = async (pages = 1) => {
  pageNum.value = pages
  const res: HasSpuResponseData = await reqHasSpu(pageNum.value, pageSize.value, categoryStore.c3Id)
  if (res.code === 200) {
    records.value = res.data.records
    total.value = res.data.total
  }
}
//分页器下拉菜单
const changeSize = () => {
  getHasSpu()
}
//添加sup
const addSpu = () => {
  scene.value = 1
  spu.value.initAddSpu(categoryStore.c3Id)
}
//修改spu
const updateSpu =(row:SpuData)=>{
  scene.value = 1
  spu.value.initHasSpuData(row)

}
//子组件绑定自定义事件
const changeScene = (obj:any) => {
  scene.value = obj.flag
  if(obj.params=='update'){
    getHasSpu(pageNum.value)
  }else {
    getHasSpu()
  }
}
</script>
<style lang="scss" scoped>

</style>
