/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-02-17 17:27:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-28 09:08:24
 */
/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-02-17 17:27:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-14 09:38:20
 */
/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-02-17 17:27:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-04 16:10:22
 */
/*
 * @Author: 嘉欣 罗 2592734121@qq.com
 * @Date: 2022-12-22 13:11:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-04-23 14:28:10
 * @FilePath: \psad-front\src\pages\fan\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styles from './style.less';
import { LeftCircleOutlined, RightCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import {
  Button,
  Row,
  Col,
  Card,
  Tabs,
  Descriptions,
  message,
  TabsProps,
  Carousel,
  Typography,
} from 'antd';
import React, { useRef, useEffect, useMemo, useState, Key } from 'react';
import { fallbackImage, FanDetailItem, TreeDataItem } from '../../data.d';
import { history, useLocation, useModel } from 'umi';
import { Input, Tree, Image } from 'antd';
import FileViewer from 'react-file-viewer';

import PerformanceGraph from '../../../charts/performanceGraph';
import { queryFanData, queryFanPerfData } from '../../selection/service';
import { ProList } from '@ant-design/pro-components';
import { fileNameDict } from '../utils';
import FileView from '@/components/FileView';
import Access from '@/components/Access';
import moment from 'moment';
import { download, downloadFile, downloadFile1 } from '../../service';
import { saveUserAction } from '@/services/ant-design-pro/api';
import { PageContainer } from '@ant-design/pro-layout';
import CarouselDetail from '@/components/CarouselDetail';

const FanDetail: React.FC<{}> = (props) => {
  // console.log('FanDetail props');
  // console.log(props);
  // const { model, activeKey } = props.match.params;
  const location = useLocation(); //获取跳转页面携带的值
  // console.log('location.state');
  // console.log(location.state);
  if (location?.state?.id == undefined) {
    window.location.replace('/fan/1');
  }
  const { id, activeKey } = location?.state;

  // console.log('id1');
  // console.log(id);
  const { initialState } = useModel('@@initialState');
  const authList = initialState?.currentUser?.authList;

  const mxcAuthList = authList == undefined ? [] : authList;
  const [fanInfo, setFanInfo] = useState<FanDetailItem>();
  let [perfData, setPerfData] = useState<{}>({});
  const getPerfData = () => {
    // console.log('getPerfData');
    // console.log(perfData);

    return perfData;
  };
  const [imgMain, setImgMain] = useState<string[]>();
  const [viewFile, setViewFile] = useState<{ name: string; path: string }>();
  const [viewFile2, setViewFile2] = useState<{ name: string; path: string }>();
  const [viewFile1, setViewFile1] = useState<{ title: string; name: string; path: string }>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  let pageArea = '';
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
      break;
    case '5':
      pageArea = '审批管理';
      break;
    case '6':
      pageArea = '审核进度查看';
      break;

    case 1:
      pageArea = '产品选型';
      break;
    case 2:
      pageArea = '相似设计';
      break;
    case 3:
      pageArea = '变形设计';
      break;
    case 4:
      pageArea = '数据管理';
      break;
    case 5:
      pageArea = '审批管理';
      break;
    case 6:
      pageArea = '审核进度查看';
      break;
  }

  const generalParams = {
    monitorModule: '风机平台',
    pageUrl: window.location.href,
    pageName: '风机平台',
    pageArea: pageArea,
    actionModel: fanInfo?.model,
  };

  useEffect(() => {
    queryFanData(id)
      .then((res) => {
        // console.log('res');
        // console.log(res.data);
        // let imgMain = res.data.img3d.map((item) => {
        //   return item.viewUrl;
        // });
        // console.log('imgMain');
        // console.log(imgMain);
        // console.log(imgMain[0]);

        // setImgMain(imgMain);
        setImgMain(res.data.img3d);
        res.data.img3d = undefined;
        const technicalFile = [];
        for (let key in res.data.technicalFile) {
          if (res.data.technicalFile[key].length == 0) {
            continue;
          } else {
            for (let i = 0; i < res.data.technicalFile[key].length; i++) {
              technicalFile.push({
                title: fileNameDict[key],
                path: res.data.technicalFile[key][i].downloadUrl,
                name: res.data.technicalFile[key][i].fileName,
              });
            }
          }
        }
        res.data.technicalFile = technicalFile;
        console.log('technicalFile');
        console.log(technicalFile);

        // let aerodynamicSketch = '';
        // for (let i = 0; i < aerodynamicSketch.length; i++) {
        //   if (aerodynamicSketch[i].split('.').pop() != 'dwg') {
        //     aerodynamicSketch = aerodynamicSketch[i];
        //   }
        // }
        // res.data.aerodynamicSketch = aerodynamicSketch;
        let aerodynamicSketch = [];
        // for (let key in res.data.aerodynamicSketch) {

        for (let i = 0; i < res.data.aerodynamicSketch.length; i++) {
          aerodynamicSketch.push({
            title: res.data.aerodynamicSketch[i].fileName,
            path: res.data.aerodynamicSketch[i].downloadUrl,
            // name: res.data.aerodynamicSketch[key].split('/').pop(),
          });

          // }
        }
        console.log('aerodynamicSketch');
        console.log(aerodynamicSketch);
        res.data.aerodynamicSketch = aerodynamicSketch;
        setFanInfo(res.data);
        console.log('res.data');
        console.log(res.data);

        queryFanPerfData(id)
          .then((res) => {
            setPerfData(res.data);
          })
          .catch((error) => {
            message.error('请求失败！');
            return;
          });
      })
      .catch((error) => {
        console.log(error);

        message.error('请求失败！');
        return;
      });
    // console.log('fanInfo');
    // console.log(fanInfo.);
  }, []);
  // const userInfo = initialState?.currentUser?.name;
  // const updateAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

  const onClick = (e, record) => {
    console.log(record);
    setSubmitLoading(true);

    // console.log("e", e)
    //需要保存的用户行为信息,包括上传、下载、设计等行为
    const params = {
      ...generalParams,
      pageArea: '详情',
      actionId: `fan_${activeKey}_${e.target.innerText}`,
      actionType: '下载',
      actionName: '下载气动略图',
      description: '下载气动略图_' + record.title,
    };
    saveUserAction({ params }).catch((e) => {});

    downloadFile1(record.path, record.title).finally(() => {
      setSubmitLoading(false);
    });

    console.log('下载');
  };
  const onTechnologyFileClick = (e, record) => {
    console.log('record');
    console.log(record);
    setSubmitLoading(true);

    // console.log("e", e)
    //需要保存的用户行为信息,包括上传、下载、设计等行为
    const params = {
      ...generalParams,
      pageArea: '详情',
      actionId: `fan_${activeKey}_${e.target.innerText}`,
      actionType: '下载',
      actionName: '下载技术文档_' + e.target.innerText,
      description: '下载技术文档_' + record.name,
    };
    saveUserAction({ params }).catch((e) => {});

    downloadFile1(record.path, record.name).finally(() => {
      setSubmitLoading(false);
    });
  };
  const [echartsInstance, setEchartsInstance] = useState<echarts.ECharts>();

  const items: TabsProps['items'] | any = [
    {
      key: '1',
      label: '性能曲线',
      children: (
        <>
          {/* <Image
            width={300}
            height={300}
            // src={fanInfo?.img3d[0]}
            // src={'/api/download/psad/fan/391702/391702-img3d-1.png'}
            src={
              'http://172.16.50.127:9000/2023-06-12/1679884666392_a78eac95-8961-4ba1-aa76-7f6eeb2b8db9.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20230612%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230612T034050Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=d06ee37a552096694bafd305c6fa2be45df6d6a59eb89a5154cd12e65e86c74e'
            }
            fallback={fallbackImage}
          /> */}
          {fanInfo == undefined ? null : (
            <PerformanceGraph
              activeKey={activeKey}
              fanInfo={fanInfo}
              getPerfData={getPerfData}
              authList={authList}
              echartsInstance={echartsInstance}
              setEchartsInstance={setEchartsInstance}
            />
          )}
        </>
      ),
    },
    {
      key: '2',
      label: '外形尺寸图',
      children: (
        <>
          <ProList<any>
            // onRow={(record: any) => {
            //   console.log('外形尺寸图 click onRow');
            //   console.log(record);
            //   return {
            //     onClick: (e) => {
            //       console.log('外形尺寸图 click record');
            //       console.log(record);
            //       setViewFile2(record);
            //     },
            //   };
            // }}
            rowKey="title"
            dataSource={
              fanInfo?.outlineFile.length > 0
                ? fanInfo?.outlineFile.map((item) => {
                    return {
                      title: item.fileName,
                      path: item.downloadUrl,
                    };
                  })
                : undefined
            }
            showActions="hover"
            showExtra="hover"
            metas={{
              title: {
                dataIndex: 'title',
              },
              actions: {
                render: (text, row) => [
                  <Button
                    type="text"
                    size="small"
                    style={{ color: '#1890ff' }}
                    loading={submitLoading}
                    onClick={(e) => {
                      // onClick(e, row);
                      setSubmitLoading(true);
                      downloadFile1(
                        fanInfo?.outlineFile[0].downloadUrl,
                        fanInfo?.outlineFile[0].fileName,
                      );
                      const actionParams = {
                        ...generalParams,
                        pageArea: '详情',
                        actionId: `fan_${activeKey}_${e.target.innerText}`,
                        actionType: '下载',
                        actionName: '下载外形尺寸图',
                        description: '下载外形尺寸图_' + fanInfo?.outlineFile[0].fileName,
                      };
                      saveUserAction({ params: actionParams })
                        .catch((e) => {})
                        .finally(() => {
                          setSubmitLoading(false);
                        });
                    }}
                  >
                    下载
                  </Button>,
                ],
              },
            }}
          />
          {}

          {fanInfo?.outlineFile.length == 0 ? (
            <label> </label>
          ) : (
            <>
              {['png', 'jpg', 'jpeg', 'gif'].includes(
                fanInfo?.outlineFile[0].fileName.toString().split('.').pop(),
              ) ? (
                <Image
                  // width={300}
                  // height={300}
                  // src={fanInfo?.img3d[0]}
                  // src={'/api/download/psad/fan/391702/391702-img3d-1.png'} + '?v=' + moment()
                  src={fanInfo?.outlineFile[0].downloadUrl}
                  fallback={fallbackImage}
                />
              ) : (
                //     viewFile2 == undefined ? null : (
                //   <FileView
                //     url={viewFile2.path}
                //     filename={viewFile2.title}
                //     refresh={false}
                //     randomNum={Math.random()}
                //     defaultScale={0.9}
                //   />
                // )
                <FileView
                  url={fanInfo?.outlineFile[0].downloadUrl}
                  filename={fanInfo?.outlineFile[0].fileName}
                  refresh={false}
                  randomNum={Math.random()}
                  defaultScale={0.9}
                />
              )}
            </>
          )}
        </>
      ),
    },
    mxcAuthList.includes('/fan/detail:technicalFile')
      ? {
          key: '3',
          label: '技术文档',
          children: (
            <>
              <ProList<any>
                onRow={(record: any) => {
                  return {
                    onClick: (e) => {
                      console.log('record');
                      console.log(record);
                      setViewFile(record);
                      const actionParams = {
                        ...generalParams,
                        pageArea: '详情',
                        actionId: `fan_${activeKey}_${e.target.innerText}`,
                        actionType: '查询',
                        actionName: '查看技术文档',
                        description: '查看技术文档_' + record.name,
                      };
                      saveUserAction({ params: actionParams }).catch((e) => {});
                    },
                  };
                }}
                rowKey="title"
                dataSource={fanInfo?.technicalFile}
                showActions="hover"
                showExtra="hover"
                metas={{
                  title: {
                    dataIndex: 'title',
                  },
                  description: {
                    dataIndex: 'name',
                  },
                  // subTitle: {
                  //   render: () => {
                  //     return <Space size={0}> </Space>;
                  //   },
                  // },
                  actions: {
                    render: (text, row) => [
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        key="view"
                        onClick={() => {
                          console.log('row.path[0]');
                          console.log(row.path);
                          setViewFile(row);
                          const actionParams = {
                            ...generalParams,
                            pageArea: '详情',
                            actionId: `fan_${activeKey}_${row.name}`,
                            actionType: '查询',
                            actionName: '查看技术文档',
                            description: '查看技术文档_' + row.name,
                          };
                          saveUserAction({ params: actionParams }).catch((e) => {});
                        }}
                      >
                        查看
                      </a>,

                      <Button
                        type="text"
                        size="small"
                        style={{ color: '#1890ff' }}
                        loading={submitLoading}
                        onClick={(e) => {
                          onTechnologyFileClick(e, row);
                        }}
                      >
                        下载
                      </Button>,
                    ],
                  },
                }}
              />
              {viewFile == undefined ? null : (
                <FileView
                  url={viewFile.path}
                  filename={viewFile.name}
                  refresh={false}
                  randomNum={Math.random()}
                  defaultScale={0.9}
                />
              )}
            </>
          ),
        }
      : null,
    mxcAuthList.includes('/fan/detail:aerodynamicSketch')
      ? {
          key: '4',
          label: '气动略图',
          //
          children: (
            <>
              <ProList<any>
                onRow={(record: any) => {
                  return {
                    onClick: (e) => {
                      console.log('record');
                      console.log(record);
                      if (record.title.split('.').pop() == 'dwg') {
                        message.info('暂不支持dwg文件预览');
                      } else {
                        setViewFile1(record);
                        const actionParams = {
                          ...generalParams,
                          pageArea: '详情',
                          actionId: `fan_${activeKey}_${record.title}`,
                          actionType: '查询',
                          actionName: '查看气动略图',
                          description: '查看气动略图_' + record.title,
                        };
                        saveUserAction({ params: actionParams }).catch((e) => {});
                      }
                    },
                  };
                }}
                rowKey="title"
                dataSource={fanInfo?.aerodynamicSketch}
                showActions="hover"
                showExtra="hover"
                metas={{
                  title: {
                    dataIndex: 'title',
                  },
                  description: {
                    dataIndex: 'name',
                  },
                  // subTitle: {
                  //   render: () => {
                  //     return <Space size={0}> </Space>;
                  //   },
                  // },
                  actions: {
                    render: (text, row) => [
                      row.title.split('.').pop() == 'dwg' ? null : (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          key="view"
                          onClick={() => {
                            console.log('row');
                            console.log(row);
                            if (row.title.split('.').pop() == 'dwg') {
                              message.info('暂不支持dwg文件预览');
                            } else {
                              setViewFile1(row);
                              const actionParams = {
                                ...generalParams,
                                pageArea: '详情',
                                actionId: `fan_${activeKey}_${row.title}`,
                                actionType: '查询',
                                actionName: '查看气动略图',
                                description: '查看气动略图_' + row.title,
                              };
                              saveUserAction({ params: actionParams }).catch((e) => {});
                            }
                          }}
                        >
                          查看
                        </a>
                      ),
                      <Button
                        type="text"
                        size="small"
                        style={{ color: '#1890ff' }}
                        loading={submitLoading}
                        onClick={(e) => {
                          onClick(e, row);
                        }}
                      >
                        下载
                      </Button>,
                    ],
                  },
                }}
              />
              {viewFile1 == undefined ? null : (
                <FileView
                  url={viewFile1.path}
                  filename={viewFile1.title}
                  refresh={false}
                  randomNum={Math.random()}
                  defaultScale={0.9}
                />
              )}
            </>
          ),
        }
      : null,
    {
      key: '5',
      label: '样本说明',
      children: (
        <>
          {fanInfo?.remark1 ? (
            <>
              <Typography.Title level={5}> 项目备注</Typography.Title>
              {fanInfo?.remark2 ? (
                <>
                  <Typography.Paragraph>{fanInfo?.remark1}</Typography.Paragraph>
                </>
              ) : null}
              <Typography.Title level={5}>客户备注 </Typography.Title>
              <Typography.Paragraph>{fanInfo?.remark2}</Typography.Paragraph>
            </>
          ) : null}
          {fanInfo?.sampleDesc ? (
            <>
              <Typography.Title level={5}>样本说明 </Typography.Title>
              <Typography.Paragraph>{fanInfo?.sampleDesc}</Typography.Paragraph>
            </>
          ) : null}
        </>
      ),
    },
  ];
  if (fanInfo == undefined) return null;
  return (
    <>
      <PageContainer ghost header={{ title: '' }}>
        <Card
          title={
            fanInfo?.category +
            '-' +
            fanInfo?.model +
            '-' +
            fanInfo?.figNum +
            '-' +
            fanInfo?.version
          }
          extra={[
            <Row gutter={16} justify="space-around" align={'middle'}>
              <Col>
                {mxcAuthList.includes('/fan/detail:report') ? (
                  <Button
                    key="primary"
                    type="primary"
                    onClick={(e) => {
                      echartsInstance?.resize({ width: 740, height: 500 });
                      const imgUrl = echartsInstance.getDataURL({
                        // pixelRatio: 1,
                        backgroundColor: '#fff',
                        excludeComponents: ['toolbox'], // 忽略组件的列表，
                      });
                      // console.log('imgUrl');
                      // console.log(imgUrl);
                      history.push(`/fans/report`, {
                        model: fanInfo?.model,
                        id: fanInfo?.id,
                        imgUrl: imgUrl,
                        activeKey: activeKey,
                      });
                      const params = {
                        ...generalParams,
                        pageArea: '详情',
                        actionId: `fan_${activeKey}_${e.target.innerText}`,
                        actionType: '生成',
                        actionName: '生成风机报告',
                        actionModel: fanInfo.model + '-' + fanInfo.figNum + '-' + fanInfo.version,
                        description:
                          '生成风机报告_' +
                          fanInfo.model +
                          '-' +
                          fanInfo.figNum +
                          '-' +
                          fanInfo.version,
                      };
                      saveUserAction({ params }).catch((e) => {});
                    }}
                  >
                    生成报告
                  </Button>
                ) : null}

                {/* <Button type="primary" onClick={()=>{exportPDF('测试导出PDF', this.pdfRef.current)}}> */}
                {/* 导出PDF
              </Button> */}
              </Col>
              <Col>
                <Button
                  onClick={() => {
                    // history.goBack();
                    history.push(`/fan/${activeKey}`);
                  }}
                >
                  <RollbackOutlined style={{ color: 'rgb(24, 144, 255)', fontSize: 24 }} />
                </Button>
              </Col>
            </Row>,
          ]}
          style={{ marginTop: 0 }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <CarouselDetail imgList={imgMain} />
              {/* <div className={styles.carousel}>
                <Carousel
                  style={{ width: 300 }}
                  // dots={styles.dotsColor}
                  autoplay
                  effect="fade"
                  {
                    ...{
                      //   variableWidth: true,
                      // arrows: true,
                      //   autoplay: true,
                      //   speed: 2000,
                      //   autoplaySpeed: 5000,
                      //   cssEase: 'linear',
                    }
                  }
                  arrows={true}
                  prevArrow={<LeftCircleOutlined />}
                  nextArrow={<RightCircleOutlined />}
                >
                  {imgMain?.map((item) => {
                    return (
                      <div key={item}>
                        <Image
                          className={styles.picStyle}
                          // width={300}
                          // height={300}
                          // src={'/api/download/psad/fan/391702/391702-img3d-1.png'}
                          // src={item}+ '?v=' + moment()
                          src={item + '?v=' + moment()}
                          fallback={fallbackImage}
                        />
                      </div>
                    );
                  })}
                </Carousel>
              </div> */}
              <Descriptions
                title="工作参数"
                labelStyle={{ justifyContent: 'flex-end', minWidth: 80 }}
                contentStyle={{ justifyContent: 'flex-start', minWidth: 100 }}
                column={2}
              >
                <Descriptions.Item label="流量">{fanInfo?.flowRate}m³/s</Descriptions.Item>
                <Descriptions.Item label="全压 ">{fanInfo?.fullPressure} Pa</Descriptions.Item>
                <Descriptions.Item label="静压">{fanInfo?.staticPressure}Pa</Descriptions.Item>
                <Descriptions.Item label="转速">
                  {fanInfo?.motorSpeedMin ? fanInfo?.motorSpeedMin + '/' : null}
                  {fanInfo?.motorSpeed}r/min
                </Descriptions.Item>
                <Descriptions.Item label="重量">{fanInfo?.weight}kg</Descriptions.Item>
                <Descriptions.Item label="叶轮直径">
                  {fanInfo?.impellerDiameter}mm
                </Descriptions.Item>
                <Descriptions.Item label="电机功率">{fanInfo?.motorPower}kW</Descriptions.Item>
                <Descriptions.Item label="电源频率">{fanInfo?.powerFrequency}Hz</Descriptions.Item>
                <Descriptions.Item label="电机型号" span={2}>
                  {fanInfo?.motorModel}
                </Descriptions.Item>
                <Descriptions.Item label="额定电流">{fanInfo?.ratedCurrent}A</Descriptions.Item>
                <Descriptions.Item label="额定电压">{fanInfo?.ratedVoltage}V</Descriptions.Item>
              </Descriptions>
              <Descriptions
                title="风机参数"
                labelStyle={{ justifyContent: 'flex-end', minWidth: 80 }}
                contentStyle={{ justifyContent: 'flex-start ', minWidth: 100 }}
                column={2}
              >
                {/* <Descriptions.Item label="单边叶间隙">--</Descriptions.Item>
              <Descriptions.Item label="模拟类型">--</Descriptions.Item>
            <Descriptions.Item label="速度">--</Descriptions.Item> */}
                <Descriptions.Item label="温度">
                  {fanInfo?.temperature == null ? '/' : fanInfo?.temperature}℃
                </Descriptions.Item>
                <Descriptions.Item label="海拔">
                  {fanInfo?.altitude == null ? '/' : fanInfo?.altitude}m
                </Descriptions.Item>
                <Descriptions.Item label="应用车型">
                  {fanInfo?.applicationModelId + '-' + fanInfo?.applicationModel}
                </Descriptions.Item>
                <Descriptions.Item label="冷却对象">{fanInfo?.coolObject}</Descriptions.Item>
                {/* <Descriptions.Item label="风机类型">{fanInfo?.category}</Descriptions.Item> */}
              </Descriptions>
            </Col>
            <Col span={18}>
              <Card>
                <Tabs
                  items={items}
                  onTabClick={(e) => {
                    console.log('click e');
                    console.log(e);
                    if (e == '2' && fanInfo?.outlineFile.length > 0) {
                      const actionParams = {
                        ...generalParams,
                        pageArea: '详情',
                        actionId: `fan_${activeKey}_查看`,
                        actionType: '查询',
                        actionName: '查看外形尺寸图',
                        description:
                          '查看外形尺寸图_' +
                          fanInfo.model +
                          '-' +
                          fanInfo.figNum +
                          '-' +
                          fanInfo.version,
                      };
                      saveUserAction({ params: actionParams }).catch((e) => {});
                    }
                  }}
                ></Tabs>
              </Card>
            </Col>
          </Row>
        </Card>
      </PageContainer>
    </>
  );
};

export default FanDetail;
/**
 *
 */
