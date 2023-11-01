import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Modal, Radio, InputNumber, Select } from 'antd';
import { fanCoolObjectList } from '../service';
const { Option } = Select;
export interface FormValueType {
  train_type: any;
  name: string;
  label: string;
  description: string;
  img: string;
  remark: string;
  menuData?: Array<string>;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: any) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: any;
  menuData?: Array<string>;
  submitLoading: boolean;
}

const FormItem = Form.Item;

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>(props.values);
  const [form] = Form.useForm();
  const [menuTypeChange, setMenuTypeChange] = useState(0);
  const { menuData } = props;
  console.log('menuData');
  console.log(menuData);

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
    submitLoading,
  } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    const tempValues = {};
    console.log({ ...formVals, ...fieldsValue });
    handleUpdate({ ...formVals, ...fieldsValue });
  };

  // 菜单列表
  const map = new Map();
  const arr = menuData?.filter((v) => !map.has(v.label) && map.set(v.label, 1));
  const handlemenuData = arr?.map((item, index) => ({
    id: index,
    name: item?.name,
    label: item?.label,
    // img: useImage(item.img)[0]
  }));

  const onChange = (value) => {
    setMenuTypeChange(value);
  };
  const [coolObjectList, setCoolObjectList] = useState<[]>([]);

  useEffect(() => {
    fanCoolObjectList().then((res: any) => {
      setCoolObjectList(res.data);
    });
    // getFanCoolObjectData().then((res: any) => {
    //   setCoolObjectList(res.data);
    // });
  }, []);
  // 编辑主体部分
  const renderContent = () => {
    return (
      <>
        <Form
          initialValues={{
            train_type: values.train_type,
            name: values.name,
            label: values.label,
            coolObject: values.coolObject,
            description: values.description,
            img: values.img,
            remark: values.remark,
          }}
          form={form}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="所属车型"
            name="train_type"
            // rules={[{ required: true }]}
          >
            <Select>
              <Option value={'0'}>电力机车</Option>
              <Option value={'1'}>动车</Option>
              <Option value={'2'}>城轨</Option>
            </Select>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="冷却对象"
            name="coolObject"
            rules={[{ required: true }]}
          >
            <Select>
              {coolObjectList?.map((item) => (
                <Option value={item.code}>{item.name}</Option>
              ))}
            </Select>
            {/* <Select>
            {coolObjectList?.map((item) => (
              <Option value={item}>{item}</Option>
            ))}
          </Select> */}
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="风机类型"
            name="label"
            rules={[{ required: true }]}
          >
            <Select>
              {handlemenuData?.map((item) => (
                <Option value={item.label}>{item.label}</Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="风机名称"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="描述"
            name="description"
            rules={[{ required: true }]}
          >
            <Input />
          </FormItem>
          &emsp; &emsp; &emsp;&emsp; &emsp;&emsp;如：输入图片保存路径
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="图片上传"
            name="img"
            // rules={[{ required: true, message: '请输入！' }]}
          >
            <Input />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="备注"
            name="remark"
            // rules={[{ required: true, message: '请输入！' }]}
          >
            <Input />
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
      title="编辑"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      {renderContent() /* 调用编辑主体 */}
    </Modal>
  );
};
export default UpdateForm;
