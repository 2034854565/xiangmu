/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-04-27 10:15:50
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-23 09:44:32
 */
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
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { UserActionListItem } from './data';
import moment from 'moment';

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
  let [searchParams, setSearchParams] = useState<{}>({});
  const [pageOption, setPageOption] = useState<{ current: number; pageSize: number }>({
    current: 1, //当前页为1
    pageSize: 10, //一页5行
  });

  const columns: ProColumns<UserActionListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      hideInSearch: true,
      render: (text, record, index) => {
        return (pageOption.current - 1) * pageOption.pageSize + (index + 1);
      },
    },
    {
      title: '监控模块',
      dataIndex: 'monitorModule',
      key: 'monitorModule',
      hideInSearch: true,
    },
    {
      title: '页面名称',
      dataIndex: 'pageName',
      key: 'pageName',
      hideInSearch: true,
    },
    {
      title: '页面链接',
      dataIndex: 'pageUrl',
      key: 'pageUrl',
      hideInSearch: true,
    },
    {
      title: '页面区域',
      dataIndex: 'pageArea',
      key: 'pageArea',
      hideInSearch: true,
    },
    {
      title: '事件类型',
      dataIndex: 'actionType',
      key: 'actionType',
      hideInSearch: true,
    },
    {
      title: '事件名称',
      dataIndex: 'actionName',
      key: 'actionName',
      hideInSearch: true,
    },
    {
      title: '事件详情',
      dataIndex: 'description',
      key: 'description',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '事件用户',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '事件时间',
      dataIndex: 'actionTime',
      valueType: 'dateTime',
      key: 'actionTime',
      hideInSearch: true,
    },
    {
      title: '事件时间',
      dataIndex: 'updateAt',
      hideInTable: true,
      hideInSearch: true,
      render: (text, record, index) => {
        return moment(record.updateAt).format('YYYY-MM-DD HH:mm:ss');
      },
      // renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      //   // console.log('item');
      //   // console.log(item);

      //   return (
      //     <>
      //       <RangePicker
      //         showTime
      //         format="YYYY-MM-DD HH:mm:ss"
      //         onChange={(e) => {
      //           console.log(e);
      //           form.setFieldValue('updateAt', e);
      //         }}
      //       />
      //     </>
      //   );
      // },
    },
    {
      title: '事件时间',
      dataIndex: 'updateAt',
      hideInTable: true,
      hideInSearch: false,
      render: (text, record, index) => {
        return moment(record.updateAt).format('YYYY-MM-DD HH:mm:ss');
      },
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        // console.log('item');
        // console.log(item);

        return (
          <>
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              onChange={(e) => {
                console.log(e);
                form.setFieldValue('updateAt', e);
              }}
            />
          </>
        );
      },
    },
    // {
    //   title: '操作详情',
    //   dataIndex: 'operation',
    //   render: (_, record: { key: React.Key }) =>

    //     <Button onClick={() => openDescription(record)} >
    //       操作详情
    //     </Button>

    // },
  ];
  const openDescription = () => {};
  return (
    <div>
      <PageContainer
        header={{
          breadcrumb: {},
        }}
      >
        <ProTable
          columns={columns}
          // dataSource={tableData}
          rowKey="id"
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                <span>
                  <div style={{ color: '#1890ff' }}>事件详情：</div>
                  {record.description}
                </span>
              </p>
            ),
            rowExpandable: (record) => record.description !== '无内容',
          }}
          // params={searchParams}
          request={async (params) => {
            console.log('request params');

            console.log(params);

            const res = await queryUserActionQuery(params);
            console.log('res');
            console.log(res);

            return res;

            // return {
            //   data: res.data,
            //   total: res.total,
            // };
          }}
          search={{
            labelWidth: 'auto',
            // labelWidth: 70,
            // span: 6,
            showHiddenNum: true,
            defaultCollapsed: false,
            optionRender: ({ searchText, resetText }, { form }, dom) => [
              <Button
                key="resetText"
                onClick={() => {
                  form?.resetFields();

                  form?.submit();
                }}
              >
                {resetText}
              </Button>,
              <Button
                key="searchText"
                type="primary"
                onClick={() => {
                  console.log(form?.getFieldsValue());

                  form?.submit();
                }}
              >
                {searchText}
              </Button>,
            ],
          }}
          // pagination={{
          //   current: pageNo,
          //   defaultPageSize: pageSize,
          //   // total: dataArr?.total,
          //   onChange: handlePage,
          //   total: total,
          //   simple: true,
          // }}
          pagination={{
            // ...pageOption,
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['5', '10', '20', '50'], // 每页数量选项
          }}
          // onChange={(e) => {
          //   // console.log('onChange e');
          //   // console.log(e);
          //   setPageOption({ current: e.current, pageSize: e.pageSize });
          //   setSearchParams({ ...searchParams, current: e.current, pageSize: e.pageSize });
          // }}
        />
      </PageContainer>
    </div>
  );
};

export default UserAction;
