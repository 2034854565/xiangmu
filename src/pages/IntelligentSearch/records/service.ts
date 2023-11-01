import { request } from 'umi';
import type { Params, ListItemDataType } from './data.d';

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

export async function giveLike(params: any) {
  return request('/imip/article/like', {
    method: 'POST',
    params,
  });
}

export async function giveDisLike(params: any) {
  return request('/imip/article/dislike', {
    method: 'POST',
    params,
  });
}

export async function giveStore(params: any) {
  return request('/imip/article/store', {
    method: 'POST',
    params,
  });
}

export async function giveUnStore(params: any) {
  return request('/imip/article/unStore', {
    method: 'POST',
    params,
  });
}

export async function getMethodComments(params: any) {
  return request('/imip/method/comment/info', {
    method: 'GET',
    params,
  });
}

export async function getKnowledgeComments(params: any) {
  return request('/imip/knowledge/comment/info', {
    method: 'GET',
    params,
  });
}

export async function addMethodComments(params: any) {
  return request('/imip/method/comment/add', {
    method: 'POST',
    data: params,
  });
}

export async function addKnowledgeComments(params: any) {
  return request('/imip/knowledge/comment/add', {
    method: 'POST',
    data: params,
  });
}

export async function vagueSearch(params: any) {
  return request('/imip/elastic/methodsInfo', {
    method: 'GET',
    params,
  });
}

export async function sortSearch(params: any) {
  return request('/imip/methods/sort', {
    method: 'GET',
    params,
  });
}

export async function giveScore(params: any) {
  return request('/imip/comment/score', {
    method: 'POST',
    data: params,
  });
}