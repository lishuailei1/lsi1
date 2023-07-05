import request from '@/utils/request'
import type {SkuResponseData} from "./type";

enum API{
    // 获取已有商品数据  sku
    SKU_URL='/admin/product/list/'
}
//获取商品sku接口
export const reqSkuList=(page:number,limit:number)=>request.get<any,SkuResponseData>(API.SKU_URL+`${page}/${limit}`)
