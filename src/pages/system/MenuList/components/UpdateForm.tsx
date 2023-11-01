import React, { useState } from 'react';
import { Form, Button, Input, Modal, Radio, InputNumber, Select } from 'antd';
const { Option } = Select;
export interface FormValueType {
  menuType: any;
  name: string;
  url: string;
  component: string;
  sortNo: string;
  icon: string;
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
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
    submitLoading,
  } = props;
  const [formVals, setFormVals] = useState<FormValueType>(props.values);
  const [form] = Form.useForm();
  const [menuTypeChange, setMenuTypeChange] = useState(formVals.menuType);

  const { menuData } = props;
  // console.log('menuData');
  // console.log(menuData);
  // console.log('formVals');
  // console.log(formVals);
  // console.log('values');
  // console.log(values);
  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    // setSubmitLoading(true);
    setFormVals({ ...formVals, ...fieldsValue });
    const tempValues = {};
    console.log({ ...formVals, ...fieldsValue });
    handleUpdate({ ...formVals, ...fieldsValue });
    // window.location.reload();
    // setSubmitLoading(false);

    // return () => {
    //   console.log('setSubmitLoading(false);');

    //   setSubmitLoading(false);
    // };
  };

  // 菜单列表
  const handlemenuData = menuData?.map((item) => ({
    id: item?.id,
    title: item?.name,
  }));
  // menuData?.map((item) =>
  //   item?.children?.map((item2) =>
  //     handlemenuData?.push({
  //       id: item2?.id,
  //       title: `${item?.name}/${item2?.name}`,
  //     }),
  //   ),
  // );

  const onChange = (e) => {
    setMenuTypeChange(e.target.value);
  };
  // 编辑主体部分
  const renderContent = () => {
    return (
      <>
        <Form
          initialValues={{
            menuType: values.menuType,
            parentId: values.parentId,
            name: values.name,
            url: values.url,
            component: values.component,
            sortNo: values.sortNo,
            icon: values.icon,
          }}
          form={form}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="菜单类型"
            name="menuType"
            rules={[{ required: true }]}
          >
            <Radio.Group
              onChange={onChange}
              disabled={
                values.menuType == 1

                //  || values.menuType == undefined || values.menuType == 0
              }
            >
              {/*  */}
              {values.menuType == 2 || values.menuType == 0 ? null : (
                <Radio value={1}> 一级菜单</Radio>
              )}
              <Radio value={2}> 子菜单</Radio>
              <Radio value={0}> 部件权限</Radio>
            </Radio.Group>
          </FormItem>
          {menuTypeChange === 1 ? null : (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="父级菜单名称:"
              name="parentId"
              // initialValue={values.parentId}
              rules={[{ required: true }]}
            >
              <Select allowClear>
                {handlemenuData?.map((item) => (
                  // disabled = { values.menuType == item.id }
                  <Option value={item.id}>{item.title}</Option>
                ))}
              </Select>
            </FormItem>
          )}
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="菜单名称"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入" />
          </FormItem>
          &emsp; &emsp; &emsp;&emsp; &emsp;&emsp;必须以“/”开头,如：/xxx
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="菜单路径"
            name="url"
            rules={[
              { required: true },
              {
                pattern: /^\/[A-Z,a-z,0-9,/]+/,
                message: '请输入正确的菜单路径',
              },
            ]}
          >
            <Input placeholder="请输入" />
          </FormItem>
          &emsp; &emsp; &emsp;&emsp; &emsp;&emsp;如：./xxx/xxx/xxx
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="前端组件"
            name="component"
            rules={[
              { required: true },
              {
                pattern: /^\.\/[A-Z,a-z,0-9,/]+/,
                message: '请输入正确的前端组件',
              },
            ]}
          >
            <Input placeholder="请输入" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="菜单排序"
            name="sortNo"
            rules={[{ required: true, message: '请输入！' }]}
          >
            <InputNumber min={0} placeholder="请输入" />
          </FormItem>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} name="icon" label="菜单图标">
            <Input placeholder="请输入" />
          </FormItem>
        </Form>
      </>
    );
  };

  // 编辑页脚部分
  const renderFooter = (submitLoading: boolean) => {
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
      open={updateModalVisible}
      footer={renderFooter(submitLoading)}
      onCancel={() => handleUpdateModalVisible()}
    >
      {renderContent() /* 调用编辑主体 */}
    </Modal>
  );
};
export default UpdateForm;
