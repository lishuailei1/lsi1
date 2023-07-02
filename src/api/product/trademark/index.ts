import request from '../../../utils/request'
import {TradeMarkResponseData,TradeMark} from "./type";
enum API{
    TRADEMARK_URL = '/admin/product/baseTrademark/', //获取已有品牌接口
    ADDTRADEMARK_URL= '/admin/product/baseTrademark/save',  //新增品牌接口
    UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',  //修改品牌接口
    DELETE_URL ='/admin/product/baseTrademark/remove/'  //删除品牌接口
}
//商品管理分页列表
export const reqTradeMark = (page:number,limit:number) =>request.get<any,TradeMarkResponseData>(API.TRADEMARK_URL+`${page}/${limit}`)
//添加与修改品牌
export const reqAddOrUpdataTradeMark = (data:TradeMark)=>{
    if(data.id){
        return request.put<any,any>(API.UPDATETRADEMARK_URL,data)
    }else{
        return request.post<any,any>(API.ADDTRADEMARK_URL,data)
    }
}
//删除品牌
export const reqDeleteTradeMark = (id:number) =>request.delete<any,any>(API.DELETE_URL+id)
