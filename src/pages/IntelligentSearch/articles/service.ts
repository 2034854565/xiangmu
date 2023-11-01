import { request } from 'umi';
import type { Params, ListItemDataType } from './data.d';

// export async function queryFakeList(
//   params: Params,
// ): Promise<{ data: { list: ListItemDataType[] } }> {
//   return request('/api/test_list', {
//     params,
//   });
// }

export async function queryFakeList(params?: Params) {
  return request('/api/test_list', {
    method: 'GET',
    params,
  });
}
