import React, { useRef, useState } from 'react';
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
import { groupIdOptions } from '../data.d';
import { ProFormInstance } from '@ant-design/pro-form';

const { Option } = Select;

// const { Option } = Select;
const FormItem = Form.Item;
interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { name: string }) => void;
  onCancel: () => void;
  submitLoading: boolean;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const formRef = useRef<ProFormInstance>();
  const [groupId, setGroupId] = useState<string>();

  const [state, setState] = useState(false);
  const { loading, imageUrl } = state;
  const { modalVisible, onSubmit: handleAdd, onCancel, submitLoading } = props;

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();

    handleAdd(fieldsValue);
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
      title="新建配置"
      open={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={
        <>
          <Button onClick={onCancel}>取消</Button>
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
          label="GroupID"
          name="groupId"
          rules={[{ required: true }]}
        >
          <Select
            //  mode="multiple"
            allowClear
            placeholder=""
            onChange={(value) => {
              setGroupId(value);
            }}
          >
            {groupIdOptions?.map((item) => (
              <Option value={item.label}>{item.value}</Option>
            ))}
          </Select>
        </FormItem>
        {groupId != '风机类型' ? (
          <>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="Key"
              name="key"
              rules={[{ required: true }]}
            >
              <Input autoComplete="off" placeholder="请输入" />
            </FormItem>

            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="Value"
              name="value"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </FormItem>
          </>
        ) : (
          <>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="一级分类"
              name="key"
              rules={[{ required: true }]}
            >
              <Input autoComplete="off" placeholder="请输入" />
            </FormItem>

            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="二级分类"
              name="value"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </FormItem>
          </>
        )}
      </Form>
    </Modal>
  );
};
export default CreateForm;
