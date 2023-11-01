import { request } from 'umi';

export async function queryMethodsData(params: any) {
  return request('/imip/methods/infos', {
    method: 'GET',
    params,
  });
}
