import { request } from 'umi';

export async function getMethodDetail(params: any) {
  return request('/imip/methods', {
    method: 'GET',
    params,
  });
}

export async function getMethodCategory() {
  return request('/imip/methods/category', {
    method: 'GET',
  });
}

export async function getScoreById(params: any) {
  return request('/imip/score', {
    method: 'GET',
    params,
  });
}

export async function getConnectionCases(params: any) {
  return request('/imip/methods/connectionCases', {
    method: 'GET',
    params,
  });
}

export async function getConnectionKnowledge(params: any) {
  return request('/imip/methods/connectionKnowledge', {
    method: 'GET',
    params,
  });
}