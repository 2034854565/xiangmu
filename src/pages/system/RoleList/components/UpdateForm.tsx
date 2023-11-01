import React, { useState } from 'react';
import {
  Form,
  Button,
  Input,
  Modal,
  Steps,
  Select,
  DatePicker,
  Upload,
  Tree,
  Cascader,
} from 'antd';

import { TableListItem } from '../data.d';
import moment from 'moment';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
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

export interface UpdateFormProps {
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
    username: props.values.username,
    realname: props.values.realname,
    orgCode: props.values.orgCode,
    phone: props.values.phone,
    email: props.values.email,
    password: props.values.password,
  });
  const [state, setState] = useState(false);
  const { loading, imageUrl } = state;
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
  // 编辑主体部分
  const renderContent = () => {
    return (
      <>
        <FormItem
          name="username"
          label="用户账号"
          rules={[{ required: true, message: '请输入账号！' }]}
        >
          <Input placeholder="请输入" disabled={false} />
        </FormItem>
        <FormItem
          name="realname"
          label="用户名字"
          rules={[{ required: true, message: '请输入姓名！' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
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
          name="selectedroles"
          label="部门分配"
          rules={[{ required: false, message: '请输入姓名！' }]}
        >
          <Cascader options={options} onChange={onChange} changeOnSelect />
        </FormItem>
        <FormItem name="avatar" label="头像" rules={[{ required: false, message: '请输入部门！' }]}>
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
          name="birthday"
          label="生日"
          rules={[{ required: false, message: '请输入部门！' }]}
        >
          <DatePicker
            defaultValue={moment('2018-12-05', dateFormat)}
            format={dateFormat}
            style={{ width: 305 }}
          />
        </FormItem>
        <FormItem name="sex" label="性别" rules={[{ required: false, message: '请输入部门！' }]}>
          <Select>
            <Option value={1}>男</Option>
            <Option value={2}>女</Option>
          </Select>
        </FormItem>
        <FormItem name="email" label="邮箱" rules={[{ required: false, message: '请输入邮箱！' }]}>
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="phone"
          label="手机号码"
          rules={[{ required: false, message: '请输入电话！' }]}
        >
          <Input placeholder="请输入" />
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
export default UpdateForm;
