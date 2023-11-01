/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-05-25 10:50:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-26 14:28:19
 */
import { request } from 'umi';

// // 添加用户
export async function queryDepartment(params: any) {
  return request('/api/sys/department/show', {
    method: 'POST',
    data: params,
  });
}
export async function addDepartment(params: any) {
  return request('/api/sys/department/add', {
    method: 'POST',
    data: params,
  });
}
export async function deleteDepartment(params: any) {
  return request('/api/sys/department/delete', {
    method: 'DELETE',
    params,
  });
}
export async function updateDepartment(params: any) {
  return request('/api/sys/department/edit', {
    method: 'PUT',
    data: params,
  });
}
