export const fileNameDict = {
  img3d: '三维图',
  outlineFile: '外形尺寸图',
  labReport: '实验报告',
  designSpecification: '设计说明书',
  aerodynamicSketch: '气动略图',
};
// 标准大气压
export const StandardAtmosphericPressure = 101325;

// 保留小数函数
export function fixNumFunc(num: number, fixNum: number | undefined) {
  if (fixNum == undefined) {
    return num;
  } else return Math.round(num * Math.pow(10, fixNum)) / Math.pow(10, fixNum);
}

//get当前大气压
export function getCurrentAtmosphericPressure(height: number, fixNum?: number | undefined) {
  const p = StandardAtmosphericPressure * Math.pow(1 - height / 44308, 5.2553);
  return fixNumFunc(p, fixNum);
}

// get当前密度
export function getCurrentDensity(
  height: number,
  temperature: number,
  fixNum?: number | undefined,
) {
  const currentP = StandardAtmosphericPressure * Math.pow(1 - height / 44308, 5.2553);
  const density = currentP / (287 * (273 + temperature));
  const result = fixNumFunc(density, fixNum);
  return result;
}

//get当前大气压换算至标准状态下大气压
export function CurrentToStandardStateAtmosphericPressureBydensity(
  currentPressure: number,
  currentDensity: number,
  fixNum?: number | undefined,
) {
  const standardDensity = getCurrentDensity(0, 20);
  const standardPressure = (currentPressure * standardDensity) / currentDensity;
  return fixNumFunc(standardPressure, fixNum);
}

// 当前气压=>标准环境下大气压
export function CurrentToStandardStateAtmosphericPressure(
  currentPressure: number,
  height: number,
  temperature: number,
  fixNum?: number | undefined,
) {
  const currentDensity = getCurrentDensity(height, temperature);
  const standardDensity = getCurrentDensity(0, 20);
  const standardPressure = (currentPressure * standardDensity) / currentDensity;
  return fixNumFunc(standardPressure, fixNum);
}

//get当前轴功率换算至标准状态下轴功率

export function CurrentToStandardStatePowerBydensity(
  currentPower: number,

  currentDensity: number,
  fixNum?: number | undefined,
) {
  const standardDensity = getCurrentDensity(0, 20);
  const standardPower = currentPower * (standardDensity / currentDensity);
  return fixNumFunc(standardPower, fixNum);
}
export function CurrentToStandardStatePower(
  currentPressure: number,
  height: number,
  temperature: number,
  fixNum?: number | undefined,
) {
  const currentDensity = getCurrentDensity(height, temperature);
  const standardDensity = getCurrentDensity(0, 20);
  const standardPower = (currentPressure * standardDensity) / currentDensity;
  return fixNumFunc(standardPower, fixNum);
}

// get比转速
export function getSpecificSpeed(
  motorSpeed: number,
  flowRate: number,
  fullPressure: number,
  fixNum?: number,
) {
  const specificSpeed =
    (motorSpeed * 5.54 * Math.pow(flowRate, 0.5)) / Math.pow(fullPressure, 0.75);
  return fixNumFunc(specificSpeed, fixNum);
}

// u
export function getU(motorSpeed: number, impellerDiameter: number, fixNum?: number) {
  const u = (motorSpeed * Math.PI * impellerDiameter) / 60000;
  return fixNumFunc(u, fixNum);
}

// get流量系数
export function getCv(
  flowRate: number,
  motorSpeed: number,
  impellerDiameter: number,
  fixNum?: number,
) {
  const u = getU(motorSpeed, impellerDiameter);
  const Cv = (4000000 * flowRate) / Math.PI / impellerDiameter / impellerDiameter / u;
  return fixNumFunc(Cv, fixNum);
}

// get压力系数
export function getCp(
  fullPressure: number,
  motorSpeed: number,
  impellerDiameter: number,
  fixNum?: number,
) {
  const u = getU(motorSpeed, impellerDiameter);
  const Cp = (2 * fullPressure) / 1.2 / u / u;
  return fixNumFunc(Cp, fixNum);
}

import * as echarts from 'echarts';
import ecStat from 'echarts-stat';
echarts.registerTransform(ecStat.transform.regression);

// 叶轮尺寸相似设计
export function impellerDiameterSimilarDesign(
  flowRateData: number[],
  pressureData: [],
  impellerDia: number,
  originImpellerDia: number,
  x?: number,
) {
  console.log('flowRateData');
  console.log(flowRateData);

  const sdfImp = impellerDia / originImpellerDia;

  let smiliarFlowRate: number[] = [];
  let smiliarPressure: number[] = [];
  let tempData = [];
  flowRateData.map((flowRate) => {
    // for (let j = 0; j < flowRateData.length; j += 1) {
    const temp = flowRate * Math.pow(sdfImp, 3);
    smiliarFlowRate.push(temp);
  });
  // for (let j = 0; j < flowRateData.length; j += 1) {
  //   const temp = smiliarFlowRate[j] * Math.pow(sdfImp, 3);
  //   smiliarFlowRate.push(temp);
  // }
  for (let j = 0; j < pressureData.length; j += 1) {
    let temp = pressureData[j] * Math.pow(sdfImp, 2);

    smiliarPressure.push(temp);
  }

  for (let j = 0; j < smiliarFlowRate.length; j += 1) {
    tempData.push([smiliarFlowRate[j], smiliarPressure[j]]);
  }
  var myRegression = ecStat.regression('polynomial', tempData, 2);
  const an = myRegression.parameter;

  // 计算R方

  return {
    smiliarFlowRate: smiliarFlowRate,
    smiliarPressure: smiliarPressure,
    an: an,
  };
}
