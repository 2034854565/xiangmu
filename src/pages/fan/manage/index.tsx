import { DownloadOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import {
  Button,
  Space,
  Popconfirm,
  notification,
  Row,
  Col,
  Typography,
  Card,
  Select,
  Tooltip,
  message,
  Radio,
  RadioChangeEvent,
  InputNumber,
  Checkbox,
  Popover,
} from 'antd';
import React, { useRef, useEffect, useMemo, useState, Key } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { deleteFansData, importFansData } from './service';
import { history } from 'umi';
import { Input, Tree, Image } from 'antd';
import styles from './style.less';
import type { DataNode, EventDataNode } from 'antd/es/tree';
import PerformanceGraph from '../../charts/performanceGraph';
import ImportExcel from '@/components/importExcel';
import {
  getFanApplicationModelData,
  getFanCategoryData,
  getFanCoolObjectData,
} from '../create/service';
import {
  getFanCategoryAndModelData,
  queryFanData,
  queryFanPerfData,
  queryFansList,
} from '../selection/service';
import { FanListItem } from '../data';
import { ProCard } from '@ant-design/pro-components';
import { download } from '../service';
import { excelTableColumns } from '../create/components/BaseInfoForm/data.d';
import { saveUserAction } from '@/services/ant-design-pro/api';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};
const title = [
  '应用车型',
  '冷却对象',
  '风机类型',
  '风机型号',
  '图号',
  '流量(m3/s)',
  '全压(Pa)',
  '静压(Pa)',
  '效率(%)',
  '轴功率(kW)',
  '叶轮直径(mm)',
  '重量(Kg)',
  '电机型号',
  '转速',
  '额定电压',
  '额定电流',
  '备注1(项目名称)',
  '备注2(客户)',
];
const dataIndex = [
  'applicationModel',
  'coolObject',
  'category',
  'model',
  'imgMain',
  'flowRate',
  'fullPressure',
  'staticPressure',
  'efficiency',
  'shaftPower',
  'impellerDiameter',
  'weight',
  'motorModel',
  'motorSpeed',
  'ratedVoltage',
  'ratedCurrent',
  'remark1',
  'remark2',
];
const FanManage: React.FC<{ permission: number[] }> = (props) => {
  // console.log('FanSelection props');
  // console.log(props);
  const { permission } = props;
  const [categoryList, setCategoryList] = useState<{}>({});
  const [applicationModelList, setApplicationModelList] = useState<{}>({});
  const [coolObjectList, setCoolObjectList] = useState<{}>({});
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [defaultTreeData, setDefaultTreeData] = useState<any[]>([]);
  const [dataList, setDataList] = useState<{ key: React.Key; title: string }[]>([]);
  const [fanInfo, setFanInfo] = useState<FanListItem>();
  let [perfData, setPerfData] = useState<{}>({});
  const getPerfData = () => {
    return perfData;
  };
  let [searchParams, setSearchParams] = useState<{}>({});
  let [beforeSearchParams, setBeforeSearchParams] = useState<{}>({});
  const [pageOption, setPageOption] = useState<{ current: number; pageSize: number }>({
    current: 1, //当前页为1
    pageSize: 5, //一页5行
  });
  const [echartsInstance, setEchartsInstance] = useState<echarts.ECharts>();

  const formRef = useRef();
  let pageArea = '';
  let activeKey = '4';
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
  useEffect(() => {
    getFanCategoryAndModelData()
      .then((res) => {
        const { treeData, dataList } = listToTree(res.data);
        // dataRef.current = treeData
        setDataList(dataList);
        setDefaultTreeData(treeData);
      })
      .catch((error) => {
        message.error('请求失败！');
        return;
      });
    getFanCategoryData().then((res: any) => {
      let cL = {};
      for (let i = 0; i < res.data.length; i++) {
        cL[res.data[i]] = res.data[i];
      }

      setCategoryList(cL);
      getFanApplicationModelData().then((res: any) => {
        let aML = {};
        for (let i = 0; i < res.data.length; i++) {
          aML[res.data[i]] = res.data[i];
        }
        console.log(aML);
        setApplicationModelList(aML);
      });
      getFanCoolObjectData().then((res: any) => {
        let cO = {};
        for (let i = 0; i < res.data.length; i++) {
          cO[res.data[i]] = res.data[i];
        }
        console.log(cO);
        setCoolObjectList(cO);
      });
    });

    console.log('useEffect sessionStorage');
    // console.log(sessionStorage);
    //把取到的JSON格式的转化为JS格式
    try {
      let searchData: any = sessionStorage.getItem('searchData');
      if (searchData) {
        searchData = JSON.parse(searchData);
        setSearchParams(searchData);

        console.log('把searchData赋值到搜索表单里面 ');
        console.log(searchData);
        console.log('searchData.category');
        console.log(searchData.category);

        if (searchData.sortParam1 != undefined) {
          setSortParma1(searchData.sortParam1);
        }
        if (searchData.sortParam2 != undefined) {
          setSortParma2(searchData.sortParam2);
        }
        if (searchData.sortParam3 != undefined) {
          setSortParma3(searchData.sortParam3);
        }
        if (searchData.sortParam4 != undefined) {
          setSortParma4(searchData.sortParam4);
        }
        if (searchData.checkedControl != undefined) {
          setCheckedControl(searchData.checkedControl);
        }
        if (searchData.sortRange != undefined) {
          setSortRange(searchData.sortRange);
        }
        if (searchData.checkDisable != undefined) {
          setCheckedDisabled(searchData.checkDisable);
        }
        let params = ['flowRate', 'fullPressure', 'motorSpeed', 'shaftPower', 'efficiency'];
        for (let i = 0; i < 4; i++) {
          const key = params[i];
          if (searchData[key + 'Between'] != undefined) {
            searchData[key] = searchData[key + 'Between'];
            searchData[key + 'Between'] = undefined;
          }
        }
        console.log('beforeSearchParams');
        console.log(beforeSearchParams);

        if (searchData.sort != undefined) {
          setBeforeSearchParams({
            ...beforeSearchParams,
            sort: searchData.sort,
            sortRange: searchData.sortRange,
            sortParam1: searchData.sortParam1,
            sortParam2: searchData.sortParam2,
          });
        }
      }
      // 把值赋值到搜索表单里面
      formRef.current?.setFieldsValue(searchData);
      console.log('formRef.current?.getFieldsValue()');
      console.log(formRef.current?.getFieldsValue());

      formRef.current?.submit();
      // actionRef.current?.reload();
    } catch (error) {
      //完了之后记得把本地的数据清除掉
      //
      sessionStorage.removeItem('searchData');
    }
  }, []);

  const [excelData, setExcelData] = useState<FanListItem[]>([]);
  const submitExcelData = (data: FanListItem[]) => {
    console.log('submitExcelData');
    console.log(data);
    //TODO:存储excel数据
    importFansData(data);
    actionRef.current?.reload();
    setExcelData(data);
    // console.log('setExcelData1')
    // console.log(excelData)
  };
  const [checkedControl, setCheckedControl] = useState<boolean[]>([false, false]);
  const [checkDisable, setCheckedDisabled] = useState<boolean[]>([true, true]);

  const [sortRange, setSortRange] = useState<number | undefined>(5);
  const [sortParam1, setSortParma1] = useState<string>('flowRate');
  const [sortParam2, setSortParma2] = useState<string>('fullPressure');
  const [sortParam3, setSortParma3] = useState<string>('motorSpeed');
  const [sortParam4, setSortParma4] = useState<string>('shaftPower');
  const unitDict = {
    flowRate: 'm³/s',
    fullPressure: 'Pa',
    motorSpeed: 'r/min',
    shaftPower: 'kW',
    efficiency: '%',
  };
  const onSearchRatioChange = (e: RadioChangeEvent) => {
    console.log('onSearchRatioChange');
    console.log(e);
    setSortRange(e.target.value);
    setBeforeSearchParams({ ...beforeSearchParams, sortRange: e.target.value });
  };

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  const onTreeSelect = (
    selectedKeys: Key[],
    info: {
      event: 'select';
      selected: boolean;
      node: EventDataNode<DataNode>;
      selectedNodes: DataNode[];
      nativeEvent: MouseEvent;
    },
  ) => {
    console.log(selectedKeys);
    if (selectedKeys.length == 0) {
      setSearchParams({});
    } else {
      const params = selectedKeys[0].split('-');
      const level = info.node.pos.split('-').length - 2;
      switch (level) {
        case 0:
          setSearchParams({ applicationModelId: params[0] });
          break;
        case 1:
          setSearchParams({ applicationModelId: params[0], coolObject: params[1] });
          break;
        case 2:
          setSearchParams({
            applicationModelId: params[0],
            coolObject: params[1],
            categoryId: params[2],
          });
          break;
        case 3:
          setSearchParams({
            applicationModelId: params[0],
            coolObject: params[1],
            categoryId: params[2],
            category: params[3],
          });
          break;
      }
    }
    console.log('searchParams');
    console.log(searchParams);
    actionRef.current?.reload();
  };
  const listToTree = (listData: {}) => {
    //后端传递给前端的是四层嵌套格式
    // console.log('listData');
    // console.log(listData);
    let treeData: { title: string; key: string; children: any }[] = [];
    let keyList: string[] = [];
    let dataList: { key: string; title: string }[] = [];

    let i = 0;
    for (let key in listData) {
      treeData.push({ title: key, key: key, children: [] });
      keyList.push(key);

      // dataList.push({ key: key, title: key });
      let coolDict = listData[key];
      let j = 0;
      // console.log('coolDict');
      // console.log(coolDict);
      for (let cool in coolDict) {
        treeData[i].children.push({
          title: cool,
          key: key + '-' + cool,
          children: [],
        });
        keyList.push(cool);
        // dataList.push({ key: cool, title: cool });

        let categoryDict = coolDict[cool];
        // console.log('categoryDict');
        // console.log(categoryDict);
        let k = 0;

        for (let category in categoryDict) {
          treeData[i].children[j].children.push({
            title: category,
            key: key + '-' + cool + '-' + category,
            children: [],
          });
          // let children: { title: string; key: string }[] = [];
          let children: DataNode[] = [];
          const modelList = categoryDict[category];
          // console.log('modelList[' + category + ']');
          // console.log(modelList);
          if (typeof modelList == 'string') {
            treeData[i].children[j].children[k].children = [];
            treeData[i].children[j].children[k].children.push({
              title: modelList,
              key: key + '-' + cool + '-' + category + '-' + modelList,
              children: [],
            });
          } else {
            modelList.forEach((element: string) => {
              children.push({
                title: element,
                key: key + '-' + cool + '-' + category + '-' + element,
              });
              keyList.push(element);

              // dataList.push({ key: element, title: element });
            });
            // treeData[i].children[j].children[k].children = children;
            // console.log(treeData);
            // console.log(treeData[i].children[j].children[k]);
          }
          k++;
        }
        j++;
      }
      i++;
    }
    keyList = [...new Set(keyList)];
    keyList.forEach((key) => {
      dataList.push({ key: key, title: key });
    });
    // console.log('treeData');
    // console.log(treeData);
    // console.log('dataList');
    // console.log(dataList);
    return { treeData: treeData, dataList: dataList };
  };

  //风机类型搜索
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    dataList: { key: React.Key; title: string }[],
  ) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const treeData = useMemo(() => {
    //
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        // console.log('item');
        // console.log(item);
        const strTitle = item.title as string;
        // console.log('strTitle');
        // console.log(strTitle);

        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    return loop(defaultTreeData);
  }, [searchValue, defaultTreeData]);

  const actionRef = useRef<ActionType>();

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
        console.log(event);
        event.stopPropagation(); //阻止默认事件
        queryFanData(record.model)
          .then((res) => {
            setFanInfo(res.data);
          })
          .catch((error) => {
            message.error('请求失败！');
            return;
          });
        queryFanPerfData(record.model)
          .then((res) => {
            setPerfData(res.data);
          })
          .catch((error) => {
            message.error('请求失败！');
            return;
          });
      },
    };
  };
  const goFanDetail = (_: any, record: any) => {
    console.log('goFanDetail searchParams');
    console.log(searchParams);
    sessionStorage.removeItem('searchData');
    const sortRangeDisabled = !(
      !checkDisable[0] &&
      !checkDisable[1] &&
      (checkedControl[0] || checkedControl[1])
    );
    let searchData = JSON.stringify({
      ...searchParams,
      sortParam1: sortParam1,
      sortParam2: sortParam2,
      sortParam3: sortParam3,
      sortParam4: sortParam4,
      checkedControl: checkedControl,
      sortRange: sortRangeDisabled ? undefined : sortRange,
      checkDisable: checkDisable,
      sort: checkedControl[0],
    });
    setBeforeSearchParams(searchData);

    sessionStorage.setItem('searchData', searchData);
    // history.push(`/fan/detail/${record.model}/${'4'}`);
    history.push({
      pathname: `/fans/detail`,
      state: {
        model: record.model,
        activeKey: '4',
      },
    });
  };

  const editMethodDetail = (_: any, record: any) => {
    // ?id=${record.model}
    history.push(`/fans/create`, {
      id: record.model,
    });
  };

  const createMehtod = () => {
    // history.push('/fan/create/model');
    history.push(`/fans/create`);
  };

  const deleteMethod = (record: any) => {
    console.log(record);
    const list = [];
    list.push(record.model);
    deleteFansData(list)
      .then((res) => {
        if (res.success) {
          notification.success({
            message: '删除成功！',
          });
          const actionParams = {
            ...generalParams,
            actionId: `fan_${activeKey}_删除`,
            actionType: '删除',
            actionName: '删除风机数据',
            description: JSON.stringify(record),
          };
          saveUserAction({ params: actionParams }).catch((e) => {});
          actionRef.current?.reload();
        }
      })
      .catch((error) => {
        message.error('请求失败！');
        return;
      });
  };
  const beforeSearchSubmit = (params: {}, pageOption: {}, beforeSearchParams: {}) => {
    console.log('beforeSearchSubmit');
    console.log(beforeSearchParams);
    //树与搜索表单联动查询
    // params = { ...params, ...searchParams };
    let minField, maxField;

    if (beforeSearchParams != undefined) {
      // -----min max=>[min,max]----
      let temp = {};
      temp = beforeSearchParams;
      for (let key in temp) {
        if (key.indexOf('min') != -1) {
          minField = key;
          const field = key.split('-')[0];
          maxField = field + '-max';
          if (temp[maxField] != undefined) {
            temp[field + 'Between'] = [temp[key], temp[maxField]];
          } else {
            temp[field] = temp[key];
            temp[minField] = undefined;
            temp[maxField] = undefined;
            temp[field + 'Between'] = undefined;
          }
        } else if (key.indexOf('max') != -1) {
          maxField = key;
          const field = key.split('-')[0];
          minField = field + '-min';
          if (temp[minField] != undefined) {
            temp[field + 'Between'] = [temp[minField], temp[maxField]];
          } else {
            temp[field] = temp[maxField];
            temp[minField] = undefined;
            temp[maxField] = undefined;
            temp[field + 'Between'] = undefined;
          }
        }
      }
      // ------min max=>[min,max]----

      // setBeforeSearchParams(temp);
      // if (minField != undefined) {
      //   temp[minField] = 123;
      // }
      // if (maxField != undefined) {
      //   temp[maxField] = 123;
      // }

      params = { ...params, ...pageOption, ...beforeSearchParams };
    } else {
      params = { ...params, ...pageOption };
    }

    setSearchParams(params);

    console.log('params');
    console.log(params);
    return params;
  };
  const updateBeforeSearchParams = (
    beforeSearchParams: {},
    updateData: { key: string; value: any }[],
  ) => {
    let temp = {};
    temp = beforeSearchParams;
    updateData.forEach((item) => {
      temp[item.key] = item.value;
    });

    setBeforeSearchParams(temp);
  };
  const [hideInTable, setHideInTable] = useState<boolean[]>([true, true, true, true]);
  const columnDisplay = (e: any, index: number) => {
    const checked = !e.target.checked;

    let temp: boolean[] = [];
    hideInTable.forEach((value) => temp.push(value));
    temp[index] = checked;
    setHideInTable(temp);
  };
  const params = ['flowRate', 'fullPressure', 'motorSpeed', 'shaftPower', 'efficiency'];
  const columns: ProColumns<FanListItem>[] = [
    {
      title: (
        <Select
          value={sortParam1}
          // bordered={false}
          onChange={(value) => {
            //切换字段时删除之前保存的字段搜索信息

            const updateData = [{ key: sortParam1, value: undefined }];
            updateBeforeSearchParams(beforeSearchParams, updateData);
            setSortParma1(value);
            setCheckedControl([false, false]);
          }}
          options={[
            { value: 'flowRate', label: '流量', disabled: sortParam2 == 'flowRate' },
            { value: 'fullPressure', label: '压力', disabled: sortParam2 == 'fullPressure' },
            // { value: 'motorSpeed', label: '转速' , disabled: sortParam2 == 'motorSpeed' },
            { value: 'shaftPower', label: '轴功率', disabled: sortParam2 == 'shaftPower' },
            { value: 'efficiency', label: '效率', disabled: sortParam2 == 'efficiency' },
          ]}
        />
      ),
      // key: sortParam1,
      // key: sortParam1+'1',
      dataIndex: sortParam1,
      // dataIndex: 'sortParam1',
      hideInTable: true,
      hideInSearch: false,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <>
            <Row wrap={false} gutter={6} align="middle">
              <Col style={{ width: '100%' }}>
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  value={form.getFieldValue(sortParam1)}
                  // addonAfter={unitDict[sortParam1]}
                  // formatter={(value) => `${value + unitDict[sortParam1]}`}
                  onChange={(value) => {
                    console.log('value');
                    console.log(value);
                    console.log('form.setFieldValue(' + sortParam1 + ',' + value + ')');
                    form.setFieldValue(sortParam1, value);
                    if (value == null) {
                      setCheckedControl([false, checkedControl[1]]);
                      setCheckedDisabled([true, checkDisable[1]]);
                    } else {
                      setCheckedDisabled([false, checkDisable[1]]);
                    }
                    const updateData = [{ key: sortParam1, value: value }];
                    updateBeforeSearchParams(beforeSearchParams, updateData);
                  }}
                />
              </Col>
              <Col>{unitDict[sortParam1]}</Col>

              <Col>
                <Checkbox
                  value={sortParam1}
                  checked={checkedControl[0]}
                  disabled={!(!checkDisable[0] && !checkDisable[1])}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      setCheckedControl([checked, false]);
                      setBeforeSearchParams({
                        ...beforeSearchParams,
                        sortParam1: sortParam1,
                        sortParam2: sortParam2,
                        sort: checked,
                        sortRange: sortRange,
                      });
                    } else {
                      setCheckedControl([checked, checkedControl[1]]);
                      setBeforeSearchParams({
                        ...beforeSearchParams,
                        sort: checked,
                        sortRange: checkedControl[1] ? beforeSearchParams['sortRange'] : undefined,
                      });
                    }
                  }}
                />
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      title: (
        <Select
          value={sortParam2}
          // bordered={false}
          onChange={(value) => {
            console.log('value');
            console.log(value);
            const updateData = [{ key: sortParam2, value: undefined }];
            updateBeforeSearchParams(beforeSearchParams, updateData);

            setSortParma2(value);
            setCheckedControl([false, false]);
          }}
          options={[
            { value: 'flowRate', label: '流量', disabled: sortParam1 == 'flowRate' },
            { value: 'fullPressure', label: '压力', disabled: sortParam1 == 'fullPressure' },
            // { value: 'motorSpeed', label: '转速' , disabled: sortParam1 == 'motorSpeed' },
            { value: 'shaftPower', label: '轴功率', disabled: sortParam1 == 'shaftPower' },
            { value: 'efficiency', label: '效率', disabled: sortParam1 == 'efficiency' },
          ]}
        />
      ),
      hideInTable: true,
      hideInSearch: false,
      dataIndex: sortParam2,
      // dataIndex: 'sortParam2',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        //
        return (
          <>
            <Row wrap={false} gutter={6} align="middle">
              <Col style={{ width: '100%' }}>
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  value={form.getFieldValue(sortParam2)}
                  // addonAfter={unitDict[sortParam2]}
                  // formatter={(value) => `${value} ${unitDict[sortParam2]}`}
                  onChange={(value) => {
                    console.log('form.setFieldValue(' + sortParam2 + ',' + value + ')');
                    form.setFieldValue(sortParam2, value);
                    if (value == null) {
                      setCheckedControl([checkedControl[0], false]);
                      setCheckedDisabled([checkDisable[0], true]);
                    } else {
                      setCheckedDisabled([checkDisable[0], false]);
                    }
                    const updateData = [{ key: sortParam2, value: value }];
                    updateBeforeSearchParams(beforeSearchParams, updateData);
                  }}
                />
              </Col>
              <Col>{unitDict[sortParam2]}</Col>

              <Col>
                <Checkbox
                  checked={checkedControl[1]}
                  disabled={!(!checkDisable[0] && !checkDisable[1])}
                  onChange={(e) => {
                    const checked = e.target.checked;

                    if (checked) {
                      setCheckedControl([false, checked]);

                      setBeforeSearchParams({
                        ...beforeSearchParams,
                        sortParam1: sortParam1,
                        sortParam2: sortParam2,
                        sort: false,
                        sortRange: sortRange,
                      });
                    } else {
                      setCheckedControl([checkedControl[0], checked]);
                      setSortRange(checkedControl[1] ? sortRange : undefined);
                      setBeforeSearchParams({
                        ...beforeSearchParams,
                        sort: checkedControl[0],
                        sortRange: checkedControl[1] ? sortRange : undefined,
                      });
                    }
                  }}
                />
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      title: '选择范围',
      key: 'sortRange',
      hideInTable: true,
      hideInSearch: false,
      dataIndex: 'sortRange',
      tip: '对拟合数据进行范围排序查询，必须填入前两个数据才可勾选，按勾选条件进行范围查询',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <Radio.Group
            value={sortRange}
            onChange={onSearchRatioChange}
            disabled={
              !(!checkDisable[0] && !checkDisable[1] && (checkedControl[0] || checkedControl[1]))
            }
          >
            <Radio value={5}>±5%</Radio>
            <Radio value={10}>±10%</Radio>
          </Radio.Group>
        );
      },
    },
    {
      title: (
        <Select
          value={sortParam3}
          // bordered={false}
          onChange={(value) => {
            //切换字段时删除之前保存的字段搜索信息

            const updateData = [
              { key: sortParam3, value: undefined },
              { key: sortParam3 + '-min', value: undefined },
              { key: sortParam3 + '-max', value: undefined },
            ];
            updateBeforeSearchParams(beforeSearchParams, updateData);
            setSortParma3(value);
          }}
          options={[
            {
              value: 'flowRate',
              label: '流量',
              disabled: [sortParam1, sortParam2, sortParam4].includes('flowRate'),
            },
            {
              value: 'fullPressure',
              label: '压力',
              disabled: [sortParam1, sortParam2, sortParam4].includes('fullPressure'),
            },
            {
              value: 'motorSpeed',
              label: '转速',
              disabled: [sortParam1, sortParam2, sortParam4].includes('motorSpeed'),
            },
            {
              value: 'shaftPower',
              label: '轴功率',
              disabled: [sortParam1, sortParam2, sortParam4].includes('shaftPower'),
            },
            {
              value: 'efficiency',
              label: '效率',
              disabled: [sortParam1, sortParam2, sortParam4].includes('efficiency'),
            },
          ]}
        />
      ),
      // key: sortParam1,
      // key: sortParam1+'1',
      dataIndex: sortParam3,
      hideInTable: true,
      hideInSearch: false,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <>
            <div className={styles.siteInputGroupWrapper}>
              <Row wrap={false} align="middle" gutter={6}>
                <Col>
                  <div className={styles.inputGroupCompact}>
                    <Input.Group compact>
                      <InputNumber
                        min={0}
                        value={
                          form.getFieldValue(sortParam3)
                            ? form.getFieldValue(sortParam3)[0]
                            : undefined
                        }
                        style={{ width: '45%', textAlign: 'center' }}
                        placeholder="最小值"
                        onChange={async (value) => {
                          // onSortParam3Change(value, form);

                          const result = await form.getFieldsValue();
                          console.log('result');
                          console.log(result);
                          if (result[sortParam3] == undefined) {
                            console.log('form.setFieldValue(' + sortParam3 + ',' + value + ')');
                            form.setFieldValue(sortParam3, [value, 0]);
                          } else {
                            console.log('form.setFieldValue(' + sortParam3 + ',' + value + ')');
                            form.setFieldValue(sortParam3, [value, result[sortParam3][1]]);
                          }
                        }}
                      />
                      <Input
                        className={styles.siteInputSplit}
                        style={{
                          width: 30,
                          borderLeft: 0,
                          borderRight: 0,
                          pointerEvents: 'none',
                        }}
                        placeholder="~"
                        disabled
                      />

                      <InputNumber
                        className={styles.siteInputRight}
                        style={{
                          width: '45%',
                          textAlign: 'center',
                        }}
                        // value={form.getFieldValue(sortParam3 + '-max')}
                        value={
                          form.getFieldValue(sortParam3)
                            ? form.getFieldValue(sortParam3)[1]
                            : undefined
                        }
                        placeholder="最大值"
                        // addonAfter={}
                        // formatter={(value) => `${value + unitDict[sortParam3]}`}
                        onChange={async (value) => {
                          const result = await form.getFieldsValue();
                          console.log('result');
                          console.log(result);
                          if (result[sortParam3] == undefined) {
                            console.log('form.setFieldValue(' + sortParam3 + ',' + value + ')');
                            form.setFieldValue(sortParam3, [0, value]);
                            // updateBeforeSearchParams(beforeSearchParams, [
                            //   {
                            //     key: sortParam3,
                            //     value: [0, value == null ? undefined : value],
                            //   },
                            // ]);
                          } else {
                            console.log('form.setFieldValue(' + sortParam3 + ',' + value + ')');
                            form.setFieldValue(sortParam3, [result[sortParam3][0], value]);
                            // updateBeforeSearchParams(beforeSearchParams, [
                            //   {
                            //     key: sortParam3,
                            //     value: [result[sortParam3][1], value == null ? undefined : value],
                            //   },
                            // ]);
                          }

                          // console.log(
                          //   'form.setFieldValue(' + sortParam3 + '-max' + ',' + value + ')',
                          // );
                          // form.setFieldValue(sortParam3 + '-max', value);
                          // updateBeforeSearchParams(beforeSearchParams, [
                          //   {
                          //     key: sortParam3 + '-max',
                          //     value: value == null ? undefined : value,
                          //   },
                          // ]);
                        }}
                      />
                    </Input.Group>
                  </div>
                </Col>
                <Col>{unitDict[sortParam3]}</Col>
              </Row>
            </div>
          </>
        );
      },
    },
    {
      title: (
        <Select
          value={sortParam4}
          // bordered={false}
          onChange={(value) => {
            //切换字段时删除之前保存的字段搜索信息

            const updateData = [
              { key: sortParam4, value: undefined },
              { key: sortParam4 + '-min', value: undefined },
              { key: sortParam4 + '-max', value: undefined },
            ];
            updateBeforeSearchParams(beforeSearchParams, updateData);
            setSortParma4(value);
          }}
          options={[
            {
              value: 'flowRate',
              label: '流量',
              disabled: [sortParam1, sortParam2, sortParam3].includes('flowRate'),
            },
            {
              value: 'fullPressure',
              label: '压力',
              disabled: [sortParam1, sortParam2, sortParam3].includes('fullPressure'),
            },
            {
              value: 'motorSpeed',
              label: '转速',
              disabled: [sortParam1, sortParam2, sortParam3].includes('motorSpeed'),
            },
            {
              value: 'shaftPower',
              label: '轴功率',
              disabled: [sortParam1, sortParam2, sortParam3].includes('shaftPower'),
            },
            {
              value: 'efficiency',
              label: '效率',
              disabled: [sortParam1, sortParam2, sortParam3].includes('efficiency'),
            },
          ]}
        />
      ),
      dataIndex: sortParam4,
      hideInTable: true,
      hideInSearch: false,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <>
            <div className={styles.siteInputGroupWrapper}>
              <Row wrap={false} align="middle" gutter={6}>
                <Col>
                  <div className={styles.inputGroupCompact}>
                    <Input.Group compact>
                      <InputNumber
                        min={0}
                        style={{ width: '45%', textAlign: 'center' }}
                        value={form.getFieldValue(sortParam4 + '-min')}
                        placeholder="最小值"
                        onChange={async (value) => {
                          const result = await form.getFieldsValue();
                          console.log('result');
                          console.log(result);
                          if (result[sortParam4] == undefined) {
                            console.log('form.setFieldValue(' + sortParam4 + ',' + value + ')');
                            form.setFieldValue(sortParam4, [value, 0]);
                          } else {
                            console.log('form.setFieldValue(' + sortParam4 + ',' + value + ')');
                            form.setFieldValue(sortParam4, [value, result[sortParam4][1]]);
                          }
                          // console.log(
                          //   'form.setFieldValue(' + sortParam4 + '-min' + ',' + value + ')',
                          // );
                          // form.setFieldValue(sortParam4 + '-min', value);
                          // updateBeforeSearchParams(beforeSearchParams, [
                          //   {
                          //     key: sortParam4 + '-min',
                          //     value: value == null ? undefined : value,
                          //   },
                          // ]);
                        }}
                      />
                      <Input
                        className={styles.siteInputSplit}
                        style={{
                          width: 30,
                          borderLeft: 0,
                          borderRight: 0,
                          pointerEvents: 'none',
                        }}
                        placeholder="~"
                        disabled
                      />
                      <InputNumber
                        className={styles.siteInputRight}
                        style={{
                          width: '45%',
                          textAlign: 'center',
                        }}
                        value={form.getFieldValue(sortParam4 + '-max')}
                        placeholder="最大值"
                        // addonAfter={}
                        // formatter={(value) => `${value + unitDict[sortParam4]}`}
                        onChange={async (value) => {
                          const result = await form.getFieldsValue();
                          console.log('result');
                          console.log(result);
                          if (result[sortParam4] == undefined) {
                            console.log('form.setFieldValue(' + sortParam4 + ',' + value + ')');
                            form.setFieldValue(sortParam4, [0, value]);
                          } else {
                            console.log('form.setFieldValue(' + sortParam4 + ',' + value + ')');
                            form.setFieldValue(sortParam4, [result[sortParam4][0], value]);
                          }
                        }}
                      />
                    </Input.Group>
                  </div>
                </Col>
                <Col>{unitDict[sortParam4]}</Col>
              </Row>
            </div>
          </>
        );
      },
    },

    // {
    //   title: '排序值',
    //   // dataIndex: 'sortflowRate',
    //   // dataIndex: 'sortfullPressure',
    //   dataIndex: checkedControl[0] ? 'sort' + sortParam1 : 'sort' + sortParam2,

    //   // dataIndex: 'sort' + checkedControl[0] ? sortParam2 : sortParam1,
    //   align: 'center',
    //   hideInSearch: true,
    //   hideInTable: !(checkedControl[0] || checkedControl[1]),
    //   // hideInTable: !checkedControl[0] || !checkedControl[0],
    //   width: 80,
    // },
    {
      title: '序号',
      dataIndex: 'key',
      align: 'center',
      hideInSearch: true,
      width: 60,
      // render: (text: any, record: any, index: number) => `${index + 1}`,
      render: (text, record, index) => {
        // let current = 1, pageSize = 5
        // if (searchParams.current != undefined) {
        //   current = searchParams.current
        // }
        // if (searchParams.pageSize != undefined) {
        //   pageSize = searchParams.pageSize
        // }
        const result = (pageOption.current - 1) * pageOption.pageSize + (index + 1);
        return result;
      },
    },
    {
      title: '应用车型',
      dataIndex: 'applicationModel',
      valueType: 'textarea',
      align: 'center',
      width: 140,
      valueEnum: applicationModelList,
      // onFilter: (value, record) => value === record.category,
    },

    {
      title: '冷却对象',
      dataIndex: 'coolObject',
      valueType: 'textarea',
      align: 'center',
      width: 140,
      valueEnum: coolObjectList,
    },
    {
      title: '风机类型',
      dataIndex: 'category',
      valueType: 'textarea',
      align: 'center',
      width: 140,
      valueEnum: categoryList,
    },
    {
      title: '型号',
      dataIndex: 'model',
      valueType: 'textarea',
      align: 'center',
      width: 80,
    },
    {
      title: '图号',
      dataIndex: 'figNum',
      valueType: 'textarea',
      align: 'center',
      width: 80,
    },
    {
      title: '流量',
      dataIndex: 'flowRate',
      valueType: 'digit',
      align: 'center',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '压力',
      dataIndex: 'fullPressure',
      valueType: 'digit',
      align: 'center',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '静压',
      dataIndex: 'staticPressure',
      valueType: 'digit',
      align: 'center',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '转速',
      dataIndex: 'motorSpeed',
      valueType: 'digit',
      // valueType: 'text',

      align: 'center',
      width: 80,
      hideInSearch: true,
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
    },

    {
      title: '额定电压',
      dataIndex: 'ratedVoltage',
      valueType: 'digit',
      align: 'center',
      hideInSearch: true,
      hideInTable: hideInTable[0],
      width: 140,
    },
    {
      title: '额定电流',
      dataIndex: 'ratedCurrent',
      valueType: 'digit',
      align: 'center',
      hideInSearch: true,
      hideInTable: hideInTable[1],
      width: 140,
    },
    {
      title: '海拔',
      dataIndex: 'altitude',
      valueType: 'digit',
      align: 'center',
      hideInTable: hideInTable[2],
      hideInSearch: true,
      width: 100,
    },
    {
      title: '温度',
      dataIndex: 'temperature',
      valueType: 'digit',
      align: 'center',
      hideInTable: hideInTable[3],
      hideInSearch: true,
      width: 100,
    },

    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 150,
      hideInSetting: true,
      render: (_, record) => [
        <a key="detail" onClick={() => goFanDetail(_, record)}>
          详情
        </a>,
        <a key="editable" onClick={() => editMethodDetail(_, record)}>
          编辑
        </a>,
        // !permission.includes(5) ? null : (
        <Popconfirm
          key="popconfirm1"
          title={`确认删除吗?`}
          onConfirm={() => deleteMethod(record)}
          okText="是"
          cancelText="否"
        >
          <a key="delete">删除</a>
        </Popconfirm>,
        // ),
      ],
    },
  ];
  let title = [];

  for (let key in excelTableColumns) {
    title.push(key.toString());
  }

  return (
    <>
      {/* <Create/> */}
      <Row>
        <Col span={4}>
          <Card bordered={false}>
            <Title level={5}>风机类型</Title>
            <div>
              <Search
                style={{ marginBottom: 8 }}
                placeholder=""
                onChange={(e) => {
                  onChange(e, dataList);
                }}
              />
              <Tree
                showLine={true}
                showIcon={true}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                treeData={treeData}
                onSelect={onTreeSelect}
              />
            </div>
          </Card>
        </Col>

        <Col span={20}>
          <Row>
            <ProTable
              scroll={{
                x: 660,
              }}
              columns={columns}
              actionRef={actionRef}
              formRef={formRef}
              form={{
                ignoreRules: false,
                // optionRender: false,
                // collapsed: false,
              }}
              cardBordered
              // rowSelection={{
              // }}
              onRow={handleRow}
              tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
                <Space size={24}>
                  <span>
                    已选 {selectedRowKeys.length} 项
                    <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                      清空
                    </a>
                  </span>
                </Space>
              )}
              tableAlertOptionRender={() => {
                return (
                  <Space size={16}>
                    <a>删除</a>
                    <a>导出</a>
                  </Space>
                );
              }}
              params={searchParams}
              request={async (params) => {
                console.log('request params');
                console.log(params);

                const res = await queryFansList(params);
                // return res;
                return {
                  data: res.data,
                  success: true,
                  total: res.total,
                };
              }}
              // dataSource={list}
              rowKey="model"
              search={{
                labelWidth: 'auto',
                // labelWidth: 70,
                // span: 6,
                showHiddenNum: true,
                defaultCollapsed: false,

                optionRender: ({ searchText, resetText }, { form }, dom) => [
                  <Button
                    key="resetText"
                    onClick={() => {
                      setExpandedKeys([]);
                      // onTreeSelect([]);
                      setCheckedControl([false, false]);
                      setCheckedDisabled([true, true]);
                      setSortRange(5);
                      sessionStorage.removeItem('searchData');
                      form?.resetFields();
                      console.log(' form?.getFieldsValue()');
                      console.log(form?.getFieldsValue());
                      const result = form?.getFieldsValue();
                      setBeforeSearchParams({
                        ...beforeSearchParams,
                        ...result,
                        sort: undefined,
                        sortParam1: undefined,
                        sortParam2: undefined,
                      });
                      form?.submit();
                    }}
                  >
                    {resetText}
                  </Button>,
                  <Button
                    key="searchText"
                    type="primary"
                    onClick={() => {
                      // console.log(params);
                      sessionStorage.removeItem('searchData');
                      const result = form?.getFieldsValue();
                      // console.log('result');
                      // console.log(result);
                      for (let i in params) {
                        const key = params[i];
                        if (result[key] && result[key].length) {
                          result[key + 'Between'] = result[key];
                          result[key] = undefined;
                        }
                      }
                      const sortRangeDisabled = !(
                        !checkDisable[0] &&
                        !checkDisable[1] &&
                        (checkedControl[0] || checkedControl[1])
                      );
                      let searchData = {
                        // ...searchParams,
                        current: searchParams.current,
                        pageSize: searchParams.pageSize,
                        ...result,
                        sortParam1: sortParam1,
                        sortParam2: sortParam2,
                        sortParam3: sortParam3,
                        sortParam4: sortParam4,
                        // checkedControl: checkedControl,
                        // sortRange: sortRange,
                        // checkDisable: checkDisable,
                        // sort: checkedControl[0],
                        checkedControl: checkedControl,
                        sortRange: sortRangeDisabled ? undefined : sortRange,
                        checkDisable: checkDisable,
                        sort: checkedControl[0],
                      };
                      setBeforeSearchParams(searchData);
                      console.log('searchData');
                      console.log(searchData);
                      console.log('sortRangeDisabled ? undefined : sortRange');
                      console.log(sortRangeDisabled ? undefined : sortRange);
                      sessionStorage.setItem('searchData', JSON.stringify(searchData));
                      form?.submit();
                    }}
                  >
                    {searchText}
                  </Button>,
                ],
              }}
              toolBarRender={() => {
                let result = [];
                // if (permission.includes(3)) {
                result.push(
                  <Button type="primary" onClick={() => createMehtod()}>
                    <PlusOutlined />
                    新建
                  </Button>,
                  <Button
                    onClick={() => {
                      download('/psad/fan/template/风机信息+性能曲线模板.xls')
                        .then((blob) => {
                          console.log('blob');
                          console.log(blob);
                          const fileName = '风机信息+性能曲线模板.xls';
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

                          const actionParams = {
                            ...generalParams,
                            actionId: `fan_${activeKey}_下载`,
                            actionType: '下载',
                            actionName: 'excel模板下载',
                            description: null,
                          };
                          saveUserAction({ params: actionParams }).catch((e) => {});
                        })
                        .catch(() => {
                          message.error('下载出错!');
                        });
                    }}
                  >
                    <DownloadOutlined />
                    excel模板下载
                  </Button>,
                );
                // }
                // if (permission.includes(4)) {
                result.push(
                  <Popover
                    content={
                      <>
                        <Checkbox
                          checked={!hideInTable[0]}
                          onChange={(e) => {
                            columnDisplay(e, 0);
                          }}
                        >
                          额定电压
                        </Checkbox>
                        <br />
                        <Checkbox
                          checked={!hideInTable[1]}
                          onChange={(e) => {
                            columnDisplay(e, 1);
                          }}
                        >
                          额定电流
                        </Checkbox>
                        <br />
                        <Checkbox
                          checked={!hideInTable[2]}
                          onChange={(e) => {
                            columnDisplay(e, 2);
                          }}
                        >
                          海拔
                        </Checkbox>
                        <br />
                        <Checkbox
                          checked={!hideInTable[3]}
                          onChange={(e) => {
                            columnDisplay(e, 3);
                          }}
                        >
                          温度
                        </Checkbox>
                      </>
                    }
                    placement="bottom"
                    title="列展示"
                    trigger="click"
                  >
                    <SettingOutlined />
                  </Popover>,
                );
                // }
                return result;
              }}
              options={{
                density: true, //密度
                fullScreen: true,
                setting: false,
                // search: false,
              }}
              pagination={{
                ...pageOption,
                defaultPageSize: 5,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['5', '10', '20', '50'], // 每页数量选项
              }}
              onChange={(e) => {
                // console.log('onChange e');
                // console.log(e);
                setPageOption({ current: e.current, pageSize: e.pageSize });
                setSearchParams({ ...searchParams, current: e.current, pageSize: e.pageSize });
              }}
              dateFormatter="string"
              // options={false}
              // scroll={{ x: 'calc(800px + 50%)' }}
              beforeSearchSubmit={(e) => {
                beforeSearchSubmit(e, pageOption, beforeSearchParams);
              }}
            />
          </Row>

          {fanInfo == undefined ? null : (
            <PerformanceGraph
              fanInfo={fanInfo}
              getPerfData={getPerfData}
              echartsInstance={echartsInstance}
              setEchartsInstance={setEchartsInstance}
            />
          )}
        </Col>
      </Row>
      {/* excelData:
      {excelData.length > 0 ? excelData[0]?.flowRate : null} */}
      {/* <ImportExcel /> */}
    </>
  );
};

export default FanManage;
