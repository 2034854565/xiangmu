/*
 * @Author: ljx luojiaxincap@163.com
 * @Date: 2023-01-09 19:06:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-15 17:18:51
 * @FilePath: \psad-front\src\pages\fan\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Card, Tabs } from 'antd';
// import { TabsProps } from 'antd/es/tabs';
import type { TabsProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import View from '../overview/view';
import DepartmentManage from './Department';
import { PageContainer } from '@ant-design/pro-layout';
import TableList from './Manage';
import FanCategoryManage from './FanCategory';

const SysManage: React.FC<{}> = (props) => {
  // console.log('Fan props');
  // console.log(props);

  //   let { activeKey = '0' } = props.match.params;

  //   // console.log('activeKey');
  //   // console.log(activeKey);
  //   if (activeKey == ':activeKey') {
  //     activeKey = '0';
  //   }

  const { initialState } = useModel('@@initialState');

  const authList =
    initialState?.currentUser?.authList == undefined ? [] : initialState?.currentUser?.authList;

  console.log('Fan initialState.currentUser');
  console.log(initialState?.currentUser);
  const items: TabsProps['items'] | any = [
    {
      key: '0',
      label: `系统配置`,
      children: <TableList />,
    },
    // {
    //   key: '0',
    //   label: `产品介绍`,
    //   children: <FanInfo />,
    // },
    {
      key: '1',
      label: `部门管理`,
      children: <DepartmentManage />,
    },
    {
      key: '2',
      label: `风机分类管理`,
      children: <FanCategoryManage />,
    },
    // {
    //   key: '3',
    //   label: `变形设计`,
    //   children: null,
    // },
  ];

  return (
    <>
      <PageContainer
        header={{
          // title: '',
          breadcrumb: {},
        }}
      >
        <div style={{ position: 'relative' }}>
          <div style={{ width: '100%', position: 'absolute' }}>
            <Card>
              <Tabs
                // style={{width:900}}
                // defaultActiveKey="2"
                //   activeKey={activeKey}
                //   onTabClick={key=>set }
                //               onTabClick={(key, e) => {
                //                   switch (key) {
                //         case
                //     }
                //   if (['0', '1', '2', '3', '4'].includes(key)) {
                //     history.push(`/fan/` + key);
                //   }
                // }}
                items={items}
                // destroyInactiveTabPane={true}
              />
            </Card>
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default SysManage;
