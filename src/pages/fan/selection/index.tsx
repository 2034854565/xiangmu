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
  Radio,
  RadioChangeEvent,
  InputNumber,
  Checkbox,
  Popover,
  Button,
  Popconfirm,
  Dropdown,
  MenuProps,
  Menu,
  Badge,
  Table,
  Tag,
} from 'antd';
import React, { useRef, useEffect, useMemo, useState, Key } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { fallbackImage, FanListItem, TreeDataItem } from './data.d';
import { queryFanData, queryFanPerfData, queryFansList } from './service';
import { history, useLocation, useModel } from 'umi';
import { Input, Tree, Image } from 'antd';
import styles from './style.less';
import type { DataNode, EventDataNode } from 'antd/es/tree';
import { getFanCategoryAndModelData } from './service';
import PerformanceGraph from '../../charts/performanceGraph';
import {
  getFanApplicationModelData,
  getFanCategoryData,
  getFanCoolObjectData,
} from '../create/service';
import {
  deleteFansData,
  deleteFanUpdateRecordsData,
  hideFansData,
  importFansData,
  recoverFansData,
} from '../manage/service';
import { download, downloadFile, downloadFile1 } from '../service';
import Access from '@/components/Access';
import { saveUserAction } from '@/services/ant-design-pro/api';
import { PageContainer } from '@ant-design/pro-layout';
import { fixNumFunc } from '../components/utils';
import moment from 'moment';
import { getFanVersionData } from '../auditManage/service';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const FanSelection: React.FC<{ permission: number[]; manage: boolean }> = (props) => {
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
  const [fanVersionData, setFanVersionData] = useState<[]>([]);

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
    pageSize: manage ? 10 : 5, //一页5行
  });
  const formRef = useRef();
  const [echartsInstance, setEchartsInstance] = useState<echarts.ECharts>();

  let pageArea = '';
  let activeKey = manage ? '4' : '1';
  switch (activeKey) {
    case '1':
      pageArea = '产品选型';
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
        // console.log('error');
        // console.log(error);
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
      sessionStorage.removeItem('searchData');
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

  const treeData = useMemo(() => {
    //
    console.log('defaultTreeData');
    console.log(defaultTreeData);

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

    sessionStorage.removeItem('searchData');
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

    sessionStorage.setItem('searchData', searchData);
    // history.push(`/fan/detail/${record.model}/${manage ? '4' : '1'}`);
    // history.push(`/fan/detail/${record.model}/${'1'}`);
    history.push({
      pathname: `/fans/detail`,
      state: {
        // model: record.model,
        id: record.id,
        activeKey: manage ? '4' : '1',
      },
    });
    const actionParams = {
      ...generalParams,
      pageArea: '详情',
      actionId: `fan_${activeKey}_详情`,
      actionType: '查询',
      actionName: '查看风机详情',
      description: '查看风机数据_' + record.model + '-' + record.figNum + '-' + record.version,
    };
    saveUserAction({ params: actionParams }).catch((e) => {});
  };
  const goFanRecordDetail = (_: any, record: any) => {
    console.log('goFanRecordDetail searchParams');
    console.log(searchParams);

    sessionStorage.removeItem('searchData');
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

    sessionStorage.setItem('searchData', searchData);
    // history.push(`/fan/detail/${record.model}/${manage ? '4' : '1'}`);
    // history.push(`/fan/detail/${record.model}/${'1'}`);
    history.push({
      pathname: `/fans/detail`,
      state: {
        // model: record.model,
        id: record.id,
        activeKey: manage ? '4' : '1',
      },
    });
    const actionParams = {
      ...generalParams,
      pageArea: '详情',
      actionId: `fan_${activeKey}_详情`,
      actionType: '查询',
      actionName: '查看风机详情',
      description: '查看风机数据_' + record.model + '-' + record.figNum + '-' + record.version,
    };
    saveUserAction({ params: actionParams }).catch((e) => {});
  };
  const editMethodDetail = (_: any, record: any) => {
    // ?id=${record.id}
    history.push(`/fans/create`, {
      id: record.id,
    });
  };
  const copyMethodDetail = (_: any, record: any) => {
    // ?id=${record.id}&type=copy
    history.push(`/fans/create`, {
      id: record.id,
      type: 'copy',
      activeKey: '4',
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
          const actionParams = {
            ...generalParams,
            actionId: `fan_${activeKey}_删除`,
            actionType: '删除',
            actionName: '删除风机数据',
            description:
              '删除风机数据_' + record.model + '-' + record.figNum + '-' + record.version,
          };
          saveUserAction({ params: actionParams }).catch((e) => {});
        }
      })
      .catch((error) => {
        message.error('请求失败！');
        return;
      });
  };
  const hideMethod = (record: any) => {
    console.log(record);
    const list = [];
    list.push(record.id);
    hideFansData(list)
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
  const recoverMethod = (record: any) => {
    console.log(record);
    const list = [];
    list.push(record.id);
    recoverFansData(list)
      .then((res) => {
        if (res.success) {
          notification.success({
            message: '恢复成功！',
          });
          actionRef.current?.reload();
        }
      })
      .catch((error) => {
        message.error('请求失败！');
        return;
      });
  };

  const deleteUpdateRecordMethod = (record: any) => {
    console.log(record);
    const list = [];
    list.push(record.id);
    deleteFanUpdateRecordsData(list)
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

  const columns: ProColumns<FanListItem>[] = [
    {
      title: (
        <Select
          value={sortParam1}
          // bordered={false}
          onChange={(value) => {
            //切换字段时删除之前保存的字段搜索信息
            formRef.current?.setFieldValue(sortParam1, undefined);

            const updateData = [{ key: sortParam1, value: undefined }];
            updateBeforeSearchParams(beforeSearchParams, updateData);
            setSortParma1(value);
            setCheckedControl([false, checkDisable[1]]);
          }}
          options={[
            {
              value: 'flowRate',
              label: '流量',
              disabled: [sortParam2, sortParam3, sortParam4].includes('flowRate'),
            },
            {
              value: 'fullPressure',
              label: '全压',
              disabled: [sortParam2, sortParam3, sortParam4].includes('fullPressure'),
            },
            {
              value: 'staticPressure',
              label: '静压',
              disabled: [sortParam2, sortParam3, sortParam4].includes('staticPressure'),
            },
            // { value: 'motorSpeed', label: '转速' , disabled: [sortParam2,sortParam3,sortParam4].includes('motorSpeed')  },
            {
              value: 'shaftPower',
              label: '轴功率',
              disabled: [sortParam2, sortParam3, sortParam4].includes('shaftPower'),
            },
            // {
            //   value: 'efficiency',
            //   label: '效率',
            //   disabled: [sortParam2, sortParam3, sortParam4].includes('efficiency'),
            // },
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
                  min={checkedControl[0] ? 1 : 0}
                  value={form.getFieldValue(sortParam1)}
                  // addonAfter={unitDict[sortParam1]}
                  // formatter={(value) => `${value + unitDict[sortParam1]}`}
                  onChange={(value) => {
                    // console.log('value');
                    // console.log(value);
                    // console.log('form.setFieldValue(' + sortParam1 + ',' + value + ')');
                    form.setFieldValue(sortParam1, value);
                    if (value == null) {
                      // setCheckedControl([false, checkedControl[1]]);
                      setCheckedControl([false, false]);
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
            formRef.current?.setFieldValue(sortParam2, undefined);
            const updateData = [{ key: sortParam2, value: undefined }];
            updateBeforeSearchParams(beforeSearchParams, updateData);

            setSortParma2(value);
            setCheckedControl([false, false]);
            console.log('Select changed');
            console.log('!!!!!!!!!checkDisable');
            console.log(checkDisable);
            setCheckedDisabled([checkDisable[0], true]);
          }}
          options={[
            {
              value: 'flowRate',
              label: '流量',
              disabled: [sortParam1, sortParam3, sortParam4].includes('flowRate'),
            },
            {
              value: 'fullPressure',
              label: '全压',
              disabled: [sortParam1, sortParam3, sortParam4].includes('fullPressure'),
            },
            {
              value: 'staticPressure',
              label: '静压',
              disabled: [sortParam1, sortParam3, sortParam4].includes('staticPressure'),
            },
            // { value: 'motorSpeed', label: '转速' , disabled: sortParam1 == 'motorSpeed' },
            {
              value: 'shaftPower',
              label: '轴功率',
              disabled: [sortParam1, sortParam3, sortParam4].includes('shaftPower'),
            },
            // {
            //   value: 'efficiency',
            //   label: '效率',
            //   disabled: [sortParam1, sortParam3, sortParam4].includes('efficiency'),
            // },
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
                  min={checkedControl[1] ? 1 : 0}
                  value={form.getFieldValue(sortParam2)}
                  style={{ width: '100%' }}
                  // addonAfter={unitDict[sortParam2]}
                  // formatter={(value) => `${value} ${unitDict[sortParam2]}`}
                  onChange={(value) => {
                    console.log('form.setFieldValue(' + sortParam2 + ',' + value + ')');
                    formRef.current?.setFieldValue(sortParam2, value);
                    if (value == null) {
                      console.log('!!!!!!!!null !checkDisable');
                      console.log(checkDisable);
                      // setCheckedControl([checkedControl[0], false]);
                      setCheckedControl([false, false]);
                      setCheckedDisabled([checkDisable[0], true]);
                    } else {
                      console.log('!!!!!setCheckedDisabled([checkDisable[0], false]);');

                      setCheckedDisabled([checkDisable[0], false]);
                      console.log('checkDisable');
                      console.log(checkDisable);
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
          // <Radio.Group
          //   value={sortRange}
          //   onChange={onSearchRatioChange}
          //   disabled={
          //     !(!checkDisable[0] && !checkDisable[1] && (checkedControl[0] || checkedControl[1]))
          //   }
          // >
          //   <Radio value={5}>±5%</Radio>
          //   <Radio value={10}>±10%</Radio>
          // </Radio.Group>
          <>
            <div className={styles.siteInputGroupWrapper}>
              <Row wrap={false} align="middle" gutter={6}>
                <Col>
                  <div className={styles.inputGroupCompact}>
                    <Input.Group compact>
                      <InputNumber
                        disabled={
                          !(
                            !checkDisable[0] &&
                            !checkDisable[1] &&
                            (checkedControl[0] || checkedControl[1])
                          )
                        }
                        min={0}
                        addonBefore="-"
                        value={sortRange && sortRange[0] ? sortRange[0] : undefined}
                        style={{ width: '45%', textAlign: 'center' }}
                        // placeholder="最小值"
                        onChange={async (value) => {
                          if (value) {
                            if (sortRange == undefined) {
                              console.log(' setSortRange(' + value + ',' + 0 + ')');
                              setSortRange([value, 0]);
                            } else {
                              console.log('setSortRange:(' + value + ',' + sortRange[1] + ')');
                              setSortRange([value, sortRange[1]]);
                            }
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
                        disabled={
                          !(
                            !checkDisable[0] &&
                            !checkDisable[1] &&
                            (checkedControl[0] || checkedControl[1])
                          )
                        }
                        className={styles.siteInputRight}
                        style={{
                          width: '45%',
                          textAlign: 'center',
                        }}
                        addonBefore="+"
                        // value={form.getFieldValue(sortParam3 + '-max')}
                        value={sortRange && sortRange[1] ? sortRange[1] : undefined}
                        // placeholder="最大值"
                        // addonAfter={}
                        // formatter={(value) => `${value + unitDict[sortParam3]}`}
                        onChange={async (value) => {
                          if (value) {
                            if (sortRange == undefined) {
                              console.log('form.setFieldValue(' + 0 + ',' + value + ')');
                              setSortRange([0, value]);
                            } else {
                              console.log('setSortRange(' + sortRange[0] + ',' + value + ')');
                              setSortRange([sortRange[0], value]);
                            }
                          }
                        }}
                      />
                    </Input.Group>
                  </div>
                </Col>
                <Col>%</Col>
              </Row>
            </div>
          </>
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
              label: '全压',
              disabled: [sortParam1, sortParam2, sortParam4].includes('fullPressure'),
            },
            {
              value: 'staticPressure',
              label: '静压',
              disabled: [sortParam1, sortParam2, sortParam4].includes('staticPressure'),
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
                          // if (value == null) {
                          //   value = undefined;
                          // }
                          if (result[sortParam3] == undefined) {
                            console.log(
                              'form.setFieldValue(' + 'sort' + sortParam3 + ',' + value + ')',
                            );
                            // form.setFieldValue(sortParam3, [value, 0]);
                            form.setFieldValue(sortParam3, [value, undefined]);
                            form.setFieldValue(sortParam3 + 'Between', [value, undefined]);
                          } else {
                            console.log('form.setFieldValue(' + sortParam3 + ',' + value + ')');
                            form.setFieldValue(sortParam3, [value, result[sortParam3][1]]);
                            form.setFieldValue(sortParam3 + 'Between', [
                              value,
                              result[sortParam3][1],
                            ]);
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
                        min={0}
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
                            // form.setFieldValue(sortParam3, [0, value]);
                            form.setFieldValue(sortParam3, [undefined, value]);
                          } else {
                            console.log('form.setFieldValue(' + sortParam3 + ',' + value + ')');
                            form.setFieldValue(sortParam3, [result[sortParam3][0], value]);
                          }
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
              label: '全压',
              disabled: [sortParam1, sortParam2, sortParam3].includes('fullPressure'),
            },
            {
              value: 'staticPressure',
              label: '静压',
              disabled: [sortParam1, sortParam2, sortParam3].includes('staticPressure'),
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
                        // value={form.getFieldValue(sortParam4 + '-min')}
                        value={
                          form.getFieldValue(sortParam4)
                            ? form.getFieldValue(sortParam4)[0]
                            : undefined
                        }
                        placeholder="最小值"
                        onChange={async (value) => {
                          const result = await form.getFieldsValue();
                          // console.log('result');
                          // console.log(result);
                          if (result[sortParam4] == undefined) {
                            // console.log('form.setFieldValue(' + sortParam4 + ',' + value + ')');
                            form.setFieldValue(sortParam4, [value, undefined]);
                          } else {
                            // console.log('form.setFieldValue(' + sortParam4 + ',' + value + ')');
                            form.setFieldValue(sortParam4, [value, result[sortParam4][1]]);
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
                        min={0}
                        className={styles.siteInputRight}
                        style={{
                          width: '45%',
                          textAlign: 'center',
                        }}
                        // value={form.getFieldValue(sortParam4 + '-max')}
                        value={
                          form.getFieldValue(sortParam4)
                            ? form.getFieldValue(sortParam4)[1]
                            : undefined
                        }
                        placeholder="最大值"
                        // addonAfter={}
                        // formatter={(value) => `${value + unitDict[sortParam4]}`}
                        onChange={async (value) => {
                          const result = await form.getFieldsValue();
                          // console.log('result');
                          // console.log(result);
                          if (result[sortParam4] == undefined) {
                            // console.log('form.setFieldValue(' + sortParam4 + ',' + value + ')');
                            form.setFieldValue(sortParam4, [undefined, value]);
                          } else {
                            // console.log('form.setFieldValue(' + sortParam4 + ',' + value + ')');
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
    //   tooltip:
    //     '根据' + checkedControl[0]
    //       ? legendDict[sortParam1]
    //       : legendDict[sortParam2] + '拟合性能曲线得到' + checkedControl[0]
    //       ? legendDict[sortParam2]
    //       : legendDict[sortParam1] + '的结果',
    //   // dataIndex: 'sortfullPressure',
    //   dataIndex: checkedControl[0] ? 'sort' + sortParam1 : 'sort' + sortParam2,
    //   align: 'center',
    //   hideInSearch: true,
    //   hideInTable: !(checkedControl[0] || checkedControl[1]),
    //   // hideInTable: !checkedControl[0] || !checkedControl[0],
    //   width: 80,
    //   render: (text, record, index) => {
    //     console.log(record.deviation);

    //     if (
    //       record.deviation != undefined &&
    //       record[checkedControl[0] ? 'sort' + sortParam1 : 'sort' + sortParam2]
    //     ) {
    //       return (
    //         <>
    //           {record[checkedControl[0] ? 'sort' + sortParam1 : 'sort' + sortParam2]}
    //           <label
    //             style={{
    //               color: '#52c41a',
    //             }}
    //           >
    //             ({record.deviation.toString()}%)
    //           </label>
    //         </>
    //       );
    //     }
    //     // else if (record.similarFullPressure != undefined && record.pressureDeviation != undefined)
    //     //   return (
    //     //     <label
    //     //       style={{
    //     //         color: '#52c41a',
    //     //       }}
    //     //     >
    //     //       {record.fullPressure.toString()}({record.pressureDeviation.toString()}%)
    //     //     </label>
    //     //   );
    //     else {
    //       return record[checkedControl[0] ? 'sort' + sortParam1 : 'sort' + sortParam2];
    //     }
    //   },
    // },
    {
      title: '序号',
      dataIndex: 'key',
      align: 'center',
      hideInSearch: true,
      width: 30,
      // render: (text: any, record: any, index: number) => `${index + 1}`,
      render: (text, record, index) => {
        // let current = 1, pageSize = 5
        // if (searchParams.current != undefined) {
        //   current = searchParams.current
        // }
        // if (searchParams.pageSize != undefined) {
        //   pageSize = searchParams.pageSize
        // }
        // console.log('pageOption');
        // console.log(pageOption);

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
      width: 50,
      valueEnum: applicationModelList,
      // onFilter: (value, record) => value === record.category,
    },

    {
      title: '冷却对象',
      dataIndex: 'coolObject',
      valueType: 'textarea',
      align: 'center',
      width: 50,
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
                  color: record.deviationfullPressure > 0 ? '#52c41a' : '#ff9000',
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
                  color: record.deviationfullPressure > 0 ? '#52c41a' : '#ff9000',
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
    // {
    //   title: '状态',
    //   dataIndex: 'delete',
    //   valueType: 'digit',
    //   width: 30,
    //   hideInTable: !manage,
    //   render: (_, record) => {
    //     // console.log(record.delete);

    //     let result;
    //     switch (record.delete) {
    //       case 0:
    //         result = <Tag color="success">已启用</Tag>;
    //         break;
    //       case 1:
    //         result = <Tag color="default">已停用</Tag>;
    //         break;
    //       default:
    //         result = '';
    //     }
    //     return result;
    //   },
    // },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 150,
      render: (_, record) => {
        console.log('record');
        console.log(record);

        let result = [<a onClick={() => goFanDetail(_, record)}>详情</a>];
        // if (record.delete == 1) {
        //   result.push(
        //     <Popconfirm
        //       key="popconfirm1"
        //       title={`确认恢复吗?`}
        //       placement="topLeft"
        //       onConfirm={() => recoverMethod(record)}
        //       okText="是"
        //       cancelText="否"
        //     >
        //       <a key="delete">恢复</a>
        //     </Popconfirm>,
        //   );
        //   result.push(
        //     <Popconfirm
        //       key="popconfirm1"
        //       title={`确认删除吗?`}
        //       placement="topLeft"
        //       onConfirm={() => deleteMethod(record)}
        //       okText="是"
        //       cancelText="否"
        //     >
        //       <a key="delete">删除</a>
        //     </Popconfirm>,
        //   );
        //   return result;
        // }
        if (
          !manage &&
          record.originMotorSpeed &&
          ['flowRate', 'staticPressure', 'fullPressure'].includes(sortParam1) &&
          ['flowRate', 'staticPressure', 'fullPressure'].includes(sortParam2) &&
          !searchParams.sort
        ) {
          result.push(
            <a key="design" onClick={() => designDetail(_, record)}>
              相似设计
            </a>,
          );
        }
        //后端做查询后 record.type != 'copy'可实现本身是新增实验数据得到的记录不能再发起新增实验数据
        if (manage && record.type != 'copy') {
          result.push(
            <a key="design" onClick={() => copyMethodDetail(_, record)}>
              新增实验数据
            </a>,
          );
          result.push(
            <Popconfirm
              key="popconfirm1"
              title={`确认删除吗?`}
              placement="topLeft"
              onConfirm={() => deleteMethod(record)}
              okText="是"
              cancelText="否"
            >
              <a key="delete">删除</a>
            </Popconfirm>,
          );

          // if (record.delete == 0) {
          //   result.push(
          //     <Popconfirm
          //       key="popconfirm1"
          //       title={`确认隐藏吗?`}
          //       placement="topLeft"
          //       onConfirm={() => hideMethod(record)}
          //       okText="是"
          //       cancelText="否"
          //     >
          //       <a key="hide">隐藏</a>
          //     </Popconfirm>,
          //   );
          // }
        }
        // if (manage && record.type != 'copy') {
        //   result.push(
        //     <Row wrap={false} style={{ padding: 0, margin: 0 }}>
        //       <Dropdown
        //         overlay={
        //           <Menu>
        //             <Menu.Item key="copy" onClick={() => copyMethodDetail(_, record)}>
        //               新增实验数据
        //             </Menu.Item>
        //             <Popconfirm
        //               // placement="topRight"
        //               placement="topLeft"
        //               key="popconfirm1"
        //               title="确认删除吗?"
        //               onConfirm={() => deleteMethod(record)}
        //               okText="是"
        //               cancelText="否"
        //             >
        //               <Menu.Item key="delete">删除</Menu.Item>
        //             </Popconfirm>
        //           </Menu>
        //         }
        //       >
        //         <a
        //           className="ant-dropdown-link"
        //           style={{ width: 80 }}
        //           onClick={(e) => e.preventDefault()}
        //         >
        //           更多 <DownOutlined />
        //         </a>
        //       </Dropdown>

        //       <Popconfirm
        //         key="popconfirm1"
        //         title={`确认删除吗?`}
        //         placement="topLeft"
        //         onConfirm={() => deleteMethod(record)}
        //         okText="是"
        //         cancelText="否"
        //       >
        //         <a key="delete">删除</a>
        //       </Popconfirm>
        //     </Row>,
        //   );
        // }
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
      sessionStorage.setItem('expectSelection', expect);
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
      sessionStorage.setItem('expectSelection', expect);
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
    sessionStorage.removeItem('searchData');
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
      sessionStorage.setItem('searchData', searchData);
      formRef?.current?.submit();
    }
    // console.log('!!!!!!!!!!!!!!!!!!!!');

    // console.log(
    //   !manage &&
    //     // record.originMotorSpeed &&
    //     ['flowRate', 'staticPressure', 'fullPressure'].includes(sortParam1) &&
    //     ['flowRate', 'staticPressure', 'fullPressure'].includes(sortParam2) &&
    //     !searchParams.sort,
    // );
  };
  const items = [
    { key: '1', label: 'Action 1' },
    { key: '2', label: 'Action 2' },
  ];
  const [showFanVersionId, setShowFanVersionId] = useState<string>('');

  // useEffect(() => {
  //   getFanVersionData({ id: showFanVersionId }).then((res: any) => {
  //     setFanVersionData(res.data);
  //   });
  // }, [showFanVersionId]);
  const sonTableColumns: ProColumns<FanListItem>[] = [
    {
      title: '日期',
      dataIndex: 'createAt',
      key: 'createAt',
      render: (text, record, index) => {
        return moment(record.createAt).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      valueEnum: {
        alter: '变更',
        add: '新增',
        copy: '新增实验数据',
      },
      render: (val: string, record: any) => {
        switch (val) {
          case 'alter':
            val = '变更';
            break;
          case 'add':
            val = '新增';
            break;
          case 'copy':
            val = '新增实验数据';
            break;
        }
        return val;
      },
    },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (val: string, record: any) => {
        switch (val) {
          case 'pass':
            val = '已通过';
            break;
          case 'passed':
            val = '已通过(历史版本)';
            break;
          case 'rejected':
            val = '已驳回';
            break;
          case undefined:
            val = '审核中';
            break;
          case 'auditAlter':
            val = '变更审核确认中';
            break;
          case 'auditByLead':
            val = '变更审核批准中';
            break;
          case 'audit':
            val = '审核中';
            break;
          case 'rejectedAlter':
            val = '已驳回变更';
            break;
        }
        return val;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (val: string, record: any) => (
        <Space size="middle">
          <a onClick={() => goFanRecordDetail(_, record)}>详情</a>
          {/* <Popconfirm
            key="popconfirm1"
            title={`确认删除吗?`}
            onConfirm={() => deleteUpdateRecordMethod(record)}
            okText="是"
            cancelText="否"
          >
            <a key="delete">删除</a>
          </Popconfirm> */}
          {/*<a>Stop</a>
          <Dropdown menu={{ items }}>
            <a>
              More <DownOutlined />
            </a>
          </Dropdown> */}
        </Space>
      ),
    },
  ];
  const expandedRowRender = (record: any) => {
    console.log('expandedRowRender record');
    console.log(record);
    // setShowFanVersionId(record.id);
    // if (record.id != showFanVersionId) {
    //   getFanVersionData({ id: showFanVersionId }).then((res: any) => {
    //     setFanVersionData(res.data);
    //   });
    // }

    return (
      <ProTable
        search={false}
        options={false}
        columns={sonTableColumns}
        pagination={false}
        request={async (params) => {
          const res = await getFanVersionData({ id: record.id });
          // 查看风机历史版本列表
          // console.log('res');
          // console.log(res);

          const actionParams = {
            ...generalParams,
            actionId: `fan_${activeKey}_查询`,
            actionType: '查询',
            actionName: '查询风机列表',
            description: JSON.stringify(params),
          };
          // saveUserAction({ params: actionParams }).catch((e) => {});
          return res;
        }}
      />
    );
  };
  return (
    <>
      <PageContainer ghost header={{ title: '' }}>
        {/* <Create/> */}
        <Row>
          <Access auth="auth_tree">
            <Col span={4}>
              <Card bordered={false}>
                <Title level={5}>风机类型</Title>
                <div>
                  <Search
                    style={{ marginBottom: 8 }}
                    placeholder=""
                    onChange={(e) => {
                      onChange(e, dataList, treeData);
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
          </Access>
          <Col span={mxcAuthList.includes(`${pathname}:auth_tree`) ? 20 : 24}>
            <ProTable
              scroll={{
                x: manage ? 1369 : 1000,
              }}
              columns={columns}
              actionRef={actionRef}
              formRef={formRef}
              expandable={manage ? { expandedRowRender, defaultExpandedRowKeys: ['0'] } : undefined}
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
                params['manage'] = manage;
                const res = await queryFansList(params).catch((e) => {
                  console.log(e);

                  // sessionStorage.removeItem('searchData');
                });
                const actionParams = {
                  ...generalParams,
                  actionId: `fan_${activeKey}_查询`,
                  actionType: '查询',
                  actionName: '查询风机列表',
                  description: JSON.stringify(params),
                };
                saveUserAction({ params: actionParams }).catch((e) => {});
                return res;
                // return {
                //   data: res.data,
                //   success: true,
                //   total: res.total,
                // };
              }}
              // dataSource={list}
              rowKey="id"
              search={{
                labelWidth: 'auto',
                // labelWidth: 70,
                // span: 6,
                showHiddenNum: true,
                defaultCollapsed: manage ? true : false,
                optionRender: ({ searchText, resetText }, { form }, dom) => [
                  <Button
                    key="resetText"
                    onClick={() => {
                      setExpandedKeys([]);
                      // onTreeSelect([]);
                      setCheckedControl([false, false]);
                      setCheckedDisabled([true, true]);
                      setSortRange([5, 5]);
                      sessionStorage.removeItem('searchData');
                      sessionStorage.removeItem('calculationSelection');
                      sessionStorage.removeItem('expectSelection');
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
                    // onClick={() => {

                    //   // console.log(params);
                    //   sessionStorage.removeItem('searchData');
                    //   const result = form?.getFieldsValue();
                    //   // console.log(result);
                    //   let submitFlag = true;
                    //   for (let i in params) {
                    //     const key = params[i];
                    //     // console.log(key);
                    //     if (result[key]! && result[key].length) {
                    //       // console.log('result[key]');
                    //       // console.log(result[key]);

                    //       if ((result[key][0] || result[key][0] == 0) && (result[key][1] || result[key][1] == 0)) {
                    //         result[key + 'Between'] = result[key];
                    //         result[key] = undefined;
                    //       } else if (result[key][0] || result[key][0] == 0) {
                    //         message.warn('请填写最大值！');
                    //         submitFlag = false;
                    //         result[key + 'Between'] = undefined;
                    //       } else if (result[key][1] || result[key][1] == 0) {
                    //         message.warn('请填写最小值！');
                    //         submitFlag = false;
                    //         result[key + 'Between'] = undefined;
                    //       } else {
                    //         result[key + 'Between'] = undefined;
                    //         result[key] = undefined;
                    //       }
                    //     }
                    //   }
                    //   if (
                    //     ['fullPressure', 'staticPressure'].includes(sortParam1) &&
                    //     ['fullPressure', 'staticPressure'].includes(sortParam1)
                    //   ) {
                    //     message.warn('查询条件不合理，请修改');
                    //     submitFlag = false;
                    //   }
                    //   if (submitFlag) {
                    //     const sortRangeDisabled = !(
                    //       !checkDisable[0] &&
                    //       !checkDisable[1] &&
                    //       (checkedControl[0] || checkedControl[1])
                    //     );

                    //     let searchData = {
                    //       ...result,
                    //       sortParam1: sortParam1,
                    //       sortParam2: sortParam2,
                    //       sortParam3: sortParam3,
                    //       sortParam4: sortParam4,
                    //       // checkedControl: checkedControl,
                    //       // sortRange: sortRange,
                    //       // checkDisable: checkDisable,
                    //       // sort: checkedControl[0],
                    //       checkedControl: checkedControl,
                    //       sortRange: sortRangeDisabled ? undefined : sortRange,
                    //       checkDisable: checkDisable,
                    //       sort: checkedControl[0],
                    //     };
                    //     setPageOption({ current: 1, pageSize: pageOption.pageSize });

                    //     // console.log('searchData');
                    //     // console.log(searchData);
                    //     // console.log('sortRangeDisabled ? undefined : sortRange');
                    //     // console.log(sortRangeDisabled ? undefined : sortRange);
                    //     setBeforeSearchParams({
                    //       ...searchData,
                    //       // current: 1,
                    //       // pageSize: searchParams.pageSize,
                    //     });
                    //     searchData = JSON.stringify(searchData);
                    //     sessionStorage.setItem('searchData', searchData);
                    //     form?.submit();
                    //   }
                    //   // console.log('!!!!!!!!!!!!!!!!!!!!');

                    //   // console.log(
                    //   //   !manage &&
                    //   //     // record.originMotorSpeed &&
                    //   //     ['flowRate', 'staticPressure', 'fullPressure'].includes(sortParam1) &&
                    //   //     ['flowRate', 'staticPressure', 'fullPressure'].includes(sortParam2) &&
                    //   //     !searchParams.sort,
                    //   // );
                    // }}
                  >
                    {searchText}
                  </Button>,
                ],
              }}
              toolBarRender={() => {
                let result: any[] = [];
                if (manage) {
                  result.push(
                    <Button type="primary" onClick={() => createMehtod()}>
                      <PlusOutlined />
                      新建
                    </Button>,
                    <Button
                      onClick={async () => {
                        await downloadFile1(
                          'http://172.16.50.127:8080/api/minIO/download?fileName=风机信息性能曲线模板_9e4c8787-3842-4428-8144-696b1f3c09fb.xls&bucket=2023-06-25',
                          '风机信息性能曲线模板.xls',
                        );
                        // downloadFile('/psad/fan/template/风机信息+性能曲线模板.xls');
                      }}
                    >
                      <DownloadOutlined />
                      excel模板下载
                    </Button>,
                  );
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
    </>
  );
};

export default FanSelection;
