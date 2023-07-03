import request from "@/utils/request";
import type {HasSpuResponseData,AllTradeMark,SpuHasImg,SaleAttrResponseData,HasSaleAttrResponseData} from './type'

enum API {
  HASSPU_URL='/admin/product/' , //获取已有spu数据
  ALLTRADEMARK_URL='/admin/product/baseTrademark/getTrademarkList', //获取全部品牌数据
  IMAGE_URL='/admin/product/spuImageList/' , //  spu下商品图片数据
  SPUHASSALEATTR_URL='/admin/product/spuSaleAttrList/', //销售属性
  ALLSALEATTR_URL='/admin/product/baseSaleAttrList' //全部销售属性
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
