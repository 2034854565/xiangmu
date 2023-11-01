import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, Rate } from 'antd';
import React, { useRef, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { InnovateManageListItem } from './data.d';
import { queryCaseData } from './service';
import { history } from 'umi';
import NovelAnalyze from './NovelAnalyze'

const UserManage: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();
  // const [query, setQuery] = useState({});

  useEffect(() => {

  });

  const createCase = (_: any, record: any) => {
    history.push(`/example/create?id=${record.id}`)
  }

  const createExample = () => {
    history.push('/example/create');
  }

  const goDetail = (_: any, record: any) => {
    // console.log('===========>', record)
    history.push(`/example/detail?id=${record.id}`);
  }

  const columns: ProColumns<InnovateManageListItem>[] = [
    {
      title: '编号',
      dataIndex: 'caseNumber',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '案例名称',
      dataIndex: 'caseName',
      valueType: 'textarea',
      align: 'center',
      width: 150,
    },
    {
      title: '内容简要',
      dataIndex: 'caseContent',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '背景',
      dataIndex: 'background',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '重要程度',
      dataIndex: 'important',
      // valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 100,
      render: (_, record) => (
        <Rate count={record.important} disabled value={record.important}></Rate>
      ),
    },
    {
      title: '关联方法',
      dataIndex: 'methodName',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 120,
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => goDetail(_, record)}
        >
          详情
        </a>,
        <a
          key="add"
          onClick={() => createCase(_, record)}
        >
          编辑
        </a>,
        <a
          key="delete"
        >
          删除
        </a>,
        <a
          key="download"
        >
          下载
        </a>,
      ],
    },
  ];

  return (
    <>
   <div> <NovelAnalyze/></div>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowSelection={{
        }}
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                清空
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a>删除</a>
            </Space>
          );
        }}
        request={async (params) => {
          const res = await queryCaseData(params);
          return {
            data: res.data.list,
            total: res.data.total,
          }
        }}
        // dataSource={list}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button key="primary" type="primary" onClick={() => createExample()}>
            <PlusOutlined />新建
          </Button>,
        ]}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        dateFormatter="string"
        options={false}
      // scroll={{ x: 'calc(800px + 50%)' }}
      />


    </>
  );
};

export default UserManage;
