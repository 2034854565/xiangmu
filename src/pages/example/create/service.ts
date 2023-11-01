import { request } from 'umi';

export async function createKnowledgeData(params: any) {
  return request('/imip/knowledge/add', {
    method: 'POST',
    data: {
      ...params,
    }
  });
}

export async function getCaseById(params: any) {
  return request('/imip/case', {
    method: 'GET',
    params,
  });
}

export async function removeFile(params: any) {
  return request('/imip/file/delete', {
    method: 'GET',
    params,
  });
}

export async function queryMethodsData() {
  return request('/imip/methods/connection', {
    method: 'GET',
  });
}