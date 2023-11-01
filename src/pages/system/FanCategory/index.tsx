/*
 * @Descripttion:
 * @version:
 * @Author: ljx
 * @Date: 2023-05-23 15:51:03
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-15 11:33:03
 */
import {
  CloseOutlined,
  CheckOutlined,
  EditOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { nanoid, ProCard } from '@ant-design/pro-components';
import { PageContainer, PageLoading } from '@ant-design/pro-layout';

import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Tree,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import { addCategory, deleteCategory, queryCategory, updateCategory } from './service';
//封装getTree方法，将数组转化为tree.
const { Option } = Select;

import { cloneDeep } from 'lodash'; //lodash库里引入cloneDeep深克隆方法
import UpdateForm from './components/UpdateForm';
import { DepartmentListItem } from './data';
import { DataNode } from 'antd/es/tree';
const { Search } = Input;

const getTree = (data) => {
  const temp = cloneDeep(data); //深克隆一份外来数据data，以防下面的处理修改data本身
  const parents = temp.filter((item) => !item.parentId); //过滤出最高父集
  let children = temp.filter((item) => item.parentId); //过滤出孩子节点
  console.log('parents');
  console.log(parents);

  const result = parents.sort((a, b) => {
    console.log(a);
    console.log(a.sort);

    a.sort - b.sort;
  });
  console.log('parents');
  console.log(parents);
  console.log('result');
  console.log(result);
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

const { TreeNode } = Tree;

const FanCategoryManage: React.FC<{}> = () => {
  const [isloading, setIsloading] = useState(true);

  const [form] = Form.useForm();

  const [originData, setOriginData] = useState<{}[]>([]);
  const [data, setData] = useState<{}>();
  const [treeData, setTreeData] = useState();

  const [departmentOptions, setDepartmentOptions] = useState<
    { label: string; value: number; code: string }[]
  >([]);

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([1]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);

  const [formVals, setFormVals] = useState<DepartmentListItem>();
  // const formVals = useRef();

  useEffect(() => {
    console.log('useEffect');

    queryCategory({}).then((res) => {
      console.log('res');
      console.log(res);
      res.data.map((item: any) => {
        item.key = item.name.toString() + '(' + item.code.toString() + ')';
        // item.key = item.id.toString();
      });
      setOriginData(res.data);
    });
  }, []);
  useEffect(() => {
    const res = { data: cloneDeep(originData) };

    let expandedKeyArr: number[] = [];
    let departmentOptions: { label: string; value: number }[] = [];
    let data = {};
    res.data.map((item) => {
      item.key = item.id.toString();
      data[item.key] = item;
      expandedKeyArr.push(item.name.toString() + '(' + item.code.toString() + ')');
      setExpandedKeys(expandedKeyArr);
      departmentOptions.push({
        label: item.name,
        value: item.id,
        code: item.code,
      });
    });

    setData(data);
    // console.log('data');
    // console.log(data);

    // console.log('expandedKeyArr');
    // console.log(expandedKeyArr);

    const temp = cloneDeep(res.data); //深克隆一份外来数据data，以防下面的处理修改data本身
    temp.forEach((item) => {
      item.key = item.name.toString() + '(' + item.code.toString() + ')';
    });
    const result = getTree(temp);
    console.log('setTreeData');
    console.log(result);
    setTreeData(result);
    setDepartmentOptions(departmentOptions);
    setIsloading(false);
  }, [originData]);

  const onAdd = (key, data) => {
    console.log('key');
    console.log(key);
    console.log(data[key]);
    setFormVals(data[key]);

    handleModalVisible(true);
  };

  const onEdit = (key) => {
    setFormVals(data[key]);

    setUpdateModalVisible(true);
    // editNode(key, treeData);
    // setData(treeData.slice());
  };

  const editNode = (fields: any) => {
    console.log(fields);
    // const hide1 = message.loading('正在添加');
    try {
      updateCategory(fields).then((res) => {
        if (res.success) {
          // hide1();
          message.success('更新成功');
          queryCategory({}).then((res) => {
            setOriginData(res.data);
          });
          setUpdateModalVisible(false);

          return true;
        } else {
          setUpdateModalVisible(false);
          message.error('更新失败请重试！');
          // hide1();
        }
      });
    } catch (error) {
      setUpdateModalVisible(false);
      message.error('更新失败请重试！');
      return false;
    }
  };

  const addNode = (fields: any) => {
    console.log(fields);
    // const hide1 = message.loading('正在添加');
    try {
      addCategory(fields).then((res) => {
        if (res.success) {
          // hide1();
          message.success('添加成功！');
          queryCategory({}).then((res) => {
            setOriginData(res.data);
          });
          handleModalVisible(false);

          return true;
        } else {
          setUpdateModalVisible(false);
          message.error('添加失败请重试！');
          // hide1();
        }
      });
    } catch (error) {
      setUpdateModalVisible(false);
      message.error('添加失败请重试！');
      return false;
    }
  };

  const deleteNode = async (item: any) => {
    const hide = message.loading('正在删除');
    try {
      const params = { id: item.id };
      console.log('params');
      console.log(params);
      await deleteCategory(params).then((res) => {
        if (res.success) {
          hide();
          message.success('删除成功!');
        }
      });
    } catch (error) {
      hide();
      message.error('删除失败，请重试');
      return false;
    }

    queryCategory({}).then((res) => {
      setOriginData(res.data);
    });
  };

  const renderTreeNodes = (data) => {
    let nodeArr = data.map((item) => {
      // console.log('item');
      // console.log(item);
      // const strTitle = (item.name + '(' + item.code + ')') as string;
      const strTitle = item.key as string;
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
      item.title = (
        <div style={{ fontSize: 16 }}>
          <span>
            {title}
            {/* {'(' + item.code + ')'} */}
          </span>
          <span>
            <EditOutlined
              style={{ marginLeft: 10 }}
              onClick={() => {
                // item.id = item.id == 0 ? undefined : item.id;
                // setFormVals(cloneDeep(item));
                // console.log('item');
                // console.log(item);

                setFormVals(item);
                form.setFieldsValue(item);
                setUpdateModalVisible(true);
              }}
            />

            {item.parentId == 0 ? (
              <PlusOutlined
                style={{ marginLeft: 10 }}
                onClick={() => {
                  // console.log('PlusOutlined onClick item');
                  // console.log(item);

                  setFormVals({ id: item.id });
                  handleModalVisible(true);
                }}
              />
            ) : null}
            {/* item.parentId === 0 && */}
            {item.children != undefined ? null : (
              <Popconfirm
                key="popconfirm1"
                title={`确认删除吗?`}
                onConfirm={() => {
                  console.log(item);
                  deleteNode(item);
                }}
                okText="是"
                cancelText="否"
              >
                <MinusOutlined style={{ marginLeft: 10 }} />
              </Popconfirm>
            )}
          </span>
        </div>
      );

      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }

      return <TreeNode title={item.title} key={item.key} />;
    });

    return nodeArr;
  };
  const onExpand = (expandedKeys: React.Key[]) => {
    // console.log('expandedKeys');
    // console.log(expandedKeys);

    //记录折叠的key值
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
    // console.log('----------------------------');
    // console.log('key');
    // console.log(key);

    let parentKey: React.Key;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        // console.log(node.children);

        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    // console.log('----------------------------');
    return parentKey!;
  };
  //风机类型搜索
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    dataList: { key: React.Key; name: string }[],
    treeData: DataNode[],
  ) => {
    // console.log('dataList');
    // console.log(dataList);

    // console.log('treeData');
    // console.log(treeData);

    const { value } = e.target;
    // console.log('value');
    // console.log(value);

    const newExpandedKeys = dataList
      .map((item) => {
        console.log(item);

        if (item.key.indexOf(value) > -1) {
          const result = getParentKey(item.key, treeData);
          // console.log('getParentKey');
          // console.log(result);

          return result;
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    // console.log('newExpandedKeys');
    // console.log(newExpandedKeys);

    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  return (
    <>
      {/* <PageContainer> */}
      <ProCard>
        <ProCard
          colSpan={18}
          title="风机分类管理"
          extra={
            <Button
              type="primary"
              onClick={() => {
                setFormVals({ id: 0 });
                handleModalVisible(true);
              }}
            >
              <PlusOutlined />
              添加顶级分类
            </Button>
          }
        >
          <Search
            style={{ marginBottom: 8 }}
            placeholder=""
            onChange={(e) => {
              console.log(data);
              console.log(treeData);

              onChange(e, originData, treeData);
            }}
          />
          {isloading ? (
            <PageLoading />
          ) : (
            <Tree
              showLine
              expandedKeys={expandedKeys}
              onExpand={onExpand}
              selectable={false}
              // selectedKeys={selectedKeys}
              autoExpandParent={autoExpandParent}
              onSelect={(e) => {
                console.log(e);
                console.log(data);
                setFormVals(data[e[0]]);
                form.setFieldsValue(data[e[0]]);
              }}
            >
              {renderTreeNodes(treeData)}
            </Tree>
          )}
        </ProCard>
        {formVals == undefined || createModalVisible || updateModalVisible ? null : (
          <ProCard colSpan={12}>
            <br />
          </ProCard>
        )}
      </ProCard>
      {/* </PageContainer> */}
      {formVals == undefined ? null : (
        <CreateForm
          modalVisible={createModalVisible}
          departmentOptions={departmentOptions}
          formVals={formVals}
          onSubmit={addNode}
          onCancel={() => {
            setFormVals(undefined);
            handleModalVisible(false);
          }}
        />
      )}
      {formVals == undefined ? null : (
        <UpdateForm
          modalVisible={updateModalVisible}
          formVals={formVals}
          onSubmit={editNode}
          onCancel={() => {
            setUpdateModalVisible(false);
            setFormVals(undefined);
          }}
          departmentOptions={departmentOptions}
        />
      )}
    </>
  );
};
export default FanCategoryManage;
