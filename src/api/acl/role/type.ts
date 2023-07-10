export interface ResponseData{
    code:number,
    message:string,
    ok:boolean
}
//职位数据类型
export interface RoleData{
    id?:number
    createTime?:string
    updateTime?:string
    roleName:string
    remark?:null
}
//全部职务的数组的ts类型
export type Records = RoleData[]
//全部职位数据的相应ts类型
export interface RoleResponseData extends ResponseData {
    data:{
        records:Records
        total: number;
        size: number;
        current: number;
        orders?: any[];
        optimizeCountSql: boolean;
        hitCount: boolean;
        countId?: any;
        maxLimit?: any;
        searchCount: boolean;
        pages: number;
    }
}

//菜单数据的ts类型
export interface MenuData{
    id: number;
    createTime: string;
    updateTime: string;
    pid: number;
    name: string;
    code: string;
    toCode?: any;
    type: number;
    status?: any;
    level: number;
    children?: MenuList;
    select: boolean;
}
export type MenuList = MenuData[]
export interface MenuResponseData extends ResponseData{
    data:MenuList
}
