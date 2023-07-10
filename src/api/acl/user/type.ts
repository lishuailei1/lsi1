//账号信息ts类型
export interface ResponseData{
    code:number,
    message:string,
    ok:boolean
}
//账号信息的ts类型
export interface User{
    id?: number;
    createTime?: string;
    updateTime?: string;
    username?: string;
    password?: string;
    name?: string;
    phone?: any;
    roleName?: string;
}
//数组包含全部用户信息
export type Records = User[]
//接口返回的全部数据类型
    export interface UserResponseData extends ResponseData{
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

//代表职位的ts类型
export interface RoleData{
    id?: number;
    createTime?: string;
    updateTime?:string;
    roleName: string;
    remark?: string
}
//全部职位列表
export type AllRole = RoleData[]
//获取接口返回的全部数据的ts类型
export interface AllRoleResponseData extends ResponseData{
    data:{
        assignRoles:AllRole
        allRolesList:AllRole
    }
}

//分配角色携带参数的ts类型
export interface SetRoleData{
    roleIdList:number[]
    userId:number
}
