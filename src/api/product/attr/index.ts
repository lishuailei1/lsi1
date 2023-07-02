import request from "../../../utils/request";
import type {CategoryResponseData,AttrResponseData} from './type'
enum API {
    C1_URL='/admin/product/getCategory1',
    C2_URL='/admin/product/getCategory2/',
    C3_URL='/admin/product/getCategory3/',
    //获取分类下已有的属性与属性值
    ATTR_URL='/admin/product/attrInfoList/'
}

//一级分类请求接口
export const reqC1=()=>request.get<any,CategoryResponseData>(API.C1_URL)
//二级分类请求接口
export const reqC2 = (category1Id:number|string)=>request.get<any,CategoryResponseData>(API.C2_URL+category1Id)
//三级分类请求接口
export const reqC3 = (category2Id:number|string) =>request.get<any,CategoryResponseData>(API.C3_URL+category2Id)
//获取已有分类下的属性与属性值接口
export const reqAttr =(category1Id:number|string,category2Id:number|string,category3Id:number|string)=>request.get<any,AttrResponseData>(API.ATTR_URL+`${category1Id}/${category2Id}/${category3Id}`)
