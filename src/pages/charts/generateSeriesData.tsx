import * as echarts from 'echarts';
import ecStat from 'echarts-stat';
echarts.registerTransform(ecStat.transform.regression);
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
const pressureRange = [1100, 1300];
const generateSeriesData = (data: any, x: string, yList: string[]) => {
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
    // 拟合方程系数
    const an = myRegression.parameter;

    // console.log('myRegression');
    // console.log(myRegression.parameter);
    let R2 = 0;
    let SStot = 0;
    let SSres = 0;

    // 计算R方
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
      tempData.push([data[x][j], data[yList[i]][j]]);
    }
    seriesData.push({
      // '实际数据-' +
      name: '实际散点数据',
      type: 'scatter',
      yAxisIndex: yIndex,
      showSymbol: false,
      // showSymbol:true,
      clip: true,
      data: tempData,
      // symbol: shapes[2 * i],
      // symbol:'rect',
      color: colors[2 * i],
      symbolSize: 8,
      animation: false,
    });
    seriesData.push({
      name: '拟合数据',
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
  return seriesData;
};
