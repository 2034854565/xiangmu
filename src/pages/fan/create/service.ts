import { result } from 'lodash';
import { request } from 'umi';

export async function getMethodCategory() {
  return request('/imip/methods/category', {
    method: 'GET',
  });
}

export async function createMethodData(params: any, status: any) {
  console.log(params, status);
  return request(`/imip/methods/add?status=${status}`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getConnectCase() {
  return request('/imip/case/connection', {
    method: 'GET',
  });
}

export async function getConnetKnowledge() {
  return request('/imip/knowledge/connection', {
    method: 'GET',
  });
}

export async function getMethodById(params: any) {
  return request('/imip/methods', {
    method: 'GET',
    params,
  });
}

export async function getFanCategoryData() {
  return await request('/api/fan/category/all', {
    method: 'GET',
    // data: params,params: any
  });
}
export async function getFanCategoryGroup() {
  return await request('/api/fan/category/group', {
    method: 'GET',
    // data: params,params: any
  });
}
export async function getFanApplicationModelData() {
  return await request('/api/fan/appl/all', {
    method: 'GET',
    // data: params,params: any
  });
}
export async function getFanCoolObjectData() {
  return await request('/api/fan/cool/all', {
    method: 'GET',
    // data: params,params: any
  });
}

export async function createFanData1(params: any) {
  return request(
    `/api/fan/add?
  applicationModel=${params.applicationModel}
  &category=${params.category}
  &model=${params.model}
  &coolObject=${params.coolObject}
  &flowRate=${params.flowRate}
  &shaftPower=${params.shaftPower}
  `,
    {
      method: 'POST',
      body: params,
    },
  );
}
export async function createFanData(params: any) {
  const formData = jsToFormData(params);
  // return request<API.ApiResponse>(`/api/fan/add`, {
  //   requestType: 'form',
  //   method: 'POST',
  //   data: formData,
  // });
  const response = await fetch(`/api/fan/add`, {
    headers: {
      token: localStorage.getItem('token'),
    },
    method: 'POST',
    body: formData,
  });
  console.log('response');
  console.log(response);
  return await response.json();
}
export async function addFanPerfData(params: any) {
  const formData = jsToFormData(params);

  const response = await fetch(`/api/fan/addPerfData`, {
    headers: {
      token: localStorage.getItem('token'),
    },
    method: 'POST',
    body: formData,
  });
  console.log('response');
  console.log(response);
  return await response.json();
}

export async function updateFanData(params: any) {
  const formData = jsToFormData(params);
  // console.log("request1 formData.get('outlineFile')");
  // console.log(formData.get('img3d'));
  // console.log(formData.get('outlineFile'));

  const response = await fetch(`/api/fan/update`, {
    headers: {
      token: localStorage.getItem('token'),
    },
    method: 'POST',
    body: formData,
  });
  return await response.json();
}
export async function alterFanData(params: any) {
  const formData = jsToFormData(params);
  // console.log("request1 formData.get('outlineFile')");
  // console.log(formData.get('img3d'));
  // console.log(formData.get('outlineFile'));

  const response = await fetch(`/api/fan/alter`, {
    headers: {
      token: localStorage.getItem('token'),
    },
    method: 'POST',
    body: formData,
  });
  return await response.json();
}
export async function createPerfData(model: string, perfData: {}[]) {
  return request(`/api/perf/add`, {
    method: 'POST',
    data: { model: model, perfData: perfData },
  });
}
//对象转formdata格式
export const jsToFormData = (config: any) => {
  const formData = new FormData();
  // console.log('config');
  // console.log(config);
  //循环传入的值转换formData
  Object.keys(config).forEach((key) => {
    // console.log('key:' + key);

    // fileList转储formdata
    if (Array.isArray(config[key])) {
      console.log('Array.isArray( ' + key + ') ');
      console.log(config[key]);

      for (let i = 0; i < config[key].length; i++) {
        // console.log('config[key][i].originFileOb');
        // console.log(config[key][i].originFileOb);
        if (config[key][i].originFileObj != undefined) {
          formData.append(key, config[key][i].originFileObj);
        } else if (typeof config[key][i] == 'object' && config[key][i].url != undefined) {
          // 修改文件且文件未更新
          console.log('url != undefined');
          console.log('修改文件且文件未更新');
          console.log(config[key][i]);
          if (config[key][i].fileInfo != undefined) {
            formData.append(key, JSON.stringify(config[key][i].fileInfo));
          } else {
            formData.append(key, config[key][i].originFileObj);
          }

          //// formData.append(key, config[key][i]);
          // var objFile = new File([config[key][i].url], 'file.origin');
          // formData.append(key, objFile);
        } else if (typeof config[key][i] == 'object' && config[key][i].uid != undefined) {
          formData.append(key, config[key][i]);
        } else if (typeof config[key][i] == 'object') {
          formData.append(key, JSON.stringify(config[key][i]));
        } else {
          formData.append(key, config[key][i]);
        }
      }
    } else if (typeof config[key] == 'object') {
      formData.append(key, JSON.stringify(config[key]));
    } else if (config[key] != undefined) {
      formData.append(key, config[key]);
    }
  });
  return formData;
};

//formdata转对象格式
export function jsonData(formData: FormData) {
  var jsonData = {};
  formData.forEach((value, key) => (jsonData[key] = value));
  return jsonData;
}
export async function queryAuditRecord(params: { auditBizId: string; auditType: string }) {
  return request(`/api/getAuditRecord`, {
    method: 'POST',
    data: params,
  });
}
