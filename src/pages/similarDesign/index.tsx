// FanSimilarDesign

import React from 'react';
import { Button, Form, Input } from 'antd';
import { Card } from 'antd';
import { Descriptions } from 'antd';

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 16 },
};

/* eslint-disable no-template-curly-in-string */
// const validateMessages = {
//   required: '${label} is required!',
//   types: {
//     email: '${label} is not a valid email!',
//     number: '${label} is not a valid number!',
//   },
//   number: {
//     range: '${label} must be between ${min} and ${max}',
//   },
// };
/* eslint-enable no-template-curly-in-string */

const FanSimilarDesign: React.FC = () => {
  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    // <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>

    <div>
      <Card title="输入工作参数" style={{ width: '50% ' }}>
        <Form {...layout} name="nest-messages" onFinish={onFinish}>
          <Form.Item
            style={{ width: 1200 }}
            name={['user', 'flowRate']}
            label="流量(m³/s)"
            rules={[{ required: true, type: 'number' }]}
          >
            <Input style={{ width: '30%' }} />
          </Form.Item>
          <Form.Item
            style={{ width: 1200 }}
            name={['user', 'fullPressure']}
            label="压力(N)"
            rules={[{ required: true, type: 'number' }]}
          >
            <Input style={{ width: '30%' }} />
          </Form.Item>
          <Form.Item
            style={{ width: 1200 }}
            name={['user', 'motorSpeed']}
            label="转速(r/min)"
            rules={[{ required: true, type: 'number' }]}
          >
            <Input style={{ width: '30%' }} />
          </Form.Item>
          <Form.Item
            style={{ width: 1200 }}
            name={['user', 'efficiency']}
            label="效率(%)"
            rules={[{ type: 'number' }]}
          >
            <Input style={{ width: '30%' }} />
          </Form.Item>
          <Form.Item
            style={{ width: 1200 }}
            name={['user', 'temperature']}
            label="温度(C)"
            rules={[{ type: 'number' }]}
          >
            <Input style={{ width: '30%' }} />
          </Form.Item>
          <Form.Item
            style={{ width: 1200 }}
            name={['user', 'altitude']}
            label="海拔(m)"
            rules={[{ type: 'number' }]}
          >
            <Input style={{ width: '30%' }} />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 1 }}>
            <Button type="primary" htmlType="submit">
              输出工作参数
            </Button>
          </Form.Item>
        </Form>

        <Descriptions>
          <Descriptions.Item label="转速比(r/min)">2</Descriptions.Item>
          <Descriptions.Item label="功率(kW)">1100</Descriptions.Item>
          <Descriptions.Item label="密度(Pa)">2880</Descriptions.Item>
          <Descriptions.Item label="流量(m³/s)">4</Descriptions.Item>
          <Descriptions.Item label="压力(kg)">95</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default FanSimilarDesign;
