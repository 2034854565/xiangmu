import { getCp, getCv, getSpecificSpeed, getU } from '@/pages/fan/components/utils';
import { PerfDataItem } from '@/pages/fan/data';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { EditableProTable, ProCard, ProFormField } from '@ant-design/pro-components';
import { Col, Descriptions, Divider, InputRef, Row, Table } from 'antd';
import React, { useRef, useState } from 'react';
import styles from './style.less';
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type EditPerfDataItem = {
  key: string;
  model?: string;

  flowRate?: number;
  fullPressure?: number;
  staticPressure?: number;
  fanEff?: number;
  staticPressureEff?: number;

  shaftPower?: number;
  motorSpeed?: number;
  impellerDiameter?: number;
  specificSpeed?: number;
  u?: number;
  flowCoefficient?: number; //流量系数Cv
  pressureCoefficient?: number; //压力系数Cp
};

const EditForm: React.FC<{
  title: string[]; //excel表头,预览表头,
  dataIndex: string[]; //对应数据库字段,
  excelTableColumns: {};

  defaultData: EditPerfDataItem[];
  setExcelData2: Function;
  actionRef: any;
  form: any;
  calculate: boolean;
}> = (props) => {
  const { excelTableColumns, defaultData, setExcelData2, actionRef, form, calculate } = props;
  console.log('defaultData');
  console.log(defaultData);

  let calculatedData: {}[] = [];
  let i = 0;
  if (defaultData != undefined) {
    defaultData.forEach((data: PerfDataItem) => {
      const u = getU(data.motorSpeed, data.impellerDiameter, 3);
      const specificSpeed = getSpecificSpeed(data.motorSpeed, data.flowRate, data.fullPressure, 3);
      const Cv = getCv(data.flowRate, data.motorSpeed, data.impellerDiameter, 3);
      const Cp = getCp(data.fullPressure, data.motorSpeed, data.impellerDiameter, 3);
      calculatedData.push({
        specificSpeed: specificSpeed,
        u: u,
        flowCoefficient: Cv,
        pressureCoefficient: Cp,
      });

      defaultData[i].key = i.toString();
      defaultData[i].specificSpeed = specificSpeed;
      defaultData[i].u = u;
      defaultData[i].flowCoefficient = Cv;
      defaultData[i].pressureCoefficient = Cp;
      i++;
    });
  }

  const columns: ProColumns<EditPerfDataItem>[] = [];
  let title = [];
  for (let key in excelTableColumns) {
    title.push(key.toString());
  }
  // console.log(title);
  for (let i = 0; i < 9; i++) {
    columns.push({
      title: title[i],
      dataIndex: excelTableColumns[title[i]],
      valueType: 'digit',
      formItemProps:
        excelTableColumns[title[i]] == 'noise'
          ? undefined
          : {
              rules: [
                {
                  required: true,
                  message: '此项为必填项',
                },
                ({ getFieldValue }) => ({
                  validator(rule: any, value: number) {
                    // console.log('validator value');
                    // console.log(value);
                    // console.log("getFieldValue('motorSpeed')");
                    // console.log(getFieldValue('motorSpeed'));
                    if (
                      ['fullPressure', 'staticPressure', 'impellerDiameter', 'motorSpeed'].includes(
                        excelTableColumns[title[i]],
                      )
                    ) {
                      if (value == 0) {
                        return Promise.reject(' 不能为0');
                      }
                      if (isNaN(value)) {
                        return Promise.reject('无效值');
                      }
                    }
                    // form.validateFields(['motorSpeed']);
                    return Promise.resolve();
                  },
                }),
              ],
            },
      width: 80,
    });
  }
  columns.push({
    title: '操作',
    valueType: 'option',
    width: 100,
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.key);
        }}
      >
        编辑
      </a>,
      <EditableProTable.RecordCreator
        key="copy"
        record={{
          ...record,
          key: (Math.random() * 1000000).toFixed(0),
        }}
      >
        <a>复制</a>
      </EditableProTable.RecordCreator>,
    ],
  });
  const columns1: ProColumns<EditPerfDataItem>[] = [];
  for (let i = 9; i < title.length; i++) {
    columns1.push({
      title: title[i],
      dataIndex: excelTableColumns[title[i]],
      //   width: 80,
    });
  }
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.key),
  );
  const [dataSource, setDataSource] = useState<readonly EditPerfDataItem[]>(() => defaultData);
  // console.log('dataSource');
  // console.log(dataSource);
  //   const actionRef = useRef<ActionType>();
  //   const [form] = Form.useForm();
  return (
    <>
      <Row>
        <Col span={calculate == true ? 16 : 24}>
          <EditableProTable<EditPerfDataItem>
            rowKey="key"
            scroll={{
              x: 960,
            }}
            className={styles.myTable1}
            bordered
            actionRef={actionRef}
            // headerTitle="实验数据"
            columns={columns}
            maxLength={5}
            // 关闭默认的新建按钮
            recordCreatorProps={false}
            // recordCreatorProps={{
            //   newRecordType: 'dataSource',
            //   record: () => ({
            //     key: Date.now(),
            //     // flowRate: 0,
            //     // fullPressure: 0,
            //     // staticPressure: 0,
            //     // fanEff: 0,
            //     // staticPressureEff: 0,
            //     // shaftPower: 0,
            //     // motorSpeed: 0,
            //     // impellerDiameter: 0,
            //     // specificSpeed: 0,
            //     // u: 0,
            //     // flowCoefficient: 0,
            //     // pressureCoefficient: 0,
            //   }),
            // }}
            // request={async () => {
            //   const result = {
            //     data: defaultData,
            //     total: 3,
            //     success: true,
            //   };
            //   console.log('result');
            //   console.log(result);

            //   return result;
            // }}
            // value={dataSource}
            value={defaultData}
            // onChange={setDataSource}
            onChange={(e) => {
              setDataSource(defaultData);
              setExcelData2(defaultData);
            }}
            editable={{
              form,
              editableKeys,
              onSave: async () => {
                await waitTime(200);
              },
              onChange: setEditableRowKeys,
              actionRender: (row, config, dom) => [dom.save, dom.cancel, dom.delete],
              onValuesChange: (record, recordList) => {
                // console.log('onValuesChange record');
                // console.log(record);
                // console.log('onValuesChange recordList');
                // console.log(recordList);
                // setDataSource(recordList);
                setExcelData2(recordList);
              },
            }}
          />
        </Col>
        {calculate == false ? null : (
          <Col span={8}>
            <ProTable
              columns={columns1}
              search={false}
              options={false}
              className={styles.myTable2}
              dataSource={calculatedData}
              bordered
            />
          </Col>
        )}
      </Row>
    </>
  );
};
export default EditForm;
