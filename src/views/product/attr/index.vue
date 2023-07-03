<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card>
      <div v-show="scene==0">
        <el-button :disabled="categoryStore.c3Id?false:true" icon="Plus" type="primary" @click="addAttr">添加属性</el-button>
        <el-table :data="attrArr" border style="margin: 10px 0">
          <el-table-column align="center" label="序号" type="index" width="80"></el-table-column>
          <el-table-column align="center" label="属性名称" prop="attrName" width="150"></el-table-column>
          <el-table-column align="center" label="属性值名称">
            <template #="{row,$index}">
              <el-tag v-for="(item,index) in row.attrValueList" :kye="item.id" style="margin: 5px;">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template #="{row,$index}">
              <el-button icon="Edit" type="warning" @click="updateAttr(row)"></el-button>
              <el-popconfirm title="确定删除吗?" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button icon="Delete" type="danger"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene==1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addAttrValue" :disabled="attrParams.attrName?false:true" type="primary" icon="Plus" size="small">添加属性</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0" :data="attrParams.attrValueList">
          <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #="{row,$index}">
              <el-input v-if="row.flag" :ref="(vc:any)=>inputArr[$index]=vc" @blur="toLook(row,$index)" placeholder="请输入属性值名称" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row,$index)">{{row.valueName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作" align="center">
            <template #="{row,$index}">
              <el-button icon="Delete" type="danger" @click="attrParams.attrValueList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="small" @click="save" :disabled="attrParams.attrValueList.length>0?false:true">保存</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import useCategoryStore from "@/store/modules/category";
import {reqAttr,reqAddOrUpdateAttr,reqDeleteArr} from "@/api/product/attr";
import {nextTick, reactive, ref, watch,onBeforeUnmount} from "vue";
import type {AttrResponseData, Attr,AttrValue} from "@/api/product/attr/type";
import {ElMessage} from "element-plus";
const categoryStore = useCategoryStore()
const attrArr = ref<Attr[]>([])
const   inputArr =ref<any>([])  //存储对应组件实例el-input
const scene = ref<number>(0)  //定义卡片内容切换
const attrParams = reactive<Attr>({
  attrName:'',
  attrValueList:[],
  categoryId:'',
  categoryLevel:3
})  //收集新增属性数据
//监听三级分类id的变化
watch(() => categoryStore.c3Id, () => {
  attrArr.value = []
  if (!categoryStore.c3Id) return
  getAttr()
})
const getAttr = async () => {
  //获取分类id
  const {c1Id, c2Id, c3Id} = categoryStore
  const res: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (res.code == 200) {
    attrArr.value = res.data
  }
}
//添加属性
const addAttr = () =>{
  Object.assign(attrParams,{
    attrName:'',
    attrValueList:[],
    categoryId:categoryStore.c3Id ,
    categoryLevel:3
  })
  scene.value=1
}
//修改属性
const updateAttr =(row:Attr)=>{
  scene.value=1
  Object.assign(attrParams,JSON.parse(JSON.stringify(row)))
}
//取消按钮
const cancel = () =>{
  scene.value=0
}
//添加属性值按钮
const addAttrValue = () =>{
  //点击添加属性值按钮，向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName:'',
    flag:true  //控制属性值的编辑和切换
  })
  nextTick(()=>[
      inputArr.value[attrParams.attrValueList.length-1].focus()
  ])
}
//保存按钮事件回调
const save = async () => {
  const res:any = await reqAddOrUpdateAttr(attrParams)
  if(res.code==200){
    scene.value=0
    ElMessage({
      type:'success',
      message:attrParams.id?'修改成功':'添加成功'
    })
    await getAttr()  // 获取全部已有的属性与属性值
  }else {
    ElMessage({
      type:'error',
      message:attrParams.id?'修改失败':'添加失败'
    })
  }
}
//属性值表单元素失去焦点事件
const toLook = (row:AttrValue,$index:number) =>{
  if(row.valueName.trim()==''){
    attrParams.attrValueList.splice($index,1)
    ElMessage({
      type:'error',
      message:'属性值不能为空'
    })
    return
  }
  const repeat = attrParams.attrValueList.find((item)=>{
    if(item!=row){
      return item.valueName===row.valueName
    }
  })
  if(repeat){
    attrParams.attrValueList.splice($index,1)
    ElMessage({
      type:'error',
      message:'属性值不能重复'
    })
    return;
  }
  row.flag=false
}
//属性值获取焦点事件
const toEdit = (row:AttrValue,$index:number) =>{
  row.flag=true
  nextTick(()=>{
    inputArr.value[$index].focus()
  })
}
//删除商品属性
const deleteAttr = async (attrId:number) => {
  const res = await reqDeleteArr(attrId)
  if(res.code==200){
    ElMessage({
      type:'success',
      message:'删除成功'
    })
    await getAttr()
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
