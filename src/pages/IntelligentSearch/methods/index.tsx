import { ArrowUpOutlined, ArrowDownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Card, Col, List, Row, Avatar, Form, Select, Tag, Typography } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import React from 'react';
// import ArticleListContent from '../components/ArticleListContent';
import FooterOperation from '../components/FooterOperation';
import type { ListItemDataType } from './data';
import { getMethodCategory, sortSearch } from './service';
import styles from './style.less';
import { history } from 'umi';

const FormItem = Form.Item;
const { Option } = Select;
const { Paragraph } = Typography;

const Methods: FC = (props) => {

  interface CategoryType {
    name: string;
    list: any[];
    labelName: string,
  }

  const [form] = Form.useForm();
  const query = props.location.state;
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ListItemDataType[]>([]);
  const [methodCurrent, setMethodCurrent] = useState(1);
  const [methodTotal, setMethodTotal] = useState(0);
  const [searchParams, setSearchParams] = useState<CategoryType[]>([]);
  const [flag, setFlag] = useState(false);
  const [queryParams, setQueryParams] = useState<any>(query);

  useEffect(() => {
    const params = {
      ...query,
      current: 1,
      pageSize: 5
    }
    sortSearch(params).then(res => {
      setList(res.list);
      setMethodTotal(res.total);
    });
    getMethodCategory().then(res => {
      setSearchParams(res);
    });
  }, []);

  const loadMore = () => {
    setLoading(true);
    const params = {
      ...query,
      current: methodCurrent + 1,
      pageSize: 5
    }
    sortSearch(params).then(res => {
      const records = list.concat(res.list);
      setList(records);
      setLoading(false);
    });
    setMethodCurrent(methodCurrent + 1);
  }


  const loadMoreDom = list?.length > 0 && (
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
    history.push(`/intelligentSearch/detail/${record.id}`);
  };

  const onFinish = () => {
    const param = form.getFieldsValue();
    setQueryParams(param);
    const params = {
      ...param,
      current: 1,
      pageSize: 5
    }
    sortSearch(params).then(res => {
      setList(res.list);
      setMethodTotal(res.total);
    });
  }

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 12 },
    },
  };

  const onReset = () => {
    form.resetFields();
  };

  const updateList = () => {
    const params = { ...query, current: 1, pageSize: methodCurrent * 5 }
    sortSearch(params).then(res => {
      setList(res.list);
    });
  }

  const showComments = (index: any) => {
    const records = list;
    const isShow = records[index].showComment ? records[index].showComment = false : records[index].showComment = true;
    records[index].showComment = isShow;
    setList(records);
    const status = flag ? false : true;
    setFlag(status);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Row style={{ padding: 20, paddingTop: 20, paddingBottom: 50 }}>
          <Col span={2} />
          <Col span={20}>
            <Form
              layout="inline"
              onFinish={onFinish}
              form={form}
              initialValues={query}
            >
              {
                searchParams.map((item, index) => {
                  return (
                    <Col span={8} style={{ marginBottom: 20 }} key={index} className={styles.searchs}>
                      <FormItem {...formItemLayout} label={item.name} name={item.labelName}>
                        <Select>
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
                  搜索
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  重置
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={2} />
        </Row>
      </div>
      <Card className={styles.content}>
        <Row className={styles.record}>
          <Col span={8}>
            <div style={{ marginLeft: 20 }}>为您检索相关记录 {methodTotal} 条</div>
          </Col>
          {/* <Col span={16}>
            排序：<span>相关度<ArrowDownOutlined /></span><span>上传时间<ArrowUpOutlined /></span>
          </Col> */}
        </Row>
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
            >
              <List.Item.Meta
                title={
                  <Row>
                    <Col span={21}>
                      <div className={styles.listItemMetaTitle}>
                        {item.methodName}
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
                <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '更多' }} className={styles.description}><span style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 700 }}>摘要：</span>{item.methodContent}</Paragraph>
                <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '更多' }} className={styles.description}><span style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 700 }}>应用流程：</span>{item.processDesc}</Paragraph>
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
              {/* <FooterOperation changeRecord={(records: ListItemDataType[]) => updateList(records)} dataList={list} index={index} /> */}
              <FooterOperation
                status={0}
                tags={queryParams}
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
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Methods;
