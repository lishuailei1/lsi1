import request from "@/utils/request";
import type {HasSpuResponseData} from './type'
enum API {
  HASSPU_URL='/admin/product/'  //获取已有spu数据
}
//获取三级分类下已有的spu数据
export  const reqHasSpu = (page:number,limit:number,category3Id:number|string)=>request.get<any,HasSpuResponseData>(API.HASSPU_URL+`${page}/${limit}?category3Id=${category3Id}`)
