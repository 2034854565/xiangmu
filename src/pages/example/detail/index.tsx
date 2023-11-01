import React from 'react';
import { DoubleLeftOutlined } from '@ant-design/icons';
import { Card, Col, Row, Divider, Button, Avatar, List } from 'antd';
import styles from './style.less';
import moment from 'moment';
import { useEffect, useState } from 'react';
import type { ExampleListItem } from './data.d';
import { getCaseById, getConnectionMethods } from './service';
import { history } from 'umi';
import InfiniteScroll from 'react-infinite-scroll-component';

const CaseDetail: React.FC = (props) => {

  const { Meta } = Card;

  const { id } = props.location.query;
  console.log('===========>', id)
  const [flag, setFlag] = useState(false);
  const [detailObj, setDetailObj] = useState<ExampleListItem>();
  const [methodList, setMethodList] = useState<any[]>([]);

  useEffect(() => {
    getCaseById({ id: id }).then(res => {
      setDetailObj(res);
    });
    getConnectionMethods({ id: id }).then(res => {
      setMethodList(res.data || []);
    });
  }, []);

  const goBack = () => {
    history.go(-1);
  };

  const loadMore = () => {

  }

  return (
    <div style={{ height: '100%' }}>
      <Row gutter={18}>
        <Col span={7}>
          <Card
            style={{ height: 800, overflow: 'auto' }}
          >
            <Meta title={
              <>
                <a style={{ fontSize: 13, color: '#1890FF' }} onClick={() => goBack()}><DoubleLeftOutlined />返回</a>
                <div className={styles.title}>基本信息</div>
              </>
            }
              description={
                <>
                  <div style={{ color: '#5F5F5F' }}>
                    <div style={{ marginBottom: 10 }}>编号：{detailObj?.caseNumber}</div>
                    <div style={{ marginBottom: 10 }}>标题：{detailObj?.caseName}</div>
                    <div style={{ marginBottom: 10 }}>编写人：{detailObj?.uploader}</div>
                    <div style={{ marginBottom: 10 }}>编写日期：{detailObj?.uploadTime}</div>
                    <div style={{ marginBottom: 10 }}>重要程度：{detailObj?.important}</div>
                    <div style={{ marginBottom: 10 }}>部门：{detailObj?.uploadDepartment}</div>
                  </div>
                </>
              } />
          </Card>
        </Col>
        <Col span={17}>
          <Card
            style={{ height: 800, overflow: 'auto' }}
            title={detailObj?.caseName}
            extra={<Button type="primary" ghost>下载附件</Button>}
            headStyle={{ borderBottom: 0, fontSize: 18, fontWeight: 700 }}
            bodyStyle={{ height: '100%' }} >
            <div className={styles.listContent}>
              <div className={styles.extra}>
                <Avatar src={detailObj?.icon} size="small" />
                <a href='#'>{detailObj?.uploadDepartment}&nbsp;&nbsp;&nbsp;|</a>
                <em>{moment(detailObj?.uploadTime).format('YYYY-MM-DD HH:mm')}</em>
              </div>
              <div className={styles.description}><span style={{ fontSize: 16, color: '#5A5A5A' }}>背景：</span>{detailObj?.background}</div>
              <div className={styles.description}><span style={{ fontSize: 16, color: '#5A5A5A' }}>摘要：</span>{detailObj?.caseContent}</div>
            </div>
            <Divider />
            <div style={{ color: '#1890ff', fontSize: 16, fontWeight: 600 }}>关联方法</div>
            <div
              style={{
                height: 660,
                overflow: 'auto',
              }}
            >
              <InfiniteScroll
                dataLength={methodList.length}
                next={loadMore}
                hasMore={methodList.length < 50}
                loader={false}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={methodList}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div style={{ display: 'flex' }}>
                            <div className={styles.examInfo}>案例{index + 1}：{item.methodName}</div>
                            <Button type='primary'>下载附件</Button>
                          </div>
                        }
                        description={
                          <div style={{ color: '#333333', fontSize: 14 }}>
                            <div className={styles.description}><span style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 700 }}>定义内容：</span>{item.methodContent}</div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
};

export default CaseDetail;
