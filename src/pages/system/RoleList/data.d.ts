




export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

// 添加用户
export interface TableListParams {
  ids: string,
  id: string,
}
// 删除用户
export interface DeleteListParams {
  ids: string,
  // id: string,
}

//  批量删除用户
export interface DeleteBatchParams {
  ids: string,
}
// 编辑用户
export interface AditParams {
  id: string,
  username: string,
  realname: string,
  orgCode: string,
  phone: string,
  email: string,
  password: string,
}

//给指定用户添加对应的部门
export interface AddDepartParams {
  departIdList: Array,
  userId: string,
}