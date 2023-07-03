<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select>
        <el-option label="2"></el-option>
        <el-option label="3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input placeholder="请输入描述" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
          v-model:file-list="fileList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          list-type="picture-card"
      >
        <el-icon>
          <Plus/>
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img :src="dialogImageUrl" alt="Preview Image" w-full/>
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select>
        <el-option label="2"></el-option>
        <el-option label="3"></el-option>
      </el-select>
      <el-button icon="Plus" style="margin-left: 10px" type="primary">添加属性值</el-button>
      <el-table border style="margin: 10px 0">
        <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
        <el-table-column align="center" label="属性名" width="100px"></el-table-column>
        <el-table-column align="center" label="属性值"></el-table-column>
        <el-table-column align="center" label="操作" width="100px"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>

</template>

<script lang="ts" setup>
const $emit = defineEmits(['changeScene'])
//点击取消按钮，通知父组件切换场景为1，展示已有的spu数据
const cancel = () => {
  $emit('changeScene', 0)
}
</script>

<style lang="scss" scoped>

</style>
