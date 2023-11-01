//*************************办公网-免登录************** */
import React from 'react';
import { Settings as LayoutSettings, PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import { history, RequestConfig, RunTimeLayoutConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { extend, ResponseError } from 'umi-request';
import { queryCurrent } from './services/user';
import defaultSettings from '../config/defaultSettings';
import EmerNotice from './components/EmerNotice2';

/**
 * 获取用户信息比较慢的时候会展示一个 loading
 */
export const initialStateConfig = {
  loading: <PageLoading />,
};

// 3D跳转
// window.addEventListener("message",
//   (e) => {
//     const data1 = JSON.parse(e.data)
//     if (data1.cmd === "HMI") {
//       history.push(`/Monitor/HMI/${data1.lineCode}/${data1.trainCode}`)
//     } else if (data1.cmd === "3D") {
//       history.push(`/Monitor/3D/${data1.lineCode}/${data1.trainCode}`)
//     }
//   }
//   , false);

const getAccess = () => {
  return 'admin';
};
export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      // const currentUser = await queryCurrent().response.result.user;
      const currentUser = {
        name: '超级管理员',
        access: getAccess(),
      };
      return currentUser;
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  };
  // 如果是登录页面，不执行

  // if (history.location.pathname !== '/user/login' && !localStorage.getItem('access_token')) {
  //   history.push('/user/login');
  // }

  // if (history.location.pathname !== '/user/login' && history.location.pathname !== '/') {
  //   if (localStorage.getItem('access_token')) {
  //     try {
  //       const currentUser = await fetchUserInfo();
  //       return {
  //         fetchUserInfo,
  //         currentUser,
  //         settings: defaultSettings,
  //       };
  //     } catch (error) {
  //       history.push('/user/login');
  //     }
  //   } else {
  //     history.push('/user/login');
  //   }
  // }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    logo: false,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => (
      <div>
        {/* {history.location.pathname !== '/user/login' && localStorage.getItem('access_token') ? <EmerNotice /> : null} */}
      </div>
    ),
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== '/user/login') {
      //   history.push('/user/login');
      // }
      // if (!localStorage.getItem('access_token') && location.pathname !== '/user/login') {
      //   history.push('/user/login');
      // }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
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
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    if (status === 401) {
      localStorage.removeItem('access_token');
    }
    // : ${ url }
    notification.error({
      message: `请求错误 ${status}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

// 加入token验证
const tokenInterceptor = (url, options) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // 'X-Access-Token': `${accessToken}`,
  };
  return {
    url,
    options: { ...options, headers },
  };
};

// const tokenInterceptor = (url, options) => {
//   const accessToken = localStorage.getItem('access_token');
//   if (accessToken) {
//     const headers = {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//       'X-Access-Token': `${accessToken}`,
//     };
//     return {
//       url,
//       options: { ...options, headers },
//     };
//   }
//   return {
//     url,
//     options: { ...options },
//   };
// };

export const request: RequestConfig = {
  requestInterceptors: [tokenInterceptor],
  errorHandler,
};
