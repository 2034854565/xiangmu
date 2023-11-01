import { request } from 'umi';
import type { Params, ListItemDataType } from './data';

// export async function queryFakeList(
//   params: Params,
// ): Promise<{ data: { list: ListItemDataType[] } }> {
//   return request('/api/test_list', {
//     params,
//   });
// }

// export async function queryFakeList(params?: Params): Promise<{ data: { list: ListItemDataType[] } }> {
//   return request('/api/record_list', {
//     method: 'GET',
//     params,
//   });
// }

export async function queryMethodsData(params?: any) {
  return request('/imip/methods/infos', {
    method: 'GET',
    params,
  });
}

export async function queryKnowledgeData(params: any) {
  return request('/imip/knowledge/infos', {
    method: 'GET',
    params,
  });
}

export async function getMethodCategory() {
  return request('/imip/methods/category', {
    method: 'GET',
  });
}

export async function sortSearch(params: any) {
  return request('/imip/methods/sort', {
    method: 'GET',
    params,
  });
}
