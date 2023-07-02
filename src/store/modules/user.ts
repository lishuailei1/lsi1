import { defineStore } from 'pinia'
//引入数据类型
import type {UserState} from "./types/type";
// 引入常量路由
import {constantRoute} from "../../router/routes";
// 引入操作本地存储的工具方法
import {SET_TOKEN,GET_TOKEN,REMOVE_TOKEN} from "../../utils/token";
//引入接口
import { reqLogin ,reqUserInfo,reqLogOut} from '../../api/user'
import type {loginFormData,loginResponseData,userInfoResponseData} from "../../api/user/type";

let useUserStore = defineStore('User', {
  state: (): UserState=> {
    return {
      token: GET_TOKEN(),
      // @ts-ignore
      menuRoutes: constantRoute,
      username:'',
      avatar:''
    }
  },
  //处理异步逻辑
  actions: {
    //用户登录方法
    async userLogin(data: loginFormData) {
      //登录请求
      const res:loginResponseData = await reqLogin(data)
      if (res.code === 200) {
        //存储token
        this.token = (res.data as string)
        //本地持久化
        SET_TOKEN((res.data as string))
        return 'ok'
      } else {
        return Promise.reject(new Error(res.data))
      }
    },
    //获取用户信息
    async userInfo(){
      const res:userInfoResponseData= await reqUserInfo()
      if(res.code==200){
        this.username = res.data.name
        this.avatar = res.data.avatar
        return 'ok'
      }else {
        return Promise.reject(new Error(res.message))
      }
    },
    //退出登录
    async userLogOut(){
      const res:any = await reqLogOut()
      if(res.code==200){
        this.token = '';
        this.username = '';
        this.avatar = '';
        REMOVE_TOKEN();
        return 'ok'
      }else{
        return Promise.reject(new Error(res.message))
      }
    }
  },

  getters: {

  }
})
export default useUserStore
