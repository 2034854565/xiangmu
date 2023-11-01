import { PlusOutlined } from '@ant-design/icons';
import { Row, Col, Tree, Button, Popconfirm, notification } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { KnowledgeStandingBookItem } from './data.d';
import styles from './style.less';
import { history } from 'umi';
import { queryTreeData, queryKnowledgeData, downLoadFile, deleteData } from './service';
import proxy from '../../../../config/proxy';

const Query: React.FC<{}> = () => {

  const actionRef = useRef<ActionType>();
  const [treeData, setTreeData] = useState([]);
  const [query, setQuery] = useState({});

  useEffect(() => {
    queryTreeData().then(res => {
      setTreeData(res);
    });
    // const params = {
    //   current: 1,
    //   pageSize: 5,
    // }
    // queryKnowledgeData(params).then(res => {
    //   setList(res.list);
    // })
  }, []);

  const goKnowledgeDetail = (_: any, record: any) => {
    console.log(_, record);
    history.push(`/intelligentSearch/knowledgeDetail/${record.id}`)
  }

  const editKnowledgeDetail = (_: any, record: any) => {
    console.log(_, record);
    history.push(`/konwledgeStandingBook/create?id=${record.id}`)
  }

  const downLoad = (_: any, record: any) => {
    if (record.fileId) {
      // downLoadFile({ fileId: record.fileId }).then(res => {
      //   console.log('res============>', res)
      // })
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = `${proxy.dev['/imip/'].target}/imip/file/download?fileId=${record.fileId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      notification.info({
        message: '暂无附件下载！',
      });
    }
  }

  const deleteKnowledge = (record: any) => {
    const list = [];
    list.push(record.id);
    deleteData(list).then(res => {
      if (res.message === 'OK') {
        notification.success({
          message: '删除成功！'
        });
        actionRef.current?.reload();
      }
    });
  }

  const columns: ProColumns<KnowledgeStandingBookItem>[] = [
    {
      title: '编号',
      dataIndex: 'knowledgeNumber',
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'knowledgeName',
      align: 'center',
    },
    {
      title: '适用专业',
      dataIndex: 'knowledgeLevel',
      align: 'center',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 200,
      align: 'center',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => goKnowledgeDetail(_, record)}
        >
          详情
        </a>,
        <a
          key="editable"
          onClick={() => editKnowledgeDetail(_, record)}
        >
          编辑
        </a>,
        <a
          key="download"
          onClick={() => downLoad(_, record)}
        >
          下载
        </a>,
        <Popconfirm key="popconfirm1" title={`确认删除吗?`} onConfirm={() => deleteKnowledge(record)} okText="是" cancelText="否" >
          <a
            key="delete"
          >
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];

  // const list: KnowledgeStandingBookItem[] = [];

  // for (let i = 0; i < 10; i += 1) {
  //   list.push({
  //     id: `ZS20220422000${i}`,
  //     name: i % 2 === 1 ? '面向TSI认证横风安全性评估的CWC曲线计算方法' : '制动系统冲动限制产生的过程和原理',
  //     major: i % 2 === 1 ? '总体/整车系统设计/空气动力学' : '总体/整车系统设计',
  //   });
  // }

  const creatKnowledge = () => {
    history.push('/konwledgeStandingBook/create');
  };

  const queryKnowlegeList = (selectedKeys: any, e: any) => {
    console.log('e------>', e.node.title)
    setQuery({
      ...query,
      knowledgeLevel: e.node.title,
    });
  };

  return (
    <>
      <div style={{ backgroundColor: 'white' }}>
        <Row>
          <Col span={4} className={styles.trerList}>
            <div className={styles.treeTitle}>轨道交通装备专业知识树</div>
            <Tree
              treeData={treeData}
              onSelect={(selectedKeys, e) => queryKnowlegeList(selectedKeys, e)}
            />
          </Col>
          <Col span={20}>
            <ProTable
              columns={columns}
              actionRef={actionRef}
              params={query}
              rowKey="id"
              request={async (params) => {
                const res = await queryKnowledgeData(params);
                return {
                  data: res.list,
                  total: res.total,
                }
              }}
              toolBarRender={() => [
                <Button key="add" type="primary" onClick={() => creatKnowledge()}>
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
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Query;
