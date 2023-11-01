




export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListItem {
  id: String,
  email: String,
  birthday: String,
  avatar: String,
  oraCode: String,
  password: String,
  phone: String,
  realname: String,
  selectedroles: any,
  sex: String,
  username: String,
  updateBy: String,
  updateTime: String
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
  sex: string,
  selectedroles: any
}

//给指定用户添加对应的部门
export interface AddDepartParams {
  departIdList: Array,
  userId: string,
}

// 修改密码
export interface UpdataPasswordParams {
  username: string,
  password: string,

}