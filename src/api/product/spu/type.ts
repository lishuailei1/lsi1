
export interface ResponseData{
    code:number,
    message:string,
    ok:boolean,
}
//spu数据的ts类型
export interface SpuData{
    id?:number,
    spuName:string,
    description:string,
    category3Id:string|number,
    tmId:number|string,
    spuSaleAttrList:null| SaleAttr[],
    spuImageList:null|SpuImg[]
}

export type Records= SpuData[]
//定义获取已有spu接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData{
    data: {
        records:Records,
        total:number,
        size:number,
        current:number,
        searchCount:boolean,
        pages:number
    }
}
//品牌数据的ts类型
export interface TradeMark{
    id:number,
    tmName:string,
    logoUrl:string
}
//品牌接口返回数据ts类型
export interface AllTradeMark extends ResponseData{
    data:TradeMark[]
}

//商品图片的ts类型
export interface SpuImg{
    id?: number;
    createTime?: string;
    updateTime?: string;
    spuId?: number;
    imgName?: string;
    imgUrl?: string;
    name?:string
    url?:string
}
//已有spu照片墙数据类型
export interface SpuHasImg extends ResponseData{
    data:SpuImg[]
}

//已有销售值对象的ts类型
export interface SaleAttrValue{
    id?: number;
    createTime?: null;
    updateTime?: null;
    spuId?: number;
    baseSaleAttrId: number|string;
    saleAttrValueName: string;
    saleAttrName?: string;
    isChecked?: null;
}
//存储已有销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]
//销售属性对象的类型
export interface SaleAttr{
    id?: number;
    createTime: null;
    updateTime: null;
    spuId: number;
    baseSaleAttrId: number|string;
    saleAttrName: string;
    spuSaleAttrValueList: SpuSaleAttrValueList;
    flag?:boolean
    saleAttrValue?:string
}
//已有销售属性返回的类型
export interface SaleAttrResponseData extends ResponseData{
    data:SaleAttr[]
}

//已有的全部spu返回数据类型
export interface HasSaleAttr{
    id: number;
    name: string;
}
export interface HasSaleAttrResponseData extends ResponseData{
    data:HasSaleAttr[]
}
