import { DownloadOutlined, DownOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Menu,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
// import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { groupIdOptions, TableListItem, TableListParams, UpdataPasswordParams } from './data.d';
import { addRule, removeRule, updateRule, updatePassword, queryGroupList } from './service';
import DetailForm from './components/DetailForm';
import { useModel } from 'umi';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields: any) => {
  const hide1 = message.loading('正在添加');
  try {
    console.log('!!!!!!!!!!!');

    await addRule(fields);
    hide1();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide1();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async (fields: any) => {
  const hide = message.loading('正在更新');
  console.log('==========>', fields);

  try {
    await updateRule(fields);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};

// /**
//  *  删除节点
//  * @param selectedRows
//  */

// const handleRemove = async (selectedRows: TableListParams) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;
//   try {
//     await removeRule({
//       ids: selectedRows.map(row => row.id),
//       id: selectedRows.id,
//     });
//     hide();
//     message.success('删除成功，即将刷新');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('删除失败，请重试');
//     return false;
//   }
// };

const TableList: React.FC<{}> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const userId = currentUser?.userId;
  console.log(currentUser);
  const [setSorter] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [detailModalVisible, detailUpdateModalVisible] = useState<boolean>(false);
  const [passwordModalVisible, passwordUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const [userRole, setUserRole] = useState([]);
  const [roleList, setRoleList] = useState<{}>({});
  const [queryGroup, setqueryGroup] = useState({});
  const [levelOptions, setLevelOptions] = useState<{ id: number; name: string }[]>([]);
  const [lineOptions, setLineOptions] = useState<{ id: number; name: string }[]>([]);
  const [postOptions, setPostOptions] = useState<{ id: number; name: string }[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<{ id: number; name: string }[]>([]);
  const actionRef = useRef<ActionType>();
  const [pageOption, setPageOption] = useState<{ current: number; pageSize: number }>({
    current: 1, //当前页为1
    pageSize: 10, //一页5行
  });
  const [excelData, setExcelData] = useState<TableListItem[]>([]);
  const [excelDataVisable, setExcelDataVisable] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const getExcelData = (data: any[]) => {
    console.log('set excelData');
    console.log(excelData);
    console.log(data);
    data.map((d) => {
      d.line = d.line.split(',');
      d.post = d.post.split(',');
      // d.birthday = moment(d.birthday).format('YYYY-MM-DD');
    });
    let visable = true;
    for (let i = 0; i < data.length; i++) {
      let user = data[i];

      // console.log(userRole);
      // console.log();
      // if (userRole.filter((item) => item['roleName'] == user.role).length == 0) {
      //   message.warning('角色信息与数据库不匹配！第' + (i + 1) + '行:' + user.role);
      //   visable = false;
      // }
      const lineList = lineOptions.map((item) => item['name']);
      console.log(lineList);

      user.line.forEach((l: string) => {
        console.log(l);

        if (!lineList.includes(l)) {
          message.warning('产品线信息与数据库不匹配！第' + (i + 1) + '行:' + l);
          visable = false;
        }
      });
      const postList = postOptions.map((item) => item['name']);
      user.post.forEach((p: string) => {
        console.log(p);

        if (!postList.includes(p)) {
          message.warning('职位信息与数据库不匹配！第' + (i + 1) + '行:' + p);
          visable = false;
        }
      });
      const departmentList = departmentOptions.map((item) => item['name']);

      if (!departmentList.includes(user.department)) {
        message.warning('部门信息与数据库不匹配！第' + (i + 1) + '行:' + user.department);
        visable = false;
      }
      const levelList = levelOptions.map((item) => item['name']);

      if (!levelList.includes(user.level)) {
        message.warning('技术层级信息与数据库不匹配！第' + (i + 1) + '行:' + user.level);
        visable = false;
      }
      console.log(lineOptions);
      console.log(postOptions);
      console.log(departmentOptions);
    }
    setExcelDataVisable(visable);
    setExcelData(data);
    return data;
  };
  // console.log("999", stepFormValues)

  const createMehtod = () => {
    handleModalVisible(true);
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'GroupID',
      dataIndex: 'groupId',
      valueType: 'textarea',
      align: 'center',
      width: '80',

      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择"
              optionLabelProp="label"
              onChange={(e) => {
                form.setFieldValue('groupId', e);
                form.setFieldValue('groupId', e);
              }}
              // [
              //   { label: 'level', value: 'level' },
              //   { label: 'post', value: 'post' },
              //   { label: 'line', value: 'line' },
              //   { label: 'department', value: 'department' },
              // ]
              options={groupIdOptions}
            ></Select>
          </>
        );
      },
    },
    {
      title: 'Key',
      dataIndex: 'key',
      valueType: 'textarea',
      align: 'center',
      // className: styles.header,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      valueType: 'textarea',
      align: 'center',
    },
    // {
    //   title: 'ParentKey',
    //   dataIndex: 'phone',
    //   valueType: 'textarea',
    //   align: 'center',
    //   // className: styles.header,
    // },

    // {
    //   title: '排序',
    //   dataIndex: 'order',
    //   valueType: 'textarea',
    //   align: 'center',
    //   // className: styles.header,
    // },

    // {
    //   title: '启用状态',
    //   dataIndex: 'userRole',
    //   valueType: 'textarea',
    //   align: 'center',
    //   valueEnum: roleList,
    // },
    // {
    //   title: '描述',
    //   dataIndex: 'description',
    //   valueType: 'textarea',
    //   align: 'center',
    //   hideInSearch: true,

    //   // className: styles.header,
    // },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      // className: styles.header,
      render: (_, record) => (
        <>
          <Space>
            <a
              onClick={async () => {
                setStepFormValues(record);
                handleUpdateModalVisible(true); // 打开编辑页面
              }}
            >
              编辑
            </a>
            {/* 
            <a
              key="1"
              onClick={async () => {
                await getUserById({ id: record.id })
                  .then((res) => {
                    console.log(res.data);
                    setUserDetail(res.data);
                  })
                  .catch((error) => {
                    message.error('请求失败！');
                    return;
                  });
                detailUpdateModalVisible(true); // 打开详情页面
              }}
            >
              详情
            </a> */}
            <Popconfirm
              key="popconfirm1"
              title={`确认删除吗?`}
              onConfirm={() => {
                console.log(record);
                const hide = message.loading('正在删除');
                try {
                  // removeRule({
                  //   id: record.id,
                  // });
                  const params = { groupId: record.groupId, id: record.id };
                  console.log('params');
                  console.log(params);

                  removeRule(params).then((res) => {
                    if (res.success) {
                      hide();
                      message.success('删除成功!');
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    }
                  });

                  return true;
                } catch (error) {
                  hide();
                  message.error('删除失败，请重试');
                  return false;
                }
              }}
              okText="是"
              cancelText="否"
            >
              <a
                key="3"
                // onClick={}
              >
                删除
              </a>
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];
  const [selectedRows, setSelectedRows] = useState<TableListItem[]>([]);

  const onSelect = (
    selectedRows: TableListItem[],
    selectedRow: TableListItem,
    selected: boolean,
  ) => {
    console.log('selectedRow changed: ', selectedRow);
    console.log('selectedRow selected: ', selected);
    if (selected) {
      selectedRows.push(selectedRow);
    } else {
      selectedRows.filter((item) => item != selectedRow);

      setSelectedRows(selectedRows);
    }
    return selectedRow;
  };

  return (
    <>
      <ProTable<TableListItem>
        actionRef={actionRef}
        // search={{ cardProps: }}
        // collapsed={false}
        rowKey="index"
        // params={
        //   {
        //     // sorter,
        //   }
        // }

        tableAlertRender={({ selectedRowKeys }) => (
          <div>
            已选择{' '}
            <a
              style={{
                fontWeight: 600,
              }}
            >
              {selectedRowKeys.length}
            </a>{' '}
            项&nbsp;&nbsp;
          </div>
        )}
        columns={columns}
        request={async (params) => {
          console.log('request params');
          console.log(params);

          // const searchparams = { ...params, ...pageOption };
          const res = await queryGroupList(params).catch((e) => {
            console.log(e);
          });
          console.log('res');
          console.log(res);
          for (let i in res.data) {
            res.data[i]['index'] = i;
          }
          return res;
        }}
        // rowSelection={{}}
        toolBarRender={() => {
          let result = [];

          result.push(
            <Button type="primary" onClick={() => createMehtod()}>
              <PlusOutlined />
              新增配置
            </Button>,
          );
          return result;
        }}
        options={{
          setting: {
            draggable: true,
            checkable: true,
            checkedReset: false,
            extra: [<a key="confirm">确认</a>],
          },
        }}
        pagination={{
          // ...pageOption,
          defaultCurrent: 1,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '50'], // 每页数量选项
        }}
        // onChange={(e, _filter, _sorter) => {
        //   console.log(e);

        //   // const sorterResult = _sorter as SorterResult<TableListItem>;

        //   // if (sorterResult.field) {
        //   //   setSorter(`${sorterResult.field}_${sorterResult.order}`);
        //   // }
        //   setPageOption({ current: e.current, pageSize: e.pageSize });
        // }}
      />{' '}
      <CreateForm
        onSubmit={async (value: any) => {
          console.log('value');
          console.log(value);
          setSubmitLoading(true);
          const success = await handleAdd(value).finally(() => {
            setSubmitLoading(false);
          });
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        submitLoading={submitLoading}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            console.log('value');
            console.log(value);
            setSubmitLoading(true);
            const success = await handleUpdate(value).finally(() => {
              setSubmitLoading(false);
            });

            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          submitLoading={submitLoading}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
      {/* 详情页面  */}
      {userDetail && Object.keys(userDetail).length ? (
        <DetailForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);

            if (success) {
              detailUpdateModalVisible(false);
              setUserDetail({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            detailUpdateModalVisible(false);
            setUserDetail({});
          }}
          detailModalVisible={detailModalVisible}
          values={userDetail}
          level={levelOptions}
          queryRole={queryRole?.data}
        />
      ) : null}
    </>
  );
};

export default TableList;
