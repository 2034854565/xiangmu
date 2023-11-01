export interface CalculationItem {
  flowRate: number; //流量
  // fullPressure?: number; //压力
  // staticPressure?: number; //压力

  pressure: number; //压力
  pressureField?: number; //压力

  motorSpeed: number; //转速
  usefulWork: number; //有用功
  power?: number;
  usefulWork?: number;
  density: number;

  specificSpeed: number; //比转速
  flowCoefficient: number; //流量系数Cv
  pressureCoefficient: number; //压力系数Cp
}
// sortFlowRate: number; //流量
// sortFullPressure: number; //压力
// sortStaticPressure: number; //压力
// sortMotorSpeed: number; //转速
