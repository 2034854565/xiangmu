import { DownloadOutlined, DownOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import {
  Space,
  notification,
  Row,
  Col,
  Typography,
  Card,
  Select,
  message,
  Checkbox,
  Popover,
  Button,
  Modal,
  Result,
} from 'antd';
import React, { useRef, useEffect, useMemo, useState, Key } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { fallbackImage, FanListItem, TreeDataItem } from './data.d';
import { queryFanData, queryFanPerfData, queryFansList } from './service';
import { history, Link, useLocation, useModel } from 'umi';
import { Input, Tree, Image } from 'antd';
import styles from './style.less';
import type { DataNode, EventDataNode } from 'antd/es/tree';
import { getFanCategoryAndModelData } from './service';
import PerformanceGraph from '../../charts/performanceGraph';
import {
  getFanApplicationModelData,
  getFanCategoryData,
  getFanCoolObjectData,
  queryAuditRecord,
} from '../create/service';
import { deleteFansData, importFansData } from '../manage/service';
import Access from '@/components/Access';
import { saveUserAction } from '@/services/ant-design-pro/api';
import { PageContainer } from '@ant-design/pro-layout';
import { fixNumFunc } from '../components/utils';
import TextArea from 'antd/lib/input/TextArea';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const AuditManage: React.FC<{ permission: number[]; manage: boolean }> = (props) => {
  // console.log('FanSelection props');
  // console.log(props);
  const { initialState } = useModel('@@initialState');
  const authList = initialState?.currentUser?.authList;
  const mxcAuthList = authList == undefined ? [] : authList;
  const location = useLocation();
  const { pathname } = location || {};
  const { permission, manage } = props;
  const [categoryList, setCategoryList] = useState<{}>({});
  const [applicationModelList, setApplicationModelList] = useState<{}>({});
  const [coolObjectList, setCoolObjectList] = useState<{}>({});
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [fanInfo, setFanInfo] = useState<FanListItem>();
  let [perfData, setPerfData] = useState<{}>({});
  const getPerfData = () => {
    return perfData;
  };
  let [searchParams, setSearchParams] = useState<{}>({});
  let [beforeSearchParams, setBeforeSearchParams] = useState<{}>({});
  const [pageOption, setPageOption] = useState<{ current: number; pageSize: number }>({
    current: 1, //当前页为1
    pageSize: manage ? 10 : 5, //一页5行
  });
  const formRef = useRef();
  const [echartsInstance, setEchartsInstance] = useState<echarts.ECharts>();

  let pageArea = '';
  let activeKey = '1';
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
    case '5':
      pageArea = '审核管理';
  }
  const generalParams = {
    monitorModule: '风机平台',
    pageUrl: window.location.href,
    pageName: '风机平台',
    pageArea: pageArea,
    actionModel: null,
  };
  useEffect(() => {
    getFanCategoryData().then((res: any) => {
      let cL = {};
      for (let i = 0; i < res.data.length; i++) {
        cL[res.data[i]] = res.data[i];
      }
      console.log('cL');
      console.log(cL);

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
      let searchData: any = sessionStorage.getItem(
        manage ? 'searchDataAuditManage' : 'searchDataAudit',
      );
      if (searchData) {
        searchData = JSON.parse(searchData);
        // setSearchParams(searchData);

        console.log('把searchData赋值到搜索表单里面 ');
        console.log(searchData);
        // searchData.current = 1;
        // let params = [sortParam1, sortParam2, sortParam3, sortParam4];
        // for (let i = 0; i < 4; i++) {
        //   const key = params[i];
        //   if (searchData[key] != undefined) {
        //     setSortParma1(searchData[key]);
        //   }
        // }
        if (searchData.current != undefined && searchData.pageSize != undefined) {
          setPageOption({ current: searchData.current, pageSize: searchData.pageSize });
        }
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
          console.log('searchData.checkDisable');
          console.log(searchData.checkDisable);

          setCheckedDisabled(searchData.checkDisable);
        }
        let params = ['flowRate', 'fullPressure', 'motorSpeed', 'shaftPower', 'efficiency'];
        for (let i = 0; i < params.length; i++) {
          const key = params[i];
          if (searchData[key + 'Between'] != undefined) {
            searchData[key] = searchData[key + 'Between'];

            searchData[key + 'Between'] = undefined;
          }
        }
        console.log(searchData);

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
      console.log('把值赋值到搜索表单里面');
      console.log(searchData);

      // 把值赋值到搜索表单里面
      formRef.current?.setFieldsValue(searchData);
      console.log('formRef.current?.getFieldsValue()');
      console.log(formRef.current?.getFieldsValue());

      let params = ['flowRate', 'fullPressure', 'motorSpeed', 'shaftPower', 'efficiency'];

      for (let i in params) {
        const key = params[i];
        if (searchData[key] && searchData[key].length) {
          searchData[key + 'Between'] = searchData[key];
          searchData[key] = undefined;
        }
      }
      setSearchParams(searchData);

      // formRef.current?.submit();
      // actionRef.current?.reload();
    } catch (error) {
      //完了之后记得把本地的数据清除掉
      //
      sessionStorage.removeItem(manage ? 'searchDataAuditManage' : 'searchDataAudit');
    }
  }, []);
  // const [currentPosition, setCurrentPosition] = useState(0);
  // 键盘事件
  // searchText
  const onKeyDown = (e) => {
    // console.log('e.keyCode');
    // console.log(e);
    // console.log(e.keyCode);
    e.stopPropagation(); //阻止默认事件

    if (e.keyCode === 13) {
      console.log('按下了Enter键');
      // this.handleSearch();
      onSubmit();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown); // 添加全局事件
    return () => {
      window.removeEventListener('keydown', onKeyDown); // 销毁
    };
  }, []);
  // ————————————————
  // https://blog.csdn.net/weixin_44258964/article/details/123884237
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

  const [sortRange, setSortRange] = useState<number[]>([5, 5]);
  const [sortParam1, setSortParma1] = useState<string>('flowRate');
  const [sortParam2, setSortParma2] = useState<string>('fullPressure');
  const [sortParam3, setSortParma3] = useState<string>('motorSpeed');
  const [sortParam4, setSortParma4] = useState<string>('shaftPower');
  const [rejectedAlterView, setRejectedAlterView] = useState<boolean>(false);
  const [rejectedAlterRecord, setRejectedAlterRecord] = useState<any>({});

  const unitDict = {
    flowRate: 'm³/s',
    fullPressure: 'Pa',
    motorSpeed: 'r/min',
    shaftPower: 'kW',
    efficiency: '%',
  };
  const legendDict = {
    flowRate: '流量',
    fullPressure: '全压',
    staticPressure: '静压',
    motorSpeed: '转速',
    shaftPower: '轴功率',
    efficiency: '效率',
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
  const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key.split('-').pop() === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey!;
  };
  //风机类型搜索
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    dataList: { key: React.Key; title: string }[],
    treeData: DataNode[],
  ) => {
    console.log('dataList');
    console.log(dataList);
    console.log('treeData');
    console.log(treeData);

    const { value } = e.target;
    console.log('value');
    console.log(value);

    const newExpandedKeys = dataList
      .map((item) => {
        console.log(item.title);

        if (item.title.indexOf(value) > -1) {
          const result = getParentKey(item.key, treeData);
          console.log('getParentKey');
          console.log(result);

          return result;
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    console.log('newExpandedKeys');
    console.log(newExpandedKeys);

    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

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
        queryFanData(record.id)
          .then((res) => {
            setFanInfo(res.data);
          })
          .catch((error) => {
            message.error('请求失败！');
            return;
          });
        queryFanPerfData(record.id)
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

    sessionStorage.removeItem(manage ? 'searchDataAuditManage' : 'searchDataAudit');
    const sortRangeDisabled = !(
      !checkDisable[0] &&
      !checkDisable[1] &&
      (checkedControl[0] || checkedControl[1])
    );
    let searchData = JSON.stringify({
      ...searchParams,
      // current: 1,
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

    sessionStorage.setItem(manage ? 'searchDataAuditManage' : 'searchDataAudit', searchData);
    // history.push(`/fan/detail/${record.model}/${manage ? '4' : '1'}`);
    // history.push(`/fan/detail/${record.model}/${'1'}`);
    history.push({
      pathname: `/fans/detail`,
      state: {
        // model: record.model,
        id: record.id,
        activeKey: manage ? '5' : '6',
      },
    });
  };
  const goFanAuditDetail = (_: any, record: any) => {
    console.log('goFanDetail searchParams');
    console.log(searchParams);

    sessionStorage.removeItem(manage ? 'searchDataAuditManage' : 'searchDataAudit');
    const sortRangeDisabled = !(
      !checkDisable[0] &&
      !checkDisable[1] &&
      (checkedControl[0] || checkedControl[1])
    );
    let searchData = JSON.stringify({
      ...searchParams,
      // current: 1,
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

    sessionStorage.setItem(manage ? 'searchDataAuditManage' : 'searchDataAudit', searchData);
    // history.push(`/fan/detail/${record.model}/${manage ? '4' : '1'}`);
    // history.push(`/fan/detail/${record.model}/${'1'}`);
    history.push(`/fans/audit`, {
      // model: record.model,
      id: record.id,
      activeKey: manage ? '5' : '6',
    });
    // 查看审核风机数据
    // const actionParams = {
    //   ...generalParams,
    //   pageArea: '详情',
    //   actionId: `fan_${activeKey}_详情`,
    //   actionType: '查询',
    //   actionName: '查看风机详情',
    //   description: '查看风机数据_' + record.model + '-' + record.figNum + '-' + record.version,
    // };
    // saveUserAction({ params: actionParams }).catch((e) => {});
  };
  const goFanAlterAuditDetail = (_: any, record: any) => {
    console.log('goFanDetail searchParams');
    console.log(searchParams);

    sessionStorage.removeItem(manage ? 'searchDataAuditManage' : 'searchDataAudit');
    const sortRangeDisabled = !(
      !checkDisable[0] &&
      !checkDisable[1] &&
      (checkedControl[0] || checkedControl[1])
    );
    let searchData = JSON.stringify({
      ...searchParams,
      // current: 1,
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

    sessionStorage.setItem(manage ? 'searchDataAuditManage' : 'searchDataAudit', searchData);
    // history.push(`/fan/detail/${record.model}/${manage ? '4' : '1'}`);
    // history.push(`/fan/detail/${record.model}/${'1'}`);
    history.push(`/fans/auditAlter`, {
      // model: record.model,
      id: record.id,
      activeKey: manage ? '5' : '6',
    });
  };
  const goFanAlterApplyDetail = (_: any, record: any) => {
    console.log('goFanAlterApplyDetail searchParams');
    console.log(searchParams);

    sessionStorage.removeItem(manage ? 'searchDataAuditManage' : 'searchDataAudit');
    const sortRangeDisabled = !(
      !checkDisable[0] &&
      !checkDisable[1] &&
      (checkedControl[0] || checkedControl[1])
    );
    let searchData = JSON.stringify({
      ...searchParams,
      // current: 1,
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

    sessionStorage.setItem(manage ? 'searchDataAuditManage' : 'searchDataAudit', searchData);
    // history.push(`/fan/detail/${record.model}/${manage ? '4' : '1'}`);
    // history.push(`/fan/detail/${record.model}/${'1'}`);activeKey=${manage ? 5 : 6}&&activeKey=${manage ? 5 : 6}

    // &&activeKey=${manage ? '5' : '6'}
    // ?id=${record.id}&&activeKey=6&type=alter
    history.push(`/fans/create`, {
      status: record.status,
      id: record.id,
      type: 'alter',
    });
  };
  // ?id=${record.id}&&activeKey=6
  const editMethodDetail = (_: any, record: any) => {
    history.push(`/fans/create`, {
      status: record.status,
      id: record.id,
      activeKey: '6',
    });
  };
  // ?id = ${ record.id }& type=copy
  const copyMethodDetail = (_: any, record: any) => {
    history.push(`/fans/create`, {
      id: record.id,
      type: 'copy',
    });
  };
  const createMehtod = () => {
    history.push(`/fans/create`);
  };

  const deleteMethod = (record: any) => {
    console.log(record);
    const list = [];
    list.push(record.id);
    deleteFansData(list)
      .then((res) => {
        if (res.success) {
          notification.success({
            message: '删除成功！',
          });
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
      let temp = {};
      temp = beforeSearchParams;
      for (let key in temp) {
        // ------min max=>[min,max] start----

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
        // -----min max=>[min,max] end ----
      }

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
    console.log('temp');
    console.log(temp);

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
  console.log('!!!!!!!!!!!');
  let tempValueEnum = {};

  mxcAuthList.includes('/fan/5:auditByLead')
    ? (tempValueEnum['auditByLead'] = '变更审核批准')
    : null;
  mxcAuthList.includes('/fan/5:auditAlter') ? (tempValueEnum['auditAlter'] = '变更审核确认') : null;
  mxcAuthList.includes('/fan/5:audit') ? (tempValueEnum['audit'] = '审核') : null;
  const valueEnum = manage
    ? tempValueEnum
    : {
        pass: '已通过',
        auditByLead: '变更审核批准中',
        auditAlter: '变更审核确认中',
        rejectedAlter: '已驳回变更',
        draft: '草稿',
        audit: '审核中',
        rejected: '已驳回',
        passed: '已通过(历史版本)',
      };
  const filterList = manage
    ? [
        manage ? { text: '变更审核批准中', value: 'auditByLead' } : null,
        { text: '变更审核确认中', value: 'auditAlter' },
        { text: '审核', value: 'audit' },
      ]
    : [
        { text: '已通过', value: 'pass' },
        { text: '已驳回变更', value: 'rejectedAlter' },
        { text: '草稿', value: 'draft' },
        { text: '已驳回', value: 'rejected' },
        { text: '已通过(历史版本)', value: 'passed' },
      ];
  const columns: ProColumns<FanListItem>[] = [
    {
      title: '序号',
      dataIndex: 'key',
      align: 'center',
      hideInSearch: true,
      width: 60,
      // render: (text: any, record: any, index: number) => `${index + 1}`,
      render: (text, record, index) => {
        const result = (pageOption.current - 1) * pageOption.pageSize + (index + 1);
        return result;
      },
    },
    {
      title: '应用车型',
      // dataIndex: 'applicationModel',
      dataIndex: 'applicationModelId',
      valueType: 'textarea',
      align: 'center',
      width: 80,
      valueEnum: applicationModelList,
      // onFilter: (value, record) => value === record.category,
    },

    {
      title: '冷却对象',
      dataIndex: 'coolObject',
      valueType: 'textarea',
      align: 'center',
      width: 80,
      valueEnum: coolObjectList,
    },
    {
      title: '风机类型',
      dataIndex: 'category',
      valueType: 'textarea',
      align: 'center',
      width: 100,
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
      title: '版本号',
      dataIndex: 'version',
      valueType: 'textarea',
      align: 'center',
      width: 80,
    },
    {
      title: '流量',
      dataIndex: 'flowRate',
      valueType: 'digit',
      align: 'center',
      width: 60,
      hideInSearch: true,
      render: (text, record, index) => {
        const unCheckedField = searchParams.sort ? sortParam2 : sortParam1;
        if (record.deviationflowRate != undefined && record.sortflowRate != undefined) {
          return (
            <>
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record.sortflowRate}({record.deviationflowRate.toString()}%)
              </label>
            </>
          );
        } else if (searchParams.sortRange && unCheckedField == 'flowRate') {
          return (
            <>
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record.searchflowRate}

                {/* {searchParams.sort ? record['search' + sortParam2] : record['search' + sortParam1]} */}
              </label>
            </>
          );
        } else if (record.sortflowRate != undefined) {
          return (
            <>
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record.sortflowRate}

                {/* {searchParams.sort ? record['search' + sortParam2] : record['search' + sortParam1]} */}
              </label>
            </>
          );
        } else {
          return record.flowRate;
        }
      },
    },
    {
      title: '全压',
      dataIndex: 'fullPressure',
      valueType: 'digit',
      align: 'center',
      width: 60,
      hideInSearch: true,
      render: (text, record, index) => {
        // console.log(record.deviationfullPressure);
        // console.log(searchParams.sort);
        const unCheckedField = searchParams.sort ? sortParam2 : sortParam1;

        if (record.deviationfullPressure != undefined && record.sortfullPressure != undefined) {
          return (
            <>
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record.sortfullPressure}({record.deviationfullPressure.toString()}%)
              </label>
            </>
          );
        } else if (unCheckedField == 'fullPressure') {
          return (
            <>
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record['searchfullPressure']}
              </label>
            </>
          );
        } else if (record.sortfullPressure != undefined) {
          return (
            <>
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record.sortfullPressure}

                {/* {searchParams.sort ? record['search' + sortParam2] : record['search' + sortParam1]} */}
              </label>
            </>
          );
        } else {
          return record.fullPressure;
        }
      },
    },
    {
      title: '静压',
      dataIndex: 'staticPressure',
      valueType: 'digit',
      align: 'center',
      width: 60,
      hideInSearch: true,
      render: (text, record, index) => {
        // console.log(record.deviationstaticPressure);
        // console.log(searchParams.sort);
        const unCheckedField = searchParams.sort ? sortParam2 : sortParam1;

        if (record.deviationstaticPressure != undefined && record.sortstaticPressure != undefined) {
          return (
            <>
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record.sortstaticPressure}({record.deviationstaticPressure.toString()}%)
              </label>
            </>
          );
        } else if (unCheckedField == 'staticPressure') {
          return (
            <>
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record['searchstaticPressure']}
              </label>
            </>
          );
        } else if (record.sortstaticPressure != undefined) {
          return (
            <>
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record.sortstaticPressure}

                {/* {searchParams.sort ? record['search' + sortParam2] : record['search' + sortParam1]} */}
              </label>
            </>
          );
        } else {
          return record.staticPressure;
        }
      },
    },
    {
      title: '转速',
      dataIndex: 'motorSpeed',
      valueType: 'digit',
      // valueType: 'text',
      align: 'center',
      width: 60,
      hideInSearch: true,
      render: (text, record, index) => {
        if (record.originMotorSpeed != undefined) {
          if (record.motorSpeedMin != undefined) {
            return record.motorSpeedMin + '/' + record.originMotorSpeed;
          }
          return record.originMotorSpeed;
          // <>
          //   <label
          //     style={{
          //       color: '#52c41a',
          //     }}
          //   >
          //     {record.originMotorSpeed}

          //     {/* {searchParams.sort ? record['search' + sortParam2] : record['search' + sortParam1]} */}
          //   </label>
          // </>
        } else {
          if (record.motorSpeedMin != undefined) {
            return record.motorSpeedMin + '/' + record.motorSpeed;
          }
          return record.motorSpeed;
        }
      },
    },

    {
      title: '效率',
      dataIndex: 'efficiency',
      valueType: 'digit',
      align: 'center',
      hideInSearch: true,
      width: 50,
    },
    {
      title: '轴功率',
      dataIndex: 'shaftPower',
      valueType: 'digit',
      align: 'center',
      hideInSearch: true,
      width: 60,
      render: (text, record, index) => {
        const unCheckedField = searchParams.sort ? sortParam2 : sortParam1;
        if (record.deviationshaftPower != undefined && record.sortshaftPower != undefined) {
          return (
            <>
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record.sortshaftPower}({record.deviationshaftPower.toString()}%)
              </label>
            </>
          );
        } else if (unCheckedField == 'shaftPower') {
          return (
            <>
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record.searchshaftPower}

                {/* {searchParams.sort ? record['search' + sortParam2] : record['search' + sortParam1]} */}
              </label>
            </>
          );
        } else if (record.sortshaftPower != undefined) {
          return (
            <>
              <label
                style={{
                  color: '#52c41a',
                }}
              >
                {record.sortshaftPower}

                {/* {searchParams.sort ? record['search' + sortParam2] : record['search' + sortParam1]} */}
              </label>
            </>
          );
        } else {
          return record.shaftPower;
        }
      },
    },

    {
      title: '额定电压',
      dataIndex: 'ratedVoltage',
      valueType: 'textarea',
      align: 'center',
      hideInSearch: true,
      hideInTable: hideInTable[0],
      width: 80,
    },
    {
      title: '额定电流',
      dataIndex: 'ratedCurrent',
      valueType: 'digit',
      align: 'center',
      hideInSearch: true,
      hideInTable: hideInTable[1],
      width: 80,
    },
    {
      title: '海拔',
      dataIndex: 'altitude',
      valueType: 'digit',
      align: 'center',
      hideInTable: hideInTable[2],
      hideInSearch: true,
      width: 60,
    },
    {
      title: '温度',
      dataIndex: 'temperature',
      valueType: 'digit',
      align: 'center',
      hideInTable: hideInTable[3],
      hideInSearch: true,
      width: 60,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'textarea',
      align: 'center',
      width: 80,
      hideInTable: manage,
      hideInSearch: manage,
      valueEnum: valueEnum,
      filters: filterList,
      filterSearch: true,
      onFilter: (value: string, record) => record.status == value,
      render: (_, record) => {
        let res = <></>;
        switch (record.status) {
          case 'draft':
            res = (
              <Button onClick={() => editMethodDetail(_, record)} type="link" color="blue">
                草稿
              </Button>
            );
            break;
          case 'audit':
            res = (
              <Button type="text" color="black">
                审核中
              </Button>
            );
            break;

          case 'auditByLead':
            res = (
              <Button type="text" color="black">
                变更审核批准中
              </Button>
            );
            break;
          case 'auditAlter':
            res = (
              <Button type="text" color="black">
                变更审核确认中
              </Button>
            );
            break;
          case 'rejected':
            res = (
              <Button danger onClick={() => editMethodDetail(_, record)} type="link" color="black">
                已驳回
              </Button>
            );
            break;
          case 'rejectedAlter':
            res = (
              <Button
                type="text"
                onClick={() => {
                  setRejectedAlterView(true);
                  queryAuditRecord({ auditBizId: record.id, auditType: 'fanAlterAudit' }).then(
                    (res) => {
                      setRejectedAlterRecord(res.data);
                    },
                  );
                }}
              >
                已驳回变更
              </Button>
            );
            break;
          case 'pass':
            res = '已通过';
            break;
          case 'passed':
            res = '已通过(历史版本)';
            break;
        }
        return res;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 150,
      render: (_, record) => {
        //
        let result = [manage ? null : <a onClick={() => goFanDetail(_, record)}>详情</a>];
        if (manage) {
          result.push(
            <a key="design" onClick={() => goFanAuditDetail(_, record)}>
              {record.status == 'audit' ? '审核' : ''}
            </a>,
          );

          if (manage && record.status == 'auditAlter') {
            result.push(
              <a key="design" onClick={() => goFanAlterAuditDetail(_, record)}>
                变更审核确认
              </a>,
            );
          }
          if (manage && record.status == 'auditByLead') {
            result.push(
              <a key="design" onClick={() => goFanAlterAuditDetail(_, record)}>
                变更审核批准
              </a>,
            );
          }
        } else {
          if (record.status == 'pass') {
            result.push(
              <a key="design" onClick={() => goFanAlterApplyDetail(_, record)}>
                变更
              </a>,
            );
          }
        }
        return result;
      },
    },
  ];
  const designDetail = (_: any, record: FanListItem) => {
    const checkedField = searchParams.sort ? sortParam1 : sortParam2;
    // console.log('checkedField');
    // console.log(checkedField);
    // console.log(checkedField == 'flowRate');

    const motorSpeed = record.originMotorSpeed;
    if (['fullPressure', 'staticPressure'].includes(checkedField)) {
      const flowRate = searchParams.flowRate;
      const pressure = searchParams[checkedField];
      console.log('searchParams');
      console.log(searchParams);
      const pressureRange = [
        pressure * (1 - searchParams.sortRange[0] / 100),
        pressure * (1 + searchParams.sortRange[1] / 100),
      ];
      const calculationSelection = {
        flowRate: flowRate,
        pressure: pressure,
        motorSpeed: motorSpeed,
      };
      let expect = JSON.stringify(calculationSelection);
      sessionStorage.setItem(
        manage ? 'expectSelectionAuditManage' : 'expectSelectionAudit',
        expect,
      );
      console.log('searchParams');
      console.log(searchParams);

      history.push({
        pathname: `/fans/similarDesign/detail/1`,
        state: {
          id: record.id,
          model: record.model,
          type: '11',
          //  searchParams.sortMotorSpeed ? '11' :
          impellerDiameterMedian: record.impellerDiameter,
          // impellerDiameterRange: record.impellerDiameterRange,
          originMotorSpeed: motorSpeed,
          // sortMotorSpeed: searchParams.sortMotorSpeed,
          flowRate: flowRate,
          fullPressure: record.sortfullPressure,
          staticPressure: record.sortstaticPressure,
          shaftPower: record.sortshaftPower,
          pressureRange: pressureRange,
          limitField: 'unLimited',
          pressureField: checkedField,
          expect: {
            flowRate: searchParams.flowRate,
            pressure: searchParams[searchParams.sort ? sortParam2 : sortParam2],
            usefulWork: fixNumFunc(
              (searchParams.flowRate * searchParams[searchParams.sort ? sortParam2 : sortParam2]) /
                1000,
              1,
            ),
          },
          inputRequire: {
            flowRate: searchParams.flowRate,
            pressureField: searchParams.sort ? sortParam2 : sortParam2,
            pressure: searchParams[searchParams.sort ? sortParam2 : sortParam2],

            min: searchParams.sortRange[0],
            max: searchParams.sortRange[1],
            // motorSpeed:
            altitude: 0,
            temperature: 20,
            atmosphericPressure: 101325,
            atmosphericDensity: 1.205,
            humidity: 50,
          },
        },
      });
    } else if (checkedField == 'flowRate') {
      const unCheckedField = searchParams.sort ? sortParam2 : sortParam1;
      const flowRate = searchParams.flowRate;
      const pressure = searchParams[checkedField];
      console.log('searchParams');
      console.log(searchParams);

      const calculationSelection = {
        flowRate: flowRate,
        pressure: pressure,
        motorSpeed: motorSpeed,
      };
      let expect = JSON.stringify(calculationSelection);
      sessionStorage.setItem(
        manage ? 'expectSelectionAuditManage' : 'expectSelectionAudit',
        expect,
      );
      console.log(['fullPressure', 'staticPressure'].includes(unCheckedField));
      if (['fullPressure', 'staticPressure'].includes(unCheckedField)) {
        history.push({
          pathname: `/fans/similarDesign/detail/1`,
          state: {
            model: record.model,
            type: '11',
            //  searchParams.sortMotorSpeed ? '11' :
            impellerDiameterMedian: record.impellerDiameter,
            // impellerDiameterRange: record.impellerDiameterRange,
            originMotorSpeed: motorSpeed,
            // sortMotorSpeed: searchParams.sortMotorSpeed,
            flowRate: record.sortflowRate,
            fullPressure: record.sortfullPressure,
            staticPressure: record.sortstaticPressure,
            shaftPower: record.sortshaftPower,
            // pressureRange: pressureRange,
            limitField: 'unLimited',
            pressureField: unCheckedField,
          },
        });
      }
    }
  };
  const onSubmit = () => {
    // console.log(params);
    sessionStorage.removeItem(manage ? 'searchDataAuditManage' : 'searchDataAudit');
    const result = formRef?.current?.getFieldsValue();
    // console.log(result);
    let submitFlag = true;
    for (let i in params) {
      const key = params[i];
      // console.log(key);
      if (result[key]! && result[key].length) {
        // console.log('result[key]');
        // console.log(result[key]);

        if ((result[key][0] || result[key][0] == 0) && (result[key][1] || result[key][1] == 0)) {
          result[key + 'Between'] = result[key];
          result[key] = undefined;
        } else if (result[key][0] || result[key][0] == 0) {
          message.warn('请填写最大值！');
          submitFlag = false;
          result[key + 'Between'] = undefined;
        } else if (result[key][1] || result[key][1] == 0) {
          message.warn('请填写最小值！');
          submitFlag = false;
          result[key + 'Between'] = undefined;
        } else {
          result[key + 'Between'] = undefined;
          result[key] = undefined;
        }
      }
    }
    if (
      ['fullPressure', 'staticPressure'].includes(sortParam1) &&
      ['fullPressure', 'staticPressure'].includes(sortParam1)
    ) {
      message.warn('查询条件不合理，请修改');
      submitFlag = false;
    }
    if (submitFlag) {
      const sortRangeDisabled = !(
        !checkDisable[0] &&
        !checkDisable[1] &&
        (checkedControl[0] || checkedControl[1])
      );

      let searchData = {
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
      setPageOption({ current: 1, pageSize: pageOption.pageSize });

      // console.log('searchData');
      // console.log(searchData);
      // console.log('sortRangeDisabled ? undefined : sortRange');
      // console.log(sortRangeDisabled ? undefined : sortRange);
      setBeforeSearchParams({
        ...searchData,
        // current: 1,
        // pageSize: searchParams.pageSize,
      });
      searchData = JSON.stringify(searchData);
      sessionStorage.setItem(manage ? 'searchDataAuditManage' : 'searchDataAudit', searchData);
      formRef?.current?.submit();
    }
  };
  return (
    <>
      <PageContainer ghost header={{ title: '' }}>
        {/* <Create/> */}
        <Row>
          <Col span={mxcAuthList.includes(`${pathname}:auth_tree`) ? 20 : 24}>
            <ProTable
              scroll={{
                x: 1369,
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
                // console.log('request params');
                // console.log(params);
                // console.log('manage');
                // console.log(manage);

                params.createBy = initialState?.currentUser?.userId;

                // params.status = manage ? ['audit', 'auditAlter'] : [];
                // if (authList?.includes('/fan/5:auditByLead')) {
                //   params.status.push('auditByLead');
                // }
                console.log('params.status');
                console.log(params.status);
                // if (manage) {
                //   params.status = [];
                //   if (!params.status.length > 0) {}
                //   if (manage && authList?.includes('/fan/5:audit')) {
                //     params.status.push('audit');
                //     params.status.push('auditAlter');
                //   }
                //   if (manage && authList?.includes('/fan/5:auditByLead')) {
                //     params.status.push('auditByLead');
                //   }
                // } else {

                // }
                // if (params.status) {
                //   params.status = [params.status];
                // } else {

                // }

                console.log('params.status');
                console.log(params.status);

                params.manage = manage;

                const res = await queryFansList(params).catch((e) => {
                  console.log(e);

                  // sessionStorage.removeItem('searchDataAudit');
                });

                const actionParams = {
                  ...generalParams,
                  actionId: `fan_${activeKey}_查询`,
                  actionType: '查询',
                  actionName: '查询审核列表',
                  description: JSON.stringify(params),
                };
                saveUserAction({ params: actionParams }).catch((e) => {});
                return res;
              }}
              // dataSource={list}
              rowKey="id"
              search={{
                labelWidth: 'auto',
                // labelWidth: 70,
                // span: 6,
                showHiddenNum: true,
                // defaultCollapsed: manage ? true : false,
                defaultCollapsed: false,
                optionRender: ({ searchText, resetText }, { form }, dom) => [
                  <Button
                    key="resetText"
                    onClick={() => {
                      setExpandedKeys([]);
                      // onTreeSelect([]);
                      setCheckedControl([false, false]);
                      setCheckedDisabled([true, true]);
                      setSortRange([5, 5]);
                      sessionStorage.removeItem(
                        manage ? 'searchDataAuditManage' : 'searchDataAudit',
                      );
                      sessionStorage.removeItem(
                        manage ? 'calculationSelectionManage' : 'calculationSelectionAudit',
                      );
                      sessionStorage.removeItem(
                        manage ? 'expectSelectionAuditManage' : 'expectSelectionAudit',
                      );
                      form?.resetFields();
                      // console.log(' form?.getFieldsValue()');
                      // console.log(form?.getFieldsValue());
                      const result = form?.getFieldsValue();
                      setBeforeSearchParams({
                        ...beforeSearchParams,
                        ...result,
                        sort: undefined,
                        sortParam1: undefined,
                        sortParam2: undefined,
                        flowRateBetween: undefined,
                        fullPressureBetween: undefined,
                        motorSpeedBetween: undefined,
                        shaftPowerBetween: undefined,
                        efficiencyBetween: undefined,
                      });
                      form?.submit();
                    }}
                  >
                    {resetText}
                  </Button>,
                  <Button
                    key="searchText"
                    type="primary"
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        console.log('按下了Enter键');
                        // this.handleSearch();
                      }

                      console.log('keyDown!!!!!!!!!!');
                      console.log(e);
                    }}
                    onClick={(e) => {
                      console.log(e);
                      onSubmit();
                    }}
                  >
                    {searchText}
                  </Button>,
                ],
              }}
              toolBarRender={() => {
                let result: any[] = [];
                if (manage) {
                  result
                    .push
                    // <Button type="primary" onClick={() => createMehtod()}>
                    //   <PlusOutlined />
                    //   新建
                    // </Button>,
                    // <Button
                    //   onClick={() => {
                    //     downloadFile('/psad/fan/template/风机信息+性能曲线模板.xls');
                    //   }}
                    // >
                    //   <DownloadOutlined />
                    //   excel模板下载
                    // </Button>,
                    ();
                }

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

                return result;
              }}
              options={{
                density: true, //密度
                fullScreen: true,
                setting: false,
              }}
              pagination={{
                ...pageOption,
                defaultPageSize: manage ? 10 : 5,
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

            {fanInfo == undefined || perfData == undefined ? null : (
              <PerformanceGraph
                fanInfo={fanInfo}
                getPerfData={getPerfData}
                authList={authList}
                echartsInstance={echartsInstance}
                setEchartsInstance={setEchartsInstance}
              />
            )}
          </Col>
        </Row>
        {/* excelData:
      {excelData.length > 0 ? excelData[0]?.flowRate : null} */}
        {/* <ImportExcel /> */}
      </PageContainer>
      <Modal
        destroyOnClose
        title="驳回原因"
        open={rejectedAlterView}
        onCancel={() => {
          setRejectedAlterView(false);
        }}
        onOk={() => {
          setRejectedAlterView(false);
        }}
      >
        <TextArea
          bordered={false}
          style={{ width: '60%', resize: 'none', color: 'black' }}
          disabled
          value={rejectedAlterRecord.remark}
          defaultValue={''}
          rows={10}
        ></TextArea>
        <br />

        <Typography.Text>{'审核人：' + rejectedAlterRecord.realName}</Typography.Text>
        <br />
        <Typography.Text>{'审核时间：' + rejectedAlterRecord.createAt}</Typography.Text>
      </Modal>
    </>
  );
};

export default AuditManage;
