import { Button, Card, Form, Input, Select } from 'antd';
import React from 'react';

const { Option } = Select;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const App: React.FC = () => {
    const [form] = Form.useForm();

    //   const onGenderChange = (value: string) => {
    //     switch (value) {
    //       case 'male':
    //         form.setFieldsValue({ note: 'Hi, man!' });
    //         return;
    //       case 'female':
    //         form.setFieldsValue({ note: 'Hi, lady!' });
    //         return;
    //       case 'other':
    //         form.setFieldsValue({ note: 'Hi there!' });
    //     }
    //   };

    const onFinish = (values: any) => {
        console.log(values);
    };


    return (
        <>
            <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                <Form.Item name="1" label="改善的通用工程参数" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="2" label="恶化的通用工程参数r" rules={[{ required: true }]}>
                    <Select
                        placeholder="Select a option and change input text above"
                        //   onChange={onGenderChange}
                        allowClear
                    >
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                        <Option value="other">other</Option>
                    </Select>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        确认
                    </Button>

                </Form.Item>
            </Form>
            <Card size="small" title="解决方案" style={{ width: 300 }}>
                35 改变特征（物理或化学参数改变） [1]<br />
                40 用复合材料替代 [18]<br />
                9 预先反作用（预先采取行动来抵消、控制、防止） [41]<br />
                31 用多孔材料 [32]<br />
                24 借助中介物 [19]<br />
                30 用柔性壳体或薄膜 [26]<br />
                3 局部质量 [13]<br />

            </Card>
        </>
    );
};

export default App;