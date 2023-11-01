import React from 'react';
import { DoubleLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Avatar, List, Row, Tabs, Tag, Divider, Image, Tooltip } from 'antd';
import styles from './style.less';
import { useEffect, useState } from 'react';
import type { MethodItem } from './data';
import InfiniteScroll from 'react-infinite-scroll-component';
import { history } from 'umi';
import { getMethodDetail, getMethodCategory, getScoreById, getConnectionCases, getConnectionKnowledge } from './service';
import FooterOperation from '../components/FooterOperation';

const { TabPane } = Tabs;

const Detail: React.FC = (props) => {

  const { Meta } = Card;

  const { id } = props.match.params;
  const [projectlList, setProjectlList] = useState<any[]>([]);
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);
  const [detailObj, setDetailObj] = useState<MethodItem>();
  const [flag, setFlag] = useState(false);

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
    getMethodDetail({ id: id }).then(res => {
      setDetailObj(res);
    });
    getConnectionCases({ id: id }).then(res => {
      setProjectlList(res.data || []);
    });
    getConnectionKnowledge({ id: id }).then(res => {
      setKnowledgeList(res.data || []);
    });
  }, []);


  const callback = () => {

  };

  const goBack = () => {
    // history.push(`/intelligentSearch/records/ /${type}/method`);
    history.go(-1);
  };

  const goToScore = () => {
    getScoreById({ id: detailObj?.id }).then(res => {
      history.push(`/fitnessScore/create?type=update`, res);
    });
  }

  const loadMore = () => {
    // const records: ExampleListItem[] = [];
    // for (let i = 1; i < 5; i += 1) {
    //   records.push({
    //     id: i,
    //     name: `案例${i}：900V超级电容高压模组研制可行性分析报告`,
    //     type: i % 2 === 1 ? '城轨' : '机车',
    //     object: i % 2 === 1 ? '制动' : '电气',
    //     part: i % 2 === 1 ? '产品研发' : '概念设计',
    //     category: i % 2 === 1 ? '技术创新' : '管理创新',
    //     procedure: i % 2 === 1 ? '发现问题' : '解决问题',
    //     example: i % 2 === 1 ? '有' : '无',
    //     time: Date.now() - Math.floor(Math.random() * 100000),
    //     source: '借鉴现有相似产品的结构设计，强度计算、线缆布局和通风散热等方面进行适当的仿真分析，外形方面可以通过整体开模加工出美观的绝缘罩。硬件的电磁兼容一方面必须在PCB板的设计上下功夫，做到元器件的合理布局和布线的合理走向，其次可以针对某些关键环节',
    //   });
    // }
    // const ls = list;
    // ls.concat(records);
    // setList(ls);
  }

  const updateList = () => {
    getMethodDetail({ id: id }).then(res => {
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


  return (
    <div style={{ height: '100%' }}>
      <Row gutter={18} style={{ height: '100%' }}>
        <Col span={6}>
          <Card
            style={{ height: '100%' }}
          // bodyStyle={{ height: '100%' }}
          >
            <Meta title={
              <div style={{ display: 'flex' }}>
                <div style={{ width: '70%' }}><a style={{ fontSize: 13, color: '#1890FF' }} onClick={() => goBack()}><DoubleLeftOutlined />返回</a></div>
                {/* <img src={down} style={{ marginLeft: 20 }} /> */}
              </div>
            }
            />
            <div style={{ color: '#5F5F5F', height: 1000, overflow: 'auto', }}>
              <div className={styles.title}>{detailObj?.methodName}</div>
              <div>编号：{detailObj?.methodNumber}</div>
              <div className={styles.titleInfo}>
                <Avatar src={detailObj?.icon} size="small" />&nbsp;&nbsp;
                <div>来源：{detailObj?.author}</div>&nbsp;&nbsp;&nbsp;&nbsp;
                <div>{detailObj?.createTime}</div>
              </div>
              {/* <div style={{ marginTop: 30 }}><span style={{ fontSize: 16, color: '#5A5A5A' }}>摘要：</span>{detailObj?.methodContent}</div> */}
              <div>
                {
                  detailObj?.zjUse === '是' ? <Tag style={{ padding: '2px 15px', marginTop: 10 }} color="geekblue">株机常用</Tag> : ''
                }
                <Tag style={{ padding: '2px 15px', marginTop: 10 }} color="cyan">{detailObj?.methodType}</Tag>
                {
                  detailObj?.methodCategory.split('\n').map((item, index) => item ? <Tag key={index} style={{ padding: '2px 15px', marginTop: 10 }} color="blue">{item}</Tag> : '')
                }
              </div>
              <br />
              <div style={{ marginTop: -20 }}>
                <Row >
                  <Tooltip title={
                    searchParams.map(item => {
                      return (
                        <>
                          <div style={{ marginTop: 10 }}><span>{item.name}：</span>{detailObj?.[item.labelName]}</div>
                        </>
                      );
                    })
                  } color='blue' placement="rightTop"><Tag className={styles.tag} color='#BADEFF' >应用场景</Tag></Tooltip>
                  <Tag className={styles.tag} color='#BADEFF' onClick={() => goToScore()}>应用场景指标评分信息</Tag>
                </Row>
              </div>
              <div className={styles.divide}></div>
              {/* <div className={styles.divide}>{detailObj?.methodContent}</div>
              <div className={styles.divide} style={{ marginTop: 16 }}>{detailObj?.methodContent}</div>
              <div style={{ marginTop: 16 }}>{detailObj?.methodContent}</div> */}
              {/* <div className={styles.footer}>
                <span className={styles.divideIcon}>
                  <StarOutlined style={{ marginRight: 8 }} />15
                </span>
                <span className={styles.divideIcon}>
                  <LikeOutlined style={{ marginRight: 8 }} />23
                </span>
                <span className={styles.divideIcon}>
                  <MessageOutlined style={{ marginRight: 8 }} />34
                </span>
                <span>
                  <DownloadOutlined style={{ marginRight: 8 }} />12
                </span>
              </div> */}
              <FooterOperation
                status={0}
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
              <div style={{ marginTop: 16 }}><span style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 600 }}>定义内容：</span>{detailObj?.methodContent}</div>
              <div style={{ marginTop: 16 }}><span style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 600 }}>原理：</span>{detailObj?.theory}</div>
            </div>
          </Card>
        </Col>
        <Col span={18}>
          <Card bodyStyle={{ height: '100%' }}>
            <div>
              {/* <div className={styles.smallTitle}>应用场景</div>
              {
                searchParams.map(item => {
                  return (
                    <>
                      <div style={{ marginTop: 10 }}><span className={styles.des}>{item.name}：</span>{detailObj?.[item.labelName]}</div>
                    </>
                  );
                })
              } */}
              <div className={styles.smallTitle} style={{ marginTop: 10 }}>应用要求</div>
              <div className={styles.demand}>{detailObj?.demand}</div>
              <Row gutter={48} style={{ marginTop: 10 }}>
                <Col span={12}>
                  <div className={styles.smallTitle}>应用流程文字描述</div>
                  {/* <div>{detailObj?.processDesc}</div> */}
                  <List
                    split={false}
                    dataSource={detailObj?.processDesc.split('\n')}
                    renderItem={item => (
                      <List.Item>
                        {item}
                      </List.Item>
                    )}
                  />
                </Col>
                <Col span={12}>
                  <div className={styles.smallTitle}>应用流程框图</div>
                  <Image
                    src="error"
                  />
                </Col>
              </Row>
            </div>
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab={`关联项目案例（${projectlList.length}）`} key="1">
                <div
                  style={{
                    height: 660,
                    overflow: 'auto',
                  }}
                >
                  <InfiniteScroll
                    dataLength={projectlList.length}
                    next={loadMore}
                    hasMore={projectlList.length < 50}
                    loader={false}
                    endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDiv"
                  >
                    <List
                      itemLayout="horizontal"
                      dataSource={projectlList}
                      renderItem={(item, index) => (
                        <List.Item>
                          <List.Item.Meta
                            title={
                              <div style={{ display: 'flex' }}>
                                <div className={styles.examInfo}>案例{index + 1}：{item.caseName}</div>
                                <Button type='primary'>下载附件</Button>
                              </div>
                            }
                            description={
                              <div style={{ color: '#333333', fontSize: 14 }}>
                                <div><span style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 700 }}>背景：</span>{item.background}</div>
                                <div style={{ marginTop: 10 }}><span style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 700 }}>摘要：</span>{item.caseContent}</div>
                                {/* <div>
                                  背景：
                                  <span style={{ marginRight: 20 }}>产品类型：{item.type}</span>
                                  <span style={{ marginRight: 20 }}>创新对象：{item.object}</span>
                                  <span style={{ marginRight: 20 }}>创新链环节：{item.part}</span>
                                  <span style={{ marginRight: 20 }}>创新类别：{item.category}</span>
                                  <span>创新技术：{item.procedure}</span>
                                </div>
                                <div style={{ marginTop: 15 }}>
                                  摘要：{item.source}
                                </div>
                                <div style={{ margin: 20 }}>
                                  <Button style={{ marginRight: 20 }}>预览详情</Button>
                                  <Button>下载附件</Button>
                                </div> */}
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </InfiniteScroll>
                </div>
              </TabPane>
              <TabPane tab={`关联精华知识（${knowledgeList.length}）`} key="3">
                <div
                  style={{
                    height: 660,
                    overflow: 'auto',
                  }}
                >
                  <InfiniteScroll
                    dataLength={knowledgeList.length}
                    next={loadMore}
                    hasMore={knowledgeList.length < 50}
                    loader={false}
                    endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDiv"
                  >
                    <List
                      itemLayout="horizontal"
                      dataSource={knowledgeList}
                      renderItem={(item, index) => (
                        <List.Item>
                          <List.Item.Meta
                            title={
                              <div style={{ display: 'flex' }}>
                                <div className={styles.examInfo}>案例{index + 1}：{item.knowledgeName}</div>
                                <Button type='primary'>下载附件</Button>
                              </div>
                            }
                            description={
                              <div style={{ color: '#333333', fontSize: 14 }}>
                                <div className={styles.description}><span style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 700 }}>摘要：</span>{item.abstracts}</div>
                                <div style={{ marginTop: 20 }}>
                                  <span style={{ fontSize: 16, color: '#5A5A5A', fontWeight: 700 }}>关键词：</span>
                                  {
                                    item.keyWords.split('、').map((item: any, index: any) => <Tag key={index} color="blue" style={{ width: 100, textAlign: "center", borderRadius: 5 }}>{item}</Tag>)
                                  }
                                </div>
                                {/* <div>
                                  背景：
                                  <span style={{ marginRight: 20 }}>产品类型：{item.type}</span>
                                  <span style={{ marginRight: 20 }}>创新对象：{item.object}</span>
                                  <span style={{ marginRight: 20 }}>创新链环节：{item.part}</span>
                                  <span style={{ marginRight: 20 }}>创新类别：{item.category}</span>
                                  <span>创新技术：{item.procedure}</span>
                                </div>
                                <div style={{ marginTop: 15 }}>
                                  摘要：{item.source}
                                </div>
                                <div style={{ margin: 20 }}>
                                  <Button style={{ marginRight: 20 }}>预览详情</Button>
                                  <Button>下载附件</Button>
                                </div> */}
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </InfiniteScroll>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  )
};

export default Detail;
