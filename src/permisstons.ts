// @ts-ignore
import router from "@/router";
import nprogress from 'nprogress'  //引入进度条
import 'nprogress/nprogress.css'   //引入进度条样式
nprogress.configure({ showSpinner: false });
// import setting from "./setting";
import pinia from "./store";
import useUserStore from "./store/modules/user";
const userStore = useUserStore(pinia)

// 全局前置守卫
// @ts-ignore
router.beforeEach(async (to: any, from: any, next: any) => {
    nprogress.start();
    const token = userStore.token
    const username = userStore.username
    if(token){
        //登录成功访问login，指向首页
        if(to.path=='/login'){
           next({path:'/'})
        }else {
            //登录成功访问其他路由，排除login
            if(username){  //有用户信息  放行
                next(   )
            }else {
                //没有用户信息，在守卫里发送请求获取用户信息再放行
                try {
                    //发请求，获取到用户信息
                    await userStore.userInfo()
                    next({...to})  //放行
                }catch (error){
                    //token过期，获取不到用户信息 或 用户手动修改本地存储token
                    await userStore.userLogOut()
                    next({path:'/login',query:{redirect: to.path}})
                }
            }
        }
    }else {
        if(to.path=='/login'){
            next()
        }else {
            next({path:'/login',query:{redirect:to.path}})
        }
    }
})
//全局后置守卫
router.afterEach(()=>{
    nprogress.done()

})
