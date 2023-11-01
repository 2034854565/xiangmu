import { request } from 'umi';
 

export async function queryGroupList(params: any) {
  // return request('/phm-web-service-gz/sys/list', {
  return request('/api/sys/group/show', {
    method: 'POST',
    data: params,
  });
}
// // 添加用户
export async function addRule(params: any) {
  return request('/api/sys/group/add', {
    method: 'POST',
    data: params,
  });
}

// //  删除用户
// export async function removeRule(params: TableListParams) {
export async function removeRule(params: { id: string }) {
  // return request('/phm-web-service-gz/sys/delete', {
  return request('/api/sys/group/delete', {
    method: 'DELETE',
    data: params,
  });
}

// // 编辑用户
// export async function updateRule(params: EditParams) {
export async function updateRule(params: any) {
  return request('/api/sys/group/update', {
    method: 'PUT',
    data: params,
  });
}
