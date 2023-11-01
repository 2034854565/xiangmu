import { DownloadOutlined, DownOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Menu,
  message,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
// import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import {
  DeleteBatchParams,
  DeleteListParams,
  excelFieldColumns,
  excelTableColumns,
  TableListItem,
  TableListParams,
  UpdataPasswordParams,
} from './data.d';
import {
  addRule,
  queryUserList,
  removeBatchRule,
  removeRule,
  updateRule,
  getUserById,
  userRoleList,
  userInfo,
  UserRole,
  checkOnly,
  updatePassword,
  queryUserRole,
  queryUserLevel,
  queryUserLine,
  queryUserPost,
  queryUserDepartment,
  addUsers,
} from './service';
import DetailForm from './components/DetailForm';
import { useModel } from 'umi';
import UpdatePassword from './components/UpdatePassword';
import ImportExcel from '@/components/importExcel';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import { downloadFile, downloadFile1 } from '@/pages/fan/service';
import { isEmail, isPhone } from '@/components/utils';
import { cloneDeep } from 'lodash';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields: any) => {
  // const hide1 = message.loading('正在添加');
  // try {
  // await addRule({
  //   account: fields.account,
  //   realName: fields.realName,
  //   phone: fields.phone,
  //   email: fields.email,
  //   password: fields.password,
  //   sex: fields.sex,
  //   userRoleId: fields.userRoleId,
  //   // userInfo: {
  //   department: fields.department,
  //   major: fields.major,
  //   technicalLevel: fields.technicalLevel,
  //   workTime: fields.workTime,
  //   // },
  // });

  await addRule(fields);
  // hide1();
  message.success('添加成功');
  return true;
  // } catch (error) {
  //   hide1();
  //   message.error('添加失败请重试！' );
  //   return false;
  // }
};

// 验证添加用户名唯一性
const handleOnlyName = async (fields: TableListItem) => {
  const hide = message.loading('正在验证');

  try {
    await checkOnly({ username: fields.username });
    hide();
    // message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('用户账号已存在！');
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
    // await updateRule({
    //   account: fields.account,
    //   id: fields.id,
    //   realName: fields.realName,
    //   phone: fields.phone,
    //   email: fields.email,
    //   sex: fields.sex,
    //   userRoleId: fields?.userRoleId,
    //   password: fields?.password,
    //   userInfo: fields?.userInfo,
    // });
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
// 更改密码

const handlePassword = async (field: UpdataPasswordParams) => {
  console.log('88811', field);
  const hide = message.loading('正在更改');
  try {
    await updatePassword({
      id: field.id,
      account: field.account,
      password: field.password,
    });
    hide();
    message.success('更改成功');
    return true;
  } catch (error) {
    hide();
    message.error('更改不成功，请重试!');
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
export const getTree = (data) => {
  const temp = cloneDeep(data); //深克隆一份外来数据data，以防下面的处理修改data本身
  const parents = temp.filter((item) => !item.parentId); //过滤出最高父集
  let children = temp.filter((item) => item.parentId); //过滤出孩子节点

  parents.sort((a, b) => {
    a.sort - b.sort;
  });
  children.sort(function (a, b) {
    return a.sort - b.sort;
  });

  //遍历孩子节点，根据孩子的parent从temp里面寻找对应的node节点，将孩子添加在node的children属性之中。
  children.map((item) => {
    const node = temp.find((el) => el.id === item.parentId);
    node && (node.children ? node.children.push(item) : (node.children = [item]));
  });
  return parents; //返回拼装好的数据。
};
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
  const [queryRole, setqueryRole] = useState({});
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
    let visable = true;
    // let i = 0;
    // let addFlag = true;
    // data.map((d) => {
    //   // TODO:验证合法性
    //   // for (let i = 0; i < selectedRows.length; i++) {
    //   const userInfo = d;
    //   console.log('userInfo');
    //   console.log(userInfo);
    //   const requireField = [
    //     'account',
    //     'password',
    //     'realName',
    //     'roleCode',
    //     'department',
    //     'level',
    //     'jobAge',
    //   ];
    //   requireField.forEach((key) => {
    //     // const key = requireField[i];

    //     if (userInfo[key] == undefined) {
    //       addFlag = false;
    //       // [账号, 密码, 用户姓名, 角色分配, 部门, 技术层级, 工作年限]
    //       message.error('第' + (i + 1) + '行，缺少必填字段！' + excelFieldColumns[key]);
    //     }
    //   });

    //   if (userInfo['email'] != undefined && !isEmail(userInfo['email'].toString())) {
    //     addFlag = false;
    //     message.error('第' + (i + 1) + '行，请输入正确的邮箱地址！');
    //   }
    //   if (userInfo['phone'] != undefined && !isPhone(userInfo['phone'].toString())) {
    //     addFlag = false;
    //     message.error('第' + (i + 1) + '行，请输入正确的手机号！');
    //   }
    //   userInfo['jobAge'] = Number(userInfo['jobAge']);
    //   if (isNaN(userInfo['jobAge'])) {
    //     addFlag = false;
    //     message.error('第' + (i + 1) + '行，请输入正确的工作年限！');
    //   }
    //   if (userInfo['post']) {
    //     userInfo['post'] = userInfo['post'].toString().split(',');
    //   }
    //   if (userInfo['line']) {
    //     userInfo['line'] = userInfo['line'].toString().split(',');
    //   }
    //   console.log('userInfo');
    //   console.log(userInfo);
    //   // }
    //   i++;
    // });
    // visable = addFlag;

    // data.map((d) => {
    //   d.line = d.line.split(',');
    //   d.post = d.post.split(',');
    //   // d.birthday = moment(d.birthday).format('YYYY-MM-DD');
    // });
    // for (let i = 0; i < data.length; i++) {
    //   let user = data[i];

    //   // console.log(userRole);
    //   // console.log();
    //   // if (userRole.filter((item) => item['roleName'] == user.role).length == 0) {
    //   //   message.warning('角色信息与数据库不匹配！第' + (i + 1) + '行:' + user.role);
    //   //   visable = false;
    //   // }
    //   const lineList = lineOptions.map((item) => item['name']);
    //   console.log(lineList);

    //   user.line.forEach((l: string) => {
    //     console.log(l);

    //     if (!lineList.includes(l)) {
    //       message.warning('产品线信息与数据库不匹配！第' + (i + 1) + '行:' + l);
    //       visable = false;
    //     }
    //   });
    //   const postList = postOptions.map((item) => item['name']);
    //   user.post.forEach((p: string) => {
    //     console.log(p);

    //     if (!postList.includes(p)) {
    //       message.warning('职位信息与数据库不匹配！第' + (i + 1) + '行:' + p);
    //       visable = false;
    //     }
    //   });
    //   const departmentList = departmentOptions.map((item) => item['name']);

    //   if (!departmentList.includes(user.department)) {
    //     message.warning('部门信息与数据库不匹配！第' + (i + 1) + '行:' + user.department);
    //     visable = false;
    //   }
    //   const levelList = levelOptions.map((item) => item['name']);

    //   if (!levelList.includes(user.level)) {
    //     message.warning('技术层级信息与数据库不匹配！第' + (i + 1) + '行:' + user.level);
    //     visable = false;
    //   }
    //   console.log(lineOptions);
    //   console.log(postOptions);
    //   console.log(departmentOptions);
    // }
    setExcelDataVisable(visable);
    setExcelData(data);
    return data;
  };
  // console.log("999", stepFormValues)

  // 所有用户角色接口
  useEffect(() => {
    UserRole()
      .then((res) => {
        setUserRole(res.data);
        let rL = {};
        for (let i = 0; i < res.data.length; i++) {
          rL[res.data[i]['id']] = res.data[i]['roleName'];
        }
        console.log(rL);
        setRoleList(rL);
        queryUserLevel().then((res) => {
          console.log(res);
          setLevelOptions(res.data);
        });
        queryUserLine().then((res) => {
          console.log(res);
          setLineOptions(res.data);
        });
        queryUserPost().then((res) => {
          console.log(res);
          setPostOptions(res.data);
        });
        queryUserDepartment({}).then((res) => {
          console.log(res);
          res.data.forEach((item) => {
            item.value = item.id;
            item.label = item.name;
          });
          let treeData: {}[] = getTree(res.data);
          console.log('treeData');
          console.log(treeData);

          setDepartmentOptions(treeData);
        });
      })
      .catch((error) => {
        // console.log('error');
        // console.log(error);
        message.error('请求失败！');
        return;
      });
  }, []);
  const createMehtod = () => {
    handleModalVisible(true);
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户账号',
      dataIndex: 'account',
      valueType: 'textarea',
      align: 'center',
      width: '80',
      // hideInSearch: true,
      // className: styles.header,
    },
    // {
    //   title: '密码',
    //   hideInTable: true,
    //   dataIndex: 'password',
    //   valueType: 'textarea',
    //   // hideInSearch: true,
    // },
    {
      title: '用户姓名',
      dataIndex: 'realName',
      valueType: 'textarea',
      align: 'center',
      // className: styles.header,
    },
    // {
    //   title: '头像',
    //   dataIndex: 'avatar',
    //   valueType: 'textarea',
    //   align: 'center',
    //   hideInSearch: true,
    // },
    {
      title: '性别',
      dataIndex: 'sex',
      valueType: 'textarea',
      align: 'center',
      valueEnum: {
        男: '男',
        女: '女',
      },
    },
    // {
    //   title: '生日',
    //   dataIndex: 'birthday',
    //   valueType: 'textarea',
    //   align: 'center',
    //   hideInSearch: true,
    // },

    {
      title: '手机号码',
      dataIndex: 'phone',
      valueType: 'textarea',
      align: 'center',
      // className: styles.header,
    },

    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'textarea',
      align: 'center',
      // className: styles.header,
    },
    // {
    //   title: '所属产品线',
    //   dataIndex: 'line',
    //   valueType: 'textarea',
    //   align: 'center',
    //   hideInSearch: true,

    //   // className: styles.header,
    // },
    {
      title: '角色',
      dataIndex: 'userRole',
      valueType: 'textarea',
      align: 'center',
      valueEnum: roleList,
    },
    // {
    //   title: 'updateAt',
    //   dataIndex: 'updateAt',
    //   valueType: 'textarea',
    //   align: 'center',
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
                await getUserById({ id: record.id })
                  .then((res) => {
                    console.log(res.data);
                    setStepFormValues(res.data);
                  })
                  .catch((error) => {
                    message.error('请求失败！');
                    return;
                  });
                // setqueryRole(await queryUserRole({ id: record.id.toString() }));
                handleUpdateModalVisible(true); // 打开编辑页面
                // const hide = message.loading('');
                try {
                  setqueryRole(await UserRole());
                  // hide();
                  // message.success('更改成功');
                  return true;
                } catch (error) {
                  // hide();
                  // message.error('旧密码输入错误!');
                  return false;
                }
              }}
            >
              编辑
            </a>

            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
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
                      // try {
                      //   console.log('111111')
                      //   setqueryRole(await UserRole());
                      //   hide();
                      //   // message.success('更改成功');
                      //   return true;

                      // } catch (error) {
                      //   hide();
                      //   // message.error('旧密码输入错误!');
                      //   return false;
                      // }

                      // console.log(record)
                      // setStepFormValues(record);
                    }}
                  >
                    详情
                  </Menu.Item>

                  <Menu.Item
                    key="2"
                    onClick={async () => {
                      // setUserDetail(await userInfo({ id: record.id }))
                      setStepFormValues(record);
                      passwordUpdateModalVisible(true); // 打开密码页面

                      // await getUserById({ id: record.id })
                      //   .then((res) => {
                      //     console.log(res.data);
                      //     setStepFormValues(res.data);
                      //   })
                      //   .catch((error) => {
                      //     message.error('请求失败！');
                      //     return;
                      //   });
                    }}
                  >
                    密码
                  </Menu.Item>
                  {/* {userId != record.account ? (
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
                          const params = { id: record.id };
                          removeRule(params).then((res) => {
                            if (res.success) {
                              hide();
                              message.success('删除成功!');
                              actionRef.current?.reloadAndRest?.();
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
                      <Menu.Item key="3" onClick={() => {}}>
                        删除
                      </Menu.Item>
                    </Popconfirm>
                  ) : null} */}
                  {/* <Menu.Item key="4" >
              冻结
                  </Menu.Item> */}
                </Menu>
              }
            >
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                更多 <DownOutlined />
              </a>
            </Dropdown>
            {userId != record.account ? (
              <Popconfirm
                placement="topRight"
                key="popconfirm1"
                title={`确认删除吗?`}
                onConfirm={() => {
                  console.log(record);
                  const hide = message.loading('正在删除');
                  try {
                    // removeRule({
                    //   id: record.id,
                    // });
                    const params = { id: record.id };
                    removeRule(params).then((res) => {
                      if (res.success) {
                        hide();
                        message.success('删除成功!');
                        actionRef.current?.reloadAndRest?.();
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
                <a>删除</a>
              </Popconfirm>
            ) : null}
          </Space>
          {/* <a
            onClick={() => {
              // handleUpdateModalVisible(true);
              setStepFormValues(record);
              const hide = message.loading('正在删除');
              try {
                removeRule({
                  ids: record.id,
                  id: record.id,
                });
                actionRef.current?.reloadAndRest?.();
                hide();
                message.success('删除成功，即将刷新');
                return true;
              } catch (error) {
                hide();
                message.error('删除失败，请重试');
                return false;
              }

            }}
          >
            删除
          </a> */}
          {/* <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked /> */}
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
  // : ProColumns<TableListItem>[]
  const excelColumns = [
    {
      title: '用户账号',
      dataIndex: 'account',
      valueType: 'textarea',
      align: 'center',
      width: '80',
      // hideInSearch: true,
      // className: styles.header,
    },
    {
      title: '密码',
      hideInTable: true,
      dataIndex: 'password',
      valueType: 'textarea',
      // hideInSearch: true,
    },
    {
      title: '用户姓名',
      dataIndex: 'realName',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      // className: styles.header,
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      // className: styles.header,
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      render: (text, record, index) => {
        console.log(' record.birthday');
        console.log(record.birthday);
        // console.log(moment(record.birthday, 'YYYY-MM-DD'));
        let dateReg =
          /^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$/;
        //日期格式不匹配
        if (record.birthday == undefined) {
          console.log('record.birthday== undefined');

          return null;
        }
        if (!dateReg.test(record.birthday)) {
          console.log('!dateReg.test(record.birthday)');
          console.log(!dateReg.test(record.birthday));

          // return record.birthday;
          try {
            console.log('record.birthday.format( YYYY-MM-DD )');

            return record.birthday.format('YYYY-MM-DD');
          } catch (error) {
            return record.birthday;
          }
        } else {
          return record.birthday;
        }
      },
      // className: styles.header,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      // className: styles.header,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      // className: styles.header,
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      // className: styles.header,
    },
    {
      title: '部门',
      dataIndex: 'department',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      // className: styles.header,
    },
    {
      title: '产品线',
      dataIndex: 'line',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      // className: styles.header,
    },
    {
      title: '职位',
      dataIndex: 'post',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      // className: styles.header,
    },
    {
      title: '技术层级',
      dataIndex: 'level',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      // className: styles.header,
    },
    {
      title: '工作年限',
      dataIndex: 'jobAge',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      // className: styles.header,
    },
  ];

  return (
    <>
      <PageContainer
        header={{
          breadcrumb: {},
        }}
      >
        <ProTable<TableListItem>
          actionRef={actionRef}
          // search={{ cardProps: }}
          // collapsed={false}
          rowKey="id"
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

            //树与搜索表单联动查询
            // params = { ...params, ...searchParams };
            // if (beforeSearchParams != undefined) {
            //   params = { ...params, ...pageOption, ...beforeSearchParams };
            // } else {
            //   params = { ...params, ...pageOption };
            // }

            // console.log('params');
            // console.log(params);
            // console.log('pageOption');
            // console.log(pageOption);
            // const searchparams = { ...params, ...pageOption };
            const res = await queryUserList(params).catch((e) => {
              console.log(e);
            });
            console.log('res');
            console.log(res);
            return res;

            // return {
            //   data: res.data,
            //   total: res.total,
            // };
          }}
          // rowSelection={{}}
          toolBarRender={() => {
            let result = [];

            result.push(
              <Button type="primary" onClick={() => createMehtod()}>
                <PlusOutlined />
                新增用户
              </Button>,
            );
            result.push(
              <ImportExcel
                text="从excel导入"
                // title={perfTitle}
                // dataIndex={perfDataIndex}
                excelTableColumns={excelTableColumns}
                isPreview={false}
                getExcelData={getExcelData}
                sheetNum={0}
              />,
            );
            result.push(
              <Button
                onClick={async () => {
                  // downloadFile('/psad/fan/template/用户信息模板.xls');
                  await downloadFile1(
                    'http://172.16.50.127:8080/api/minIO/download?fileName=用户信息模板_1248911f-b113-46eb-89f3-8e2e4df92a44.xls&bucket=2023-06-25',
                    '用户信息模板.xls',
                  );
                }}
              >
                <DownloadOutlined />
                excel模板下载
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
        />
        <Modal
          destroyOnClose
          width={1500}
          // style={styles.modal}
          // destroyOnClose
          title={'请选择要导入的信息'}
          open={excelDataVisable}
          // closable
          centered
          onCancel={() => {
            console.log('oncancel');
            setExcelDataVisable(false);
          }}
          onOk={async (e) => {
            console.log('submit selectedRow');
            console.log(selectedRows);
            let addFlag = true;

            if (selectedRows.length == 0) {
              addFlag = false;
              // [账号, 密码, 用户姓名, 角色分配, 部门, 技术层级, 工作年限]
              message.info('未勾选记录！');
            } else {
              // TODO:验证合法性
              for (let i = 0; i < selectedRows.length; i++) {
                const userInfo = selectedRows[i];
                console.log('userInfo');
                console.log(userInfo);
                const requireField = [
                  'account',
                  'password',
                  'realName',
                  'roleCode',
                  'department',
                  'level',
                  'jobAge',
                ];
                requireField.forEach((key) => {
                  // const key = requireField[i];

                  if (userInfo[key] == undefined) {
                    addFlag = false;
                    // [账号, 密码, 用户姓名, 角色分配, 部门, 技术层级, 工作年限]
                    message.error('第' + (i + 1) + '行，缺少必填字段！' + excelFieldColumns[key]);
                  }
                });
                if (userInfo['birthday'] != undefined) {
                  let dateReg =
                    /^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$/;
                  console.log(userInfo['birthday']);
                  //日期格式不匹配
                  if (!dateReg.test(userInfo['birthday'].toString())) {
                    addFlag = false;
                    message.error('第' + (i + 1) + '行，请输入正确的日期！');
                  }
                }

                if (
                  userInfo['sex'] != undefined &&
                  !['男', '女'].includes(userInfo['sex'].toString())
                ) {
                  addFlag = false;
                  message.error('第' + (i + 1) + '行，请输入正确的性别！');
                }
                if (userInfo['email'] != undefined && !isEmail(userInfo['email'].toString())) {
                  addFlag = false;
                  message.error('第' + (i + 1) + '行，请输入正确的邮箱地址！');
                }
                if (userInfo['phone'] != undefined && !isPhone(userInfo['phone'].toString())) {
                  addFlag = false;
                  message.error('第' + (i + 1) + '行，请输入正确的手机号！');
                }
                userInfo['jobAge'] = Number(userInfo['jobAge']);
                if (isNaN(userInfo['jobAge'])) {
                  addFlag = false;
                  message.error('第' + (i + 1) + '行，请输入正确的工作年限！');
                }
                if (userInfo['post']) {
                  userInfo['post'] = userInfo['post'].toString().split(',');
                }
                if (userInfo['line']) {
                  userInfo['line'] = userInfo['line'].toString().split(',');
                }
                console.log('userInfo');
                console.log(userInfo);
              }
            }
            if (addFlag) {
              await addUsers(selectedRows).then((res) => {
                console.log('res');
                console.log(res);
                if (res.success) {
                  message.success('导入成功！');
                } else {
                  message.success('导入失败！' + res.msg);
                }
              });
              actionRef.current?.reload();

              setExcelDataVisable(false);
            }
          }}
        >
          <Table<TableListItem>
            columns={excelColumns}
            scroll={{
              x: 860,
              y: 500,
            }}
            // search={false}
            // options={false}
            // tableAlertRender={false}
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys: React.Key[], selectedRows: TableListItem[]) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                setSelectedRows(selectedRows);
              },
              // onSelect: (selectedRow: TableListItem, selected: boolean) => onSelect(selectedRows, selectedRow, selected),
              // columnTitle: {}, //去掉全选
              // getCheckboxProps: (record) => {
              // if (selectedRowKeys.length < 1) {
              //   return { disabled: false };
              // }
              // return {
              //   disabled: selectedRowKeys.indexOf(record.key) == -1 ? true : false,
              // };
              // },
            }}
            pagination={false}
            // pagination={{
            //   // ...pageOption,
            //   // current: 1,
            //   // pageSize: 5,
            //   defaultPageSize: 5,
            //   showSizeChanger: true,
            //   showQuickJumper: true,
            //   pageSizeOptions: ['5', '10', '20', '50'], // 每页数量选项
            // }}
            dataSource={excelData}
          />
        </Modal>
        <CreateForm
          submitLoading={submitLoading}
          onCancel={() => handleModalVisible(false)}
          modalVisible={createModalVisible}
          handleModalVisible={handleModalVisible}
          userRole={userRole}
          levelOptions={levelOptions}
          postOptions={postOptions}
          lineOptions={lineOptions}
          departmentOptions={departmentOptions}
          actionRef={actionRef}
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
            userRole={userRole}
            level={levelOptions}
            postOptions={postOptions}
            lineOptions={lineOptions}
            departmentOptions={departmentOptions}
            queryRole={queryRole?.data}
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
        {/* 修改密码 */}
        <UpdatePassword
          onSubmit={async (value: any) => {
            setSubmitLoading(true);
            value.id = stepFormValues.id;
            const success = await handlePassword(value).finally(() => {
              setSubmitLoading(false);
            });
            if (success) {
              passwordUpdateModalVisible(false);
              setUserDetail({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          submitLoading={submitLoading}
          onCancel={() => {
            passwordUpdateModalVisible(false);
            setUserDetail({});
          }}
          modalVisible={passwordModalVisible}
          values={stepFormValues}

          // userRole={userRole}
        />
      </PageContainer>
    </>
  );
};

export default TableList;
