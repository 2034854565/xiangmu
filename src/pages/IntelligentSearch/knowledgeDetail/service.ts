import { request } from 'umi';
import type { Params, ListItemDataType } from './data.d';

export async function queryFakeList(params?: Params): Promise<{ data: { list: ListItemDataType[] } }> {
  return request('/api/knowledge_list', {
    method: 'GET',
    params,
  });
}

export async function getKnowledgeDetail(params: any) {
  return request('/imip/knowledge', {
    method: 'GET',
    params,
  });
}

export async function getConnectionMethods(params: any) {
  return request('/imip/knowledge/connectionMethods', {
    method: 'GET',
    params,
  });
}