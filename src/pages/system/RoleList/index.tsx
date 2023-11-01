/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-02-13 14:13:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-16 16:53:23
 */
/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-02-13 14:13:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-05 19:54:43
 */
import { point } from '@antv/g2plot';
import {
  Table,
  Popconfirm,
  Modal,
  Button,
  Form,
  Input,
  message,
  Typography,
  InputNumber,
  Collapse,
  Checkbox,
  Spin,
  Card,
  Divider,
  Row,
  notification,
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import {
  queryRoleList,
  deleteRole,
  addRole,
  editRole,
  queryTreeList,
  queryRolePermission,
  saveRolePermission,
} from './service';
import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons';
import ModalCheck from './components/ModalCheck';
const FormItem = Form.Item;
import { useModel } from 'umi';
import { useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType } from '@ant-design/pro-table';

const { Panel } = Collapse;

const TableList: React.FC<{}> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const actionRef = useRef<ActionType>();

  const [roleList, setRoleList] = useState([]);
  const [pageOption, setPageOption] = useState<{ current: number; pageSize: number }>({
    current: 1, //当前页为1
    pageSize: 5, //一页5行
  });
  const [isAddModal, setIsAddModal] = useState(false);
  const [isAddModal2, setIsAddModal2] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editRoleData, setEditRoleData] = useState({});
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  // 全路由
  const [allRoutes, setAllRoutes] = useState<{}[]>([]);
  // 当前角色拿到的路由
  const [curremtRoleRoutes, setCurremtRoleRoutes] = useState(['first']);
  const [currentRoleID, setCurrentRoleID] = useState('');
  // 经过配置的西路有，permissionids[1]
  const [newRouteIds, setNewRouteIds] = useState<number[]>(['first']);
  const [isloading, setIsloading] = useState(false);
  const [creator, setCreator] = useState('');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const handleDelete = (id) => {
    setEditingKey('');
    deleteRole(id).then((data) => {
      if (data.status === 200) {
        message.success('删除角色成功');
        // queryRoleList({})
        //   .then((data) => {
        //     setRoleList(data.data);
        //   })
        //   .catch((error) => {
        //     message.error('请求失败！');
        //     return;
        //   });
        actionRef.current?.reload();
      } else {
        message.error('删除角色失败,请重试');
      }
    });
  };

  const edit = (record: any) => {
    editForm.setFieldsValue({
      name: '',
      desc: '',
      id: '',
      code: '',
      createBy: '',
      updateBy: '',
      ...record,
    });
    console.log(record);
    setCreator(record.creator);
    setEditingKey(record.id);
    setCurrentRoleID(record.id);
  };

  const cancel = () => {
    setEditingKey('');
    // window.location.reload();
  };

  const isEditing = (record) => record.id === editingKey;

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record = {},
    index,
    children,
    ...restProps
  }) => {
    const inputNode = <Input initialvalues={record?.[dataIndex]} />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            initialValue={record?.[dataIndex]}
            rules={[
              {
                required: ['description'].includes(dataIndex) ? false : true,
                message: '必填字段！',
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const columns = [
    {
      title: '创建人',
      dataIndex: 'createBy',
      key: 'createBy',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      align: 'center',
      sorter: (a, b) => moment(a.createAt).valueOf() - moment(b.createAt).valueOf(),

      hideInSearch: true,
      render: (_, record: any) => {
        return record.createAt ? (
          <span>{moment(record.createAt).format('YYYY-MM-DD HH:mm')}</span>
        ) : (
          '--'
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      editable: true,
      width: 200,
      hideInSearch: true,
      align: 'center',
    },
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: 'center',
    //   hideInSearch: true,
    //   editable: false,
    // },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      key: 'roleCode',
      editable: true,
      width: 80,
      align: 'center',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      editable: true,
      width: 120,
      align: 'center',
    },
    {
      title: '更新人',
      dataIndex: 'updateBy',
      key: 'updateBy',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '更新日期',
      dataIndex: 'updateAt',
      key: 'updateTime',
      align: 'center',
      hideInSearch: true,
      render: (_, record: any) => {
        return record.updateAt ? (
          <span>{moment(record.updateAt).format('YYYY-MM-DD HH:mm')}</span>
        ) : (
          '--'
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '15%',
      align: 'center',
      hideInSearch: true,
      render: (_, record: any) => {
        const editable = isEditing(record);
        return (
          <Row>
            {/* <div style={{ marginTop: 10 }}> style={{ display: 'flex' }}*/}
            {editable ? (
              <div>
                {/* <a onClick={onFinish}>保存</a> */}
                <a onClick={() => onFinish()}>保存</a>
                <Divider type="vertical" style={{ marginTop: 0 }} />

                <a onClick={cancel}>取消</a>
              </div>
            ) : (
              <Typography.Link
                disabled={editingKey !== ''}
                onClick={() => edit(record)}
                // style={{ color: '#066aff' }}
              >
                编辑
              </Typography.Link>
            )}
            <Divider type="vertical" style={{ marginTop: 5 }} />

            {
              <a>
                <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
                  <span style={{ cursor: 'pointer' }}>删除</span>
                </Popconfirm>
              </a>
            }
            <Divider type="vertical" style={{ marginTop: 5 }} />
            <a
              onClick={() => {
                // console.log('配置路由');
                setCurrentRoleID(record.id);
                setIsAddModal2(true);
                // queryRolePermission({ roleId: record.id }).then((data) => {
                queryRolePermission(record.id).then((res) => {
                  console.log(res);
                  console.log(res.data.menuIds);

                  setCurremtRoleRoutes(res.data.menuIds); // 当前角色拿到的路由
                  setNewRouteIds(res.data.menuIds); // 经过配置的新路由，permissionids
                  console.log('配置路由 newRouteIds');
                  // console.log(newRouteIds);
                });
              }}
            >
              配置路由
            </a>
            {/* </div>*/}
            <span></span>
          </Row>
        );
      },
    },
  ];

  useEffect(() => {
    queryRoleList({}).then((res) => {
      res.data.map((item, index) => {
        item.key = index;
      });
      setRoleList(res.data);
    });
  }, [1]);

  useEffect(() => {
    queryTreeList().then((res) => {
      setAllRoutes(res.data?.treeList);
    });
  }, [1]);

  const handleAdd = () => {
    setCurremtRoleRoutes([]); // 当前角色拿到的路由
    console.log('!!!!handleAdd setNewRouteIds');
    console.log(newRouteIds);

    setNewRouteIds([]); // 经过配置的新路由，permissionids
    setNewRouteIds([]); // 经过配置的新路由，permissionids

    setIsAddModal(true);
  };
  const handleCancel = () => {
    console.log('!!!!handleCancel setNewRoteIds ');

    // handleNewRoutes(['first']);
    form.resetFields();
    setIsAddModal(false);
    setCurremtRoleRoutes(['first']);
    setNewRouteIds(['first']);
  };

  const handleCancel2 = () => {
    setIsAddModal2(false);
    // setIsloading(true);
    // window.location.reload();
    setCurremtRoleRoutes(['first']);
    console.log('!!!!!handleCancel2 setNewRouteIds');

    setNewRouteIds(['first']);
  };

  const handleOk = async () => {
    const fieldsValue = await form.validateFields();
    setSubmitLoading(true);
    fieldsValue.createBy = initialState?.currentUser?.name;
    console.log(fieldsValue);
    // console.log('newRouteIds');
    // console.log(newRouteIds);
    // console.log('currentRoleID');
    // console.log(currentRoleID);
    addRole({ ...fieldsValue, permissionIds: newRouteIds })
      .then((data) => {
        if (data.status === 200) {
          message.success('新增角色成功');
          setIsAddModal(false);
          form.resetFields();
          // queryRoleList({}).then((res) => {
          //   setRoleList(res.data);
          // });
          setCurremtRoleRoutes(['first']);
          console.log('!!!!addRole setNewRouteIds');

          setNewRouteIds(['first']);
          setIsloading(false);

          actionRef.current?.reload();
          // setSubmitLoading(false);
          // return true;
        } else {
          message.error('新增角色失败,请重试');
          // setSubmitLoading(false);
          // return true;
        }
      })
      .finally(() => {
        setSubmitLoading(false);
      });
    // return () => setSubmitLoading(false);
  };

  const handleOk2 = () => {
    console.log('handleOk2');

    setIsAddModal2(false);
    setIsloading(true);
    setSubmitLoading(true);
    queryRolePermission(currentRoleID).then((data) => {
      console.log('queryRolePermission data');
      console.log(data);

      saveRolePermission({
        roleId: currentRoleID,
        permissionIds: newRouteIds,
        lastpermissionIds: data.data.menuIds,
      }).then((item) => {
        console.log(item);

        if (item.success) {
          console.log(item.success);

          // setIsloading(true);
          // window.location.reload();
          setCurremtRoleRoutes(['first']);
          console.log('!!!!!!handleOk2 setNewRouteIds');

          setNewRouteIds(['first']);
          setIsloading(false);
          message.success('配置路由成功');
        } else {
          message.error('配置路由失败，请重试');
        }
      });
    });
    // .finally(() => {
    //   setSubmitLoading(false);
    // });
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const onFinish = async () => {
    const values = await editForm.validateFields();
    console.log('values');
    console.log(values);

    values.id = currentRoleID;
    values.updateBy = initialState?.currentUser?.name;
    values.createBy = creator;
    console.log('============>123', values);
    await editRole(values).then((res) => {
      console.log(res);

      if (res.success) {
        message.success('修改成功');
        setEditingKey('');
        actionRef.current?.reload();
      } else {
        notification.error({
          message: `请求错误 ${res.status} `,
          description: res.msg,
        });
      }
    });
    // .finally(() => {
    // });
  };

  const expandedRowRender = (record, index, indent, expanded) => {
    // queryRolePermission({ roleId: record.id }).then((data) => {
    //   console.log(data, '+data');
    // });
    return <div>waiting</div>;
  };

  const handleExpandedRowsChange = (expandedRows) => {
    setExpandedRowKeys(expandedRows);
  };

  // const handleCollapse = (data) => {
  //   return (
  //     <Collapse
  //       bordered={false}
  //       expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
  //       className="site-collapse-custom-collapse"
  //     >
  //       {data.map((item, index) => {
  //         console.log(item, '+item');
  //         return (
  //           <Panel header={item.slotTitle} key={index + 1} className="site-collapse-custom-panel">
  //             {!!item.children[index].children ? (
  //               handleCollapse(item.children[index])
  //             ) : (
  //               <div>waiting</div>
  //             )}
  //           </Panel>
  //         );
  //       })}
  //     </Collapse>
  //   );
  // };

  const handleNewRoutes = (data) => {
    console.log('handleNewRoutes setNewRouteIds');

    setNewRouteIds(data);
  };

  useEffect(() => {
    console.log(5555);

    setNewRouteIds(newRouteIds);
  }, [newRouteIds]);

  return (
    <>
      <PageContainer
        header={{
          breadcrumb: {},
        }}
      >
        <Form form={editForm} name="editRole" onFinish={onFinish}>
          <ProTable
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            toolBarRender={() => {
              return [
                <Button
                  onClick={handleAdd}
                  type="primary"
                  // style={{
                  //   marginBottom: 16,
                  // }}
                >
                  <PlusOutlined />
                  新增角色
                </Button>,
              ];
            }}
            columns={mergedColumns}
            actionRef={actionRef}
            // dataSource={roleList}
            request={async (params) => {
              // params = { ...params, ...pageOption };
              setEditingKey('');
              const res = await queryRoleList(params);
              return res;
            }}
            bordered
            size="middle"
            pagination={{
              // ...pageOption,
              defaultPageSize: 5,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['5', '10', '20', '50'], // 每页数量选项
            }}
            // onChange={(e) => {
            //   // console.log('onChange e');
            //   // console.log(e);
            //   setPageOption({ current: e.current, pageSize: e.pageSize });
            //   // setSearchParams({ ...searchParams, current: e.current, pageSize: e.pageSize });
            // }}
            // expandable={{ expandedRowRender }}
            // onExpand={handleExpand}
            expandedRowKeys={expandedRowKeys}
            onExpandedRowsChange={handleExpandedRowsChange}
            rowKey={(record) => record.id}
          />
        </Form>
        {isloading && (
          <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
            <Spin tip={'更新配置中.......'} size={'large'} />
          </div>
        )}

        <Modal
          title="新增角色"
          open={isAddModal}
          onOk={() => {
            handleOk();
          }}
          onCancel={handleCancel}
          centered
          destroyOnClose
          footer={
            <>
              <Button onClick={() => handleCancel()}>取消</Button>
              <Button type="primary" onClick={() => handleOk()} loading={submitLoading}>
                完成
              </Button>
            </>
          }
        >
          <Form form={form}>
            {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="创建人" name="createBy">
            <Input placeholder="请输入" />
          </FormItem> */}
            {/* <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="ID"
            name="id"
            rules={[{ required: true, message: '请输入至少两个字符的规则描述！', min: 2 }]}
          >
            <Input placeholder="请输入" />
          </FormItem> */}
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="角色编码"
              name="roleCode"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="角色名称"
              name="roleName"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="描述"
              name="description"
            >
              <Input placeholder="请输入" />
            </FormItem>
            {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="更新人" name="updateBy">
            <Input placeholder="请输入" />
          </FormItem> */}
          </Form>
          {curremtRoleRoutes[0] !== 'first' && newRouteIds[0] !== 'first' && (
            <ModalCheck
              allRoutes={allRoutes}
              currentRoleRoutes={curremtRoleRoutes}
              num={0}
              newRouteIds={newRouteIds}
              handleNewRoutes={handleNewRoutes}
              // newRouteIds={[1, 2, 3]}
              // handleNewRoutes={[1, 2, 3]}
            />
          )}
        </Modal>
        <Modal
          title="配置路由"
          open={isAddModal2}
          onOk={handleOk2}
          onCancel={handleCancel2}
          centered
          forceRender={true}
          getContainer={document.getElementById('root')}
        >
          {isAddModal2 && curremtRoleRoutes[0] !== 'first' && newRouteIds[0] !== 'first' && (
            <ModalCheck
              allRoutes={allRoutes}
              currentRoleRoutes={curremtRoleRoutes}
              num={0}
              newRouteIds={newRouteIds}
              handleNewRoutes={handleNewRoutes}
              // newRouteIds={[1, 2, 3]}
              // handleNewRoutes={[1, 2, 3]}
            />
          )}
          {/* handleModalContent(allRoutes, 0)} */}
        </Modal>
      </PageContainer>
    </>
  );
};

export default TableList;
