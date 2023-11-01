/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-02-13 14:13:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-08 16:10:05
 */
export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}
// export const groupIdOptions = ['level', 'post', 'line', 'department', '应用车型'];
export const groupIdOptions = [
  {
    label: 'level',
    value: 'level',
  },
  { label: 'post', value: 'post' },
  { label: 'line', value: 'line' },
  // { label: 'department', value: 'department' },
  { label: '应用车型', value: '应用车型' },
  { label: '冷却对象', value: '冷却对象' },
  // { label: '风机类型', value: '风机类型' },
];
export interface TableListItem {
  id: int;
  groupId: String;
  key: String;
  value: String;
}
export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

// 添加用户
export interface TableListParams {
  ids: string;
  id: string;
}
// 删除用户
export interface DeleteListParams {
  ids: string;
  // id: string,
}

//  批量删除用户
export interface DeleteBatchParams {
  ids: string;
}
// 编辑用户
export interface EditParams {
  id: string;
  realName: string;
  account: string;
  phone: string;
  email: string;
  // password: string;
  sex: string;
  userRoleId: number;
  // userInfo: any;
  jobAge: number;
  oraCode: string;
  level: string;
}

//给指定用户添加对应的部门
export interface AddDepartParams {
  departIdList: Array;
  userId: string;
}

// 修改密码
export interface UpdataPasswordParams {
  id: number;
  account: string;
  password: string;
}
//excel导入用户信息的表头
export const excelTableColumns = {
  用户帐号: 'account',
  登录密码: 'password',
  用户姓名: 'realName',
  角色编码: 'roleCode',
  生日: 'birthday',
  性别: 'sex',
  邮箱: 'email',
  手机号码: 'phone',
  部门: 'department',
  产品线: 'line',
  职位: 'post',
  技术层级: 'level',
  工作年限: 'jobAge',
};
export const excelFieldColumns = {
  account: '用户帐号',
  password: '登录密码',
  realName: '用户姓名',
  roleCode: '角色编码',
  birthday: '生日',
  sex: '性别',
  email: '邮箱',
  phone: '手机号码',
  department: '部门',
  line: '产品线',
  post: '职位',
  level: '技术层级',
  jobAge: '工作年限',
};
