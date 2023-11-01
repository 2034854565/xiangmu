/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-07-17 10:34:57
 * @LastEditors:
 * @LastEditTime: 2023-07-17 10:39:58
 */
import { request } from 'umi';

export async function getFanCategoryAndModelData() {
  return request('/api/fan/tree', {
    method: 'GET',
    // data: params,params: any
  });
}
export async function querySimilarFansList(params: any) {
  return request('/api/fan/similar/show', {
    method: 'POST',
    data: params,
  });
}
export async function queryFansList(params: any) {
  return request('/api/fan/auditShow', {
    method: 'POST',
    data: params,
  });
}
export async function queryFanData(id: string) {
  // console.log('useEffect queryFanData model');
  // console.log(model);/${model}
  return request(`/api/fan/detail`, {
    method: 'POST',
    // data:
    params: { id: id },
  });
}
export async function queryFansPerfData(ids: string[]) {
  return request(`/api/perf/show/list`, {
    method: 'POST',
    data: ids,
  });
}
export async function queryFanPerfData(id: string) {
  // /${model}
  return request(`/api/perf/detail`, {
    method: 'POST',
    params: { id: id },
  });
}
export async function queryFanPerfOriginData(id: string) {
  // /${model}
  return request(`/api/perf/show`, {
    method: 'POST',
    params: { id: id },
  });
}
export async function deleteMethodsData(params: any) {
  return request('/imip/methods/delete', {
    method: 'POST',
    data: params,
  });
}
export async function getPassedFanVersionData(params: any) {
  return await request('/api/fan/getPassedFanVersionData', {
    method: 'POST',
    data: params,
  });
}
