import request from '@/utils/request'
import type {SkuResponseData,SkuInfoData} from "./type";

enum API {
    // 获取已有商品数据  sku
    SKU_URL = '/admin/product/list/',
    //商品上架
    SALE_URL = '/admin/product/onSale/',
    //商品下架
    CANCELSALE_URL = '/admin/product/cancelSale/',
    //商品详情
    SKUINFO_URL='/admin/product/getSkuInfo/',
    //删除已有的商品
    DELETESKU_URL='/admin/product/deleteSku/'

}

//获取商品sku接口
export const reqSkuList = (page: number, limit: number) => request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
//商品上架
export const reqSaleSku = (skuId: number) => request.get<any, any>(API.SALE_URL + skuId)
//商品下架
export const reqCancelSale = (skuId: number) => request.get<any, any>(API.CANCELSALE_URL + skuId)
//商品详情
export const reqSkuInfo = (skuId:number) => request.get<any,SkuInfoData>(API.SKUINFO_URL+skuId)
//删除已有的商品
export const reqDeleteSku = (skuId:number)=>request.delete<any,any>(API.DELETESKU_URL+skuId)
