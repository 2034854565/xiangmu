import {
  AlipayCircleOutlined,
  LockTwoTone,
  MailTwoTone,
  MobileTwoTone,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs, Card, Radio, Row, Col, Image, notification } from 'antd';
import React, { useState } from 'react';
import ProForm, {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-form';
import { useIntl, Link, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { LoginParamsType, queryRoutesTree, queryUserRole } from '@/services/ant-design-pro/api';
import { getUserInfo, userLogin } from './service';
import bg1 from './bg1.png';

import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */

const goto = async () => {
  if (!history) return;
  let menuData: any[];
  const tokenTemp = localStorage.getItem('token');
  const params = { token: tokenTemp };
  if (localStorage.getItem('token')) {
    menuData = await queryRoutesTree(params);
  }

  // console.log('menuData');
  // console.log(menuData);
  // console.log('menuData?.data.menu');
  // console.log("菜单11", params, menuData?.data?.menu[0].path);
  setTimeout(() => {
    // const { query } = history.location;
    // const { redirect } = query as { redirect: string };
    // history.push(redirect || '/');
    // window.location.replace('/overview');
    console.log('menuData');
    console.log(menuData);
    if (menuData.data.menu.length == 0) {
      setTimeout(() => {
        notification.info({
          message: `暂未分配权限，请联系管理员`,
          description: `暂未分配权限，请联系管理员`,
        });
      });
      setTimeout(() => {
        // window.location.replace('/user/login');
      }, 1000);
    } else {
      window.location.replace(menuData?.data?.menu[0].path);
    }
  });
};
// const goto = (role: string) => {
//   if (!history) return;
//   setTimeout(() => {
//     // const { query } = history.location;
//     // const { redirect } = query as { redirect: string };
//     // history.push(redirect || '/');
//     switch (role) {
//       case '0':
//         window.location.replace('/fan/1');
//         break;
//       case '1':
//         window.location.replace('/fanShow');
//         break;
//     }
//   }, 10);
// };

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loginMsg, setLoginMsg] = React.useState('1');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      setInitialState({
        ...initialState,
        currentUser: userInfo,
      });
    }
  };

  //   const hide = message.loading('');
  //   try {
  //     setqueryRole(await UserRole({ userid: record.id }));
  //     hide();
  //     // message.success('更改成功');
  //     return true;

  //   } catch (error) {
  //     hide();
  //     // message.error('旧密码输入错误!');
  //     return false;
  //   }

  //   // console.log(record)
  //   // setStepFormValues(record);
  // }}

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    const hide = message.loading('');
    try {
      // 登录
      const msg = await userLogin({ account: values.username, password: values.password });
      // const msg = {
      //   status: 200,
      //   data: {
      //     token: '**************',
      //   },
      // };
      setLoginMsg(msg);

      // msg.status = msg.code === 200 ? 'ok' : 'error';
      // msg.currentAuthority = "admin";
      // console.log("111",msg)
      if (msg.status === 200) {
        localStorage.setItem('token', msg.data.token);
        localStorage.setItem('access_token', msg.data.token);
        // localStorage.setItem('userInfo', JSON.stringify(msg.result));
        // const currentID = msg?.result?.userInfo?.id;
        // await queryUserRole({ userid: currentID }).then((data) => {
        //   localStorage.setItem('roleName', JSON.stringify(data.result[0]));
        // });
        hide();
        message.success('登录成功！');
        await fetchUserInfo();
        goto();
        // const res = await getUserInfo(localStorage.getItem('token'));
        // goto(res.data.role);
        return;
      } else {
        hide();
        const config = {
          content: msg.message,
          duration: 5,
          // style:{paddingTop:40}
        };
        message.error(config);
      }

      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      hide();
      message.error('登录失败，请重试！', 5);
    }
    setSubmitting(false);
  };
  // // 切换分辨率
  // const onChange = (e) => {
  //   setValue(e.target.value);
  // };
  // localStorage.setItem('px', value);
  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      {/* <div className={styles.lang} >{SelectLang && <SelectLang />}</div> */}
      <Row>
        <Col span={12}>
          {/* <img alt="logo" className={styles.logo_1} src="/lince11.gif" /> */}
          <div
            style={{
              width: 450,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 200,
            }}
          >
            <Image preview={false} width={600} src={bg1} />
          </div>
        </Col>
        <Col span={12}>
          <div
            className={styles.content}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 8,
              width: 450,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 200,
            }}
          >
            <img alt="logo" className={styles.logo_1} src="/lince.png" />
            <div className={styles.header}>
              <Link to="'/overview'">
                {/* <img alt="logo" className={styles.logo} src="/logo.png" /> */}

                <br />
                <span className={styles.title}>产品选型和设计平台</span>
              </Link>
            </div>

            <div className={styles.main}>
              <LoginForm
                initialValues={{
                  autoLogin: true,
                }}
                // submitter={{
                //   searchConfig: {
                //     submitText: intl.formatMessage({
                //       id: 'pages.login.submit',
                //       defaultMessage: '登录',
                //     }),
                //   },
                //   render: (_, dom) => dom.pop(),
                //   submitButtonProps: {
                //     htmlType: 'submit',
                //     loading: submitting,
                //     size: 'large',
                //     style: {
                //       width: '100%',
                //     },
                //   },
                // }}
                onFinish={async (values) => {
                  handleSubmit(values);
                }}
              >
                {status === 'error' && loginType === 'account' && (
                  <LoginMessage
                    content={intl.formatMessage({
                      id: 'pages.login.accountLogin.errorMessage',
                      defaultMessage: '账户或密码错误',
                    })}
                  />
                )}
                {type === 'account' && (
                  <>
                    <ProFormText
                      name="username"
                      fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={styles.prefixIcon} />,
                      }}
                      placeholder={intl.formatMessage({
                        id: 'pages.login.username.placeholder',
                        defaultMessage: '用户名',
                      })}
                      rules={[
                        {
                          required: true,
                          message: (
                            <FormattedMessage
                              id="pages.login.username.required"
                              defaultMessage="请输入用户名!"
                            />
                          ),
                        },
                      ]}
                    />
                    <ProFormText.Password
                      name="password"
                      fieldProps={{
                        size: 'large',
                        prefix: <LockTwoTone className={styles.prefixIcon} />,
                      }}
                      placeholder={intl.formatMessage({
                        id: 'pages.login.password.placeholder',
                        defaultMessage: '密码',
                      })}
                      rules={[
                        {
                          required: true,
                          message: (
                            <FormattedMessage
                              id="pages.login.password.required"
                              defaultMessage="请输入密码！"
                            />
                          ),
                        },
                      ]}
                    />
                  </>
                )}

                <div
                  style={{
                    marginBottom: 24,
                  }}
                ></div>
              </LoginForm>
              {/* </ProForm> */}
            </div>
          </div>
        </Col>
      </Row>

      <div
        style={{
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        {/* 湖南联诚轨道科技有限公司 */}
      </div>
      {/* </div> */}
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
