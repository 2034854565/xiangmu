import React from 'react';
import { DoubleLeftOutlined, LineOutlined } from '@ant-design/icons';
import { Card, Col, Row, Divider, Button, List, Tag } from 'antd';
import styles from './style.less';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from 'react';
import type { ListItemDataType } from './data.d';
import ArticleListContent from '../components/ArticleListContent';
import FooterOperation from '../components/FooterOperation';
import { getKnowledgeDetail, getConnectionMethods } from './service';
import { history } from 'umi';

const KnowledgeDetail: React.FC = (props) => {

  const { Meta } = Card;

  const { id } = props.match.params;
  const [flag, setFlag] = useState(false);
  const [detailObj, setDetailObj] = useState<ListItemDataType>();
  const [methodList, setMethodList] = useState<any[]>([]);

  useEffect(() => {
    getKnowledgeDetail({ id: id }).then(res => {
      setDetailObj(res);
    });
    getConnectionMethods({ id: id }).then(res => {
      setMethodList(res.data || []);
    });
  }, []);

  const goBack = () => {
    // history.push(`/intelligentSearch/records/ /${type}/knowledge`);
    history.go(-1);
  };

  const updateList = () => {
    getKnowledgeDetail({ id: id }).then(res => {
      setDetailObj(res);
    });
  }

  const showComments = (index: any) => {
    const record = detailObj;
    const isShow = record?.showComment ? false : true;
    record.showComment = isShow;
    setDetailObj(record);
    const status = flag ? false : true;
    setFlag(status);
  }

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
                    <div style={{ marginBottom: 10 }}>标题：{detailObj?.knowledgeName}</div>
                    <div style={{ marginBottom: 10 }}>得分：{detailObj?.score}分</div>
                    <div style={{ marginBottom: 10 }}>关键字：{detailObj?.keyWords}</div>
                    <div style={{ marginBottom: 10 }}>提交人：{detailObj?.submitter}</div>
                    <div style={{ marginBottom: 10 }}>提交时间：{detailObj?.submissionTime}</div>
                    <div style={{ marginBottom: 10 }}>分类：{detailObj?.category}</div>
                    <div style={{ marginBottom: 10 }}>密级：{detailObj?.secret}</div>
                    <div style={{ marginBottom: 10 }}>库：{detailObj?.library}</div>
                    <div style={{ marginBottom: 10 }}>所属部门：{detailObj?.department}</div>
                    <div style={{ marginBottom: 10 }}>编写人：{detailObj?.author}</div>
                    <div style={{ marginBottom: 10 }}>版本信息：{detailObj?.versionInfo}</div>
                  </div>
                </>
              } />
          </Card>
        </Col>
        <Col span={17}>
          <Card
            style={{ height: 800, overflow: 'auto' }}
            title={detailObj?.knowledgeName}
            extra={<Button type="primary" ghost>下载附件</Button>}
            headStyle={{ borderBottom: 0, fontSize: 18, fontWeight: 700 }}
            bodyStyle={{ height: '100%' }} >
            <ArticleListContent
              content={detailObj?.abstracts}
              createDate={detailObj?.createDate}
              avatar={detailObj?.icon}
              submitter={detailObj?.submitter}
              keys={detailObj?.keys || []}
            />
            {/* <div style={{ color: '#8C8C8C', marginTop: 20 }}>
              <span className={styles.tagList} style={{ borderRight: '1px solid #E9E9E9' }} onClick={() => collect('star')}>
                <StarOutlined style={{ marginRight: 8 }} />22
              </span>
              <span className={styles.tagList} onClick={() => collect('like')}>
                <LikeOutlined style={{ marginRight: 8 }} />34
              </span>
            </div> */}
            <FooterOperation
              status={1}
              index={0}
              changeRecord={() => updateList()}
              changeComment={(index: any) => showComments(index)}
              detailObj={{
                likeStatus: detailObj?.likeStatus || '',
                likeCount: detailObj?.likeCount || '',
                storeStatus: detailObj?.storeStatus || '',
                storeCount: detailObj?.storeCount || '',
                id: detailObj?.id || 0,
                commentCount: detailObj?.commentCount || '',
                showComment: detailObj?.showComment || false,
              }} />
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

export default KnowledgeDetail;
