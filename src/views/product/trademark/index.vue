<template>
  <div>
    <el-card class="box-card">
      <el-button icon="Plus" size="default" type="primary" @click="addTradeMark" v-has="`btn.Trademark.add`">添加品牌</el-button>
      <el-table :data="trademarkArr" border style="width: 100%;margin: 10px 0">
        <el-table-column align="center" label="序号" type="index" width="100"/>
        <el-table-column align="center" label="品牌名称" prop="tmName"/>
        <el-table-column align="center" label="品牌LOGO">
          <template #="{row,$index}">
            <img :src="row.logoUrl" height="50" width="50">
          </template>
        </el-table-column>
        <el-table-column align="center" label="品牌操作">
          <template #="{row,$index}">
            <el-button icon="Edit" type="warning" @click="updateTradeMark(row)" ></el-button>
            <el-popconfirm :title="`确定要删除${row.tmName}?`" icon="Delete" width="300px"
                           @confirm="removeTradeMark(row.id) ">
              <template #reference>
                <el-button icon="Delete" type="danger"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="limit"
          :background="true"

          :page-sizes="[5, 10, 15, 20]"
          :total="total"
          layout="prev,pager,next,jumper,->,sizes,total "
          @current-change="getHasTradeMark"
          @size-change="sizeChange"
      />
    </el-card>
    <!--    对话框-->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id?'修改品牌':'添加品牌'">
      <el-form ref="formRef" :model="trademarkParams" :rules="rules" style="width: 70%">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkParams.tmName" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!--          action 图片上传接口路径-->
          <el-upload
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :show-file-list="false"
              action="/api/admin/product/fileUpload"
              class="avatar-uploader"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>

</template>
<script lang="ts" setup>
import {ref, onMounted, reactive} from "vue";
import {reqTradeMark, reqAddOrUpdataTradeMark, reqDeleteTradeMark} from '@/api/product/trademark'
import type {Records, TradeMarkResponseData, TradeMark} from "../../../api/product/trademark/type";
// import type {UploadProps} from 'element-plus'
import {ElMessage, UploadProps, formEmits} from "element-plus";
// import useUserStore from "@/store/modules/user.ts";
// const userStore = useUserStore()
const pageNum = ref<number>(1)  //分页器当前页码
const limit = ref<number>(5)  //分页器每页多少条数据
const total = ref<number>(0) //储存已有数据总数
const trademarkArr = ref<Records>([]) //存储已有品牌数据
const dialogFormVisible = ref<boolean>(false) //控制对话框的显示隐藏
const formRef = ref()
const trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})
//获取品牌列表
const getHasTradeMark = async (pages = 1) => {
  const res: TradeMarkResponseData = await reqTradeMark(pageNum.value, limit.value)
  if (res.code == 200) {
    total.value = res.data.total
    trademarkArr.value = res.data.records
  }
}
//分页器当前页码发生变化时触发
// const changePageNum = () =>{
//   getHasTradeMark()
// }
//分页器下拉菜单发生变化时触发
const sizeChange = () => {
  pageNum.value = 1
  getHasTradeMark()
}
// 添加品牌
const addTradeMark = () => {
  dialogFormVisible.value = true
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
}
// 修改品牌
const updateTradeMark = (row: TradeMark) => {
  dialogFormVisible.value = true
  Object.assign(trademarkParams, row)
  formRef.value?.clearValidate('tmName')
  formRef.value?.clearValidate('logoUrl')
  // trademarkParams.id = row.id
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
}
//取消
const cancel = () => {
  dialogFormVisible.value = false

}
//确定
const confirm = async () => {
  await formRef.value.validate()
  const res = await reqAddOrUpdataTradeMark(trademarkParams)
  if (res.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改成功' : '添加成功'
    })
    await getHasTradeMark(trademarkParams.id ? pageNum.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改失败' : '添加失败'
    })
    dialogFormVisible.value = false
  }
}
//自定义校验规则方法
const validatorTmName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称位数大于等于两位'))
  }
}
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('请上传图片'))
  }

}
//表单校验
const rules = {
  tmName: [{required: true, trigger: 'blur', validator: validatorTmName}],
  logoUrl: [{required: true, validator: validatorLogoUrl}]
}
// 上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传图片大小不能超过4M'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传图片的格式务必是PNG|JPEG|GIF'
    })
    return false
  }
}
// 图片上传成功的钩子函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  trademarkParams.logoUrl = response.data
  formRef.value.clearValidate('logoUrl') //图片上传成功清除校验提示
}
const removeTradeMark = async (id: number) => {
  const res = await reqDeleteTradeMark(id)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    await getHasTradeMark()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
onMounted(() => {
  getHasTradeMark()
})
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
