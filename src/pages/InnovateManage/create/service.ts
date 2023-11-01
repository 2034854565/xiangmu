import { request } from 'umi';

export async function getMethodCategory() {
  return request('/imip/methods/category', {
    method: 'GET',
  });
}

export async function createMethodData(params: any, status: any) {
  console.log(params, status)
  return request(`/imip/methods/add?status=${status}`, {
    method: 'POST',
    data: {
      ...params,
    }
  });
}

export async function getConnectCase() {
  return request('/imip/case/connection', {
    method: 'GET',
  });
}

export async function getConnetKnowledge() {
  return request('/imip/knowledge/connection', {
    method: 'GET',
  });
}

export async function getMethodById(params: any) {
  return request('/imip/methods', {
    method: 'GET',
    params,
  });
}
