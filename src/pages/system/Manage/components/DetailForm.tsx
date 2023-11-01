import React, { useState } from 'react';
import { Form, Button, Input, Modal, Steps, Select, DatePicker, Upload, Tree, Tag } from 'antd';

import { TableListItem } from '../data';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
const { Option } = Select;

export interface FormValueType extends Partial<TableListItem> {
  id: string;
  account: string;
  realname: string;
  orgCode: string;
  phone: string;
  email: string;
  password: string;
  target?: string;
}

export interface DetailFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  detailModalVisible: boolean;
  values: any;
  queryRole: any;
  level: { id: number; name: string }[];
}

const FormItem = Form.Item;
const { Step } = Steps;
// const { TextArea } = Input;
// const { Option } = Select;
// const RadioGroup = Radio.Group;

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const formLayout = {
  // 设置编辑页面的位置
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const DetailForm: React.FC<DetailFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    id: props.values.id,
    account: props.values.account,
    realName: props.values.realName,
  });

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: detailUpdateModalVisible,
    detailModalVisible,
    values,
    queryRole,
    level,
  } = props;
  console.log('8888', queryRole);
  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    handleUpdate({ ...formVals, ...fieldsValue });
  };
  //
  const { RangePicker } = DatePicker;

  const dateFormat = 'YYYY/MM/DD';
  //弹出框
  const [isModalVisible, setIsModalVisible] = useState(false);
  // queryall, userRoleList
  const showModal = () => {
    setIsModalVisible(true);
    const response = async (params) => ({
      data: (await userRoleList(params)).result.records,
      success: true,
    });
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderContent = () => {
    return (
      <>
        <FormItem name="GroupId" label="GroupId" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
          {values?.groupId}
        </FormItem>
        <FormItem name="Key" label="key" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
          {values?.key}
        </FormItem>
        <FormItem
          name="value"
          label="Value"
          rules={[{ message: '请输入角色！' }]}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
        >
          {values?.value}
        </FormItem>
        <FormItem
          name="sex"
          label="性别"
          rules={[{ message: '请输入部门！' }]}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
        >
          {values?.sex}
        </FormItem>
        <FormItem
          name="phone"
          label="电话"
          rules={[{ required: false, message: '请输入电话！' }]}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
        >
          {values?.phone == undefined ? '--' : values?.phone}
        </FormItem>
        <FormItem
          name="email"
          label="邮箱"
          rules={[{ required: false, message: '请输入邮箱！' }]}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
        >
          {values?.email == undefined ? '--' : values?.email}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} name="oraCode" label="部门">
          {/* <Input placeholder="请输入" /> */}
          {values?.department == undefined ? '--' : values?.department}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="line"
          label="产品线"
          rules={[{ required: false }]}
        >
          {values?.line == undefined ? '--' : values?.line.map((line) => <Tag>{line}</Tag>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} name="post" label="职位">
          {values?.post == undefined ? '--' : values?.post.map((post) => <Tag>{post}</Tag>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} name="level" label="技术层级">
          {values?.levelName ? values?.levelName : '--'}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} name="jobAge" label="工作年限">
          {values?.jobAge}
        </FormItem>
      </>
    );
  };

  // 编辑页脚部分
  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => detailUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>
          完成
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="用户详情"
      open={detailModalVisible}
      footer={renderFooter()}
      onCancel={() => detailUpdateModalVisible()}
    >
      {/* <Steps style={{ marginBottom: 28 }} size="small" >
        <Step title="基本信息" />
      </Steps> */}
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          // 初始化显示
          id: formVals.id,
          account: formVals.account,
          realname: formVals.realname,
          orgCode: formVals.orgCode,
          phone: formVals.phone,
          email: formVals.email,
          password: formVals.password,
        }}
      >
        {renderContent() /* 调用编辑主体 */}
      </Form>
    </Modal>
  );
};
export default DetailForm;
