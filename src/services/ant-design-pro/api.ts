// @ts-ignore
/* eslint-disable */
import { request, useModel } from 'umi';
import moment from 'moment';

export type LoginParamsType = {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
  status: string;
};
export type CurrentUser = {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userId?: string;
  access?: 'user' | 'guest' | 'admin';
  unreadCount?: number;
  permission: number[];
};

export type LoginStateType = {
  code: number;
  message: string;
  result: any;
  success: boolean;
  timestamp: number;
  status?: 'ok' | 'error';
  type?: string;
};
/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/user/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
// export async function outLogin(options?: { [key: string]: any }) {
//   return request<Record<string, any>>('/api/login/outLogin', {
//     method: 'POST',
//     ...(options || {}),
//   });
// }

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/login/captcha?mobile=${mobile}`);
}

// export async function outLogin() {
//   return request('/login/outLogin');
// }

export async function fakeAccountLogin(params: LoginParamsType) {
  return request<LoginStateType>('/phm-web-service-gz/sys/login', {
    method: 'POST',
    data: {
      password: params.password,
      username: params.username,
      // captcha: "1231"
    },
  });
}

export async function outLogin() {
  return request('/phm-web-service-gz/sys/logout', {
    method: 'POST',
  });
}

export async function singleLogin(params: { code: any; redirectUri: any }) {
  return request(
    `/phm-web-service-gz/base/check_login?redirectUri=${params.redirectUri}&code=${params.code}`,
    {
      method: 'GET',
    },
  );
}
// redirectUri=${}

export async function queryUserRole(params: {}) {
  return request(`/phm-web-service-gz/sys/queryUserRole`, {
    method: 'GET',
    params,
  });
}
// 查询用户拥有的菜单信息，登录时调用
// params token
// code
// message 请求成功
// Result 具体数据

export async function queryRoutesTree(params: {}) {
  return request(`/api/user/sys/permission/getUserPermissionByToken`, {
    method: 'GET',
    // params,
  });
}

// const createAt = '';
const username = localStorage.getItem('actionUsername');
const params_1 = { username };
// 用户行为数据存储接口
export async function saveUserAction(params: any) {
  return request(`/api/user_action/add`, {
    method: 'POST',
    data: { ...params_1, ...params.params },
    // data:Object.assign(createAt,...params)
  });
}
