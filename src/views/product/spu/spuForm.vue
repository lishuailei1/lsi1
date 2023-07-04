<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input v-model="SpuParams.spuName" placeholder="请输入SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option v-for="(item,index) in AllTradeMark" :key="item.id" :label="item.tmName"
                   :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input v-model="SpuParams.description" placeholder="请输入描述" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
          v-model:file-list="ImgList"
          :before-upload='handlerUpload'
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          action="/api//admin/product/fileUpload"
          list-type="picture-card"
      >
        <el-icon>
          <Plus/>
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%;height: 100%" w-full/>
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select v-model="saleAttrIdAndValueName"
                 :placeholder="unSelectSaleAttr.length?`还未选择${unSelectSaleAttr.length}个`:`  无`">
        <el-option v-for="(item,index) in unSelectSaleAttr" :key="item.id" :label="item.name"
                   :value="`${item.id}:${item.name}`"></el-option>
      </el-select>
      <el-button :disabled="saleAttrIdAndValueName?false:true" icon="Plus" style="margin-left: 10px"
                 type="primary" @click="addSaleAttr">添加属性
      </el-button>
      <el-table :data="saleAttr" border style="margin: 10px 0">
        <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
        <el-table-column align="center" label="属性名" prop="saleAttrName" width="100px"></el-table-column>
        <el-table-column align="center" label="属性值">
          <template #="{row,$index}">
            <el-tag @close="row.spuSaleAttrValueList.splice(index,1)" v-for="(item,index) in row.spuSaleAttrValueList" :key="row.id" class="mx-1"
                    closable style="margin-right: 5px">{{ item.saleAttrValueName }}
            </el-tag>
            <el-input v-model="row.saleAttrValue" @blur="toLook(row)" v-if="row.flag==true" placeholder="请输入属性值" size="small" style="width: 100px"></el-input>
            <el-button v-else @click="toEdit(row)" icon="Plus" size="small" type="primary"></el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100px">
          <template #="{row,$index}">
            <el-button icon="Delete" size="small" type="danger" @click="saleAttr.splice($index,1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save" :disabled="saleAttr.length>0?false:true">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>

</template>

<script lang="ts" setup>
import type {
  HasSaleAttr,
  SaleAttr,
  SpuImg,
  SpuData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  TradeMark,
  SaleAttrValue
} from '@/api/product/spu/type'
import {reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr,reqAddOrUpdateSpu} from '@/api/product/spu'
import {computed, ref} from "vue";
import {ElMessage} from "element-plus";

//存储已有spu数据
const AllTradeMark = ref<TradeMark[]>([])
//商品图片
const ImgList = ref<SpuImg[]>([])
//spu销售属性
const saleAttr = ref<SaleAttr[]>([])
//全部销售属性
const allSaleAttr = ref<HasSaleAttr[]>([])
//控制对话框的显示隐藏
const dialogVisible = ref<boolean>(false)
// 存储预览图片地址
//收集还未选择的销售属性的ID与名字
const saleAttrIdAndValueName = ref<string>('')
const dialogImageUrl = ref<string>('')
//存储已有spu对象
const SpuParams = ref<SpuData>({
  category3Id: '',  //三级分类id
  description: "",  //spu描述
  spuName: "",      //spu的名字
  tmId: '',         //品牌ID
  spuImageList: [],
  spuSaleAttrList: [],
})
const $emit = defineEmits(['changeScene'])
//点击取消按钮，通知父组件切换场景为1，展示已有的spu数据
const cancel = () => {
  $emit('changeScene', {flag:0,params:'update'})
}
const initHasSpuData = async (spu: SpuData) => {
  //存储已有spu对象
  SpuParams.value = spu
  //获取全部品牌数据
  const res: AllTradeMark = await reqAllTradeMark()
  //获取商品图片
  const res1: SpuHasImg = await reqSpuImageList(spu.id)
  //获取spu销售属性
  const res2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id)
  //获取所有销售属性
  const res3: HasSaleAttrResponseData = await reqAllSaleAttr()
  //存储所有品牌数据
  AllTradeMark.value = res.data
  //图片数据
  ImgList.value = res1.data.map(item => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  //已有spu销售属性
  saleAttr.value = res2.data
  //全部销售属性
  allSaleAttr.value = res3.data
}
//照片墙点击预览
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
//照片墙删除图片
const handleRemove = () => {

}
//图片上传成功之前的钩子
const handlerUpload = (file: any) => {
  if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
    return true
  } else {
    return false
  }
}
//计算当前spu为用有的销售属性
const unSelectSaleAttr = computed(() => {
  const unSelectArr = allSaleAttr.value.filter(item => {
    return saleAttr.value.every(item1 => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})
//添加销售属性
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  let newSaleAttr:SaleAttr = {
    createTime: null,
    spuId: 0,
    updateTime: null,
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  saleAttr.value.push(newSaleAttr)
  saleAttrIdAndValueName.value=''
}
//属性值按钮点击事件
const toEdit =(row:SaleAttr)=>{
  row.flag = true
  row.saleAttrValue=''
}
const toLook=(row:SaleAttr)=>{
  const {baseSaleAttrId,saleAttrValue} =row
  const newSaleAttrValue:SaleAttrValue ={
    baseSaleAttrId,
    saleAttrValueName:saleAttrValue
  }
  if(saleAttrValue.trim()==''){
    ElMessage({
      type:'error',
      message:'内容不能为空'
    })
    return
  }
  let repeat = row.spuSaleAttrValueList.find(item=>{
    return item.saleAttrValueName==saleAttrValue
  })
  if(repeat){
    ElMessage({
      type:'error',
      message:'内容不能重复'
    })
    return;
  }
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flag = false
}
// 保存
const save =async () => {
  //照片墙数据
  SpuParams.value.spuImageList = ImgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url
    }
  })
  //销售属性数据
  SpuParams.value.spuSaleAttrList = saleAttr.value
  let res = await reqAddOrUpdateSpu(<SpuData>SpuParams.value)
  if(res.code==200){
    ElMessage({
      type:'success',
      message:SpuParams.value.id?'更新成功':'添加成功'
    })
    $emit('changeScene', {flag:0,params:SpuParams.value.id?'update':'add'})
  }else {
    ElMessage({
      type:'error',
      message:SpuParams.value.id?'更新失败':'添加失败'
    })
  }
}
//添加新的spu初始化请求方法
const initAddSpu =async (c3Id:number|string) => {
  //清空数据
  Object.assign(SpuParams.value,{
    category3Id: '',  //三级分类id
    description: "",  //spu描述
    spuName: "",      //spu的名字
    tmId: '',         //品牌ID
    spuImageList: [],
    spuSaleAttrList: [],
  })
  ImgList.value=[]   //清空照片墙
  saleAttr.value=[]  //清空销售属性
  saleAttrIdAndValueName.value=''
  //存储三级分类ID
  SpuParams.value.category3Id= c3Id
  const res: AllTradeMark = await reqAllTradeMark()  //获取全部品牌的数据
  const res1: HasSaleAttrResponseData = await reqAllSaleAttr()  //获取所有销售属性
  AllTradeMark.value=res.data
  allSaleAttr.value=res1.data
}

defineExpose({initHasSpuData,initAddSpu})
</script>

<style lang="scss" scoped>

</style>
