<template>
  <el-card>
    <el-table :data="skuArr" border style="margin: 10px 0">
      <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
      <el-table-column align="center" label="名称" prop="skuName" show-overflow-tooltip width="200px"></el-table-column>
      <el-table-column align="center" label="描述" prop="skuDesc" show-overflow-tooltip width="300px"></el-table-column>
      <el-table-column align="center" label="默认图片" width="150px">
        <template #="{row,$index}">
          <img :src="row.skuDefaultImg" height="50" width="50">
        </template>
      </el-table-column>
      <el-table-column align="center" label="重量(g)" prop="weight" width="150px"></el-table-column>
      <el-table-column align="center" label="价格" prop="price" width="150px"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="250px">
        <template #="{row,$index}">
          <el-button :icon="row.isSale===0?'Bottom':'Top'" size="small" type="primary"
                     @click="updateSale(row)"></el-button>
          <el-button icon="Edit" size="small" type="warning" @click="updateSku"></el-button>
          <el-button icon="InfoFilled" size="small" type="info" @click="findSku(row)"></el-button>
          <el-popconfirm title="确定要删除吗?" @confirm="removeSku(row.id)">
            <template #reference>
              <el-button icon="Delete" size="small" type="danger" ></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :background="true"
        :page-sizes="[10, 20, 30, 40]"
        :total="total"
        layout="prev, pager, next, jumper,->,sizes,total"
        @current-change="getHasSku"
        @size-change="handler"
    />
    <!--    抽屉组件-->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{skuInfo.skuName}}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{skuInfo.skuDesc}}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{skuInfo.skuDesc}}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 5px" v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{item.valueName}}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 5px" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{item.saleAttrValueName}}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" style="height: 100%;width: 100%">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>

</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {reqSkuList, reqSaleSku, reqCancelSale,reqSkuInfo,reqDeleteSku} from "@/api/product/sku";
import type {SkuResponseData, SkuData,SkuInfoData} from "@/api/product/sku/type";
import {ElMessage} from "element-plus";
const drawer =ref<boolean>(false)  //控制抽屉显示隐藏
const pageNum = ref<number>(1)  //分页器当前页码
const pageSize = ref<number>(10)//分页器默认每页展示数据
const total = ref<number>(0)
const skuArr = ref<SkuData[]>([])
const skuInfo = ref<any>({})
const getHasSku = async (pages = 1) => {
  //当前分页器页码
  pageNum.value = pages
  const res: SkuResponseData = await reqSkuList(pageNum.value, pageSize.value)
  if (res.code == 200) {
    total.value = res.data.total
    skuArr.value = res.data.records
  }
}
//分页器下拉菜单
const handler = (pageSize: number) => {
  getHasSku()
}
//商品上架与下架操作
const updateSale = async (row: SkuData) => {
  //如果当前商品的isSale===1，当前商品时上架状态，更新为下架
  if (row.isSale === 1) {
    await reqCancelSale(row.id)
    ElMessage({
      type: 'success',
      message: '下架成功'
    })
    //发请求获取当前更新完毕后的全部sku
    await getHasSku(pageNum.value)
  } else {
    await reqSaleSku(row.id)
    ElMessage({
      type: 'success',
      message: '上架成功'
    })
    //发请求获取当前更新完毕后的全部sku
    await getHasSku(pageNum.value)
  }
}
//更新已有sku
const updateSku = () => {
  ElMessage({type: 'success', message: '努力更新中......'})
}
//查看商品详情
const findSku =async (row: SkuData) => {
  drawer.value = true
  //获取商品详情数据
  const res:SkuInfoData = await reqSkuInfo(row.id)
  skuInfo.value=res.data
}
//删除已有sku
const removeSku = async (id: number) => {
  const res:any = await reqDeleteSku(id)
  if(res.code==200){
    ElMessage({
      type:'success',
      message:'删除成功'
    })
    await getHasSku(pageNum.value)
  }else {
    ElMessage({
      type:'error',
      message:'删除失败'
    })
  }
}
onMounted(() => {
  getHasSku()
})
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin-top: 20px;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
