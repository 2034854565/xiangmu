import React, { useState, useReducer } from 'react';
import { Button, Alert, Table, Badge, Input, Upload } from 'antd';
import CommonTable from '@cps/CommonTable';
import styles from './receive.less';
import { UploadOutlined } from '@ant-design/icons';
import mammoth from 'mammoth';
function reducer(state: any, action: any) {
  return {
    ...state,
    ...action.data
  };
}
const NovelAnalyze = () => {
  const [state, dispatch] = useReducer(reducer, {
    content: ''
  });
  const getTextInfo = (file: any) => {
    const reader = new FileReader();
    reader.readAsText(file, 'gb2312');
    reader.onload = (result: any) => {
      console.log(result);
      let targetNum = result.target.result;
      console.log(targetNum);
    };
    return false;
  };
  // const getWordInfo = (file: any) => {
  //   const reader = new FileReader();
  //   reader.onload = function(loadEvent: any) {
  //     const arrayBuffer = loadEvent.target['result'];
  //     mammoth
  //       .extractRawText({ arrayBuffer: arrayBuffer })
  //       .then(function(resultObject) {
  //         console.log('extractRawText', resultObject.value);
  //       })
  //       .done();
  //   };
  //   reader.readAsArrayBuffer(file);
  //   return false;
  // };
  return (
    <div>
      <ul className={styles.optionBtnList}>
        <li>
          <Button type='primary'>导出</Button>
          <Upload action='' accept='text/plain' beforeUpload={getTextInfo} showUploadList={false}>
            <Button>
              <UploadOutlined />
              上传txt文件
            </Button>
          </Upload>
          {/* <Upload
            action=''
            accept='.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            beforeUpload={getWordInfo}
            showUploadList={false}
          >
            <Button>
              <UploadOutlined />
              上传word文件
            </Button>
          </Upload> */}
          <Button type='primary'>导入word</Button>
        </li>
      </ul>
    </div>
  );
};
export default NovelAnalyze;