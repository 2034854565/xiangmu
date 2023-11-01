import React, { useCallback, useState } from 'react';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Form, Input, Menu, message, Modal, Space, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';
import type { MenuInfo } from 'rc-menu/lib/interface';
import userIcon from '@/assets/dc.jpg';
import FormItem from 'antd/es/form/FormItem';
import { userUpdatePassword } from '@/pages/system/UserList/service';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  // await outLogin();
  const { query = {}, pathname } = history.location;
  const { redirect } = query;
  localStorage.removeItem('access_token');
  localStorage.removeItem('token');
  sessionStorage.clear();
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const onConfirm = async (e) => {
    setConfirmPassword(e.target.value);
  };

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        history.push(`/account/${key}`);

        return;
      }
      if (key === 'updatePwd') {
        console.log('updatePwd');
        setModalVisible(true);
      }
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }
  // console.log(currentUser);

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {/* {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />} */}
      <Menu.Item
        key="updatePwd"
        onClick={() => {
          console.log('click');

          setModalVisible(true);
        }}
      >
        <SettingOutlined />
        修改密码
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Modal
        destroyOnClose
        title="修改密码"
        open={modalVisible}
        onOk={async () => {
          const values = await form.validateFields();
          if (confirmPassword != values.password) {
            message.error('两次输入的密码不一致，请再次确认密码！');
            return false;
          } else {
            try {
              const params = { ...values, id: currentUser.userId, account: currentUser.account };
              userUpdatePassword(params).then((res) => {
                message.success('修改成功！请重新登录');
                setInitialState((s) => ({ ...s, currentUser: undefined }));
                loginOut();
              });
              return true;
            } catch (error) {
              // hide();
              message.error('修改失败 ！');
              return false;
            }
          }
          //   {
          //   id: params.id,
          //   oldPassword: params.oldPassword,
          //   password: params.password,
          //   account: params.account,
          // }
        }}
        onCancel={() => {
          form.resetFields();
          setModalVisible(false);
        }}
      >
        <Form form={form}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="用户帐号"
            name="account"
          >
            {currentUser.account}
            {/* <Input placeholder="请输入" /> */}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="原密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入原密码！', min: 2 }]}
          >
            <Input.Password
              autoComplete="off"
              placeholder="请输入原密码"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="新密码"
            name="password"
            rules={[
              {
                required: true,
                pattern: /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,16}/,
                message:
                  '密码必须包含数字、大小写字母、特殊符号（!@#$%^&*-_）其中三种，长度至少为8位，不大于16位',
              },
            ]}
          >
            <Input.Password
              autoComplete="off"
              placeholder="请输入新密码"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
            {/* <Input.Password autoComplete="off" placeholder="请输入新密码" /> */}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="确认密码"
            name="confirmPassword"
            rules={[
              {
                required: true,
                pattern: /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,16}/,
                message:
                  '密码必须包含数字、大小写字母、特殊符号（!@#$%^&*-_）其中三种，长度至少为8位，不大于16位',
              },
            ]}
          >
            <Input.Password placeholder="请输入" onChange={onConfirm} />
          </FormItem>
        </Form>
      </Modal>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            // src={userIcon}
            src={currentUser.avatar}
            alt="avatar"
          />
          <span className={`${styles.name} anticon`}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
    </>
  );
};

export default AvatarDropdown;
