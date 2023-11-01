import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { QuotaListItem } from './data.d';
import { queryMethodsData } from './service';
import { history } from 'umi';

const UserManage: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();
  // const [query, setQuery] = useState({});

  const data: QuotaListItem[] = [];
  for (let index = 0; index < 20; index++) {
    const obj = {
      number: `1410000050${index}`,
      name: 'Roxte模块润滑脂',
      type: '50ml',
      carType: '机车',
      part: 'A车侧顶板',
      quota: 0.05,
      unit: 'kg',
      use: '粘接作业前的清洁',
      remark: '粘接作业前的清洁',
    };
    data.push(obj);
  }

 : ProColumns<QuotaListItem>[] = [
    {
      title: '零件编码',
      dataIndex: 'number',
      valueType: 'textarea',
      align: 'center',
      width: 150,
    },
    {
      title: '零件名称',
      dataIndex: 'name',
      valueType: 'textarea',
      align: 'center',
      width: 150,
    },
    {
      title: '规格型号',
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
      title: '所属部位',
      dataIndex: 'part',
      valueType: 'textarea',
      align: 'center',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '定额',
      dataIndex: 'quota',
      valueType: 'textarea',
      align: 'center',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      valueType: 'textarea',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '用途',
      dataIndex: 'use',
      valueType: 'textarea',
      align: 'center',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
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
