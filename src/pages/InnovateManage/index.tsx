import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, Popconfirm, notification } from 'antd';
import React, { useRef, useEffect } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { InnovateManageListItem } from './data.d';
import { queryMethodsData, deleteMethodsData } from './service';
import { history } from 'umi';

const UserManage: React.FC<{}> = (props) => {

  const actionRef = useRef<ActionType>();
  // const [query, setQuery] = useState({});

  const goMethodDetail = (_: any, record: any) => {
    console.log('===========>', record)
    history.push(`/intelligentSearch/detail/${record.id}`)
  }

  const editMethodDetail = (_: any, record: any) => {
    history.push(`/innovateManage/create?id=${record.id}`)
  }

  const createMehtod = () => {
    history.push('/innovateManage/create');
  }

  const deleteMethod = (record: any) => {
    console.log(record)
    const list = [];
    list.push(record.id);
    deleteMethodsData(list).then(res => {
      if (res.message === 'OK') {
        notification.success({
          message: '删除成功！'
        });
        actionRef.current?.reload();
      }
    })
  }

  const columns: ProColumns<InnovateManageListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'index',
      align: 'center',
      hideInSearch: true,
      width: 50,
    },
    {
      title: '编号',
      dataIndex: 'methodNumber',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '方法名称',
      dataIndex: 'methodName',
      valueType: 'textarea',
      align: 'center',
      width: 150,
    },
    {
      title: '产品类型',
      dataIndex: 'innovativeProducts',
      valueType: 'select',
      align: 'center',
      width: 250,
      hideInSearch: true,
    },
    {
      title: '创新对象',
      dataIndex: 'innovativeObjects',
      valueType: 'select',
      align: 'center',
      width: 250,
      hideInSearch: true,
    },
    {
      title: '创新链环节',
      dataIndex: 'innovativeChain',
      valueType: 'select',
      align: 'center',
      width: 250,
      hideInSearch: true,
    },
    {
      title: '创新类别',
      dataIndex: 'innovativeType',
      valueType: 'select',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '创新程序',
      dataIndex: 'innovativeProgram',
      valueType: 'select',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '应用案例',
      dataIndex: 'applicationCase',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'createTime',
      valueType: 'date',
      align: 'center',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '方法来源',
      dataIndex: 'patentsNo',
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
      width: 150,
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => goMethodDetail(_, record)}
        >
          详情
        </a>,
        <a
          key="editable"
          onClick={() => editMethodDetail(_, record)}
        >
          编辑
        </a>,
        <Popconfirm key="popconfirm1" title={`确认删除吗?`} onConfirm={() => deleteMethod(record)} okText="是" cancelText="否" >
          <a
            key="delete"
          >
            删除
          </a>
        </Popconfirm >,
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
        request={async (params) => {
          const res = await queryMethodsData(params);
          return {
            data: res.list,
            total: res.total,
          }
        }}
        // dataSource={list}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button key="primary" type="primary" onClick={() => createMehtod()}>
            <PlusOutlined />新建
          </Button>,
          // <Button key="show">导出</Button>,
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
