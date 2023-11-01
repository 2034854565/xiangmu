/*
 * @Author: ljx luojiaxincap@163.com
 * @Date: 2023-01-09 19:06:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-22 14:26:22
 * @FilePath: \psad-front\src\pages\fan\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import UserAction from '../system/UserAction';
import { saveUserAction } from '@/services/ant-design-pro/login';
import { Button, Card, Modal, Tabs } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import Create from './create';
import FanInfo from './fanInfo';
import Guayuqi from './guyuqi';
import View from './view';
import Welcome from '../Welcome';

const Fan: React.FC<{}> = (props) => {
  const initialState = useModel('@@initialState');
  const userInfo = initialState?.currentUser;
  const updateAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  const onClick = (e) => {
    // console.log("e", e)
    //需要保存的用户行为信息,包括上传、下载、设计等行为
    const content = {
      userInfo,
      updateAt,
      action: e.target.innerText,
      productInfo: '第一个产品信息',
    };
    saveUserAction({ content }).catch((e) => {});
  };
  return (
    <>
      {/* <Button onClick={onClick}> 下载报告（用户行为保存）</Button> */}
      <Card>
        <Tabs
          defaultActiveKey="0"
          // activeKey={activeKey}
          // onTabClick={(key, e) => {
          //   if (['0','1', '2'].includes(key)) {

          //     history.push(`/fan/` + key);
          //   }
          // }}
        >
          <Tabs.TabPane tab="产品分布" key="0">
            <View />
          </Tabs.TabPane>
          <Tabs.TabPane tab="欢迎页" key="1">
            <Welcome />
          </Tabs.TabPane>
          <Tabs.TabPane tab="行为监控" key="2">
            <UserAction />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="雨刮器" key="2">
            <Guayuqi />
          </Tabs.TabPane>
          <Tabs.TabPane tab="叶轮" key="3">
            叶轮产品介绍
          </Tabs.TabPane> */}
        </Tabs>
      </Card>
    </>
  );
};

export default Fan;
