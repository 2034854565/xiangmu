/*
 * @Author: ljx luojiaxincap@163.com
 * @Date: 2023-01-09 19:06:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-24 10:49:49
 * @FilePath: \psad-front\src\pages\fan\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { layout } from '@/app';
import Access from '@/components/Access';
import { CurrentUser } from '@/services/ant-design-pro/api';
import { Card, Tabs } from 'antd';
// import { TabsProps } from 'antd/es/tabs';
import type { TabsProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import Create from './create';
// import FanInfo from './fanInfo';
import FanManage from './manage';
import FanSelection from './selection';
import FanSimilarDesign from './similarDesign';
import View from '../overview/view';
import { PageContainer } from '@ant-design/pro-layout';
import AuditManage from './auditManage';
import AuditView from './auditView';

const Fan: React.FC<{}> = (props) => {
  // console.log('Fan props');
  // console.log(props);

  let { activeKey = '0' } = props.match.params;

  // console.log('activeKey');
  // console.log(activeKey);
  if (activeKey == ':activeKey') {
    activeKey = '0';
  }

  const { initialState } = useModel('@@initialState');

  const permission =
    initialState?.currentUser?.permission == undefined ? [] : initialState?.currentUser?.permission;
  const authList =
    initialState?.currentUser?.authList == undefined ? [] : initialState?.currentUser?.authList;
  // const [permission, setPermission] = useState<number[]>([]);
  // const [authList, setAuthList] = useState<string[]>([]);

  // const { permission } = initialState?.currentUser;
  // useEffect(() => {
  //   if (initialState && initialState.currentUser) {
  //     // setCurrentUser(initialState.currentUser);
  //     if (initialState.currentUser.permission) {
  //       setPermission(initialState.currentUser.permission);
  //       setAuthList(initialState.currentUser.authList);
  //     }
  //   }
  // }, []);

  console.log('Fan initialState.currentUser');
  console.log(initialState?.currentUser);
  const items: TabsProps['items'] | any = [
    {
      key: '0',
      label: `产品介绍`,
      children: <View />,
    },
    // {
    //   key: '0',
    //   label: `产品介绍`,
    //   children: <FanInfo />,
    // },
    authList.includes('/fan/1')
      ? {
          key: '1',
          label: `产品选型`,
          children: <FanSelection permission={[]} manage={false} />,
        }
      : undefined,
    authList.includes('/fan/2')
      ? {
          key: '2',
          label: `相似设计`,
          children: <FanSimilarDesign />,
        }
      : undefined,
    // authList.includes('/fan/3')
    //   ? {
    //       key: '3',
    //       label: `变形设计`,
    //       children: null,
    //     }
    //   : undefined,

    // authList.includes('/fan/4')
    //   ? {
    //       key: '4',
    //       label: `数据管理`,
    //       children: <FanSelection permission={permission} manage={true} />,
    //     }
    //   : undefined,
    authList.includes('/fan/4')
      ? {
          key: '4',
          label: `数据管理`,
          // children: <FanManage permission={permission} />,
          children: <FanSelection permission={[]} manage={true} />,
        }
      : undefined,
    authList.includes('/fan/5')
      ? {
          key: '5',
          label: `审核管理`,
          // children: <FanManage permission={permission} />,
          children: <AuditManage permission={[]} manage={true} />,
        }
      : undefined,
    authList.includes('/fan/6')
      ? {
          key: '6',
          label: `审核进度`,
          // children: <FanManage permission={permission} />,
          children: <AuditView permission={[]} manage={false} />,
        }
      : undefined,
  ];

  return (
    <>
      {/* <PageContainer> */}
      <div style={{ position: 'relative' }}>
        <div style={{ width: '100%', position: 'absolute' }}>
          <Card>
            <Tabs
              // style={{width:900}}
              defaultActiveKey="1"
              activeKey={activeKey}
              onTabClick={(key, e) => {
                if (['0', '1', '2', '3', '4', '5', '6'].includes(key)) {
                  history.push(`/fan/` + key);
                }
              }}
              items={items}
              // destroyInactiveTabPane={true}
            />
          </Card>
        </div>
      </div>
      {/* </PageContainer> */}
    </>
  );
};

export default Fan;
