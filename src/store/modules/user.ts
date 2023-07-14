import { defineStore } from 'pinia'
//引入数据类型
import type {UserState} from "./types/type";
// 引入常量路由
import {constantRoute,asyncRouter,anyRoute} from "../../router/routes";
// 引入操作本地存储的工具方法
import {SET_TOKEN,GET_TOKEN,REMOVE_TOKEN} from "../../utils/token";
//引入接口
import { reqLogin ,reqUserInfo,reqLogOut} from '../../api/user'
import type {loginFormData,loginResponseData,userInfoResponseData} from "../../api/user/type";
import router from '@/router'
//引入深拷贝方法
import cloneDeep from 'lodash/cloneDeep'
//过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRouter:any,routes:any){
  return asyncRouter.filter((item:any)=>{
      if(routes.includes(item.name)){
        if(item.children&&item.children.length>0){
          item.children = filterAsyncRoute(item.children,routes)
        }
        return true
      }
  })
}
let useUserStore = defineStore('User', {
  state: (): UserState=> {
    return {
      token: GET_TOKEN(),
      // @ts-ignore
      menuRoutes: constantRoute,
      username:'',
      avatar:'',
      buttons:[]
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
        this.buttons = res.data.buttons
        //计算当前用户需要展示的异步路由
        let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRouter),res.data.routes)
        //菜单数据
        this.menuRoutes= [...constantRoute,...userAsyncRoute,anyRoute];
        [...userAsyncRoute,anyRoute].forEach((route:any)=>{
          router.addRoute(route)

        });

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
