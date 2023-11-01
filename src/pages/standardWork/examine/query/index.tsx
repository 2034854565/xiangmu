import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { SupervisionListItem } from './data.d';
import { history } from 'umi';

const ExamineQuery: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();
  // const [query, setQuery] = useState({});
  const data: SupervisionListItem[] = [];
  for (let index = 0; index < 20; index++) {
    const obj = {
      number: `1410000050${index}`,
      time: '2020-09-09',
      unit: '机车事业部',
      major: '组装工艺标准化作业',
      remark: '2021.12.27：HxD1浩吉144号A节后端墙过道门行灯线孔',
      procedure: '铁鞋管控柜安装',
      isCheck: '是',
      score: 1.23,
      money: 2.89,
      workNo: `1101${index}`,
      workName: '李鹏',
      situation: '完成',
      measure: '装固定螺母时损伤面漆.现场交流左虎',
    };
    data.push(obj);
  }

  const goMethodDetail = (_: any, record: any) => {
    console.log('===========>', record)
    history.push('/standardWork/examine/create')
  }

  const columns: ProColumns<SupervisionListItem>[] = [
    {
      title: '编号',
      dataIndex: 'number',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 100,
      fixed: 'left',
    },
    {
      title: '专项审核名称',
      dataIndex: 'time',
      valueType: 'textarea',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '责任单位',
      dataIndex: 'unit',
      valueType: 'textarea',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '审核情况',
      dataIndex: 'major',
      valueType: 'textarea',
      align: 'center',
      width: 150,
    },
    {
      title: '改进措施',
      dataIndex: 'remark',
      valueType: 'textarea',
      align: 'center',
      width: 250,
      hideInSearch: true,
    },
    {
      title: '整改时间要求',
      dataIndex: 'procedure',
      valueType: 'textarea',
      align: 'center',
      width: 100,
    },
    {
      title: '输出考核',
      dataIndex: 'isCheck',
      valueType: 'textarea',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '考核分数',
      dataIndex: 'score',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '整改完成情况',
      dataIndex: 'situation',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '整改措施',
      dataIndex: 'measure',
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
      fixed: 'right',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => goMethodDetail(_, record)}
        >
          详情
        </a>,
        <a
          key="delete"
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
        dataSource={data}
        rowKey="number"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button key="primary" type="primary" onClick={() => goMethodDetail(1, 2)}>
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
        scroll={{ x: 'calc(800px + 50%)' }}
      />
    </>
  );
};

export default ExamineQuery;
