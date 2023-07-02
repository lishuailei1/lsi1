<template>
  <div class="login_container">
    <el-row>
      <el-col :span="14" :xs="0"></el-col>
      <el-col :span="10" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" type="password" show-password v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login_btn"
            :loading="loading" type="primary" size="default" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons' // 输入框图标
import useUserStore from '../../store/modules/user'
import { reactive ,ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import { ElNotification } from 'element-plus' //弹框提示
import {getTime} from '../../utils/time'  // 引入获取当前时间的函数
//收集登录账号数据
let loginForm = reactive({
  username: 'admin',
  password: 'atguigu123'
})
let $router = useRouter()
let route = useRoute()
let useStore = useUserStore()
let loading = ref(false)
let loginForms = ref()
//登录回调
const login = async () => {
  // 验证表单校验通过之后发送请求
  await loginForms.value.validate()
  loading.value=true
  try {
    await useStore.userLogin(loginForm)
    //判断登录的时候，路由路径中是否有query参数，如果有就忘query参数跳，没有就跳往首页
    const redirect:any = route.query.redirect
    await $router.push({path:redirect||'/'})
    ElNotification({
      type:'success',
      title:`hi,${getTime()}`,
      message:'登录成功'
    })
    loading.value=false
  } catch (error) {
    loading.value=false
    ElNotification({
      type:'error',
      message:error.message
    })
  }
}
// 自定义校验规则
const validatorUserName = (rule:any,value:any,callback:any) =>{
  if(value.length >= 5 ){
    callback()
  }else {
    callback(new Error('账号长度至少五位'))
  }
}
const validatorPassword=(rule:any,value:any,callback:any)=>{
  if(value.length >= 6){
    callback()
  }else {
    callback(new Error('密码长度至少六位'))
  }
}
//定义表单校验需要的配置对象
const rules = {
  username:[
      {trigger:"change",validator:validatorUserName}
  ],
  password:[
      {trigger:"change",validator:validatorPassword}
  ]
}

</script>
<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('../../assets/images/175261570119691.jpeg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background-color: rgba(0, 0, 0, .6);
    padding: 40px;

    h1 {
      color: #fff;
      font-size: 30px;
      margin-bottom: 30px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
