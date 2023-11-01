/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-05-25 10:50:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-08 15:17:52
 */
import { request } from 'umi';

// // 添加用户
export async function queryCategory(params: any) {
  return request('/api/fan/category/show', {
    method: 'POST',
    data: params,
  });
}
export async function addCategory(params: any) {
  return request('/api/fan/category/add', {
    method: 'POST',
    data: params,
  });
}
export async function deleteCategory(params: any) {
  return request('/api/fan/category/delete', {
    method: 'DELETE',
    params,
  });
}
export async function updateCategory(params: any) {
  return request('/api/fan/category/edit', {
    method: 'PUT',
    data: params,
  });
}
