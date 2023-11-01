import React, { useEffect, useRef, useState } from 'react';
import {
  AutoComplete,
  Button,
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
import { ProFormInstance } from '@ant-design/pro-form';

const { Option } = Select;

// const { Option } = Select;
const FormItem = Form.Item;
interface CreateFormProps {
  modalVisible: boolean;
  formVals: { parentId: number };
  departmentOptions: { label: number; value: string; code: string }[];
  onSubmit: (fieldsValue: { name: string }) => void;
  submitLoading: boolean;
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
    submitLoading,
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
    console.log('fieldsValue');
    console.log(fieldsValue);

    if (formVals.id == 0) {
      fieldsValue['parentId'] = 0;
    }
    console.log('fieldsValue');
    console.log(fieldsValue);
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
      title="新增部门"
      open={modalVisible}
      onOk={okHandle}
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
        {formVals.id == 0 ? null : (
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="上级部门"
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
          label="部门名称"
          name="name"
          rules={[{ required: true }]}
        >
          <Input autoComplete="off" placeholder="请输入" />
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="部门编码"
          name="code"
          rules={[{ required: true }]}
        >
          <Input placeholder="请输入" />
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="部门排序"
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
