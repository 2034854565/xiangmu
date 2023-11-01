// FanSimilarDesign

import React, { useEffect, useState } from 'react';
import { Col, Row, Select, Typography } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';
import ecStat from 'echarts-stat';
import { fixNumFunc } from '@/pages/fan/components/utils';
import { CalculationItem } from '@/pages/fan/similarDesign/detail/data.d';
import { saveUserAction } from '@/services/ant-design-pro/api';
echarts.registerTransform(ecStat.transform.regression);
// const { Search } = Input;
const { Title } = Typography;
const expectColors = ['#cf39ff', '#ff6666', '#ff11f5'];

const PerfCurveCompare: React.FC<{
  selectedModels: string[];
  perfData?: any;
  getPerfData: Function;
  expect?: CalculationItem;
  pressureField?: string;
}> = (props) => {
  const { selectedModels, getPerfData, expect, pressureField = 'fullPressure' } = props;
  const perfData = getPerfData();
  console.log('PerfCurveCompare selectedModels');
  console.log(selectedModels);
  console.log('PerfCurveCompare perfData');
  console.log(perfData);
  const [echartsInstance, setEchartsInstance] = useState<echarts.ECharts>();
  function downloadIamge(imageUrl, name) {
    var alink = document.createElement('a');
    alink.href = imageUrl;
    alink.download = name; //图片名
    alink.click();
  }
  // if (selectedModels.length != Object.keys(perfData).length) {
  //   return null;
  // }
  // for (let i = 0; i < selectedModels.length; i++) {
  //   const data = perfData[selectedModels[i]];
  //   if (data == undefined) {
  //     console.log('data == undefined');
  //     return null;
  //   }
  // }

  // const [perfCurveCompareData, setPerfCurveCompareData] = useState<{}>({});
  // if (perfData != perfCurveCompareData) {
  //   console.log('setPerfCurveCompareData(perfData)');

  //   setPerfCurveCompareData(perfData);
  // }
  //页面跳转返回保留select信息
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
  const [chartInfo, setChartInfo] = useState();
  // const onChangeChart = (e) => {
  //     const option = getOption(xAxis, yAxis, selectedModels, perfData);
  //   chartInfo.getEchartsInstance().setOption(option);

  //   }
  // useEffect(() => {
  //   const option = getOption(xAxis, yAxis, selectedModels, perfData);

  //   if (chartInfo) {
  //     console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
  //     console.log(perfData);
  //     console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
  //     chartInfo.getEchartsInstance().setOption(option);
  //   }
  // }, [selectedModels, perfData]);

  // useEffect(() => {
  //   console.log('useEffect');

  //   // queryFansPerfData(selectedModels).then((res) => {
  //   //   console.log('queryFansPerfData res.data');
  //   //   console.log(res.data);
  //   //   setPerfData(res.data);
  //   // });
  // }, [selectedModels, perfData]);

  const onChangexAxis = (e: string) => {
    setxAxis(e);
    let xAxis = JSON.stringify(e);
    sessionStorage.setItem('xAxis', xAxis);
  };
  const onChangeyAxis = (e: string[]) => {
    setyAxis(e);
    let yAxis = JSON.stringify(e);
    sessionStorage.setItem('yAxis', yAxis);
  };

  const generateSeries = (x: string, yList: string[], selectedModels: string[], perfData: {}) => {
    console.log('generateSeries perfData');
    console.log(perfData);
    // console.log('generateSeries selectedModels');
    // console.log(selectedModels);
    let seriesData: {}[] = [];
    let dataList = [];
    let colorIndex = 0;
    let legendData: string[] = [];
    for (var i = 0; i < selectedModels.length; i++) {
      legendData.push(selectedModels[i]);
    }
    selectedModels.forEach((model) => {
      const d = perfData[model];
      // console.log('d');
      // console.log(d);

      //   const d = data[model];
      if (d && Object.keys(d).length != 0) {
        for (let i = 0; i < yList.length; i++) {
          let tempData = [];

          for (let j = 0; j < d[x].length; j += 1) {
            tempData.push([d[x][j], d[yList[i]][j]]);
          }
          // console.log('tempData');
          // console.log(tempData);

          dataList.push(tempData);
          //实际散点数据
          seriesData.push({
            // '实际数据' +
            name: model, //+ '-' + legendDict[yList[i]]
            type: 'scatter',
            clip: true,
            data: tempData,
            xAxisIndex: i,
            yAxisIndex: i,
            encode: {
              x: 0,
              y: 1,
              label: 2,
              tooltip: 1,
            },
            symbolSize: 9,
            color: colors[colorIndex],
            // tooltip: {
            //   trigger: 'item',
            //   // formatter: '{a}:({c})',
            //   axisPointer: {
            //     type: 'line',
            //     snap: true
            //   },
            // },
          });
          // console.log('tempData');
          // console.log(tempData);

          let fitData = [];
          var myRegression = ecStat.regression('polynomial', tempData, 2);
          // console.log('myRegression');
          // console.log(myRegression.parameter);
          let temp = [];
          for (let i = 0; i < d[x].length; i++) {
            temp.push(d[x][i]);
          }
          const sortData = temp.sort(function (a: number, b: number) {
            return a - b;
          });
          const min = sortData[0];
          const max = sortData[temp.length - 1];
          const an = myRegression.parameter;

          for (let x = min; x < max; x += 0.01) {
            const y = (an[2] * x * x + an[1] * x + an[0]).toFixed(3);
            fitData.push([x, y]);
          }
          //拟合数据
          seriesData.push({
            name: model, //+ '-' + legendDict[yList[i]]
            type: 'line',
            xAxisIndex: i,
            yAxisIndex: i,
            showSymbol: false,
            clip: true,
            data: fitData,
            smooth: true,
            color: colors[colorIndex],
          });
        }
      }
      colorIndex++;
    });
    if (expect != undefined) {
      let expectIndex = yList.indexOf('fullPressure');
      if (expectIndex != -1) {
        legendData.push('预期-流量压力');

        // console.log('expect');
        // console.log(expect);
        // console.log('expectIndex');
        // console.log(expectIndex);
        seriesData.push({
          name: '预期-流量压力',
          type: 'scatter',
          xAxisIndex: expectIndex,
          yAxisIndex: expectIndex,
          color: expectColors[expectIndex],
          //color 与y轴数据相关
          showSymbol: false,

          clip: true,
          data: [[expect?.flowRate, expect?.pressure]],
        });
      }

      expectIndex = yList.indexOf('shaftPower');
      if (expectIndex != -1) {
        legendData.push('预期-流量轴功率');

        // console.log('expect');
        // console.log(expect);
        // console.log('expectIndex');
        // console.log(expectIndex);
        seriesData.push({
          name: '预期-流量轴功率',
          type: 'scatter',
          xAxisIndex: expectIndex,
          yAxisIndex: expectIndex,
          color: expectColors[expectIndex],
          //color 与y轴数据相关
          showSymbol: false,
          clip: true,
          data: [[expect?.flowRate, expect?.usefulWork]],
        });
      }
    }

    // console.log('seriesData');
    // console.log(seriesData);

    // console.log('dataList');
    // console.log(dataList);
    // return dataList;
    let legend = { data: legendData };
    legend['selected'] = {
      '预期-流量轴功率': false,
    };
    return {
      series: seriesData,
      legend: legend,
    };
    // return seriesData;
  };
  //https://www.rapidtables.org/zh-CN/web/color/html-color-codes.html
  const colors = ['#229453', '#2983bb', '#bf3553', '#6f70C6'];
  const legendDict = {
    flowRate: '流量m³/s',
    fullPressure: '压力Pa',
    shaftPower: '轴功率kw',
    fanEff: '风机效率%',
  };
  let o = {
    color: colors,
    tooltip: {
      trigger: 'axis', //
      // formatter: '{a}:({c})',
      axisPointer: {
        type: 'cross', //line cross none
        snap: true,
      },
    },

    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false, title: '查看源数据' },
        restore: { show: true },
        saveAsImage: { title: '重新加载', show: false },
        myTool1: {
          show: true,
          // title: '下载',
          // icon: 'image://data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7',
          icon: 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjgzNjEzODY1NTk2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE1MzkiIHdpZHRoPSIyMjAiIGhlaWdodD0iMjIwIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHBhdGggZD0iTTg5NiA2NzJjLTE3LjA4OCAwLTMyIDE0LjkxMi0zMiAzMnYxMjhjMCA2LjQtNC4yODggMTAuNjg4LTEwLjY4OCAxMC42ODhIMTcwLjY4OGMtNi40IDAtMTAuNjg4LTQuMjg4LTEwLjY4OC0xMC42ODh2LTEyOGMwLTE3LjA4OC0xNC45MTItMzItMzItMzJzLTMyIDE0LjkxMi0zMiAzMnYxMjhjMCA0MC41MTIgMzQuMTEyIDc0LjY4OCA3NC42ODggNzQuNjg4aDY4Mi42MjRjNDAuNTc2IDAgNzQuNjg4LTM0LjE3NiA3NC42ODgtNzQuNjg4di0xMjhjMC0xNy4wODgtMTQuOTEyLTMyLTMyLTMyeiBtLTQwNy40ODggNTUuNDg4YzYuNCA2LjQgMTQuOTc2IDguNTEyIDIzLjQ4OCA4LjUxMmEzMi4wNjQgMzIuMDY0IDAgMCAwIDIzLjQ4OC04LjUxMkw3NDguOCA1MTQuMTEyYzEyLjgtMTIuOCAxMi44LTMyIDAtNDQuOC0xMi44LTEyLjgtMzItMTIuOC00NC44IDBMNTQ2LjExMiA2MjcuMlYxNzAuNjg4YzAtMTcuMDg4LTE0LjkxMi0zMi0zMi0zMi0xNy4wMjQgMC0zNC4xMTIgMTQuOTEyLTM0LjExMiAzMlY2MjcuMkwzMjIuMTEyIDQ2OS4zMTJjLTEyLjgtMTIuOC0zMi0xMi44LTQ0LjggMC0xMi44IDEyLjgtMTIuOCAzMiAwIDQ0LjhsMjExLjIgMjEzLjM3NnoiIHAtaWQ9IjE1NDAiIGZpbGw9IiM4YThhOGEiPjwvcGF0aD48L3N2Zz4=',
          onclick: function () {
            var img = new (Image as any)();
            echartsInstance?.resize({ width: 740 });
            const imageUrl = echartsInstance.getDataURL({
              // pixelRatio: 1,
              backgroundColor: '#fff',
              excludeComponents: ['toolbox'], // 忽略组件的列表，
            });
            echartsInstance?.resize({ width: 'auto' });

            img.src = imageUrl;
            downloadIamge(imageUrl, `性能曲线图对比图.png`);
            const generalParams = {
              monitorModule: '风机平台',
              pageUrl: window.location.href,
              pageName: '风机平台',
              pageArea: '相似设计',
              actionModel: selectedModels.toString(),
            };
            const params = {
              ...generalParams,
              actionId: `fan_${2}_性能曲线图_下载`,
              actionType: '下载',
              actionName: '性能曲线图下载',
              description: `下载性能曲线对比图_` + selectedModels.toString(),
            };
            saveUserAction({ params }).catch((e) => {});
          },
        },
      },
    },
    legend: {
      // data: selectedModels,
      // '压力', '轴功率', '风机效率'
      //.forEach(model => {
      // })
    },
    // 图表标题
    // title: title,
    xAxis: {
      type: 'value',
      name: legendDict[xAxis],
      axisLine: {
        show: true,
        // lineStyle: {
        //   color: colors[i],
        // },
      },
      axisLabel: {
        formatter: '{value}',
      },
      axisPointer: {
        snap: true,
      },
    },
    yAxis: {
      type: 'value',
      name: legendDict[yAxis[0]],
      axisLine: {
        show: true,
        // lineStyle: {
        //   color: colors[i],
        // },
      },
      axisLabel: {
        formatter: '{value}',
      },
      axisPointer: {
        snap: true,
      },
    },

    dataZoom: [
      {
        show: true,
        type: 'inside',
        filterMode: 'none',
        xAxisIndex: [0],
      },
      {
        show: true,
        type: 'inside',
        filterMode: 'none',
        yAxisIndex: [0],
      },
      {
        show: true,
        type: 'inside',
        filterMode: 'none',
        xAxisIndex: [1],
      },
      {
        show: true,
        type: 'inside',
        filterMode: 'none',
        yAxisIndex: [1],
      },
      {
        show: true,
        type: 'inside',
        filterMode: 'none',
        xAxisIndex: [2],
      },
      {
        show: true,
        type: 'inside',
        filterMode: 'none',
        yAxisIndex: [2],
      },
    ],
    // grid: gridOption.slice(0, yAxis.length),
    series: [],
  };
  const getOption = (xAxis: string, yAxis: string[], selectedModels: string[], perfData: {}) => {
    // console.log('getOption');
    // for (let i = 0; i < selectedModels.length; i++) {
    //   const data = perfData[selectedModels[i]];
    //   if (data == undefined) {
    //     console.log('data == undefined');
    //     return o;
    //   }
    // }
    const graphNum = yAxis.length;
    const xAxisOption = [];
    const yAxisOption = [];
    // 调整每个图表的位置
    const s = 8;
    const h = s * (graphNum + 1);
    const t = Math.round((100 - h) / graphNum);
    const gridValue = [];
    for (let i = 0; i < graphNum; i++) {
      gridValue[i] = s * (i + 1) + t * i;
    }
    // console.log('gridValue');
    // console.log(gridValue);
    const gridOption = [];
    for (let i = 0; i < graphNum; i++) {
      gridOption.push({
        top: gridValue[i] + '%',
        bottom: gridValue[graphNum - i - 1] + '%',
      });
    }
    // console.log('gridOption');
    // console.log(gridOption);
    // console.log('selectedModels');
    // console.log(selectedModels);
    // console.log('selectedModels[0]');
    // console.log(selectedModels[0]);
    // console.log('perfData');
    // console.log(perfData);
    const data = perfData[selectedModels[0]];
    // console.log('data');
    // console.log(data);
    // console.log('data[xAxis]');
    // console.log(data[xAxis]);
    for (let i = 0; i < graphNum; i++) {
      // title.push({
      //   top: (gridValue[i] - 5) + '%',
      //   left: 'center',
      //   text: legendDict[yAxis[i]]
      // })
      // console.log('selectedModels');
      // console.log(selectedModels);

      // console.log('perfData[selectedModels[i]]');
      // console.log(perfData[selectedModels[i]]);
      // console.log(perfData[selectedModels[i]][xAxis]);
      // const min = perfData[selectedModels[i]][xAxis][0];
      // const i = perfData[xAxis].length - 1;

      // const max = perfData[xAxis][i];
      // const inteval = fixNumFunc((max - min) / perfData[xAxis].length, 3);
      xAxisOption.push({
        type: 'value',
        name: legendDict[xAxis],
        axisLine: {
          show: true,
          // lineStyle: {
          //   color: colors[i],
          // },
        },
        axisLabel: {
          formatter: '{value}',
        },
        // TODO:
        scale: true,

        // min: function (value) {
        //   // console.log(value);
        //   // console.log('data');
        //   // console.log(data);
        //   // console.log('data[xAxis]');
        //   // console.log(data[xAxis]);
        //   if (data != undefined && data[xAxis] != undefined) {
        //     const inteval = fixNumFunc((value.max - value.min) / data[xAxis].length, 3);
        //     const minNum = value.min - inteval > 0 ? value.min - inteval : 0;
        //     // console.log(minNum);

        //     return minNum;
        //   } else {
        //     return value.min;
        //   }
        // },
        // max: function (value) {
        //   if (data != undefined && data[xAxis] != undefined) {
        //     const inteval = fixNumFunc((value.max - value.min) / data[xAxis].length, 3);
        //     const maxNum = value.max + inteval;
        //     return maxNum;
        //   } else {
        //     return value.max;
        //   }
        // },
        // ...data['scaleX'],
        gridIndex: i,
        axisPointer: {
          snap: true,
        },
      });
      // console.log('xAxisOption');
      // console.log(xAxisOption);

      yAxisOption.push({
        type: 'value',
        name: legendDict[yAxis[i]],
        // position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
          // lineStyle: {
          //   color: colors[i],
          // },
        },
        axisLabel: {
          formatter: '{value}',
        },
        gridIndex: i,
        scale: true,
      });
    }
    const result = generateSeries(xAxis, yAxis, selectedModels, perfData);
    let series = perfData == undefined ? [] : result.series;
    (o.grid = gridOption.slice(0, yAxis.length)),
      (o.xAxis = xAxisOption),
      (o.yAxis = yAxisOption),
      (o.series = series),
      (o.legend = result.legend);
    // console.log('o');
    // console.log(o);
    return o;
  };
  return (
    <>
      <ProCard title="" headerBordered>
        <>
          <Row justify={'space-around'} align="middle">
            <Col span={10}>
              <Title level={4}></Title>
              横轴：
              <Select
                defaultValue={xAxis}
                style={{ width: 240 }}
                onChange={onChangexAxis}
                options={[
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
                ]}
              />
            </Col>
            <Col span={10}>
              <Title level={4}></Title>
              纵轴：
              <Select
                mode="multiple"
                defaultValue={yAxis}
                style={{ width: 240 }}
                onChange={onChangeyAxis}
                options={[
                  // {
                  //   value: 'flowRate',
                  //   // value: '流量',
                  //   label: '流量',
                  // },
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
                ]}
              />
            </Col>
          </Row>
          {selectedModels.length != Object.keys(perfData).length ? null : (
            <ReactEcharts
              notMerge={false}
              // 可选，是否不跟之前设置的 option 进行合并，默认为 false，即合并。
              option={getOption(xAxis, yAxis, selectedModels, perfData)}
              lazyUpdate={true}
              // 可选，在设置完 option 后是否不立即更新图表，默认为 false，即立即更新。
              // style={{ height: '1200px' }}
              style={{ height: 400 * yAxis.length + 'px' }}
              ref={(e) => {
                let echartRef = e;
                if (echartRef != null) {
                  const echartsInstanceTemp = echartRef?.getEchartsInstance();
                  setEchartsInstance(echartsInstanceTemp);
                }
              }}
            />
          )}
        </>
      </ProCard>
    </>
  );
};

export default PerfCurveCompare;
