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
              <el-button  icon="Plus" title="添加SKU" type="primary" @click="addSku(row)"></el-button>
              <el-button icon="Edit" title="修改SPU" type="warning" @click="updateSpu(row)"></el-button>
              <el-button icon="View" title="查看SKU列表" type="info" @click="findSku(row)"></el-button>
              <el-popconfirm :title="`确定删除${row.spuName}?`" width="200px" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button icon="Delete" title="删除SPU" type="danger"></el-button>
                </template>
              </el-popconfirm>

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
      <SkuForm ref="sku" v-show="scene==2" @changeScene="changeScene"></SkuForm>
<!--      dialog对话框-->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{row,$index}">
              <img :src="row.skuDefaultImg" style="width: 100px;height: 100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import {onBeforeUnmount, ref, watch} from "vue";
import useCategoryStore from "@/store/modules/category";
import {reqHasSpu, reqSkuList,reqRemoveSpu} from "@/api/product/spu";
import type {HasSpuResponseData, Records,SkuData} from '@/api/product/spu/type'
import type {SpuData,SkuInfoData } from '@/api/product/spu/type'
import {ElMessage} from "element-plus";
const categoryStore = useCategoryStore()
const scene = ref<number>(0)
const pageNum = ref<number>(1)  //分页器默认页码
const pageSize = ref<number>(5)  //每页展示数据
const records = ref<Records>([])  //存储已有spu数据
const skuArr =ref<SkuData[]>([])  //存储全部sku数据
const total = ref<number>(0)
const show = ref<boolean>(false)
//获取子组件实例Spu
const spu = ref<any>()
//获取子组件实例sku
const sku = ref<any>()
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
//添加sku
const addSku =(row:SpuData)=>{
  scene.value=2
  sku.value.initSkuData(categoryStore.c1Id,categoryStore.c2Id,row)
}
//查看sku列表
const findSku =async (row:SpuData) => {

  const res:SkuInfoData = await reqSkuList(row.id)
  if(res.code==200){
    show.value=true
    skuArr.value = res.data
  }
}
//删除spu
const deleteSpu=async (row: SpuData) => {
  const res:any = await reqRemoveSpu(row.id)
  if(res.code==200){
    ElMessage({
      type:'success',
      message:'删除成功'
    })
    await getHasSpu(records.value.length>1?pageNum.value:pageNum.value-1)
  }else {
    ElMessage({
      type:'error',
      message:'删除失败'
    })
  }
}
onBeforeUnmount(()=>{
  categoryStore.$reset()
})
</script>
<style lang="scss" scoped>

</style>
