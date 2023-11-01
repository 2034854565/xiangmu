import { request } from 'umi';
import {
  TableListParams,
  TableListItem,
  DepartIdListParams,
  DeleteListParams,
  AditParams,
  DeleteBatchParams,
  UpdataPasswordParams,
} from './data.d';

// 系统列表接口
export async function permissionList(params: any) {
  return request('/phm-web-service-gz/sys/permission/list', {
    method: 'POST',
    data: params,
  });
}
export async function queryPermissionList(params: any) {
  return request('/phm-web-service-gz/sys/permission/list', {
    method: 'POST',
    data: params,
  });
}
// 新增菜单
export async function permissionAdd(params: any) {
  return request('/phm-web-service-gz/sys/permission/add', {
    method: 'POST',
    data: params,
  });
}

// //  删除
export async function permissionDelete(params: any) {
  return request('/phm-web-service-gz/sys/permission/delete', {
    method: 'DELETE',
    params,
  });
}

// //  删除
export async function permissionDeleteBatch(params: any) {
  return request('/phm-web-service-gz/sys/permission/deleteBatch', {
    method: 'DELETE',
    params,
  });
}
// // 编辑
export async function permissionUpdate(params: any) {
  return request('/phm-web-service-gz/sys/permission/edit', {
    method: 'PUT',
    data: params,
  });
}

// // 查询用户列表
// export async function queryUserList(params?:
//   any) {
//   return request('/phm-web-service-gz/sys/list', {
//     return request('/phm-web-service-gz/sys/list', {
//     params
//   });
// }

// // 添加用户
export async function addRule(params: TableListItem) {
  return request('/phm-web-service-gz/sys/add', {
    method: 'POST',
    data: {
      id: params.id,
      username: params.username,
      realname: params.realname,
      phone: params.phone,
      email: params.email,
      password: params.password,
      sex: params.sex,
      selectedroles: params.selectedroles,
    },
  });
}

// //  删除用户
export async function removeRule(params: TableListParams) {
  return request('/phm-web-service-gz/sys/delete', {
    method: 'DELETE',
    params,
  });
}
