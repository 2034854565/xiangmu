import React, { useState } from 'react';
import { Form, Button, Input, Modal, Steps, Select, DatePicker, Upload, Tree } from 'antd';

import { TableListItem } from '../data';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
// import { userRoleList } from '../service';
const { Option } = Select;

export interface FormValueType extends Partial<TableListItem> {
  component: string;
  componentName: string;
  description: string;
  icon: string;
  id: string;
  leaf: true;
  menuType: 0;
  name: string;
  parentId: string;
  perms: string;
  permsType: string;
  redirect: string;
  route: true;
  sortNo: 0;
  url: string;
}

export interface DetailFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  detailModalVisible: boolean;
  values: Partial<TableListItem>;
  queryRole: any;
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
    username: props.values.username,
    realname: props.values.realname,
    orgCode: props.values.orgCode,
    phone: props.values.phone,
    email: props.values.email,
    password: props.values.password,
  });

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: detailUpdateModalVisible,
    detailModalVisible,
    values,
    queryRole,
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
  //树形控件
  const [expandedKeys, setExpandedKeys] = useState(['0-0-0', '0-0-1']);
  const [checkedKeys, setCheckedKeys] = useState(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.

    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };
  const renderContent = () => {
    return (
      <>
        <FormItem
          name="username"
          label="用户账号"
          rules={[{ message: '请输入用户账号！' }]}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
        >
          {values?.username}
        </FormItem>
        <FormItem
          name="realname"
          label="用户名字"
          rules={[{ message: '请输入用户名字！' }]}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
        >
          {values?.realname}
        </FormItem>
        <FormItem
          name="selectedroles"
          label="角色"
          rules={[{ message: '请输入角色！' }]}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
        >
          {queryRole}
        </FormItem>
        <FormItem
          name="sex"
          label="性别"
          rules={[{ message: '请输入部门！' }]}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
        >
          {values?.sex == 1 ? '男' : values?.sex == 2 ? '女' : '--'}
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
          username: formVals.username,
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
