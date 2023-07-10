export interface ResponseData{
    code:number,
    message:string,
    ok:boolean
}
//菜单数据与按钮数据的ts类型
export interface Permission{
    id?: number;
    createTime: string;
    updateTime: string;
    pid: number;
    name: string;
    code: string;
    toCode?: any;
    type: number;
    status?: any;
    level: number;
    children?: PermissionList;
    select: boolean;
}
export type PermissionList = Permission[]
//菜单接口返回的全部数据ts类型
export interface PermissionResponseData extends ResponseData{
    data:PermissionList
}

//添加与修改菜单携带参数的ts类型
export interface MenuParams{
    id?:number,
    code:string,
    level:number,
    name:string,
    pid:number
}
