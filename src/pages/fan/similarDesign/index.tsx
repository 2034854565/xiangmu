/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-02-13 14:13:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-26 15:44:23
 */
// FanSimilarDesign

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Cascader,
  Checkbox,
  Col,
  Collapse,
  Dropdown,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Space,
  TableColumnsType,
  Tag,
  Tooltip,
  Tree,
  TreeSelect,
  Typography,
} from 'antd';
import { Descriptions } from 'antd';
// import center from "@/pages/account/center";
// const {  Sider, Content } = Layout;
import { ActionType, ProColumns } from '@ant-design/pro-table';
import { Divider } from 'antd';
import { ProCard, ProForm } from '@ant-design/pro-components';
import ProTable from '@ant-design/pro-table';
import {
  queryFanPerfData,
  queryFanPerfOriginData,
  queryFansList,
  queryFansPerfData,
  querySimilarFansList,
} from '@/pages/fan/selection/service';
// import { history } from '@@/core/history';
import { FanTableItem } from '@/pages/fan/similarDesign/data';
import styles from './style.less';
import PerfCurveCompare from '@/pages/charts/perfCurveCompare';
import { RowSelectMethod } from 'antd/es/table/interface';
import { CalculationItem } from './detail/data.d';
import {
  CurrentToStandardStateAtmosphericPressure,
  CurrentToStandardStateAtmosphericPressureBydensity,
  fixNumFunc,
  getCp,
  getCurrentDensity,
  getCv,
  getSpecificSpeed,
  StandardAtmosphericPressure,
} from '../components/utils';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { PerfDataItem } from '../data.d';
import { excelTableColumns } from '../create/components/PerfDataForm/data.d';
import * as echarts from 'echarts';

import ecStat from 'echarts-stat';
import { useHistory } from 'react-router-dom';
import { saveUserAction } from '@/services/ant-design-pro/api';
import { PageContainer } from '@ant-design/pro-layout';
import { models } from '@/.umi/plugin-model/Provider';
import PageLoading from '@/pages/dashboard/analysis/components/PageLoading';
import { getFanCategoryGroup } from '../create/service';
import { dictToTree } from '../create/components/BaseInfoForm';
import { cloneDeep } from 'lodash';
echarts.registerTransform(ecStat.transform.regression);

// const { Search } = Input;
const { Text } = Typography;
const layout = {
  labelCol: {
    // span: 'flex'
    span: 6,
  },
  wrapperCol: { span: 18, justify: 'flex' },
  // labelAlign: 'right',span: 16,flex: 16,
};
const CheckboxGroup = Checkbox.Group;
const FanSimilarDesign: React.FC<{}> = (props) => {
  const [calculation, setCalculation] = useState<CalculationItem>();
  const [similarButtVisable, setSimilarButtVisable] = useState<boolean>(false);

  const history = useHistory();
  const [flowRateUnit, setFlowRateUnit] = useState<number>(1);
  const [pressureField, setPressureField] = useState<string>('fullPressure');

  const actionRef = useRef<ActionType>();

  const [searchParams, setSearchParams] = useState<{}>({});
  const [selectedModels, setSelectedModels] = useState<string[]>(() => {
    let selectedModelsStr = sessionStorage.getItem('selectedModels');
    let selectedModels = [];
    if (selectedModelsStr) {
      selectedModels = JSON.parse(selectedModelsStr);
      return selectedModels;
    } else {
      return [];
    }
  });
  const [selectedFanIds, setSelectedFanIds] = useState<string[]>(() => {
    let selectedFanIdsStr = sessionStorage.getItem('selectedFanIds');
    let selectedFanIds = [];
    if (selectedFanIdsStr) {
      selectedFanIds = JSON.parse(selectedFanIdsStr);
      return selectedFanIds;
    } else {
      return [];
    }
  });
  interface Option {
    value: string | number;
    label: string;
    children?: Option[];
  }

  const [categoryList, setCategoryList] = useState<Option[]>([]);

  let [beforeSearchParams, setBeforeSearchParams] = useState<{}>({});
  const [pageOption, setPageOption] = useState<{ current: number; pageSize: number }>({
    current: 1, //当前页为1
    pageSize: 5, //一页5行
  });
  const [searchRange, setSearchRange] = useState<string[]>([]);
  const [form] = Form.useForm();
  const myRef = useRef();
  let pageArea = '';
  let activeKey = '2';
  switch (activeKey) {
    case '1':
      pageArea = '选型';
      break;
    case '2':
      pageArea = '相似设计';
      break;
    case '3':
      pageArea = '变形设计';
      break;
    case '4':
      pageArea = '数据管理';
  }
  const generalParams = {
    monitorModule: '风机平台',
    pageUrl: window.location.href,
    pageName: '风机平台',
    pageArea: pageArea,
    actionModel: null,
  };
  const requiredLabel = (
    <label
      style={{
        color: '#ff4d4f',
        display: 'inline-block',
        // marginRight: 4,
        marginLeft: 4,
        marginRight: 0,
        fontSize: 14,
        fontFamily: 'SimSun, sans-serif',
        lineHeight: 1,
      }}
    >
      *
    </label>
  );
  const [value, setValue] = useState<string[]>([]);
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
      console.log('res');
      console.log(res);
      // let cL: {}[] = []
      // for (let key in res.data) {
      //   console.log(key);
      //   let children = [];
      //   if (res.data[key].length != 0) {
      //     for (let i in res.data[key]) {
      //       let k = res.data[key][i];
      //       children.push({
      //         label: k,
      //         value: k,
      //         // children:[]
      //       });
      //     }
      //   }
      //   cL.push({
      //     label: key,
      //     value: key,
      //     children: children,
      //   });
      // }
      res.data.forEach((item) => {
        item.value = item.id;
        item.label = item.name;
      });
      let cL: {}[] = getTree(res.data);

      // console.log('cL');
      // console.log(cL);
      setCategoryList(cL);
    });
    //把取到的JSON格式的转化为JS格式

    let orderDataStr = sessionStorage.getItem('orderData');
    let orderData;
    if (orderDataStr) {
      orderData = JSON.parse(orderDataStr);
      // console.log('orderData');
      // console.log(orderData);
      setValue(orderData);
      // sessionStorage.removeItem('selectedModels');
    }
    let expectStr = sessionStorage.getItem('expect');
    if (expectStr != undefined) {
      let expect = JSON.parse(expectStr);
      // console.log('expect');
      // console.log(expect);
      // && expect.flowRate != 0
      if (expect.flowRate != undefined) {
        setSimilarButtVisable(true);
      }
      // form.setFieldsValue(expect);
      setCalculation(expect);
      // 输入工作参数表单值
      let similarSearchDataStr = sessionStorage.getItem('similarSearchData');
      let similarSearchData = undefined;
      if (similarSearchDataStr) {
        similarSearchData = JSON.parse(similarSearchDataStr);
        console.log('similarSearchData');
        console.log(similarSearchData);
        if (similarSearchData.current != undefined && similarSearchData.pageSize != undefined) {
          setPageOption({
            current: similarSearchData.current,
            pageSize: similarSearchData.pageSize,
          });
        }
        //直接setFieldsValue()可以把值赋值到表单里面

        console.log('@@@@@@@@@@@@ get and set similarSearchData');
        console.log(similarSearchData);
        form.setFieldsValue(similarSearchData);
        let limitCategory: string[] = [];
        if (similarSearchData.limitCategoryId) {
          let limitCategoryList = similarSearchData.limitCategoryId;
          // console.log('limitCategoryList');
          // console.log(limitCategoryList);

          // limitCategory = limitCategoryList;
          for (let i in limitCategoryList) {
            const item = limitCategoryList[i];
            // console.log('item');
            // console.log(item);
            if (item.length > 1) {
              limitCategory.push(item[1]);
            } else {
              limitCategory.push(item[0]);
            }
          }
          // limitCategory = limitCategory.length == 0 ? undefined : limitCategory;
        }
        // else {
        //   limitCategory = undefined;
        // }
        //完了之后记得把本地的数据清除掉
        // sessionStorage.removeItem('similarSearchData');
        setPressureField(similarSearchData.pressureField);

        console.log('similarSearchData');
        console.log(similarSearchData);
        let searchParams = {
          limitCategoryId: limitCategory.length == 0 ? undefined : limitCategory,
          limitField: similarSearchData.limitField,
          // min: values.limitField != undefined ? values.min : undefined,
          // max: values.limitField != undefined ? values.max : undefined,
          min: similarSearchData.limitField != 'unLimited' ? similarSearchData.min : undefined,
          max: similarSearchData.limitField != 'unLimited' ? similarSearchData.max : undefined,

          impellerDiameterMax: similarSearchData.impellerDiameterMax,
          impellerDiameterMin: similarSearchData.impellerDiameterMin,
          sortFields: orderData,
          specificSpeed: expect.specificSpeed,
          sortFlowRate: expect.flowRate,
          sortFullPressure:
            similarSearchData.pressureField == 'fullPressure' ? expect.pressure : undefined,
          sortStaticPressure:
            similarSearchData.pressureField == 'staticPressure' ? expect.pressure : undefined,
          pressureField: similarSearchData.pressureField,
          // sortStaticPressure: expect.staticPressure,
          sortMotorSpeed: expect.motorSpeed,
        };
        // console.log('searchParams');
        // console.log(searchParams);
        console.log('-----------');

        setSearchParams(searchParams);
        console.log('-----------');

        actionRef.current?.reload();
        // console.log('fansData');
        // console.log(fansData);
      } else {
        setSearchParams(searchParams);
      }

      // sessionStorage.removeItem('expect');
    }
  }, []);
  const perfDataRef = useRef<{}>();
  // useEffect(() => {
  //   console.log('perfDataRef.current=perfData');

  //   perfDataRef.current = perfData;
  // }, [perfData]);

  const [perfData, setPerfData] = useState<{}>({});
  const [fansData, setFansData] = useState<FanTableItem[]>([]);

  useEffect(() => {
    console.log('selectedModels changed');
    console.log('fansData');
    console.log(fansData);
    console.log(form.getFieldValue('limitField'));

    if (fansData.length > 0) {
      if (
        form.getFieldValue('limitField') == 'flowRate' &&
        // fansData.length > 0 &&
        fansData[0].impellerDiameterMedian
      ) {
        console.log('!!!!!');
        console.log('selectedModels');
        console.log(selectedModels);
        console.log('perfData');
        console.log(perfData);
        // console.log('models');
        // console.log(models);

        // queryFansPerfData(selectedModels).then((res) => {
        queryFansPerfData(selectedFanIds).then((res) => {
          //相似变换
          console.log('相似变换');
          for (let i = 0; i < selectedModels.length; i++) {
            // let result = {};
            // for (let i = 0; i < Object.keys(res.data).length; i++) {
            //   result[res.data[selectedFanIds[i]]['modelId'][0]] = res.data[selectedFanIds[i]];
            // }
            // console.log('result');
            // console.log(result);
            let model = selectedModels[i];
            let fanId = selectedFanIds[i];
            console.log('selectedModels');
            console.log(selectedModels);
            console.log('selectedFanIds');
            console.log(selectedFanIds);
            // console.log('selectedModels[i]');
            // console.log(selectedModels[i]);
            // const model = models[i];

            let index = 0;
            for (let fan in fansData) {
              if (fansData[fan]['similarModel'] == model) {
                break;
              }
              index++;
            }
            if (index == fansData.length) {
              console.log('未找到对应信息');
            } else {
              console.log('res.data');
              console.log(res.data);

              console.log('fanId');
              console.log(fanId);

              let item = res.data[fanId];

              console.log('item');
              console.log(item);
              // console.log('fansData');
              // console.log(fansData);
              // console.log('fansData[index]');
              // console.log(fansData[index]);
              if (fansData[index] && fansData[index].impellerDiameterMedian) {
                const sdfImp =
                  fansData[index].impellerDiameterMedian / fansData[index].impellerDiameter;
                for (let j = 0; j < item['flowRate'].length; j++) {
                  let temp = item['flowRate'][j] * Math.pow(sdfImp, 3);
                  item['flowRate'][j] = fixNumFunc(temp, 3);

                  temp = item['fullPressure'][j] * Math.pow(sdfImp, 2);
                  item['fullPressure'][j] = fixNumFunc(temp, 1);
                  temp = item['staticPressure'][j] * Math.pow(sdfImp, 2);
                  item['staticPressure'][j] = fixNumFunc(temp, 1);

                  temp = item['shaftPower'][j] * Math.pow(sdfImp, 5);
                  item['shaftPower'][j] = fixNumFunc(temp, 3);

                  item['impellerDiameter'][j] = fansData[index].impellerDiameterMedian;
                }
              }

              if (searchParams.sortMotorSpeed) {
                const sdfMs = searchParams.sortMotorSpeed / fansData[index].motorSpeed;

                for (let j = 0; j < item['flowRate'].length; j++) {
                  let temp = item['flowRate'][j] * Math.pow(sdfMs, 1);
                  item['flowRate'][j] = fixNumFunc(temp, 3);

                  temp = item['fullPressure'][j] * Math.pow(sdfMs, 2);
                  item['fullPressure'][j] = fixNumFunc(temp, 1);
                  temp = item['staticPressure'][j] * Math.pow(sdfMs, 2);
                  item['staticPressure'][j] = fixNumFunc(temp, 1);

                  temp = item['shaftPower'][j] * Math.pow(sdfMs, 3);
                  item['shaftPower'][j] = fixNumFunc(temp, 3);

                  item['impellerDiameter'][j] = searchParams.sortMotorSpeed;
                }
              }
            }
            console.log('相似变换结果数据 res.data');
            console.log(res.data);
            console.log(selectedModels);
            console.log(res.data);
            let result = {};
            for (let i = 0; i < Object.keys(res.data).length; i++) {
              console.log(i);
              console.log(selectedModels[i]);

              result[selectedModels[i]] = res.data[selectedFanIds[i]];
            }
            console.log('相似变换结果数据 res.data');
            console.log('result');
            console.log(result);
            setPerfData(result);
            console.log('perfData');
            console.log(perfData);
            //TODO: 图表对相似变换结果刷新不及时 暂未找到原因 调用其他函数来刷新
            console.log('图表对相似变换结果刷新不及时 暂未找到原因 调用其他函数来刷新');

            onFinish(form.getFieldsValue());
            // handleRow({ model: selectedModels[0] }).onDoubleClick({ stopPropagation: () => {} });
          }
        });
      } else {
        console.log('!!!!!原始数据');
        console.log(selectedModels);
        queryFansPerfData(selectedFanIds).then((res) => {
          console.log('原始数据 origin.data');
          console.log(res.data);
          let result = {};
          for (let i = 0; i < Object.keys(res.data).length; i++) {
            console.log(i);
            console.log(selectedModels[i]);

            result[selectedModels[i]] = res.data[selectedFanIds[i]];
          }
          console.log('原始数据结果数据 res.data');
          console.log('result');
          console.log(result);
          setPerfData(result);
        });
      }
    }
    // }
    // , fansData
  }, [selectedModels, fansData]);

  // 计算比转速等等
  const onFinish = (values: any) => {
    console.log('onFinish');
    // console.log(values);
    // 全选则不筛选
    // if (values.limitCategoryId.length == 3) {
    //   values.limitCategoryId = undefined;
    // }
    let selectedModels1 = JSON.stringify(selectedModels);
    sessionStorage.setItem('selectedModels', selectedModels1);
    let orderData = JSON.stringify(value);
    sessionStorage.setItem('orderData', orderData);

    //存储填写信息
    values.pressureField = pressureField;
    let similarSearchData = JSON.stringify(values);
    console.log('@@@@@@@@@@@@@@@@@存储填写信息 similarSearchData');
    console.log(similarSearchData);

    sessionStorage.setItem('similarSearchData', similarSearchData);
    setSimilarButtVisable(true);

    // 计算过程...
    let {
      flowRate,
      pressure,
      motorSpeed,
      impellerDiameterMin,
      impellerDiameterMax,
      altitude,
      temperature,
    } = values;

    // console.log('flowRate');
    // console.log(flowRate);
    flowRate = flowRate / flowRateUnit;
    // atmosphericPressure
    pressure = CurrentToStandardStateAtmosphericPressure(pressure, altitude, temperature, 1);
    // console.log('motorSpeed');
    // console.log(motorSpeed);
    // console.log('pressure');
    // console.log(pressure);
    //比转速
    let ns: number = undefined;
    if (pressure != 0 && motorSpeed != 0 && motorSpeed != null && pressure != null) {
      ns = getSpecificSpeed(motorSpeed, flowRate, pressure, 3);
    }

    let Cv: number = 0; //流量系数
    let Cp: number = 0; //压力系数
    let impellerDiameter;
    if (impellerDiameterMax && impellerDiameterMin) {
      impellerDiameter = (impellerDiameterMax + impellerDiameterMin) / 2;
    }
    // console.log('impellerDiameter');
    // console.log(impellerDiameter);

    if (impellerDiameter != undefined && motorSpeed != undefined) {
      Cv = getCv(flowRate, motorSpeed, impellerDiameter, 3);
      Cp = getCp(pressure, motorSpeed, impellerDiameter, 3);
    }
    // console.log('Cv');
    // console.log(Cv);
    const usefulWork = fixNumFunc((flowRate * pressure) / 1000, 2);
    // console.log('usefulWork');
    // console.log(usefulWork);
    setCalculation({
      // power: 2,
      usefulWork: usefulWork,
      density: 1.205,
      flowRate: flowRate,
      pressure: pressure,
      motorSpeed: motorSpeed ? motorSpeed : undefined,

      specificSpeed: ns,
      flowCoefficient: Cv,
      pressureCoefficient: Cp,
    });

    let expect = JSON.stringify({
      // power: 2,
      usefulWork: usefulWork,
      density: 1.205,
      flowRate: flowRate,
      pressure: pressure,
      motorSpeed: motorSpeed,

      specificSpeed: ns,
      flowCoefficient: Cv,
      pressureCoefficient: Cp,
    });
    sessionStorage.setItem('expect', expect);
    return {
      // power: 2,
      usefulWork: usefulWork,
      density: 1.205,
      flowRate: flowRate,
      pressure: pressure,
      motorSpeed: motorSpeed,

      specificSpeed: ns,
      flowCoefficient: Cv,
      pressureCoefficient: Cp,
    };
  };

  const onSelect = (record: FanTableItem, selected: boolean) => {
    new Promise((resolve) => {
      console.log('################before select##############');
      console.log('selectedModels');
      console.log(selectedModels);
      console.log('selectedFanIds');
      console.log(selectedFanIds);
      if (selected) {
        console.log('ssssss');
        console.log(record);
        let models = Array.from(new Set([...selectedModels, record.similarModel]));
        // if (selectedModels.indexOf(record.similarModel)!=-1) {
        //   const index = selectedModels.indexOf(record.similarModel)
        //   let models = Array.from([...selectedModels, record.similarModel+'-']);
        // }
        // let models = Array.from([
        //   ...selectedModels,
        //   record.similarModel + '-' + record.figNum + '-' + record.version,
        // ]);
        setSelectedModels(models);
        let selectedModels1 = JSON.stringify(models);
        sessionStorage.setItem('selectedModels', selectedModels1);

        let fanIds = Array.from(new Set([...selectedFanIds, record.similarId]));
        setSelectedFanIds(fanIds);
        let selectedFanIds1 = JSON.stringify(fanIds);
        sessionStorage.setItem('selectedFanIds', selectedFanIds1);
      } else {
        // console.log('ssssss');
        // console.log(s);
        let s: string[] = [];
        selectedModels.forEach((k) => {
          if (record.similarModel != k) {
            s.push(k);
          }
        });
        setSelectedModels(s);
        let selectedModels1 = JSON.stringify(s);
        sessionStorage.setItem('selectedModels', selectedModels1);

        s = [];
        selectedFanIds.forEach((k) => {
          if (record.similarId != k) {
            s.push(k);
          }
        });
        setSelectedFanIds(s);

        let selectedFanIds1 = JSON.stringify(s);
        sessionStorage.setItem('selectedFanIds', selectedFanIds1);
      }
    });
  };
  const goFanDetail = (_: any, record: any) => {
    let similarSearchData = form.getFieldsValue();
    console.log('similarSearchData');
    console.log(similarSearchData);
    console.log(similarSearchData);
    similarSearchData = { ...similarSearchData, ...pageOption };
    similarSearchData.pressureField = pressureField;
    sessionStorage.setItem('similarSearchData', JSON.stringify(similarSearchData));
    let selectedModels1 = JSON.stringify(selectedModels);
    sessionStorage.setItem('selectedModels', selectedModels1);
    let orderData = JSON.stringify(value);
    sessionStorage.setItem('orderData', orderData);

    //存储预期参数
    console.log('存储预期参数orderData');
    console.log(orderData);
    // console.log(calculation);

    if (calculation != undefined) {
      let expect = JSON.stringify(calculation);
      sessionStorage.setItem('expect', expect);
    }
    // history.push(`/fan/detail/${record.model}/2`);
    history.push({
      pathname: `/fans/detail`,
      state: {
        id: record.id,
        model: record.model,
        activeKey: '2',
      },
    });
    const actionParams = {
      ...generalParams,
      actionId: `fan_${activeKey}_详情`,
      actionType: '查询',
      actionName: '查看风机详情',
      description: '查看风机数据_' + record.model + '-' + record.figNum + '-' + record.version,
    };
    saveUserAction({ params: actionParams }).catch((e) => {});
  };
  const designDetail = (_: any, record: any) => {
    const result = form.getFieldsValue();
    result.pressureField = pressureField;
    let similarSearchData = { ...result, ...pageOption };
    similarSearchData = JSON.stringify(similarSearchData);

    sessionStorage.setItem('similarSearchData', similarSearchData);
    let selectedModels1 = JSON.stringify(selectedModels);
    sessionStorage.setItem('selectedModels', selectedModels1);
    let orderData = JSON.stringify(value);
    sessionStorage.setItem('orderData', orderData);
    //存储预期参数
    console.log('存储预期参数 orderData');
    // console.log(value);
    console.log(calculation);

    if (calculation != undefined) {
      let expect = JSON.stringify(calculation);
      sessionStorage.setItem('expect', expect);
    }
    console.log('searchParams');
    console.log(searchParams);

    if (record.impellerDiameterMedian) {
      const inputRequire = form.getFieldsValue();
      console.log('inputRequire');
      console.log(inputRequire);

      history.push({
        pathname: `/fans/similarDesign/detail/2`,
        state: {
          id: record.id,
          model: record.model,
          figNum: record.figNum,
          version: record.version,
          type: searchParams.sortMotorSpeed ? '11' : '11',
          impellerDiameterMedian: record.impellerDiameterMedian,
          impellerDiameterRange: record.impellerDiameterRange,
          originMotorSpeed: record.motorSpeed,
          sortMotorSpeed: searchParams.sortMotorSpeed,
          flowRate: result.flowRate,
          pressureRange: [
            calculation.pressure * (1 - result.min / 100),
            calculation.pressure * (1 + result.max / 100),
          ],
          limitField: result.limitField,
          pressureField: pressureField,
          inputRequire: { ...inputRequire, pressureField: pressureField },
        },
      });
    } else {
      const inputRequire = form.getFieldsValue();
      console.log('inputRequire');
      console.log(inputRequire);
      history.push({
        pathname: `/fans/similarDesign/detail/2`,
        state: {
          id: record.id,
          model: record.model,
          originMotorSpeed: record.motorSpeed,

          type: '',
          limitField: result.limitField,
          inputRequire: { ...inputRequire, pressureField: pressureField },
        },

        // , impellerDiameter: record.impellerDiameterMedian
      });
    }
    // window.location.href = `/fan/similarDesign/detail/${record.model}`;
    // handleModalVisible(true);
  };
  const onValuesChange = (changeValues: any, calculation: CalculationItem | undefined) => {
    const humidity = changeValues.humidity;
    const values = form.getFieldsValue();
    const altitude = values.altitude;
    const temperature = values.temperature;
    const currentDensity = getCurrentDensity(altitude, temperature);

    const standardDensity = getCurrentDensity(0, 20);
    const currentPressure = fixNumFunc(
      (StandardAtmosphericPressure * standardDensity) / currentDensity,
      0,
    );
    form.setFieldValue('atmosphericDensity', fixNumFunc(currentDensity, 3));
    form.setFieldValue('atmosphericPressure', currentPressure);
    if (calculation != undefined) {
      // console.log('changeValues');
      // console.log(changeValues);
      onFinish(form.getFieldsValue());
    }
  };

  const treeData = [
    {
      title: '压力偏差',
      value: 'absPressureDeviation',
      key: 'absPressureDeviation',
    },
    {
      title: '效率',
      value: 'efficiency',
      key: 'efficiency',
    },
    {
      title: '噪音',
      value: 'noise',
      key: 'noise',
    },
    // {
    //   title: '性能偏差',
    //   value: '0-2',
    //   key: '0-2',
    // },
  ];

  const columns: ProColumns<FanTableItem>[] = [
    {
      title: '排序',
      key: 'order',
      hideInTable: true,
      hideInSearch: false,
      dataIndex: 'order',

      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <>
            <TreeSelect
              treeData={treeData}
              value={value}
              onChange={(e) => {
                console.log(e);
                setValue(e);
                let orderData = JSON.stringify(e);
                sessionStorage.setItem('orderData', orderData);
                setSearchParams({ ...searchParams, sortFields: e });
              }}
              treeCheckable={true}
              placeholder="请选择"
              //         treeData,
              //         value,
              //         onChange,
              //         treeCheckable: true,
              //         // showCheckedStrategy: SHOW_PARENT,
              //         placeholder: '请选择',
              style={{
                width: '100%',
              }}
              tagRender={(e: any) => {
                return (
                  <Tag closable onClose={e.onClose}>
                    <Space align="center" style={{ padding: 2 }}>
                      <Badge
                        color={'#87d068'}
                        count={value.indexOf(e.value) + 1}
                        size="small"
                      ></Badge>

                      {e.label}
                    </Space>
                  </Tag>
                );
              }}
            />
          </>
        );
      },
    },
    // {
    //   title: '序号',
    //   dataIndex: 'absPressureDeviation',

    //   align: 'center',
    //   hideInSearch: true,
    //   width: 80,
    // },
    {
      title: '序号',
      dataIndex: 'key',
      valueType: 'index',
      align: 'center',
      hideInSearch: true,
      width: 80,
      render: (text, record, index) => {
        // // console.log(pageOption);
        // if (record.key != undefined) {
        //   return null;
        // }

        const result = (pageOption.current - 1) * pageOption.pageSize + (index + 1);
        // console.log(result);
        return result;
      },
    },

    {
      title: '型号',
      // dataIndex: 'model',
      dataIndex: 'showModel',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,

      width: 80,
    },
    {
      title: '版本号',
      // dataIndex: 'model',
      dataIndex: 'version',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '流量',
      dataIndex: 'flowRate',
      valueType: 'digit',
      align: 'center',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '转速',
      dataIndex: 'motorSpeed',
      valueType: 'digit',
      align: 'center',
      hideInSearch: true,
      width: 80,
      render: (text, record, index) => {
        // console.log(record.similarMotorSpeed);

        if (record.similarMotorSpeed != undefined) {
          return (
            <>
              {record.motorSpeed}/
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record.similarMotorSpeed.toString()}
              </label>
            </>
          );
        } else {
          if (record.motorSpeedMin) {
            return record.motorSpeedMin + '/' + record.motorSpeed;
          }
          return record.motorSpeed;
        }
      },
    },
    // {
    //   title: '全压',
    //   dataIndex: 'fullPressure',
    //   valueType: 'digit',
    //   align: 'center',
    //   hideInSearch: true,
    //   // render: (text, record, index) => {
    //   //   console.log(record);

    //   //   if (record.similarFullPressure != undefined) {
    //   //     return record.fullPressure + '/' + record.similarFullPressure.toString();
    //   //   } else return record.fullPressure;
    //   // },
    //   width: 80,
    // },
    {
      title: '全压',
      dataIndex: 'fullPressure',
      valueType: 'digit',
      align: 'center',
      hideInSearch: true,
      render: (text, record, index) => {
        // console.log(record.fullPressureDeviation);
        // console.log(record.similarFullPressure);

        if (record.similarFullPressure != undefined && record.fullPressureDeviation != undefined) {
          return (
            <label
              style={{
                color: '#52c41a',
              }}
            >
              {record.similarFullPressure.toString()}({record.fullPressureDeviation.toString()}%)
            </label>
            // {record.similarFullPressure.toString() + '(' + record.deviation.toString() + '%)'}
          );
        } else if (record.similarFullPressure != undefined)
          return (
            <label
              style={{
                color: '#52c41a',
              }}
            >
              {record.similarFullPressure.toString()}
            </label>
          );
        else {
          return record.fullPressure;
        }
      },

      width: 80,
    },
    {
      title: '静压',
      dataIndex: 'staticPressure',
      valueType: 'digit',
      align: 'center',
      width: 80,
      hideInSearch: true,
      render: (text, record, index) => {
        // console.log(record.similarStaticPressure);
        // console.log(record.staticPressureDeviation);

        if (
          record.similarStaticPressure != undefined &&
          record.staticPressureDeviation != undefined
        ) {
          return (
            <label
              style={{
                color: '#52c41a',
              }}
            >
              {record.similarStaticPressure.toString()}({record.staticPressureDeviation.toString()}
              %)
            </label>
            // {record.similarStaticPressure.toString() + '(' + record.deviation.toString() + '%)'}
          );
        } else if (record.similarStaticPressure != undefined)
          return (
            <label
              style={{
                color: '#52c41a',
              }}
            >
              {record.similarStaticPressure.toString()}
              {/* ({record.staticPressureDeviation.toString()}%) */}
            </label>
          );
        else {
          return record.staticPressure;
        }
      },
    },
    {
      title: '效率',
      dataIndex: 'efficiency',
      valueType: 'digit',
      align: 'center',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '轴功率',
      dataIndex: 'shaftPower',
      valueType: 'digit',
      align: 'center',
      hideInSearch: true,
      width: 100,
      render: (text, record, index) => {
        // console.log(record.similarShaftPower);

        if (record.similarShaftPower != undefined) {
          return (
            <>
              {record.shaftPower}/
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record.similarShaftPower.toString()}
              </label>
            </>
          );
        } else {
          return record.shaftPower;
        }
      },
    },
    // {
    //   title: '叶轮直径',
    //   dataIndex: 'impellerDiameter',
    //   valueType: 'digit',
    //   align: 'center',
    //   hideInSearch: true,
    //   width: 100,
    // },
    {
      // title: (
      //   <>
      //    相似设计 <br />
      //     叶轮直径
      //   </>
      // ),
      title: '叶轮直径',
      dataIndex: 'impellerDiameterMedian',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      // hideInTable:  ,
      width: 160,

      render: (text, record, index) => {
        // console.log(record);

        if (record.impellerDiameterRange != undefined && record.impellerDiameterRange.length == 2) {
          return (
            <>
              {record.impellerDiameter}/
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record.impellerDiameterMedian}({record.impellerDiameterRange[0].toString()}~
                {record.impellerDiameterRange[1].toString()})
              </label>
            </>
            //  {record.impellerDiameterMedian +
            //   '(' +
            //   record.impellerDiameterRange[0].toString() +
            //   '~' +
            //   record.impellerDiameterRange[1].toString() +
            //   ')'}
            // <Typography.Text type="success"></Typography.Text>
          );
        } else return record.impellerDiameter;
      },
    },

    {
      title: '电机型号',
      dataIndex: 'motorModel',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 160,
    },
    {
      title: '风机类型',
      dataIndex: 'category',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      width: 160,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 150,
      render: (_, record) => [
        <a key="detail" onClick={() => goFanDetail(_, record)}>
          详情
        </a>,
        similarButtVisable ? (
          <a key="design" onClick={() => designDetail(_, record)}>
            相似设计
          </a>
        ) : null,
      ],
    },
  ];

  const [similarTableData, setSimilarTableData] = useState<[]>([]);
  const [similarPerfDataTableTitle, setSimilarPerfDataTableTitle] = useState<string>();

  const handleRow = (record: any) => {
    // console.log('handleRow');
    // 单击详情与单击行 事件重复触发
    return {
      // onClick: async (e: any) => {
      //   e.stopPropagation();
      //   await queryFanData(record.model).then((res) => {
      //     setFanInfo(res.data);
      //   });
      //   await queryFanPerfData(record.model).then((res) => {
      //     setPerfData(res.data);
      //   });
      // },
      onDoubleClick(event: any) {
        // console.log('onDoubleClick');
        event.stopPropagation(); //阻止默认事件
        // console.log("form.getFieldValue('limitField')");
        // console.log(form.getFieldValue('limitField'));

        if (form.getFieldValue('limitField') == 'flowRate' && record.impellerDiameterMedian) {
          let model;
          if (record.model.includes(')')) {
            model = record.model.split(')')[1];
          } else {
            model = record.model;
          }
          console.log(model);

          queryFanPerfOriginData(record.id)
            .then((res) => {
              console.log('res');
              console.log(res);

              const sdfImp = record.impellerDiameterMedian / record.impellerDiameter;
              for (let i = 0; i < res.data.length; i++) {
                // res.data.map((item) => {
                let item = res.data[i];

                let temp = item['flowRate'] * Math.pow(sdfImp, 3);
                item['flowRate'] = fixNumFunc(temp, 3);

                temp = item['fullPressure'] * Math.pow(sdfImp, 2);
                item['fullPressure'] = fixNumFunc(temp, 1);

                temp = item['staticPressure'] * Math.pow(sdfImp, 2);
                item['staticPressure'] = fixNumFunc(temp, 1);

                temp = item['shaftPower'] * Math.pow(sdfImp, 5);
                item['shaftPower'] = fixNumFunc(temp, 3);

                item['impellerDiameter'] = record.impellerDiameterMedian;
                item['key'] = i;
                res.data[i] = item;
              }
              if (record.similarMotorSpeed) {
                // console.log('!!!!!!!!!!!!!!!!');

                const sdfMs = record.similarMotorSpeed / record.motorSpeed;
                for (let i = 0; i < res.data.length; i++) {
                  // res.data.map((item) => {
                  let item = res.data[i];

                  let temp = item['flowRate'] * Math.pow(sdfMs, 1);
                  item['flowRate'] = fixNumFunc(temp, 3);

                  temp = item['fullPressure'] * Math.pow(sdfMs, 2);
                  item['fullPressure'] = fixNumFunc(temp, 1);

                  temp = item['staticPressure'] * Math.pow(sdfMs, 2);
                  item['staticPressure'] = fixNumFunc(temp, 1);

                  temp = item['shaftPower'] * Math.pow(sdfMs, 3);
                  item['shaftPower'] = fixNumFunc(temp, 3);

                  item['motorSpeed'] = record.similarMotorSpeed;
                  item['key'] = i;
                  res.data[i] = item;
                }
              }

              // console.log('res.data');
              // console.log(res.data);

              setSimilarTableData(res.data);
              setSimilarPerfDataTableTitle(record.model);
            })
            .catch((error) => {
              console.log(error);

              message.error('请求失败！');
              return;
            });
        } else {
          // if (form.getFieldValue('limitField') == 'unLimited') {
          queryFanPerfOriginData(record.id)
            .then((res) => {
              // console.log('res.data');
              // console.log(res.data);

              setSimilarTableData(res.data);
              setSimilarPerfDataTableTitle(record.model);
            })
            .catch((error) => {
              console.log(error);

              message.error('请求失败！');
              return;
            });
        }
      },
    };
  };

  const standardActionRef = useRef<ActionType>();
  const similarColumns: ProColumns<PerfDataItem>[] = [];
  let title = [];
  for (let key in excelTableColumns) {
    title.push(key.toString());
  }
  // console.log(title);
  for (let i = 0; i < title.length; i++) {
    if (
      ['specificSpeed', 'u', 'flowCoefficient', 'pressureCoefficient'].includes(
        excelTableColumns[title[i]],
      )
    ) {
      continue;
    }

    if (
      ['flowRate', 'fullPressure', 'staticPressure', 'shaftPower', 'impellerDiameter'].includes(
        excelTableColumns[title[i]],
      )
    ) {
      similarColumns.push({
        title: title[i],
        dataIndex: excelTableColumns[title[i]],
        valueType: 'digit',
        width: 80,
        render: (val: any, record: any) => {
          return <Typography.Text type="success">{val}</Typography.Text>;
        },
      });
    } else {
      similarColumns.push({
        title: title[i],
        dataIndex: excelTableColumns[title[i]],
        valueType: 'digit',
        width: 80,
      });
    }
  }
  const filter = (inputValue: string, path: DefaultOptionType[]) =>
    path.some(
      (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    );
  const onSubmit = async () => {
    try {
      setSelectedModels([]);
      setSelectedFanIds([]);
      sessionStorage.setItem('selectedModels', JSON.stringify([]));
      sessionStorage.setItem('selectedFanIds', JSON.stringify([]));
      setSimilarPerfDataTableTitle(undefined);

      // setSelectedModels(selectedModels);
      // setSelectedFanIds(selectedFanIds);
      const values = await form.validateFields();

      values.motorSpeed = values.motorSpeed ? values.motorSpeed : undefined;

      console.log('查询符合条件的风机型号result');
      console.log(values);
      const calculation = onFinish(values);
      // console.log('calculation');
      // console.log(calculation);

      // if (calculation != undefined) {
      //   let expect = JSON.stringify(calculation);
      //   sessionStorage.setItem('expect', expect);
      // }
      // 基于比转速、效率排序  查询符合条件的风机型号

      //设置table的params 然后刷新table
      console.log('设置table的params 然后刷新table');

      if (values.limitField != 'unLimited' && value.length == 0) {
        setValue(['absPressureDeviation']);
      }
      console.log('value');
      console.log(value);
      let limitCategoryList = values.limitCategoryId;
      let limitCategory: string[] = [];
      for (let i in limitCategoryList) {
        const item = limitCategoryList[i];
        if (item.length > 1) {
          limitCategory.push(item[1]);
        } else {
          limitCategory.push(item[0]);
        }
      }
      limitCategory = limitCategory.length == 0 ? undefined : limitCategory;
      const searchParams1 = {
        // current:
        // setBeforeSearchParams({
        ...searchParams,
        current: 1,
        // pageSize: pageOption.pageSize,
        specificSpeed: calculation?.specificSpeed,
        sortFlowRate: calculation?.flowRate,

        pressureField: pressureField,
        sortFullPressure: pressureField == 'fullPressure' ? calculation?.pressure : undefined,
        sortStaticPressure: pressureField == 'staticPressure' ? calculation?.pressure : undefined,
        // sortStaticPressure: calculation?.staticPressure,

        sortMotorSpeed: calculation?.motorSpeed,
        limitCategoryId: limitCategory,
        limitField: values.limitField,
        // min: values.limitField != undefined ? values.min : undefined,
        // max: values.limitField != undefined ? values.max : undefined,
        min: values.limitField != 'unLimited' ? values.min : undefined,
        max: values.limitField != 'unLimited' ? values.max : undefined,

        impellerDiameterMax: values.impellerDiameterMax,
        impellerDiameterMin: values.impellerDiameterMin,

        sortFields:
          values.limitField != 'unLimited' && value.length == 0 ? ['absPressureDeviation'] : value,
      };
      // console.log('searchParams');
      // console.log(searchParams1);

      setSearchParams(searchParams1);
      setSimilarButtVisable(true);
      // console.log('beforeSearchParams');
      // console.log(beforeSearchParams);
      // console.log('1111');
      // console.log({ current: 1, pageSize: pageOption.pageSize });

      setPageOption({ current: 1, pageSize: pageOption.pageSize });

      actionRef.current?.reload(true);
    } catch (error) {
      // let errorFields = error.errorFields;
      // console.log(errorFields);
      // // let errorFields: [] = error.errorFields
      // errorFields.map((item: any, index: number) => {
      //   //只输出第一个验证错误
      //   let errors = item.errors;
      //   while (errors.length > 1) {
      //     errors = errors.splice(1);
      //   }
      //   item.errors = errors;
      // });
      // // console.log(errorFields);
      // message.warn(errorFields[0].errors);
      // error.errorFields = errorFields;
    }
  };
  return (
    <>
      <PageContainer ghost header={{ title: '' }}>
        <ProCard split="vertical" className={styles.inputNum1}>
          {/* <div className={styles.card}> */}
          {/* colSpan={{ lg: 2, md: 4, sm: 6 }} */}
          <ProCard colSpan={7} size="small" bodyStyle={{ paddingRight: '10px' }}>
            <Form
              {...layout}
              name="nest-messages"
              form={form}
              // formRef={formRef}
              // onFinish={onFinish}
              // onValuesChange={reload}
              className={styles.formItem}
              onValuesChange={(e) => onValuesChange(e, calculation)}
              onFinish={onSubmit}
            >
              {/* step={0.01} addonAfter="m³/s"*/}
              {/* <InputNumber min={0} size="middle" addonAfter="m³/s" /> */}
              <Row wrap={false} gutter={6} align="middle">
                <Col span={24}>
                  <Form.Item
                    name={'limitCategoryId'}
                    label="选择系列"
                    labelCol={{ span: 5 }}
                    rules={[{ required: false, message: '请选择系列' }]}
                    // className={styles.formItem}
                    // initialValue={['轴流通风机', '离心通风机', '混流通风机']}
                  >
                    {/* <CheckboxGroup
                      options={plainOptions}
                      onChange={(list: CheckboxValueType[]) => {
                        console.log('list');
                        console.log(list);

                        form.setFieldValue('category', list);
                      }}
                    /> */}
                    <Cascader
                      style={{ width: '100%' }}
                      options={categoryList}
                      placeholder="请选择风机类型"
                      onSearch={(value) => console.log(value)}
                      showSearch={{ filter }}
                      expandTrigger="hover"
                      // showCheckedStrategy={Cascader.SHOW_CHILD}
                      onChange={(value: string[][]) => {
                        console.log('value');
                        console.log(value);
                        // let limitCategory = [];

                        // for (let i in value) {
                        //   const item = value[i];
                        //   console.log('item');
                        //   console.log(item);
                        //   if (item.length > 1) {
                        //     limitCategory.push(item[1]);
                        //   } else {
                        //     for (let j in categoryGroup[item[0]]) {
                        //       limitCategory.push(categoryGroup[item[0]][j]);
                        //     }
                        //   }
                        // }
                        // console.log('limitCategory');
                        // console.log(limitCategory);
                        // return limitCategory;
                        // form.setFieldValue('category', limitCategory);
                      }}
                      multiple
                      maxTagCount={10}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Divider children="输入工作参数：" orientation="left"></Divider>
              <Card style={{ marginBottom: 10 }} className={styles.cardBody}>
                <Row wrap={false} gutter={6} align="middle">
                  <Col span={20}>
                    <Form.Item
                      name={'flowRate'}
                      label="流量"
                      labelCol={{ span: 6 }}
                      rules={[{ required: true }, { type: 'number' }]}
                      // className={styles.formItem}
                      // initialValue={2.4}
                    >
                      <InputNumber
                        min={0}
                        size="middle"
                        style={{ width: '100%' }}
                        addonAfter={
                          <Select
                            value={flowRateUnit}
                            options={[
                              { label: 'm³/s', value: 1 },
                              { label: 'm³/min', value: 60 },
                              { label: 'm³/h', value: 3600 },
                            ]}
                            onChange={(value) => setFlowRateUnit(value)}
                          ></Select>
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row wrap={false} gutter={6} align="middle" style={{ marginBottom: 0 }}>
                  <Col span={24}>
                    <Form.Item
                      name={'limitField'}
                      label="限定"
                      labelCol={{ span: 5 }}
                      // rules={[{ required: true }]}
                      className={styles.formItem1}
                      initialValue={'flowRate'}
                    >
                      <Radio.Group
                        // defaultValue={'flowRate'}
                        value={form.getFieldValue('limitField')}
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log('value');
                          console.log(value);

                          if (value == 'unLimited') {
                            setPressureField('fullPressure');
                          }
                          form.setFieldValue('limitField', value);
                        }}
                      >
                        <Radio value={'flowRate'}>限定流量</Radio>
                        <Radio value={'unLimited'}>不限定流量</Radio>
                        {/* <Radio value={'pressure'}>限定压力</Radio> */}
                      </Radio.Group>
                      {/* <CheckboxGroup
                        options={limitOptions}
                        onChange={(list: CheckboxValueType[]) => {
                          // console.log('list');
                          // console.log(list);
                          form.setFieldValue('limitField', list);
                        }}
                      /> */}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              {/* <InputNumber min={0} addonAfter="Pa" /> */}
              <Card style={{ marginBottom: 10 }} className={styles.cardBody}>
                <Row wrap={false} gutter={6} align="middle" justify="start">
                  <Col span={5}>
                    <Row wrap={false} justify="end" align="middle">
                      {/* <Col style={{ paddingBottom: 12 }}>{requiredLabel}</Col> */}
                      <Col style={{ paddingBottom: 6 }}>
                        <div className={styles.select}>
                          <Select
                            bordered={false}
                            // size="small"
                            value={pressureField}
                            // defaultValue={pressureField}
                            options={[
                              { label: <> {requiredLabel} 全压 </>, value: 'fullPressure' },
                              form.getFieldValue('limitField') == 'flowRate'
                                ? { label: <> {requiredLabel} 静压 </>, value: 'staticPressure' }
                                : {},
                            ]}
                            onChange={(value) => {
                              console.log('value');
                              console.log(value);

                              setPressureField(value);
                            }}
                          />
                        </div>
                      </Col>
                      <Col style={{ paddingBottom: 12 }}>
                        <Typography.Text>:</Typography.Text>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={15}>
                    <Form.Item
                      // // labelAlign="right"
                      name={'pressure'}
                      // 存在焦点问题 点击select会跳转到input框
                      // label={<div className={styles.select}>
                      //   <Select
                      //     bordered={false}
                      //     ref={myRef}
                      //     // size="small"
                      //     // value={pressureField}
                      //     defaultValue={pressureField}
                      //     options={[
                      //       { label: '全压', value: 'fullPressure' },
                      //       { label: '静压', value: 'staticPressure' },
                      //     ]}
                      //     onChange={(value) => {
                      //       console.log(event);
                      //       event.stopPropagation(); //阻止默认事件

                      //       console.log('value');
                      //       console.log(value);

                      //       // setPressureField(value);
                      //     }}
                      //   /></div>
                      // }
                      // label=""
                      // labelCol={{ span: 12 }}

                      wrapperCol={{}}
                      rules={[{ required: true, message: '请输入压力!' }]}

                      // initialValue={1700}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        size="middle"
                        onClick={(event) => {
                          console.log(event);
                          // event.view.blur();
                          // event.stopPropagation(); //阻止默认事件
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={1} style={{ marginBottom: 12 }}>
                    Pa
                  </Col>
                </Row>
                <Row wrap={false} align="middle" gutter={6} justify="start">
                  <Col span={12}>
                    <Form.Item
                      label="误差"
                      name="min"
                      labelCol={{ span: 10 }}
                      initialValue={5}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(rule: any, value: number) {
                            if (value > getFieldValue('min')) {
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
                        max={20}
                        addonBefore="-"
                        style={{ width: '100%', textAlign: 'center' }}
                        // addonAfter={'r/min'}
                        placeholder="最小值"
                        onChange={(value) => {
                          if (value) {
                            form.setFieldValue('min', value);
                          }
                        }}
                      />
                      {/*, )} */}
                    </Form.Item>
                  </Col>
                  <Col span={1} style={{ marginBottom: 12 }}>
                    ~
                  </Col>
                  <Col span={7}>
                    <Form.Item
                      name="max"
                      wrapperCol={{}}
                      initialValue={5}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(rule: any, value: number) {
                            if (value < getFieldValue('max')) {
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
                        addonBefore="+"
                        max={20}
                        min={0}
                        placeholder="最大值"
                        // addonAfter={'r/min'}
                        // formatter={(value) => `${value + unitDict[sortParam3]}`}
                        onChange={(value) => {
                          form.setFieldValue('max', value);

                          // console.log('max value');
                          // console.log(value);
                          // console.log("getFieldValue('motorSpeedMax')");
                          // // console.log(formRef.current.getFieldValue('motorSpeedMax'));
                          // console.log(form.getFieldValue('motorSpeedMax'));
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col flex={1} style={{ marginBottom: 12 }}>
                    %
                  </Col>
                </Row>
              </Card>
              {/* <InputNumber min={0} addonAfter="r/min" /> */}
              <Row wrap={false} gutter={6}>
                <Col span={20}>
                  <Form.Item
                    name={'motorSpeed'}
                    label="转速"
                    labelCol={{ span: 6 }}
                    rules={[
                      { required: form.getFieldValue('limitField') == 'unLimited' ? true : false },
                      { type: 'number' },
                    ]}
                    // initialValue={2964}
                  >
                    <InputNumber min={1} placeholder="请输入转速" size="middle" />
                  </Form.Item>
                </Col>
                <Col style={{ marginBottom: 12 }}>r/min</Col>
              </Row>
              <Row wrap={false} align="middle" gutter={6} justify="start">
                <Col span={12}>
                  <Form.Item
                    label="叶轮直径"
                    name="impellerDiameterMin"
                    labelCol={{ span: 10 }}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule: any, value: number) {
                          if (value > getFieldValue('impellerDiameterMax')) {
                            return Promise.reject('最小值未小于最大值!');
                          }
                          // form.validateFields(['motorSpeed']);
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <InputNumber
                      min={1}
                      style={{ width: '100%', textAlign: 'center' }}
                      // addonAfter={'r/min'}
                      placeholder="最小值"
                      onChange={(value) => {}}
                    />
                    {/*, )} */}
                  </Form.Item>
                </Col>
                <Col span={1} style={{ marginBottom: 12 }}>
                  ~
                </Col>
                <Col span={7}>
                  <Form.Item
                    name="impellerDiameterMax"
                    wrapperCol={{}}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule: any, value: number) {
                          if (value < getFieldValue('impellerDiameterMin')) {
                            return Promise.reject('最大值未大于最小值!');
                          }
                          // form.validateFields(['motorSpeedMin']);
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <InputNumber
                      min={1}
                      style={{
                        width: '100%',
                        textAlign: 'center',
                      }}
                      placeholder="最大值"
                      // addonAfter={'r/min'}
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
                <Col flex={1} style={{ marginBottom: 12 }}>
                  mm
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  {/* <InputNumber min={0} defaultValue={0} addonAfter="m" /> */}

                  <Row wrap={false} gutter={6} align="middle">
                    <Col>
                      <Form.Item
                        name={'altitude'}
                        label="海拔"
                        labelCol={{ sm: 12, md: 12, lg: 11 }}
                        rules={[{ required: true }, { type: 'number' }]}
                        initialValue={0}
                      >
                        <InputNumber min={0} size="middle" />
                      </Form.Item>
                    </Col>
                    <Col style={{ marginBottom: 12 }}>m</Col>
                  </Row>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  {/* <InputNumber min={0} defaultValue={0} addonAfter="℃" /> */}

                  <Row wrap={false} gutter={6} align="middle">
                    <Col>
                      <Form.Item
                        name={'temperature'}
                        label="温度"
                        labelCol={{ sm: 12, md: 12, lg: 8 }}
                        rules={[{ required: true }, { type: 'number' }]}
                        initialValue={20}
                      >
                        <InputNumber min={0} size="middle" />
                      </Form.Item>
                    </Col>
                    <Col style={{ marginBottom: 12 }}>℃</Col>
                  </Row>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <Row wrap={false} gutter={6} align="middle">
                    <Col>
                      <Form.Item
                        name={'humidity'}
                        label="湿度"
                        labelCol={{ sm: 12, md: 12, lg: 11 }}
                        rules={[{ required: true }, { type: 'number' }]}
                        initialValue={50}
                      >
                        <InputNumber min={0} size="middle" />
                      </Form.Item>
                    </Col>
                    <Col style={{ marginBottom: 12 }}>%</Col>
                  </Row>
                </Col>
                <Col lg={12} md={12} sm={24}>
                  <Row wrap={false} gutter={6} align="middle">
                    <Col>
                      <Form.Item
                        name={'atmosphericPressure'}
                        label="大气压"
                        labelCol={{ sm: 12, md: 12, lg: 8 }}
                        rules={[{ required: false, type: 'number' }]}
                        initialValue={101325}
                      >
                        <InputNumber min={0} size="middle" disabled />
                      </Form.Item>
                    </Col>
                    <Col style={{ marginBottom: 12 }}>Pa</Col>
                  </Row>
                </Col>
              </Row>
              {/* <Row gutter={16}>
              <Col span={20}>
                <Row wrap={false} gutter={6} align="middle">
                  <Col>
                    <Form.Item
                      name={'atmosphericDensity'}
                      label="大气密度"
                      labelCol={{ span: 6 }}
                      rules={[{ required: true }, { type: 'number' }]}
                    >
                      <InputNumber min={0} size="middle" disabled />
                    </Form.Item>
                  </Col>
                  <Col style={{ marginBottom: 12 }}>Pa</Col>
                </Row>
              </Col>
            </Row> */}
              <Row wrap={false} gutter={6}>
                <Col span={20}>
                  <Form.Item
                    name={'atmosphericDensity'}
                    label="大气密度"
                    labelCol={{ span: 6 }}
                    rules={[{ required: false }, { type: 'number' }]}
                    initialValue={1.205}
                  >
                    <InputNumber min={1} size="middle" disabled />
                  </Form.Item>
                </Col>
                <Col style={{ marginBottom: 12 }}>kg/m³</Col>
              </Row>
              <Row wrap={false} justify="center" gutter={16} align="middle">
                <Col>
                  <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
                    <Button
                      onClick={() => {
                        form.resetFields();
                        sessionStorage.removeItem('expect');
                        sessionStorage.removeItem('similarSearchData');
                        sessionStorage.removeItem('orderData');
                        sessionStorage.removeItem('selectedModels');
                        sessionStorage.removeItem('selectedFanIds');
                        setSimilarButtVisable(false);
                        // form?.submit();
                        // console.log('searchParams');
                        // console.log(searchParams);
                        setCalculation(undefined);
                        setValue([]);
                        setSelectedModels([]);
                        setSelectedFanIds([]);

                        setSearchParams({
                          ...searchParams,
                          specificSpeed: undefined,
                          sortFlowRate: undefined,
                          sortPressure: undefined,
                          sortMotorSpeed: undefined,
                          limitField: undefined,
                        });
                      }}
                    >
                      重置
                    </Button>
                  </Form.Item>
                </Col>
                <Col>
                  {/* <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
                    <Button type="primary" htmlType="submit">
                      计算
                    </Button>
                  </Form.Item> */}
                  <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      // onClick={}
                    >
                      查询
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Divider />
            {calculation == undefined ? null : (
              <>
                <Descriptions
                  title="标准条件"
                  labelStyle={{ justifyContent: 'flex-end', minWidth: 90 }}
                  // contentStyle={{ justifyContent: 'flex-start', minWidth: 80 }}
                  column={2}
                >
                  {/* <Descriptions.Item label="大气压力 ">101.325kPa</Descriptions.Item>
                <Descriptions.Item label="温度 ">20℃</Descriptions.Item>
                <Descriptions.Item label="湿度">50%</Descriptions.Item>
                <Descriptions.Item label="海拔 ">0m</Descriptions.Item> */}

                  <Descriptions.Item label="流量">
                    {/* {calculation?.flowRate} */}
                    {calculation?.flowRate == 0 ? '/' : calculation?.flowRate + 'm³/s'}
                  </Descriptions.Item>
                  <Descriptions.Item label="压力">
                    {/* {calculation?.fullPressure} */}
                    {calculation?.pressure == 0 ? '/' : calculation?.pressure + 'Pa'}
                  </Descriptions.Item>
                  <Descriptions.Item label="有用功Q*Pt">
                    {/* {calculation?.usefulWork} */}
                    {calculation?.usefulWork == 0 ? '/' : calculation?.usefulWork + 'kW'}
                  </Descriptions.Item>
                  <Descriptions.Item label="密度">
                    {/* {calculation?.density} */}
                    {calculation?.density == 0 ? '/' : calculation?.density + 'kg/m³'}
                  </Descriptions.Item>
                </Descriptions>
                <Divider style={{ marginTop: 0, marginBottom: 10 }} />
                <Descriptions
                  // title="标准条件"
                  labelStyle={{ justifyContent: 'flex-end', minWidth: 90 }}
                  // contentStyle={{ justifyContent: 'flex-start', minWidth: 80 }}
                  column={2}
                >
                  <Descriptions.Item label="大气压力 ">101.325kPa</Descriptions.Item>
                  <Descriptions.Item label="温度 ">20℃</Descriptions.Item>
                  <Descriptions.Item label="湿度">50%</Descriptions.Item>
                  <Descriptions.Item label="海拔 ">0m</Descriptions.Item>
                </Descriptions>
                <Descriptions
                  title={
                    // <Tooltip title="流量系数、压力系数的计算叶轮直径取输入范围中值">
                    //   无因次参数
                    //
                    '无因次参数'
                  }
                  labelStyle={{ justifyContent: 'flex-end', minWidth: 90 }}
                  // contentStyle={{ justifyContent: 'flex-start', minWidth: 100 }}
                  column={2}
                >
                  <Descriptions.Item
                    label={
                      <Tooltip title="流量系数的计算叶轮直径取输入范围中值"> 流量系数 </Tooltip>
                    }
                  >
                    {calculation?.flowCoefficient == 0 ? '/' : calculation?.flowCoefficient}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <Tooltip title="压力系数的计算叶轮直径取输入范围中值"> 压力系数 </Tooltip>
                    }
                  >
                    {calculation?.pressureCoefficient == 0 ? '/' : calculation?.pressureCoefficient}
                  </Descriptions.Item>

                  <Descriptions.Item label="比转速 ">
                    {/* {calculation?.specificSpeed} */}
                    {calculation?.specificSpeed == 0 ? '/' : calculation?.specificSpeed}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}
          </ProCard>
          {/* </div> */}
          <ProCard colSpan={17} size="small" bodyStyle={{ paddingRight: '0px', paddingLeft: 0 }}>
            <ProTable
              columns={columns}
              // expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
              actionRef={actionRef}
              search={{
                labelWidth: 'auto',
                // optionRender: false,
                span: 12,
                defaultCollapsed: false,
                style: { paddingTop: 0, paddingBottom: 0 },
                className: styles.tableSearch,
                optionRender: ({ searchText, resetText }, { form }, dom) => [],
              }}
              options={false}
              // rowKey="model"
              // rowKey="similarModel"
              rowKey="similarId"
              // rowKey="key"
              rowSelection={{
                columnWidth: 85,

                // selectedModels,
                // selectedModels,
                // selectedRowKeys: selectedModels,
                selectedRowKeys: selectedFanIds,

                // selectedKeys,
                // onChange: onSelectChange,
                onSelect: onSelect,
                columnTitle: '勾选对比', //去掉全选
                // columnTitle:  { <br /> }  , //去掉全选
                getCheckboxProps: (record) => {
                  if (selectedFanIds.length < 4) {
                    return { disabled: false };
                  }
                  return {
                    disabled: selectedFanIds.indexOf(record.id) == -1 ? true : false,
                  };
                },
              }}
              onRow={handleRow}
              tableAlertRender={false}
              params={searchParams}
              request={async (params) => {
                console.log('request params');
                console.log(params);
                // ...beforeSearchParams,
                params = { ...params };
                const res = await querySimilarFansList(params).then((res) => {
                  console.log('---------');

                  setFansData(res.data);
                  console.log('---------');

                  return res;
                });
                const actionParams = {
                  ...generalParams,
                  actionId: `fan_${activeKey}_查询`,
                  actionType: '查询',
                  actionName: '查询风机列表',
                  description: JSON.stringify(params),
                };
                saveUserAction({ params: actionParams }).catch((e) => {});
                // console.log('res');
                // console.log(res);
                // console.log('===========');

                // setFansData(res.data);
                // console.log('===========');

                return res;
                // return {
                //   data: res.data,
                //   total: res.total,
                // };
              }}
              pagination={{
                ...pageOption,
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['5', '10', '20', '50'], // 每页数量选项
                // onChange: (current, size) => {
                //   setPageOption({ current: current, pageSize: size });
                //   // setSearchParams({ ...searchParams, current: current, pageSize: size });
                // },
              }}
              onChange={(e) => {
                // console.log('2222');
                // console.log({ current: e.current, pageSize: e.pageSize });

                setPageOption({ current: e.current, pageSize: e.pageSize });
                setSearchParams({ ...searchParams, current: e.current, pageSize: e.pageSize });
              }}
              // beforeSearchSubmit={(e) => {
              //   beforeSearchSubmit(e, pageOption, searchParams);
              // }}
            ></ProTable>

            {similarPerfDataTableTitle == undefined ? (
              <Divider />
            ) : (
              <>
                <Row wrap={false} align="middle">
                  <Col span={23}>
                    {' '}
                    <Divider
                      children={'型号-' + similarPerfDataTableTitle + ':'}
                      orientation="left"
                    />
                  </Col>
                  <Col span={'flex'}>
                    <Button
                      ghost
                      onClick={() => {
                        setSimilarPerfDataTableTitle(undefined);
                      }}
                    >
                      <CloseOutlined style={{ color: '#1f1f1f' }} />
                    </Button>
                  </Col>
                </Row>

                <ProTable
                  size="small"
                  search={false}
                  options={false}
                  pagination={false}
                  columns={similarColumns}
                  rowKey={'key'}
                  // actionRef={standardActionRef}
                  dataSource={similarTableData}
                ></ProTable>
              </>
            )}
            {selectedModels.length == 0 ? null : selectedModels.length !=
              Object.keys(perfData).length ? (
              <PageLoading></PageLoading> // ||fansData.length == 0 //
            ) : (
              <PerfCurveCompare
                selectedModels={selectedModels}
                // perfData={perfData}
                getPerfData={() => {
                  return perfData;
                }}
                expect={calculation}
                pressureField={pressureField}
              />
            )}
          </ProCard>
        </ProCard>
      </PageContainer>
    </>
  );
};

export default FanSimilarDesign;
{
  /* <Row wrap={false} gutter={6} align="middle">
                <Col span={20}>
                  <Form.Item
                    // // labelAlign="right"
                    name={'fullPressure'}
                    // label={
                    //   <>
                    //     <Radio.Group>
                    //       <Radio>全压</Radio>
                    //       <Radio>静压</Radio>
                    //     </Radio.Group>
                    //   </>
                    // }
                    // labelCol={{ span: 10 }}
                    labelCol={{ span: 6 }}
                    label="压力"
                    rules={[{ required: true }, { type: 'number' }]}
                    // initialValue={1249.4}
                  >
                    <InputNumber min={0} size="middle" />
                  </Form.Item>
                </Col>

                <Col style={{ marginBottom: 12 }}>Pa</Col>
              </Row>
              <Row wrap={false} gutter={6} align="middle" justify={'center'}>
                <Col span={20}>
                  <Form.Item
                    // // labelAlign="right"
                    name={'fullPressure'}
                    label=""
                    labelCol={{ span: 10 }}
                    rules={[{ required: true }, { type: 'number' }]}
                    // initialValue={1249.4}
                  >
                    <>
                      <Radio.Group>
                        <Radio>全压</Radio>
                        <Radio>静压</Radio>
                      </Radio.Group>
                    </>
                  </Form.Item>
                </Col>
              </Row> */
}
