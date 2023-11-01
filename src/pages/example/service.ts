import { request } from 'umi';

export async function queryMethodsData(params: any) {
  return request('/imip/methods/infos', {
    method: 'GET',
    params,
  });
}

export async function queryCaseData(params?: any) {
  return request('/imip/case/infos', {
    method: 'GET',
    params,
  });
}

export async function getCaseById(params: any) {
  return request('/imip/case', {
    method: 'GET',
    params,
  });
}
