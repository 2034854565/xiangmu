import React, { useState } from 'react';
import { Cascader, DatePicker, Form, Input, message, Modal, Select, Upload } from 'antd';
import moment from 'moment';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ModalCheck from './ModalCheck';
const { Option } = Select;

// const { Option } = Select;
const FormItem = Form.Item;
interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { name: string }) => void;
  onCancel: () => void;
  // handleAdd: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [state, setState] = useState(false);
  const { loading, imageUrl } = state;
  const { modalVisible, onSubmit: handleAdd, onCancel } = props;
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    form.resetFields();
    handleAdd(fieldsValue);
  };

  const { RangePicker } = DatePicker;

  const dateFormat = 'YYYY/MM/DD';
  const options = [
    {
      value: '中车',
      label: '中车',
      children: [
        {
          value: '市场部',
          label: '市场部',
        },
        {
          value: '智能网络部',
          label: '智能网络部',
        },
        {
          value: '城轨事业部',
          label: '城轨事业部',
        },
      ],
    },
  ];
  //部门分配
  function onChange(value) {
    console.log(value);
  }
  // 上传头像
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );
  return (
    <Modal
      destroyOnClose
      title="新建用户"
      open={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="用户帐号"
          name="username"
          rules={[{ required: true, message: '请输入至少两个字符的规则描述！', min: 2 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="登录密码"
          name="password"
          rules={[{ required: true, message: '请输入至少两个字符的规则描述！', min: 2 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="确认密码"
          name="password1"
          rules={[{ required: true, message: '请输入至少两个字符的规则描述！', min: 2 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="用户姓名"
          name=" realname"
          rules={[{ required: true, message: '请输入至少两个字符的规则描述！', min: 2 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="selectedroles"
          label="角色分配"
          rules={[{ required: false, message: '请输入姓名！' }]}
        >
          <Select mode="multiple" allowClear placeholder="">
            <Option value={'管理员'}>管理员</Option>
            <Option value={'测试员'}>测试员</Option>
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="selectedeparts"
          label="部门分配"
          rules={[{ required: false, message: '请输入姓名！' }]}
        >
          <Cascader options={options} onChange={onChange} changeOnSelect />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="头像"
          name="avatar"
          rules={[{ required: false }]}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="生日"
          name="birthday"
          rules={[{ required: false }]}
        >
          <DatePicker
            defaultValue={moment('2015/01/01', dateFormat)}
            format={dateFormat}
            style={{ width: 305 }}
          />
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别" name="sex">
          <Select>
            <Option value={1}>男</Option>
            <Option value={2}>女</Option>
          </Select>
          {/* <Input placeholder="请输入" /> */}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="邮箱"
          name="email"
          rules={[{ required: false }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="手机号码"
          name="phone"
          rules={[{ required: false }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
      </Form>
    </Modal>
  );
};
export default CreateForm;

// import React from 'react';
// import { Modal } from 'antd';

// interface CreateFormProps {
//   modalVisible: boolean;
//   onCancel: () => void;
// }

// const CreateForm: React.FC<CreateFormProps> = (props) => {
//   const { modalVisible, onCancel } = props;
//   return (
//     <Modal
//       destroyOnClose
//       title="新建用户"
//       open={modalVisible}
//       onCancel={() => onCancel()}
//       footer={null}
//     >
//       {props.children}
//     </Modal>
//   );
// };

// export default CreateForm;
