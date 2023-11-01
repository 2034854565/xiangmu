/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-03-16 09:28:22
 * @LastEditors:
 * @LastEditTime: 2023-07-12 11:17:52
 */
import { request } from 'umi';

// export async function getFanCategoryAndModelData() {
//   return await request('/api/fan/tree', {
//     method: 'GET',
//     // data: params,params: any
//   });
// }
// export async function queryFansList(params: any) {
//   return request('/api/fan/show', {
//     method: 'POST',
//     data: params,
//   });
// }
// export async function queryFanData(id: any) {
//   return await request(`/api/fan/detail/${id}`, {
//     method: 'POST',
//     // data: params,params: any
//   });
// }
// export async function queryFansPerfData(ids: string[]) {
//   return await request(`/api/perf/show`, {
//     method: 'POST',
//     data: ids,
//   });
// }
export async function hideFansData(params: any) {
  return request('/api/fan/hide', {
    method: 'POST',
    data: params,
  });
}
export async function deleteFansData(params: any) {
  return request('/api/fan/delete', {
    method: 'POST',
    data: params,
  });
}
export async function recoverFansData(params: any) {
  return request('/api/fan/recover', {
    method: 'POST',
    data: params,
  });
}

export async function deleteFanUpdateRecordsData(params: any) {
  return request('/api/fan/deleteRecord', {
    method: 'POST',
    data: params,
  });
}
// export async function deleteMethodsData(params: any) {
//   return request('/imip/methods/delete', {
//     method: 'POST',
//     data: params,
//   });
// }
export async function importFansData(params: any) {
  return request('/api/fan/import/excel', {
    method: 'POST',
    data: params,
  });
}
