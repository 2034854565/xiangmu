/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-04-27 10:15:50
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-27 15:20:50
 */
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Radio, Select } from 'antd';
import { getFanCoolObjectData } from '@/pages/fan/create/service';
import { fanCoolObjectList } from '../service';

const { Option } = Select;
const FormItem = Form.Item;
interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { name: string }) => void;
  onCancel: () => void;
  menuData?: Array<string>;
  submitLoading: boolean;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, menuData, submitLoading } = props;
  const [menuTypeChange, setMenuTypeChange] = useState(0);

  const okHandle = async () => {
    const fieldsValue = await form.validateFields();
    handleAdd(fieldsValue);
    form.resetFields();
    // const tempValue = {
    //   route: true,
    //   permsType: 1,
    //   status: 1,
    //   keepAlive: false,
    // };
    // handleAdd(Object.assign(fieldsValue, tempValue));
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
  };

  // 菜单列表
  // const handlemenuData = menuData?.map((item) => ({
  //   id: item?.id,
  //   title: item?.title,
  // }));
  // const handlemenuData = menuData?.map((item) => ({
  //   id: item?.id,
  //   title: item?.name,
  // }));
  // menuData?.map((item) =>
  //   item?.children?.map((item2) =>
  //     handlemenuData?.push({
  //       id: item2?.id,
  //       title: `${item?.title} / ${item2?.title}`,
  //     }),
  //   ),
  // );

  const map = new Map();
  console.log('menuData');
  console.log(menuData);

  const arr = menuData?.filter((v) => !map.has(v.label) && map.set(v.label, 1));
  console.log('arr');
  console.log(arr);
  const handlemenuData = arr?.map((item, index) => ({
    id: index,
    name: item?.name,
    label: item?.label,
    // img: useImage(item.img)[0]
  }));

  const onChange = (e) => {
    setMenuTypeChange(e.target.value);
  };
  // handlemenuData?.concat(temp);
  // console.log("222", menuData,handlemenuData)
  const [coolObjectList, setCoolObjectList] = useState<[]>([]);

  useEffect(() => {
    fanCoolObjectList().then((res: any) => {
      setCoolObjectList(res.data);
    });
    // getFanCoolObjectData().then((res: any) => {
    //   setCoolObjectList(res.data);
    // });
  }, []);
  return (
    <Modal
      destroyOnClose
      title="新建"
      open={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
      footer={
        <>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={okHandle} loading={submitLoading}>
            完成
          </Button>
        </>
      }
    >
      <Form
        form={form}
        // initialValues={{
        //   menuType: 0,
        // }}
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
    </Modal>
  );
};
export default CreateForm;
