import {
  Button,
  Row,
  Col,
  Typography,
  Card,
  Select,
  InputNumber,
  Divider,
  Form,
  message,
  Slider,
  Radio,
  Descriptions,
  Tooltip,
} from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { history } from 'umi';
import { RollbackOutlined } from '@ant-design/icons';
import { FanTableItem } from '../data.d';
import { CalculationItem } from './data';
import * as echarts from 'echarts';
import ecStat from 'echarts-stat';
import { queryFanData, queryFanPerfData } from '../../selection/service';
import { fixNumFunc, getCp, getCv, getSpecificSpeed } from '../../components/utils';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import PerformanceGraph from '@/pages/charts/performanceGraph';
echarts.registerTransform(ecStat.transform.regression);
import { useLocation } from 'react-router-dom';
const formItemLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
};
const { Title } = Typography;
import styles from './../style.less';
import { excelTableColumns } from '../../create/components/PerfDataForm/data.d';
import { PageContainer } from '@ant-design/pro-layout';
import { saveUserAction } from '@/services/ant-design-pro/api';
import { PerfDataItem } from '../../data';

const FanSimilarDesignDetail: React.FC<{}> = (props) => {
  // console.log('FanDetail props');
  // console.log(props);
  const { activeKey } = props.match.params;
  const location = useLocation(); //获取跳转页面携带的值
  console.log('location.state');
  console.log(location.state);

  let model: string;
  let id: string;
  if (location.state == undefined) {
    // history.push('/fan/2');
    window.location.replace('/fan/' + activeKey);
  } else {
    id = location.state.id;
    model = location.state.model;
  }
  // const state = location.state;
  const [state, setState] = useState<{
    id: string;
    model: string;
    figNum: string;
    version: string;
    impellerDiameterMedian: number;
    impellerDiameterRange: [];
    originMotorSpeed: number;
    sortMotorSpeed: number;
    flowRate: number;
    pressureRange: [];
    pressureField: string;
    type: string;
    limitField: string;
    inputRequire: {};
    expect: {};
  }>(
    location.state
      ? location.state
      : {
          id: '',
          model: '',
          type: '',
          impellerDiameterMedian: 0,
          impellerDiameterRange: [0, 0],
          flowRate: 0,
          pressureRange: [0, 0],
          limitField: 'unLimited',
          inputRequire: {},
        },
  );

  console.log('state');
  console.log(state);
  const [perfData, setPerfData] = useState<{}>({});

  const [perfSimilarData, setPerfSimilarData] = useState<{}>({});
  const [perfSimilarTableData, setPerfSimilarTableData] = useState<any>([]);
  const getPerfData = () => {
    return perfSimilarData;
  };
  useEffect(() => {
    if (id) {
      queryFanData(id)
        .then((res) => {
          console.log('queryFanData res.data');
          console.log(res.data);
          setFanInfo(res.data);

          console.log('state');
          console.log(state);
          const impellerDiameter = state
            ? state.impellerDiameterMedian != undefined
              ? state.impellerDiameterMedian
              : res.data.impellerDiameter
            : 0;
          console.log('!!!!!!!!!useEffect impellerDiameter');
          console.log(impellerDiameter);
          setImpellerDiameter(impellerDiameter);

          // console.log(123123123123123);
          // const impellerDiameter = state.impellerDiameterMedian
          //   ? state.impellerDiameterMedian
          //   : res.data.impellerDiameter;
          // const motorSpeed = state.originMotorSpeed ? state.originMotorSpeed : res.data.motorSpeed;
          // setImpellerDiameter(impellerDiameter);
          // setMotorSpeed(motorSpeed);
          // computeSimilarDesign(type, impellerDiameter, motorSpeed, res.data);
          // setMotorSpeed(res.data.motorSpeed);
        })
        .catch((error) => {
          console.log('error');
          console.log(error);
          message.error('请求失败！');
          return;
        });
      queryFanPerfData(id).then((res) => {
        console.log('queryFansPerfData res.data');
        console.log(res.data);
        setPerfData(res.data);
        setPerfSimilarData(res.data);
      });
      if (activeKey == 1) {
        // 从选型跳转到相似设计页面
        let expect = state.expect;
        setExpect(expect);
      } else {
        let expect = sessionStorage.getItem('expect');
        if (expect) {
          // console.log('remove');
          setExpect(JSON.parse(expect));
          // sessionStorage.removeItem('expect');
        }
        console.log('expect');
        console.log(expect);
      }
    }
  }, []);
  const actionRef = useRef<ActionType>();

  const [fanInfo, setFanInfo] = useState<FanTableItem>({});
  const [expect, setExpect] = useState<CalculationItem>();
  // const [type, setType] = useState<string>('10');
  const [type, setType] = useState<string>(state ? state?.type : '');
  // const [impellerDiameter, setImpellerDiameter] = useState<number>(123);
  // const [impellerDiameter, setImpellerDiameter] = useState<number>(fanInfo.impellerDiameter);
  console.log('----------------');
  console.log('state.impellerDiameterMedian');
  console.log(state.impellerDiameterMedian);
  console.log('fanInfo.impellerDiameter');
  console.log(fanInfo.impellerDiameter);
  console.log(
    state
      ? state.impellerDiameterMedian
        ? state.impellerDiameterMedian
        : fanInfo.impellerDiameter
      : 0,
  );

  console.log('----------------');

  const [impellerDiameter, setImpellerDiameter] = useState<number>(
    state
      ? state.impellerDiameterMedian != undefined
        ? state.impellerDiameterMedian
        : fanInfo.impellerDiameter
      : 0,
  );

  console.log(' impellerDiameter');
  console.log(impellerDiameter);
  const [motorSpeed, setMotorSpeed] = useState<number>(
    state && state.sortMotorSpeed
      ? state.sortMotorSpeed
      : state.originMotorSpeed
      ? state.originMotorSpeed
      : 1,
  );
  // const [motorSpeed, setMotorSpeed] = useState<number>(state.sortMotorSpeed);
  const [similar, setSimilar] = useState<{
    flowRate: number;
    fullPressure: number;
    staticPressure: number;
    shaftPower: number;
    motorSpeed: number;
    impellerDiameter: number;
  }>();
  const [curveFig, setCurveFig] = useState(null);
  const [echartsInstance, setEchartsInstance] = useState<echarts.ECharts>();

  const handleChangeType = (value: any) => {
    setType(value);
  };
  const [form] = Form.useForm();

  const [similarDesignFactors, setSimilarDesignFactors] = useState<{
    impellerDiameter: number;
    motorSpeed: number;
  }>({
    impellerDiameter: 1,
    motorSpeed: 1,
  });

  const computeSimilarDesign = (
    type: string,
    impellerDiameter: number,
    motorSpeed: number,
    fanInfo: any,
  ) => {
    console.log('@@@@@@@computeSimilarDesign');
    console.log('impellerDiameter');
    console.log(impellerDiameter);
    console.log(' fanInfo.impellerDiameter');
    console.log(fanInfo.impellerDiameter);
    console.log('motorSpeed');
    console.log(motorSpeed);
    console.log(' state.originMotorSpeed');
    console.log(state.originMotorSpeed);
    let sdfImp = similarDesignFactors.impellerDiameter;
    let sdfMot = similarDesignFactors.motorSpeed;
    let similar: any = {};

    // console.log('state');
    // console.log(state);
    // console.log('impellerDiameter');
    // console.log(impellerDiameter);
    // console.log('motorSpeed');
    // console.log(motorSpeed);
    // start计算相似设计系数
    if (type[0] == '1') {
      sdfImp = impellerDiameter / fanInfo.impellerDiameter;
    }
    if (type[1] == '1') {
      sdfMot = motorSpeed / state.originMotorSpeed;
    }
    // end计算相似设计系数

    //====perfData处理=====
    // console.log('perfData处理====>perfSimilarData');
    // console.log('perfData');
    // console.log(perfData);
    console.log('sdfImp');
    console.log(sdfImp);
    console.log('sdfMot');
    console.log(sdfMot);
    if (Object.keys(perfData).length != 0) {
      const data = perfData;
      let temp = {};
      for (let key in data) {
        temp[key] = [];
        for (let i = 0; i < data[key].length; i++) {
          temp[key].push(data[key][i]);
        }
      }
      console.log('impellerDiameter');
      console.log(impellerDiameter);
      if (type[0] == '1') {
        if (impellerDiameter != null) {
          const imp = sdfImp;
          for (let i = 0; i < temp['flowRate'].length; i++) {
            temp['flowRate'][i] = temp['flowRate'][i] * Math.pow(imp, 3);
            temp['fullPressure'][i] = temp['fullPressure'][i] * Math.pow(imp, 2);
            temp['staticPressure'][i] = temp['staticPressure'][i] * Math.pow(imp, 2);
            temp['shaftPower'][i] = temp['shaftPower'][i] * Math.pow(imp, 5);
            temp['impellerDiameter'][i] = impellerDiameter;
            // temp['flowRate'][i] = temp['flowRate'][i] * Math.pow(imp, 3);
            // temp['fullPressure'][i] = temp['fullPressure'][i] * Math.pow(imp, 2);
            // temp['shaftPower'][i] = temp['shaftPower'][i] * Math.pow(imp, 5);
          }
        } else {
          // console.log('复原');
          // setPerfSimilarData(perfData);
        }
      }
      if (type[1] == '1') {
        if (motorSpeed != null) {
          console.log("type[1] == '1'");

          for (let i = 0; i < temp['flowRate'].length; i++) {
            temp['flowRate'][i] = temp['flowRate'][i] * Math.pow(sdfMot, 1);
            temp['fullPressure'][i] = temp['fullPressure'][i] * Math.pow(sdfMot, 2);
            temp['staticPressure'][i] = temp['staticPressure'][i] * Math.pow(sdfMot, 2);
            temp['shaftPower'][i] = temp['shaftPower'][i] * Math.pow(sdfMot, 3);
            temp['motorSpeed'][i] = motorSpeed;
          }
        } else {
          // console.log('复原');
        }
      }
      // 比转速 流量系数 压力系数

      for (let i = 0; i < temp['flowRate'].length; i++) {
        temp['specificSpeed'][i] = getSpecificSpeed(
          temp['motorSpeed'][i],
          temp['flowRate'][i],
          temp['fullPressure'][i],
          3,
        );
        (temp['flowCoefficient'][i] = getCv(
          temp['flowRate'][i],
          temp['motorSpeed'][i],
          temp['impellerDiameter'][i],
          3,
        )),
          (temp['pressureCoefficient'][i] = getCp(
            temp['fullPressure'][i],
            temp['motorSpeed'][i],
            temp['impellerDiameter'][i],
            3,
          ));
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
      //====end perfData处理=====
      // similarTableActionRef.current?.reload();
      // console.log('perfData');
      // console.log(perfData);
      // console.log('perfTableData');
      // console.log(perfTableData);

      //左侧参数表计算 相似设计列
      // console.log('state.limitField');
      // console.log(state.limitField);
      // console.log('state.impellerDiameterMedian');
      // console.log(state.impellerDiameterMedian);
      if (state.limitField == 'flowRate') {
        similar.motorSpeed = motorSpeed;
        similar.impellerDiameter = state.impellerDiameterMedian;
        similar.flowRate = fixNumFunc(state.flowRate, 3);
        console.log('temp');
        console.log(temp);
        const fieldList = ['fullPressure', 'staticPressure', 'shaftPower'];
        for (let i in fieldList) {
          const field = fieldList[i];
          let tempData = [];
          for (let i = 0; i < temp['flowRate'].length; i++) {
            tempData.push([temp['flowRate'][i], temp[field][i]]);
          }
          console.log('tempData');
          console.log(tempData);

          var myRegression = ecStat.regression('polynomial', tempData, 2);
          const an = myRegression.parameter;
          const fixFlag = ['fullPressure', 'staticPressure'].includes(field) ? 1 : 3;

          similar[field] = fixNumFunc(
            an[2] * Math.pow(similar.flowRate, 2) + an[1] * similar.flowRate + an[0],
            fixFlag,
          );
          console.log('similar[field]');
          console.log(similar[field]);
          console.log('similar');
          console.log(similar);
        }
        similar.specificSpeed = getSpecificSpeed(
          similar.motorSpeed,
          similar.flowRate,
          similar.fullPressure,
          1,
        );
        similar.flowCoefficient = getCv(
          similar.flowRate,
          similar.motorSpeed,
          similar.impellerDiameter,
          3,
        );
        similar.pressureCoefficient = getCp(
          similar.fullPressure,
          similar.motorSpeed,
          similar.impellerDiameter,
          3,
        );
        let similarTarget = { target: true, ...similar };
        console.log('similarTarget ');
        console.log(similarTarget);
        perfTableData.push(similarTarget);
        perfTableData.sort(function (a, b) {
          return a.flowRate - b.flowRate;
        });

        // similar.shaftPower = similar.flowRate* similar.fullPressure
        // setSimilar(similar);
      } else if (state.limitField == 'unLimited') {
        if (activeKey == '1') {
          similar.flowRate = state.flowRate;
          similar.fullPressure = state.fullPressure;
          similar.staticPressure = state.staticPressure;
          similar.shaftPower = state.shaftPower;
        } else {
          similar.flowRate = fanInfo.flowRate;
          similar.fullPressure = fanInfo.fullPressure;
          similar.staticPressure = fanInfo.staticPressure;
          similar.shaftPower = fanInfo.shaftPower;
        }

        const pressure = state.pressureField;

        if (type[0] == '1') {
          console.log('impellerDiameter');
          console.log(impellerDiameter);

          sdfImp = impellerDiameter / fanInfo.impellerDiameter;

          similar.motorSpeed = motorSpeed;
          similar.impellerDiameter = impellerDiameter;

          similar['fullPressure'] = similar['fullPressure'] * Math.pow(sdfImp, 2);
          similar['staticPressure'] = similar['staticPressure'] * Math.pow(sdfImp, 2);
          similar.flowRate = similar.flowRate * Math.pow(sdfImp, 3);
          similar.shaftPower = similar.shaftPower * Math.pow(sdfImp, 5);
        }
        if (type[1] == '1') {
          sdfMot = motorSpeed / state.originMotorSpeed;

          similar.impellerDiameter = impellerDiameter;
          similar.motorSpeed = motorSpeed;

          similar['fullPressure'] = similar['fullPressure'] * Math.pow(sdfMot, 2);
          similar['staticPressure'] = similar['staticPressure'] * Math.pow(sdfMot, 2);
          similar.flowRate = similar.flowRate * Math.pow(sdfMot, 1);
          similar.shaftPower = similar.shaftPower * Math.pow(sdfMot, 3);
        }
        similar.specificSpeed = getSpecificSpeed(
          similar.motorSpeed,
          similar.flowRate,
          similar.fullPressure,
          1,
        );
        similar.flowCoefficient = getCv(
          similar.flowRate,
          similar.motorSpeed,
          similar.impellerDiameter,
          3,
        );
        similar.pressureCoefficient = getCp(
          similar.fullPressure,
          similar.motorSpeed,
          similar.impellerDiameter,
          3,
        );
        similar['fullPressure'] = fixNumFunc(similar['fullPressure'], 1);
        similar['staticPressure'] = fixNumFunc(similar['staticPressure'], 1);
        similar['shaftPower'] = fixNumFunc(similar['shaftPower'], 1);
        let similarTarget = { target: true, ...similar };
        console.log('similarTarget ');
        console.log(similarTarget);
        perfTableData.push(similarTarget);
        perfTableData.sort(function (a, b) {
          return a.flowRate - b.flowRate;
        });
      }
      for (let key in similar) {
        if (key == 'flowRate') {
          similar[key] = fixNumFunc(similar[key], 3);
        } else {
          similar[key] = fixNumFunc(similar[key], 2);
        }
      }
      console.log('similarDesignFactors');

      console.log({ impellerDiameter: sdfImp, motorSpeed: sdfMot });

      setSimilarDesignFactors({ impellerDiameter: sdfImp, motorSpeed: sdfMot });
      setSimilar(similar);
      setPerfSimilarData(temp);
      setPerfSimilarTableData(perfTableData);
    }
  };

  const onChangeNumber = (value: any) => {
    console.log('相似系数');
    console.log(value);
  };
  useEffect(() => {
    computeSimilarDesign(type, impellerDiameter, motorSpeed, fanInfo);
    // fitCurve(perfData);
  }, [type, impellerDiameter, motorSpeed, perfData, fanInfo]);

  // origin 原型机
  // similar 相似设计数据
  // expect 预期
  //从前一个页面获取
  const tableData = [
    {
      key: '1',
      name: '流量(m³/s)',
      origin: fanInfo?.flowRate,
      similar: similar?.flowRate,
      expect: expect?.flowRate,
      // deviation: deviation?.flowRate,
      // test: perfData['flowRate'] == undefined ? 0 : perfData['flowRate'][0],
    },
    {
      key: '2',
      name: state.pressureField == 'fullPressure' ? '全压(Pa)' : '静压(Pa)',
      origin:
        state.pressureField == 'fullPressure' ? fanInfo?.fullPressure : fanInfo?.staticPressure,
      similar:
        state.pressureField == 'fullPressure' ? similar?.fullPressure : similar?.staticPressure,
      expect: expect?.pressure,
      // test: perfSimilarData['flowRate'] == undefined ? 0 : perfSimilarData['flowRate'][0],

      // deviation: deviation?.fullPressure,
    },
    {
      key: '3',
      name: '轴功率(kW)',
      origin: fanInfo?.shaftPower,
      similar: '/',
      expect: expect?.usefulWork,
      // deviation: deviation?.shaftPower,
    },
    {
      key: '4',
      name: '转速(r/min)',
      // origin: fanInfo?.motorSpeed,
      origin: state.originMotorSpeed,
      similar: similar?.motorSpeed,
      expect: expect?.motorSpeed,
      // deviation: deviation?.motorSpeed,
    },
  ];
  const columns: ProColumns<any>[] = [
    {
      title: '参数',
      dataIndex: 'name',
    },
    {
      title: '原型机',
      dataIndex: 'origin',
    },
    {
      title: '相似设计',
      dataIndex: 'similar',
    },
    {
      title: '设计要求(标态)',
      dataIndex: 'expect',
    },
    {
      title: '设计偏差%',
      dataIndex: 'deviation',
      hideInTable: type == '00' ? true : false,
      render: (_: any, record: any) => {
        let deviation = fixNumFunc(((record.similar - record.expect) / record.expect) * 100, 1);
        // <div color={record.deviation >= 0 ? '0x00ff00' : '0xff0000'}>{record.deviation}</div>
        if (type == '00') return null;
        if (isNaN(deviation)) {
          return '/';
        }
        if (deviation >= 0) {
          return <Typography.Text type={'success'}>{deviation}%</Typography.Text>;
        } else {
          return <Typography.Text type={'warning'}>{deviation}%</Typography.Text>;
        }
      },
    },
    // {
    //   title: 'test',
    //   dataIndex: 'test',
    // },
  ];

  const similarTableActionRef = useRef<ActionType>();

  const similarColumns: ProColumns<PerfDataItem>[] = [];
  let title = [];
  for (let key in excelTableColumns) {
    title.push(key.toString());
  }
  // console.log(title);
  for (let i = 0; i < title.length; i++) {
    if (['motorSpeed'].includes(excelTableColumns[title[i]])) {
      similarColumns.push({
        title: title[i],
        dataIndex: excelTableColumns[title[i]],
        valueType: 'digit',
        width: 80,
        render: (val: any, record: any) => {
          if (record.target) {
            return (
              <Typography.Text strong type="warning">
                {val}
              </Typography.Text>
            );
          } else {
            return <Typography.Text type="success">{val}</Typography.Text>;
          }
        },
      });
      continue;
    }
    if (
      ['specificSpeed', 'u', 'flowCoefficient', 'pressureCoefficient'].includes(
        excelTableColumns[title[i]],
      )
    ) {
      continue;
    }

    if (
      ['flowRate', 'fullPressure', 'staticPressure', 'shaftPower', 'impellerDiameter'].includes(
        excelTableColumns[title[i]],
      )
    ) {
      similarColumns.push({
        title: title[i],
        dataIndex: excelTableColumns[title[i]],
        valueType: 'digit',
        width: 80,
        render: (val: any, record: any) => {
          if (record.target) {
            return (
              <Typography.Text strong type="warning">
                {val}
              </Typography.Text>
            );
          } else {
            return <Typography.Text type="success">{val}</Typography.Text>;
          }
        },
      });
    } else {
      similarColumns.push({
        title: title[i],
        dataIndex: excelTableColumns[title[i]],
        valueType: 'digit',
        width: 80,
      });
    }
  }

  return (
    <>
      <PageContainer ghost header={{ title: '' }}>
        <Card
          className={styles.formItem}
          title={'相似设计过程-' + state.model}
          extra={[
            <Row gutter={16} justify="space-around" align={'middle'}>
              <Col>
                <Button
                  onClick={() => {
                    history.push(`/fan/` + activeKey);
                  }}
                >
                  <RollbackOutlined style={{ color: 'rgb(24, 144, 255)', fontSize: 24 }} />
                </Button>
              </Col>
            </Row>,
          ]}
        >
          {/*  相似设计类型 用动态表单写? */}

          <Row gutter={16} justify={'start'} align="middle">
            <Title level={5}>
              <Col>输入设计参数</Col>
            </Title>
          </Row>
          <ProForm
            id="form"
            {...formItemLayout}
            form={form}
            layout="horizontal"
            submitter={false}
            onValuesChange={async (e) => {
              // console.log('onValuesChange');
              // const values =await form.validateFields()
              // const impellerDiameter=values.impellerDiameter
              // const motorSpeed=values.motorSpeed
              // computeSimilarDesign(type, impellerDiameter, motorSpeed, fanInfo);
              for (let key in e) {
                if (key == 'impellerDiameter') {
                  setImpellerDiameter(e[key]);
                }
                if (key == 'motorSpeed') setMotorSpeed(e[key]);
              }
            }}
          >
            {/* <Row>{perfData['flowRate'] == undefined ? null : perfData['flowRate'][0]}</Row>
          <Row>
            {perfSimilarData['flowRate'] == undefined ? null : perfSimilarData['flowRate'][0]}
          </Row> */}

            <Row gutter={16} align="middle" justify={'start'}>
              {/* justify={'space-around'}  */}

              {/* <Col span={1}></Col> */}
              <Col span={24}>
                {/* space-between */}
                <Row style={{ marginBottom: 8 }} justify={'start'}>
                  <Col span={6}>
                    <Form.Item label="相似设计类型">
                      <Select
                        style={{ width: '100%' }}
                        value={type}
                        onChange={handleChangeType}
                        disabled={state.limitField == 'flowRate'}
                        options={[
                          {
                            value: undefined,
                            // label: '',
                          },
                          {
                            value: '10',
                            label: '叶轮尺寸',
                          },
                          {
                            value: '01',
                            label: '转速',
                          },
                          {
                            value: '11',
                            label: '叶轮尺寸+转速',
                            // disabled: state.limitField == 'flowRate',
                          },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    {state.impellerDiameterRange && type[0] == '1' ? (
                      <Form.Item label="叶轮尺寸范围">
                        {state.impellerDiameterRange[0]}mm~{state.impellerDiameterRange[1]}mm
                      </Form.Item>
                    ) : null}
                  </Col>
                  <Col span={10}>
                    {state.motorSpeedRange ? (
                      <Form.Item label="转速范围">
                        {state.motorSpeedRange[0]}mm~{state.motorSpeedRange[1]}mm
                      </Form.Item>
                    ) : null}
                  </Col>
                </Row>
                {type[0] != '1' ? null : (
                  <>
                    <Row style={{ marginBottom: 8 }} justify={'space-between'}>
                      <Col span={6}>
                        <Form.Item label="原叶轮尺寸">{fanInfo?.impellerDiameter}mm</Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label="调整叶轮尺寸"
                          name={'impellerDiameter'}
                          initialValue={
                            state.impellerDiameterMedian
                              ? state.impellerDiameterMedian
                              : fanInfo?.impellerDiameter
                          }
                        >
                          <InputNumber
                            // style={{ width: '80%' }}
                            min={
                              state.limitField == 'flowRate' ? state.impellerDiameterRange[0] : 0
                            }
                            max={
                              state.limitField == 'flowRate'
                                ? state.impellerDiameterRange[1]
                                : undefined
                            }
                            addonAfter="mm"
                            value={impellerDiameter}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item label="叶轮尺寸相似设计系数" labelCol={{ span: 12 }}>
                          <InputNumber
                            style={{ width: '80%' }}
                            min={0}
                            max={10}
                            // defaultValue={2}
                            disabled
                            value={fixNumFunc(similarDesignFactors.impellerDiameter, 4)}
                            onChange={onChangeNumber}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}
                {type[1] != '1' ? null : (
                  <>
                    <Row style={{ marginBottom: 8 }} justify={'space-between'}>
                      <Col span={6}>
                        <Form.Item label="原转速">
                          {state.originMotorSpeed ? state.originMotorSpeed : fanInfo.motorSpeed}
                          r/min
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label="调整转速"
                          name="motorSpeed"
                          // initialValue={fanInfo?.motorSpeed}
                          initialValue={
                            state.sortMotorSpeed
                              ? state.sortMotorSpeed
                              : state?.originMotorSpeed
                              ? state?.originMotorSpeed
                              : fanInfo.motorSpeed
                          }
                        >
                          <InputNumber
                            // style={{ width: '80%' }}
                            defaultValue={
                              state.sortMotorSpeed ? state.sortMotorSpeed : state?.originMotorSpeed
                            }
                            min={0}
                            addonAfter="r/min"
                            value={motorSpeed}
                            // disabled={state.limitField == 'flowRate' ? true : false}
                            disabled={state?.sortMotorSpeed ? true : false}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item label="转速相似设计系数" labelCol={{ span: 12 }}>
                          <InputNumber
                            style={{ width: '80%' }}
                            min={0}
                            max={10}
                            // defaultValue={2}
                            disabled
                            value={fixNumFunc(similarDesignFactors.motorSpeed, 4)}
                            onChange={onChangeNumber}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}
              </Col>
            </Row>
          </ProForm>

          <Divider style={{ marginTop: 12, marginBottom: 12 }} />

          <Row>
            <Col span={8}>
              <Row>
                <Col span={2}></Col>
                <Col span={22} style={{ paddingTop: 24 }}>
                  <Radio.Group
                    // defaultValue={'flowRate'}
                    disabled
                    value={state.limitField}
                    onChange={(e) => {
                      const value = e.target.value;
                      // console.log('value');
                      // console.log(value);
                      // console.log('impellerDiameter');
                      // console.log(impellerDiameter);
                      if (value) {
                        setState({
                          ...state,
                          limitField: value,
                        });
                        console.log(
                          ' !!!!!!!!!!!!!setImpellerDiameter(state.impellerDiameterMedian);',
                        );
                        console.log(state.impellerDiameterMedian);

                        setImpellerDiameter(state.impellerDiameterMedian);
                      } else if (value == 'unLimited') {
                        setState({
                          ...state,
                          limitField: 'unLimited',
                        });
                        console.log('impellerDiameter');
                        console.log(impellerDiameter);

                        console.log(
                          ' !!!!!!!!!!!!!!!!! setImpellerDiameter(fanInfo.impellerDiameter);',
                        );
                        console.log(fanInfo.impellerDiameter);
                        setImpellerDiameter(fanInfo.impellerDiameter);
                      }
                      // setImpellerDiameter()
                    }}
                  >
                    <Radio value={'flowRate'}>限定流量</Radio>
                    <Radio value={'unLimited'}>不限定流量</Radio>
                    {/* <Radio value={'pressure'}>限定压力</Radio> */}
                  </Radio.Group>
                </Col>
              </Row>

              {/* </Form.Item> */}
              <div className={styles.cardBody1}>
                <ProTable
                  search={false}
                  options={false}
                  columns={columns}
                  dataSource={tableData}
                  pagination={false}
                  rowKey="key"
                  actionRef={actionRef}
                />
              </div>
              <br />
              <Row>
                <Descriptions
                  title={'设计要求'}
                  labelStyle={{ justifyContent: 'flex-end', minWidth: 80 }}
                  // contentStyle={{ justifyContent: 'flex-start', minWidth: 100 }}
                  column={2}
                >
                  <Descriptions.Item label={<Tooltip title=" "> 流量 </Tooltip>}>
                    {state.inputRequire?.flowRate ? state.inputRequire?.flowRate + 'm/s' : '/'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={state.inputRequire?.pressureField == 'fullPressure' ? '全压' : '静压'}
                  >
                    {state.inputRequire?.pressure ? state.inputRequire?.pressure : '/'}
                    {'(' +
                      fixNumFunc(
                        state.inputRequire?.pressure -
                          (state.inputRequire?.pressure * state.inputRequire?.min) / 100,
                        1,
                      ) +
                      '~' +
                      fixNumFunc(
                        state.inputRequire?.pressure +
                          (state.inputRequire?.pressure * state.inputRequire?.max) / 100,
                        1,
                      ) +
                      ')Pa'}
                  </Descriptions.Item>

                  <Descriptions.Item label="转速 ">
                    {/* {calculation?.specificSpeed} */}
                    {state.inputRequire?.motorSpeed
                      ? state.inputRequire?.motorSpeed + 'r/min'
                      : '/'}
                  </Descriptions.Item>
                  <Descriptions.Item label="海拔 ">
                    {/* {calculation?.specificSpeed} */}
                    {state.inputRequire?.altitude != undefined
                      ? state.inputRequire?.altitude + 'm'
                      : '/'}
                  </Descriptions.Item>
                  <Descriptions.Item label="温度 ">
                    {/* {calculation?.specificSpeed} */}
                    {state.inputRequire?.temperature ? state.inputRequire?.temperature + '℃' : '/'}
                  </Descriptions.Item>
                  <Descriptions.Item label="大气压 ">
                    {/* {calculation?.specificSpeed} */}
                    {state.inputRequire?.atmosphericPressure
                      ? state.inputRequire?.atmosphericPressure + 'Pa'
                      : '/'}
                  </Descriptions.Item>
                  <Descriptions.Item label="密度 ">
                    {/* {calculation?.specificSpeed} */}
                    {state.inputRequire?.atmosphericDensity
                      ? state.inputRequire?.atmosphericDensity
                      : '/'}
                  </Descriptions.Item>
                  <Descriptions.Item label="湿度 ">
                    {/* {calculation?.specificSpeed} */}
                    {state.inputRequire?.humidity ? state.inputRequire?.humidity + '%' : '/'}
                  </Descriptions.Item>
                </Descriptions>
              </Row>
            </Col>

            <Col span={16}>
              {/* {Object.keys(perfData).length == 0 ? null : ( */}
              <PerformanceGraph
                // perfData={perfData}
                onReportData={(imageUrl: any) => {
                  setCurveFig(imageUrl);
                }}
                layout="horizontal"
                model={state.model}
                // scatterVisible={false}
                height={'450px'}
                expect={expect}
                getPerfData={getPerfData}
                pressureRange={state.pressureRange}
                pressureField={state.pressureField}
                echartsInstance={echartsInstance}
                setEchartsInstance={setEchartsInstance}
              />
              {/* )} */}
            </Col>
          </Row>

          {/* {similarPerfDataTableTitle == undefined ? (
            <Divider />
          ) : ( */}
          <Divider style={{ marginTop: 0 }} />

          <>
            <ProTable
              size="small"
              // cardBordered
              search={false}
              options={false}
              pagination={false}
              columns={similarColumns}
              // rowKey={'key'}
              actionRef={similarTableActionRef}
              dataSource={perfSimilarTableData}
            ></ProTable>
          </>
          {/* )} */}
          <Divider />
          <Row gutter={16} justify="end" align={'middle'}>
            <Col span={4}>
              <Button
                key="primary"
                type="primary"
                onClick={(e) => {
                  // echartsInstance?.resize({ width: 940, height: 500 });
                  const imgUrl = echartsInstance?.getDataURL({
                    pixelRatio: 2,
                    backgroundColor: '#fff',
                    excludeComponents: ['toolbox'], // 忽略组件的列表，
                  });
                  // console.log('imgUrl');
                  // console.log(imgUrl);

                  history.push(`/similarDesign/report`, {
                    id: id,
                    model: model,
                    similarPerfData: perfSimilarTableData,
                    flowRate: expect?.flowRate,
                    pressure: expect?.pressure,
                    pressureField: state.pressureField,
                    curveFig: curveFig,
                    impellerDiameter: impellerDiameter,
                    motorSpeed: motorSpeed,
                    similarDesignFactors: similarDesignFactors,
                    imgUrl: imgUrl,
                    inputRequire: state.inputRequire,
                  });
                  const actionParams = {
                    monitorModule: '风机平台',
                    pageUrl: window.location.href,
                    pageName: '风机平台',
                    pageArea: '相似设计',
                    actionModel: model + '-' + state.figNum + '-' + state.version,
                    actionId: `fan_2_${e.target.innerText}`,
                    actionType: '生成',
                    actionName: '生成风机报告',
                    description: '生成风机报告_' + model + '-' + state.figNum + '-' + state.version,
                  };
                  saveUserAction({ params: actionParams }).catch((e) => {});
                }}
              >
                生成报告
              </Button>
              {/* <Button type="primary" onClick={()=>{exportPDF('测试导出PDF', this.pdfRef.current)}}> */}
              {/* 导出PDF
              </Button> */}
            </Col>
          </Row>
        </Card>
        {/* </Form> */}
        {/* </Modal> */}
      </PageContainer>
    </>
  );
};

export default FanSimilarDesignDetail;
