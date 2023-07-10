<template>
  <el-card style="height: 80px;margin-bottom: 10px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名">
        <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" :disabled="keyword?false:true" @click="search">搜索</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card>
    <el-button size="small" type="primary" @click="addUser">添加</el-button>
    <el-button :disabled="selectIdArr.length?false:true" size="small" type="danger" @click="deleteBatchUser">批量删除
    </el-button>
    <el-table :data="UserArr" border style="margin: 10px 0" @selection-change="selectChange">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" label="#" type="index"></el-table-column>
      <el-table-column align="center" label="id" prop="id" width="80px"></el-table-column>
      <el-table-column align="center" label="用户名字" prop="username" show-overflow-tooltip
                       width="120px"></el-table-column>
      <el-table-column align="center" label="用户名称" prop="name" show-overflow-tooltip
                       width="120px"></el-table-column>
      <el-table-column align="center" label="用户角色" prop="roleName" show-overflow-tooltip
                       width="130px"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" show-overflow-tooltip
                       width="140px"></el-table-column>
      <el-table-column align="center" label="更新时间" prop="updateTime" show-overflow-tooltip
                       width="140px"></el-table-column>
      <el-table-column align="center" label="操作">
        <template #="{row,$index}">
          <el-button icon="User" size="small" type="success" @click="setRole(row)">分配角色</el-button>
          <el-button icon="Edit" size="small" type="warning" @click="updateUser(row)">编辑</el-button>
          <el-popconfirm title="确定要删除吗?" @confirm="removeUser(row)">
            <template #reference>
              <el-button icon="Delete" size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :background="true"
        :page-sizes="[5, 7, 9, 11]"
        :total="total"
        layout="prev, pager, next, jumper,->,sizes,total"
        @current-change="getUserInfo"
        @size-change="handler"
    />
  </el-card>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '编辑用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form ref="formRef" :model="userParams" :rules="rules">
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="userParams.username" placeholder="请填写用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input v-model="userParams.name" placeholder="请填写用户昵称"></el-input>
        </el-form-item>
        <el-form-item v-if="!userParams.id" label="用户密码" prop="password">
          <el-input v-model="userParams.password" placeholder="请填写用户密码"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选
          </el-checkbox>
          <el-checkbox-group v-model="userRole" @change="handleCheckedUserChange">
            <el-checkbox v-for="(role,index) in allRole" :key="index" :label="role">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1=false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import useLayOutSettingStore from "@/store/modules/settings.ts";
import {nextTick, onMounted, reactive, ref} from "vue";
import {reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetRole, reqRemoveUser, reqSelectUser} from "@/api/acl/user";
import {Records, UserResponseData, User, AllRoleResponseData, AllRole, SetRoleData} from "@/api/acl/user/type.ts";
import {ElMessage} from "element-plus";
const settingStore = useLayOutSettingStore()
const pageNum = ref<number>(1)  //默认页码
const pageSize = ref<number>(5)  //每页展示数据
const total = ref<number>(0)  //用户总个数
const UserArr = ref<Records>([])  //存储全部用户信息数组
const drawer = ref<boolean>(false) //控制抽屉显示与隐藏
//存储全部职位数据
const allRole = ref<AllRole>([])
//存储角色已有职位
const userRole = ref<AllRole>([])
const selectIdArr = ref<User[]>([]) //储存批量删除用户id的数组
const checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(true)
const drawer1 = ref<boolean>(false)
const formRef = ref<any>()  //获取form表单实例
const keyword = ref<string>('')  //收集搜索用户输入关键字
//收集用户信息
const userParams = reactive<User>({
  username: '',
  name: '',
  password: ''
})
onMounted(() => {
  getUserInfo()
})
//获取全部已有用户信息
const getUserInfo = async (pages = 1) => {
  pageNum.value = pages
  const res: UserResponseData = await reqUserInfo(pageNum.value, pageSize.value,keyword.value)
  if (res.code == 200) {
    total.value = res.data.total
    UserArr.value = res.data.records
  }
}
//分页器下拉菜单
const handler = () => {
  getUserInfo()
}
//添加用户
const addUser = () => {
  drawer.value = true
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: ''
  })
  nextTick(() => [
    formRef.value.clearValidate()
  ])
}
//编辑用户
const updateUser = (row: User) => {
  drawer.value = true
  Object.assign(userParams, row)
  nextTick(() => [
    formRef.value.clearValidate()
  ])
}
//保存按钮
const save = async () => {
  //点击保存保证表单符合条件发送请求
  await formRef.value.validate()
  const res: any = await reqAddOrUpdateUser(userParams)
  if (res.code == 200) {
    drawer.value = false
    ElMessage({type: 'success', message: userParams.id ? '编辑成功' : '添加成功'})
    await getUserInfo(userParams.id ? pageNum.value : 1)
    // window.location.reload()
  } else {
    drawer.value = false
    ElMessage({type: 'error', message: userParams.id ? '编辑失败' : '添加失败'})
  }
}
//取消按钮
const cancel = () => {
  drawer.value = false
}
//校验用户名字的回调函数
const validatorUserName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}
const validatorName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
const validatorPassword = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
//表单校验
const rules = {
  username: [{required: true, trigger: 'blur', validator: validatorUserName}],
  name: [{required: true, trigger: 'blur', validator: validatorName}],
  password: [{required: true, trigger: 'blur', validator: validatorPassword}]
}
//分配角色按钮回调
const setRole = async (row: User) => {
  drawer1.value = true
  //存储已有用户信息
  Object.assign(userParams, row)
  const res: AllRoleResponseData = await reqAllRole(userParams.id)
  if (res.code == 200) {
    allRole.value = res.data.allRolesList  //全部的职位
    userRole.value = res.data.assignRoles  //已有的职位
    drawer1.value = true
  }
}
//全选复选框
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
const handleCheckedUserChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}
//分配职位确定按钮回调
const confirmClick = async () => {
  const data: SetRoleData = {
    userId: (userParams.id),
    roleIdList: userRole.value.map(item => item.id)
  }
  const res: any = await reqSetRole(data)
  if (res.code == 200) {
    ElMessage({type: 'success', message: '分配成功'})
  } else {
    ElMessage({type: 'error', message: '分配失败'})
  }
  await getUserInfo(pageNum.value)
  drawer1.value = false
}
//删除用户
const removeUser = async (row: User) => {
  const res: any = await reqRemoveUser(row.id)
  if (res.code == 200) {
    ElMessage({type: 'success', message: '删除成功'})
    await getUserInfo(pageNum.value)
  } else {
    ElMessage({type: 'error', message: '删除失败'})
  }
}
//复选框勾选触发事件
const selectChange = (value: any) => {
  selectIdArr.value = value
}
//批量删除用户
const deleteBatchUser = async () => {
  const idsList: any = selectIdArr.value.map(item => {
    return item.id
  })
  const res:any = await reqSelectUser(idsList)
  if (res.code == 200) {
    ElMessage({type: 'success', message: '删除成功'})
    await getUserInfo(pageNum.value)
  } else {
    ElMessage({type: 'error', message: '删除失败'})
  }
}
//搜索按钮事件回调
const search = () =>{
   getUserInfo()
  keyword.value=''
}
//重置按钮事件回调
const reset = () =>{
  settingStore.refresh = !settingStore.refresh
  // window.location.reload()
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
