/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-02-13 14:13:26
 * @LastEditors:
 * @LastEditTime: 2023-07-29 09:15:38
 */
import { request } from 'umi';

// 查询所有角色列表
export async function queryRoleList(params?: any) {
  // return request('/imip/userRole', {
  return request('/phm-web-service-gz/role/show', {
    // params,
    method: 'POST',
    // method: 'GET',
    data: params,
  });
}

// 删除单个角色
export async function deleteRole(id: string) {
  return request(`/phm-web-service-gz/sys/role/delete/${id}`, {
    method: 'POST',
  });
}

// 增加新角色
export async function addRole(params?: any) {
  return await request('/phm-web-service-gz/sys/role/add', {
    method: 'POST',
    data: params,
  });
}
// 编辑角色
export async function editRole(params?: any) {
  return request('/phm-web-service-gz/sys/role/edit', {
    method: 'POST',
    data: params,
  });
}

// 查询所有的菜单
export async function queryTreeList() {
  return request('/phm-web-service-gz/sys/role/queryTreeList', {});
}

// // 根据条件筛选角色的权限
// export async function queryRolePermission(params?: any) {
//   return request('/phm-web-service-gz/sys/permission/queryRolePermission', {
//     method: 'GET',
//     params,
//   });
// }
// 根据条件筛选角色的权限
export async function queryRolePermission(roleId: string) {
  return request(`/phm-web-service-gz/sys/permission/queryRolePermission/${roleId}`, {
    method: 'GET',
    // params,
  });
}
// 保存角色的权限。
export async function saveRolePermission(params?: any) {
  return request('/phm-web-service-gz/sys/permission/saveRolePermission', {
    method: 'POST',
    data: params,
  });
}
