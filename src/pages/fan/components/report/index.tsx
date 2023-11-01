/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-02-17 17:27:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-26 16:24:52
 */
import React, { Component, useRef } from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Image,
  Descriptions,
  Tabs,
  Divider,
  message,
  Typography,
} from 'antd';
import { exportPDF } from '@/components/ExportPDF';
import { history, useLocation } from 'umi';
import styles from './style.less';
import PerformanceGraph from '@/pages/charts/performanceGraph';
import { fallbackImage, PerfDataItem } from '../../data.d';
import { RollbackOutlined } from '@ant-design/icons';
import { queryFanData, queryFanPerfOriginData } from '../../selection/service';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { excelTableColumns } from '../../edit/components/PerfDataForm/data.d';
import FileView from '@/components/FileView';
import ReportFileView from '@/components/ReportFileView';
import moment from 'moment';
import { exportPage } from '@/components/expoerPage';
import { saveUserAction } from '@/services/ant-design-pro/api';

// import img1 from '@/assets/img/bg.jpg';
const reportBorder = {
  borderLeft: 'solid',
  borderWidth: '1px',
  borderColor: '#fffffc',
  // borderColor: '#ff0000',
};
class FanReport extends Component {
  state = {
    fanInfo: {
      id: '',
      model: '',
      figNum: '',
      flowRate: 0,
      fullPressure: '',
      staticPressure: 0,
      motorPower: 0,
      motorSpeed: 0,
      weight: 0,
      efficiency: 0,
      workFrequency: 0,
      shaftPower: 0,
      impellerDiameter: 0,
      ratedVoltage: 0,
      ratedCurrent: 0,
      img3d: ['', ''],
      imgOutline: [{}],
      filePath: [''],
      powerFrequency: 0,
      temperature: 0,
      altitude: 0,
    },
    perfData: [],
    similarPerfData: {},
    visible: true,
  };
  id: string;
  model: string;
  pdfRef: React.RefObject<unknown>;
  listHeight: React.RefObject<unknown>;
  imgUrl: any;
  activeKey: any;

  constructor(props) {
    // console.log('pdf props');
    // console.log(props);
    // console.log(' props.children.props.state');
    // console.log(props.location.state);
    super(props);
    this.pdfRef = React.createRef();
    // this.model = props.match.params.model;
    if (props.location.state == undefined) {
      // history.push('/fan/2');
      window.location.replace('/fan/1');
    } else {
      this.id = props.location.state.id;
      this.model = props.location.state.model;
      this.imgUrl = props.location.state.imgUrl;
      this.activeKey = props.location.state.activeKey;
    }
  }
  // 点击导出PDF
  onExportPDF = async (fanInfo) => {
    this.setState({ visible: false });
    // exportPDF(this.model + '-报告', this.pdfRef.current);
    message.loading('正在导出，请稍候...');
    // console.log('this.pdfRef.current');
    // console.log(this.pdfRef.current);

    setTimeout(() => {
      exportPage(this.pdfRef.current, this.model + '-报告', false).then((res) => {
        this.setState({ visible: true });
        setTimeout(() => {
          message.success('导出成功！');

          const actionParams = {
            monitorModule: '风机平台',
            pageUrl: window.location.href,
            pageName: '风机平台',
            pageArea: '详情',
            actionType: '导出',
            actionName: '导出风机报告',
            actionModel: fanInfo.model + '-' + fanInfo.figNum + '-' + fanInfo.version,
            actionId: `fan_${this.activeKey}_导出PDF`,
            description:
              '导出风机报告_' + fanInfo.model + '-' + fanInfo.figNum + '-' + fanInfo.version,
          };
          saveUserAction({ params: actionParams }).catch((e) => {});
        }, 1000);
      });
    }, 500);
  };
  componentDidMount() {
    if (this.model) {
      queryFanData(this.id)
        .then((res) => {
          this.setState({ fanInfo: res.data });
        })
        .catch((error) => {
          message.error('请求失败！');
          return;
        });
      queryFanPerfOriginData(this.id)
        .then((res) => {
          console.log('res.data');
          console.log(res.data);
          this.setState({ perfData: res.data });
        })
        .catch((error) => {
          console.log(error);

          message.error('请求失败！');
          return;
        });
    }
  }

  render() {
    // console.log('this.hideNoise');
    // console.log(this.hideNoise);
    const hideNoise = this.state.perfData.filter((item) => {
      console.log(item);

      return item.noise != undefined ? item : undefined;
    });
    console.log('this.hideNoise');
    console.log(hideNoise);
    // console.log('this');
    // console.log(this);
    const { fanInfo, perfData } = this.state;
    console.log('perfData');
    console.log(perfData);
    const similarColumns: ProColumns<PerfDataItem>[] = [
      {
        title: '工况点',
        dataIndex: 'index',
        valueType: 'digit',
        width: 80,
        render: (text, record, index) => {
          // const result = (pageOption.current - 1) * pageOption.pageSize + (index + 1);
          return ++index;
        },
      },
      {
        title: '流量(m3/s)',
        dataIndex: 'flowRate',
        valueType: 'digit',
        width: 110,
        // render: (val: any, record: any) => {
        //   return <Typography.Text type="success">{val}</Typography.Text>;
        // },
      },
      {
        title: '全压(Pa)',
        dataIndex: 'fullPressure',
        valueType: 'digit',
        width: 90,
      },
      {
        title: '静压(Pa)',
        dataIndex: 'staticPressure',
        valueType: 'digit',
        width: 90,
      },
      {
        title: '轴功率(kW)',
        dataIndex: 'shaftPower',
        valueType: 'digit',
        width: 120,
      },
      {
        title: '风机效率(%)',
        dataIndex: 'fanEff',
        valueType: 'digit',
        width: 120,
      },
      {
        title: '噪音(dB(A))',
        dataIndex: 'noise',
        valueType: 'digit',
        width: 120,
        hideInTable: hideNoise.length == 0 ? true : false,
      },
      {
        title: '比转速',
        dataIndex: 'specificSpeed',
        valueType: 'digit',
        width: 60,
      },
      {
        title: '流量系数',
        dataIndex: 'flowCoefficient',
        valueType: 'digit',
        width: 95,
      },
      {
        title: '压力系数',
        dataIndex: 'pressureCoefficient',
        valueType: 'digit',
        width: 95,
      },
    ];

    // let title = [];
    // for (let key in excelTableColumns) {
    //   title.push(key.toString());
    // }
    // // console.log(title);
    // for (let i = 0; i < title.length; i++) {
    //   if (
    //     ['specificSpeed', 'u', 'flowCoefficient', 'pressureCoefficient'].includes(
    //       excelTableColumns[title[i]],
    //     )
    //   ) {
    //     continue;
    //   }

    //   if (
    //     ['flowRate', 'fullPressure', 'staticPressure', 'shaftPower', 'impellerDiameter'].includes(
    //       excelTableColumns[title[i]],
    //     )
    //   ) {
    //     similarColumns.push({
    //       title: excelTableColumns[title[i]] == 'fullPressure' ? '全压' : title[i],
    //       dataIndex: excelTableColumns[title[i]],
    //       valueType: 'digit',
    //       width: 100,
    //       render: (val: any, record: any) => {
    //         return <Typography.Text type="success">{val}</Typography.Text>;
    //       },
    //     });
    //   } else {
    //     similarColumns.push({
    //       title: title[i],
    //       dataIndex: excelTableColumns[title[i]],
    //       valueType: 'digit',
    //       width: 80,
    //     });
    //   }
    // }

    console.log(document.getElementById('part3'));
    return (
      <Row justify={'center'}>
        <Col>
          <div style={{ width: 800, background: '#fff' }}>
            <div style={{ textAlign: 'end' }}>
              <Card>
                <Row gutter={16} justify="end" align={'bottom'}>
                  {/* <Col>
                    <Button
                      onClick={() => {
                        this.setState({ visible: true });
                      }}
                    >
                      返回调整
                    </Button>
                  </Col> */}
                  {/* <Col>
                    <Button type="primary" onClick={this.onExportPDF}>
                      导出PDF
                    </Button>
                  </Col> */}
                  <Col>
                    <Button
                      onClick={() => {
                        history.goBack();
                      }}
                    >
                      <RollbackOutlined style={{ color: 'rgb(24, 144, 255)', fontSize: 24 }} />
                    </Button>
                  </Col>
                </Row>
              </Card>
            </div>
            <div style={{ borderWidth: '1px' }}>
              <div
                ref={this.pdfRef}
                style={{
                  width: 800,
                  padding: 30,
                  boxSizing: 'border-box',
                  margin: '0 auto',
                  lineHeight: '30px',
                  fontSize: 14,
                }}
              >
                {fanInfo.model == undefined ? null : (
                  <>
                    <div style={reportBorder}>
                      <Typography.Title level={3}>
                        {fanInfo.model}风机({fanInfo.figNum})基本参数报告
                      </Typography.Title>
                      <br />

                      <Typography.Title level={5}>一、工作参数</Typography.Title>
                      {/* <Typography.Text>一、工作参数</Typography.Text> */}
                      <Row gutter={16}>
                        <Col span={14}>
                          <Descriptions
                            column={2}
                            labelStyle={{ justifyContent: 'flex-end', minWidth: 60 }}
                            contentStyle={{ justifyContent: 'flex-start', minWidth: 60 }}
                            bordered
                            size="small"
                          >
                            <Descriptions.Item label="流量 ">
                              {fanInfo?.flowRate} m³/s
                            </Descriptions.Item>
                            <Descriptions.Item label="重量 ">
                              {fanInfo?.weight} kg
                            </Descriptions.Item>

                            <Descriptions.Item label="全压 ">
                              {fanInfo?.fullPressure} Pa
                            </Descriptions.Item>
                            <Descriptions.Item label="静压 ">
                              {fanInfo?.staticPressure} Pa
                            </Descriptions.Item>
                            <Descriptions.Item label="叶轮直径 ">
                              {fanInfo?.impellerDiameter} mm
                            </Descriptions.Item>
                            <Descriptions.Item label="转速 ">
                              {fanInfo?.motorSpeed} r/min
                            </Descriptions.Item>
                            <Descriptions.Item label="电机功率 ">
                              {fanInfo?.motorPower} kW
                            </Descriptions.Item>
                            <Descriptions.Item label="电源频率">
                              {fanInfo?.powerFrequency}Hz
                            </Descriptions.Item>

                            <Descriptions.Item label="工作电流">
                              {fanInfo?.ratedCurrent}A
                            </Descriptions.Item>

                            <Descriptions.Item label="工作电压 ">
                              {fanInfo?.ratedVoltage} V
                            </Descriptions.Item>
                            {/* <Descriptions.Item label="工作频率 ">
                        {fanInfo?.powerFrequency} Hz
                      </Descriptions.Item> */}

                            {/* <Descriptions.Item label="单边叶间隙">--</Descriptions.Item>
                      <Descriptions.Item label="模拟类型">--</Descriptions.Item>
                      <Descriptions.Item label="速度">--</Descriptions.Item> */}
                            <Descriptions.Item label="温度">
                              {fanInfo?.temperature == undefined ? '-' : fanInfo?.temperature} ℃
                            </Descriptions.Item>
                            <Descriptions.Item label="海拔">
                              {fanInfo?.altitude == undefined ? '-' : fanInfo?.altitude} m
                            </Descriptions.Item>
                          </Descriptions>
                        </Col>
                        {fanInfo?.img3d[0] ? (
                          <Col span={10}>
                            <Image
                              width={315}
                              preview={false}
                              src={fanInfo?.img3d[0].downloadUrl}
                              // src={proxy.dev['/api/'].target + fanInfo?.img3d}+ '?v=' + moment()
                              fallback={fallbackImage}
                            />
                          </Col>
                        ) : null}
                      </Row>
                      {/* <Divider /> */}
                    </div>
                    <br />
                    <div style={reportBorder}>
                      <Typography.Title level={5}>二、性能报告</Typography.Title>
                      <div className={styles.cardBody}>
                        <ProTable
                          size="small"
                          bordered
                          search={false}
                          options={false}
                          pagination={false}
                          columns={similarColumns}
                          className={styles.cardBody}
                          rowKey={'key'}
                          // actionRef={standardActionRef}
                          dataSource={this.state.perfData}
                          // cardBordered
                        ></ProTable>
                      </div>
                    </div>
                    <br />
                    {fanInfo.outlineFile == undefined || fanInfo.outlineFile.length == 0 ? null : [
                        'png',
                        'jpg',
                        'jpeg',
                        'gif',
                      ].includes(fanInfo?.outlineFile[0].fileType) ? (
                      <>
                        <div style={reportBorder}>
                          <Typography.Title level={5}>三、外形尺寸图</Typography.Title>
                          <Row justify={'center'}>
                            <Col span={24}>
                              <Image
                                width={740}
                                // height={350}
                                preview={false}
                                // src={fanInfo?.img3d[0]}+ '?v=' + moment()
                                src={fanInfo?.outlineFile[0].downloadUrl}
                                fallback={fallbackImage}
                                id="img"
                              />
                            </Col>
                          </Row>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* <div style={reportBorder}></div> */}
                        <Typography.Title level={5}>三、外形尺寸图</Typography.Title>
                        <Row justify={'center'}>
                          <Col span={24}>
                            <ReportFileView
                              url={fanInfo.outlineFile[0].downloadUrl}
                              filename={fanInfo.outlineFile[0].fileName}
                              randomNum={Math.random()}
                              report={true}
                              visible={this.state.visible}
                            />
                          </Col>
                        </Row>
                      </>
                    )}
                  </>
                )}

                <br />
                <div style={reportBorder}>
                  <Typography.Title level={5}>
                    {fanInfo.outlineFile == undefined || fanInfo.outlineFile.length == 0
                      ? '三'
                      : '四'}
                    、相似设计性能曲线图
                  </Typography.Title>

                  <div className={styles.cardBody}>
                    <Image src={this.imgUrl} preview={false} />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'end' }}>
              <Card>
                <Row gutter={16} justify="end" align={'bottom'}>
                  {/* <Col>
                    <Button
                      onClick={() => {
                        this.setState({ visible: true });
                      }}
                    >
                      返回调整
                    </Button>
                  </Col> */}
                  <Col>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.onExportPDF(fanInfo);
                      }}
                    >
                      导出PDF
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      onClick={() => {
                        history.goBack();
                      }}
                    >
                      <RollbackOutlined style={{ color: 'rgb(24, 144, 255)', fontSize: 24 }} />
                    </Button>
                  </Col>
                </Row>
              </Card>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default FanReport;
