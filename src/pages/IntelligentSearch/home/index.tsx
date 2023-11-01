import { ArrowUpOutlined, DoubleRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Modal, Col, Form, List, Row, Select, Input, Tabs, Radio, Typography, Drawer, Tag } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import React from 'react';
// import ArticleListContent from '../components/ArticleListContent';
// import FooterOperation from '../components/FooterOperation';
import type { ListItemDataType } from '../methods/data';
import { getMethodCategory, queryMethodsData, getLikeInfo, getStoreInfo } from './service';
import styles from './style.less';
import { history } from 'umi';
import Triz from '../components/Triz';
import FileViewer from 'react-file-viewer';

const { Option } = Select;
const { Search } = Input;
const FormItem = Form.Item;
const { TabPane } = Tabs;


const Home: FC = () => {

  interface CategoryType {
    name: string;
    list: any[];
    labelName: string,
  }

  const { Paragraph } = Typography;
  const userId = localStorage.getItem('userId');

  const [form] = Form.useForm();
  const [selected, setSelected] = useState('all');
  const [searchParams, setSearchParams] = useState<CategoryType[]>([]);
  const [type, setType] = useState('one');
  const [initLoading, setInitLoading] = useState(false);
  const [list, setList] = useState<ListItemDataType[]>([]);
  const [storeList, setStoreList] = useState<any[]>([]);
  const [likeList, setLikeList] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [item, setItem] = useState<CategoryType>();

  useEffect(() => {
    getMethodCategory().then(res => {
      setSearchParams(res);
    });
    const params = {
      current: 1,
      pageSize: 5
    }
    queryMethodsData(params).then(res => {
      setList(res.list);
    });
    getStoreInfo({ userId }).then(res => {
      if (res.message === 'OK') {
        setStoreList(res.data);
      }
    });
    getLikeInfo({ userId }).then(res => {
      if (res.message === 'OK') {
        setLikeList(res.data);
      }
    });
  }, []);

  const onChange = (e: any) => {
    console.log('radio checked', e.target.value);
    setSelected(e.target.value);
  };

  const goResource = (type: any) => {
    history.push(`/intelligentSearch/resource?type=${type}`);
  }

  const queryData = (value: any) => {
    const param = value ? value : ' ';
    const key = selected === 'knowledge' ? 'knowledge' : 'method';
    history.push(`/intelligentSearch/records/${param}/${selected}/${key}`);
  }

  const searchMethod = (label: any, name: any) => {
    const data = {};
    data[label] = name;
    history.push(`/intelligentSearch/methods`, data);
  }

  const changeSearchType = (value: any) => {
    setType(value);
  }

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 },
      md: { span: 12 },
    },
  };

  const onFinish = () => {
    const param = form.getFieldsValue();
    console.log('------>', param)
    history.push(`/intelligentSearch/methods`, param);
  }

  const onReset = () => {
    form.resetFields();
  };


  const SearchForm = () => (
    <Form
      layout="inline"
      onFinish={onFinish}
      form={form}
    >
      {
        searchParams.map((item, index) => {
          return (
            <Col span={8} style={{ marginBottom: 30 }} key={index} className={styles.searchs}>
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
  );

  const loadMore = () => {
    setInitLoading(true);
    queryMethodsData().then(res => {
      const records = list.concat(res.list);
      setList(records);
      setInitLoading(false);
    });
  }

  const loadMoreDom = list?.length > 0 && (
    <div style={{ color: '#1890FF', fontSize: 13, textAlign: 'right', cursor: 'pointer' }}>
      <div onClick={loadMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
        {initLoading ? (
          <span>
            <LoadingOutlined /> 加载中...
          </span>
        ) : (
          '更多'
        )}
      </div>
    </div>
  );

  const changeTab = (key: string) => {
    console.log(key);
  };

  const goToDetail = (id: any, type: any) => {
    if (type === 'method') {
      history.push(`/intelligentSearch/detail/${id}`);
    } else {
      history.push(`/intelligentSearch/knowledgeDetail/${id}`);
    }
  }
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const chooseType = (item: any) => {
    setIsModalVisible(true);
    setItem(item);
  }

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ margin: -24 }}>
      <div className={styles.container}>
        <Row style={{ padding: 20, paddingTop: 50, paddingBottom: 50 }}>
          <Col span={4} >
            {/* <FileViewer
              fileType='gif'
              // src={fanInfo.filePath}
              src='https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF'
              // src={fanInfo.imagePath[1]}

              unsupportedComponent={() => <label>暂不支持doc文件格式预览</label>}
            />
            <FileViewer
              fileType={'pdf'}
              // src={fanInfo.filePath}
              src="http://127.0.0.1:8010/api/download/psad/file/fan/category/model1/0.pdf"
              // src={fanInfo.imagePath[1]}

              unsupportedComponent={() => <label>暂不支持doc文件格式预览</label>}
            /> */}
          </Col>
          <Col span={2}>
            <div className={styles.search}>
              <div className={type === 'one' ? styles.one : styles.two} onClick={() => changeSearchType('one')}>模糊搜索</div>
              <div className={type === 'two' ? styles.one : styles.two} onClick={() => changeSearchType('two')}>权重搜索</div>
              <div style={{ height: 40, borderRight: 'solid 2px #1172DD' }}></div>
            </div>
          </Col>
          <Col span={1}></Col>
          <Col span={10}>
            <div style={{ display: 'flex' }}>
              {
                type === 'one' ? <><Search placeholder="城轨车辆转向架轻量化设计方法" onSearch={(value) => queryData(value)} enterButton="搜索" />
                  {/* <a href="" className={styles.question}>问题不清晰？</a> */}
                  <Button type="link" onClick={showDrawer}>
                    问题不清晰？
                  </Button>
                  <Drawer title="创新原理TRIZ" placement="right" onClose={onClose} visible={visible}>
                    <Triz />
                  </Drawer>

                </> : ''
              }
            </div>
            {
              type === 'one' ? (
                <div className={styles.radioList}>
                  <Radio.Group onChange={onChange} value={selected}>
                    <Radio value='all' style={{ color: 'white', marginRight: 30 }}>全选</Radio>
                    <Radio value='method' style={{ color: 'white', marginRight: 30 }}>创新方法</Radio>
                    <Radio value='knowledge' style={{ color: 'white' }}>企业知识库</Radio>
                  </Radio.Group>
                </div>
              ) : <SearchForm />
            }
          </Col>
          <Col span={6} >
            {/* <div style={{ borderTop: '1px solid #D7D7D7', padding: '15px 0' }}> */}
            {/* <div className={styles.bottomTitle}>创新小程序</div> */}
            <div style={{ float: "right", padding: -30 }}>
              {/* <Tag color="#87d068">混合动力能量分配</Tag>
            <br/>
            <br/>
             <Tag color="#87d068">功能组合创新</Tag>
              <br/> <br/>
              <Tag color="#87d068">设备布置</Tag> */}
              {/* <div className={styles.applet}>创新小程序
                <div className={styles.applet1}>混合动力能量分配</div>
                <div className={styles.applet1}>功能组合创新</div>
                <div className={styles.applet1}>设备布置</div>
                </div>
                {/* <div className={styles.applet}>.....</div> */}
            </div>

            {/* </div> */}
          </Col >
        </Row>
      </div>
      <Row gutter={24} style={{ padding: '0 24px', marginTop: -102, minHeight: 500 }}>
        <Col span={6}>

          <div className={styles.searchTitle}>创新方法应用程序</div>
          <div style={{ backgroundColor: 'white' }}>
            <div style={{ backgroundColor: 'white', height: 500 }}>
              <div style={{ padding: '20px 0', display: 'flex', flexWrap: 'wrap' }}>
                <div style={{ width: '50%', textAlign: 'center', marginBottom: 10 }}>
                  <img src={require('./icon/icon_1.svg')} style={{ width: '40%' }}></img>
                  <div style={{ fontWeight: 600 }}>设备布置</div>
                </div>
                <div style={{ width: '50%', textAlign: 'center', marginBottom: 10 }}>
                  <img src={require('./icon/icon_2.svg')} style={{ width: '40%' }}></img>
                  <div style={{ fontWeight: 600 }}>能量分配</div>
                </div>
                <div style={{ width: '50%', textAlign: 'center', marginBottom: 10 }}>
                  <img src={require('./icon/icon_3.svg')} style={{ width: '40%' }}></img>
                  <div style={{ fontWeight: 600 }}>组合创新</div>
                </div>
                <div style={{ width: '50%', textAlign: 'center', marginBottom: 10 }}>
                  <img src={require('./icon/icon_4.svg')} style={{ width: '40%' }}></img>
                  <div style={{ fontWeight: 600 }}>矛盾矩阵</div>
                </div>
              </div>
            </div>
            {/* <div className={styles.bottomTitle}>创新方法库</div>
            {
              searchParams.map((item, index) => {
                return (
                  <div key={index} style={{ padding: '15px 40px' }}>
                    <div className={styles.paramsTitle}>{item.name}</div>
                    <div className={styles.params}>
                      {
                        item.list.map((listItem, index) => {
                          return (
                            <span onClick={() => searchMethod(item.labelName, listItem.realName)} key={index} style={{ color: '#555555', fontWeight: 550, paddingRight: 20, cursor: 'pointer' }}>{listItem.realName}</span>
                          )
                        })
                      }
                    </div>
                  </div>
                )
              })
            } */}
          </div>

        </Col>
        <Col span={10}>
          <div className={styles.searchTitle}>案例推荐</div>
          <div style={{ backgroundColor: 'white', height: 500, overflow: 'auto' }}>
            <List
              split={false}
              loading={initLoading}
              itemLayout="horizontal"
              loadMore={loadMoreDom}
              dataSource={list}
              renderItem={item => (
                <List.Item>
                  <div style={{ marginBottom: -12, paddingLeft: 30, paddingRight: 30 }}>
                    <div style={{ fontSize: 15, fontWeight: 'bold' }}>{item.methodName}</div>
                    <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}>
                      {item.methodContent}
                    </Paragraph>
                    {/* <div style={{ color: '#7F7F7F' }}>{item.methodContent}<span style={{ color: '#1890FF', fontWeight: 'bold', fontSize: 13 }}><DoubleRightOutlined />详情</span></div> */}
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.searchTitle}>创新方法库</div>
          <div style={{ backgroundColor: 'white', height: 500, overflow: 'auto' }}>
            {
              searchParams.map((item, index) => {
                return (
                  <div key={index} style={{ padding: '15px 40px', display: 'flex' }}>
                    <div style={{ background: '#F0F2F5', padding: 8, borderRadius: 25 }}><img src={require('./icon/icon_5.svg')} style={{ width: 25 }}></img></div>
                    <div className={styles.paramsTitle} onClick={() => chooseType(item)}>{item.name}</div>
                    {/* <div className={styles.params}>
                      {
                        item.list.map((listItem, index) => {
                          return (
                            <span onClick={() => searchMethod(item.labelName, listItem.realName)} key={index} style={{ color: '#555555', fontWeight: 550, paddingRight: 20, cursor: 'pointer' }}>{listItem.realName}</span>
                          )
                        })
                      }
                    </div> */}
                  </div>
                )
              })
            }
            {/* <Tabs defaultActiveKey="1" onChange={changeTab} centered tabBarGutter={100}>
              <TabPane tab={`收藏(${storeList.length})`} key="1">
                <List
                  split={false}
                  loading={initLoading}
                  itemLayout="horizontal"
                  // loadMore={loadMoreDom}
                  dataSource={storeList}
                  renderItem={item => (
                    <List.Item>
                      <div style={{ padding: '0 20px' }}>
                        <div style={{ fontSize: 15, fontWeight: 'bold' }}>{item.methodNumber ? item.methodName : item.knowledgeName}</div>
                        <div style={{ color: '#7F7F7F' }}>{item.methodNumber ? item.methodContent : item.abstracts}
                          <span style={{ color: '#404040', fontWeight: 'bold', fontSize: 13, cursor: 'pointer' }} onClick={() => goToDetail(item.id, item.methodNumber ? 'method' : 'knowledge')}><DoubleRightOutlined />详情</span>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane tab={`点赞(${likeList.length})`} key="2">
                <List
                  split={false}
                  loading={initLoading}
                  itemLayout="horizontal"
                  // loadMore={loadMoreDom}
                  dataSource={likeList}
                  renderItem={item => (
                    <List.Item>
                      <div style={{ padding: '0 20px' }}>
                        <div style={{ fontSize: 15, fontWeight: 'bold' }}>{item.methodNumber ? item.methodName : item.knowledgeName}</div>
                        <div style={{ color: '#7F7F7F' }}>{item.methodNumber ? item.methodContent : item.abstracts}
                          <span style={{ color: '#404040', fontWeight: 'bold', fontSize: 13, cursor: 'pointer' }} onClick={() => goToDetail(item.id, item.methodNumber ? 'method' : 'knowledge')}><DoubleRightOutlined />详情</span>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>
              <TabPane tab="上传(35)" key="3">
                Content of Tab Pane 3
              </TabPane>
            </Tabs> */}
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div style={{ backgroundColor: 'white', minHeight: 100, padding: '15px 0', margin: 24 }}>
            <div className={styles.bottomTitle}>资源导航</div>
            <div style={{ padding: 15, textAlign: 'center' }}>
              <img style={{ width: 200, marginRight: 30 }} src={require('../../../assets/u411.png')} onClick={() => goResource(1)}></img>
              <img style={{ width: 200 }} src={require('../../../assets/u412.png')} onClick={() => goResource(2)}></img>
            </div>
          </div>
        </Col>
      </Row>
      <Modal title="请选择" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={false}>
        <div>
          {
            item?.list.map((listItem: any, index: any) => {
              return (
                <Tag onClick={() => searchMethod(item.labelName, listItem.realName)} style={{ color: '#555555', fontWeight: 500, padding: 10, cursor: 'pointer', fontSize: 16, margin: 15 }} key={index}>{listItem.realName}</Tag>
                // <span onClick={() => searchMethod(item.labelName, listItem.realName)} key={index} style={{ color: '#555555', fontWeight: 550, paddingRight: 20, cursor: 'pointer' }}>{listItem.realName}</span>
              )
            })
          }
        </div>
      </Modal >
    </div >
  );
};

export default Home;
