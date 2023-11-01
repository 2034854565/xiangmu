export interface SupervisionListItem {
  number: string,
  time: string,
  unit: string,
  major: string,
  remark: string,
  procedure: string,
  isCheck: string,
  score: number,
  money: number,
  workNo: string,
  workName: string,
  situation: string,
  measure: string,
}

export interface Params {
  count: number;
}
