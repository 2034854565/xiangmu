import { LikeOutlined, LikeFilled, LoadingOutlined, MessageOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { Button, Card, Col, Form, List, Row, Select, Input, Comment, Avatar } from 'antd';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import ArticleListContent from '../components/ArticleListContent';
import type { ListItemDataType } from './data.d';
import { queryFakeList } from './service';
import styles from './style.less';
import moment from 'moment';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { history } from 'umi';

const { Option } = Select;
const FormItem = Form.Item;

const { Search, TextArea } = Input;

const pageSize = 5;

const Articles: FC = () => {
  const [form] = Form.useForm();
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any>([]);
  const [comments, setComments] = useState<any>([]);
  const [submitting, setSubmitting] = useState(false);
  // const [commentValue, setCommentValue] = useState('');

  const inputRef = React.useRef<any>(null);

  useEffect(() => {
    queryFakeList({ count: pageSize }).then(res => {
      setList(res.data.list);
    });
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
    queryFakeList({ count: pageSize }).then(res => {
      const records = list.concat(res.data.list);
      setList(records);
      setLoading(false);
    });
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

  const lookDetail = () => {
    history.push('/intelligentSearch/detail');
  };

  const showCommentList = (index: any) => {
    const isShow = list[index].showComment ? list[index].showComment = false : list[index].showComment = true;
    setList(list);
    setFlag(isShow);
  };

  const handleSubmit = (item: any) => {
    const content = inputRef.current.resizableTextArea.textArea.value;
    if (content === '') {
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const records = comments.concat([{
        author: item.owner,
        avatar: item.avatar,
        content,
        datetime: moment().fromNow(),
      }]);
      setComments(records);
      setSubmitting(false);
      inputRef.current.resizableTextArea.textArea.value = '';
    }, 500);
  };

  const collect = (index: any, mesg: string) => {
    const records = list;
    if (mesg === 'star') {
      const count = records[index].isStar ? records[index].star - 1 : records[index].star + 1;
      const liked = records[index].isStar ? records[index].isStar = false : records[index].isStar = true;
      records[index].star = count;
      setFlag(liked);
      setList(records);
    } else {
      const count = records[index].isLike ? records[index].like - 1 : records[index].like + 1;
      const liked = records[index].isLike ? records[index].isLike = false : records[index].isLike = true;
      records[index].like = count;
      setFlag(liked);
      setList(records);
    }
    console.log(list);
  };


  const Editor = ({ onSubmit, submitting }) => (
    <>
      <Form.Item>
        <TextArea ref={inputRef} rows={4} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
          评论
        </Button>
      </Form.Item>
    </>
  );

  const CommentList = ({ dataList }: { dataList: any }) => (
    <List
      dataSource={dataList}
      header={`全部评论${comments.length}条`}
      itemLayout="horizontal"
      renderItem={(item: any) => (
        <Comment
          author={<a>{item.author}</a>}
          avatar={<Avatar src={item.avatar} />}
          content={<p>{item.content}</p>}
          datetime={item.datetime}
        />
      )}
    />
  );

  return (
    <>
      <div className={styles.container}>
        <Row style={{ padding: 20, paddingTop: 50, paddingBottom: 50 }}>
          <Col span={6} />
          <Col span={12}>
            <Search placeholder="请输入" enterButton="搜索" />
          </Col>
          <Col span={6} />
        </Row>
        <Form
          style={{ marginLeft: 60 }}
          layout="inline"
          form={form}
          initialValues={{
            owner: ['wjh', 'zxx'],
          }}
        // onValuesChange={reload}
        >
          <Col span={8} style={{ marginBottom: 30 }}>
            <FormItem {...formItemLayout} label="创新产品" name="product">
              <Select placeholder="请选择" >
                <Option value="pro1">动车</Option>
                <Option value="pro2">城轨</Option>
                <Option value="pro3">机车</Option>
                <Option value="pro4">磁浮</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="创新环节" name="part">
              <Select placeholder="请选择">
                <Option value="part1">研发</Option>
                <Option value="part2">生产</Option>
                <Option value="part3">服务</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="创新链对象" name="object">
              <Select placeholder="请选择">
                <Option value="obj1">电气</Option>
                <Option value="obj2">制动</Option>
                <Option value="obj3">暖通</Option>
                <Option value="obj4">车门</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="创新类别" name="type">
              <Select placeholder="请选择">
                <Option value="type1">技术创新</Option>
                <Option value="type2">管理创新</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label="创新程序" name="procedure">
              <Select placeholder="请选择">
                <Option value="obj1">发现问题</Option>
                <Option value="obj2">分析问题</Option>
                <Option value="obj3">解决问题</Option>
              </Select>
            </FormItem>
          </Col>
          {/* <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                <Button type="primary">
                  搜索
                </Button>
              </Col> */}
        </Form>
      </div>
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '8px 32px 32px 32px' }}
      >
        <Row className={styles.record}>
          <Col span={8}>
            <div style={{ marginLeft: 20 }}>为您检索相关记录 12条</div>
          </Col>
          <Col span={16}>
            排序：<span>相关度<ArrowDownOutlined /></span><span>上传时间<ArrowUpOutlined /></span>
          </Col>
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
            // extra={<div className={styles.listItemExtra} />}
            >
              <List.Item.Meta
                title={
                  <Row>
                    <Col span={21}>
                      <div className={styles.listItemMetaTitle}>
                        {item.title}
                      </div>
                    </Col>
                    <Col span={3}>
                      <Button type="primary" onClick={() => lookDetail()}>查看详情</Button>
                    </Col>
                  </Row>
                }
              />
              <ArticleListContent data={item} />
              <div style={{ color: '#8C8C8C', marginTop: 20 }}>
                <span className={styles.tagList} onClick={() => collect(index, 'star')}>
                  {React.createElement(item.isStar ? StarFilled : StarOutlined)}
                  {item.star}
                </span>
                <span className={styles.tagList} onClick={() => collect(index, 'like')}>
                  {React.createElement(item.isLike ? LikeFilled : LikeOutlined)}
                  {item.like}
                </span>
                <span className={styles.tagList} onClick={() => showCommentList(index)}>
                  <MessageOutlined style={{ marginRight: 8 }} />
                  {item.message}
                </span>
              </div>
              {
                item.showComment ? <>
                  {comments.length > 0 && <CommentList dataList={comments} />}
                  <Comment
                    avatar={<Avatar src={item.avatar} />}
                    content={
                      <Editor
                        onSubmit={() => handleSubmit(item)}
                        submitting={submitting}
                      />
                    }
                  />
                </> : ''
              }
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default Articles;
