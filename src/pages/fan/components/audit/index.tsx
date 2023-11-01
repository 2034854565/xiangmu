/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-06-26 10:56:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-26 15:24:51
 */
import { history, useLocation, useModel } from 'umi';
import { Divider, Image, notification } from 'antd';

import CarouselDetail from '@/components/CarouselDetail';
import FileView from '@/components/FileView';
import PerformanceGraph from '@/pages/charts/performanceGraph';
import { saveUserAction } from '@/services/ant-design-pro/api';
import { RollbackOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Tabs,
  TabsProps,
  Typography,
  Upload,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { FanDetailItem, fallbackImage } from '../../data.d';
import { queryFanData, queryFanPerfData } from '../../selection/service';
import { downloadFile1 } from '../../service';
import FanDetail from '../detail';
import { fileNameDict } from '../utils';
import { addAuditRecord } from './service';
const { Option } = Select;
const formlayout = {
  labelCol: {
    // span: 'flex'
    span: 5,
  },
  wrapperCol: { span: 18, justify: 'flex' },
  // labelAlign: 'right',span: 16,flex: 16,
};
const AuditDetail: React.FC<{}> = (props) => {
  // console.log('FanDetail props');
  // console.log(props);
  // const { model, activeKey } = props.match.params;
  const location = useLocation(); //获取跳转页面携带的值
  console.log('location.state');
  console.log(location.state);
  if (location?.state?.id == undefined) {
    window.location.replace('/fan/1');
  }
  const { id, activeKey } = location?.state;

  // console.log('id1');
  // console.log(id);
  const { initialState } = useModel('@@initialState');
  const authList = initialState?.currentUser?.authList;

  const mxcAuthList = authList == undefined ? [] : authList;
  const [key, setKey] = useState<string>('1');
  const [fanInfo, setFanInfo] = useState<FanDetailItem>();
  let [perfData, setPerfData] = useState<{}>({});
  const getPerfData = () => {
    // console.log('getPerfData');
    // console.log(perfData);

    return perfData;
  };
  const [imgMain, setImgMain] = useState<string[]>([]);
  const [viewFile, setViewFile] = useState<{ name: string; path: string }>();
  const [viewFile2, setViewFile2] = useState<{ name: string; path: string }>();
  const [viewFile1, setViewFile1] = useState<{ title: string; name: string; path: string }>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>();

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

  // 气动略图下载
  const onClick = (e, record) => {
    console.log(record);
    setSubmitLoading(true);

    // console.log("e", e)
    //需要保存的用户行为信息,包括上传、下载、设计等行为
    const params = {
      ...generalParams,
      pageArea: '审核详情',
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
  // 技术文档下载
  const onTechnologyFileClick = (e, record) => {
    console.log(record);
    setSubmitLoading(true);

    // console.log("e", e)
    //需要保存的用户行为信息,包括上传、下载、设计等行为
    const params = {
      ...generalParams,
      pageArea: '审核详情',
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
  const [form] = Form.useForm();
  const onSubmit = async () => {
    const values = await form.validateFields();
    console.log('values');
    console.log(values);
    values.userId = initialState?.currentUser?.userId;
    values.auditBizId = fanInfo?.id;
    setSubmitLoading(true);
    addAuditRecord(values)
      .then((res) => {
        console.log('res');
        console.log(res);
        if (res.success) {
          const actionParams = {
            ...generalParams,
            actionId: `fan_${5}_审核`,
            pageArea: '审核管理',
            actionType: '审核',
            actionName: '审核风机数据',
            description:
              '审核' + values.result == 'pass'
                ? '通过'
                : '不通过' +
                  '风机数据_' +
                  fanInfo?.model +
                  '-' +
                  fanInfo?.figNum +
                  '-' +
                  fanInfo?.version,
          };
          saveUserAction({ params: actionParams }).catch((e) => {});
          notification.success({
            message: '提交成功！',
          });
          history.push('/fan/' + activeKey);
          // return () => {
          //   setSubmitLoading(false);
          // };
        } else {
          console.log(res.msg);
          notification.error({
            message: `请求错误 ${res.status} `,
            description: res.msg,
          });
        }
        setSubmitLoading(false);
      })
      .catch((error) => {
        message.error('请求失败！');
        return () => {
          setSubmitLoading(false);
        };
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };
  const items: TabsProps['items'] | any = [
    {
      key: '0',
      label: '基本信息',
      children: (
        <>
          {/* <Col span={6}> */}

          <Descriptions
            title="基本信息"
            labelStyle={{ justifyContent: 'flex-end', minWidth: 80 }}
            contentStyle={{ justifyContent: 'flex-start', minWidth: 100 }}
            column={2}
          >
            <Descriptions.Item label="应用车型">
              {fanInfo?.applicationModelId}
              {fanInfo?.applicationModel ? '-' + fanInfo?.applicationModel : ''}
            </Descriptions.Item>
            {/* <Descriptions.Item label="应用车型">
                    {fanInfo?.applicationModel}
                  </Descriptions.Item> */}
            <Descriptions.Item label="冷却对象">{fanInfo?.coolObject}</Descriptions.Item>
            <Descriptions.Item label="风机类型">{fanInfo?.category}</Descriptions.Item>
            <Descriptions.Item label="风机型号">{fanInfo?.model}</Descriptions.Item>
          </Descriptions>

          <Descriptions
            title="铭牌信息"
            labelStyle={{ justifyContent: 'flex-end', minWidth: 80 }}
            contentStyle={{ justifyContent: 'flex-start ', minWidth: 100 }}
            column={2}
          >
            {/* <Descriptions.Item label="单边叶间隙">--</Descriptions.Item>
              <Descriptions.Item label="模拟类型">--</Descriptions.Item>
            <Descriptions.Item label="速度">--</Descriptions.Item> */}
            <Descriptions.Item label="流量">{fanInfo?.flowRate}m³/s</Descriptions.Item>
            <Descriptions.Item label="全压 ">{fanInfo?.fullPressure} Pa</Descriptions.Item>
            <Descriptions.Item label="静压">{fanInfo?.staticPressure}Pa</Descriptions.Item>
            <Descriptions.Item label="效率 ">{fanInfo?.efficiency} %</Descriptions.Item>
            <Descriptions.Item label="轴功率">{fanInfo?.staticPressure}kW</Descriptions.Item>
            <Descriptions.Item label="电机型号" span={2}>
              {fanInfo?.motorModel}
            </Descriptions.Item>
            <Descriptions.Item label="电源频率">{fanInfo?.powerFrequency}Hz</Descriptions.Item>
            <Descriptions.Item label="电机功率">{fanInfo?.motorPower}kW</Descriptions.Item>
            <Descriptions.Item label="电机转速">
              {fanInfo?.motorSpeedMin ? fanInfo?.motorSpeedMin + '/' : null}
              {fanInfo?.motorSpeed}r/min
            </Descriptions.Item>
            <Descriptions.Item label="额定电流">{fanInfo?.ratedCurrent}A</Descriptions.Item>
            <Descriptions.Item label="额定电压">{fanInfo?.ratedVoltage}V</Descriptions.Item>
            <Descriptions.Item label="海拔">
              {fanInfo?.altitude == null ? '/' : fanInfo?.altitude}m
            </Descriptions.Item>
            <Descriptions.Item label="温度">
              {fanInfo?.temperature == null ? '/' : fanInfo?.temperature}℃
            </Descriptions.Item>
            <Descriptions.Item label="湿度 ">{fanInfo?.humidity} %</Descriptions.Item>
          </Descriptions>

          <Descriptions
            labelStyle={{ justifyContent: 'flex-end', minWidth: 80 }}
            contentStyle={{ justifyContent: 'flex-start ', minWidth: 100 }}
            column={2}
          >
            <Descriptions.Item label="叶轮直径">{fanInfo?.impellerDiameter}mm</Descriptions.Item>
            <Descriptions.Item label="重量">{fanInfo?.weight}kg</Descriptions.Item>
            {/* <Descriptions.Item label="备注1(项目名称)">{fanInfo?.remark1}</Descriptions.Item>
            <Descriptions.Item label="备注2(客户)">{fanInfo?.remark2}</Descriptions.Item> */}
          </Descriptions>
          {/* </Col> */}
        </>
      ),
    },
    {
      key: '1',
      label: '性能曲线',
      children: (
        <>
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
            //       const actionParams = {
            //         ...generalParams,
            //         actionId: `fan_${activeKey}_${e.target.innerText}`,
            //         actionType: '查看',
            //         actionName: '查看外形尺寸图_' + e.target.innerText,
            //         description: null,
            //       };
            //       saveUserAction({ params: actionParams }).catch((e) => {});
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
                        pageArea: '审核详情',
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
                  src={fanInfo?.outlineFile[0].viewUrl}
                  fallback={fallbackImage}
                />
              ) : (
                //     viewFile2 == undefined ? null : (
                //   <FileView
                //     url={viewFile2.path}
                //     filename={viewFile2.title}
                //     refresh={false}
                //     randomNum={Math.random()}
                //   />
                // )
                <FileView
                  url={fanInfo?.outlineFile[0].downloadUrl}
                  filename={fanInfo?.outlineFile[0].fileName}
                  refresh={false}
                  randomNum={Math.random()}
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
                      // console.log('record');
                      // console.log(record);
                      setViewFile(record);
                      const actionParams = {
                        ...generalParams,
                        pageArea: '审核详情',
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
                            pageArea: '审核详情',
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
                    onClick: () => {
                      console.log('record');
                      console.log(record);
                      if (record.title.split('.').pop() == 'dwg') {
                        message.info('暂不支持dwg文件预览');
                      } else {
                        setViewFile1(record);
                        const actionParams = {
                          ...generalParams,
                          pageArea: '审核详情',
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
                                pageArea: '审核详情',
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

  return (
    <>
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
                <Col></Col>
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
            <Row gutter={16} justify="center">
              <Col span={16}>
                <Card bordered={false}>
                  <Tabs
                    centered
                    items={items}
                    onTabClick={(e) => {
                      console.log('click e');
                      console.log(e);
                      if (e == '2' && fanInfo?.outlineFile.length > 0) {
                        const actionParams = {
                          ...generalParams,
                          pageArea: '审核详情',
                          actionId: `fan_${activeKey}_${
                            fanInfo?.model + '-' + fanInfo?.figNum + '-' + fanInfo?.version
                          }`,
                          actionType: '查询',
                          actionName: '查看外形尺寸图',
                          description:
                            '查看外形尺寸图_' +
                            fanInfo?.model +
                            '-' +
                            fanInfo?.figNum +
                            '-' +
                            fanInfo?.version,
                        };
                        saveUserAction({ params: actionParams }).catch((e) => {});
                      }
                    }}
                  ></Tabs>
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false}>
                  <Row justify={'center'} style={{ paddingBottom: 24 }}>
                    <Col>
                      <CarouselDetail imgList={imgMain} />
                    </Col>
                  </Row>

                  <Form form={form} {...formlayout}>
                    {/* <Form.Item label="审核人" name="userId">
                      {initialState?.currentUser?.userId}
                    </Form.Item> */}
                    <Form.Item
                      label="审核结果"
                      name="result"
                      rules={[{ required: true, message: '请选择审核结果' }]}
                    >
                      <Select
                        placeholder="请选择审核结果"
                        onChange={(value) => {
                          setResult(value);
                        }}
                      >
                        <Option value={'pass'}>通过</Option>
                        {/* {progress != undefined ? <Option value={0}>打回</Option> : null} */}
                        <Option value={'rejected'}>不通过</Option>
                      </Select>
                      {/* <Radio.Group>
                                    <Radio value={true}>同意</Radio>
                                    <Radio value={false}>不同意</Radio>
                                </Radio.Group> */}
                    </Form.Item>
                    <Form.Item
                      label="审核备注"
                      name="remark"
                      rules={[
                        {
                          required: result == 'rejected',
                          message: '请输入审核备注',
                        },
                      ]}
                    >
                      <TextArea
                        placeholder="(审核不通过的原因说明，字数300字以内)"
                        rows={4}
                        showCount
                        maxLength={300}
                      />
                    </Form.Item>

                    <Row justify={'center'}>
                      <Col span={12}>
                        <Button
                          loading={submitLoading}
                          type="primary"
                          size="large"
                          block
                          htmlType="submit"
                          onClick={onSubmit}
                        >
                          提交
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </Col>
            </Row>
          </Card>
        </PageContainer>
      </>
    </>
  );
};
export default AuditDetail;
