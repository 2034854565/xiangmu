import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { WorkHourListItem } from './data.d';
import { queryMethodsData } from './service';
import { history } from 'umi';

const UserManage: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();
  // const [query, setQuery] = useState({});

  const data: WorkHourListItem[] = [];
  for (let index = 0; index < 20; index++) {
    const obj = {
      number: `1410000050${index}`,
      name: '司机室布线准备',
      type: '布线',
      carType: '机车',
      platformName: '车间平台',
      category: '机械',
      unit: '机车事业部',
      homework: 1.23,
      standard: 2.89,
      createTime: '2020-09-09',
      record: '--',
    };
    data.push(obj);
  }

  const columns: ProColumns<WorkHourListItem>[] = [
    {
      title: '工序编码',
      dataIndex: 'number',
      valueType: 'textarea',
      align: 'center',
      width: 150,
    },
    {
      title: '工序名称',
      dataIndex: 'name',
      valueType: 'textarea',
      align: 'center',
      width: 150,
    },
    {
      title: '部件分类',
      dataIndex: 'type',
      valueType: 'textarea',
      align: 'center',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '车型',
      dataIndex: 'carType',
      valueType: 'textarea',
      align: 'center',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '平台名称',
      dataIndex: 'platformName',
      valueType: 'textarea',
      align: 'center',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '类别',
      dataIndex: 'category',
      valueType: 'textarea',
      align: 'center',
      width: 150,
      // hideInSearch: true,
    },
    {
      title: '单位名称',
      dataIndex: 'unit',
      valueType: 'textarea',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '台车作业时间/min',
      dataIndex: 'homework',
      valueType: 'textarea',
      align: 'center',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '台车标准工时/min',
      dataIndex: 'standard',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'textarea',
      align: 'center',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '更改记录',
      dataIndex: 'record',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 120,
      render: (_, record) => [
        <a
          key="editable"
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <>
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
              <a>导出</a>
            </Space>
          );
        }}
        dataSource={data}
        rowKey="number"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button key="show">导出</Button>,
          <Button key="out">
            导入
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
