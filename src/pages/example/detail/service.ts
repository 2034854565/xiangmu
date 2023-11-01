import { request } from 'umi';

export async function getCaseById(params: any) {
  return request('/imip/case', {
    method: 'GET',
    params,
  });
}

export async function getConnectionMethods(params: any) {
  return request('/imip/case/connectionMethods', {
    method: 'GET',
    params,
  });
}