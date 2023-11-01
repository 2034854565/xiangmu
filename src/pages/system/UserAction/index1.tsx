import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Select,
  Table,
  Form,
  Input,
  Button,
  TimePicker,
  DatePicker,
  Row,
  Col,
  message,
  Card,
} from 'antd';
import { queryUserActionList, queryUserActionQuery } from './service';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface UserActionProps {
  // isFullScreen: boolean;
  // offIcon: any;
  // onIcon: any;
  // fanType: any;
}

interface DataType {
  id: string;
  username: string;
  updateAt: string;
  actionName: string;
  content: string;
  pageName: string;
  pageUrl: string;
  element: string;
}

const data: DataType[] = [
  {
    id: '1',
    username: 'John ',
    updateAt: '2022-3-1 19:00:00',
    actionName: '下载报告',
    content: '下载了一份报告',
    pageName: '通风机页面',
    pageUrl: 'www.example.com/poster.html',
    element: '相似设计',
  },
  {
    id: '2',
    username: 'John ',
    updateAt: '2022-3-1 19:00:00',
    actionName: '下载报告',
    content: '下载了一份报告',
    pageName: '通风机页面',
    pageUrl: 'www.example.com/poster.html',
    element: '相似设计',
  },
  {
    id: '3',
    username: 'John ',
    updateAt: '2022-3-1 19:00:00',
    actionName: '下载报告',
    content: '下载了一份报告',
    pageName: '通风机页面',
    pageUrl: 'www.example.com/poster.html',
    element: '相似设计',
  },
];

const UserAction: React.FC<UserActionProps> = (props) => {
  const pageSize = 10;
  const [pageNo, setPageNo] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState<number>();
  const [queryParams, setQueryParams] = useState({});

  const onFinish = (fieldsValue: any) => {
    const deleteInvalid = Object.keys(fieldsValue)
      .filter((key) => fieldsValue[key] !== null && fieldsValue[key] !== undefined)
      .reduce((acc, key) => ({ ...acc, [key]: fieldsValue[key] }), {});

    let values = {};
    if (fieldsValue['updateAt']?.length > 0) {
      let rangeTimeValue = fieldsValue['updateAt'];
      values = {
        ...deleteInvalid,
        // 'username': fieldsValue['username'],
        beginTime: rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
        // 'actionPage': fieldsValue['actionPage'],
        // 'actionName': fieldsValue['actionName'],
      };
    } else {
      values = {
        ...deleteInvalid,
      };
    }
    console.log('values');
    console.log(values);

    setQueryParams(values);
    const params = {
      ...values,
      pageNo: 1,
      pageSize,
    };
    // console.log('Received values of form: ', values);
    queryUserActionQuery(params)
      .then((res) => {
        console.log('@@', res?.data);
        setTableData(res?.data);
        setTotal(res.total);
        setPageNo(params.pageNo);
      })
      .catch((error) => {
        message.error('请求失败！');
        return;
      });
  };
  console.log('#####', queryParams);
  useEffect(() => {
    queryUserActionList({ pageNo, pageSize })
      .then((res) => {
        setTableData(res?.data);
        setTotal(res.total);
      })
      .catch((error) => {
        message.error('请求失败！');
        return;
      });
  }, []);

  const handlePage = (page: number) => {
    setPageNo(page);
    let params = {};
    if (Object.keys(queryParams).length > 0) {
      params = { ...queryParams, pageNo: page, pageSize };
    } else {
      params = { pageNo: page, pageSize };
    }
    console.log('params');
    console.log(params);

    queryUserActionList(params)
      .then((res) => {
        setTableData(res?.data);
      })
      .catch((error) => {
        message.error('请求失败！');
        return;
      });
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      // render: (text) => <a>{text}</a>,
      render: (id) => `${pageSize * (pageNo - 1) + parseInt(id) + 1}`,
    },

    {
      title: '事件名称',
      dataIndex: 'actionName',
      key: 'actionName',
    },
    {
      title: '事件内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '页面名称',
      dataIndex: 'pageName',
      key: 'pageName',
    },
    {
      title: '页面链接',
      dataIndex: 'pageUrl',
      key: 'pageUrl',
    },
    {
      title: '页面区域',
      dataIndex: 'element',
      key: 'element',
    },
    {
      title: '事件用户',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '事件时间',
      dataIndex: 'updateAt',
      key: 'updateAt',
    },
  ];

  return (
    <div>
      <PageContainer
        header={{
          breadcrumb: {},
        }}
      >
        <Card>
          <Form layout="horizontal" onFinish={onFinish}>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label="事件用户" name="username">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="事件时间" name="updateAt">
                  <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }}
                >
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Form.Item>
              </Col>
              {/* <Col span={8}>
        <Form.Item label="事件页面" name="actionPage" >
          <Select>
            <Option value="通风机">通风机</Option>
          </Select>
        </Form.Item>
        </Col>
        <Col span={8}>
        <Form.Item label="事件名称" name="actionName">
          <Input />
        </Form.Item>
        </Col>
        <Col span={4}>
        <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
        </Col> */}
            </Row>
          </Form>
        </Card>
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{
            current: pageNo,
            defaultPageSize: pageSize,
            // total: dataArr?.total,
            onChange: handlePage,
            total: total,
            simple: true,
          }}
        />
      </PageContainer>
    </div>
  );
};

export default UserAction;
