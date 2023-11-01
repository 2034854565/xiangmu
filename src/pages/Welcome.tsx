import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography, Avatar, List, Image } from 'antd';
import { useIntl, FormattedMessage, useModel } from 'umi';
import styles from './Welcome.less';
import { history, Link } from 'umi';
import { queryRoutesTree } from '@/services/ant-design-pro/api';
import image_1 from '@/assets/menuIcons/1.jpg';
import image_2 from '@/assets/menuIcons/2.jpg';
import image_3 from '@/assets/menuIcons/3.jpg';
import image_4 from '@/assets/menuIcons/4.jpg';
import image_5 from '@/assets/menuIcons/5.jpg';
import image_6 from '@/assets/menuIcons/6.jpg';
import image_7 from '@/assets/menuIcons/7.jpg';
import image_8 from '@/assets/menuIcons/8.jpg';
import image_9 from '@/assets/menuIcons/9.jpg';
import userIcon from '@/assets/dc.jpg';

import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';
const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

interface WelcomeProps {
  // isFullScreen: boolean;
  // offIcon: any;
  // onIcon: any;
  fanType: any;
}
const data = [
  { key: '1', name: '通风机', image: image_1, url: '', access: 0 },
  { key: '2', name: '冷却塔', image: image_2, url: '', access: 0 },
  { key: '3', name: '制动电阻', image: image_3, url: '', access: 0 },
  { key: '4', name: '电机', image: image_4, url: '', access: 0 },
  { key: '5', name: '减振器', image: image_5, url: '', access: 0 },
  { key: '6', name: '雨刮器', image: image_6, url: '', access: 0 },
  { key: '7', name: '干燥器', image: image_7, url: '', access: 0 },
  { key: '8', name: '贯通道', image: image_8, url: '', access: 0 },
  // { key:"9",name: "传感器", image: image_8, url: "", access: 0 },
  // { key:"10",name: "撒沙器", image: image_9, url: "", access: 0 },
];

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

const params = {
  token: localStorage.getItem('token'),
};

let startdRoutes: MenuItem[] = [];
if (localStorage.getItem('token')) {
  const menuData = await queryRoutesTree(params);
  if (menuData?.data.menu?.length >= 0) {
    const data = menuData;
    startdRoutes = handleMenuData(data.data.menu);
    // return startdRoutes;
  }
}

// 将业务模块过滤出来
for (let i = 0; i < startdRoutes.length; i++) {
  for (let j = 0; j < data.length; j++) {
    if (startdRoutes[i]['component'] == './fan' && data[j]['key'] == '1') {
      data[j]['url'] = startdRoutes[i]['path'];
      data[j]['access'] = 1;
    }
  }
}
console.log('@@@@@startdRoutes', startdRoutes);
const jumpUrl = (item) => {
  console.log('@@@@@@,item', item);
  if (item.access == 1) {
    history.push(item.url);
  }
};

// const { initialState } = useModel('@@initialState');
const Welcome: React.FC<WelcomeProps> = (props) => {
  const intl = useIntl();

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 600, padding: 30 }}>
        {' '}
        <Avatar size={100} src={userIcon} />
        &emsp; 欢迎您！ 祝您开心快乐每一天~
      </div>
      <List
        grid={{
          gutter: 24,
          column: 4,
        }}
        className={styles.container}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div className={item.access == 1 ? null : styles.mask}>
              <Card
                className={styles.card}
                hoverable
                onClick={() => {
                  jumpUrl(item);
                }}
              >
                <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 700 }}>
                  <Image width={320} height={240} src={item.image} preview={false} />
                  <br />
                  {item.name}
                </div>
              </Card>
            </div>
            {/* <div onClick={() => changeFan(item)}> */}
            {/* <Card title={item.title}
                    cover={<img alt="example" src={require(`${item.img}`)} />}>
                    <Meta title={item.name}

                
                    />
                   
                  </Card> */}
            {/* </div> */}
          </List.Item>
        )}
      />
      {/* <Card>
        <Alert
          message={intl.formatMessage({
            id: 'pages.welcome.alertMessage',
            defaultMessage: 'Faster and stronger heavy-duty components have been released.',
          })}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <FormattedMessage id="pages.welcome.advancedComponent" defaultMessage="Advanced Form" />{' '}
          <a
            href="https://procomponents.ant.design/components/table"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="Welcome" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-table</CodePreview>
        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
        >
          <FormattedMessage id="pages.welcome.advancedLayout" defaultMessage="Advanced layout" />{' '}
          <a
            href="https://procomponents.ant.design/components/layout"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="Welcome" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-layout</CodePreview>
      </Card> */}
    </div>
  );
};

export default Welcome;
