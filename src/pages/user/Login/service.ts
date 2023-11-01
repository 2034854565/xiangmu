import { request } from 'umi';

export async function userLogin(params: any) {
  return request('/api/user/login', {
    method: 'POST',
    data: params,
  });
}
export async function getUserInfo1() {
  return request('/api/user/list', {
    method: 'GET',
  });
}
export async function getUserInfo(token: string) {
  return request('/api/user/currentUser', {
    method: 'GET',
    // data: token,
  });
}
