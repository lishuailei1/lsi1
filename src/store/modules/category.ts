import {defineStore} from "pinia";
import {reqC1, reqC2,reqC3} from "@/api/product/attr";
import type {CategoryResponseData} from '@/api/product/attr/type'
import type {CategoryState} from './types/type'
const useCategoryStore = defineStore('Category', {
    state: ():CategoryState=> {
        return {
            //存储一级分类数据
            c1Arr:[],
            //存储一级分类的id
            c1Id:'',
            //存储对应一级分类下的二级分类数据
            c2Arr:[],
            //储存二级分类的id
            c2Id:'',
            //存储对应二级分类下的三级分类数据
            c3Arr:[],
            //储存三级分类id
            c3Id:'',
        }
    },
    actions: {
        //获取一级分类方法
        async getC1() {
            const res:CategoryResponseData = await reqC1()
            if(res.code==200){
                this.c1Arr = res.data
            }
        },
        //获取二级分类的数据
        async getC2(){
            const res:CategoryResponseData = await reqC2(this.c1Id)
            if(res.code==200){
                this.c2Arr = res.data
            }
        },
        //获取三级分类的数据
        async getC3(){
            const res:CategoryResponseData = await reqC3(this.c2Id)
            if(res.code==200){
                this.c3Arr = res.data
            }
        }
    },
    getters: {}
})
export default useCategoryStore
