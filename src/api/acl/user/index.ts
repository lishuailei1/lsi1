import request from "@/utils/request";
import type {UserResponseData,User,AllRoleResponseData,SetRoleData} from "./type";

enum API {
    //获取全部已有用户的账号信息
    ALLUSER_URL = '/admin/acl/user/',
    //新增用户
    ADDUSER_URL='/admin/acl/user/save',
    //修改用户
    UPDATEUSER_URL='/admin/acl/user/update',
    //根据用户获取角色数据
    ALLROLE_URL='/admin/acl/user/toAssign/',
    //根据用户分配角色
    SETROLE_URL='/admin/acl/user/doAssignRole',
    //删除管理用户
    REMOVEROLE_URL='/admin/acl/user/remove/',
    //批量删除用户
    DELETEALLUSER_URL='/admin/acl/user/batchRemove'
}

//获取全部已有用户的账号信
export const reqUserInfo = (page: number, limit: number,username:string) => request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`)
//添加或者修改用户
export  const reqAddOrUpdateUser = (data:User) =>{
    if(data.id){
        return request.put<any,any>(API.UPDATEUSER_URL,data)  //修改用户
    }else {
        return  request.post<any,any>(API.ADDUSER_URL,data)  //添加用户
    }
}
//根据用户获取角色数据
export const reqAllRole = (adminId:number)=>request.get<any,AllRoleResponseData>(API.ALLROLE_URL+adminId)
//根据用户分配角色
export const reqSetRole = (data:SetRoleData) =>request.post<any,any>(API.SETROLE_URL,data)
//删除管理用户
export const reqRemoveUser = (id:number) =>request.delete<any,any>(API.REMOVEROLE_URL+id)
//批量删除用户
export const reqSelectUser = (idList:number[])=>request.delete<any,any>(API.DELETEALLUSER_URL,{data:idList})
