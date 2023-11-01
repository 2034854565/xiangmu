import React from 'react';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading, MenuDataItem } from '@ant-design/pro-layout';
import { RunTimeLayoutConfig, RequestConfig, useModel, useLocation } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import * as Icon from '@ant-design/icons';
import { queryRoutesTree } from './services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import userIcon from '@/assets/tx.jpg';
import { getUserInfo } from '../src/pages/user/Login/service';
import { message, notification } from 'antd';
import OuterCom from './pages/OuterCom';
import { useDispatch } from 'react-redux';
import { isNull } from 'lodash';
import { stringify } from 'querystring';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
const getAccess = () => {
  console.log('getAccess');
  console.log(localStorage.getItem('roleNameID'));
  return localStorage.getItem('roleNameID');
};
// 菜单权限控制
// 处理图标
const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
  menus.map(({ icon, children, ...item }) => {
    return {
      ...item,
      access: 'true',
      icon: icon && React.createElement(Icon[icon]),
      children: children && loopMenuItem(children),
    };
  });

interface MenuItem {
  name?: string;
  path?: string;
  menu?: { name?: string };
  icon?: string;
  component?: string;
  routes?: MenuItem[];
}

const handleMenuData = (originData) => {
  let tempArr: MenuItem[] = [];
  originData.map((item) => {
    let tempObj: MenuItem = {};
    tempObj.path = item.path;
    tempObj.menu = { name: item.meta.title };
    if (!!item.component) tempObj.component = item.component;
    tempObj.icon = item.meta.icon;
    if (!!item.children) {
      tempObj.routes = handleMenuData(item.children);
    }
    tempArr.push(tempObj);
  });

  return tempArr;
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  // const fetchUserInfo = async () => {
  //   try {
  //     const msg = await queryCurrentUser();
  //     return msg.data;
  //   } catch (error) {
  //     history.push(loginPath);
  //   }
  //   return undefined;
  // };
  const fetchUserInfo = async () => {
    try {
      // const currentUser = await queryCurrent().response.result.user;
      const currentUser = {
        name: '超级管理员',
        avatar: userIcon,
        access: getAccess(),
      };
      return currentUser;
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  };
  //若同一浏览器登录两个账号时:
  // if (!isNull(sessionStorage.getItem('token')) && isNull(localStorage.getItem('token'))) {
  //   sessionStorage.clear();
  // }
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login' && !localStorage.getItem('token')) {
    history.push('/user/login');
  }
  // else if (!isNull(localStorage.getItem('token')) && history.location.pathname == '/user/login') {
  //   sessionStorage.setItem('token', localStorage.getItem('token'));
  //   message.info('已有登录用户信息');
  //   window.location.href = '/fan/1';
  // }

  if (history.location.pathname !== '/user/login' && history.location.pathname !== '/') {
    const token = localStorage.getItem('token');

    if (token) {
      // console.log(' token');
      // console.log(token);
      // console.log(localStorage.getItem('access_token'));

      // sessionStorage.setItem('token', token);
      try {
        // const user = await getUserInfo();
        const res = await getUserInfo(token);
        // console.log('getUserInfo');
        // console.log(res);
        // const menuData = await queryRoutesTree(token);
        // const authList = menuData.result.allAuth

        const user = {
          data: {
            userInfo: res.data,
            account: res.data.account,
            id: res.data.account,
            authList: res.data.allAuth,
          },
        };
        //TODO:确定字段对应
        localStorage.setItem('userId', user.data.userInfo.userId);
        localStorage.setItem('actionUsername', user.data.userInfo.account);
        const currentUser = {
          name: user.data.userInfo.realName,
          account: res.data.account,
          userId: user.data.id,
          userRoleId: res.data.userRoleId,
          avatar: userIcon,
          permission: user.data.userInfo.permission,
          authList: user.data.authList,
        };
        return {
          // fetchUserInfo,
          currentUser,
          settings: defaultSettings,
        };
      } catch (error) {
        // history.push('/user/login');
      }
    } else {
      // sessionStorage.setItem('token', localStorage.getItem('token'));
      history.push('/user/login');
    }
  } else {
    history.push('/user/login');
  }
  return {
    // fetchUserInfo,
    // currentUser: undefined,
    settings: defaultSettings,
  };
  // if (history.location.pathname !== loginPath) {
  //   // const currentUser = await fetchUserInfo();
  //   const currentUser = {
  //     name: '超级管理员',
  //     access: getAccess(),
  //   };
  //   return {
  //     fetchUserInfo,
  //     currentUser,
  //     settings: {},
  //   };
  // }
  // return {
  //   fetchUserInfo,
  //   settings: {},
  // };
}

// rootContainer修改交给 react-dom 渲染时的根组件。
// 比如用于在外面包一个 Provider
// https://juejin.cn/post/7074452266719281189
// export function rootContainer(container: any) {
//   return React.createElement(OuterCom, null, container);
// }

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    collapsed: true,
    footerRender: () => <Footer />,
    onPageChange: async () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== '/user/login') {
        history.push('/user/login');
      }
      if (!localStorage.getItem('token') && location.pathname !== '/user/login') {
        history.push('/user/login');
      }

      // const authList = ['/fan/1', '/user/login'];
      // let menuData: any[];
      // const tokenTemp = localStorage.getItem('token')
      // const params = { token: tokenTemp }

      //   menuData = await queryRoutesTree(params);
      // for (let i=0;i<menuData.length;i++){
      //   initialState?.currentUser?.authList?.push( menuData?.data?.menu[i]['path'])
      // }
      // console.log("initialState11", initialState?.currentUser?.authList);

      //     if (menuData.length>0) {
      //       if (!initialState?.currentUser?.authList.includes(location.pathname)) {
      //         //TODO: 401 page
      //         const path = menuData?.data?.menu.filter((item)=>item.path==location.pathname)
      //         if (path.length==0){
      //           history.push('/user/login');
      //         }

      //       }

      // }
      // if (location.pathname!='/overview'){
      //   if (location.pathname!='/fan/:activeKey'){
      //     if (!initialState?.currentUser?.authList.includes(location.pathname)){
      //       history.push('/user/login');
      //     }
      //   }

      // }
    },
    menu: {
      params: {
        token: localStorage.getItem('token'),
      },
      request: async (params, defaultMenuData) => {
        // console.log(localStorage.getItem('access_token'));
        // console.log(localStorage.getItem('token'));

        if (localStorage.getItem('token')) {
          const menuData = await queryRoutesTree(params);
          // console.log('menuData');
          // console.log(menuData);
          // console.log('menuData?.data.menu');
          console.log('菜单', params);
          if (menuData?.data.menu?.length >= 0) {
            // if (false) {
            const data = menuData;

            const startdRoutes = handleMenuData(data.data.menu);
            // console.log('startdRoutes');
            // console.log(startdRoutes);

            startdRoutes.unshift({
              path: '/user',
              routes: [
                {
                  path: '/user',
                  routes: [
                    {
                      name: 'login',
                      path: '/user/login',
                      component: './user/login',
                    },
                  ],
                },
              ],
            });
            startdRoutes.push({
              component: './404',
            });
            // TODO:startdRoutes 数据格式
            // console.log('startdRoutes');
            // console.log(startdRoutes);
            const result = loopMenuItem(startdRoutes);
            // console.log('loopMenuItem(startdRoutes)');
            console.log('caidan', result);
            return result;
          } else {
            return null;
          }
        }
      },
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  // 400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  // 401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  // 420: '数据已存在',
};

/**
 * 异常处理程序
 */
const errorHandler = async (error: { response: Response }) => {
  const { response } = error;
  let result = await response.clone().json();
  console.log('result');
  console.log(result);

  if (response && response.status) {
    const errorText = codeMessage[response.status] || result.msg || result.detail;

    const { status, url } = response;
    // : ${url}
    notification.config({ maxCount: 1 });
    notification.error({
      message: `请求错误 ${status}`,
      description: errorText,
    });

    if (status == 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      setTimeout(function () {
        window.location.replace('/user/login');
      }, 1500);
    }
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};
const token_interceptor = (url: any, options: any) => {
  // console.log('url');
  // console.log(url);
  const accessToken = localStorage.getItem('token');
  let headers = {};
  if (accessToken) {
    if (['/api/fan/add'].includes(url)) {
      // 上传formData类型不设置header Content-Type 和 Accept
      headers = {
        token: `${accessToken}`,
      };
    } else {
      headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        token: `${accessToken}`,
        // Authorization: `Bearer ${accessToken}`,
      };
    }

    return {
      url,
      options: { ...options, headers },
    };
  }
  return {
    url,
    options: { ...options },
  };
};
export const request: RequestConfig = {
  requestInterceptors: [token_interceptor],
  errorHandler,
  // openNotification,
};
