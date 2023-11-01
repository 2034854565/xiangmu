/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-06-26 10:56:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-26 17:05:08
 */
import { history, useLocation, useModel } from 'umi';
import { Divider, Image, notification, Popover } from 'antd';

import CarouselDetail from '@/components/CarouselDetail';
import FileView from '@/components/FileView';
import PerformanceGraph from '@/pages/charts/performanceGraph';
import { saveUserAction } from '@/services/ant-design-pro/api';
import { QuestionCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import { ProColumns, ProList, ProTable } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Tabs,
  TabsProps,
  Typography,
  Upload,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { FanDetailItem, fallbackImage, PerfDataItem } from '../../data.d';
import { queryFanData, queryFanPerfData, queryUpdateFansOriginFan } from '../../selection/service';
import { downloadFile1 } from '../../service';
import { fileNameDict, fixNumFunc } from '../utils';
import { addAuditRecord } from './service';
import { excelTableColumns, perfDataIndex } from '../../create/components/PerfDataForm/data.d';
import { time } from 'echarts';
const { Option } = Select;
const { Text } = Typography;
const formlayout = {
  labelCol: {
    // span: 'flex'
    span: 5,
  },
  wrapperCol: { span: 18, justify: 'flex' },
  // labelAlign: 'right',span: 16,flex: 16,
};
const AuditDetail: React.FC<{}> = (props) => {
  // console.log('FanDetail props');
  // console.log(props);
  // const { model, activeKey } = props.match.params;
  const location = useLocation(); //获取跳转页面携带的值
  // console.log('location.state');
  // console.log(location.state);
  if (location?.state?.id == undefined) {
    window.location.replace('/fan/1');
  }
  const { id, activeKey } = location?.state;

  // console.log('id1');
  // console.log(id);
  const { initialState } = useModel('@@initialState');
  const authList = initialState?.currentUser?.authList;

  const mxcAuthList = authList == undefined ? [] : authList;
  const [key, setKey] = useState<string>('1');
  const [fanInfo, setFanInfo] = useState<FanDetailItem>();
  let [perfData, setPerfData] = useState<{}>({});
  let [perfTableData, setPerfTableData] = useState<any>([]);
  let [perfTableDataAlter, setPerfTableDataAlter] = useState<any>([]);
  const getPerfData = () => {
    console.log('getPerfData');
    console.log(perfData);

    return perfData;
  };
  const [imgMain, setImgMain] = useState<string[]>([]);
  const [viewFile, setViewFile] = useState<{ name: string; path: string }>();
  const [viewFile2, setViewFile2] = useState<{ name: string; path: string }>();
  const [viewFile1, setViewFile1] = useState<{ title: string; name: string; path: string }>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [imgMainAlter, setImgMainAlter] = useState<string[]>([]);
  const [result, setResult] = useState<string>();

  const [fanInfoAlter, setFanInfoAlter] = useState<FanDetailItem>();
  let [perfDataAlter, setPerfDataAlter] = useState<{}>({});
  let pageArea = '';
  switch (activeKey) {
    case '1':
      pageArea = '选型';
      break;
    case '2':
      pageArea = '相似设计';
      break;
    case '3':
      pageArea = '变形设计';
      break;
    case '4':
      pageArea = '数据管理';
    case '5':
      pageArea = '审核管理';
      break;
    case '6':
      pageArea = '审核进度';
  }

  const generalParams = {
    monitorModule: '风机平台',
    pageUrl: window.location.href,
    pageName: '风机平台',
    pageArea: pageArea,
    actionModel: fanInfo?.model,
  };

  useEffect(() => {
    //
    queryUpdateFansOriginFan({ id: id })
      .then((res) => {
        setImgMain(res.data.img3d);
        res.data.img3d = undefined;
        const technicalFile = [];
        for (let key in res.data.technicalFile) {
          if (res.data.technicalFile[key].length == 0) {
            continue;
          } else {
            for (let i = 0; i < res.data.technicalFile[key].length; i++) {
              technicalFile.push({
                title: fileNameDict[key],
                path: res.data.technicalFile[key][i].downloadUrl,
                name: res.data.technicalFile[key][i].fileName,
              });
            }
          }
        }
        res.data.technicalFile = technicalFile;
        console.log('technicalFile');
        console.log(technicalFile);

        let aerodynamicSketch = [];
        // for (let key in res.data.aerodynamicSketch) {

        for (let i = 0; i < res.data.aerodynamicSketch.length; i++) {
          aerodynamicSketch.push({
            title: res.data.aerodynamicSketch[i].fileName,
            path: res.data.aerodynamicSketch[i].downloadUrl,
            // name: res.data.aerodynamicSketch[key].split('/').pop(),
          });

          // }
        }
        // console.log('aerodynamicSketch');
        // console.log(aerodynamicSketch);
        res.data.aerodynamicSketch = aerodynamicSketch;
        setFanInfo(res.data);
        console.log('setFanInfo');
        console.log(res.data);

        queryFanPerfData(res.data.id)
          .then((res) => {
            setPerfData(res.data);
            const data = res.data;
            let temp = {};
            for (let key in data) {
              temp[key] = [];
              for (let i = 0; i < data[key].length; i++) {
                temp[key].push(data[key][i]);
              }
            }
            let perfTableData = [];

            for (let i = 0; i < temp['flowRate'].length; i++) {
              perfTableData.push({
                // keys[0]:temp [keys[0]],
                flowRate: fixNumFunc(temp['flowRate'][i], 3),
                fullPressure: fixNumFunc(temp['fullPressure'][i], 1),
                staticPressure: fixNumFunc(temp['staticPressure'][i], 1),
                fanEff: fixNumFunc(temp['fanEff'][i], 1),
                staticPressureEff: fixNumFunc(temp['staticPressureEff'][i], 1),
                shaftPower: fixNumFunc(temp['shaftPower'][i], 1),
                motorSpeed: temp['motorSpeed'][i],
                impellerDiameter: temp['impellerDiameter'][i],
                noise: temp['noise'][i],
                specificSpeed: temp['specificSpeed'][i],
                u: temp['u'][i],
                flowCoefficient: temp['flowCoefficient'][i],
                pressureCoefficient: temp['pressureCoefficient'][i],
              });
            }
            console.log('perfTableData');
            console.log(perfTableData);

            setPerfTableData(perfTableData);
          })
          .catch((error) => {
            message.error('请求失败！');
            return;
          });
      })
      .catch((error) => {
        console.log(error);

        message.error('请求失败！');
        return;
      });
    queryFanData(id)
      .then((res) => {
        setImgMainAlter(res.data.img3d);
        res.data.img3d = undefined;
        const technicalFile = [];
        for (let key in res.data.technicalFile) {
          if (res.data.technicalFile[key].length == 0) {
            continue;
          } else {
            for (let i = 0; i < res.data.technicalFile[key].length; i++) {
              technicalFile.push({
                title: fileNameDict[key],
                path: res.data.technicalFile[key][i].downloadUrl,
                name: res.data.technicalFile[key][i].fileName,
              });
            }
          }
        }
        res.data.technicalFile = technicalFile;
        console.log('setFanInfoAlter technicalFile');
        console.log(technicalFile);

        let aerodynamicSketch = [];
        // for (let key in res.data.aerodynamicSketch) {

        for (let i = 0; i < res.data.aerodynamicSketch.length; i++) {
          aerodynamicSketch.push({
            title: res.data.aerodynamicSketch[i].fileName,
            path: res.data.aerodynamicSketch[i].downloadUrl,
            // name: res.data.aerodynamicSketch[key].split('/').pop(),
          });

          // }
        }
        console.log('aerodynamicSketch');
        console.log(aerodynamicSketch);
        res.data.aerodynamicSketch = aerodynamicSketch;
        setFanInfoAlter(res.data);
        console.log('res.data');
        console.log(res.data);

        queryFanPerfData(id)
          .then((res) => {
            setPerfDataAlter(res.data);
            const data = res.data;
            let temp = {};
            for (let key in data) {
              temp[key] = [];
              for (let i = 0; i < data[key].length; i++) {
                temp[key].push(data[key][i]);
              }
            }
            let perfTableDataAlter = [];

            for (let i = 0; i < temp['flowRate'].length; i++) {
              perfTableDataAlter.push({
                // keys[0]:temp [keys[0]],
                flowRate: fixNumFunc(temp['flowRate'][i], 3),
                fullPressure: fixNumFunc(temp['fullPressure'][i], 1),
                staticPressure: fixNumFunc(temp['staticPressure'][i], 1),
                fanEff: fixNumFunc(temp['fanEff'][i], 1),
                staticPressureEff: fixNumFunc(temp['staticPressureEff'][i], 1),
                shaftPower: fixNumFunc(temp['shaftPower'][i], 1),
                motorSpeed: temp['motorSpeed'][i],
                impellerDiameter: temp['impellerDiameter'][i],
                noise: temp['noise'][i],
                specificSpeed: temp['specificSpeed'][i],
                u: temp['u'][i],
                flowCoefficient: temp['flowCoefficient'][i],
                pressureCoefficient: temp['pressureCoefficient'][i],
              });
            }
            console.log('perfTableData');
            console.log(perfTableData);

            setPerfTableDataAlter(perfTableDataAlter);
          })
          .catch((error) => {
            message.error('请求失败！');
            return;
          });
      })
      .catch((error) => {
        console.log(error);

        message.error('请求失败！');
        return;
      });
    // console.log('fanInfo');
    // console.log(fanInfo.);
  }, []);
  // const userInfo = initialState?.currentUser?.name;
  // const updateAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  // 气动略图下载
  const onClick = (e, record) => {
    console.log(record);
    setSubmitLoading(true);

    // console.log("e", e)
    //需要保存的用户行为信息,包括上传、下载、设计等行为
    const params = {
      ...generalParams,
      pageArea: '变更详情',
      actionId: `fan_${activeKey}_${e.target.innerText}`,
      actionType: '下载',
      actionName: '下载气动略图',
      description: '下载气动略图_' + record.title,
    };
    saveUserAction({ params }).catch((e) => {});

    downloadFile1(record.path, record.title).finally(() => {
      setSubmitLoading(false);
    });

    console.log('下载');
  };
  // 技术文档下载
  const onTechnologyFileClick = (e, record) => {
    console.log(record);
    setSubmitLoading(true);

    // console.log("e", e)
    //需要保存的用户行为信息,包括上传、下载、设计等行为
    const params = {
      ...generalParams,
      pageArea: '变更详情',
      actionId: `fan_${activeKey}_${e.target.innerText}`,
      actionType: '下载',
      actionName: '下载技术文档_' + e.target.innerText,
      description: '下载技术文档_' + record.name,
    };
    saveUserAction({ params }).catch((e) => {});

    downloadFile1(record.path, record.name).finally(() => {
      setSubmitLoading(false);
    });
  };
  const [echartsInstance, setEchartsInstance] = useState<echarts.ECharts>();
  const [form] = Form.useForm();
  const onSubmit = async () => {
    const values = await form.validateFields();
    console.log('values');
    console.log(values);
    values.userId = initialState?.currentUser?.userId;
    // values.auditBizId = fanInfo?.id;
    values.auditBizId = id;
    setSubmitLoading(true);
    addAuditRecord(values)
      .then((res) => {
        console.log('res');
        console.log(res);
        if (res.success) {
          // 变更审核批准and确认
          const actionParams = {
            ...generalParams,
            actionId:
              `fan_${activeKey}_` + fanInfoAlter?.status == 'auditByLead'
                ? '变更审核批准'
                : '变更审核确认',
            actionName:
              fanInfoAlter?.status == 'auditByLead' ? '变更审核批准数据' : '变更审核确认数据',
            actionType: fanInfoAlter?.status == 'auditByLead' ? '变更审核批准' : '变更审核确认',
            description:
              `变更${fanInfoAlter?.status == 'auditByLead' ? '批准' : '确认'}${
                values.result == 'pass' ? '通过' : '不通过'
              }风机数据_` +
              fanInfoAlter?.model +
              '-' +
              fanInfoAlter?.figNum +
              '-' +
              fanInfoAlter?.version,
          };
          saveUserAction({ params: actionParams }).catch((e) => {});
          notification.success({
            message: '提交成功！',
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
        }
        setSubmitLoading(false);
      })
      .catch((error) => {
        message.error('请求失败！');
        return () => {
          setSubmitLoading(false);
        };
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  const columns: ProColumns<PerfDataItem>[] = [];
  let title = [];
  for (let key in excelTableColumns) {
    title.push(key.toString());
  }
  // console.log(title);
  for (let i = 0; i < title.length; i++) {
    if (
      ['specificSpeed', 'u', 'flowCoefficient', 'pressureCoefficient'].includes(
        excelTableColumns[title[i]],
      )
    ) {
      continue;
    }
    columns.push({
      title: title[i],
      dataIndex: excelTableColumns[title[i]],
      valueType: 'textarea',
      width: 80,
      render: (val: any, record: any, index) => {
        for (let j = 0; j < perfDataIndex.length; j++) {
          // console.log('perfDataIndex[j]');
          // console.log(perfDataIndex[j]);
          // console.log('record[perfDataIndex[j]]');
          // console.log(record[perfDataIndex[j]]);
          // console.log('perfTableData[index][perfDataIndex[j]]');
          // console.log('index');
          // console.log(index);
          // console.log(perfTableData);

          // console.log(perfTableData[index]);
          if (index < perfTableData.length) {
            if (record[perfDataIndex[j]] != perfTableData[index][perfDataIndex[j]]) {
              return (
                <Typography.Text strong type="warning">
                  {val}
                </Typography.Text>
              );
            } else {
              return val;
            }
          } else {
            return (
              <Typography.Text strong type="warning">
                {val}
              </Typography.Text>
            );
          }
        }
        return val;
      },
    });
  }
  const items: TabsProps['items'] | any = [
    {
      key: '0',
      label: '基本信息',
      children: (
        <>
          {/* <Col span={6}> */}

          <Descriptions
            title="基本信息"
            labelStyle={{ justifyContent: 'flex-end', minWidth: 80 }}
            contentStyle={{ justifyContent: 'flex-start', minWidth: 100 }}
            column={2}
          >
            <Descriptions.Item label="应用车型">
              {fanInfo?.applicationModelId}

              {fanInfo?.applicationModel ? '-' + fanInfo?.applicationModel : ''}

              {fanInfoAlter?.applicationModelId != fanInfo?.applicationModelId ? (
                <Text type="danger">{fanInfoAlter?.applicationModelId}</Text>
              ) : null}
              {fanInfoAlter?.applicationModel != fanInfo?.applicationModel ? (
                <Text type="danger">
                  {fanInfoAlter?.applicationModel ? '-' + fanInfoAlter?.applicationModel : ''}
                </Text>
              ) : null}
            </Descriptions.Item>
            {/* <Descriptions.Item label="应用车型">
                    {fanInfo?.applicationModel}
                  </Descriptions.Item> */}
            <Descriptions.Item label="冷却对象">
              {fanInfo?.coolObject}
              {fanInfo?.coolObject != fanInfoAlter?.coolObject ? (
                <Text type="danger">{fanInfoAlter?.coolObject}</Text>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="风机类型">
              {fanInfo?.category}
              {fanInfo?.category != fanInfoAlter?.category ? (
                <Text type="danger">{fanInfoAlter?.category}</Text>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="风机型号">
              {fanInfo?.model}
              {fanInfo?.model != fanInfoAlter?.model ? (
                <Text type="danger">{fanInfoAlter?.model}</Text>
              ) : null}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions
            title="铭牌信息"
            labelStyle={{ justifyContent: 'flex-end', minWidth: 80 }}
            contentStyle={{ justifyContent: 'flex-start ', minWidth: 100 }}
            column={2}
          >
            {/* <Descriptions.Item label="单边叶间隙">--</Descriptions.Item>
              <Descriptions.Item label="模拟类型">--</Descriptions.Item>
            <Descriptions.Item label="速度">--</Descriptions.Item> */}
            <Descriptions.Item label="流量">
              {fanInfo?.flowRate}m³/s
              {fanInfo?.flowRate != fanInfoAlter?.flowRate ? (
                <Text type="danger">{fanInfoAlter?.flowRate}m³/s</Text>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="全压 ">
              {fanInfo?.fullPressure} Pa
              {fanInfo?.fullPressure != fanInfoAlter?.fullPressure ? (
                <Text type="danger">{fanInfoAlter?.fullPressure}Pa</Text>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="静压">
              {fanInfo?.staticPressure}Pa
              {fanInfo?.staticPressure != fanInfoAlter?.staticPressure ? (
                <Text type="danger">{fanInfoAlter?.staticPressure}Pa</Text>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="效率 ">
              {fanInfo?.efficiency}%
              {fanInfo?.efficiency != fanInfoAlter?.efficiency ? (
                <Text type="danger">{fanInfoAlter?.efficiency}%</Text>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="轴功率">
              {fanInfo?.shaftPower}%
              {fanInfo?.shaftPower != fanInfoAlter?.shaftPower ? (
                <Text type="danger">{fanInfoAlter?.shaftPower}%</Text>
              ) : null}
              {/* {fanInfo?.shaftPower}kW */}
            </Descriptions.Item>
            <Descriptions.Item label="电机型号" span={2}>
              {fanInfo?.motorModel}
              {fanInfo?.motorModel != fanInfoAlter?.motorModel ? (
                <Text type="danger">{fanInfoAlter?.motorModel}</Text>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="电源频率">
              {fanInfo?.powerFrequency}Hz
              {fanInfo?.powerFrequency != fanInfoAlter?.powerFrequency ? (
                <Text type="danger">{fanInfoAlter?.powerFrequency}Hz</Text>
              ) : null}
              {/*  */}
            </Descriptions.Item>
            <Descriptions.Item label="电机功率">
              {fanInfo?.motorPower}kW
              {fanInfo?.motorPower != fanInfoAlter?.motorPower ? (
                <Text type="danger">{fanInfoAlter?.motorPower}kW</Text>
              ) : null}
              {/* */}
            </Descriptions.Item>
            <Descriptions.Item label="电机转速">
              {fanInfo?.motorSpeedMin ? fanInfo?.motorSpeedMin + '/' : null}
              {fanInfo?.motorSpeed}r/min
              {fanInfo?.motorSpeedMin != fanInfoAlter?.motorSpeedMin ? (
                <Text type="danger">
                  {fanInfoAlter?.motorSpeedMin ? fanInfoAlter?.motorSpeedMin + '/' : null}
                </Text>
              ) : null}
              {fanInfo?.motorSpeed != fanInfoAlter?.motorSpeed ? (
                <Text type="danger">
                  {fanInfoAlter?.motorSpeed ? fanInfoAlter?.motorSpeed : null}
                  r/min
                </Text>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="额定电流">
              {fanInfo?.ratedCurrent}A
              {fanInfo?.ratedCurrent != fanInfoAlter?.ratedCurrent ? (
                <Text type="danger">{fanInfoAlter?.ratedCurrent}A</Text>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="额定电压">
              {fanInfo?.ratedVoltage}V
              {fanInfo?.ratedVoltage.toString() != fanInfoAlter?.ratedVoltage.toString() ? (
                <Text type="danger">{fanInfoAlter?.ratedVoltage}V</Text>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="海拔">
              {fanInfo?.altitude == null ? '/' : fanInfo?.altitude}m
              {fanInfo?.altitude != fanInfoAlter?.altitude ? (
                <Text type="danger">{fanInfoAlter?.altitude}m</Text>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="温度">
              {fanInfo?.temperature == null ? '/' : fanInfo?.temperature}℃
              {fanInfo?.temperature != fanInfoAlter?.temperature ? (
                <Text type="danger">{fanInfoAlter?.temperature}℃</Text>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="湿度 ">
              {fanInfo?.humidity ? fanInfo?.humidity + '%' : ''}
              {fanInfo?.humidity != fanInfoAlter?.humidity ? (
                <Text type="danger">{fanInfoAlter?.humidity}%</Text>
              ) : null}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions
            labelStyle={{ justifyContent: 'flex-end', minWidth: 80 }}
            contentStyle={{ justifyContent: 'flex-start ', minWidth: 100 }}
            column={2}
          >
            <Descriptions.Item label="叶轮直径">
              {fanInfo?.impellerDiameter}mm
              {fanInfo?.impellerDiameter != fanInfoAlter?.impellerDiameter ? (
                <Text type="danger">{fanInfoAlter?.impellerDiameter}mm</Text>
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="重量">
              {fanInfo?.weight}kg
              {fanInfo?.weight != fanInfoAlter?.weight ? (
                <Text type="danger">{fanInfoAlter?.weight}kg</Text>
              ) : null}
            </Descriptions.Item>
            {/* <Descriptions.Item label="备注1(项目名称)">{fanInfo?.remark1}</Descriptions.Item>
            <Descriptions.Item label="备注2(客户)">{fanInfo?.remark2}</Descriptions.Item> */}
          </Descriptions>
          {/* </Col> */}
        </>
      ),
    },
    {
      key: '1',
      label: '性能曲线',
      children: (
        <>
          <ProTable
            headerTitle={'变更前：' + perfTableData.length + '条数据'}
            size="small"
            // cardBordered
            search={false}
            options={false}
            pagination={false}
            columns={columns}
            // rowKey={'key'}
            // actionRef={similarTableActionRef}
            dataSource={perfTableData}
          ></ProTable>
          {}
          <ProTable
            headerTitle={
              <>
                {'变更后：' + perfTableDataAlter.length + '条数据'}
                {perfTableData.length == perfTableDataAlter.length ? null : (
                  <Popover
                    title="变更提醒"
                    content={
                      perfTableData.length > perfTableDataAlter.length ? '新增记录' : '删除记录'
                    }
                  >
                    <QuestionCircleOutlined />
                  </Popover>
                )}
              </>
            }
            size="small"
            // cardBordered
            search={false}
            options={false}
            pagination={false}
            columns={columns}
            // rowKey={'key'}
            // actionRef={similarTableActionRef}
            dataSource={perfTableDataAlter}
          ></ProTable>
          {/* {fanInfo == undefined ? null : (
            <PerformanceGraph
              activeKey={activeKey}
              fanInfo={fanInfo}
              // getPerfData={getPerfData}
              getPerfData={() => {
                return perfDataAlter;
              }}
              authList={authList}
              echartsInstance={echartsInstance}
              setEchartsInstance={setEchartsInstance}
            />
          )} */}
        </>
      ),
    },
    {
      key: '2',
      label: '外形尺寸图',
      children: (
        <>
          <ProList<any>
            headerTitle="变更前："
            onRow={(record: any) => {
              // console.log('外形尺寸图 click onRow');
              // console.log(record);
              return {
                onClick: (e) => {
                  // console.log('外形尺寸图 click record');
                  // console.log(record);
                  setViewFile2(record);
                  const actionParams = {
                    ...generalParams,
                    pageArea: '变更详情',
                    actionId: `fan_${activeKey}_查看`,
                    actionType: '查询',
                    actionName: '查看外形尺寸图',
                    description:
                      '查看外形尺寸图_' + record.model + '-' + record.figNum + '-' + record.version,
                  };
                  saveUserAction({ params: actionParams }).catch((e) => {});
                },
              };
            }}
            rowKey="title"
            dataSource={
              fanInfo?.outlineFile.length > 0
                ? fanInfo?.outlineFile.map((item) => {
                    return {
                      title: item.fileName,
                      path: item.downloadUrl,
                    };
                  })
                : undefined
            }
            showActions="hover"
            showExtra="hover"
            metas={{
              title: {
                dataIndex: 'title',
              },
              actions: {
                render: (text, row) => [
                  <Button
                    type="text"
                    size="small"
                    style={{ color: '#1890ff' }}
                    loading={submitLoading}
                    onClick={(e) => {
                      setViewFile2(row);
                      const actionParams = {
                        ...generalParams,
                        pageArea: '变更详情',
                        actionId: `fan_${activeKey}_查看`,
                        actionType: '查询',
                        actionName: '查看外形尺寸图',
                        description:
                          '查看外形尺寸图_' + row.model + '-' + row.figNum + '-' + row.version,
                      };
                      saveUserAction({ params: actionParams }).catch((e) => {});
                    }}
                  >
                    查看
                  </Button>,
                  <Button
                    type="text"
                    size="small"
                    style={{ color: '#1890ff' }}
                    loading={submitLoading}
                    onClick={(e) => {
                      // onClick(e, row);
                      setSubmitLoading(true);
                      const actionParams = {
                        ...generalParams,
                        pageArea: '变更详情',
                        actionId: `fan_${activeKey}_${e.target.innerText}`,
                        actionType: '下载',
                        actionName: '下载外形尺寸图',
                        description: '下载外形尺寸图_' + fanInfo?.outlineFile[0].fileName,
                      };
                      saveUserAction({ params: actionParams })
                        .catch((e) => {})
                        .finally(() => {
                          setSubmitLoading(false);
                        });
                      downloadFile1(
                        fanInfo?.outlineFile[0].downloadUrl,
                        fanInfo?.outlineFile[0].fileName,
                      );
                    }}
                  >
                    下载
                  </Button>,
                ],
              },
            }}
          />
          {fanInfo?.outlineFile.length == 0 ? (
            <label> </label>
          ) : (
            <>
              {['png', 'jpg', 'jpeg', 'gif'].includes(
                fanInfo?.outlineFile[0].fileName.toString().split('.').pop(),
              ) ? (
                <Image
                  // width={300}
                  // height={300}
                  // src={fanInfo?.img3d[0]}
                  // src={'/api/download/psad/fan/391702/391702-img3d-1.png'} + '?v=' + moment()
                  src={fanInfo?.outlineFile[0].downloadUrl}
                  fallback={fallbackImage}
                />
              ) : viewFile2 == undefined ? null : (
                <FileView
                  url={viewFile2.path}
                  filename={viewFile2.title}
                  refresh={false}
                  randomNum={Math.random()}
                />
              )}
            </>
          )}
          <ProList<any>
            headerTitle="变更后："
            onRow={(record: any) => {
              // console.log('外形尺寸图 click onRow');
              // console.log(record);
              return {
                onClick: (e) => {
                  // console.log('外形尺寸图 click record');
                  // console.log(record);
                  setViewFile2(record);
                  const actionParams = {
                    ...generalParams,
                    pageArea: '变更详情',
                    actionId: `fan_${activeKey}_查看`,
                    actionType: '查询',
                    actionName: '查看外形尺寸图',
                    description:
                      '查看外形尺寸图_' + record.model + '-' + record.figNum + '-' + record.version,
                  };
                  saveUserAction({ params: actionParams }).catch((e) => {});
                },
              };
            }}
            rowKey="title"
            dataSource={
              fanInfoAlter?.outlineFile.length > 0
                ? fanInfoAlter?.outlineFile.map((item) => {
                    let status = '';

                    let downloadUrlList = [];
                    for (let i = 0; i < fanInfo?.outlineFile.length; i++) {
                      downloadUrlList.push(fanInfo?.outlineFile[i].downloadUrl);
                    }
                    if (downloadUrlList.includes(item.downloadUrl)) {
                      status = '(保留)';
                    } else if (!downloadUrlList.includes(item.downloadUrl)) {
                      status = '(新增)';
                    }
                    return {
                      title: item.fileName,
                      path: item.downloadUrl,
                      status: status,
                    };
                  })
                : undefined
            }
            showActions="hover"
            showExtra="hover"
            metas={{
              title: {
                dataIndex: 'title',
              },
              actions: {
                render: (text, row) => [
                  row.status,
                  <Button
                    type="text"
                    size="small"
                    style={{ color: '#1890ff' }}
                    loading={submitLoading}
                    onClick={(e) => {
                      setViewFile2(row);
                      const actionParams = {
                        ...generalParams,
                        actionId: `fan_${activeKey}_${e.target.innerText}`,
                        actionType: '查看',
                        actionName: '查看外形尺寸图_' + e.target.innerText,
                        description: null,
                      };
                      saveUserAction({ params: actionParams }).catch((e) => {});
                    }}
                  >
                    查看
                  </Button>,
                  <Button
                    type="text"
                    size="small"
                    style={{ color: '#1890ff' }}
                    loading={submitLoading}
                    onClick={(e) => {
                      // onClick(e, row);
                      setSubmitLoading(true);
                      downloadFile1(
                        fanInfo?.outlineFile[0].downloadUrl,
                        fanInfo?.outlineFile[0].fileName,
                      );
                      const actionParams = {
                        ...generalParams,
                        pageArea: '变更详情',
                        actionId: `fan_${activeKey}_${e.target.innerText}`,
                        actionType: '下载',
                        actionName: '下载外形尺寸图',
                        description: '下载外形尺寸图_' + fanInfo?.outlineFile[0].fileName,
                      };
                      saveUserAction({ params: actionParams })
                        .catch((e) => {})
                        .finally(() => {
                          setSubmitLoading(false);
                        });
                    }}
                  >
                    下载
                  </Button>,
                ],
              },
            }}
          />
          {fanInfoAlter?.outlineFile.length == 0 ? (
            <label> </label>
          ) : (
            <>
              {['png', 'jpg', 'jpeg', 'gif'].includes(
                fanInfoAlter?.outlineFile[0].fileName.toString().split('.').pop(),
              ) ? (
                <Image
                  // width={300}
                  // height={300}
                  // src={fanInfo?.img3d[0]}
                  // src={'/api/download/psad/fan/391702/391702-img3d-1.png'} + '?v=' + moment()
                  src={fanInfoAlter?.outlineFile[0].downloadUrl}
                  fallback={fallbackImage}
                />
              ) : viewFile2 == undefined ? null : (
                <FileView
                  url={viewFile2.path}
                  filename={viewFile2.title}
                  refresh={false}
                  randomNum={Math.random()}
                />
              )}
            </>
          )}
        </>
      ),
    },
    mxcAuthList.includes('/fan/detail:technicalFile')
      ? {
          key: '3',
          label: '技术文档',
          children: (
            <>
              <ProList<any>
                headerTitle="变更前："
                onRow={(record: any) => {
                  return {
                    onClick: (e) => {
                      // console.log('record');
                      // console.log(record);
                      setViewFile(record);
                      const actionParams = {
                        ...generalParams,
                        pageArea: '变更详情',
                        actionId: `fan_${activeKey}_${e.target.innerText}`,
                        actionType: '查询',
                        actionName: '查看技术文档',
                        description: '查看技术文档_' + record.name,
                      };
                      saveUserAction({ params: actionParams }).catch((e) => {});
                    },
                  };
                }}
                rowKey="title"
                dataSource={fanInfo?.technicalFile}
                showActions="hover"
                showExtra="hover"
                metas={{
                  title: {
                    dataIndex: 'title',
                  },
                  description: {
                    dataIndex: 'name',
                  },
                  // subTitle: {
                  //   render: () => {
                  //     return <Space size={0}> </Space>;
                  //   },
                  // },
                  actions: {
                    render: (text, row) => [
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        key="view"
                        onClick={() => {
                          console.log('row.path[0]');
                          console.log(row.path);
                          setViewFile(row);
                          const actionParams = {
                            ...generalParams,
                            pageArea: '变更详情',
                            actionId: `fan_${activeKey}_${row.name}`,
                            actionType: '查询',
                            actionName: '查看技术文档',
                            description: '查看技术文档_' + row.name,
                          };
                          saveUserAction({ params: actionParams }).catch((e) => {});
                        }}
                      >
                        查看
                      </a>,

                      <Button
                        type="text"
                        size="small"
                        style={{ color: '#1890ff' }}
                        loading={submitLoading}
                        onClick={(e) => {
                          onTechnologyFileClick(e, row);
                        }}
                      >
                        下载
                      </Button>,
                    ],
                  },
                }}
              />
              <ProList<any>
                headerTitle="变更后："
                onRow={(record: any) => {
                  return {
                    onClick: (e) => {
                      // console.log('record');
                      // console.log(record);
                      setViewFile(record);
                      const actionParams = {
                        ...generalParams,
                        pageArea: '变更详情',
                        actionId: `fan_${activeKey}_${e.target.innerText}`,
                        actionType: '查询',
                        actionName: '查看技术文档',
                        description: '查看技术文档_' + record.name,
                      };
                      saveUserAction({ params: actionParams }).catch((e) => {});
                    },
                  };
                }}
                rowKey="title"
                // dataSource={fanInfoAlter?.technicalFile}
                dataSource={
                  fanInfoAlter?.technicalFile.length > 0
                    ? fanInfoAlter?.technicalFile.map((item) => {
                        let status = '';

                        let downloadUrlList = [];
                        for (let i = 0; i < fanInfo?.technicalFile.length; i++) {
                          downloadUrlList.push(fanInfo?.technicalFile[i].path);
                        }
                        // console.log('downloadUrlList');
                        // console.log(downloadUrlList);
                        if (downloadUrlList.includes(item.path)) {
                          status = '(保留)';
                        } else if (!downloadUrlList.includes(item.path)) {
                          status = '(新增)';
                        }

                        return {
                          title: item.title,
                          name: item.name,
                          path: item.path,
                          status: status,
                        };
                      })
                    : undefined
                }
                showActions="hover"
                showExtra="hover"
                metas={{
                  title: {
                    dataIndex: 'title',
                  },
                  description: {
                    dataIndex: 'name',
                  },
                  // subTitle: {
                  //   render: () => {
                  //     return <Space size={0}> </Space>;
                  //   },
                  // },
                  actions: {
                    render: (text, row) => [
                      row.status,
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        key="view"
                        onClick={() => {
                          console.log('row.path[0]');
                          console.log(row.path);

                          setViewFile(row);
                          const actionParams = {
                            ...generalParams,
                            pageArea: '变更详情',
                            actionId: `fan_${activeKey}_${row.name}`,
                            actionType: '查询',
                            actionName: '查看技术文档',
                            description: '查看技术文档_' + row.name,
                          };
                          saveUserAction({ params: actionParams }).catch((e) => {});
                        }}
                      >
                        查看
                      </a>,

                      <Button
                        type="text"
                        size="small"
                        style={{ color: '#1890ff' }}
                        loading={submitLoading}
                        onClick={(e) => {
                          onTechnologyFileClick(e, row);
                        }}
                      >
                        下载
                      </Button>,
                    ],
                  },
                }}
              />
              {viewFile == undefined ? null : (
                <FileView
                  url={viewFile.path}
                  filename={viewFile.name}
                  refresh={false}
                  randomNum={Math.random()}
                />
              )}
            </>
          ),
        }
      : null,
    mxcAuthList.includes('/fan/detail:aerodynamicSketch')
      ? {
          key: '4',
          label: '气动略图',
          //
          children: (
            <>
              <ProList<any>
                headerTitle="变更前："
                onRow={(record: any) => {
                  return {
                    onClick: () => {
                      console.log('record');
                      console.log(record);
                      if (record.title.split('.').pop() == 'dwg') {
                        message.info('暂不支持dwg文件预览');
                      } else {
                        setViewFile1(record);
                        const actionParams = {
                          ...generalParams,
                          pageArea: '变更详情',
                          actionId: `fan_${activeKey}_${record.title}`,
                          actionType: '查询',
                          actionName: '查看气动略图',
                          description: '查看气动略图_' + record.title,
                        };
                        saveUserAction({ params: actionParams }).catch((e) => {});
                      }
                    },
                  };
                }}
                rowKey="title"
                dataSource={fanInfo?.aerodynamicSketch}
                showActions="hover"
                showExtra="hover"
                metas={{
                  title: {
                    dataIndex: 'title',
                  },
                  description: {
                    dataIndex: 'name',
                  },
                  // subTitle: {
                  //   render: () => {
                  //     return <Space size={0}> </Space>;
                  //   },
                  // },
                  actions: {
                    render: (text, row) => [
                      row.title.split('.').pop() == 'dwg' ? null : (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          key="view"
                          onClick={() => {
                            console.log('row');
                            console.log(row);
                            if (row.title.split('.').pop() == 'dwg') {
                              message.info('暂不支持dwg文件预览');
                            } else {
                              setViewFile1(row);
                              const actionParams = {
                                ...generalParams,
                                pageArea: '变更详情',
                                actionId: `fan_${activeKey}_${row.title}`,
                                actionType: '查询',
                                actionName: '查看气动略图',
                                description: '查看气动略图_' + row.title,
                              };
                              saveUserAction({ params: actionParams }).catch((e) => {});
                            }
                          }}
                        >
                          查看
                        </a>
                      ),
                      <Button
                        type="text"
                        size="small"
                        style={{ color: '#1890ff' }}
                        loading={submitLoading}
                        onClick={(e) => {
                          onClick(e, row);
                        }}
                      >
                        下载
                      </Button>,
                    ],
                  },
                }}
              />
              <ProList<any>
                headerTitle="变更后："
                onRow={(record: any) => {
                  return {
                    onClick: () => {
                      console.log('record');
                      console.log(record);
                      if (record.title.split('.').pop() == 'dwg') {
                        message.info('暂不支持dwg文件预览');
                      } else {
                        setViewFile1(record);
                        const actionParams = {
                          ...generalParams,
                          pageArea: '变更详情',
                          actionId: `fan_${activeKey}_${record.title}`,
                          actionType: '查询',
                          actionName: '查看气动略图',
                          description: '查看气动略图_' + record.title,
                        };
                        saveUserAction({ params: actionParams }).catch((e) => {});
                      }
                    },
                  };
                }}
                rowKey="title"
                // dataSource={fanInfo?.aerodynamicSketch}
                dataSource={
                  fanInfoAlter?.aerodynamicSketch.length > 0
                    ? fanInfoAlter?.aerodynamicSketch.map((item) => {
                        let status = '';

                        let downloadUrlList = [];
                        for (let i = 0; i < fanInfo?.aerodynamicSketch.length; i++) {
                          downloadUrlList.push(fanInfo?.aerodynamicSketch[i].path);
                        }

                        if (downloadUrlList.includes(item.path)) {
                          status = '(保留)';
                        } else if (!downloadUrlList.includes(item.path)) {
                          status = '(新增)';
                        }
                        return {
                          title: item.title,
                          path: item.path,
                          status: status,
                        };
                      })
                    : undefined
                }
                showActions="hover"
                showExtra="hover"
                metas={{
                  title: {
                    dataIndex: 'title',
                  },
                  description: {
                    dataIndex: 'name',
                  },
                  // subTitle: {
                  //   render: () => {
                  //     return <Space size={0}> </Space>;
                  //   },
                  // },
                  actions: {
                    render: (text, row) => [
                      row.status,

                      row.title.split('.').pop() == 'dwg' ? null : (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          key="view"
                          onClick={() => {
                            console.log('row');
                            console.log(row);
                            if (row.title.split('.').pop() == 'dwg') {
                              message.info('暂不支持dwg文件预览');
                            } else {
                              setViewFile1(row);
                              const actionParams = {
                                ...generalParams,
                                pageArea: '变更详情',
                                actionId: `fan_${activeKey}_${row.title}`,
                                actionType: '查询',
                                actionName: '查看气动略图',
                                description: '查看气动略图_' + row.title,
                              };
                              saveUserAction({ params: actionParams }).catch((e) => {});
                            }
                          }}
                        >
                          查看
                        </a>
                      ),
                      <Button
                        type="text"
                        size="small"
                        style={{ color: '#1890ff' }}
                        loading={submitLoading}
                        onClick={(e) => {
                          onClick(e, row);
                        }}
                      >
                        下载
                      </Button>,
                    ],
                  },
                }}
              />
              {viewFile1 == undefined ? null : (
                <FileView
                  url={viewFile1.path}
                  filename={viewFile1.title}
                  refresh={false}
                  randomNum={Math.random()}
                />
              )}
            </>
          ),
        }
      : null,
    {
      key: '5',
      label: '样本说明',
      children: (
        <>
          {fanInfo?.remark1 || fanInfoAlter?.remark1 ? (
            <>
              <Typography.Title level={5}> 项目备注</Typography.Title>
              {fanInfo?.remark1 ? (
                <>
                  <Typography.Paragraph>{fanInfo?.remark1}</Typography.Paragraph>
                </>
              ) : null}
              {fanInfo?.remark1 != fanInfoAlter?.remark1 ? (
                <>
                  <Typography.Paragraph type="danger">{fanInfoAlter?.remark1}</Typography.Paragraph>
                </>
              ) : null}
            </>
          ) : null}
          {fanInfo?.remark2 || fanInfoAlter?.remark2 ? (
            <>
              <Typography.Title level={5}>客户备注 </Typography.Title>
              <Typography.Paragraph>{fanInfo?.remark2}</Typography.Paragraph>
              {fanInfo?.remark2 != fanInfoAlter?.remark2 ? (
                <>
                  <Typography.Paragraph type="danger">{fanInfoAlter?.remark2}</Typography.Paragraph>
                </>
              ) : null}
            </>
          ) : null}

          {fanInfo?.sampleDesc || fanInfoAlter?.sampleDesc ? (
            <>
              <Typography.Title level={5}>样本说明 </Typography.Title>
              <Typography.Paragraph>{fanInfo?.sampleDesc}</Typography.Paragraph>
              <Typography.Paragraph>
                {fanInfoAlter?.sampleDesc != fanInfo?.sampleDesc ? (
                  <Text type="danger">{fanInfoAlter?.sampleDesc}</Text>
                ) : null}
              </Typography.Paragraph>
            </>
          ) : null}
        </>
      ),
    },
  ];

  return (
    <>
      <>
        <PageContainer ghost header={{ title: '' }}>
          <Card
            title={
              fanInfo?.category +
              '-' +
              fanInfo?.model +
              '-' +
              fanInfo?.figNum +
              '-' +
              fanInfo?.version
            }
            extra={[
              <Row gutter={16} justify="space-around" align={'middle'}>
                <Col></Col>
                <Col>
                  <Button
                    onClick={() => {
                      // history.goBack();
                      history.push(`/fan/${activeKey}`);
                    }}
                  >
                    <RollbackOutlined style={{ color: 'rgb(24, 144, 255)', fontSize: 24 }} />
                  </Button>
                </Col>
              </Row>,
            ]}
            style={{ marginTop: 0 }}
          >
            <Row gutter={16} justify="center">
              <Col span={16}>
                <Card bordered={false}>
                  <Tabs centered items={items}></Tabs>
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false}>
                  {/* <Row justify={'center'} style={{ paddingBottom: 24 }}>
                    <Col>
                      <CarouselDetail imgList={imgMain} />
                    </Col>
                  </Row> */}
                  <Row justify={'center'} style={{ paddingBottom: 24 }}>
                    <Col>
                      <CarouselDetail imgList={imgMainAlter} />
                    </Col>
                  </Row>
                  <Form form={form} {...formlayout}>
                    {/* <Form.Item label="审核人" name="userId">
                      {initialState?.currentUser?.userId}
                    </Form.Item> */}
                    <Form.Item
                      label="变更原因"
                      rules={[{ required: true, message: '请选择审核结果' }]}
                    >
                      <TextArea
                        // bordered={false}
                        style={{ width: '100%', resize: 'none', color: 'black' }}
                        disabled
                        value={fanInfo?.reason}
                        defaultValue={''}
                        rows={5}
                      ></TextArea>
                    </Form.Item>
                    <Form.Item
                      label="审核结果"
                      name="result"
                      rules={[{ required: true, message: '请选择审核结果' }]}
                    >
                      <Select
                        placeholder="请选择审核结果"
                        onChange={(value) => {
                          setResult(value);
                        }}
                      >
                        <Option value={'pass'}>通过</Option>
                        {/* {progress != undefined ? <Option value={0}>打回</Option> : null} */}
                        <Option value={'rejected'}>不通过</Option>
                      </Select>
                      {/* <Radio.Group>
                                    <Radio value={true}>同意</Radio>
                                    <Radio value={false}>不同意</Radio>
                                </Radio.Group> */}
                    </Form.Item>
                    <Form.Item
                      label="审核备注"
                      name="remark"
                      rules={[
                        {
                          required: result == 'rejected',
                          message: '请输入审核备注',
                        },
                      ]}
                    >
                      <TextArea
                        placeholder="(审核不通过的原因说明，字数300字以内)"
                        rows={4}
                        showCount
                        maxLength={300}
                      />
                    </Form.Item>

                    <Row justify={'center'}>
                      <Col span={12}>
                        <Button
                          loading={submitLoading}
                          type="primary"
                          size="large"
                          block
                          htmlType="submit"
                          onClick={onSubmit}
                        >
                          提交
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </Col>
            </Row>
          </Card>
        </PageContainer>
      </>
    </>
  );
};
export default AuditDetail;
