import { request } from 'umi';
import type { CurrentUser, ListItemDataType } from './data.d';

export async function queryCurrent(): Promise<{ data: CurrentUser }> {
  return request('/api/currentUserDetail');
}

export async function queryFakeList(params: {
  count: number;
}): Promise<{ data: { list: ListItemDataType[] } }> {
  return request('/api/fake_list_Detail', {
    params,
  });
}

export async function getLikeInfo(params: any) {
  return request('/imip/like/userLikeInfo', {
    method: 'GET',
    params,
  });
}

export async function getStoreInfo(params: any) {
  return request('/imip/store/userStoreInfo', {
    method: 'GET',
    params,
  });
}