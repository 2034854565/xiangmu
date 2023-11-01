import React, { useState } from 'react';
import { Button, Cascader, DatePicker, Form, Input, message, Modal, Select, Upload } from 'antd';
import moment from 'moment';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { checkOnly } from '../service';
const { Option } = Select;

// const { Option } = Select;
const FormItem = Form.Item;
interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: {
    username: string;
    oldpassword: string;
    password: string;
    confirmpassword: string;
    submitLoading: boolean;
  }) => void;
  onCancel: () => void;
  // handleAdd: () => void;
  values: {
    id: string;
    account: string;
    password: string;
  };
}

const UpdatePassword: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [field, setField] = useState({});

  const [confirmPassword, setConfirmPassword] = useState('');
  const { modalVisible, onSubmit: handleAdd, onCancel, values, submitLoading } = props;
  const account = values?.account;
  // console.log('values');
  // console.log(values);

  const onConfirm = async (e) => {
    setConfirmPassword(e.target.value);
  };

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    onConfirm;
    // if (confirmPassword != fieldsValue.password) {
    //   message.error('两次输入的密码不一致，请再次确认密码！');
    // } else {
    setField(fieldsValue);
    form.resetFields();
    fieldsValue.id = values.id;
    fieldsValue.account = values.account;
    // console.log('fieldsValue');
    // console.log(fieldsValue);

    handleAdd(fieldsValue);
    // }
  };

  // console.log("fieldsValue", field)

  return (
    <>
      <Modal
        destroyOnClose
        title="修改密码"
        open={modalVisible}
        onOk={okHandle}
        onCancel={() => onCancel()}
        footer={
          <>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" onClick={okHandle} loading={submitLoading}>
              完成
            </Button>
          </>
        }
      >
        <Form
          initialValues={{
            account: account,
            // oldpassword: values?.password,
          }}
          form={form}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="用户帐号"
            name="account"
            rules={[
              {
                min: 2,
              },
            ]}
          >
            {values.account}
            {/* <Input placeholder="请输入" /> */}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="新密码"
            name="password"
            rules={[{ required: true, message: '请输入至少两个字符的规则描述！', min: 2 }]}
          >
            <Input autoComplete="off" placeholder="请输入" />
          </FormItem>
        </Form>
        {/* <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="确认密码"
          name="confirmPassword"
          rules={[{ required: true, message: '请输入至少两个字符的规则描述！', min: 2 }]}
        >
          <Input placeholder="请输入" onChange={onConfirm} />
        </FormItem> */}
      </Modal>
    </>
  );
};

export default UpdatePassword;
