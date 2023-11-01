import { request } from 'umi';

// export async function queryUserActionList(params: any) {
//     console.log("request1 formData.get('technicalFile')");
//     // const formData = jsToFormData(params);
//     const response = await fetch(`/api/user_action/save`, {
//       method: 'POST',
//       body:params
//     //   body: formData,
//     });
//     // return await response.json();
//   }

// 查询条件
export async function queryUserActionQuery(params?: any) {
    return request('/api/user_action/query_by', {
      method: 'POST',
      data: params,
    });
  }

  export async function queryUserActionList(params?: any) {
    return request('/api/user_action/query_all', {
      method: 'GET',
      params,
    });
  }
