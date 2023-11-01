import React, { useState } from 'react';
import { Form, Button, Input, Modal, Steps, Select, DatePicker, Cascader } from 'antd';

import { TableListItem } from '../data.d';
import dayjs from 'dayjs';

import moment from 'moment';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { userRoleList } from '../service';
import { filter } from './CreateForm';
const { Option } = Select;

export interface FormValueType extends Partial<TableListItem> {
  id: string;
  account: string;
  realName: string;
  orgCode: string;
  phone: string;
  email: string;
  password: string;
  // target?: string;
  userRoleId: number;
  jobAge: number;
  sex: string;
  post?: string[];
  line?: string[];
  postIds?: number[];
  lineIds?: number[];
  // template?: string;
  // type?: string;
  // time?: string;
  // frequency?: string;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  submitLoading: boolean;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
  userRole: any;
  queryRole: any;
  postOptions: { id: number; name: string }[];
  lineOptions: { id: number; name: string }[];
  departmentOptions: { id: number; name: string }[];
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

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    // name: props.values.name,
    // desc: props.values.desc,
    // key: props.values.key,
    // target: '0',
    // template: '0',
    // type: '1',
    // time: '',
    id: props.values.id,
    // frequency: 'month',
    account: props.values.account,
    realName: props.values.realName,
    // orgCode: props.values.orgCode,
    phone: props.values.phone,
    email: props.values.email,
    sex: props.values.sex,
    userRoleId: props.values.userRoleId,
    // userInfo: props.values.userInfo,
    // password: props.values.password,
  });
  const [state, setState] = useState(false);
  const { loading, imageUrl } = state;
  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
    userRole,
    queryRole,
    level,
    postOptions,
    lineOptions,
    departmentOptions,
    submitLoading,
  } = props;
  // console.log("777", queryRole)
  // console.log('7777', queryRole?.toString());
  // console.log('values');
  // console.log(values);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    // console.log('fieldsValue');
    // console.log(fieldsValue);
    for (let key in fieldsValue) {
      // console.log('key');
      // console.log(key);
      // console.log('fieldsValue[key]');
      // console.log(fieldsValue[key]);

      fieldsValue[key] = fieldsValue[key] == '' ? undefined : fieldsValue[key];
    }
    fieldsValue['oraCode'] = fieldsValue['oraCode'][fieldsValue['oraCode'].length - 1];

    // fieldsValue.userInfo = {
    //   userId: props.values.id,
    //   department: fieldsValue.department,
    //   major: fieldsValue.major,
    //   technicalLevel: fieldsValue.technicalLevel,
    //   workTime: fieldsValue.workTime,
    // };
    // delete fieldsValue.department;
    // delete fieldsValue.major;
    // delete fieldsValue.technicalLevel;
    // delete fieldsValue.workTime;
    setFormVals({ ...formVals, ...fieldsValue });
    handleUpdate({ ...formVals, ...fieldsValue });
  };
  const getParentId: any = (list, id) => {
    console.log('list');
    console.log(list);
    console.log('id');
    console.log(id);
    for (let i in list) {
      if (list[i].id == id) {
        return [list[i].id];
      }
      if (list[i].children) {
        let node = getParentId(list[i].children, id);
        console.log('node');
        console.log(node);

        if (node !== undefined) {
          console.log('node.unshift(list[i])');
          // console.log(result);
          const result = node.unshift(list[i].id);
          return node;
        }
      }
    }
  };
  // Just show the latest item.
  const displayRender = (labels: string[]) => labels[labels.length - 1];
  // 编辑主体部分
  const renderContent = () => {
    return (
      <>
        <Form
          initialValues={{
            account: values?.account,
            realName: values?.realName,
            userRoleId: values?.userRoleId,
            sex: values?.sex,
            email: values?.email,
            phone: values?.phone,
            // department: values?.department,
            // major: values?.userInfo.major,
            jobAge: values?.jobAge,
            birthday: values?.birthday ? moment(values?.birthday, 'YYYY-MM-DD') : undefined,
            // birthday: values?.birthday,
            oraCode: getParentId(departmentOptions, values?.oraCode),
            level: values?.level,
            post: values?.postIds ? values?.postIds : undefined,
            line: values?.lineIds ? values?.lineIds : undefined,
          }}
          form={form}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name="account"
            label="用户账号"
            rules={[{ message: '请输入账号！' }]}
          >
            {values?.account}
            {/* <Input placeholder="请输入" disabled /> */}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name="realName"
            label="用户名字"
            rules={[{ required: true, message: '请输入用户名字！' }]}
          >
            <Input placeholder="请输入" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name="userRoleId"
            label="角色"
            rules={[{ required: true, message: '请选择角色！' }]}
          >
            <Select
              // mode="multiple"
              // defaultValue={queryRole}
              allowClear
              placeholder=""
              onChange={(e) => {
                console.log(e);
              }}
            >
              {userRole?.map((item: any) => (
                <Option value={item?.id}>{item?.roleName}</Option>
              ))}
            </Select>
          </FormItem>
          <Form.Item
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="生日"
            name="birthday"
            rules={[{ required: false }]}
            // initialValue={dayjs('2015-06-06', 'YYYY-MM-DD')}
          >
            <DatePicker
              // defaultValue={moment('2015/01/01', 'YYYY-MM-DD')}
              // defaultValue={dayjs('2015-06-06', 'YYYY-MM-DD')}
              // defaultValue={dayjs('2015/01/01',  'YYYY-MM-DD')}
              format={'YYYY-MM-DD'}
              style={{ width: 305 }}
            />
          </Form.Item>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name="sex"
            label="性别"
            rules={[{ required: false, message: '请输入部门！' }]}
          >
            <Select>
              <Option value={'男'}>男</Option>
              <Option value={'女'}>女</Option>
            </Select>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name="email"
            label="邮箱"
            rules={[{ required: false, message: '请输入正确邮箱地址', type: 'email' }]}
          >
            <Input placeholder="请输入" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name="phone"
            label="手机号码"
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
            rules={[{ required: true, message: '请输入部门！' }]}
          >
            <Cascader
              multiple={false}
              style={{ width: '100%' }}
              options={departmentOptions}
              placeholder="请选择部门"
              onSearch={(value) => console.log(value)}
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
            rules={[{ required: true, message: '请输入技术层级！' }]}
          >
            <Select
              //  mode="multiple"
              allowClear
              placeholder=""
            >
              {level?.map((item) => (
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
            <Input placeholder="请输入工作年限（年）" />
          </FormItem>
        </Form>
      </>
    );
  };

  // 编辑页脚部分
  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()} loading={submitLoading}>
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
      {/* <Form
        {...formLayout}
        form={form}
        initialValues={{  // 初始化显示
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
      > */}
      {renderContent() /* 调用编辑主体 */}
      {/* </Form> */}
    </Modal>
  );
};
export default UpdateForm;
