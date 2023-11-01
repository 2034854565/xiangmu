import React, { useState } from 'react';
import { Button, Cascader, Form, Input, InputNumber, message, Modal, Select, Upload } from 'antd';
import moment from 'moment';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { addRule, checkOnly } from '../service';
import DatePicker from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { DefaultOptionType } from 'antd/lib/select';
const { Option } = Select;
export const filter = (inputValue: string, path: DefaultOptionType[]) =>
  path.some(
    (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
  );
// const { Option } = Select;
const FormItem = Form.Item;
interface CreateFormProps {
  modalVisible: boolean;
  handleModalVisible: Function;
  onSubmit?: (fieldsValue: { name: string }) => void;
  submitLoading: boolean;
  onCancel: () => void;
  // handleAdd: () => void;
  userRole: any;
  postOptions: { id: number; name: string }[];
  lineOptions: { id: number; name: string }[];
  departmentOptions: { id: number; name: string }[];
  levelOptions: { id: number; name: string }[];
  actionRef: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [state, setState] = useState(false);
  const { loading, imageUrl } = state;
  const {
    modalVisible,
    userRole,
    // onSubmit: handleAdd,
    onCancel,
    postOptions,
    lineOptions,
    departmentOptions,
    levelOptions,
    handleModalVisible,
    actionRef,
  } = props;
  const handleAdd = async (fields: any) => {
    await addRule(fields);
    // hide1();
    message.success('添加成功');
    return true;
    // } catch (error) {
    //   hide1();
    //   message.error('添加失败请重试！' );
    //   return false;
    // }
  };

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    for (let key in fieldsValue) {
      // console.log('key');
      // console.log(key);
      // console.log('fieldsValue[key]');
      // console.log(fieldsValue[key]);
      fieldsValue[key] = fieldsValue[key] == '' ? undefined : fieldsValue[key];
    }
    fieldsValue['oraCode'] = fieldsValue['oraCode'][fieldsValue['oraCode'].length - 1];

    // fieldsValue.email = fieldsValue.email == '' ? undefined : fieldsValue.email;
    // fieldsValue.phone = fieldsValue.phone == '' ? undefined : fieldsValue.phone;
    // handleAdd(fieldsValue);
    setSubmitLoading(true);
    // await addRule(fieldsValue)
    //   .then((res) => {
    //     if (res.success) {
    //       message.success('添加成功');
    //       form.resetFields();
    //       setSubmitLoading(false);
    //     }
    //   })
    //   .finally(() => {
    //     setSubmitLoading(false);
    //   });
    // hide1();
    const success = await handleAdd(fieldsValue).finally(() => {
      setSubmitLoading(false);
    });
    if (success) {
      handleModalVisible(false);
      form.resetFields();
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
    form.resetFields();
    // console.log("fieldsValue", fieldsValue.username)
    // const hide = message.loading('正在验证');
    // try {
    //   await checkOnly({ username: fieldsValue.username });
    //   hide();
    //   // message.success('添加成功');
    //   return true;
    // } catch (error) {
    //   hide();
    //   message.error('用户账号已存在！');
    //   return false;
    // }
  };

  // const { RangePicker } = DatePicker;

  const dateFormat = 'YYYY/MM/DD';

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
  console.log('userRole', userRole);
  // Just show the latest item.
  const displayRender = (labels: string[]) => labels[labels.length - 1];

  return (
    <Modal
      destroyOnClose
      title="新建用户"
      open={modalVisible}
      onOk={() => {
        okHandle().finally(() => {
          // console.log('res');
          // console.log(res);

          form.resetFields();
        });
      }}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={
        <>
          <Button
            onClick={() => {
              form.resetFields();
              onCancel();
            }}
          >
            取消
          </Button>
          <Button type="primary" onClick={okHandle} loading={submitLoading}>
            完成
          </Button>
        </>
      }
    >
      <Form form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="用户帐号"
          name="account"
          rules={[{ required: true, message: '请输入至少两个字符的规则描述', min: 2 }]}
        >
          <Input autoComplete="off" placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="登录密码"
          name="password"
          rules={[{ required: true, message: '请输入至少两个字符的规则描述', min: 2 }]}
        >
          <Input autoComplete="off" placeholder="请输入" />
        </FormItem>
        {/* <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="确认密码"
          name="password1"
          rules={[{ required: true, message: '请输入至少两个字符的规则描述！', min: 2 }]}
        >
          <Input placeholder="请输入" />
        </FormItem> */}
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="用户姓名"
          name="realName"
          rules={[{ required: true, message: '请输入至少两个字符的规则描述', min: 2 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="userRoleId"
          label="角色"
          rules={[{ required: true, message: '请选择分配的角色' }]}
        >
          <Select
            //  mode="multiple"
            allowClear
            placeholder=""
          >
            {userRole?.map((item) => (
              <Option value={item.id}>{item.roleName}</Option>
            ))}
          </Select>
        </FormItem>
        {/* <FormItem
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
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </FormItem>*/}
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="生日"
          name="birthday"
          rules={[{ required: false }]}
          // initialValue={moment('2015-06-06', dateFormat)}
        >
          <DatePicker
            // defaultValue={moment('2015/01/01', 'YYYY-MM-DD')}
            // defaultValue={moment('2015/01/01', dateFormat)}
            // defaultValue={dayjs('2015-06-06', dateFormat)}
            // defaultValue={dayjs('2015/01/01',  'YYYY-MM-DD')}
            format={dateFormat}
            style={{ width: 305 }}
          />
        </Form.Item>

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别" name="sex">
          <Select>
            <Option value={'男'}>男</Option>
            <Option value={'女'}>女</Option>
          </Select>
          {/* <Input placeholder="请输入" /> */}
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="邮箱"
          name="email"
          rules={[{ required: false, message: '请输入正确邮箱地址', type: 'email' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="手机号码"
          name="phone"
          rules={[
            { required: false, message: '请输入11位手机号码', min: 11 },
            {
              pattern: /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])\d{8}$/,
              message: '请输入正确的手机号',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="oraCode"
          label="部门"
          rules={[{ required: true, message: '请输入部门' }]}
        >
          {/* <Input placeholder="请输入" /> */}
          {/* <Select allowClear placeholder="">
            {departmentOptions?.map((item) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
          </Select> */}
          <Cascader
            style={{ width: '100%' }}
            options={departmentOptions}
            placeholder="请选择部门"
            // onSearch={(value) => console.log(value)}
            // showSearch={{ filter }}
            expandTrigger="hover"
            changeOnSelect={false}
            showCheckedStrategy={Cascader.SHOW_CHILD}
            displayRender={displayRender}
            // onChange={(value: string[][]) => {
            //   console.log('value');
            //   console.log(value);
            // }}
            // multiple
            multiple={false}
            // maxTagCount={10}
          />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="line"
          label="产品线"
          rules={[{ required: false }]}
        >
          <Select mode="multiple" allowClear placeholder="">
            {lineOptions?.map((item) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
            {/* <Option value={1}>产品线1</Option>
            <Option value={2}>产品线2</Option> */}
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="post"
          label="职位"
          rules={[{ required: false }]}
        >
          <Select mode="multiple" allowClear placeholder="">
            {postOptions?.map((item) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
            {/* <Option value={1}>研发岗</Option>
            <Option value={2}>技术岗</Option>
            <Option value={3}>营销岗</Option> */}
          </Select>
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="level"
          label="技术层级"
          rules={[{ required: true, message: '请选择技术层级' }]}
        >
          <Select
            //  mode="multiple"
            allowClear
            placeholder=""
          >
            {levelOptions?.map((item) => (
              <Option value={item.id}>{item.name}</Option>
            ))}
            {/* <Option value={1}>L1</Option>
            <Option value={2}>L2</Option>
            <Option value={3}>L3</Option>
            <Option value={4}>L4</Option>
            <Option value={5}>L5</Option>
            <Option value={6}>L6</Option>
            <Option value={7}>L7</Option>
            <Option value={8}>L8</Option>
            <Option value={9}>L9</Option> */}
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="jobAge"
          label="工作年限"
          rules={[{ required: true, message: '请输入工作年限（年）' }]}
        >
          <InputNumber min={0} placeholder="请输入工作年限（年）" />
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
//       visible={modalVisible}
//       onCancel={() => onCancel()}
//       footer={null}
//     >
//       {props.children}
//     </Modal>
//   );
// };

// export default CreateForm;
