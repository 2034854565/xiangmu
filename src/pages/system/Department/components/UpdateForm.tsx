/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-05-07 20:16:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-19 09:30:23
 */
import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Input, Modal, Steps, Select, DatePicker, InputNumber } from 'antd';
import { DepartmentListItem } from '../data';

const { Option } = Select;

export interface UpdateFormState {
  currentStep: number;
}
export interface FormValueType {}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  formVals: DepartmentListItem;
  modalVisible: boolean;
  departmentOptions: { label: string; value: number; code: string }[];
  submitLoading: boolean;
}

const FormItem = Form.Item;

const formLayout = {
  // 设置编辑页面的位置
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();
  // const formRef = useRef<ProFormInstance>();

  const {
    modalVisible,
    onSubmit: handleAdd,
    onCancel,
    departmentOptions,
    formVals,
    submitLoading,
  } = props;
  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    fieldsValue.id = formVals.id;
    handleAdd(fieldsValue);
    onCancel();
    form.resetFields();
  };

  form.setFieldsValue(formVals);
  // console.log(formVals.id);
  // console.log(formVals.id === 0);
  // console.log(formVals.id == 0);

  return (
    <Modal
      // destroyOnClose
      title={'部门编辑'}
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
      {/* {props.formVals.name}
      {props.formVals.code} */}
      <Form form={form}>
        {formVals.parentId == 0 ? null : (
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="上级部门"
            name="parentId"
            rules={[{ required: true }]}
          >
            <Select
              //  mode="multiple"
              allowClear
              placeholder=""
              // onChange={(value) => {
              //   setGroupId(value);
              // }}
            >
              {departmentOptions?.map((item) =>
                item.value == formVals.id ? null : <Option value={item.value}>{item.label}</Option>,
              )}
            </Select>
          </FormItem>
        )}

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="部门名称"
          name="name"
          rules={[{ required: true }]}
          initialValue={props.formVals.name}
        >
          <Input autoComplete="off" placeholder="请输入" value={props.formVals.code} />
        </FormItem>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="部门编码"
          name="code"
          rules={[{ required: true }]}
        >
          <Input placeholder="请输入" value={props.formVals.code} />
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
export default UpdateForm;
