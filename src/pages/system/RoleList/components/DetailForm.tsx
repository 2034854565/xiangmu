import React, { useState } from 'react';
import { Form, Button, Input, Modal, Steps, Select, DatePicker, Upload, Tree } from 'antd';

import { TableListItem } from '../data';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
import { userRoleList } from '../service';
const { Option } = Select;

export interface FormValueType extends Partial<TableListItem> {
  id: string;
  username: string;
  realname: string;
  orgCode: string;
  phone: string;
  email: string;
  password: string;

  target?: string;
  // template?: string;
  // type?: string;
  // time?: string;
  // frequency?: string;
}

export interface DetailFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
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
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

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
    console.log('response', response);
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
  const treeData = [
    {
      title: '中车',
      key: '中车',
      children: [
        {
          title: '市场部',
          key: '市场部',
        },
        {
          title: '智能网络部',
          key: '智能网络部',
        },
        {
          title: '销售部',
          key: '销售部',
        },
      ],
    },
  ];
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
  // 编辑主体部分
  const renderContent = () => {
    return (
      <>
        <FormItem
          name="username"
          label="用户账号"
          rules={[{ required: true, message: '请输入账号！' }]}
        >
          <Input placeholder="请输入" disabled />
        </FormItem>
        <FormItem
          name="realname"
          label="用户名字"
          rules={[{ required: true, message: '请输入姓名！' }]}
        >
          <Input placeholder="请输入" disabled />
        </FormItem>
        <FormItem
          name="selectedroles"
          label="角色分配"
          rules={[{ required: false, message: '请输入姓名！' }]}
        >
          <Select disabled>
            <Option value={'管理员'}>管理员</Option>
            <Option value={'测试员'}>测试员</Option>
          </Select>
        </FormItem>
        <FormItem
          name="selectedroles"
          label="部门分配"
          rules={[{ required: false, message: '请输入姓名！' }]}
        >
          <Button type="primary" onClick={showModal} disabled>
            点击选择部门
          </Button>
          <Modal title="部门搜索" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
          </Modal>
        </FormItem>
        <FormItem name="avatar" label="头像" rules={[{ required: false, message: '请输入部门！' }]}>
          <Upload name="logo" action="/upload.do" listType="picture" disabled>
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </FormItem>
        <FormItem name="sex" label="性别" rules={[{ required: false, message: '请输入部门！' }]}>
          <Select disabled>
            <Option value={1}>男</Option>
            <Option value={2}>女</Option>
          </Select>
        </FormItem>
        <FormItem
          name="birthday"
          label="生日"
          rules={[{ required: false, message: '请输入部门！' }]}
        >
          <DatePicker
            disabled
            defaultValue={moment('2015/01/01', dateFormat)}
            format={dateFormat}
            style={{ width: 305 }}
          />
        </FormItem>
        <FormItem name="phone" label="电话" rules={[{ required: false, message: '请输入电话！' }]}>
          <Input placeholder="请输入" disabled />
        </FormItem>
        <FormItem name="email" label="邮箱" rules={[{ required: false, message: '请输入邮箱！' }]}>
          <Input placeholder="请输入" disabled />
        </FormItem>
      </>
    );
  };

  // 编辑页脚部分
  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
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
      title="用户编辑"
      open={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      {/* <Steps style={{ marginBottom: 28 }} size="small" >
        <Step title="基本信息" />
      </Steps> */}
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          // 初始化显示
          // target: formVals.target,
          // template: formVals.template,
          // type: formVals.type,
          // frequency: formVals.frequency,
          // name: formVals.name,
          // desc: formVals.desc,
          // canshu: formVals.desc,
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
