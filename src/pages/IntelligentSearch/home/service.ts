import { request } from 'umi';

export async function getMethodCategory() {
  return request('/imip/methods/category', {
    method: 'GET',
  });
}

export async function queryMethodsData(params?: any) {
  return request('/imip/methods/infos', {
    method: 'GET',
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