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
              <el-button icon="Edit" type="warning" @click="updataAttr"></el-button>
              <el-button icon="Delete" type="danger"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene==1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="Plus" size="small">添加属性</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0">
          <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
          <el-table-column label="属性值名称" align="center"></el-table-column>
          <el-table-column label="属性值操作" align="center"></el-table-column>
        </el-table>
        <el-button type="primary"  size="small">保存</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import useCategoryStore from "@/store/modules/category";
import {reqAttr} from "@/api/product/attr";
import {ref, watch} from "vue";
import type {AttrResponseData, Attr} from "@/api/product/attr/type";
const categoryStore = useCategoryStore()
const attrArr = ref<Attr[]>([])
const scene = ref<number>(0)  //定义卡片内容切换
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
  scene.value=1
}
//修改属性
const updataAttr =()=>{
  scene.value=1
}
//取消按钮
const cancel = () =>{
  scene.value=0
}
</script>
<style lang="scss" scoped>

</style>
