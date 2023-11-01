import {
  Row,
  Col,
  notification,
  message,
  UploadFile,
  Card,
  Tabs,
  Button,
  Form,
  TabsProps,
  Space,
  Badge,
  Typography,
  Result,
} from 'antd';
import { DoubleRightOutlined, RollbackOutlined } from '@ant-design/icons';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';

import ProForm, { ProFormText } from '@ant-design/pro-form';
import styles from './style.less';
import { history, useLocation, useModel } from 'umi';
import {
  addFanPerfData,
  alterFanData,
  createFanData,
  queryAuditRecord,
  updateFanData,
} from './service';
import { FanDetailItem, PerfDataItem } from '../data.d';
import BaseInfoForm from './components/BaseInfoForm';
import PerfDataForm from './components/PerfDataForm';
import FileForm from './components/FileForm';
import { perfDataIndex, perfTitle } from './components/PerfDataForm/data.d';
import { queryFanData, queryFanPerfData, queryFanPerfOriginData } from '../selection/service';
import { saveUserAction } from '@/services/ant-design-pro/api';
import { fixNumFunc } from '../components/utils';
import { Input } from 'antd';

const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const Create: React.FC<{}> = (props) => {
  const [key, setKey] = useState<string>('0');

  const formRef = useRef<ProFormInstance>();
  const [form] = Form.useForm();
  const [flowRateUnit, setFlowRateUnit] = useState<number>(0);
  const [buttonVisible, setButtonVisible] = useState<boolean>(true);

  // 性能曲线数据上传excel数据 excelData2
  // const [excelData2, setExcelData2] = useState<PerfDataItem[]>([]);
  const [standardStatusData, setStandardStatusData] = useState<PerfDataItem[]>([]);
  const [fanInfo, setFanInfo] = useState<FanDetailItem>({ status: 'create' });
  const [fanDetail, setFanDetail] = useState<{}>();
  const [auditRecord, setAuditRecord] = useState<{}>({});

  const [imgFileList, setImgFileList] = useState<UploadFile[][]>([[], [], []]);

  const { initialState } = useModel('@@initialState');

  // const { id, activeKey = 4 } = props.location.query;
  // let { type } = props.location.query;
  // type = type ? type : fanInfo.type;
  let status: string;
  let id: string;
  let activeKey: string = '4';
  let type: string;
  const location = useLocation(); //获取跳转页面携带的值
  // console.log('location.state');
  // console.log(location.state);
  if (location.state == undefined) {
    // history.push('/fan/2');
    // window.location.replace('/fan/' + activeKey);
    status = 'pass';
  } else {
    id = location.state.id;
    activeKey = location.state.activeKey;
    type = location.state.type;
  }
  // console.log('status');
  // console.log(status);
  const [reason, setReason] = useState<{}>(undefined);

  //图片转base64位
  let pageArea = '';
  // let activeKey = '4';
  switch (activeKey) {
    case 1:
      pageArea = '产品选型';
      break;
    case 2:
      pageArea = '相似设计';
      break;
    case 3:
      pageArea = '变形设计';
      break;
    case 4:
      pageArea = '数据管理';
      break;
    case 5:
      pageArea = '审批管理';
      break;
    case 6:
      pageArea = '审核进度查看';
      break;
  }
  const generalParams = {
    monitorModule: '风机平台',
    pageUrl: window.location.href,
    pageName: '风机平台',
    pageArea: pageArea,
    actionModel: null,
  };
  const blobToDataURI = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  useMemo(() => {
    if (id) {
      queryFanData(id).then(async (res) => {
        if (res) {
          if (res.data.status != 'rejected' && type != 'alter') {
            setKey('1');
          }
          res.data.category = [res.data.categoryParentId, res.data.categoryId];
          if (!res.data.motorSpeedMin) {
            res.data.motorSpeedMin = res.data.motorSpeed;
            res.data.motorSpeed = undefined;
          }

          // if (type == undefined) {
          let uid = 0;
          const fileType = ['aerodynamicSketch', 'outlineFile'];
          for (let i = 0; i < fileType.length; i++) {
            let key = fileType[i];
            let file = [];
            for (let i = 0; i < res.data[key].length; i++) {
              console.log('res.data[key][i]');
              console.log(res.data[key][i]);

              let url = res.data[key][i];
              file.push({
                uid: uid.toString(),
                url: res.data[key][i].downloadUrl,
                name: res.data[key][i].fileName,
                fileInfo: res.data[key][i],
              });
              uid++;
            }
            if (file.length == 0) {
              res.data[key] = undefined;
            } else {
              res.data[key] = file;
            }
          }
          let technicalFile = [];
          console.log('res.data.technicalFile');
          console.log(res.data.technicalFile);

          for (let key in res.data.technicalFile) {
            if (type == 'copy' && key == 'labReport') {
              // 新增实验数据不保留原实验报告
              technicalFile.push({ fileType: 'labReport', file: [] });
              continue;
            }
            let fileList = res.data.technicalFile[key];
            let file = [];
            for (let i = 0; i < fileList.length; i++) {
              file.push({
                uid: uid.toString(),
                url: fileList[i].downloadUrl,
                name: fileList[i].fileName,
                fileInfo: fileList[i],
              });
              uid++;
            }
            if (file.length != 0) {
              technicalFile.push({
                fileType: key,
                file: file,
              });
            }
          }
          if (technicalFile.length == 0) {
            technicalFile = [{ fileType: 'labReport', file: [] }];
          }

          res.data.technicalFile = technicalFile;
          console.log('technicalFile');
          console.log(technicalFile);
          fileType;
          const img3d = res.data.img3d; // .map((item) => {
          //   return item.viewUrl;
          // });
          let imgFileList = [];
          for (let i = 0; i < img3d.length; i++) {
            imgFileList.push({
              uid: uid.toString(),
              url: img3d[i].downloadUrl,
              preview: img3d[i].viewUrl,
              name: img3d[i].fileName,
              fileInfo: res.data.img3d[i],
            });
            uid++;
          }

          // res.data.img3d = [imgFileList];
          setImgFileList([[], imgFileList, []]);
          // } else {
          //   res.data.aerodynamicSketch = [];
          //   res.data.img3d = [];
          //   res.data.outlineFile = [];
          //   res.data.technicalFile = [{ fileType: 'labReport', file: [] }];
          // }
          res.data.createBy = initialState?.currentUser?.userId;
          setFanInfo(res.data);
          formRef?.current?.setFieldsValue(res.data);
          form?.setFieldsValue(res.data);
          console.log('res.data');
          console.log(res.data);
        }
        queryAuditRecord({ auditBizId: id, auditType: 'fanAddAudit' }).then((res) => {
          setAuditRecord(res.data);
        });
      });
      console.log('112233type');
      console.log(type);
      console.log("type == 'alter'");
      console.log(type == 'alter');

      if (type == undefined || type == 'alter') {
        console.log('queryFanPerfOriginData');
        queryFanPerfOriginData(id).then((res) => {
          console.log('res');
          console.log(res);

          if (res) {
            setStandardStatusData(res.data);
            // setExcelData2(res.data);
          }
        });
      }
    } else {
      setKey('1');
    }
  }, []);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const onSubmit = async (status: string = 'audit') => {
    console.log('status');
    console.log(status);
    // const onSubmit = async () => {

    try {
      await form.validateFields();
    } catch (error) {
      let errorFields = error.errorFields;
      console.log(errorFields);

      // let errorFields: [] = error.errorFields
      errorFields.map((item: any, index: number) => {
        //只输出第一个验证错误
        let errors = item.errors;
        while (errors.length > 1) {
          errors = errors.splice(1);
        }
        item.errors = errors;
      });
      // console.log(errorFields);
      message.warn(errorFields[0].errors);

      error.errorFields = errorFields;
    }

    const values = await form.validateFields();
    ['draft', 'rejected'].includes(status) ? setSaveLoading(true) : setSubmitLoading(true);

    // console.log('submit form.getFieldsValue()');
    // console.log(form.getFieldsValue());

    const params = values;
    // console.log('submit params');
    // console.log(params);
    params.status = status;
    // 流量单位换算
    if (flowRateUnit != 0) {
      params.flowRate = fixNumFunc(params.flowRate / Math.pow(60, flowRateUnit), 3);
    }
    //电机转速最大值最小值
    if (params.motorSpeedMin == params.motorSpeed) {
      params.motorSpeedMin = undefined;
    }
    if (params.motorSpeedMin == undefined && params.motorSpeed != undefined) {
    } else if (params.motorSpeedMin != undefined && params.motorSpeed == undefined) {
      params.motorSpeed = params.motorSpeedMin;
      params.motorSpeedMin = undefined;
    } else if (params.motorSpeedMin != undefined && params.motorSpeed != undefined) {
      if (params.motorSpeedMin > params.motorSpeed) {
        let temp = params.motorSpeedMin;
        params.motorSpeedMin = params.motorSpeed;
        params.motorSpeed = temp;
      }
    }

    let temp = [];
    for (let i in imgFileList[1]) {
      console.log(i);
      if (imgFileList[1][i].url != undefined) {
        temp[i] = undefined;
      } else {
        temp[i] = imgFileList[1][i];
      }
    }
    params.img3d = imgFileList[1];

    // params.perfData = excelData2;JSON.stringify()
    // 处理掉不需要的字段
    standardStatusData.forEach((data) => {
      for (let key in data) {
        if (data[key] == null || ['title', 'index', 'key'].includes(key)) {
          data[key] = undefined;
        }
      }
    });
    if (standardStatusData.length == 0) {
      // message.warning('请输入性能曲线实验数据！')
      notification.error({
        message: `请输入性能曲线实验数据 `,
      });
      ['draft', 'rejected'].includes(status) ? setSaveLoading(false) : setSubmitLoading(false);
      return;
    }
    params.id = id;
    params.perfData = {
      header: perfTitle,
      dataIndex: perfDataIndex,
      data: standardStatusData,
    };

    // ----文件处理

    const fileTypeDict = {
      实验报告: 'labReport',
      设计说明书: 'designSpecification',
      labReport: '实验报告',
      designSpecification: '设计说明书',
    };
    console.log('params.technicalFile');
    console.log(params.technicalFile);
    // params.technicalFile

    //判断params.technicalFile== [{ fileType: 'labReport' }]
    if (
      params.technicalFile == undefined ||
      !(
        params.technicalFile.length == 1 &&
        Object.keys(params.technicalFile[0]).length == 1 &&
        Object.keys(params.technicalFile[0])[0] == 'labReport'
      )
    ) {
      // if (params.technicalFile == undefined) {
      //   console.log('未点击后面的页面');
      //   console.log('fanInfo.technicalFile');
      //   console.log(fanInfo.technicalFile);
      //   params.technicalFile = fanInfo.technicalFile;
      // }
      const fileList: { fileType: string; file: UploadFile[] }[] =
        // 有变动
        params.technicalFile == undefined ? fanInfo.technicalFile : params.technicalFile;
      // console.log('fileList');
      // console.log(fileList);
      // console.log('params.technicalFile');
      // console.log(params.technicalFile);
      // console.log('fanInfo.technicalFile');
      // console.log(fanInfo.technicalFile);
      fileList.forEach((item) => {
        console.log('item');
        console.log(item);
        if (Object.keys(params).includes(item.fileType)) {
          console.log('includes');
        } else {
          console.log('not includes');

          params[item.fileType] = [];
        }
        item.file.forEach((f) => {
          console.log(f);
          params[item.fileType].push(f);
        });
      });
    } else {
      params.technicalFile = [];
      // console.log('无变动');
      // console.log('!!!!!!!fanInfo');
      // console.log(fanInfo);
    }

    if (params.aerodynamicSketch == undefined) {
      params.aerodynamicSketch = fanInfo.aerodynamicSketch;
    }
    if (params.outlineFile == undefined) {
      params.outlineFile = fanInfo.outlineFile;
    }

    // ----文件处理

    // params.technicalFile = undefined;

    for (let key in params) {
      if (params[key] == null) {
        params[key] = undefined;
      }
    }

    // 草稿更新 被驳回更新
    if (id && type == undefined) {
      console.log('草稿更新 被驳回更新');

      console.log('update params');
      console.log(params);
      params.updateBy = params.createBy;
      params.createBy = undefined;
      updateFanData(params)
        .then((res) => {
          console.log(res);

          if (res.success) {
            const actionParams = {
              ...generalParams,
              actionModel: params.model + '-' + params.figNum + '-' + params.version,
              actionId: `fan_${activeKey}_编辑`,
              actionType: '编辑',
              actionName: '编辑风机数据',
              description:
                '编辑风机数据_' + params.model + '-' + params.figNum + '-' + params.version,
            };
            saveUserAction({ params: actionParams }).catch((e) => {});
            notification.success({
              message: ['draft', 'rejected'].includes(status) ? '保存成功' : '提交成功！',
            });

            history.push('/fan/' + activeKey);
            // return () => {
            //   setSubmitLoading(false);
            // };
          } else {
            console.log(res.msg);
            notification.error({
              message: `请求错误 ${res.status} `,
              description: res.msg,
            });
            // if (res.status == 401) {
            //   history.push('/user/login');
            // }
          }
          // setSubmitLoading(false);
          ['draft', 'rejected'].includes(status) ? setSaveLoading(true) : setSubmitLoading(true);
        })
        .catch((error) => {
          message.error('请求失败！');

          return () => {
            setSubmitLoading(false);
            ['draft', 'rejected'].includes(status)
              ? setSaveLoading(false)
              : setSubmitLoading(false);
          };
        });
    }
    // 新增风机数据
    else if (type == undefined) {
      createFanData(params)
        .then((res) => {
          console.log('res');
          console.log(res);

          if (res.success) {
            const actionParams = {
              ...generalParams,
              actionModel: params.model + '-' + params.figNum + '-' + params.version,
              actionId: `fan_${activeKey}_新增`,
              actionType: '新增',
              actionName: '新增风机数据',
              description:
                '新增风机数据_' + params.model + '-' + params.figNum + '-' + params.version,
            };
            saveUserAction({ params: actionParams }).catch((e) => {});
            notification.success({
              message: ['draft', 'rejected'].includes(status) ? '保存成功' : '提交成功！',
            });
            history.push('/fan/' + activeKey);
          } else {
            notification.error({
              message: `请求错误 ${res.status} `,
              description: res.msg,
            });
            if (res.status == 401) {
              history.push('/user/login');
            }
          }
          // setSubmitLoading(false);
          status == 'audit' ? setSubmitLoading(false) : setSaveLoading(false);
        })
        .catch((error) => {
          console.log('error');
          console.log(error);
          message.error('请求失败！');
          console.log(typeof error);
          // notification.error({
          //   message: '账号已在其他设备登录.',
          // });
          // history.push('/user/login');
          return () => {
            // setSubmitLoading(false);
            status == 'audit' ? setSubmitLoading(false) : setSaveLoading(false);
          };
        });
    }
    // 变更更新
    else if (id && type == 'alter') {
      console.log('变更更新');

      console.log('alter params');
      console.log(params);
      params.updateBy = params.createBy;
      params.alterId = id;
      if (reason == undefined || reason == '' || reason == null) {
        message.warning('请填写变更原因！');
        return;
      }
      params.reason = reason;
      // params.createBy = undefined;
      alterFanData(params)
        .then((res) => {
          console.log(res);

          if (res.success) {
            const actionParams = {
              ...generalParams,
              pageArea: '审核进度',
              actionModel: params.model + '-' + params.figNum + '-' + params.version,
              actionId: `fan_${activeKey}_编辑`,
              actionType: '变更',
              actionName: '变更风机数据',
              description:
                '变更风机数据_' + params.model + '-' + params.figNum + '-' + params.version,
            };
            saveUserAction({ params: actionParams }).catch((e) => {});
            notification.success({
              message: ['draft', 'rejected'].includes(status) ? '保存成功' : '提交成功！',
            });

            history.push('/fan/' + activeKey);
            // return () => {
            //   setSubmitLoading(false);
            // };
          } else {
            console.log(res.msg);
            notification.error({
              message: `请求错误 ${res.status} `,
              description: res.msg,
            });
            // if (res.status == 401) {
            //   history.push('/user/login');
            // }
          }
          // setSubmitLoading(false);
          ['draft', 'rejected'].includes(status) ? setSaveLoading(true) : setSubmitLoading(true);
        })
        .catch((error) => {
          message.error('请求失败！');

          return () => {
            setSubmitLoading(false);
            ['draft', 'rejected'].includes(status)
              ? setSaveLoading(false)
              : setSubmitLoading(false);
          };
        });
    } // 新增实验数据
    else if (id && type == 'copy') {
      console.log('新增实验数据');

      params.copyId = id;
      addFanPerfData(params)
        .then((res) => {
          if (res.success) {
            const actionParams = {
              ...generalParams,
              actionId: `fan_${activeKey}_新增`,
              actionModel: params.model + '-' + params.figNum + '-' + params.version,
              actionType: '新增',
              actionName: '新增风机实验数据',
              description:
                '新增风机数据' + params.model + '-' + params.figNum + '-' + params.version,
            };
            saveUserAction({ params: actionParams }).catch((e) => {});
            notification.success({
              message: ['draft', 'rejected'].includes(status) ? '保存成功' : '提交成功！',
            });
            history.push('/fan/' + activeKey);
          } else {
            notification.error({
              message: `请求错误 ${res.status} `,
              description: res.msg,
            });
            if (res.status == 401) {
              history.push('/user/login');
            }
          }
          // setSubmitLoading(false);
          status == 'audit' ? setSubmitLoading(false) : setSaveLoading(false);
        })
        .catch((error) => {
          console.log('error');
          console.log(error);
          message.error('请求失败！');
          console.log(typeof error);
          // notification.error({
          //   message: '账号已在其他设备登录.',
          // });
          // history.push('/user/login');
          return () => {
            // setSubmitLoading(false);
            status == 'audit' ? setSubmitLoading(false) : setSaveLoading(false);
          };
        });
    }

    return () => {
      status == 'audit' ? setSubmitLoading(false) : setSaveLoading(false);

      // setSubmitLoading(false);
    };
  };
  const items: TabsProps['items'] | any = [
    status == 'rejected'
      ? {
          key: '0',
          label: (
            <Space>
              <Badge
                color={key == '0' ? '#ff9000' : '#00000040'}
                count=" "
                style={{ marginBottom: 2 }}
              />
              驳回详情
              <DoubleRightOutlined />
            </Space>
          ),
          // disabled: id ? (type != undefined ? true : false) : true,
          children: (
            <>
              <Result
                // style={{ color: '#ff9000' }}
                status={'warning'}
                title={
                  <>
                    审核备注
                    {/* <Typography.Paragraph>{auditRecord.remark}</Typography.Paragraph>*/}
                    <br />
                    <TextArea
                      // bordered={false}
                      style={{ width: '60%', resize: 'none', color: 'black' }}
                      disabled
                      value={auditRecord.remark}
                      defaultValue={''}
                      rows={10}
                    ></TextArea>
                  </>
                }
                subTitle={
                  <>
                    <Typography.Text>{'审核人：' + auditRecord.realName}</Typography.Text>
                    &nbsp;&nbsp;
                    {/* <br /> */}
                    <Typography.Text>{'审核时间：' + auditRecord.createAt}</Typography.Text>
                  </>
                }
                extra={
                  <Button
                    type="primary"
                    onClick={() => {
                      setKey('1');
                    }}
                  >
                    下一步
                  </Button>
                }
              />
              {/* <Typography.Text>{auditRecord.remark}</Typography.Text>
              <Row justify={'center'} gutter={16}>
                <Col>
                  <Button
                    type="primary"
                    onClick={async () => {
                      try {
                        const values = await validateFields(baseInfoFields);
                        console.log('baseinfo form.getFieldsValue()');
                        console.log(values);
                        // await validateFields();
                        setKey('2');
                      } catch (error) {
                        let errorFields = error.errorFields;
                        console.log(errorFields);

                        // let errorFields: [] = error.errorFields
                        errorFields.map((item: any, index: number) => {
                          //只输出第一个验证错误
                          let errors = item.errors;
                          while (errors.length > 1) {
                            errors = errors.splice(1);
                          }
                          item.errors = errors;
                        });
                        // console.log(errorFields);
                        message.warn(errorFields[0].errors);

                        error.errorFields = errorFields;
                      }
                    }}
                  >
                    下一步
                  </Button>
                </Col>
              </Row> */}
            </>
          ),
        }
      : null,
    type == 'alter'
      ? {
          key: '0',
          label: (
            <Space>
              <Badge
                color={key == '0' ? '#ff9000' : '#00000040'}
                count=" "
                style={{ marginBottom: 2 }}
              />
              <label
                style={{
                  color: '#ff4d4f',
                  display: 'inline-block',
                  // marginLeft: 46,
                  // marginRight: 4,
                  fontSize: 14,
                  fontFamily: 'SimSun, sans-serif',
                  lineHeight: 1,
                }}
              >
                *
              </label>
              变更原因
              <DoubleRightOutlined />
            </Space>
          ),
          // disabled: id ? (type != undefined ? true : false) : true,
          children: (
            <>
              <Row justify={'center'} gutter={16}>
                <Col span={2}></Col>
                <Col span={20}>
                  <TextArea
                    // bordered={false}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setReason(e.target.value);
                    }}
                    style={{ width: '100%', resize: 'none', color: 'black' }}
                    rows={10}
                  ></TextArea>
                </Col>
                <Col span={2}></Col>
              </Row>
              <br />
              <Row justify={'center'} gutter={16}>
                <Col>
                  <Button
                    type="primary"
                    onClick={() => {
                      console.log(reason);
                      console.log(reason == '');
                      console.log(reason == null);
                      if (reason == undefined || reason == '' || reason == null) {
                        message.warning('请填写变更原因！');
                        return;
                      }
                      setKey('1');
                    }}
                  >
                    下一步
                  </Button>
                </Col>
              </Row>
            </>
          ),
        }
      : null,
    {
      key: '1',
      label: (
        <Space>
          <Badge
            color={key == '1' ? '#1890ff' : '#00000040'}
            count="1"
            style={{ marginBottom: 2 }}
          />
          基本信息
          <DoubleRightOutlined />
        </Space>
      ),
      disabled:
        fanInfo.status == 'rejected' ? true : id ? (type != undefined ? true : false) : true,
      children: (
        <BaseInfoForm
          setKey={setKey}
          formRef={formRef}
          form={form}
          flowRateUnit={flowRateUnit}
          setFlowRateUnit={setFlowRateUnit}
          model={id}
          type={type ? type : fanInfo.type}
          status={fanInfo.status}
          isCopyRecord={fanInfo.type}
          onSubmit={onSubmit}
          submitLoading={submitLoading}
          saveLoading={saveLoading}
        />
      ),
    },
    {
      key: '2',
      label: (
        <Space>
          <Badge
            color={key == '2' ? '#1890ff' : '#00000040'}
            count="2"
            style={{ marginBottom: 2 }}
          />
          性能曲线
          <DoubleRightOutlined />
        </Space>
      ),
      disabled:
        fanInfo.status == 'rejected' ? true : id ? (type != undefined ? true : false) : true,
      children: (
        <PerfDataForm
          setKey={setKey}
          standardStatusData={standardStatusData}
          setStandardStatusData={setStandardStatusData}
          id={id}
          type={type ? type : fanInfo.type}
          status={fanInfo.status}
          onSubmit={onSubmit}
          saveLoading={saveLoading}
          submitLoading={submitLoading}
        />
      ),
    },
    {
      key: '3',
      label: (
        <Space>
          <Badge
            color={key == '3' ? '#1890ff' : '#00000040'}
            count="3"
            style={{ marginBottom: 2 }}
          />
          附件上传
          <DoubleRightOutlined />
        </Space>
      ),
      disabled:
        fanInfo.status == 'rejected' ? true : id ? (type != undefined ? true : false) : true,
      children: (
        <>
          <FileForm
            setKey={setKey}
            imgFileList={imgFileList}
            setImgFileList={setImgFileList}
            buttonVisible={buttonVisible}
            setButtonVisible={setButtonVisible}
            fanInfo={fanInfo}
            setFanInfo={setFanInfo}
            id={id}
          />

          {/* {!buttonVisible ? ( */}
          <>
            <Row>
              <Col lg={11} md={12} sm={24}>
                <ProFormText
                  name="createBy"
                  label="上传者ID"
                  // colProps={{ span: 6 }}
                  initialValue={initialState?.currentUser?.userId}
                  disabled
                />
              </Col>
            </Row>

            <div className={styles.centerButton}>
              <Button
                // type="primary"
                style={{ marginRight: 3 }}
                onClick={() => {
                  setKey('2');
                }}
              >
                上一步
              </Button>
              {(id && !['draft', 'rejected'].includes(fanInfo.status)) || type ? (
                type == 'copy'
              ) : fanInfo.type == 'copy' || fanInfo.status == 'pass' ? null : (
                <Button
                  type="primary"
                  disabled={submitLoading}
                  style={{ marginLeft: 3 }}
                  onClick={() => onSubmit('draft')}
                  loading={saveLoading}
                >
                  保存
                </Button>
              )}

              <Button
                type="primary"
                // disabled={submitLoading}
                style={{ marginLeft: 3 }}
                onClick={() => onSubmit()}
                loading={submitLoading}
              >
                提交
              </Button>
            </div>
          </>
          {/* ) : null} */}
        </>
      ),
    },
  ];
  return (
    <>
      <ProForm
        layout="horizontal"
        {...formItemLayout}
        form={form}
        // grid={true}
        // rowProps={{
        //   gutter: [24, 8],
        // }}
        formRef={formRef}
        submitter={false}
        // initialValues={initialValues}
        // onFinish={async (value) => submit(value)}
      >
        <Card className={styles.card} bordered={false}>
          <Tabs
            activeKey={key}
            // defaultActiveKey="3"
            centered
            onTabScroll={(e) => {}}
            onTabClick={(e) => {
              console.log(e);
              setKey(e);
            }}
            type="line"
            items={items}
            tabBarExtraContent={
              <Button
                onClick={() => {
                  // history.goBack();
                  history.push(`/fan/${activeKey}`);
                }}
              >
                <RollbackOutlined style={{ color: 'rgb(24, 144, 255)', fontSize: 24 }} />
              </Button>
            }
          ></Tabs>
        </Card>

        {/* TODO:文件类型验证，文件数量限制，是否必须上传 */}
      </ProForm>
    </>
  );
};

export default Create;
