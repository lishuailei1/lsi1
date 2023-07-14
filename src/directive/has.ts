import pinia from "@/store";
import useUserStore from "@/store/modules/user.ts";
const userStore = useUserStore(pinia)
export const isHasButton = (app:any) =>{
    //全局自定义指令
    app.directive('has',{
        mounted(el,options){
            if(!userStore.buttons.includes(options)){
                el.parentNode.removeChild(el)
            }
        }
    })
}

