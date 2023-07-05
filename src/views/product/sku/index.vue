<template>
  <el-card>
    <el-table border style="margin: 10px 0" :data="skuArr">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column prop="skuName" label="名称"  align="center" show-overflow-tooltip width="200px"></el-table-column>
      <el-table-column prop="skuDesc" label="描述"  align="center" show-overflow-tooltip width="300px"></el-table-column>
      <el-table-column label="默认图片"  align="center" width="150px">
        <template #="{row,$index}">
          <img :src="row.skuDefaultImg" width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(g)" align="center" width="150px"></el-table-column>
      <el-table-column prop="price" label="价格" align="center" width="150px"></el-table-column>
      <el-table-column label="操作"  align="center" width="250px" fixed="right">
        <template #="{row,$index}">
          <el-button type="primary" size="small" icon="Top"></el-button>
          <el-button type="warning" size="small" icon="Edit"></el-button>
          <el-button type="info" size="small" icon="InfoFilled"></el-button>
          <el-button type="danger" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout="prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="getHasSku"
        @size-change="handler"
    />
  </el-card>

</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {reqSkuList} from "@/api/product/sku";
import type {SkuResponseData,SkuData} from "@/api/product/sku/type";

const pageNum =ref<number>(1)  //分页器当前页码
const pageSize = ref<number>(10 )//分页器默认每页展示数据
const total = ref<number>(0)
const skuArr = ref<SkuData[]>([])
const getHasSku=async (pages=1) => {
  //当前分页器页码
  pageNum.value=pages
  const res:SkuResponseData = await reqSkuList(pageNum.value,pageSize.value)
  if(res.code==200){
    total.value=res.data.total
    skuArr.value=res.data.records
  }
}
//分页器下拉菜单
const handler=(pageSize:number)=>{
  getHasSku()
}
onMounted(()=>{
  getHasSku()
})
</script>

<style scoped lang="scss">

</style>
