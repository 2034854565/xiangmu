/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-02-13 14:13:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-19 10:38:04
 */
import { message } from 'antd';
import moment from 'moment';
import { request } from 'umi';

// export async function queryFansList(params: any) {
//   return request('/api/fan/show', {
//     method: 'POST',
//     data: params,
//   });
// }
// export async function queryFanData(id: any) {
//   return await request(`/api/fan/detail/${id}`, {
//     method: 'POST',
//     // data: params,params: any
//   });
// }

// export async function deleteMethodsData(params: any) {
//   return request('/imip/methods/delete', {
//     method: 'POST',
//     data: params,
//   });
// }
export async function download(path: string) {
  path = path + '?v=' + moment();

  // //添加请求头
  // request.interceptors.request.use((url,options) => {
  //   //判断本地session是否有数据，如果有就得到token，并付给请求头
  //   if(sessionStorage.getItem('data') != null){
  //   //获取到存在本地session里存的数据
  //   let token = localStorage.getItem('token') ;
  //   //转换获取到的数据格式，得到里面的token
  //   const headers = {
  //    Authorization:token
  //   }
  //   return {
  //     url,
  //     options:{...options,headers}
  //   }
  //   }
  // });
  return request(`/api/download/${path}`, {
    // headers: { token: localStorage.getItem('token') },
    method: 'GET',
    // data: params,
    responseType: 'blob', // 必须注明返回二进制流
  });
}
export async function downloadFile(path: string) {
  message.loading('下载中...');
  console.log('downloadFile path');
  // console.log(path);
  if (path.indexOf('/api/download/') == 0) {
    path = path.substring(14);
  }
  console.log('path');
  console.log(path);
  // path = path + '?' + Math.random();
  // console.log('!!!!!!!!!!!!!!!path');
  // console.log(path);

  download(path)
    .then((blob) => {
      const fileName = path.split('/').pop();

      //const blob = new Blob(binaryData, { type: "multipart/form-data" })
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement('a');
        const evt = document.createEvent('MouseEvents');
        link.style.display = 'none';
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link); // 此写法兼容可火狐浏览器
        evt.initEvent('click', false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);
      }
    })
    .catch(() => {
      message.error('下载出错!');
    });
}
export async function download1(path: string, name: string) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    responseType: 'blob',
  };

  fetch(path, requestOptions)
    .then((response) => response.blob())
    .then((blob) => {
      const fileName = name;
      //const blob = new Blob(binaryData, { type: "multipart/form-data" })
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement('a');
        const evt = document.createEvent('MouseEvents');
        link.style.display = 'none';
        let binaryData = [];
        binaryData.push(blob);
        link.href = window.URL.createObjectURL(new Blob(binaryData));

        // link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link); // 此写法兼容可火狐浏览器
        evt.initEvent('click', false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);
      }
    })
    .catch((error) => {
      console.log('error', error);
      message.error('下载出错!');
    });
}
export async function downloadFile1(path: string, name: string) {
  message.loading('下载中...');
  // setTimeout(() => {}, 5000);
  download1(path, name);
}
// 用户行为数据存储接口
// export async function saveUserAction(params: any) {
//   return request(`/api/user_action/save`, {
//     method: 'POST',
//     data: params,
//   });
// }
