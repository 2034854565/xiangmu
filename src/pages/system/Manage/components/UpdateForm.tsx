/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-05-07 20:16:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-22 14:28:34
 */
import React, { useState } from 'react';
import { Form, Button, Input, Modal, Steps, Select, DatePicker } from 'antd';

import { groupIdOptions, TableListItem } from '../data.d';
const { Option } = Select;

export interface FormValueType extends Partial<TableListItem> {
  id: string;
  groupId: string;
  key: string;
  value: string;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
  submitLoading: boolean;
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
    id: props.values.id,
    groupId: props.values.groupId,
    key: props.values.key,
    value: props.values.value,
  });
  const [state, setState] = useState(false);
  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
    submitLoading,
  } = props;
  const [groupId, setGroupId] = useState<string>(values?.groupId);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    // console.log('fieldsValue');
    // console.log(fieldsValue);
    // console.log('!!!!!!!!!!!!!!!!!!!!');

    console.log({ last: values, new: fieldsValue });

    setFormVals({ ...formVals, ...fieldsValue });
    handleUpdate({ last: values, new: fieldsValue });
  };

  // 编辑主体部分
  const renderContent = () => {
    return (
      <>
        <Form
          initialValues={{
            groupId: values?.groupId,
            key: values?.key,
            value: values?.value,
          }}
          form={form}
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} name="groupId" label="GroupID">
            <Select
              //  mode="multiple"
              allowClear
              placeholder=""
              // defaultValue={values?.groupId}
              // disabled
              onChange={(value) => {
                setGroupId(value);
              }}
            >
              {groupIdOptions?.map((item) => (
                <Option value={item.label}>{item.value}</Option>
              ))}
            </Select>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name="key"
            label={groupId == '风机类型' ? '一级分类' : 'Key'}
            rules={[{ required: true, message: '请输入key！' }]}
          >
            <Input placeholder="请输入" disabled />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name="value"
            label={groupId == '风机类型' ? '二级分类' : 'Value'}
            rules={[{ required: true, message: '请输入Value！' }]}
          >
            <Input placeholder="请输入" />
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
      title="编辑配置"
      open={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      {renderContent() /* 调用编辑主体 */}
    </Modal>
  );
};
export default UpdateForm;
