import React, { useEffect, useRef, useState } from 'react';
import {
  AutoComplete,
  Cascader,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Upload,
} from 'antd';

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { groupIdOptions } from '../data.d';
import { ProFormInstance } from '@ant-design/pro-form';

const { Option } = Select;

// const { Option } = Select;
const FormItem = Form.Item;
interface CreateFormProps {
  modalVisible: boolean;
  formVals: { parentId: number };
  departmentOptions: { label: number; value: string; code: string }[];
  onSubmit: (fieldsValue: { name: string }) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const formRef = useRef<ProFormInstance>();
  const [values, setValues] = useState<{}>();

  const [state, setState] = useState(false);
  const { loading, imageUrl } = state;
  const {
    modalVisible,
    onSubmit: handleAdd,
    onCancel,
    departmentOptions,
    formVals, //= { id: undefined, parentId: undefined }
  } = props;
  // console.log('formVals');
  // console.log(formVals);
  useEffect(() => {
    // 这个useEffect很关键，第一次赋值但是获取不到，所以要再赋值一次
    if (formVals) {
      setValues(formVals);
    }
  }, [formVals]);
  const okHandle = async () => {
    let fieldsValue = await form.validateFields();
    // console.log('fieldsValue');
    // console.log(fieldsValue);

    if (formVals.id == 0) {
      fieldsValue['parentId'] = 0;
    }
    // console.log('fieldsValue');
    // console.log(fieldsValue);
    handleAdd(fieldsValue);

    onCancel();
    form.resetFields();
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
      title="新增风机分类"
      open={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
    >
      <Form form={form}>
        {formVals.id == 0 ? null : (
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="上级分类"
            name="parentId"
            rules={[{ required: true }]}
            // initialValue={formVals.parentId == 0 ? undefined : formVals.parentId}
            initialValue={formVals.id}
          >
            <Select
              //  mode="multiple"
              allowClear
              placeholder=""
              disabled={formVals.parentId === 0}
              // onChange={(value) => {
              //   setGroupId(value);
              // }}
            >
              {departmentOptions?.map((item) => (
                <Option value={item.value}>{item.label + '(' + item.code + ')'}</Option>
              ))}
            </Select>
          </FormItem>
        )}

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="分类名称"
          name="name"
          rules={[{ required: true }]}
        >
          <Input autoComplete="off" placeholder="请输入" />
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="分类编码"
          name="code"
          rules={[{ required: true }]}
        >
          <Input placeholder="请输入" />
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="分类排序"
          name="sort"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} autoComplete="off" placeholder="请输入" />
        </FormItem>
      </Form>
    </Modal>
  );
};
export default CreateForm;
