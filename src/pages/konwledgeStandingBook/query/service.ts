import { request } from 'umi';

export async function queryTreeData() {
  return request('/imip/knowledge/level', {
    method: 'GET',
  });
}

export async function queryKnowledgeData(params: any) {
  return request('/imip/knowledge/infos', {
    method: 'GET',
    params,
  });
}

export async function downLoadFile(params: any) {
  return request('/imip/file/download', {
    method: 'GET',
    params,
  });
}

export async function deleteData(params: any) {
  return request('/imip/knowledge/delete', {
    method: 'POST',
    data: params,
  });
}
