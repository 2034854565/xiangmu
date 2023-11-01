import { request } from 'umi';

export async function queryMethodsData(params: any) {
  return request('/imip/methods/infos', {
    method: 'GET',
    params,
  });
}

export async function deleteMethodsData(params: any) {
  return request('/imip/methods/delete', {
    method: 'POST',
    data: params,
  });
}