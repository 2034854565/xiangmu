import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import 'antd/dist/antd.css';
import Excel from 'exceljs';

/**
  text?: string // 下载按钮内文字
  icon?: string // 按钮 icon
  size?: string // 按钮尺寸
  type?: string // 按钮类型
  execlTitle?: string // 导出execl文件名
  tableColumns: [] // 表头
  selectedUrl: string // 接口地址url
 */
// https://www.cnblogs.com/cckui/p/13385618.html
const ExportExcel = ({
  size = 'default',
  text = '导出',
  type = 'default',
  execlTitle = '表格数据',
  data = {
    total: 0,
    columns: [],
    rows: [],
  },
}) => {
  const [isLoading, setLoading] = useState(false);
  //   const [tableRows, setTableData] = useState([]);
  //   const [tableColumns, setTableColumns] = useState([]);
  //   setTableColumns(data && data.columns);
  //   useEffect(() => {
  //     setLoading(true);

  //     setTableColumns(data && data.columns);
  //     setTableData(data && data.rows);
  //   }, [data]);
  const tableColumns = data && data.columns;
  const tableRows = data && data.rows;
  //   console.log('tableColumns');
  //   console.log(tableColumns);
  //   console.log('tableRows');
  //   console.log(tableRows);

  // 执行下载表格
  const fetchTableDatas = () => {
    message.info('下载中，请稍侯...');
    setLoading(true);
    // 初始化 创建工作簿
    const workbook = new Excel.Workbook();
    // 设置工作簿属性
    workbook.creator = 'admin';
    workbook.lastModifiedBy = 'admin';
    workbook.created = new Date();
    workbook.modified = new Date();

    // 添加工作表
    let sheet = workbook.addWorksheet('sheet');

    let columns = [];
    // 表头格式化
    tableColumns.map((item) => {
      columns.push({
        header: item.title,
        key: item.key || item.dataIndex,
        width: parseInt(item.width / 6, 10) || 40,
      });
      return true;
    });
    // 添加表头
    sheet.columns = columns;
    if (Array.isArray(tableRows)) {
      // 添加表格数据
      sheet.addRows(tableRows);

      // 设置每一列样式 居中
      const row = sheet.getRow(1);
      row.eachCell((cell, rowNumber) => {
        sheet.getColumn(rowNumber).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      });

      // 将表格数据转为二进制
      workbook.xlsx.writeBuffer().then((buffer) => {
        writeFile(`${execlTitle}.xls`, buffer);
      });
      setLoading(false);
    } else {
      alert('下载失败');
    }
  };

  // 将二进制转为Excel并下载
  const writeFile = (fileName, content) => {
    let a = document.createElement('a');
    let blob = new Blob([content], { type: 'text/plain' });

    a.download = fileName;
    a.href = URL.createObjectURL(blob);

    a.click();
  };

  return (
    <Button type={type} size={size} loading={isLoading} onClick={fetchTableDatas}>
      {isLoading ? '正在导出' : text}
    </Button>
  );
};

export default ExportExcel;
