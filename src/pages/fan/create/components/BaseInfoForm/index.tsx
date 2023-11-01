import ImportExcel from '@/components/importExcel';
import { fixNumFunc } from '@/pages/fan/components/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ProCard, ProFormCascader } from '@ant-design/pro-components';

import ProForm, {
  ProFormDigit,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Typography,
  UploadFile,
} from 'antd';
import { number } from 'echarts';
import { cloneDeep } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { FanListItem } from '../../../selection/data.d';
import {
  getFanApplicationModelData,
  getFanCategoryData,
  getFanCategoryGroup,
  getFanCoolObjectData,
} from '../../service';
import styles from '../../style.less';
import { dataIndex, excelTableColumns, title } from './data.d';
const baseInfoFields = [
  'applicationModelId',
  'applicationModel',
  'coolObject',
  'category',
  'model',
  'figNum',
  'version',
  'flowRate',
  'fullPressure',
  'staticPressure',
  'efficiency',
  'shaftPower',
  'motorModel',
  'powerFrequency',
  'motorPower',
  'motorSpeedMin',
  'motorSpeed',
  'ratedVoltage',
  'ratedCurrent',
  'altitude',
  'temperature',
  'humidity',
  'impellerDiameter',
  'weight',
  'remark1',
  'remark2',
  'sampleDesc',
];
export const dictToTree: any = (data: any) => {
  if (data.length != undefined) {
    let children = [];
    for (let i = 0; i < data.length; i++) {
      children.push({
        label: data[i],
        value: data[i],
      });
    }
    return children;
  } else {
    let result = [];
    for (let key in data) {
      let temp = {
        label: key,
        value: key,
        children: dictToTree(data[key]),
      };
      result.push(temp);
    }
    return result;
  }
};
const BaseInfoForm: React.FC<{
  setKey: Function;
  formRef: any;
  form: any;
  flowRateUnit: number;
  setFlowRateUnit: Function;
  id?: string;
  model?: string;
  type?: string;
  status: string;
  isCopyRecord: string;
  onSubmit: Function;
  saveLoading: boolean;
  submitLoading: boolean;
}> = (props) => {
  const {
    setKey,
    formRef,
    form,
    flowRateUnit,
    setFlowRateUnit,
    model,
    type,
    status,
    isCopyRecord,
    onSubmit,
    saveLoading,
    submitLoading,
  } = props;
  // type == 'copy' ? true : false;
  let fieldDisable;
  switch (type) {
    case 'copy':
      fieldDisable = true;
      break;
    case 'alter':
      fieldDisable = false;
      break;
    case undefined:
      if (model) {
        console.log('新增实验数据');

        fieldDisable = true;
      } else {
        console.log('编辑草稿');

        fieldDisable = false;
      }
      break;
    default:
      fieldDisable = false;
  }
  let showSaveButton = false;
  if (model == undefined && type == undefined) {
    showSaveButton = false;
  } else if (model && !['draft', 'rejected'].includes(status)) {
    showSaveButton = false;
  } else if (status == 'pass') {
    showSaveButton = false;
  } else if (type == undefined && !['draft', 'rejected'].includes(status)) {
    showSaveButton = false;
  } else {
    showSaveButton = true;
  }

  // (  status == 'pass' ? false : !isCopyRecord)
  //下拉option
  // console.log('isCopyRecord');
  // console.log(isCopyRecord);
  console.log('type11111');
  console.log(type);
  console.log('status11111');
  console.log(status);
  // const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [flow, setFlow] = useState<number>();
  const [categoryList, setCategoryList] = useState<[]>([]);
  const [applicationModelList, setApplicationModelList] = useState<{}>({});
  const [coolObjectList, setCoolObjectList] = useState<{}>({});
  //excel导入时解析
  const [categoryGroup, setCategoryGroup] = useState<{}>({});
  const [applicationModelGroup, setApplicationModelGroup] = useState<string[]>([]);

  const [excelData1, setExcelData1] = useState<FanListItem[]>([]);
  const [excelData1Visable, setExcelData1Visable] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<FanListItem>();

  // const [form] = Form.useForm();
  const { validateFields, getFieldValue } = form;

  const getExcelData1 = (data: any[]) => {
    console.log('getExcelData1');
    console.log(data);
    // 数据类型校验和转换
    data.forEach((item) => {
      if (item.motorSpeed != undefined) {
        if (typeof item.motorSpeed != 'number' && item.motorSpeed.indexOf('/') != -1) {
          const temp = item.motorSpeed.split('/');
          temp.sort(function (a: number, b: number) {
            return a - b;
          });
          item['motorSpeedMin'] = Number(temp[0]);
          item['motorSpeed'] = Number(temp[1]);
        } else {
          item['motorSpeedMin'] = Number(item.motorSpeed);
          item['motorSpeed'] = undefined;
          // jsonObj[columns[i].dataIndex] = im;
        }
        // console.log(item['motorSpeedMin']);
        // console.log(item['motorSpeed']);
      }
      [
        'motorSpeedMin',
        'motorSpeed',
        'humidity',
        'altitude',
        'efficiency',
        'flowRate',
        'fullPressure',
        'impellerDiameter',
        'powerFrequency',
        'motorPower',
        'ratedCurrent',
        'ratedVoltage',
        'shaftPower',
        'staticPressure',
        'temperature',
        'weight',
      ].map((key) => {
        item[key] = isNaN(Number(item[key])) ? undefined : Number(item[key]);
      });
      // item.version = String(item.version);
    });
    console.log(data);

    setExcelData1(data);
    if (data.length == 1) {
      const selectedRow = data[0];
      console.log(selectedRow);
      if (selectedRow != undefined) {
        if (selectedRow['category'] != undefined) {
          console.log(selectedRow['category']);
          let temp = undefined;
          const node = categoryGroup.find((el) => el.name === selectedRow['category']);
          console.log('node');
          console.log(node);
          if (node != undefined) {
            temp = [node.parentId, node.id];
          }
          selectedRow['category'] = temp;

          // for (let key in categoryGroup) {
          //   if (categoryGroup[key].includes(selectedRow['category'])) {
          //     temp = [key, selectedRow['category']];
          //   }
          // }
          // selectedRow['category'] = temp;
        }
        if (!applicationModelGroup.includes(selectedRow['applicationModelId'])) {
          selectedRow['applicationModelId'] = undefined;
        }
        if (model) {
          selectedRow['model'] = model;
        }
        console.log('selectedRow');
        console.log(selectedRow);
        console.log(selectedRow['category']);

        formRef.current?.setFieldsValue(selectedRow);
      }
      // setExcelData1Visable(false);
      // setExcelData1Visable(true);
    } else if (data.length > 0) {
      setExcelData1Visable(true);
    }

    // if (data.length > 0) {
    //   formRef.current?.setFieldsValue(data[0]);
    // }
    return data;
  };
  const onSelect = (selectedRow: FanListItem) => {
    console.log('selectedRow changed: ', selectedRow);
    setSelectedRow(selectedRow);
    return selectedRow;
  };
  const getTree = (data) => {
    const temp = cloneDeep(data); //深克隆一份外来数据data，以防下面的处理修改data本身
    const parents = temp.filter((item) => !item.parentId); //过滤出最高父集
    let children = temp.filter((item) => item.parentId); //过滤出孩子节点

    parents.sort((a, b) => {
      a.sort - b.sort;
    });
    children.sort(function (a, b) {
      return a.sort - b.sort;
    });

    //遍历孩子节点，根据孩子的parent从temp里面寻找对应的node节点，将孩子添加在node的children属性之中。
    children.map((item) => {
      const node = temp.find((el) => el.id === item.parentId);
      node && (node.children ? node.children.push(item) : (node.children = [item]));
    });
    return parents; //返回拼装好的数据。
  };
  useEffect(() => {
    getFanCategoryGroup().then((res: any) => {
      // let cL = dictToTree(res.data);
      console.log('res.data');
      console.log(res.data);

      setCategoryGroup(res.data);
      res.data.forEach((item) => {
        item.value = item.id;
        item.label = item.name;
      });
      let cL: {}[] = getTree(res.data);

      console.log('cL');
      console.log(cL);
      cL = cL.filter((item) => item.children);
      setCategoryList(cL);
    });
    getFanApplicationModelData().then((res: any) => {
      let aML = {};
      for (let i = 0; i < res.data.length; i++) {
        aML[res.data[i]] = res.data[i];
      }
      setApplicationModelGroup(res.data);
      // console.log(aML);
      setApplicationModelList(aML);
    });
    getFanCoolObjectData().then((res: any) => {
      let cO = {};
      for (let i = 0; i < res.data.length; i++) {
        cO[res.data[i]] = res.data[i];
      }
      // console.log(cO);
      setCoolObjectList(cO);
    });
  }, []);

  let columns: {}[] = [];

  for (let i = 0; i < title.length; i++) {
    if (title[i] == '转速(r/min)') {
      columns.push({
        width: 120,
        title: title[i],
        // dataIndex: excelTableColumns[title[i]],

        render: (text: any, record: any, index: number) => {
          // if (record.motorSpeedMin == undefined) {
          //   return record.motorSpeedMin
          // }
          // else
          console.log('record');
          console.log(record);

          if (record.motorSpeed == undefined) {
            return record.motorSpeedMin;
          } else {
            return record.motorSpeedMin + '/' + record.motorSpeed;
          }
        },
      });
    } else {
      columns.push({
        width: title.length > 6 ? 150 : title.length < 4 ? 40 : 100,
        title: title[i],
        dataIndex: excelTableColumns[title[i]],
      });
    }
  }
  return (
    <>
      <Card className={styles.card} bordered={false}>
        <Row>
          <Col lg={11} md={12} sm={24}>
            <Row wrap={false} justify={'end'} gutter={6}>
              <Col lg={10} md={12} sm={24}>
                <ProFormSelect
                  //colProps={{ span: 6 }}
                  mode="single"
                  label="应用车型大类"
                  labelCol={{ span: 10 }}
                  name="applicationModelId"
                  disabled={fieldDisable}
                  // valueEnum={{ 动车: '动车', 机车: '机车', 城轨: '城轨', 其他: '其他' }}
                  valueEnum={applicationModelList}
                  rules={[{ required: true, message: '请选择应用车型大类!' }]}
                />
              </Col>
              <Col lg={10} md={12} sm={24}>
                <ProFormText
                  name="applicationModel"
                  label="车型名称"
                  disabled={fieldDisable}
                  // //colProps={{ span: 0 }}
                  placeholder=""
                  rules={[{ required: true, message: '请填写车型名称!(或与应用车型大类相同)' }]}
                  // style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </Col>
          <Col lg={11} md={12} sm={24}>
            <ProFormSelect
              //colProps={{ span: 12 }}
              mode="single"
              label="冷却对象"
              disabled={fieldDisable}
              name="coolObject"
              valueEnum={coolObjectList}
              rules={[{ required: true, message: '请选择冷却对象!' }]}
            />
          </Col>
          {/* <Select
                  defaultValue={'离心通风机'}
                  style={{ width: 120 }}
                  // onChange={handleProvinceChange}
                  options={['离心通风机', '轴流通风机', '混流通风机'].map((province) => ({ label: province, value: province }))}
                /> */}
        </Row>
        {/* </Row>*/}
        <Row>
          <Col lg={11} md={12} sm={24}>
            <ProFormCascader
              //colProps={{ span: 12 }}
              label="风机类型"
              name="category"
              disabled={fieldDisable}
              rules={[{ required: true, message: '请选择风机类型!' }]}
              fieldProps={{
                changeOnSelect: true,
                onChange: (e) => {
                  console.log(e);
                },
                options: categoryList,
              }}
            />
          </Col>

          <Col lg={11} md={12} sm={24}>
            <ProFormText
              name="model"
              label="风机型号"
              //colProps={{ span: 12 }}
              disabled={
                type == 'alter' ? true : fieldDisable
                // ['draft', 'rejected'].includes(status) ? false : model ? !fieldDisable : false
              }
              placeholder=""
              rules={[{ required: true, message: '请填写风机型号!' }]}
            />
          </Col>
          <Col lg={11} md={12} sm={24}>
            <ProFormText
              name="figNum"
              label="图号"
              //colProps={{ span: 12 }}
              placeholder=""
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              disabled={
                type == 'alter' ? true : fieldDisable
                // ['draft', 'rejected'].includes(status) ? false : model ? !fieldDisable : false
              }
              rules={[{ required: true, message: '请填写图号!' }]}
            />
          </Col>
          <Col lg={11} md={12} sm={24}>
            <ProFormText
              name="version"
              label="版本号"
              //colProps={{ span: 12 }}
              placeholder=""
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              disabled={
                ['draft', 'rejected'].includes(status)
                  ? false
                  : model
                  ? type == 'alter'
                    ? true
                    : !fieldDisable
                  : false
              }
              rules={[{ required: true, message: '请填写版本号!' }]}
            />
          </Col>
        </Row>
        {/* <div style={{ backgroundColor: '#ffffff' }} ><Title level={4}>铭牌信息:</Title></div>
       
        <div style={{ borderStyle: 'dashed', borderColor: '#afc6c6', borderRadius: '1%', paddingTop: 20, marginTop: -30, borderWidth: 1 }}> */}
        <div>
          {/* <Title level={5}>铭牌信息:</Title>
           */}
          {/* <Divider children={<Title level={5} style={{ marginBottom: 0 }}>铭牌信息:</Title>} orientation='left' dashed style={{ margin: 0 }} /> */}
          <Divider dashed style={{ margin: 0 }} />
          <ProCard title={'铭牌信息: '} bordered={false} collapsible>
            <Row>
              <Col lg={11} md={12} sm={24}>
                <ProFormDigit
                  name="flowRate"
                  label="流量"
                  disabled={fieldDisable}
                  //colProps={{ span: 12 }}
                  // placeholder="m³/s"
                  rules={[{ required: true, message: '请填写流量!', type: 'number' }]}
                  // addonAfter={'m³/s'}
                  tooltip={'请注意单位换算！'}
                  onMetaChange={(e) => {
                    console.log('onMetaChange');
                    console.log(e);
                  }}
                >
                  <InputNumber
                    min={0}
                    size="middle"
                    style={{ width: '100%' }}
                    addonAfter={
                      <Select
                        // value={sortParam3}
                        defaultValue={0}
                        onChange={(value) => {
                          console.log(value);
                          let flowRate = formRef.current.getFieldValue('flowRate');
                          console.log('flowRate');
                          console.log(flowRate);
                          // if (value > flowRateUnit) {
                          //   console.log('value > flowRateUnit');
                          //   console.log(flowRate / Math.pow(60, value));

                          //   setFlow(flowRate / Math.pow(60, value));
                          // } else if (value < flowRateUnit) {
                          //   console.log('value < flowRateUnit');
                          //   console.log(flowRate * Math.pow(60, value));

                          //   setFlow(flowRate * Math.pow(60, value));
                          // }
                          setFlow(flowRate / Math.pow(60, value));
                          setFlowRateUnit(value);
                          // setFlow(flowRate);
                          // console.log(formRef.current.getFieldValue('flowRate'));
                          // formRef.current.setFieldValue('flowRate',value)
                        }}
                        options={[
                          { label: 'm³/s', value: 0 },
                          { label: 'm³/min', value: 1 },
                          { label: 'm³/h', value: 2 },
                        ]}
                      />
                    }
                    onChange={(flowRate) => {
                      // console.log('flowRate');
                      // console.log(flowRate);
                      // setFlow(flowRate);
                      if (flowRate) {
                        setFlow(flowRate / Math.pow(60, flowRateUnit));
                      }
                      formRef.current.setFieldValue('flowRate', flowRate);
                      form.setFieldValue('flowRate', flowRate);
                      // console.log(formRef.current.getFieldValue('flowRate'));
                      // formRef.current.setFieldValue('flowRate',value)
                    }}
                  />
                </ProFormDigit>
              </Col>
              <Col lg={11} md={12} sm={24}>
                <Space> {flow ? fixNumFunc(flow, 3) + 'm³/s' : null}</Space>
              </Col>
            </Row>

            <Row>
              <Col lg={11} md={12} sm={24}>
                <ProFormDigit
                  name="fullPressure"
                  label="全压"
                  disabled={fieldDisable}
                  //colProps={{ span: 12 }}
                  placeholder="Pa"
                  rules={[{ required: true, message: '请填写全压!', type: 'number' }]}
                />
              </Col>
              <Col lg={11} md={12} sm={24}>
                <ProFormDigit
                  name="staticPressure"
                  label="静压"
                  disabled={fieldDisable}
                  //colProps={{ span: 12 }}
                  placeholder="Pa"
                  rules={[{ required: true, message: '请填写静压!', type: 'number' }]}
                />
              </Col>
            </Row>

            <Row>
              <Col lg={11} md={12} sm={24}>
                <ProFormDigit
                  name="efficiency"
                  label="效率"
                  disabled={fieldDisable}
                  //colProps={{ span: 12 }}
                  placeholder="%"
                  rules={[{ required: true, message: '请填写效率!', type: 'number' }]}
                />
              </Col>
              <Col lg={11} md={12} sm={24}>
                <ProFormDigit
                  name="shaftPower"
                  label="轴功率"
                  disabled={fieldDisable}
                  //colProps={{ span: 12 }}
                  placeholder="kW"
                  rules={[{ required: true, message: '请填写轴功率!', type: 'number' }]}
                />
              </Col>
            </Row>

            <Row>
              <Col lg={11} md={12} sm={24}>
                <ProFormText
                  name="motorModel"
                  label="电机型号"
                  disabled={fieldDisable}
                  //colProps={{ span: 12 }}
                  placeholder=""
                  rules={[{ required: true, message: '请填写电机型号!' }]}
                />
              </Col>
              <Col lg={11} md={12} sm={24}>
                <ProFormDigit
                  name="powerFrequency"
                  label="电源频率"
                  disabled={fieldDisable}
                  //colProps={{ span: 12 }}
                  placeholder="Hz"
                  rules={[
                    { required: true, message: '请填写电源频率!', type: 'number' },
                    { type: 'number' },
                  ]}
                />
              </Col>
              <Col lg={11} md={12} sm={24}>
                <ProFormDigit
                  name="motorPower"
                  label="电机功率"
                  disabled={fieldDisable}
                  //colProps={{ span: 12 }}
                  placeholder="kW"
                  rules={[
                    { required: true, message: '请填写电机功率!', type: 'number' },
                    { type: 'number' },
                  ]}
                />
              </Col>
              <Col lg={11} md={12} sm={24}>
                <Row wrap={false} align="stretch" gutter={6} justify="end">
                  <Col span={4}></Col>
                  <Col>
                    <Form.Item
                      label="电机转速"
                      name="motorSpeedMin"
                      labelCol={{ span: 8 }}
                      tooltip={
                        '若只有一个转速,请在最小值输入转速。' +
                        'excel导入时若有两个转速,请用/符号分隔。'
                      }
                      rules={[
                        { required: true, message: '请填写电机转速!', type: 'number' },
                        ({ getFieldValue }) => ({
                          validator(rule: any, value: number) {
                            // console.log('validator value');
                            // console.log(value);
                            // console.log("getFieldValue('motorSpeed')");
                            // console.log(getFieldValue('motorSpeed'));
                            if (value > getFieldValue('motorSpeed')) {
                              return Promise.reject('最小值未小于最大值!');
                            }
                            // form.validateFields(['motorSpeed']);
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%', textAlign: 'center' }}
                        addonAfter={'r/min'}
                        placeholder="最小值"
                        disabled={fieldDisable}
                        onChange={(value) => {}}
                      />
                      {/*, )} */}
                    </Form.Item>
                  </Col>
                  <Col>~</Col>
                  <Col>
                    <Form.Item
                      name="motorSpeed"
                      wrapperCol={{}}
                      rules={[
                        { required: false, type: 'number' },
                        ({ getFieldValue }) => ({
                          validator(rule: any, value: number) {
                            if (value < getFieldValue('motorSpeedMin')) {
                              return Promise.reject('最大值未大于最小值!');
                            }
                            // form.validateFields(['motorSpeedMin']);
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        style={{
                          width: '100%',
                          textAlign: 'center',
                        }}
                        placeholder="最大值"
                        disabled={fieldDisable}
                        addonAfter={'r/min'}
                        // formatter={(value) => `${value + unitDict[sortParam3]}`}
                        onChange={(value) => {
                          // console.log('max value');
                          // console.log(value);
                          // console.log("getFieldValue('motorSpeedMax')");
                          // // console.log(formRef.current.getFieldValue('motorSpeedMax'));
                          // console.log(form.getFieldValue('motorSpeedMax'));
                        }}
                      />
                    </Form.Item>
                  </Col>
                  {/* <Col flex={1}>kW</Col> */}
                </Row>
              </Col>
            </Row>
            <Row>
              <Col lg={11} md={12} sm={24}>
                <ProFormText
                  name="ratedVoltage"
                  label="额定电压"
                  disabled={fieldDisable}
                  //colProps={{ span: 12 }}
                  placeholder="V"
                  rules={[
                    {
                      required: true,
                      message: '请填写额定电压!',
                      // type: 'number',
                    },
                    {
                      message: '请输入正确的额定电压格式!',

                      pattern: /^[0-9./]+$/,
                    },
                  ]}
                />
              </Col>
              <Col lg={11} md={12} sm={24}>
                <ProFormDigit
                  name="ratedCurrent"
                  label="额定电流"
                  disabled={fieldDisable}
                  //colProps={{ span: 12 }}
                  placeholder="A"
                  rules={[{ required: true, message: '请填写额定电流!', type: 'number' }]}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={11} md={12} sm={24}>
                <ProFormDigit
                  name="altitude"
                  label="海拔"
                  disabled={fieldDisable}
                  //colProps={{ span: 12 }}
                  placeholder="m"
                  rules={[{ required: false, type: 'number' }]}
                />
              </Col>
              <Col lg={11} md={12} sm={24}>
                <ProFormDigit
                  name="temperature"
                  label="温度"
                  disabled={fieldDisable}
                  //colProps={{ span: 12 }}
                  placeholder="摄氏度℃"
                  rules={[{ required: false, type: 'number' }]}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={11} md={12} sm={24}>
                <ProFormDigit
                  name="humidity"
                  label="湿度"
                  disabled={fieldDisable}
                  //colProps={{ span: 12 }}
                  placeholder="%"
                  rules={[{ required: false, type: 'number' }]}
                />
              </Col>
            </Row>
          </ProCard>
          <Divider style={{ marginTop: 0 }} dashed />
        </div>
        <Row>
          <Col lg={11} md={12} sm={24}>
            <ProFormDigit
              name="impellerDiameter"
              label="叶轮直径"
              disabled={fieldDisable}
              //colProps={{ span: 12 }}
              placeholder="mm"
              rules={[{ required: true, message: '请填写叶轮直径!', type: 'number' }]}
            />
          </Col>
          <Col lg={11} md={12} sm={24}>
            {' '}
            <ProFormDigit
              name="weight"
              label="重量"
              disabled={fieldDisable}
              //colProps={{ span: 12 }}
              placeholder="kg"
              rules={[{ required: true, message: '请填写重量!', type: 'number' }]}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={11} md={12} sm={24}>
            <ProFormText
              name="remark1"
              label="备注1"
              disabled={fieldDisable}
              //colProps={{ span: 12 }}
              placeholder="(项目名称)"
            />
          </Col>
          <Col lg={11} md={12} sm={24}>
            <ProFormText
              name="remark2"
              label="备注2"
              disabled={fieldDisable}
              //colProps={{ span: 12 }}
              placeholder="(客户)"
            />
          </Col>
        </Row>
        <Row>
          {/* <Col lg={11} md={12} sm={24}> */}
          <Col lg={23} md={24} sm={24}>
            <ProFormTextArea
              name="sampleDesc"
              label="样本说明"
              labelCol={{ span: 4 }}
              disabled={fieldDisable}
              // colProps={{ span: 6 }}
              placeholder="样本说明、应用说明"
              style={{ width: '120%', height: 500 }}
            />
          </Col>
        </Row>
        {/* <Row>
        <Col lg={11} md={12} sm={24}>
          <ProFormText
            name="uploadId"
            label="上传者ID"
            //colProps={{ span: 6 }}
            initialValue={initialState?.currentUser?.userId}
            placeholder=""
            disabled
          />
        </Col>
      </Row> */}
      </Card>
      <div className={styles.centerButton}>
        <Row justify={'center'} gutter={16}>
          {type != undefined ? null : (
            <>
              <Col>
                <Button
                  // type="primary"
                  onClick={async () => {
                    const params = await formRef.current.getFieldsValue();
                    console.log('params');
                    console.log(params);
                    // const model = params.model;
                    formRef.current.resetFields(baseInfoFields);
                    if (model) {
                      formRef.current.setFieldValue('model', params.model);
                      formRef.current.setFieldValue('figNum', params.figNum);
                      formRef.current.setFieldValue('version', params.version);
                    }
                  }}
                >
                  清空表格
                </Button>
              </Col>
              <Col>
                <ImportExcel
                  text="从excel导入"
                  // title={title}dataIndex={dataIndex}
                  excelTableColumns={excelTableColumns}
                  tipContent={
                    <>
                      1.风机类型若为系统中不存在的的类型，请选择输入
                      <br />
                      2.导入后检查流量单位
                      <br />
                      3.若有两个转速,请用/符号分隔
                      <br />
                    </>
                  }
                  // isPreview={true}
                  // isSelectRow={true}
                  getExcelData={getExcelData1}
                  sheetNum={0}
                />

                <Modal
                  width={1500}
                  // style={styles.modal}
                  // destroyOnClose
                  title={'请选择要导入的信息'}
                  open={excelData1Visable}
                  // closable
                  centered
                  onCancel={() => {
                    console.log('oncancel');
                    setExcelData1Visable(false);
                  }}
                  onOk={(e) => {
                    console.log('submit selectedRow');
                    console.log(selectedRow);
                    if (selectedRow != undefined) {
                      if (selectedRow['category'] != undefined) {
                        let temp = undefined;
                        const node = categoryGroup.find(
                          (el) => el.name === selectedRow['category'],
                        );
                        console.log('node');
                        console.log(node);
                        if (node != undefined) {
                          temp = [node.parentId, node.id];
                        }
                        selectedRow['category'] = temp;
                        // selectedRow['category'] = temp;

                        // for (let key in categoryGroup) {
                        //   if (categoryGroup[key].includes(selectedRow['category'])) {
                        //     temp = [key, selectedRow['category']];
                        //   }
                        // }
                        // selectedRow['category'] = temp;
                      }
                      if (!applicationModelGroup.includes(selectedRow['applicationModelId'])) {
                        selectedRow['applicationModelId'] = undefined;
                      }
                      formRef.current?.setFieldsValue(selectedRow);
                    }
                    setExcelData1Visable(false);
                  }}
                >
                  <Table<FanListItem>
                    columns={columns}
                    scroll={{
                      x: 860,
                      y: 500,
                    }}
                    // search={false}
                    // options={false}
                    // tableAlertRender={false}
                    rowSelection={{
                      type: 'radio',
                      onSelect: onSelect,
                      columnTitle: {}, //去掉全选
                      // getCheckboxProps: (record) => {
                      // if (selectedRowKeys.length < 1) {
                      //   return { disabled: false };
                      // }
                      // return {
                      //   disabled: selectedRowKeys.indexOf(record.key) == -1 ? true : false,
                      // };
                      // },
                    }}
                    pagination={{
                      // ...pageOption,
                      // current: 1,
                      // pageSize: 5,
                      defaultPageSize: 5,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      pageSizeOptions: ['5', '10', '20', '50'], // 每页数量选项
                    }}
                    dataSource={excelData1}
                  />
                </Modal>
              </Col>
            </>
          )}
          <Col>
            {status == 'rejected' || type == 'alter' ? (
              <Button
                onClick={async () => {
                  setKey('0');
                }}
              >
                上一步
              </Button>
            ) : null}
            &nbsp;
            <Button
              type="primary"
              onClick={async () => {
                try {
                  const values = await validateFields(baseInfoFields);
                  console.log('baseinfo form.getFieldsValue()');
                  console.log(values);
                  // await validateFields();
                  setKey('2');
                } catch (error) {
                  let errorFields = error.errorFields;
                  console.log(errorFields);

                  // let errorFields: [] = error.errorFields
                  errorFields.map((item: any, index: number) => {
                    //只输出第一个验证错误
                    let errors = item.errors;
                    while (errors.length > 1) {
                      errors = errors.splice(1);
                    }
                    item.errors = errors;
                  });
                  // console.log(errorFields);
                  message.warn(errorFields[0].errors);

                  error.errorFields = errorFields;
                }
              }}
            >
              下一步
            </Button>
            {/* 草稿可编辑保存、新增被驳回可编辑保存 */}
            {(model && !['draft', 'rejected'].includes(status)) ||
            type == 'copy' ||
            status == 'pass' ||
            (type == undefined && !['draft', 'rejected'].includes(status)) ? null : (
              // {model && status == 'rejected' ? (
              <Button
                type="primary"
                style={{ marginLeft: 3 }}
                onClick={(e) => {
                  // e.stopPropagation();
                  onSubmit('draft');
                }}
                loading={saveLoading}
              >
                保存
              </Button>
            )}
            {/* {showSaveButton && (
              <Button
                type="primary"
                style={{ marginLeft: 3 }}
                onClick={(e) => {
                  // e.stopPropagation();
                  onSubmit('draft');
                }}
                loading={saveLoading}
              >
                保存
              </Button>
            )} */}
            {model ? (
              type != undefined ? null : (
                <Button
                  type="primary"
                  style={{ marginLeft: 3 }}
                  onClick={(e) => {
                    // e.stopPropagation();
                    onSubmit();
                  }}
                  loading={submitLoading}
                >
                  提交
                </Button>
              )
            ) : null}
          </Col>
        </Row>
        {/* <Row align={'bottom'} justify="center" style={{ paddingTop: 20 }}>
        <Col lg={11} md={12} sm={24}>
          <Space>
            <QuestionCircleOutlined /> 
            <a style={{ color: '#51708d' }}>excel导入模板下载</a>
          </Space>
        </Col>
      </Row> */}
      </div>
    </>
  );
};

export default BaseInfoForm;
{
  /* 
          <Col lg={11} md={12} sm={24}>
            <Row wrap={false} justify="end" gutter={6}>
         
              <Col lg={10} md={12} sm={24}>
                
                <ProFormSelect
                  //colProps={{ span: 6 }}
                  mode="single"
                  label="风机类型"
                  name="fanLargeCategory"
                  labelCol={{ span: 10 }}
                  // valueEnum={['离心通风机', '轴流通风机', '混流通风机'].map((province) => ({ label: province, value: province }))}
                  valueEnum={{
                    离心通风机: '离心通风机',
                    轴流通风机: '轴流通风机',
                    混流通风机: '混流通风机',
                  }}
                  rules={[{ required: true, message: '请选择应用车型大类!' }]}
                />
              </Col>
              <Col lg={10} md={12} sm={24}>
                <ProFormSelect
                  //colProps={{ span: 0 }}
                  mode="single"
                  // labelCol={{ style: { width: 0 } }}
                  wrapperCol={{ style: { width: 0 } }}
                  name="category"
                  valueEnum={categoryList}
                  rules={[{ required: true, message: '请选择风机类型!' }]}
                />
              </Col>
            </Row>
          </Col> 
          */
}
