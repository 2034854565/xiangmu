export interface QuotaListItem {
  number: string,
  name: string,
  type: string,
  carType: string,
  part: string,
  quota: number,
  unit: string,
  use: string,
  remark: string,
}

export interface Params {
  count: number;
}
