<template>
  <el-table :data="permissionArr" border row-key="id" style="width: 100%; margin-bottom: 20px">
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <template #="{row,$index}">
        <el-button :disabled="row.level==4?true:false" size="small" type="primary" @click="addPermission(row)">
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button :disabled="row.level==1?true:false" size="small" type="warning" @click="updatePermission(row)">编辑
        </el-button>
        <el-popconfirm title="确定删除吗?" @confirm="deletePermission(row.id)">
          <template #reference>
            <el-button :disabled="row.level==1?true:false" size="small" type="danger" >删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogVisible" :title="menuData.id?'编辑菜单':'添加菜单'">
    <el-form>
      <el-form-item label="名称">
        <el-input v-model="menuData.name" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input v-model="menuData.code" placeholder="请输入权限数值"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {reqAllPermission, reqAddOrUpdateMenu,reqDeleteMenu} from '@/api/acl/menu'
import type {PermissionList, PermissionResponseData, Permission, MenuParams} from '@/api/acl/menu/type.ts'
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";

const permissionArr = ref<PermissionList>([])  //存储菜单数据
const dialogVisible = ref<boolean>(false)      //控制对话框的显示隐藏
//请求携带参数
const menuData = reactive<MenuParams>({
  id:0,
  code: '',
  level: 0,
  name: '',
  pid: 0
})
onMounted(() => {
  getHasPermission()
})
//获取菜单数据
const getHasPermission = async () => {
  const res: PermissionResponseData = await reqAllPermission()
  if (res.code == 200) {
    permissionArr.value = res.data
  }
}
//添加菜单按钮事件回调
const addPermission = (row:Permission) => {
  Object.assign(menuData,{
    code: '',
    level: 0,
    name: '',
    pid: 0
  })
  dialogVisible.value = true
  menuData.level=row.level+1
  menuData.pid=row.pid
}
//编辑按钮事件回调
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  Object.assign(menuData,row)
}
//确定按钮回调
const save = async() =>{
  const res = await reqAddOrUpdateMenu(menuData)
  if(res.code==200){
    dialogVisible.value=false
    ElMessage({
      type:'success',
      message:menuData.id?'编辑成功':'添加成功'
    })
    await getHasPermission()
  }
}
//删除按钮回调
const deletePermission = async (id:number) => {
  const res:any = await reqDeleteMenu(id)
  if(res.code==200){
    ElMessage({
      type:'success',
      message:'删除成功'
    })
    await getHasPermission()
  }

}
</script>

<style lang="scss" scoped>

</style>
