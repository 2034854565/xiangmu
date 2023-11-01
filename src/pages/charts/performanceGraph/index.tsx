import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts';
import {
  Card,
  Col,
  Row,
  Select,
  Space,
  Typography,
  Image,
  Button,
  Divider,
  Radio,
  Carousel,
  Form,
  InputNumber,
} from 'antd';
import { fallbackImage } from './data.d';
import ReactEcharts from 'echarts-for-react';
import ecStat from 'echarts-stat';
import { FanListItem } from '@/pages/fan/data';
import { CalculationItem } from '@/pages/fan/similarDesign/detail/data';
import { fixNumFunc } from '@/pages/fan/components/utils';
import styles from './style.less';
import moment from 'moment';
import CarouselDetail from '@/components/CarouselDetail';
import { saveUserAction } from '@/services/ant-design-pro/api';
import { DownloadOutlined } from '@ant-design/icons';

echarts.registerTransform(ecStat.transform.regression);
const { Title } = Typography;

const PerformanceGraph: React.FC<{
  fanInfo?: FanListItem;
  perfData?: any;
  getPerfData: Function;
  standardOrExperiment?: { standard: boolean; setStandardMode: Function };
  layout?: string;
  scatterVisible?: boolean;
  height?: string;
  expect?: CalculationItem;
  pressureRange?: any;
  authList?: string[];
  pressureField?: string;
  activeKey?: string;
  compute?: boolean;
  model?: string;
  onReportData?: Function | undefined;
  echartsInstance?: echarts.ECharts;
  setEchartsInstance?: Function;
}> = (props) => {
  const {
    fanInfo,

    model,
    standardOrExperiment,
    getPerfData,
    layout,
    scatterVisible = true,
    height = '500px',
    expect,
    pressureRange,
    authList,
    pressureField = 'fullPressure',
    activeKey,
    onReportData,
    compute = false,
    echartsInstance,
    setEchartsInstance,
  } = props;
  // echartsInstance?.resize({ width: 'auto', height: 'auto' });

  const formlayout = {
    labelCol: {
      // span: 'flex'
      span: 6,
    },
    wrapperCol: { span: 18, justify: 'flex' },
    // labelAlign: 'right',span: 16,flex: 16,
  };
  // let { perfData } = props;

  // const { standard, setStandardMode } = standardOrExperiment;
  // console.log(fanInfo);
  const perfData = getPerfData();
  console.log('perfData render');
  // console.log('perfData');
  // console.log(perfData);

  const [form] = Form.useForm();
  const [flowRateUnit, setFlowRateUnit] = useState<number>(1);
  const [computeResult, setComputeResult] = useState<{}>({});
  const [imageUrl, setImageUrl] = useState('');

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
  }
  const generalParams = {
    monitorModule: '风机平台',
    pageUrl: window.location.href,
    pageName: '风机平台',
    pageArea: pageArea,
    actionModel: fanInfo?.model,
  };

  const onValuesChange = (
    changeValues: any,
    flowRateUnit: number,
    xAxis: string = 'flowRate',
    yAxis: string[] = ['fullPressure', 'shaftPower', 'fanEff'],
  ) => {
    // console.log('changeValues!!!!!!!!!');
    // console.log(changeValues);
    // console.log('xAxis');
    // console.log(xAxis);
    // console.log('yAxis');
    // console.log(yAxis);
    console.log('changeValues[xAxis]');
    console.log(changeValues[xAxis]);
    const x =
      xAxis == 'flowRate' ? fixNumFunc(changeValues[xAxis] / flowRateUnit, 3) : changeValues[xAxis];
    // const x = xAxis == 'flowRate' ? changeValues[xAxis] * flowRateUnit : changeValues[xAxis];
    // console.log('x');
    // console.log(x);
    // const minNum =
    //   xAxis && perfData[xAxis]
    //     ? xAxis == 'flowRate'
    //       ? fixNumFunc(Math.min(...perfData[xAxis]) * flowRateUnit, 3)
    //       : Math.min(...perfData[xAxis])
    //     : 0;
    // const maxNum =
    //   xAxis && perfData[xAxis]
    //     ? xAxis == 'flowRate'
    //       ? fixNumFunc(Math.max(...perfData[xAxis]) * flowRateUnit, 3)
    //       : Math.max(...perfData[xAxis])
    //     : 0;
    // console.log('minNum', minNum);
    // console.log('maxNum', maxNum);
    // console.log('minNum', Math.min(...perfData[xAxis]));
    // console.log('maxNum', Math.max(...perfData[xAxis]));

    ////if (xAxis == 'flowRate') {
    // if (x > minNum && x < maxNum) {
    //   form.setFieldValue('flowRate', x);
    // } else if (x < minNum) {
    //   form.setFieldValue('flowRate', minNum);
    // } else if (x > maxNum) {
    //   form.setFieldValue('flowRate', maxNum);
    // }
    //// }
    let computeResult = {};
    computeResult[xAxis] = x;
    // if (yAxis) {
    for (let i = 0; i < yAxis.length; i++) {
      const y = yAxis[i];
      let tempData = [];
      console.log('y');
      console.log(y);
      for (let j = 0; j < perfData[xAxis].length; j += 1) {
        tempData.push([perfData[xAxis][j], perfData[y][j]]);
      }
      // console.log('tempData');
      // console.log(tempData);

      let fitData = [];
      var myRegression = ecStat.regression('polynomial', tempData, 2);
      const an = myRegression.parameter;
      // const xi = tempData[k][0];
      // const yi = tempData[k][1];
      computeResult[y] = fixNumFunc(an[2] * x * x + an[1] * x + an[0], y == 'flowRate' ? 3 : 1);
    }
    // }
    // console.log('computeResult');
    // console.log(computeResult);
    setComputeResult(computeResult);
  };
  // console.log(' PerformanceGraph perfData');
  // console.log(perfData);
  const four_star = 'path://M1.5,25 L20.5,25 L8,10.2 L16,0.8 L2,0.8 z';
  const five_star =
    'path://M50,0 L62,35 L100,37 L70,60 L78,100 L50, 77 L22, 100 L30, 60 L0,36 L38, 35Z';
  const six_star = 'path://M10,0 L2.37,6.47 L3.63,18.06 L10,25 L16.37,18.06 L17.63,6.47 z';
  const droplet = 'path://M0,20 L20,20 L10,0 z';
  const water = 'path://M480,288c0,176-288,512-288,512S-48,464,480,288z'; //水滴形状
  const expectColors = ['#de1c31', '#cf39ff', '#ff11f5'];
  const colors = [
    '#229453',
    '#b9dec9',
    '#2983bb',
    '#93b5cf',
    '#bf3553',
    '#eea2a4',
    '#6f70C6',
    '#5470a6',
    '#f9d367',
    '#b78d12',
  ];
  const expectShapes = [five_star, four_star, six_star, 'emptyCircle'];
  const shapes = [
    'circle', //圆形
    'emptyCircle', //空心圆
    'rect', //方形
    'emptyRect',
    'triangle', //三角形
    'emptyTriangle', //空心三角形
    water, //水滴形状
    droplet, //倒三角
    'diamond',
  ];

  const legendDict = {
    flowRate: '流量 m³/s',
    fullPressure: '全压 Pa',
    staticPressure: '静压 Pa',
    shaftPower: '轴功率 kw',
    fanEff: '风机效率 %',
  };
  const fixNumberDict = {
    flowRate: 3,
    fullPressure: 0,
    staticPressure: 0,
    shaftPower: 1,
    fanEff: 0,
  };
  const optionX = [
    {
      value: 'flowRate',
      label: '流量',
    },
    {
      value: 'fullPressure',
      label: '全压',
    },
    {
      value: 'staticPressure',
      label: '静压',
    },
    {
      value: 'shaftPower',
      label: '轴功率',
    },
    {
      value: 'fanEff',
      label: '风机效率',
    },
  ];
  const optionY = [
    {
      value: 'flowRate',
      label: '流量',
    },
    {
      value: 'fullPressure',
      label: '全压',
    },
    {
      value: 'staticPressure',
      label: '静压',
    },
    {
      value: 'shaftPower',
      label: '轴功率',
    },
    {
      value: 'fanEff',
      label: '风机效率',
    },
  ];

  const [xAxis, setxAxis] = useState<string>(() => {
    let x = sessionStorage.getItem('xAxis');
    if (x) {
      sessionStorage.removeItem('xAxis');
      return JSON.parse(x);
    } else {
      return 'flowRate';
    }
  });
  const [yAxis, setyAxis] = useState<string[]>(() => {
    let y = sessionStorage.getItem('yAxis');
    if (y) {
      sessionStorage.removeItem('yAxis');
      return JSON.parse(y);
    } else {
      if (pressureField == 'fullPressure') {
        return ['fullPressure', 'shaftPower', 'fanEff'];
      } else {
        return ['staticPressure', 'shaftPower', 'fanEff'];
      }
    }
  });
  const minNum =
    xAxis && perfData[xAxis]
      ? xAxis == 'flowRate'
        ? fixNumFunc(Math.min(...perfData[xAxis]) * flowRateUnit, 3)
        : Math.min(...perfData[xAxis])
      : 0;
  const maxNum =
    xAxis && perfData[xAxis]
      ? xAxis == 'flowRate'
        ? fixNumFunc(Math.max(...perfData[xAxis]) * flowRateUnit, 3)
        : Math.max(...perfData[xAxis])
      : 0;

  const generateSeries = (data: any, x: string, yList: string[]) => {
    let legendData: string[] = [];
    yList.forEach((yAxis) => {
      legendData.push(legendDict[yAxis]);
      // legendData.push('实际数据-' + legendDict[yAxis]);
    });

    // console.log('data');
    // console.log(data);
    // console.log('yList');
    // console.log(yList);
    let seriesData = [];
    let rList = {};
    let temp = [];
    for (let i = 0; i < data[x].length; i++) {
      temp.push(data[x][i]);
    }
    const sortData = temp.sort(function (a: number, b: number) {
      return a - b;
    });

    let min = sortData[0];
    const max = sortData[temp.length - 1];
    for (let i = 0; i < yList.length; i++) {
      let yIndex = i;
      let tempData = [];
      // console.log('data');
      // console.log(data);
      for (let j = 0; j < data[x].length; j += 1) {
        tempData.push([data[x][j], data[yList[i]][j]]);
      }
      // console.log('tempData');
      // console.log(tempData);

      let fitData = [];
      var myRegression = ecStat.regression('polynomial', tempData, 2);
      const an = myRegression.parameter;

      // console.log('myRegression');
      // console.log(myRegression.parameter);
      let R2 = 0;
      let SStot = 0;
      let SSres = 0;

      const meanY = ecStat.statistics.mean(data[yList[i]]);
      // console.log('ya:' + meanY);

      for (let k = 0; k < tempData.length; k++) {
        const xi = tempData[k][0];
        const yi = tempData[k][1];
        const fi = an[2] * xi * xi + an[1] * xi + an[0];
        SStot = SStot + Math.pow(yi - meanY, 2);
        SSres = SSres + Math.pow(yi - fi, 2);
      }
      R2 = 1 - SSres / SStot;
      // console.log('R2:' + R);
      rList[legendDict[yList[i]]] = R2;
      // const an = myRegression.parameter;

      // for (let i = 0; i < temp.length; i += 1) {
      //   console.log('temp');
      //   console.log(temp);

      //   const x = temp[i];
      //   const y = (an[2] * x * x + an[1] * x + an[0]).toFixed(3);
      //   fitData.push([x, y]);
      // }
      // min = fixNumFunc(min, 3);
      for (let x = min; x < max; x += 0.01) {
        // x = fixNumFunc(x, 3);

        const y = (an[2] * x * x + an[1] * x + an[0]).toFixed(3);
        fitData.push([x, y]);
      }
      // const fn = an[2].toFixed(2) + 'x²+' + an[1].toFixed(2) + 'x+' + an[0].toFixed(2);
      // const r = legendDict[yList[i]] + ':R²=' + R2.toFixed(2);
      const r = 'R²=' + R2.toFixed(2);
      tempData = [];
      for (let j = 0; j < data[x].length; j += 1) {
        tempData.push([fixNumFunc(data[x][j], 1), fixNumFunc(data[yList[i]][j], 1)]);
      }
      if (scatterVisible) {
        seriesData.push({
          // '实际数据-' +
          name: legendDict[yList[i]],
          type: 'scatter',
          yAxisIndex: yIndex,
          showSymbol: false,
          // showSymbol:true,
          clip: true,
          data: tempData,
          symbol: shapes[2 * i],
          // symbol:'rect',
          color: colors[2 * i],
          symbolSize: 8,
          animation: false,
        });
      }
      seriesData.push({
        name: legendDict[yList[i]],
        type: 'line',
        yAxisIndex: yIndex,
        showSymbol: false,
        clip: true,
        data: fitData,
        smooth: true,
        color: colors[2 * i + 1],
        label: {
          show: true,
          fontSize: 16,
          formatter: r,
          // position: 'top',
          color: colors[2 * i],
        },
        animation: false,
        // encode: { label: 2, tooltip: 2 },
        markLine: pressureRange
          ? {
              silent: true,
              lineStyle: {
                color: colors[2 * i],
              },
              symbol: 'none',
              label: {
                show: true,
                position: 'start',
                distance: [-35, -20],
                color: colors[2 * i],
                // padding: [0, 0, 0, 100],
              },
              animation: false,
              data: [
                // [
                //   {
                //     // 起点和终点的项会共用一个 name
                //     name: '最小值',
                //     type: 'min',
                //   },
                //   {
                //     name: '最大值',

                //     type: 'max',
                //   },
                // ],
                {
                  yAxis: pressureRange[0],
                },
                {
                  yAxis: pressureRange[1],
                },
              ],
            }
          : null,
      });
    }
    if (expect != undefined) {
      let expectIndex = yList.indexOf('fullPressure');
      if (expectIndex != -1) {
        legendData.push('预期-流量压力');

        // console.log('expect');
        // console.log(expect);
        // console.log('expectIndex');
        // console.log("流量压力0",expectIndex)
        // console.log("流量压力形状",expectShapes[expectIndex])
        seriesData.push({
          name: '预期-流量压力',
          type: 'scatter',
          yAxisIndex: expectIndex,
          color: expectColors[expectIndex], //紫色
          symbol: expectShapes[expectIndex], //菱形
          symbolSize: 12,
          //color 与y轴数据相关
          showSymbol: false,
          clip: true,
          itemStyle: {},
          data: [[expect?.flowRate, expect?.pressure]],
          animation: false,
          z: 8,
        });
      }

      expectIndex = yList.indexOf('shaftPower');
      if (expectIndex != -1) {
        legendData.push('预期-流量轴功率');
        // console.log("流量轴功率1",expectIndex);
        // console.log("流量轴功率1形状",expectShapes[expectIndex])
        seriesData.push({
          name: '预期-流量轴功率',
          type: 'scatter',
          yAxisIndex: expectIndex,
          color: expectColors[expectIndex],
          symbol: expectShapes[expectIndex],
          symbolSize: 8,
          //color 与y轴数据相关
          showSymbol: false,
          selected: {
            '预期-流量轴功率': false,
          },
          // itemStyle:{},
          clip: true,
          animation: false,
          data: [[expect?.flowRate, expect?.usefulWork]],
        });
      }
    }
    console.log('computeResult');
    console.log(computeResult);

    if (Object.keys(computeResult).length > 0) {
      legendData.push('输入点');
      // console.log("流量轴功率1",expectIndex);
      // console.log("流量轴功率1形状",expectShapes[expectIndex])

      seriesData.push({
        name: '输入点',
        type: 'scatter',
        yAxisIndex: 0,
        color: '#fc6315',
        // symbol: 'circle',
        symbol: 'diamond',

        symbolSize: 9,
        //color 与y轴数据相关
        showSymbol: false,
        selected: {
          输入点: false,
        },
        // itemStyle:{},
        clip: true,
        animation: false,
        data: [[computeResult[x], computeResult[yList[0]]]],
        z: 10,
      });
    } else {
      legendData = legendData.filter((item) => {
        return item != '输入点' ? item : undefined;
      });
    }
    let legend = { data: legendData };
    legend['selected'] = {
      '预期-流量轴功率': false,
    };
    // seriesData['animation']:false

    return {
      seriesData: seriesData,
      R2: rList,
      legend: legend,
      animation: false,
    };
  };
  //'fullPressure', 'shaftPower', 'fanEff'
  //   [
  //   '压力-fullPressure',
  //   '轴功率-shaftPower',
  //   '风机效率-fanEff',
  // ]
  let echartRef = useRef<any>();

  const onChangexAxis = (e: string) => {
    setxAxis(e);
    onValuesChange(form.getFieldsValue(), flowRateUnit, e, yAxis);
  };
  const onChangeyAxis = (e: string[]) => {
    setyAxis(e);
    console.log('onChangeyAxis');
    console.log(e);
    onValuesChange(form.getFieldsValue(), flowRateUnit, xAxis, e);
  };
  let o = {
    color: colors,
    // dataset: generateData(xAxis, yAxis),
    // tooltip: {
    //   trigger: 'axis',
    //   axisPointer: {
    //     type: 'cross',
    //   },
    // },
    tooltip: {
      trigger: 'axis', //
      // formatter: '{a}:{c}',
      axisPointer: {
        type: 'cross', //line cross none
        snap: true,
      },
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        restore: { show: true },

        saveAsImage: { show: true },
      },
    },
    dataZoom: [
      {
        show: true,
        type: 'inside',
        filterMode: 'none',
        xAxisIndex: [0, 1, 2],
      },
      {
        show: true,
        type: 'inside',
        filterMode: 'none',
        yAxisIndex: [0, 1, 2],
      },
    ],
    // legend: {
    //   // data: ['相似设计', '预期'],
    // },
    xAxis: {
      type: 'value',
      name: '流量m3/s',
      // axisTick: {
      //   alignWithLabel: true,
      // },
      axisLabel: {
        formatter: '{a0}:{c0}',
      },

      // prettier-ignore
      // interval: 0.5, // 步长
      // min: 0, // 起始
      // max: 10, // 终止
    },

    yAxis: [
      {
        type: 'value',
        name: '压力Pa',
        position: 'left',
        alignTicks: true,
        animation: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[0],
          },
        },
        axisLabel: {
          formatter: '{a}:{c}',
        },
      },
      {
        type: 'value',
        name: '轴功率kW',
        position: 'right',
        alignTicks: true,

        // offset: 40,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[2],
          },
        },
        axisLabel: {
          formatter: '{value}',
        },
      },
      {
        type: 'value',
        name: '风机效率%',
        position: 'right',

        alignTicks: true,
        offset: 40,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[4],
          },
        },
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],

    animationDelayUpdate: 1000,
    series: [],
  };

  function downloadIamge(imageUrl, name) {
    var alink = document.createElement('a');
    alink.href = imageUrl;
    alink.download = name; //图片名
    alink.click();
  }

  // 获取配置
  const getOption = (data: any, o: any, xAxisField: string, yAxisFields: string[]) => {
    // data[xAxisField][0] > 1 ? fixNumFunc(data[xAxisField][0] - data[xAxisField][0] / 10, 2) : 0,
    // let echarts_instance = echarts_react.getEchartsInstance();
    // let base64 = echarts_instance.getDataURL();

    let xAxis = {
      type: 'value',
      name: legendDict[xAxisField],
      nameLocation: 'middle',

      nameGap: 20,
      axisLabel: {
        formatter: '{value} ',
      },
      splitLine: {
        //修改背景线条样式
        show: true, //是否展示
      },
      // boundaryGap: ['1%', '10%'],
      // scale: true,

      min: function (value) {
        const inteval = fixNumFunc((value.max - value.min) / data[xAxisField].length, 3);
        return fixNumFunc(value.min - inteval > 0 ? value.min - inteval : 0, 1);
      },
      max: function (value) {
        const inteval = fixNumFunc((value.max - value.min) / data[xAxisField].length, 3);
        return fixNumFunc(value.max + inteval, 1);
      },
      markLine: {
        silent: true,
        animation: false,
        // animationDelayUpdate: 1000,
        lineStyle: {
          color: '#333',
        },
        data: pressureRange
          ? [
              {
                xAxis: pressureRange[0],
              },
            ]
          : null,
      },
    };

    o.xAxis = xAxis;
    let leftOffset = 0;
    const tempY = [];
    for (let i = 0; i < yAxisFields.length; i++) {
      if (['fullPressure', 'staticPressure'].includes(yAxisFields[i])) {
        leftOffset++;
        tempY.push(yAxisFields[i]);
      }
    }
    for (let i = 0; i < yAxisFields.length; i++) {
      if (!['fullPressure', 'staticPressure'].includes(yAxisFields[i])) {
        tempY.push(yAxisFields[i]);
      }
    }
    if (yAxisFields.length > 0) {
      let yAxis = [];

      for (let i = 0; i < tempY.length; i++) {
        console.log(tempY[i]);

        yAxis.push({
          type: 'value',
          name: legendDict[tempY[i]],
          // position: i == 0 ? 'left' : 'right',
          position: ['fullPressure', 'staticPressure'].includes(tempY[i]) ? 'left' : 'right',
          alignTicks: true,
          nameLocation: 'end',
          nameTextStyle: {
            verticalAlign: 'start',
          },
          // nameRotate: i == 0 ? 0 : -20,
          // offset: ['fullPressure', 'staticPressure'].includes(tempY[i])&&leftOffset>1
          //   ? tempY[i] == 'fullPressure'
          //     ? 0
          //     : 40
          //   : (i - 1 - leftOffset) * 30,
          offset: i < leftOffset ? i * 40 : (i - leftOffset) * 40,

          nameRotate: -20,
          // offset: i % 2 == 0 ? i * 20 : (i - 1) * 20,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[i * 2],
            },
          },
          axisLabel: {
            // 内容格式器
            formatter: function (value, index) {
              // console.log('index');
              // console.log(index);
              // console.log('yAxisFields[i]');
              // console.log(yAxisFields[i]);
              // console.log('fixNumberDict[yAxisFields[i]]');
              // console.log(fixNumberDict[yAxisFields[i]]);

              return value.toFixed(fixNumberDict[tempY[i]]);
            },
            // formatter: '{value}',
          },
          splitLine: {
            //修改背景线条样式
            show: true, //是否展示
            lineStyle: {
              // color: '#353b5a', //线条颜色
              type: 'dashed', //线条样式，默认是实现，dashed是虚线
            },
          },
          scale: true,
          // min: function (value) {
          //   console.log('min value');
          //   console.log(value);

          //   const inteval = fixNumFunc((value.max - value.min) / data[xAxisField].length, 3);
          //   const result = fixNumFunc(value.min - inteval > 0 ? value.min - inteval : 0, 0);
          //   console.log('min result');
          //   console.log(result);
          //   return result;
          // },
          // max: function (value) {
          //   const inteval = fixNumFunc((value.max - value.min) / data[xAxisField].length, 3);
          //   const result = fixNumFunc(Math.ceil(value.max + inteval), 0);
          //   console.log('max result');
          //   console.log(result);
          //   return result;
          // },
          // interval: 10, // 步长
        });
      }

      o.yAxis = yAxis;
    }

    o.grid = {
      left: 41 * leftOffset,
      right: (yAxisFields.length - leftOffset) * 40,
    };
    let temp = generateSeries(data, xAxisField, tempY);
    o.series = temp.seriesData;
    o.legend = temp.legend;
    const toolboxFlag = authList ? authList.includes('auth_graph_data') : true;

    let toolbox = {
      feature: {
        dataView: { show: toolboxFlag, title: '查看源数据', readOnly: !toolboxFlag },
        restore: { title: '重新加载', show: true },
        // saveAsImage: { show: false },
        myTool1: {
          show: true,
          // title: '下载',
          // icon: 'image://data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7',
          icon: 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjgzNjEzODY1NTk2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE1MzkiIHdpZHRoPSIyMjAiIGhlaWdodD0iMjIwIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHBhdGggZD0iTTg5NiA2NzJjLTE3LjA4OCAwLTMyIDE0LjkxMi0zMiAzMnYxMjhjMCA2LjQtNC4yODggMTAuNjg4LTEwLjY4OCAxMC42ODhIMTcwLjY4OGMtNi40IDAtMTAuNjg4LTQuMjg4LTEwLjY4OC0xMC42ODh2LTEyOGMwLTE3LjA4OC0xNC45MTItMzItMzItMzJzLTMyIDE0LjkxMi0zMiAzMnYxMjhjMCA0MC41MTIgMzQuMTEyIDc0LjY4OCA3NC42ODggNzQuNjg4aDY4Mi42MjRjNDAuNTc2IDAgNzQuNjg4LTM0LjE3NiA3NC42ODgtNzQuNjg4di0xMjhjMC0xNy4wODgtMTQuOTEyLTMyLTMyLTMyeiBtLTQwNy40ODggNTUuNDg4YzYuNCA2LjQgMTQuOTc2IDguNTEyIDIzLjQ4OCA4LjUxMmEzMi4wNjQgMzIuMDY0IDAgMCAwIDIzLjQ4OC04LjUxMkw3NDguOCA1MTQuMTEyYzEyLjgtMTIuOCAxMi44LTMyIDAtNDQuOC0xMi44LTEyLjgtMzItMTIuOC00NC44IDBMNTQ2LjExMiA2MjcuMlYxNzAuNjg4YzAtMTcuMDg4LTE0LjkxMi0zMi0zMi0zMi0xNy4wMjQgMC0zNC4xMTIgMTQuOTEyLTM0LjExMiAzMlY2MjcuMkwzMjIuMTEyIDQ2OS4zMTJjLTEyLjgtMTIuOC0zMi0xMi44LTQ0LjggMC0xMi44IDEyLjgtMTIuOCAzMiAwIDQ0LjhsMjExLjIgMjEzLjM3NnoiIHAtaWQ9IjE1NDAiIGZpbGw9IiM4YThhOGEiPjwvcGF0aD48L3N2Zz4=',
          onclick: function () {
            var img = new (Image as any)();
            echartsInstance?.resize({ width: 740, height: 500 });
            const imageUrl = echartsInstance.getDataURL({
              // pixelRatio: 1,
              backgroundColor: '#fff',
              excludeComponents: ['toolbox'], // 忽略组件的列表，
            });
            echartsInstance?.resize({ width: 'auto', height: 'auto' });
            img.src = imageUrl;
            downloadIamge(
              imageUrl,
              `${
                fanInfo?.model ? fanInfo?.model + '-' : model != undefined ? model + '-' : ''
              }性能曲线图.png`,
            );
            console.log('fanInfo');
            console.log(fanInfo);

            const params = {
              ...generalParams,
              pageArea: '详情',
              actionId: `fan_${'性能曲线图'}_下载`,
              actionType: '下载',
              actionName: '下载性能曲线图',
              description: `下载性能曲线图_${fanInfo?.model ? fanInfo?.model : model}-${
                fanInfo.figNum
              }-${fanInfo.version}`,
            };
            saveUserAction({ params }).catch((e) => {});
          },
        },
        //         saveAsImage: { show: true,
        // }
      },
    };
    o.toolbox = toolbox;
    o.animation = false;
    return o;
  };

  const computeContent = (
    <>
      <Form
        {...formlayout}
        name="nest-messages"
        form={form}
        // formRef={formRef}
        // onFinish={onFinish}
        // onValuesChange={reload}
        className={styles.formItem}
        onValuesChange={(e) => {
          form.validateFields();
          onValuesChange(e, flowRateUnit, xAxis, yAxis);
        }}
      >
        <Row gutter={6} align="middle" justify={'space-around'} style={{ paddingTop: 10 }}>
          <Col span={14}>
            <Form.Item
              name={xAxis}
              tooltip="计算结果为拟合曲线上的点"
              label={legendDict[xAxis].split(' ')[0]}
              labelCol={{ span: 4 }}
              rules={[{ required: true }, { type: 'number' }]}

              // className={styles.formItem}
              // initialValue={2.4}
            >
              <InputNumber
                min={minNum}
                max={maxNum}
                // size="small"
                // size="small"
                step={xAxis == 'flowRate' ? 0.01 : 1}
                addonAfter={
                  xAxis == 'flowRate' ? (
                    <Select
                      value={flowRateUnit}
                      options={[
                        { label: 'm³/s', value: 1 },
                        { label: 'm³/min', value: 60 },
                        { label: 'm³/h', value: 3600 },
                      ]}
                      onChange={async (value) => {
                        // let  flowRate = await form.getFieldValue('flowRate')
                        // flowRate=flowRate/flowRateUnit
                        console.log('changed');

                        // let flowRate = form.getFieldValue('flowRate');
                        // console.log('111111111111111111111flowRate');
                        // console.log(flowRate);

                        // flowRate = (flowRate * value) / flowRateUnit;
                        // console.log('222222222222222222222flowRate');
                        // console.log(flowRate);

                        // form.setFieldValue('flowRate', flowRate);
                        const result = await form.getFieldsValue();
                        console.log('result');
                        console.log(result);

                        setFlowRateUnit(value);
                        onValuesChange(result, value, xAxis, yAxis);
                      }}
                    ></Select>
                  ) : (
                    legendDict[xAxis].split(' ')[1]
                  )
                }
              />
            </Form.Item>
          </Col>
          <Col span={10}></Col>
        </Row>
        <Row gutter={6} align="top">
          {yAxis.map((y) => {
            const result = form.getFieldValue(xAxis);
            if (result)
              return (
                <Col span={6}>
                  <Form.Item name={y} label={legendDict[y].split(' ')[0]} labelCol={{ span: 10 }}>
                    <>{computeResult[y] + legendDict[y].split(' ')[1]}</>
                  </Form.Item>
                </Col>
              );
            else return null;
          })}
        </Row>
      </Form>
    </>
  );

  function submitReportData(arg0: () => void) {
    throw new Error('Function not implemented.');
  }

  // 从图表组件中传值到相似设计报告中
  //  console.log("shuju",getOption(perfData, o, xAxis, yAxis))
  // function submitReportData(){
  //   const imageUrl = echartsInstance.getDataURL({
  //     backgroundColor: '#fff',
  //   });
  //   return imageUrl;
  // };
  return (
    <Card bordered={false}>
      {fanInfo == undefined ? null : <Title level={5}>{fanInfo?.model}-性能曲线图</Title>}
      {layout == 'horizontal' ? (
        <>
          <Row justify={'space-around'} align="middle">
            <Col span={1}></Col>
            <Col span={11}>
              <Title level={4}></Title>
              横轴：
              <Select
                defaultValue={xAxis}
                style={{ width: 240 }}
                onChange={onChangexAxis}
                options={optionX}
              />
            </Col>
            <Col span={12}>
              <Title level={4}></Title>
              纵轴：
              <Select
                mode="multiple"
                defaultValue={yAxis}
                style={{ width: 300 }}
                onChange={onChangeyAxis}
                options={optionY}
              />
            </Col>
          </Row>
          {computeContent}
        </>
      ) : null}
      <Row gutter={16} align="middle" justify={'center'}>
        {/* <Col span={1}></Col> */}
        <Col span={6}>
          {layout == 'horizontal' ? null : (
            <Space direction="vertical">
              {standardOrExperiment?.standard == undefined ? null : (
                <>
                  <Radio.Group
                    defaultValue={1}
                    onChange={(e) => {
                      console.log('onChange');
                      console.log(e);
                      standardOrExperiment?.setStandardMode(e.target.value == 1 ? false : true);
                    }}
                  >
                    <Space direction="vertical">
                      <Radio value={1}>实验数据</Radio>
                      <Radio value={2} defaultChecked={true}>
                        标准状态数据
                      </Radio>
                    </Space>
                  </Radio.Group>
                  <Divider />
                </>
              )}
              <Row justify={'center'} align="middle">
                横轴：
                <Select
                  defaultValue={xAxis}
                  style={{ width: 120 }}
                  onChange={onChangexAxis}
                  options={optionX}
                />
              </Row>
              <Row justify={'center'} align="middle">
                纵轴：
                <Select
                  mode="multiple"
                  defaultValue={yAxis}
                  style={{ width: 120 }}
                  onChange={onChangeyAxis}
                  options={optionY}
                />
              </Row>
              <Row>
                <Col span={24}>
                  {fanInfo == undefined ? null : fanInfo.img3d == undefined ? null : (
                    <>
                      <Divider />
                      {/* style={{ width: 200, height: 200 }} */}
                      <CarouselDetail imgList={fanInfo.img3d} />
                    </>
                  )}
                </Col>
              </Row>

              {/* {fanInfo == undefined ? null : fanInfo.img3d == undefined ? null : ( */}
              {fanInfo == undefined ? null : fanInfo.img3d == undefined ? (
                <>
                  <Divider />
                  <Form
                    {...formlayout}
                    name="nest-messages"
                    form={form}
                    // formRef={formRef}
                    // onFinish={onFinish}
                    // onValuesChange={reload}
                    className={styles.formItem}
                    onValuesChange={async (e) => {
                      // const values = await
                      form.validateFields();
                      console.log('values');
                      console.log(e);

                      onValuesChange(e, flowRateUnit, xAxis, yAxis);
                    }}
                  >
                    <Row gutter={6} align="top">
                      <Col span={24}>
                        <Form.Item
                          name={xAxis}
                          tooltip="计算结果为拟合曲线上的点1"
                          label={legendDict[xAxis].split(' ')[0]}
                          labelCol={{ span: 6 }}
                          rules={[{ required: true }, { type: 'number' }]}
                          // className={styles.formItem}
                          // initialValue={2.4}
                        >
                          <InputNumber
                            min={minNum}
                            max={maxNum}
                            // size="small"
                            step={
                              xAxis == 'flowRate'
                                ? flowRateUnit == 1
                                  ? 0.01
                                  : flowRateUnit == 60
                                  ? 1
                                  : 10
                                : 1
                            }
                            size="small"
                            style={{ width: '100%' }}
                            addonAfter={
                              xAxis == 'flowRate' ? (
                                <Select
                                  value={flowRateUnit}
                                  options={[
                                    { label: 'm³/s', value: 1 },
                                    { label: 'm³/min', value: 60 },
                                    { label: 'm³/h', value: 3600 },
                                  ]}
                                  onChange={async (value) => {
                                    // flowRate=flowRate/flowRateUnit
                                    console.log('changed');
                                    if (xAxis == 'flowRate') {
                                      let x = await form.getFieldValue('flowRate');
                                      x = (value / flowRateUnit) * x;
                                      form.setFieldValue('flowRate', x);
                                    }

                                    const minNum =
                                      xAxis && perfData[xAxis]
                                        ? xAxis == 'flowRate'
                                          ? fixNumFunc(Math.min(...perfData[xAxis]) * value, 3)
                                          : Math.min(...perfData[xAxis])
                                        : 0;
                                    const maxNum =
                                      xAxis && perfData[xAxis]
                                        ? xAxis == 'flowRate'
                                          ? fixNumFunc(Math.max(...perfData[xAxis]) * value, 3)
                                          : Math.max(...perfData[xAxis])
                                        : 0;
                                    console.log('minNum', minNum);
                                    console.log('maxNum', maxNum);
                                    // console.log('minNum', Math.min(...perfData[xAxis]));
                                    // console.log('maxNum', Math.max(...perfData[xAxis]));
                                    if (xAxis == 'flowRate') {
                                      let x = await form.getFieldValue('flowRate');
                                      console.log('x ', x);

                                      if (x > minNum && x < maxNum) {
                                        form.setFieldValue('flowRate', x);
                                      } else if (x < minNum) {
                                        form.setFieldValue('flowRate', minNum);
                                      } else if (x > maxNum) {
                                        form.setFieldValue('flowRate', maxNum);
                                      }
                                    }
                                    const result = await form.getFieldsValue();
                                    console.log('result');
                                    console.log(result);
                                    setFlowRateUnit(value);

                                    onValuesChange(result, value, xAxis, yAxis);
                                  }}
                                ></Select>
                              ) : (
                                legendDict[xAxis].split(' ')[1]
                              )
                            }
                          />
                        </Form.Item>
                      </Col>

                      {yAxis.map((y) => {
                        const result = form.getFieldValue(xAxis);
                        if (result)
                          return (
                            <Col span={24}>
                              <Form.Item
                                name={y}
                                label={legendDict[y].split(' ')[0]}
                                labelCol={{ span: 8 }}
                              >
                                <>{computeResult[y] + legendDict[y].split(' ')[1]}</>
                              </Form.Item>
                            </Col>
                          );
                        else return null;
                      })}
                    </Row>
                  </Form>
                </>
              ) : null}
            </Space>
          )}
        </Col>

        <Col span={layout == 'horizontal' ? 24 : 18}>
          <Row gutter={16} id="chart">
            {perfData == undefined || 0 == Object.keys(perfData).length ? null : (
              <ReactEcharts
                notMerge={true}
                option={getOption(perfData, o, xAxis, yAxis)}
                lazyUpdate={true}
                style={{ height: height, width: '100%', overflowX: 'scroll' }}
                // className="echarts-for-echarts"width: ,minWidth: 740,
                // theme="my_theme"
                ref={(e) => {
                  let echartRef = e;
                  if (echartRef != null) {
                    const echartsInstanceTemp = echartRef?.getEchartsInstance();
                    setEchartsInstance(echartsInstanceTemp);
                    setTimeout(function () {
                      // echartsInstanceTemp.resize({ width: 740, height: 500 });
                      let imageUrl = echartsInstanceTemp.getDataURL({
                        pixelRatio: 2,
                        backgroundColor: '#fff',
                        excludeComponents: ['toolbox'], // 忽略组件的列表，
                      });
                      if (onReportData) {
                        onReportData(imageUrl);
                      }
                    }, 1000);
                  }
                }}
              />
            )}
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default PerformanceGraph;
