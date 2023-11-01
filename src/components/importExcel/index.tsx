import React, { useState } from 'react';
import { Button, message, Modal, Popover, Radio, Row, Table, Upload } from 'antd';
import * as XLSX from 'xlsx';
import ProTable from '@ant-design/pro-table';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import moment from 'moment';
interface importExcelProps {
  fileName: string; // 下载文件名(默认：download)
  sheetName: string; // sheet名字(可有可无)(默认sheet1)
  sheetHeader: any[]; // 标题（excel第一行数据）
  sheetData: any[]; // 数据源(必须)
  sheetFilter: any[]; // 列过滤(只有在data为object下起作用)(可有可无)
}
// 定义参数类型
interface ImportExcel {
  propTypes: {
    // 模板下载地址
    // templateHref: PropTypes.string.isRequired,
    // 上传地址
    // url: PropTypes.string.isRequired,
    // 导入成功后的回调
    // importSuccessCallback: PropTypes.func
  };
}
// : ProColumns < TableListItem > []

const ImportExcel: React.FC<{
  text?: string | '导入';
  tipContent?: any;
  // title: string[]; //excel表头,预览表头,
  // dataIndex: string[]; //对应数据库字段
  excelTableColumns: {};
  secondExcelTableColumns?: {};
  isPreview?: boolean; //是否开启excel导入后的表格预览
  isSelectRow?: boolean; //开启表格预览后，开启单选，只传选中数据
  getExcelData: Function; //父组件获取读取数据
  submitExcelData?: Function;
  sheetNum?: number;
}> = (props) => {
  const {
    excelTableColumns,
    secondExcelTableColumns,
    tipContent,
    getExcelData,
    submitExcelData,
    sheetNum,
  } = props;
  // console.log('sheetNum');
  // console.log(sheetNum);

  let { text = '导入', isPreview = false, isSelectRow = false } = props;
  const getColumns = (excelTableColumns: {}) => {
    let title = [];

    for (let key in excelTableColumns) {
      title.push(key.toString());
    }
    let columns: {}[] = [];
    // if (title.length != dataIndex.length) {
    //   return null;
    // }
    for (let i = 0; i < title.length; i++) {
      if (title[i] == '转速(r/min)') {
        // columns.push({
        //   title: title[i],
        //   render: (text: any, record: any, index: number) => {
        //     if (record.motorSpeed == undefined) {
        //       return record.motorSpeedMin;
        //     } else {
        //       return record.motorSpeedMin + '/' + record.motorSpeed;
        //     }
        //   },
        // });
        columns.push({ title: title[i], dataIndex: excelTableColumns[title[i]] });
      } else {
        columns.push({ title: title[i], dataIndex: excelTableColumns[title[i]] });
      }
    }
    return columns;
  };

  const [columns, setColumns] = useState<any[]>([]);

  //tableColumns,
  const [wageTableData, setWageTableData] = useState<any[]>([]);
  const [allSheetName, setAllSheetName] = useState<string[]>(['sheet1', 'sheet2']);
  const [allSheetData, setAllSheetData] = useState<{}>({ sheet1: [], sheet2: [] });
  const [choiseSheet, setChoiseSheet] = useState<number>(0);

  // console.log(tableColumns[0].dataIndex);
  const [visable, setVisable] = useState<boolean>(false);
  const [excelHeader, setExcelHeader] = useState<any[]>([]);

  const uploadProps = {
    accept: '.xls,.xlsx,application/vnd.ms-excel',
    showUploadList: false,
    beforeUpload: (file: any) => {
      // console.log('beforeUpload e');

      const f = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const datas = e.target.result;
        const workbook = XLSX.read(datas, {
          type: 'binary',
        });

        if (sheetNum != undefined) {
          // const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const first_worksheet = workbook.Sheets[workbook.SheetNames[sheetNum]];
          const jsonArr = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
          handleImpotedJson(excelTableColumns, jsonArr, file);
        } else {
          console.log('==========');

          console.log(workbook.Sheets);
          let allSheetName = [];
          let result = {};
          console.log('Object.keys(workbook.Sheets).length');
          console.log(Object.keys(workbook.Sheets).length);

          for (let i = 0; i < Object.keys(workbook.Sheets).length; i++) {
            console.log('i', i);

            const worksheet = workbook.Sheets[workbook.SheetNames[i]];

            const jsonArr = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            console.log('jsonArr');
            console.log(jsonArr);
            if (jsonArr.length == 0) {
              continue;
            }

            const jsonArrData = handleImpotedJson(excelTableColumns, jsonArr, file);
            if (jsonArrData == false) {
              continue;
            } else {
              allSheetName.push(workbook.SheetNames[i]);

              result[workbook.SheetNames[i]] = jsonArrData;
            }
          }
          console.log('=====allSheetName==========');
          console.log(allSheetName);
          setAllSheetName(allSheetName);

          console.log('=====setAllSheetData==========');
          console.log(result);
          setAllSheetData(result);
          console.log('==========');
        }
      };
      reader.readAsBinaryString(f);
      return false;
    },
    onRemove: () => {
      setWageTableData([]);
    },
  };
  const handleAllImpotedJson = () => {};
  const handleImpotedJson = (excelTableColumns: any, jsonArr: any, file: any) => {
    let header = jsonArr.splice(0, 1); // 去掉表头
    header = header[0];
    let dataIndex1: string[] = [];
    console.log('header');
    console.log(header);
    if (header == undefined && sheetNum == 1) {
      message.warning('导入请按提供的excel模板格式!');
      return false;
    }

    // for (let i = 0; i < title.length; i++) {
    let i = 0;
    while (header[i] != undefined) {
      // 去除表头空格
      header[i] = header[i].replace(' ', '');
      // 表头校验
      // console.log(Object.keys(excelTableColumns));
      // console.log(header[i]);
      // console.log(Object.keys(excelTableColumns).includes(header[i]));
      if (Object.keys(excelTableColumns).includes(header[i])) {
        dataIndex1.push(excelTableColumns[header[i]]);
      } else if (header[i] == '流量（m3/s）') {
        dataIndex1.push(excelTableColumns['流量(m3/s)']);
      } else {
        // message.warn('上传excel文件表头' + header[i] + '有误，读取失败');
        console.log('上传excel文件表头' + header[i] + '有误，读取失败');

        // dataIndex1 = [];
        // setVisable(false);
        return false;
      }
      i++;
      // if (Object.keys(excelTableColumns).includes(header[i])) {
      //   dataIndex1.push(excelTableColumns[header[i]]);
      // } else if (header[i] == '流量（m3/s）') {
      //   // console.log('dataIndex1');
      //   // console.log(dataIndex1);

      //   dataIndex1.push(excelTableColumns['流量(m3/s)']);
      // } else {
      //   message.warn('上传excel文件表头' + header[i] + '有误，读取失败');
      //   dataIndex1 = [];
      //   setVisable(false);
      //   return;
      // }
      // i++;
    }
    setExcelHeader(excelHeader);
    console.log('jsonArr');
    console.log(jsonArr);
    const jsonArrData = jsonArr.map((item: any, index: number) => {
      const columns = getColumns(excelTableColumns);
      setColumns(columns);

      let jsonObj: any = {};
      jsonObj.key = index + 1;
      // jsonObj.key = 'user-wage-' + index;
      item.forEach((im: any, i: number) => {
        // 保留3位小数
        if (dataIndex1[i] == 'birthday' && typeof im == 'number') {
          console.log('！！！！！！！！！！！');
          console.log(im);
          im = moment('1899-12-30').add(im, 'days').format('YYYY-MM-DD');
        } else if (dataIndex1[i] == 'birthday') {
          let dateReg =
            /^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$/;
          console.log('!dateReg.test(im)');
          console.log(im);
          //日期格式不匹配
          if (!dateReg.test(im)) {
            //日期格式不匹配
            console.log('日期格式不匹配');
            console.log(im);
          }
          console.log(typeof im == 'number');
          console.log(im);
        } else if (typeof im == 'number') {
          im = Math.floor(im * 1000) / 1000;
        }
        // console.log('im');
        // console.log(im);

        // tableColumns[i]
        jsonObj[dataIndex1[i]] = im;
        // jsonObj[dataIndex1[i]] = im;
        // jsonObj[columns[i].dataIndex] = im;
        // }
      });
      // console.log('jsonObj');
      // console.log(jsonObj);

      return jsonObj;
    });

    // console.log('jsonArrData');
    // console.log(jsonArrData);
    // , total: jsonArrData.length, current: 1
    // setWageTableData({ ...jsonArrData });
    if (sheetNum != undefined) {
      let tempData = JSON.parse(JSON.stringify(jsonArrData));
      setWageTableData(tempData);
      getExcelData(jsonArrData);
    }
    setVisable(isPreview);

    return jsonArrData;
  };

  // // 导出Excel表格
  // exportExcel() {
  //     const url = Host + this.props.url + `/export?token=${Cookies.get('token')}&uid=${Cookies.get('uid')}`;
  //     window.open(url);
  // }
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
  };

  //  getExcelData(wageTableData);
  return (
    <>
      <Upload style={{ marginLeft: 10, marginRight: 10 }} key="importExcel" {...uploadProps}>
        <Button>
          {text}
          {tipContent == undefined ? null : (
            <Popover title="注意事项" content={tipContent}>
              <QuestionCircleOutlined />
            </Popover>
          )}
        </Button>
      </Upload>
      <Modal
        forceRender={true}
        width={'max-content'}
        // bodyStyle={{ width: '1500px', overflow: 'anto' }}
        className={styles.modal}
        // wrapClassName={styles.modal}
        // style={{ height: '800px' }}
        // destroyOnClose
        title={'文件预览'}
        open={visable}
        // closable
        // centered
        onCancel={() => {
          setVisable(false);
        }}
        okText="确认"
        okButtonProps={{
          onClick: (e) => {
            console.log(e);

            console.log('ok');
            setVisable(false);
            if (sheetNum != undefined) {
              submitExcelData == undefined ? null : submitExcelData(wageTableData);
            } else {
              getExcelData(allSheetData[allSheetName[choiseSheet]]);
            }
            // getExcelData(wageTableData);
          },
        }}
      >
        {sheetNum != undefined ? null : (
          <>
            <Row>
              <Radio.Group
                onChange={(e) => {
                  const key = e.target.value;
                  console.log(allSheetName[key]);

                  setChoiseSheet(key);
                }}
                value={choiseSheet}
              >
                {allSheetName.map((value, index) => {
                  //                 if (index == 0) {
                  //                   return null;
                  //                 } else {
                  //                   console.log(value);
                  //                   console.log('value');
                  // }
                  return <Radio value={index}>{allSheetName[index]}</Radio>;
                })}
              </Radio.Group>
            </Row>
            <Table columns={columns} dataSource={allSheetData[allSheetName[choiseSheet]]} />
          </>
        )}
        {sheetNum != undefined ? <Table columns={columns} dataSource={wageTableData} /> : null}
        {/* <EditForm title={title} dataIndex={dataIndex} originData={wageTableData} /> */}
      </Modal>
    </>
  );
};

export default ImportExcel;
