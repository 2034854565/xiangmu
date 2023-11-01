/*
 * @Author: 嘉欣 罗 2592734121@qq.com
 * @Date: 2022-12-29 16:19:50
 * @LastEditors: 嘉欣 罗 2592734121@qq.com
 * @LastEditTime: 2022-12-29 17:27:34
 * @FilePath: \psad-front\src\pages\charts\performanceGraph\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
// import echarts from 'echarts/lib/echarts';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/legend'
// import 'echarts/lib/chart/pie';
const PerformanceGraph1 = (props) => {
  console.log('PerformanceGraph props');
  console.log(props);
  const { x, y } = props;
  let [main, setMain] = useState('');
  const colors = ['#5470C6', '#91CC75', '#EE6666', '#1f1f1f'];

  function func(x: number) {
    x /= 10;
    return Math.sin(x) * Math.cos(x * 2 + 1) * Math.sin(x * 3 + 2) * 50;
  }

  function generateData() {
    let data = [];
    for (let i = 10; i <= 50; i += 0.1) {
      data.push([i, func(i)]);
    }
    // console.log(data);
    return data;
  }
  const generatexAxis = (x: string) => {
    let xAxis = [];
    switch (x) {
      case '流量':
        xAxis.push({
          type: 'value',
          // axisTick: {
          //   alignWithLabel: true,
          // },
          // prettier-ignore
          interval: 0.1, // 步长
          min: 0.4, // 起始
          max: 3.2, // 终止
        });
        break;
      default:
        xAxis.push({
          type: 'value',
          axisTick: {
            alignWithLabel: true,
          },
          // prettier-ignore
          interval: 0.1, // 步长
          min: 0.4, // 起始
          max: 3.2, // 终止
        });
    }
    return xAxis;
  };
  const option = {
    color: colors,

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: {
      right: '20%',
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    legend: {
      data: ['静压', '全压', '轴功率'],
    },
    xAxis: generatexAxis(x),
    yAxis: [
      {
        type: 'value',
        name: '压力Pa',
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[3],
          },
        },
        axisLabel: {
          formatter: '{value}',
        },
        interval: 5, // 步长
        min: 10, // 起始
        max: 50, // 终止
      },
      {
        type: 'value',
        name: '功率kW',
        position: 'right',
        alignTicks: true,
        // offset: 80,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[3],
          },
        },
        axisLabel: {
          formatter: '{value} kW',
        },
      },
    ],
    dataZoom: [
      {
        show: true,
        type: 'inside',
        filterMode: 'none',
        xAxisIndex: [0],
        startValue: -20,
        endValue: 20,
      },
      {
        show: true,
        type: 'inside',
        filterMode: 'none',
        yAxisIndex: [0],
        startValue: -20,
        endValue: 20,
      },
    ],
    series: [
      {
        name: '静压',
        type: 'line',
        yAxisIndex: 0,
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
      },
      {
        name: '全压',
        type: 'line',
        yAxisIndex: 0,
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
      },
      {
        name: '轴功率',
        type: 'line',
        yAxisIndex: 1,
        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
      },
      {
        type: 'line',
        yAxisIndex: 0,

        showSymbol: false,
        clip: true,
        data: generateData(),
      },
    ],
  };
  useEffect(() => {
    var node = document.getElementById('main');
    setMain(node);
  }, [main]);
  if (main !== '') {
    var myChart = echarts.init(main);
    myChart.setOption(option);
  }
  return <div style={{ height: '400px' }} id="main"></div>;
};
export default PerformanceGraph1;
// dataZoom: [
//   {
//     show: true,
//     type: 'inside',
//     filterMode: 'none',
//     xAxisIndex: [0],
//     startValue: -20,
//     endValue: 20,
//   },
//   {
//     show: true,
//     type: 'inside',
//     filterMode: 'none',
//     yAxisIndex: [0],
//     startValue: -20,
//     endValue: 20,
//   },
// ],

// [
//   {
//     name: '压力',
//     type: 'line',
//     yAxisIndex: 0,
//     showSymbol: false,
//     clip: true,
//     data: generateSeries(x, yList)[0],
//     smooth: true,
//   },
//   {
//     name: '轴功率',
//     type: 'line',
//     yAxisIndex: 1,
//     showSymbol: false,
//     clip: true,
//     data: generateSeries(x, yList)[1],
//     smooth: true,
//   },
//   {
//     name: '风机效率',
//     type: 'line',
//     yAxisIndex: 2,
//     showSymbol: false,
//     clip: true,
//     data: generateSeries(x, yList)[2],
//     smooth: true,
//   },
// ],
