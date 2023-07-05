import request from "@/utils/request";
import type {HasSpuResponseData,AllTradeMark,SpuHasImg,SaleAttrResponseData,HasSaleAttrResponseData,SpuData,SkuData,SkuInfoData} from './type'
enum API {
  HASSPU_URL='/admin/product/' , //获取已有spu数据
  ALLTRADEMARK_URL='/admin/product/baseTrademark/getTrademarkList', //获取全部品牌数据
  IMAGE_URL='/admin/product/spuImageList/' , //  spu下商品图片数据
  SPUHASSALEATTR_URL='/admin/product/spuSaleAttrList/', //销售属性
  ALLSALEATTR_URL='/admin/product/baseSaleAttrList' ,//全部销售属性
  ADDSPU_URL='/admin/product/saveSpuInfo',  //添加spu
  UPDATESPU_URL='/admin/product/updateSpuInfo', //更改spu
  ADDSKU_URL='/admin/product/saveSkuInfo' , //追加新的sku地址
  SKUINFO_URL='/admin/product/findBySpuId/' ,//查看列表
  REMOVESPU_URL='/admin/product/deleteSpu/'  //删除已有spu
}
//获取三级分类下已有的spu数据
export  const reqHasSpu = (page:number,limit:number,category3Id:number|string)=>request.get<any,HasSpuResponseData>(API.HASSPU_URL+`${page}/${limit}?category3Id=${category3Id}`)
//获取全部spu品牌数据
export const reqAllTradeMark =()=>request.get<any,AllTradeMark>(API.ALLTRADEMARK_URL)
// spu下商品图片数据
export const reqSpuImageList =(spuId:number)=>request.get<any,SpuHasImg>(API.IMAGE_URL+spuId)
//销售属
export const reqSpuHasSaleAttr=(spuId:number)=>request.get<any,SaleAttrResponseData>(API.SPUHASSALEATTR_URL+spuId)
//全部销售属性
export const reqAllSaleAttr=()=>request.get<any,HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
//添加spu
export const  reqAddOrUpdateSpu = (data:SpuData)=>{
  if(data.id){
    return request.post<any,any>(API.UPDATESPU_URL,data)
  }else {
    return request.post<any,any>(API.ADDSPU_URL,data)
  }
}
//添加sku请求
export const reqAddSku=(data:SkuData)=>request.post<any,any>(API.ADDSKU_URL,data)
//查看sku列表
export const reqSkuList =(spuId:number|string)=>request.get<any,SkuInfoData>(API.SKUINFO_URL+spuId)
//删除已有spu
export const reqRemoveSpu = (spuId:number|string) =>request.delete<any,any>(API.REMOVESPU_URL+spuId)
