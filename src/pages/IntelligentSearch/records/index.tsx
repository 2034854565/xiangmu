import { ArrowUpOutlined, ArrowDownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, List, Row, Select, Input, Tabs, Avatar, Tag, Typography } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import React from 'react';
// import ArticleListContent from '../components/ArticleListContent';
import FooterOperation from '../components/FooterOperation';
import type { ListItemDataType, KnowledgeItemDataType } from './data.d';
import { getMethodCategory, vagueSearch } from './service';
import styles from './style.less';
import { history } from 'umi';

const { Option } = Select;
const FormItem = Form.Item;

const { Search } = Input;
const { TabPane } = Tabs;

const { Paragraph } = Typography;

const Records: FC = (props) => {
  const { param, type, key } = props.match.params;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ListItemDataType[]>([]);
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItemDataType[]>([]);
  const [flag, setFlag] = useState(false);
  const [tabKey, setTabKey] = useState(key);
  const [methodCurrent, setMethodCurrent] = useState(1);
  const [knowledgeCurrent, setKnowledgeCurrent] = useState(1);
  const [methodTotal, setMethodTotal] = useState(0);
  const [knowledgeTotal, setKnowledgeTotal] = useState(0);
  const [query, setQuery] = useState({});
  const [searchValue, setSearchValue] = useState(param);

  interface CategoryType {
    name: string;
    list: any[];
    labelName: string,
  }
  const [searchParams, setSearchParams] = useState<CategoryType[]>([]);

  useEffect(() => {
    getMethodCategory().then(res => {
      setSearchParams(res);
    });
    const params = {
      current: 1,
      pageSize: 5,
    }
    if (param !== ' ') {
      params.desc = param;
    }
    if (key === 'method') {
      vagueSearch({ status: '0', ...params }).then(res => {
        setList(res.list);
        setMethodTotal(res.total);
      });
      vagueSearch({ status: '1', ...params }).then(res => {
        setKnowledgeList(res.list);
        setKnowledgeTotal(res.total);
      });
    } else {
      vagueSearch({ status: '1', ...params }).then(res => {
        setKnowledgeList(res.list);
        setKnowledgeTotal(res.total);
      });
    }
    // queryMethodsData({ current: 1, pageSize: 5 }).then(res => {
    //   setList(res.list);
    //   setMethodTotal(res.total);
    // });
    // queryKnowledgeData({ current: 1, pageSize: 5 }).then(res => {
    //   setKnowledgeList(res.list);
    //   setKnowledgeTotal(res.total);
    // });
  }, []);


  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 12 },
    },
  };

  const loadMore = () => {
    setLoading(true);
    if (key === 'method') {
      const params = { ...query, current: methodCurrent + 1, pageSize: 5, status: '0', }
      if (searchValue !== ' ') {
        params.desc = searchValue;
      }
      vagueSearch(params).then(res => {
        const records = list.concat(res.list);
        setList(records);
        setLoading(false);
      });
      setMethodCurrent(methodCurrent + 1);
    } else {
      const params = { current: knowledgeCurrent + 1, pageSize: 5, status: '1' };
      if (searchValue !== ' ') {
        params.desc = searchValue;
      }
      vagueSearch(params).then(res => {
        const records = knowledgeList.concat(res.list);
        setKnowledgeList(records);
        setLoading(false);
      });
      setKnowledgeCurrent(knowledgeCurrent + 1);
    }
  }


  const loadMoreDom = list?.length < methodTotal && (
    <div style={{ textAlign: 'center', marginTop: 16 }}>
      <Button onClick={loadMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
        {loading ? (
          <span>
            <LoadingOutlined /> 加载中...
          </span>
        ) : (
          '加载更多'
        )}
      </Button>
    </div>
  );

  const loadMoreKnowledgeDom = knowledgeList.length < knowledgeTotal && (
    <div style={{ textAlign: 'center', marginTop: 16 }}>
      <Button onClick={loadMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
        {loading ? (
          <span>
            <LoadingOutlined /> 加载中...
          </span>
        ) : (
          '加载更多'
        )}
      </Button>
    </div>
  );

  const lookDetail = (record: any) => {
    console.log('tabKey======', record)
    if (tabKey === 'method') {
      history.push(`/intelligentSearch/detail/${record.id}`);
    } else {
      history.push(`/intelligentSearch/knowledgeDetail/${record.id}`);
    }
  };

  const changeTab = (key: any) => {
    setTabKey(key);
    const params = {
      current: 1,
      pageSize: 5,
    }
    if (searchValue !== ' ') {
      params.desc = searchValue;
    }
    if (key === 'method') {
      vagueSearch({ status: '0', ...params }).then(res => {
        setList(res.list);
        setMethodTotal(res.total);
      });
    } else {
      vagueSearch({ status: '1', ...params }).then(res => {
        setKnowledgeList(res.list);
        setKnowledgeTotal(res.total);
      });
    }
    history.push(`/intelligentSearch/records/${param}/${type}/${key}`);
  }

  const onFinish = () => {
    const values = form.getFieldsValue();
    setQuery(values);
    setMethodCurrent(1);
    const params = { ...values, status: '0', current: 1, pageSize: 5 };
    if (searchValue !== ' ') {
      params.desc = searchValue;
    }
    vagueSearch(params).then(res => {
      setList(res.list);
      setMethodTotal(res.total);
      // form.setFieldsValue(param);
    });
  }

  const updateList = () => {
    if (tabKey === 'method') {
      const params = { ...query, current: 1, pageSize: methodCurrent * 5, status: '0' }
      if (searchValue !== ' ') {
        params.desc = searchValue;
      }
      vagueSearch(params).then(res => {
        setList(res.list);
      });
    } else {
      const params = { current: 1, pageSize: knowledgeCurrent * 5, status: '1' }
      if (searchValue !== ' ') {
        params.desc = searchValue;
      }
      vagueSearch(params).then(res => {
        setKnowledgeList(res.list);
      });
    }
  }

  const showComments = (index: any) => {
    if (tabKey === 'method') {
      const records = list;
      const isShow = records[index].showComment ? records[index].showComment = false : records[index].showComment = true;
      records[index].showComment = isShow;
      setList(records);
    } else {
      const records = knowledgeList;
      const isShow = records[index].showComment ? records[index].showComment = false : records[index].showComment = true;
      records[index].showComment = isShow;
      setKnowledgeList(records);
    }
    const status = flag ? false : true;
    setFlag(status);
  }

  const onSearch = (value: string) => {
    const params = {
      current: 1,
      pageSize: 5,
    }
    if (value !== '') {
      params.desc = value;
    }
    if (key === 'method') {
      vagueSearch({ status: '0', ...params }).then(res => {
        setList(res.list);
        setMethodTotal(res.total);
      });
    } else {
      vagueSearch({ status: '1', ...params }).then(res => {
        setKnowledgeList(res.list);
        setKnowledgeTotal(res.total);
      });
    }
  }

  const onChange = (e: any) => {
    setSearchValue(e.target.value);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Row style={{ padding: 20, paddingTop: 36, paddingBottom: 6 }}>
          <Col span={6} />
          <Col span={12}>
            <Search defaultValue={param === ' ' ? '' : param} onSearch={onSearch} onChange={onChange} placeholder="城轨车辆转向架轻量化设计方法" enterButton="搜索" />
          </Col>
          <Col span={6} />
        </Row>
        <Tabs activeKey={tabKey} onChange={changeTab} tabBarStyle={{ color: '#FFFFFF' }} style={{ marginLeft: 40 }} >
          {
            type === 'knowledge' ? '' : <TabPane tab={`创新方法(${methodTotal})`} key="method" />
          }
          {
            type === 'method' ? '' : <TabPane tab={`企业知识库(${knowledgeTotal})`} key="knowledge" />
          }
        </Tabs>
      </div>
      <Card className={styles.content}>
        {
          tabKey === 'method' ? <Form
            style={{ marginLeft: 20, marginTop: 0 }}
            layout="inline"
            form={form}
            onFinish={onFinish}
            initialValues={query}
          // onValuesChange={reload}
          >
            {
              searchParams.map((item, index) => {
                return (
                  <Col span={8} style={{ marginBottom: 16 }} key={index}>
                    <FormItem {...formItemLayout} label={item.name} name={item.labelName}>
                      <Select placeholder="请选择" >
                        {
                          item.list.map((listItem, index) => {
                            return (
                              <Option value={listItem.realName} key={index}>{listItem.realName}</Option>
                            )
                          })
                        }
                      </Select>
                    </FormItem>
                  </Col>
                )
              })
            }
            <Form.Item>
              <Button htmlType="submit" style={{ marginRight: 20 }}>
                过滤
              </Button>
            </Form.Item>
          </Form> : ''
        }
        <Row className={styles.record}>
          <Col span={8}>
            <div style={{ marginLeft: 20 }}>为您检索相关记录 {tabKey === 'method' ? methodTotal : knowledgeTotal} 条</div>
          </Col>
          {/* <Col span={16}>
            排序：<span>相关度<ArrowDownOutlined /></span>&emsp;<span>上传时间<ArrowUpOutlined /></span>
          </Col> */}
        </Row>
        {
          tabKey === 'method' ? (
            <List<ListItemDataType>
              size="large"
              loading={loading}
              rowKey="id"
              itemLayout="vertical"
              loadMore={loadMoreDom}
              dataSource={list}
              renderItem={(item, index) => (
                <List.Item
                  key={item.id}
                // extra={<div className={styles.listItemExtra} />}
                >
                  <List.Item.Meta
                    title={
                      <Row>
                        <Col span={21}>
                          <div className={styles.listItemMetaTitle}>
                            <div dangerouslySetInnerHTML={{ __html: item.methodName }}>
                            </div>
                          </div>
                        </Col>
                        <Col span={3}>
                          <Button type="primary" onClick={() => lookDetail(item)}>查看详情</Button>
                        </Col>
                      </Row>
                    }
                  />
                  <div className={styles.listContent}>
                    <div className={styles.extra}>
                      <Avatar src={item.icon} size="small" />
                      <a>城轨系统研发部&nbsp;&nbsp;&nbsp;|</a>
                      <em>{item.createTime}</em>
                    </div>
                    <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '更多' }} className={styles.description}><span style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 700 }}>摘要：</span><span style={{ fontSize: 13, lineHeight: 2 }} dangerouslySetInnerHTML={{ __html: item.methodContent }}></span></Paragraph>
                    <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '更多' }} className={styles.description}><span style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 700 }}>应用流程：</span><span style={{ fontSize: 13, lineHeight: 2 }} dangerouslySetInnerHTML={{ __html: item.processDesc }}></span></Paragraph>
                  </div>
                  <div style={{ marginTop: 15 }}>
                    {
                      item.zjUse === '是' ? <Tag style={{ padding: '2px 15px' }} color="geekblue">株机常用</Tag> : ''
                    }
                    <Tag style={{ padding: '2px 15px' }} color="cyan">{item.methodType}</Tag>
                    {
                      item.methodCategory.split('\n').map((item, index) => { return <Tag key={index} style={{ padding: '2px 15px' }} color="blue">{item}</Tag> })
                    }
                  </div>
                  <FooterOperation
                    status={0}
                    tags={query}
                    changeRecord={() => updateList()}
                    changeComment={(index: any) => showComments(index)}
                    index={index}
                    detailObj={{
                      likeStatus: item.likeStatus,
                      likeCount: item.likeCount,
                      storeStatus: item.storeStatus,
                      storeCount: item.storeCount,
                      id: item.id,
                      commentCount: item.commentCount,
                      showComment: item.showComment,
                    }} />
                  {/* <FooterOperation changeRecord={(records: ListItemDataType[]) => updateList(records)} dataList={list} index={index} /> */}
                </List.Item>
              )}
            />
          ) : (
            <List<KnowledgeItemDataType>
              size="large"
              loading={loading}
              rowKey="id"
              itemLayout="vertical"
              loadMore={loadMoreKnowledgeDom}
              dataSource={knowledgeList}
              renderItem={(item, index) => (
                <List.Item
                  key={item.id}
                // extra={<div className={styles.listItemExtra} />}
                >
                  <List.Item.Meta
                    title={
                      <Row>
                        <Col span={21}>
                          <div className={styles.listItemMetaTitle}>
                            <div dangerouslySetInnerHTML={{ __html: item.knowledgeName }}>
                            </div>
                          </div>
                        </Col>
                        <Col span={3}>
                          <Button type="primary" onClick={() => lookDetail(item)}>查看详情</Button>
                        </Col>
                      </Row>
                    }
                  />
                  <div className={styles.listContent}>
                    <div className={styles.extra}>
                      <Avatar src={item.icon} size="small" />
                      <a>{item.department}&nbsp;&nbsp;&nbsp;|</a>
                      <em>{item.createDate}</em>
                    </div>
                    <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '更多' }} className={styles.description}><span style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 700 }}>摘要：</span><span dangerouslySetInnerHTML={{ __html: item.abstracts }}></span></Paragraph>
                    <div style={{ marginTop: 20 }}>
                      <span style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 700 }}>关键词：</span>
                      {
                        item.keyWords.split('、').map((item, index) => <Tag key={index} color="blue" style={{ width: 100, textAlign: "center", borderRadius: 5 }}>{item}</Tag>)
                      }
                    </div>
                  </div>
                  <FooterOperation
                    status={1}
                    index={index}
                    changeRecord={() => updateList()}
                    changeComment={(index: any) => showComments(index)}
                    detailObj={{
                      likeStatus: item.likeStatus,
                      likeCount: item.likeCount,
                      storeStatus: item.storeStatus,
                      storeCount: item.storeCount,
                      id: item.id,
                      commentCount: item.commentCount,
                      showComment: item.showComment,
                    }} />
                </List.Item>
              )}
            />
          )
        }
      </Card>
    </div>
  );
};

export default Records;
