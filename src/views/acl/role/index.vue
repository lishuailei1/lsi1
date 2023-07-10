<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索" >
        <el-input v-model="keyword" placeholder="请输入职位搜索关键字"></el-input>
      </el-form-item>
      <el-form-item label="职位搜索" >
        <el-button type="primary" size="small" :disabled="keyword?false:true" @click="search">搜索</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
    <el-table border style="margin: 10px 0" :data="allRole">
      <el-table-column label="#" type="index" align="center" width="50px"></el-table-column>
      <el-table-column prop="id" label="id" align="center" width="100px" ></el-table-column>
      <el-table-column prop="roleName" label="角色名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建事件" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{row,$index}">
          <el-button type="primary" size="small" @click="setPermission(row)">分配权限</el-button>
          <el-button type="warning" size="small" @click="updateRole(row)">编辑</el-button>
          <el-popconfirm title="确定要删除吗?"  @confirm="removeRole(row.id)">
            <template #reference>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout="pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="getHasRole"
        @size-change="sizeChange"
    />
  </el-card>
  <el-dialog v-model="dialogVisible" :title="RoleParams.id?'编辑职位':'添加职位'">
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input placeholder="请输入职位名称" v-model="RoleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>set title by slot</h4>
    </template>
    <template #default>
      <el-tree
          ref="tree"
          :data="menuData"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="defaultProps"
          :default-checked-keys="selectArr"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer=false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList,reqSetPermission,reqRemoveRole} from "@/api/acl/role";
import useLayOutSettingStore from '@/store/modules/settings.ts'
import type {Records,RoleResponseData,RoleData,MenuResponseData,MenuData,MenuList} from '@/api/acl/role/type.ts'
import {nextTick, onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";

const form = ref<any>()  //获取form组件实例
const settingStore = useLayOutSettingStore()
const pageNum = ref<number>(1)  //当前页码
const pageSize = ref(10)        //每页展示数据
const total = ref<number>(0)    //总个数
const keyword = ref<string>('')  //搜索关键字
const allRole = ref<Records>([])  //存储全部已有职位
const dialogVisible = ref<boolean>(false) //控制dialog显示隐藏
const menuData = ref<MenuList>([]) //存储用户权限的数据
const selectArr = ref<any>([])  //存储勾选节点的id
const tree = ref<any>()  //获取tree组件实例
const drawer = ref<boolean>(false)
//收集新增角色数据
const RoleParams = reactive<RoleData>({
  roleName:''
})
onMounted(()=>{
  getHasRole()
})
//获取角色分页列表
const getHasRole = async (pages = 1) => {
  pageNum.value=pages
  const res:RoleResponseData = await reqAllRoleList(pageNum.value,pageSize.value,keyword.value)
  if(res.code==200){
    total.value=res.data.total
    allRole.value = res.data.records
  }
}
//分页器下拉菜单
const sizeChange =()=>{
  getHasRole()
}
//搜索按钮事件回调
const search = () =>{
  getHasRole()
  keyword.value=''
}
//重置按钮事件回调
const reset = () =>{
  settingStore.refresh=!settingStore.refresh
}
//添加角色
const addRole = () =>{
  dialogVisible.value=true
  Object.assign(RoleParams,{
    roleName:'',
    id:''
  })
  //清除表单校验提示
  nextTick(()=>{
    form.value.clearValidate()
  })
}
//编辑角色
const updateRole = (row:RoleData)=>{
  dialogVisible.value=true
  Object.assign(RoleParams,row)
  nextTick(()=>{
    form.value.clearValidate()
  })
}
//自定义校验规则事件回调
const validatorRoleName=(rule:any,value:any,callBack:any)=>{
  if(value.trim().length>=2){
    callBack()
  }else {
    callBack(new Error('职位名称至少两位'))
  }
}
//dialog表单校验
const rules ={
  roleName:[{required:true,trigger:'blur',validator:validatorRoleName}]
}
//确定按钮事件回调
const save = async () => {
  await form.value.validate()
  const res:any = await reqAddOrUpdateRole(<RoleData>RoleParams)
  if(res.code==200){
    ElMessage({
      type:'success',
      message:RoleParams.id?'编辑成功':'添加成功'
    })
    dialogVisible.value=false
    await getHasRole(RoleParams.id?pageNum.value:1)
  }
}
//分配权限
const setPermission = async (row: MenuData) => {
  drawer.value = true
  Object.assign(RoleParams, row);
  const res:MenuResponseData = await reqAllMenuList(RoleParams.id)
  if(res.code==200){
    menuData.value=res.data
    selectArr.value = filterSelectArr(menuData.value,[])
  }

}
const filterSelectArr = (allData:any,initArr:any) =>{
  allData.forEach((item:any)=>{
    if(item.select&&item.level==4){
      initArr.push(item.id)
    }
    if(item.children&&item.children.length>0){
      filterSelectArr(item.children,initArr)
    }
  })
  return initArr
}
const defaultProps = {
  children: 'children',
  label: 'name',
}
//抽屉确定按钮事件回调
const handler = async () => {
  let roleId = RoleParams.id  //职位ID
  let arr = tree.value.getCheckedKeys() //选中节点的ID
  let arr1 = tree.value.getHalfCheckedKeys() //半选节点的ID
  let permissionId= arr.concat(arr1)
  const res:any = await reqSetPermission(roleId,permissionId)
  if(res.code==200){
    drawer.value=false
    ElMessage({type:'success',message:'分配权限成功'})
    window.location.reload()
  }else {
    drawer.value=false
    ElMessage({type:'error',message:'分配权限失败'})
  }
}
//删除角色
const removeRole =async (id:number) => {
  const res:any = await reqRemoveRole(id)
  if(res.code==200){
    ElMessage({
      type:'success',
      message:'删除成功'
    })
    await getHasRole(allRole.value.length>1?pageNum.value:pageNum.value-1)
  }
}
</script>

<style scoped lang="scss">
.form{
  display: flex;
  justify-content:space-between;
  align-items: center;
}
</style>
