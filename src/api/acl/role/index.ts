import request from "@/utils/request"
import type {RoleResponseData,MenuResponseData} from './type.ts'
import {RoleData} from "./type.ts";
enum API{
    // 获取全部职位接口
    ALLROLE_URL='/admin/acl/role/',
    //新增角色
    ADDROLE_URL='/admin/acl/role/save',
    //修改角色
    UPDATEROLE_URL='/admin/acl/role/update',
    //获取全部菜单数据
    ALLPERMISSION='/admin/acl/permission/toAssign/',
    //给角色分配权限
    SETPERMISSION_URL='/admin/acl/permission/doAssign/?',
    //删除角色
    REMOVEROLE_URL='/admin/acl/role/remove/'
}
//获取全部角
export const reqAllRoleList = (page:number,limit:number,roleName:string) =>request.get<any,RoleResponseData>(API.ALLROLE_URL+`${page}/${limit}/?roleName=${roleName}`)
//新增角色与修改角色
export const reqAddOrUpdateRole = (data:RoleData) =>{
  if(data.id){
      return request.put<any,any>(API.UPDATEROLE_URL,data)
  }else {
      return request.post<any,any>(API.ADDROLE_URL,data)
  }
}
//获取全部菜单数据
export const reqAllMenuList = (roleId:number) =>request.get<any,MenuResponseData>(API.ALLPERMISSION+roleId)
//给角色分配权限
export const reqSetPermission = (roleId:number,permissionId:number[]) =>request.post(API.SETPERMISSION_URL+`roleId=${roleId}&permissionId=${permissionId}`)
//删除角色
export const reqRemoveRole = (roleId:number) =>request.delete<any,any>(API.REMOVEROLE_URL+roleId)
