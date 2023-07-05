<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="重量(克)" type="number" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="(item, index) in attrArr" :key="item.id" :label="item.attrName">
          <el-select v-model="item.attrIdAndValueId">
            <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue, index) in item.attrValueList" :key="attrValue.id"
              :label="attrValue.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="(item, index) in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select v-model="item.saleIdAndValueId">
            <el-option :value="`${item.id}:${saleAttrValue.id}`" v-for="(saleAttrValue, index) in item.spuSaleAttrValueList" :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table :data="imgArr" border ref="table">
        <el-table-column align="center" type="selection" width="80px"></el-table-column>
        <el-table-column align="center" label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" style="width: 60px;height: 60px">
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" prop="imgName"></el-table-column>
        <el-table-column align="center" label="操作">
          <template #="{ row, $index }">
            <el-button type="danger" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reqAttr } from "@/api/product/attr";
import {reqSpuImageList, reqSpuHasSaleAttr, reqAddSku} from "@/api/product/spu";
import { reactive, ref } from "vue";
import type { SaleAttrResponseData, SpuHasImg, SaleAttr, SpuImg, SkuData } from "@/api/product/spu/type";
import type { AttrResponseData, Attr } from "@/api/product/attr/type";
import {ElMessage} from "element-plus";

//平台属性
const attrArr = ref<Attr[]>([])
//销售属性
const saleArr = ref<SaleAttr[]>([])
//照片数据
const imgArr = ref<SpuImg[]>([])
//收集sku参数
const skuParams = reactive<SkuData>({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
})
//获取table组件实例
const table =ref<any>()
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  //收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId=spu.id
  skuParams.tmId=spu.tmId
  //获取平台属性
  const res: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
  //获取对应的销售属性
  const res1: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id)
  //获取照片墙数据
  const res2: SpuHasImg = await reqSpuImageList(spu.id)

  attrArr.value = res.data  //平台属性
  saleArr.value = res1.data //销售属性
  imgArr.value = res2.data  //照片数据
}
//设置默认图片
const handler=(row:any)=>{
  //点击复选框按钮全部的图片不勾选
  imgArr.value.forEach((item:any)=>{
    table.value.toggleRowSelection(item,false)
  })
  table.value.toggleRowSelection(row,true)
  skuParams.skuDefaultImg=row.imgUrl  //收集图片地址
}
//保存
const save =async()=>{
  skuParams.skuAttrValueList= attrArr.value.reduce((prev:any,next:any)=>{
    if(next.attrIdAndValueId){
      let [attrId,valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId
      })
    }
    return prev
  },[])
  skuParams.skuSaleAttrValueList=saleArr.value.reduce((prev:any,next:any)=>{
    if(next.saleIdAndValueId){
      let [saleAttrId,saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId
      })
    }
    return prev
  },[])
  //添加sku请求
  const res:any = await reqAddSku(skuParams)
  if(res.code==200){
    ElMessage({
      type:'success',
      message:'添加成功'
    })
    $emit('changeScene',{flag:0,params:''})
  }else {
    ElMessage({
      type:'error',
      message:'添加失败'
    })
  }
}
//销售属性

const $emit = defineEmits(['changeScene'])
//取消按钮事件回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}
//当前子组件方法对外暴漏
defineExpose({ initSkuData })
</script>

<style lang="scss" scoped></style>
