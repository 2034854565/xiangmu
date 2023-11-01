import ImportExcel from '@/components/importExcel';
import { PerfDataItem } from '@/pages/fan/data';
import { DoubleRightOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  message,
  Modal,
  Radio,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ExportJsonExcel from 'js-export-excel';
import moment from 'moment';
import PerformanceGraph from '@/pages/charts/performanceGraph';
import styles from '../../style.less';
import { perfTitle, perfDataIndex, excelTableColumns } from './data.d';
import EditForm from '../editForm';
import ProForm, { ProFormDigit, ProFormInstance } from '@ant-design/pro-form';
import { ProCard } from '@ant-design/pro-components';
import {
  CurrentToStandardStateAtmosphericPressureBydensity,
  CurrentToStandardStatePowerBydensity,
  fixNumFunc,
  getCurrentDensity,
} from '@/pages/fan/components/utils';
import { queryFanPerfOriginData } from '@/pages/fan/selection/service';
import ExportExcel from '@/components/ExportExcel';
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 18,
  },
};
const PerfDataForm: React.FC<{
  setKey: Function;
  standardStatusData: any;
  setStandardStatusData: Function;
  id: string;
  type: string;
  status: string;
  onSubmit: Function;
  saveLoading: boolean;
  submitLoading: boolean;
}> = (props) => {
  const {
    setKey,
    standardStatusData,
    setStandardStatusData,
    id,
    type,
    status,
    onSubmit,
    saveLoading,
    submitLoading,
  } = props;
  console.log('PerfDataForm type');
  console.log(type);
  // const [submitLoading, setSubmitLoading] = useState<boolean>(true);
  // const [toExcelData2, setToExcelData2] = useState<{}>();
  const [echartsInstance, setEchartsInstance] = useState<echarts.ECharts>();

  const actionRef = useRef<ActionType>();
  const standardActionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [standardForm] = Form.useForm();
  const [experimentalStatusform] = Form.useForm();
  const experimentalStatusFormRef = useRef<ProFormInstance>();
  const [experimentParams, setExperimentParams] = useState<{
    altitude: number;
    temperature: number;
    humidity: number;
    density: number;
  }>({
    altitude: 0,
    temperature: 20,
    humidity: 50,
    density: 1.205,
  });
  // 性能曲线数据上传excel数据 excelData2
  const [excelData2, setExcelData2] = useState<PerfDataItem[]>([]);
  // 性能曲线数据上传excel数据后再导出、保存到后端 standardStatusData
  // const [standardStatusData, setStandardStatusData] = useState<PerfDataItem[]>([]);
  const [radioControl, setRadioControl] = useState<boolean[]>([true, false]);
  const [standardMode, setStandardMode] = useState<boolean>(true);

  //-------------性能曲线信息-------------------------
  const getExcelData2 = (data: PerfDataItem[]) => {
    // console.log('set excelData2');
    // // console.log(excelData2);
    // console.log(data);
    let i = 1;
    let verifyFlag = true;
    // console.log('data');
    // console.log(data);
    if (data == undefined) {
      return [];
    }

    data.forEach((item) => {
      item.flowRate = fixNumFunc(item.flowRate, 3);
      item.fullPressure = fixNumFunc(item.fullPressure, 1);
      item.staticPressure = fixNumFunc(item.staticPressure, 1);
      item.fanEff = fixNumFunc(item.fanEff, 1);
      item.staticPressureEff = fixNumFunc(item.staticPressureEff, 1);
      item.shaftPower = fixNumFunc(item.shaftPower, 3);
      item.motorSpeed = fixNumFunc(item.motorSpeed, 0);
      item.impellerDiameter = fixNumFunc(item.impellerDiameter, 0);
      let j = 1;
      [
        'flowRate',
        'fullPressure',
        'staticPressure',
        'fanEff',
        'staticPressureEff',
        'shaftPower',
        'motorSpeed',
        'impellerDiameter',
        'noise',
      ].map((key) => {
        if (isNaN(Number(item[key]))) {
          if (key == 'noise' && item[key] == undefined) {
          } else {
            message.warn('第' + i + '行数据第' + j + '列数据' + '错误！请检查！');
            item[key] = undefined;
            verifyFlag = false;
          }
        } else {
          item[key] = Number(item[key]);
        }
        j++;
        // item[key] = isNaN(Number(item[key])) ? undefined : Number(item[key]);
      });
      i++;
    });
    console.log('data');
    console.log(data);

    setExcelData2(data);
    return data;
  };
  useEffect(() => {
    if (
      (id != undefined && type != 'copy') ||
      (id != undefined && type == 'copy' && status == 'rejected')
    ) {
      console.log('queryFanPerfOriginData');

      queryFanPerfOriginData(id).then((res) => {
        if (res) {
          setStandardStatusData(res.data);
          setExcelData2(res.data);
        }
      });
    }
  }, []);
  useEffect(() => {
    if (excelData2 == undefined || excelData2.length == 0) {
      setStandardStatusData(excelData2);
    } else {
      //-------实验数据换算----------
      let tempData: any[] = [];
      for (let i = 0; i < excelData2.length; i++) {
        let temp: PerfDataItem = { ...excelData2[i] };
        let density = 0;
        if (radioControl[0]) {
          density = getCurrentDensity(experimentParams.altitude, experimentParams.temperature);
        } else density = experimentParams.density;
        if (temp.fullPressure != undefined) {
          // console.log('temp.fullPressure');
          // console.log(temp.fullPressure);
          // console.log('experimentParams.altitude');
          // console.log(experimentParams.altitude);

          temp.fullPressure = CurrentToStandardStateAtmosphericPressureBydensity(
            temp.fullPressure,
            density,
            1,
          );

          // console.log('temp.fullPressure1');
          // console.log(temp.fullPressure);
        }
        if (temp.staticPressure != undefined) {
          temp.staticPressure = CurrentToStandardStateAtmosphericPressureBydensity(
            temp.staticPressure,
            density,
            1,
          );
        }
        if (temp.shaftPower != undefined) {
          temp.shaftPower = CurrentToStandardStatePowerBydensity(temp.shaftPower, density, 3);
        }

        tempData[i] = temp;
      }
      // console.log('setStandardStatusData');
      // console.log(tempData);
      setStandardStatusData(tempData);
    }
  }, [excelData2, experimentParams]);
  const createPeformanceData = () => {
    console.log('excelData2');
    console.log(excelData2);
    let tempData = [];
    excelData2.map((data) => tempData.push(data));
    tempData.push({
      key: (Math.random() * 1000000).toFixed(0),
      // flowRate: null,
      // fullPressure: 0,
      // staticPressure: 0,
      // fanEff: 0,
      // staticPressureEff: 0,
      // shaftPower: 0,
      // motorSpeed: 0,
      // impellerDiameter: 0,
      // specificSpeed: 0,
      // u: 0,
      // flowCoefficient: 0,
      // pressureCoefficient: 0,
    });
    // console.log('tempData');
    // console.log(tempData);
    setExcelData2(tempData);

    // console.log('excelData2');
    // console.log(excelData2);
    actionRef.current?.reload();
  };

  const handleExportCurrentExcel = (
    name: string,
    title: string[],
    index: string[],
    ExcelData: any[],
  ) => {
    //ExcelData为后端返回的data数组
    // let sheetFilter = ["ticketNo", "ticketAmount", "ticketDate", "ticketExpireDate", "ticketStatusCd","drawerName","drawerAccountNo", "drawerBank", "payeeName", "payeeAccountNo", "payeeBank","acceptorName", "acceptorAccountNo","acceptorBank"];
    let sheetFilter = index;
    let option = {};
    option.fileName = name;
    option.datas = [
      {
        sheetData: ExcelData,
        sheetName: name,
        sheetFilter: sheetFilter,
        sheetHeader: title,
        // columnWidths: [10,10,10,10,10,10,10,10,10,10,10,10,10,10]
      },
    ];

    var toExcel = new ExportJsonExcel(option); //new
    // console.log('option');
    // console.log(option);
    // setToExcelData2(option);
    toExcel.saveExcel(); //保存
  };

  const columns: ProColumns<PerfDataItem>[] = [];
  let title = [];
  for (let key in excelTableColumns) {
    title.push(key.toString());
  }
  // console.log(title);
  for (let i = 0; i < title.length; i++) {
    if (['fullPressure', 'staticPressure', 'shaftPower'].includes(excelTableColumns[title[i]])) {
      columns.push({
        title: title[i],
        dataIndex: excelTableColumns[title[i]],
        valueType: 'digit',
        width: 80,
        render: (val: any, record: any) => {
          return <Typography.Text type="success">{val}</Typography.Text>;
        },
      });
    } else {
      columns.push({
        title: title[i],
        dataIndex: excelTableColumns[title[i]],
        valueType: 'digit',
        width: 80,
      });
    }
  }
  const [previewPerfGraph, setPreviewPerfGraph] = useState<boolean>(false);
  const getPerfData = () => {
    let data = standardMode ? standardStatusData : excelData2;
    // 变换数据结构
    // console.log('44444444444444444444');
    // console.log('getPerfData');
    let result = {};
    for (let key in data[0]) {
      result[key] = [];
    }
    // console.log(result);
    delete result['key'];
    for (let key in result) {
      for (let i = 0; i < data.length; i++) {
        result[key].push(data[i][key]);
      }
    }
    // console.log('result');
    // console.log(result);
    // setPerfData(result);
    return result;
  };
  return (
    <>
      <ProCard title={'实验环境： '} bordered={false} tooltip="海拔+温度或密度二选一" collapsible>
        <ProForm
          layout="horizontal"
          {...formItemLayout}
          form={experimentalStatusform}
          formRef={experimentalStatusFormRef}
          submitter={false}
          // initialValues={initialValues}
          // onFinish={onFinish}
          onValuesChange={(changeValues, experimentParams) => {
            // console.log(changeValues);
            setExperimentParams({ ...experimentParams, ...changeValues });
            // console.log('experimentParams');
            // console.log(experimentParams);
            console.log('1111111111');
          }}
        >
          {/* <Radio.Group onChange={onRadioChange}> */}
          <Row align={'bottom'} gutter={16} wrap={false} justify="start">
            <Col span={14}>
              <Row>
                <Col lg={9} md={12} sm={24}>
                  <ProFormDigit
                    name="altitude"
                    label={
                      <Radio
                        checked={radioControl[0]}
                        value={1}
                        onChange={(e) => {
                          // console.log('Radio1 e.target.checked');
                          // console.log(e.target.checked);

                          const checked = e.target.checked;
                          if (checked) {
                            // experimentalStatusform.validateFields(['altitude', 'temperature']);
                            experimentalStatusform.validateFields();
                            setRadioControl([checked, false]);
                            // console.log('experimentParams.density == undefined');
                            // console.log(experimentParams.density == undefined);
                            if (experimentParams.density == undefined) {
                              experimentalStatusFormRef.current?.setFieldValue('density', 1.205);
                              setExperimentParams({ ...experimentParams, density: 1.205 });
                            }
                          }

                          if (!checked && experimentParams.altitude == null) {
                            setExperimentParams({ ...experimentParams, altitude: 0 });
                          }
                        }}
                      >
                        海拔
                      </Radio>
                    }
                    colProps={{ span: 12 }}
                    placeholder="m"
                    initialValue={experimentParams.altitude}
                    disabled={radioControl[1]}
                    addonAfter="m"
                    rules={[{ required: radioControl[0], message: '请填写海拔!' }]}
                  />
                </Col>
                <Col lg={9} md={12} sm={24}>
                  <ProFormDigit
                    name="temperature"
                    label="温度"
                    colProps={{ span: 12 }}
                    initialValue={experimentParams.temperature}
                    disabled={radioControl[1]}
                    placeholder="℃"
                    addonAfter="℃"
                    rules={[{ required: radioControl[0], message: '请填写温度!' }]}
                  />
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Row wrap={false} justify="end" align={'bottom'} style={{ paddingTop: 4 }}>
                    <Col>密度：</Col>
                    <Col>
                      {experimentParams.altitude != undefined &&
                      experimentParams.temperature != undefined
                        ? getCurrentDensity(
                            experimentParams.altitude,
                            experimentParams.temperature,
                            3,
                          )
                        : null}
                    </Col>
                    <Col>kg/m³</Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                {/* <Col lg={12} md={12} sm={24}>
                  <ProFormDigit
                    name="humidity"
                    label="湿度"
                    colProps={{ span: 12 }}
                    initialValue={50}
                    placeholder="%"
                    addonAfter="%"
                    //rules={[{ required: true, message: '请填写效率!' }]}
                  />
                </Col> */}
                <Col lg={8} md={12} sm={24}>
                  <ProFormDigit
                    name="density"
                    label={
                      <Radio
                        checked={radioControl[1]}
                        onChange={(e) => {
                          // console.log('Radio2 e.target.checked');
                          // console.log(e.target.checked);
                          const checked = e.target.checked;
                          setRadioControl([false, checked]);
                          if (checked == true) {
                            experimentalStatusform.validateFields();

                            if (experimentParams.altitude == undefined) {
                              experimentalStatusFormRef.current?.setFieldValue('altitude', 0);
                            }
                            if (experimentParams.temperature == undefined) {
                              experimentalStatusFormRef.current?.setFieldValue('temperature', 20);
                            }
                            setExperimentParams({
                              ...experimentParams,
                              altitude: 0,
                              temperature: 20,
                            });
                          }
                        }}
                      >
                        密度
                      </Radio>
                    }
                    colProps={{ span: 12 }}
                    placeholder="kg/m³"
                    addonAfter="kg/m³"
                    // initialValue={1.205}
                    disabled={radioControl[0]}
                    initialValue={experimentParams.density}
                    rules={[{ required: radioControl[1], message: '请填写密度!' }]}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={2}>
              {/* <Row justify={'center'}>
                <Col>
                  <Button type="primary" style={{ marginLeft: 3 }} onClick={() => {}}>
                    <DoubleRightOutlined />
                    换算
                    <DoubleRightOutlined />
                  </Button>
                </Col>
              </Row> */}
            </Col>
            <Col span={8}>
              <Descriptions
                title="标准条件"
                labelStyle={{ justifyContent: 'flex-end', minWidth: 100 }}
                contentStyle={{ justifyContent: 'flex-start', minWidth: 100 }}
                column={2}
                bordered
                size="small"
              >
                <Descriptions.Item label="海拔 ">
                  {/* {experimentalStatusFormRef.current?.getFieldValue('altitude')} */}
                  0m
                  {/* {experimentParams.altitude} */}
                </Descriptions.Item>
                <Descriptions.Item label="温度 ">20℃</Descriptions.Item>
                <Descriptions.Item label="湿度">50%</Descriptions.Item>
                <Descriptions.Item label="密度">1.2kg/m³</Descriptions.Item>
                {/* <Descriptions.Item label="大气压力 ">101.325kPa</Descriptions.Item> */}
              </Descriptions>
            </Col>
          </Row>
          {/* </Radio.Group> */}
        </ProForm>
      </ProCard>

      {/* <Col>
          <Button key="primary" type="primary" onClick={() => createPeformanceData()}>
            <PlusOutlined />
            新建
          </Button>
        </Col> 
        */}
      {/* excelData:
      {excelData2.length > 0 ? excelData2[0].flowRate : null} */}
      {/* <Row>
        <Col span={16}> */}
      {/* <EditForm
        title={perfTitle}
        dataIndex={perfDataIndex}
        originData={excelData2}
        setExcelData2={setExcelData2}
        actionRef={actionRef}
      /> */}
      <ProCard
        title={'实验数据：'}
        bordered={false}
        // collapsible
        extra={
          <>
            <Space>
              <ImportExcel
                text="从excel导入"
                // title={perfTitle}
                // dataIndex={perfDataIndex}
                excelTableColumns={excelTableColumns}
                isPreview={type ? true : false}
                getExcelData={getExcelData2}
                // sheetNum={type == 'copy' ? undefined : 1}
                sheetNum={type == undefined ? 1 : undefined}
                // sheetNum={  undefined}
              />
              <Button
                type="primary"
                onClick={() => {
                  actionRef.current?.addEditRecord?.({
                    // id: (Math.random() * 1000000).toFixed(0),
                    key: (Math.random() * 1000000).toFixed(0),
                    title: '新的一行',
                  });
                }}
                icon={<PlusOutlined />}
              >
                新建
              </Button>
              <Button
                key="rest"
                onClick={() => {
                  form.resetFields();
                  setExcelData2([]);
                  setStandardStatusData(undefined);
                }}
              >
                清空表格
              </Button>
            </Space>
          </>
        }
      >
        <EditForm
          title={perfTitle}
          dataIndex={perfDataIndex}
          excelTableColumns={excelTableColumns}
          defaultData={excelData2}
          actionRef={actionRef}
          form={form}
          setExcelData2={setExcelData2}
          calculate={false}
        />
      </ProCard>
      {/* <Divider
        children={<Typography.Title level={5}>标准状态下：</Typography.Title>}
        orientation="left"
      /> */}
      {/* <Divider /> */}
      {/* <Row justify={'space-around'} gutter={16}>
        <Col>
          <Typography.Title level={5}>标准状态下：</Typography.Title>
        </Col>
        <Col span={16}></Col>
        <Col span={1}>
          <Button key="primary" type="primary" onClick={() => setPreviewPerfGraph(true)}>
            预览性能曲线
          </Button>
        </Col>
        <Col span={2}>
          <Button
            key="primary"
            // type="primary"
            onClick={() =>
              handleExportCurrentExcel(
                moment().format('HH:mm:ss').toString(),
                perfTitle,
                perfDataIndex,
                excelData2,
              )
            }
          >
            导出当前数据
          </Button>
        </Col>
      </Row> */}
      {standardStatusData == undefined || standardStatusData.length == 0 ? null : (
        <ProCard
          title={'换算到标准状态下：'}
          bordered={false}
          // collapsible
          extra={
            <Space>
              <Button type="primary" onClick={() => setPreviewPerfGraph(true)}>
                预览性能曲线
              </Button>
              {/* <Button
                // type="primary"
                onClick={() =>
                  handleExportCurrentExcel(
                    moment().format('HH:mm:ss').toString()  ,
                    perfTitle,
                    perfDataIndex,
                    standardStatusData,
                  )
                }
              >
                导出当前数据
              </Button> */}
              <ExportExcel
                text="导出当前数据"
                execlTitle={'标准状态实验数据' + moment().format('HH:mm:ss').toString()}
                selectedUrl="/api/tableData.json"
                // icon="download"
                data={{
                  total: standardStatusData.length,
                  columns: columns,
                  rows: standardStatusData,
                }}
              />
            </Space>
          }
        >
          <ProTable
            search={false}
            options={false}
            pagination={false}
            columns={columns}
            rowKey={'key'}
            actionRef={standardActionRef}
            dataSource={standardStatusData}
          ></ProTable>
        </ProCard>
      )}
      {!previewPerfGraph ? null : (
        <>
          <PerformanceGraph
            // perfData={perfData}
            getPerfData={getPerfData}
            standardOrExperiment={{ standard: true, setStandardMode: setStandardMode }}
            echartsInstance={echartsInstance}
            setEchartsInstance={setEchartsInstance}
          />
        </>
      )}
      <div className={styles.centerButton}>
        <Row justify={'center'} gutter={16}>
          <Col>
            <Button
              style={{ marginRight: 3 }}
              onClick={() => {
                setKey('1');
              }}
            >
              上一步
            </Button>
          </Col>

          <Col>
            <Button
              type="primary"
              style={{ marginLeft: 3 }}
              onClick={() => {
                if (excelData2 == undefined || excelData2.length == 0) {
                  message.warn('请填入数据！');
                } else {
                  let i = 1;
                  let verifyFlag = true;
                  excelData2.forEach((item) => {
                    let j = 1;
                    [
                      'flowRate',
                      'fullPressure',
                      'staticPressure',
                      'fanEff',
                      'staticPressureEff',
                      'shaftPower',
                      'motorSpeed',
                      'impellerDiameter',
                      'noise',
                    ].map((key) => {
                      if (isNaN(Number(item[key]))) {
                        if (key == 'noise' && item[key] == undefined) {
                        } else {
                          message.warn('第' + i + '行数据第' + j + '列数据' + '错误！请检查！');
                          verifyFlag = false;
                        }
                      } else {
                        item[key] = Number(item[key]);
                      }
                      j++;
                      // item[key] = isNaN(Number(item[key])) ? undefined : Number(item[key]);
                    });
                    i++;
                  });
                  if (verifyFlag) {
                    setKey('3');
                  }
                }
              }}
            >
              下一步
            </Button>
          </Col>
          {(id && !['draft', 'rejected'].includes(status)) ||
          type == 'copy' ||
          status == 'pass' ||
          (type == undefined && !['draft', 'rejected'].includes(status)) ? null : (
            // {id && status == 'rejected' ? (
            <Button
              type="primary"
              style={{ marginLeft: 3 }}
              onClick={(e) => {
                // e.stopPropagation();
                onSubmit('draft');
              }}
              loading={saveLoading}
            >
              保存
            </Button>
          )}
          {id ? (
            type != undefined ? null : (
              <Col>
                <Button
                  type="primary"
                  style={{ marginLeft: 3 }}
                  onClick={(e) => {
                    onSubmit();
                  }}
                  loading={submitLoading}
                >
                  提交
                </Button>
              </Col>
            )
          ) : null}
        </Row>
      </div>
    </>
  );
};
export default PerfDataForm;
