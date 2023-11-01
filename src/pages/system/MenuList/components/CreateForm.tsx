import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Radio, Select } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;
interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { name: string }) => void;
  submitLoading: boolean;
  onCancel: () => void;
  menuData: { children: { id: number; name: string; menuType: number }[] }[];
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, menuData, submitLoading } = props;
  const [menuTypeChange, setMenuTypeChange] = useState(1);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();

    // form.resetFields();
    let tempValue = {};
    if (fieldsValue.menuType != 0) {
      tempValue = {
        route: true,
        permsType: 1,
        status: 1,
        keepAlive: false,
      };
    }

    handleAdd(Object.assign(fieldsValue, tempValue));
    // console.log("fieldsValue", fieldsValue.username)
    // const hide = message.loading('正在验证');
    // try {
    //   await checkOnly({ username: fieldsValue.username });
    //   hide();
    //   // message.success('添加成功');
    //   return true;
    // } catch (error) {
    //   hide();
    //   message.error('用户账号已存在！');
    //   return false;
    // }
    setMenuTypeChange(1);
  };

  // 菜单列表
  // const handlemenuData = menuData?.map((item) => ({
  //   id: item?.id,
  //   title: item?.title,
  // }));
  console.log('menuData');
  console.log(menuData);

  const handlemenuData = menuData?.map((item) => ({
    id: item?.id,
    title: item?.name,
  }));
  // 添加三级子菜单;
  if (menuTypeChange == 0) {
    for (let i = 0; i < menuData?.length; i++) {
      const item = menuData[i];
      console.log('item');
      console.log(item);
      for (let j = 0; j < item.children.length; j++) {
        const item2 = item.children[j];
        if (item2.menuType != 0) {
          handlemenuData?.push({
            id: item2?.id,
            title: `${item?.name} / ${item2?.name}`,
          });
        }
      }
    }
    // menuData?.map(
    //   (item) =>
    //     // {item.menuType == 0
    //     //   ? null
    //     //   :
    //     // console.log('item');
    //     // console.log(item);

    //     item?.children?.map((item2) =>
    //       handlemenuData?.push({
    //         id: item2?.id,
    //         title: `${item?.name} / ${item2?.name}`,
    //       }),
    //     ),
    //   // }
    // );
  }
  // console.log('menuTypeChange');
  // console.log(menuTypeChange);
  // console.log(menuTypeChange === 0);
  // console.log(menuTypeChange === 1);
  // console.log(menuTypeChange === 2);

  const onChange = (e) => {
    console.log('onChange menuTypeChange');
    console.log(menuTypeChange);

    setMenuTypeChange(e.target.value);
  };
  // handlemenuData?.concat(temp);
  // console.log("222", menuData,handlemenuData)
  return (
    <Modal
      destroyOnClose
      title="新建"
      // open={modalVisible}
      open={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        setMenuTypeChange(1);
        form.resetFields();
        onCancel();
      }}
      footer={
        <>
          <Button
            onClick={() => {
              setMenuTypeChange(1);
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
      <Form
        form={form}
        initialValues={{
          menuType: 1,
        }}
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="菜单类型"
          name="menuType"
          rules={[{ required: true }]}
        >
          <Radio.Group onChange={onChange}>
            <Radio value={1}> 一级菜单</Radio>
            <Radio value={2}> 子菜单</Radio>
            {/* <Radio value={2}> 三级菜单</Radio> */}
            <Radio value={0}> 部件权限</Radio>
          </Radio.Group>
        </FormItem>
        {menuTypeChange === 0 || menuTypeChange === 2 ? (
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="父级菜单名称:"
            name="parentId"
            // rules={[{ required: true }]}
          >
            <Select allowClear>
              {handlemenuData?.map((item) => (
                <Option value={item.id}>{item.title}</Option>
              ))}
            </Select>
          </FormItem>
        ) : null}
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="菜单名称"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
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
          <Input />
        </FormItem>
        &emsp; &emsp; &emsp;&emsp; &emsp;&emsp;必须以“./”开头如：./xxx/xxx/xxx
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="前端组件"
          name="component"
          rules={[
            { required: true },
            {
              pattern: /^\.\/[A-Za-z0-9/]+/,
              message: '请输入正确的前端组件',
            },
            // {
            //   pattern: /^((?!\+|\/|:|\*|\?|<|>|\||'|%|@|#|&|\$|\^|&|\*).){1,50}$/,
            //   message: '非法字符',
            // },
          ]}
          // ^\.\/[A-Z,a-z,0-9,/]+  a-z0-9
        >
          <Input />
        </FormItem>
        {/* <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="权限策略"
          name="permsType"
          rules={[{ required: true, message: '请输入！' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        */}
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="菜单排序"
          name="sortNo"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} placeholder="请输入" />
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} name="icon" label="菜单图标">
          <Input placeholder="请输入" />
        </FormItem>
      </Form>
    </Modal>
  );
};
export default CreateForm;
