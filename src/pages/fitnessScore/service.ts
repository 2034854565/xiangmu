import { request } from 'umi';

export async function getMethodCategory() {
  return request('/imip/methods/category', {
    method: 'GET',
  });
}

export async function getMethodScore(params: any) {
  return request('/imip/score/infos', {
    method: 'GET',
    params,
  });
}

export async function getMethodsById(params: any) {
  return request('/imip/methods', {
    method: 'GET',
    params,
  });
}

export async function getMethodsName() {
  return request('/imip/methods/all', {
    method: 'GET',
  });
}

export async function addScore(params: any) {
  return request('/imip/score/add', {
    method: 'POST',
    data: params,
  });
}

export async function updateScore(params: any) {
  return request('/imip/score/update', {
    method: 'POST',
    data: params,
  });
}

export async function getScoreById(params: any) {
  return request('/imip/score', {
    method: 'GET',
    params,
  });
}

export async function deleteScore(params: any) {
  return request('/imip/score/delete', {
    method: 'POST',
    data: params,
  });
}