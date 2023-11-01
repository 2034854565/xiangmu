import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, notification, Space } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ScoreItemType } from './data.d';
import { getMethodCategory, getMethodScore, getMethodsById, getMethodsName, deleteScore } from './service';
import { history } from 'umi';

const FitnessScore: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();

  const [visible, setVisible] = useState(false);
  const [columnList, setColumnList] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => {
    getMethodCategory().then(res => {
      // setCategoryList(res);
      const columnList: any[] = [];
      res.map((column: any) => {
        const columnItem = {
          title: column.name,
          hideInSearch: true,
          children: [],
        };
        column.list.map((item: any) => {
          const obj = {
            title: item.realName,
            dataIndex: item.label,
            valueType: 'textarea',
            align: 'center',
            hideInSearch: true,
            width: 80,
          };
          columnItem.children.push(obj);
        });
        columnList.push(columnItem);
      });
      setColumnList(columnList);
    });
  }, []);

  const getMethodDefine = (_: any, record: any) => {
    Modal.info({
      title: '方法定义',
      content: (
        <div>
          {record.methodContent}
        </div>
      ),
    });
  };

  const createScore = () => {
    setVisible(true);
  }

  const handleOk = () => {
    if (selectedRow) {
      setVisible(false);
      const data = selectedRow;
      history.push('/fitnessScore/create?type=add', data);
    } else {
      notification.info({
        message: '请选择方法！',
      });
    }
  }

  const handleCancel = () => {
    setVisible(false);
  }

  const updateScore = (_: any, record: any) => {
    const data = record;
    history.push(`/fitnessScore/create?type=update`, data);
  }

  const confirm = (_: any, record: any, action: any) => {
    const idList = [];
    const list = [];
    idList.push(record.id);
    list.push(record.methodNumber)
    const params = {
      ids: [],
      methodNumber: [],
    };
    params.ids = idList;
    params.methodNumber = list;
    deleteScore(params).then(res => {
      if (res.message === 'OK') {
        notification.success({
          message: '删除成功！'
        });
        action?.reload();
      }
    });
  };

  const batchDelete = (selectedRows: any, onCleanSelected: any) => {
    const params = {
      ids: [],
      methodNumber: [],
    };
    selectedRows.map((item: any) => {
      params.ids.push(item.id);
      params.methodNumber.push(item.methodNumber);
    });
    deleteScore(params).then(res => {
      if (res.message === 'OK') {
        notification.success({
          message: '删除成功！'
        });
        onCleanSelected();
        actionRef.current?.reload();
      }
    });
  }

  const modalColumns: ProColumns[] = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'index',
      align: 'center',
    },
    {
      title: '编号',
      dataIndex: 'methodNumber',
      valueType: 'textarea',
      align: 'center',
    },
    {
      title: '方法名称',
      dataIndex: 'methodName',
      valueType: 'textarea',
      align: 'center',
    },
  ];

  const columns: ProColumns<ScoreItemType>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'index',
      align: 'center',
      hideInSearch: true,
      width: 50,
      fixed: 'left',
    },
    {
      title: '编号',
      dataIndex: 'methodNumber',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 100,
      fixed: 'left',
    },
    {
      title: '方法名称',
      dataIndex: 'methodName',
      valueType: 'textarea',
      align: 'center',
      width: 150,
      fixed: 'left',
    },
    {
      title: '方法定义',
      dataIndex: 'methodDefine',
      align: 'center',
      hideInSearch: true,
      width: 100,
      fixed: 'left',
      render: (_, record) => <a onClick={() => getMethodDefine(_, record)}>预览</a>,
    },
    ...columnList,
    {
      title: '评分时间',
      dataIndex: 'time',
      valueType: 'date',
      align: 'center',
      hideInSearch: true,
      width: 120,
      fixed: 'right',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => updateScore(_, record)}
        >
          编辑
        </a>,
        <Popconfirm
          title="确认删除?"
          onConfirm={() => confirm(_, record, action)}
          okText="确认"
          cancelText="取消"
        >
          <a
            key="delete"
          >
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        rowSelection={{}}
        bordered
        scroll={{ x: 1300 }}
        request={async (params) => {
          const res = await getMethodScore(params);
          return {
            data: res.list,
            total: res.total,
          }
        }}
        options={false}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => createScore()}>
            新建
          </Button>,
        ]}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
          return (
            <Space size={16}>
              <a onClick={() => batchDelete(selectedRows, onCleanSelected)}>批量删除</a>
            </Space>
          );
        }}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
      <Modal title="适应度评分新建" visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <ProTable
          rowSelection={{
            type: 'radio',
            onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
              setSelectedRow(selectedRows[0]);
            },
          }}
          rowKey='id'
          tableAlertRender={false}
          columns={modalColumns}
          toolBarRender={false}
          search={false}
          request={async (params) => {
            const res = await getMethodsName();
            return {
              data: res,
            }
          }}
        />
      </Modal>
    </>
  );
};

export default FitnessScore;
