/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-03-07 15:00:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-12 14:12:49
 */
import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { useLocation, useModel } from 'umi';
import { useSelector, Provider } from 'react-redux';
import store from '@/store';
export interface AccessProps {
  path?: string; // 指定
  auth: string; // 匹配的权限字符串
  fallback?: React.ReactNode; // 无权限时的显示，默认无权限不显示任何内容
}

const Access: React.FC<AccessProps> = (props) => {
  const { auth, loading = false, fallback = null, spinProps = {}, children, path } = props;
  const location = useLocation();
  const { pathname } = location || {};
  // console.log('props');
  // console.log(props);
  // console.log('location');
  // console.log(location);
  // console.log('pathname');
  // console.log(pathname);
  // https://blog.csdn.net/ftell/article/details/122707846
  // const mxcAuthList1 = useSelector((state: any) => state);
  // console.log('mxcAuthList1');
  // console.log(mxcAuthList1);
  // const [authList, setAuthList] = useState<string[]>([]);

  // useEffect(() => {
  //   if (initialState && initialState.currentUser?.authList) {
  //     if (initialState.currentUser.authList) {
  //       setAuthList(initialState.currentUser.authList);
  //     }
  //   }
  // }, []);
  const { initialState } = useModel('@@initialState');
  const authList = initialState?.currentUser?.authList;
  // console.log('initialState');
  // console.log(initialState);
  const mxcAuthList = authList == undefined ? [] : authList;
  // const mxcAuthList = [
  //   //按钮权限的配置
  //   '/menu1/auth_menu',
  //   '/menu1/auth_add',
  //   '/menu1/auth_delete',
  //   '/system/UserList/auth_add',
  // ];
  console.log(mxcAuthList.includes(`${path ? path : pathname}:${auth}`));
  const accessible = useMemo(() => {
    console.log(`${path ? path : pathname}/${auth}`);
    return (
      mxcAuthList.includes(`${path ? path : pathname}:${auth}`) ||
      mxcAuthList.includes(`${pathname} `)
    );
    // return mxcAuthList[pathname].includes( auth  );
  }, [location, auth, mxcAuthList]);

  return <>{accessible ? children : fallback}</>;
};

export default Access;
