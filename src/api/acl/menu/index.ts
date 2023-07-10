import request from "@/utils/request";
import type {PermissionResponseData,MenuParams} from './type.ts'
enum Api{
    ALLPERMISSION_URL='/admin/acl/permission',   //获取菜单
    ADDMENU_URL='/admin/acl/permission/save',    //新增菜单
    UPDATE_URL='/admin/acl/permission/update',   //修改菜单
    DELETEMENU_URL='/admin/acl/permission/remove/', //删除菜单
}
//获取菜单
export const reqAllPermission = () =>request.get<any,PermissionResponseData>(Api.ALLPERMISSION_URL)
//新增与修改菜单
export const reqAddOrUpdateMenu = (data:MenuParams) =>{
    if(data.id){
        return request.put<any,any>(Api.UPDATE_URL,data)
    }else {
        return request.post<any,any>(Api.ADDMENU_URL,data)
    }
}
//删除菜单
export const reqDeleteMenu = (id:number) =>request.delete(Api.DELETEMENU_URL+id)
