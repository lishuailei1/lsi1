<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id?false:true">添加SPU</el-button>
      <el-table border style="margin: 10px 0" :data="records">
        <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
        <el-table-column prop="spuName" label="SPU名称" align="center"></el-table-column>
        <el-table-column prop="description" label="SPU描述" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="SPU操作" align="center">
          <template #="{row,$index}">
            <el-button type="primary" icon="Plus" title="添加SKU"></el-button>
            <el-button type="warning" icon="Edit" title="修改SPU"></el-button>
            <el-button type="info" icon="View" title="查看SKU列表"></el-button>
            <el-button type="danger" icon="Delete" title="删除SPU"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          :background="true"
          layout="layout=prev,pager,next,jumper,->,sizes,total "
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import useCategoryStore from "@/store/modules/category";
import {reqHasSpu} from "@/api/product/spu";
import type {HasSpuResponseData,Records} from '@/api/product/spu/type'
const categoryStore = useCategoryStore()
const scene = ref<number>(0)
const pageNum = ref<number>(1)  //分页器默认页码
const pageSize = ref<number>(5)  //每页展示数据
const records = ref<Records>([])  //存储已有spu数据
const total = ref<number>(0)
//监听三级分类id的变化
watch(()=>categoryStore.c3Id,() => {
  if(!categoryStore.c3Id) return
  getHasSpu()
})
//获取三级分类下的spu
const getHasSpu = async(pages=1) =>{
  pageNum.value=pages
  const res:HasSpuResponseData = await reqHasSpu(pageNum.value,pageSize.value,categoryStore.c3Id)
  if(res.code == 200){
    records.value=res.data.records
    total.value=res.data.total
  }
}
//分页器下拉菜单
const changeSize =() =>{
  getHasSpu()
}
</script>
<style scoped lang="scss">

</style>
