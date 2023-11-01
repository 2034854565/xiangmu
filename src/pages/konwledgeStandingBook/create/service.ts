import { request } from 'umi';

export async function createKnowledgeData(params: any) {
  return request('/imip/knowledge/add', {
    method: 'POST',
    data: {
      ...params,
    }
  });
}

export async function queryTreeData() {
  return request('/imip/knowledge/level', {
    method: 'GET',
  });
}

export async function uploadAttachment(params: any) {
  return request('/imip/file/upload', {
    method: 'POST',
    body: params,
  });
}

export async function removeFile(params: any) {
  return request('/imip/file/delete', {
    method: 'GET',
    params,
  });
}

export async function getKnowledgeById(params: any) {
  return request('/imip/knowledge', {
    method: 'GET',
    params,
  });
}

export async function queryMethodsData() {
  return request('/imip/methods/connection', {
    method: 'GET',
  });
}