import {defineStore} from "pinia";
let useLayOutSettingStore = defineStore('SettingStore',{
    state:()=>{
        return {
            fold:false, //控制菜单折叠收起
            refresh:false //控制刷新效果
        }
    }
})
export default useLayOutSettingStore
