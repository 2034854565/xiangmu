import { request } from 'umi';
import {
  TableListParams,
  TableListItem,
  DepartIdListParams,
  DeleteListParams,
  DeleteBatchParams,
  UpdataPasswordParams,
  EditParams,
} from './data.d';
// 查询用户列表
// export async function queryUserList(params?: any) {
//   return request('/api/user/getInfos', {
//     params,
//   });
// }
// export async function queryUsersList(params: any) {
//   return request('/api/user/show', {
//     method: 'POST',
//     data: params,
//   });
// }
export async function queryUserLevel() {
  return request('/api/user/level', {
    method: 'GET',
  });
}
export async function queryUserLine() {
  return request('/api/user/line', {
    method: 'GET',
  });
}
export async function queryUserPost() {
  return request('/api/user/post', {
    method: 'GET',
  });
}
export async function queryUserDepartment(params: any) {
  return request('/api/sys/department/show', {
    method: 'POST',
    data: params,
  });
}
export async function queryUserList(params: any) {
  // return request('/phm-web-service-gz/sys/list', {
  return request('/api/user/show', {
    method: 'POST',
    data: params,
  });
}
// // 添加用户
export async function addRule(params: any) {
  return request('/api/user/add', {
    method: 'POST',
    data: params,
  });
}
export async function addUsers(params: any) {
  return request('/api/user/add/list', {
    method: 'POST',
    data: params,
  });
}

// //  删除用户
// export async function removeRule(params: TableListParams) {
export async function removeRule(params: { id: string }) {
  // return request('/phm-web-service-gz/sys/delete', {
  return request('/api/user/delete', {
    method: 'DELETE',
    params,
  });
}

// // 编辑用户
// export async function updateRule(params: EditParams) {
export async function updateRule(params: any) {
  return request('/api/user/update', {
    method: 'PUT',
    data: params,
  });
}

// 用户详情
export async function userInfo(params?: any) {
  return request('/imip/user/list', {
    params,
  });
}

// 查询所有角色列表
export async function userRoleList(params?: any) {
  return request('/imip/user/roleInfos', {
    params,
  });
}
// 校验用户账号是否唯一
export async function checkOnly(params: { username: string }) {
  return request(`/phm-web-service-gz/sys/checkOnlyUser?username=${params.username}`, {
    method: 'GET',
  });
}

//根据id查看用户角色
export async function queryUserRole(params: { id: string }) {
  // return request(`/imip/userRole`, {
  return request('/api/user/role', {
    // method: 'GET',
    method: 'POST',
    data: params,
  });
}
export async function UserRole() {
  // return request(`/imip/userRole`, {
  return request('/phm-web-service-gz/role/all', {
    method: 'GET',
  });
}

// 修改用户密码
export async function updatePassword(params: UpdataPasswordParams) {
  return request('/api/user/sys/changePassword ', {
    method: 'PUT',
    data: {
      id: params.id,
      account: params.account,
      password: params.password,
    },
  });
}
// 修改用户密码
export async function userUpdatePassword(params: any) {
  return request('/api/user/sys/updatePassword ', {
    method: 'PUT',
    data: params,
  });
}
export async function getUserById(params: { id: String }) {
  return request(`/api/user/get/${params.id}`, {
    method: 'GET',
    // params,
  });
}
