export interface ResponseData{
    code:number,
    message:string,
    ok:boolean
}
//定义sku对象的ts类型
export interface Attr{
    attrId: number|string;
    valueId: number|string;
}
export interface saleAttr{
    saleAttrId: number|string;
    saleAttrValueId: number|string;
}
export interface SkuData{
    category3Id: number|string;
    spuId: number|string;
    tmId: number|string;
    skuName: string;
    price: number|string;
    weight: string|number;
    skuDesc: string;
    skuAttrValueList?: Attr[]
    skuSaleAttrValueList?:saleAttr[]
    skuDefaultImg: string;
}
//获取sku返回的数据ts类型
export interface SkuResponseData extends ResponseData{
    data:{
        records:SkuData[]
        "total": number,
        "size": number,
        "current": number,
        "orders": [],
        "optimizeCountSql": boolean,
        "hitCount": boolean,
        "countId": null,
        "maxLimit": null,
        "searchCount": boolean,
        "pages": number
    }
}
