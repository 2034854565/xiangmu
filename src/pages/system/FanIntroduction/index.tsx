import { DownOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Dropdown,
  Input,
  Menu,
  message,
  Popconfirm,
  Select,
  Space,
  Switch,
  Tag,
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
// import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import DetailForm from './components/DetailForm';
import {
  DeleteBatchParams,
  DeleteListParams,
  TableListItem,
  TableListParams,
  UpdataPasswordParams,
} from './data.d';
import {
  fanIntroductionAdd,
  fanIntroductionDelete,
  permissionDeleteBatch,
  fanIntroductionUpdate,
  fanIntroductionList,
  fanIntroductionQuery,
} from './service';
import { useModel } from 'umi';
import Access from '@/components/Access';
import ExportJsonExcel from 'js-export-excel';
import { PageContainer } from '@ant-design/pro-layout';

const MenuList: React.FC<{}> = () => {
  // const { initialState, setInitialState } = useModel('@@initialState');
  const [setSorter] = useState<string>('');
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [detailModalVisible, detailUpdateModalVisible] = useState<boolean>(false);
  const [passwordModalVisible, passwordUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const [userRole, setUserRole] = useState([]);
  const [queryRole, setqueryRole] = useState({});
  const [selectRows, setSelectRows] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const [pageNo, setPageNo] = useState(1);
  const [dataArr, setDataArr] = useState([]);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  // console.log("999", stepFormValues)

  // 所有用户角色接口
  // useEffect(() => {}, []);

  /**
   * 更新节点
   * @param fields
   */

  const handleUpdate = async (fields: FormValueType) => {
    const hide = message.loading('正在配置');
    console.log('111', fields);

    try {
      // await updateRule({
      //   id: fields.id,
      //   username: fields.username,
      //   realname: fields.realname,
      //   orgCode: fields.orgCode,
      //   phone: fields.phone,
      //   email: fields.email,
      //   sex: fields.sex,
      //   selectedroles: fields?.selectedroles,
      // });
      hide();
      message.success('配置成功');
      return true;
    } catch (error) {
      hide();
      message.error('配置失败请重试！');
      return false;
    }
  };
  const map = new Map();
  const arr = dataArr?.data?.filter((v) => !map.has(v.label) && map.set(v.label, 1));

  let selectData = {};
  const handlemenuData = arr?.map((item, index) => {
    {
      selectData[item.label] = { text: item.label };
    }
  });

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    // {
    //   title: '序号',
    //   dataIndex: 'id',
    //   key: 'id',
    //   hideInSearch: true,
    //   width:"5%"
    //   // render: (text) => <a>{text}</a>,
    //   // render: (id) => `${(pageSize * (pageNo - 1)) + parseInt(id) + 1}`,
    // },
    {
      title: '风机名称',
      dataIndex: 'name',
      valueType: 'textarea',
      hideInSearch: true,
      width: '15%',
    },
    {
      title: '风机类型',
      dataIndex: 'label',
      valueType: 'textarea',
      valueEnum: selectData,
      width: '10%',
    },

    {
      title: '所属车型',
      dataIndex: 'train_type',
      valueType: 'textarea',
      hideInSearch: true,
      width: '10%',
      render: (_, record) => {
        let val = record.train_type;
        switch (val) {
          case '0':
            val = '电力机车';
            break;
          case '1':
            val = '动车';
            break;
          case '2':
            val = '城轨';
            break;
        }
        return val;
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      hideInSearch: true,
      width: '40%',
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      width: '10%',
      // className: styles.header,
      render: (_, record) => (
        <Space>
          <a
            onClick={async () => {
              console.log('record', record);
              console.log(record);
              setStepFormValues(record);
              // setqueryRole(await UserRole({ userid: record.id }));
              handleUpdateModalVisible(true); // 打开编辑页面
            }}
          >
            编辑
          </a>
          {/* &nbsp;<span>|</span>&nbsp; */}
          {/* <a
            onClick={async () => {
              detailUpdateModalVisible(true); // 打开详情页面
              setUserDetail(await userInfo({ id: record.id }))
              const hide = message.loading('');
              try {
                setqueryRole(await UserRole({ userid: record.id }));
                hide();
                // message.success('更改成功');
                return true;

              } catch (error) {
                hide();
                // message.error('旧密码输入错误!');
                return false;
              }

              // console.log(record)
              setStepFormValues(record);
            }}

          >
            详情
          </a> &nbsp;<span>|</span>&nbsp; */}
          <Popconfirm
            key="popconfirm1"
            title={`确认删除"${record.name}"风机吗?`}
            onConfirm={() => {
              console.log(record);
              const hide = message.loading('正在删除');
              // fanIntroductionDelete({
              //   // ids: record.id,
              //   id: record.id,
              // }) .catch((error) => {
              //   message.error('请求失败！');
              //   return;
              // });
              try {
                fanIntroductionDelete({
                  // ids: record.id,
                  id: record.id,
                });
                // actionRef.current?.reloadAndRest?.();
                // reloadList();
                hide();
                message.success('删除成功，即将刷新');
                actionRef.current?.reload();
                return true;
              } catch (error) {
                console.log('error');
                console.log(error);

                hide();
                message.error('删除失败，请重试');
                return false;
              }
            }}
            okText="是"
            cancelText="否"
          >
            <a onClick={() => {}}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  // // 批量删除
  // const deleteMany = () => {
  //   const hide = message.loading('正在删除');
  //   try {
  //     const reponse = permissionDeleteBatch({
  //       ids: selectRows,
  //     });
  //     actionRef.current?.reloadAndRest?.();
  //     hide();
  //     message.success('删除成功，即将刷新');
  //     // reloadList();
  //     if (reponse?.code == 200) {
  //       location.reload();
  //     }

  //     return true;
  //   } catch (error) {
  //     hide();
  //     message.error('删除失败，请重试');
  //     return false;
  //   }
  // };

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectRows(selectedRowKeys.toString());
    setShowDelete(true);
  };

  const handlePage = (page: number, pageSize: number) => {
    const response = permissionList({
      pageNo: page,
      pageSize,
    });
    response.then((data) => {
      setDataArr(data);
    });
  };
  const { Search } = Input;
  const onSearch = (value) => {
    const response = permissionList({
      name: value,
      pageNo,
      pageSize,
    });
    response.then((data) => {
      setDataArr(data);
    });
  };

  /**
   *  导出节点
   * @param selectedRows
   */
  const downloadExcel = async (selectedRows: TableListItem[]) => {
    console.log('selectedRows');
    console.log(selectedRows);

    const setData = new Set(selectedRows);
    const data = [...setData];
    const option = {};
    const dataTable = [];
    const sheetTitle = [
      '一级菜单',
      '二级菜单',
      '三级菜单',
      // '菜单类型',
      '路径',
    ];
    console.log('data');
    console.log(data);

    if (data) {
      for (const i in data) {
        if (data) {
          const obj = {
            一级菜单: data[i].name,
            // 菜单类型: data[i].menuType == 0 ? "一级菜单" : null,
            路径: `http://192.168.31.120:8086${data[i].url}`,
          };
          dataTable.push(obj);
          if (data[i].children != null) {
            for (const j in data[i].children) {
              const obj = {
                一级菜单: data[i].name,
                二级菜单: data[i].children[j].name,
                // 菜单类型: "二级菜单",
                路径: `http://192.168.31.120:8086${data[i].children[j].url}`,
              };
              dataTable.push(obj);

              if (data[i]?.children[j]?.children != null) {
                for (const o in data[i]?.children[j]?.children) {
                  const obj = {
                    一级菜单: data[i].name,
                    二级菜单: data[i].children[j].name,
                    三级菜单: data[i].children[j].children[o].name,
                    // 菜单类型: "三级菜单",
                    路径: `http://192.168.31.120:8086${data[i].children[j].children[o].url}`,
                  };
                  dataTable.push(obj);
                }
              }
            }
          }
        }
      }
    }
    option.fileName = '分析系统菜单信息';
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: 'sheet',
        sheetFilter: sheetTitle,
        sheetHeader: sheetTitle,
      },
    ];

    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

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
            const res = await fanIntroductionList(params);
            setDataArr(res);
            let labelRes = [];

            if (params.label) {
              labelRes = res.data.filter((item) => item.label === params.label);
            } else {
              labelRes = res.data;
            }
            // const res = await fanIntroductionList(params);
            console.log('res');
            res['data'] = labelRes;
            console.log('res', res);

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
              // <Access auth="menu_add">
              <Button
                type="primary"
                onClick={() => {
                  handleModalVisible(true);
                }}
              >
                <PlusOutlined />
                新增
              </Button>,
              // </Access>,
            );
            result.push(
              // selectedRows && selectedRows.length > 0 && (
              <>
                {/* <Button type="primary" onClick={deleteMany}>
                批量删除
              </Button> */}
                {/* <Button
                onClick={async () => {
                  downloadExcel(dataArr?.data);
                }}
              >
                批量导出
              </Button> */}
              </>,
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
        />
        <CreateForm
          onSubmit={async (value: any) => {
            // const success1 = await handleOnlyName(value);
            // if (success1) {
            setSubmitLoading(true);
            await fanIntroductionAdd(value)
              .then((res) => {
                if (res.success) {
                  handleModalVisible(false);
                  // reloadList();
                  message.success('新增成功');
                  // setSubmitLoading(false);
                  actionRef.current?.reload();
                }
              })
              .catch(() => {
                message.error('添加出错!');
                // setSubmitLoading(false);
              })
              .finally(() => setSubmitLoading(false));
          }}
          submitLoading={submitLoading}
          onCancel={() => handleModalVisible(false)}
          modalVisible={createModalVisible}
          menuData={dataArr?.data}
        />

        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            onSubmit={async (value) => {
              const hide = message.loading('');
              setSubmitLoading(true);
              try {
                const res = await fanIntroductionUpdate(value).finally(() =>
                  setSubmitLoading(false),
                );
                hide();
                message.success('更改成功');
                if (res.success) {
                  handleUpdateModalVisible(false);
                  setStepFormValues({});
                  // reloadList();
                  actionRef.current?.reload();
                }
                return true;
              } catch (error) {
                hide();
                // message.error('旧密码输入错误!');
                return false;
              }
            }}
            submitLoading={submitLoading}
            onCancel={() => {
              handleUpdateModalVisible(false);
              setStepFormValues({});
            }}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            menuData={dataArr?.data}
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
            values={userDetail?.result}
            queryRole={queryRole?.result}
          />
        ) : null}
      </PageContainer>
    </>
  );
};

export default MenuList;
