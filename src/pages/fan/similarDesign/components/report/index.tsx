/*
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2023-02-17 17:27:10
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-26 16:03:31
 */
import React, { Component, useState } from 'react';
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
  UploadProps,
  Upload,
  UploadFile,
  Tooltip,
  Modal,
} from 'antd';
import { exportPDF } from '@/components/ExportPDF';
import { history, useLocation } from 'umi';
import styles from './style.less';
import PerformanceGraph from '@/pages/charts/performanceGraph';
import { fallbackImage } from '../../data.d';
import { RollbackOutlined, UploadOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { excelTableColumns } from '../../edit/components/PerfDataForm/data.d';
import FileView from '@/components/FileView';
import ReportFileView from '@/components/ReportFileView';
import { queryFanData, queryFanPerfOriginData } from '@/pages/fan/selection/service';
import { PerfDataItem } from '@/pages/fan/data';
import { fixNumFunc } from '@/pages/fan/components/utils';
import { exportPage } from '@/components/expoerPage';
import moment from 'moment';
import { saveUserAction } from '@/services/ant-design-pro/api';

import { saveAs } from 'file-saver';
import { exportWord } from 'mhtml-to-word';
import baidu from 'baidu-template-pro';

import { RcFile } from 'antd/es/upload';
import { beforeUploadFile1 } from '@/pages/fan/create/components/FileForm';

// import img1 from '@/assets/img/bg.jpg';
const reportBorder = {
  borderLeft: 'solid',
  borderWidth: '1px',
  borderColor: '#fffffc',
  // borderColor: '#ff0000',
};

function getHtml(dom) {
  let _dom = dom || document;

  var canvass = _dom.querySelectorAll('canvas');
  var imgRepalce = _dom.querySelectorAll('.imgRepalce');
  let imageList = [];
  //canvass echars图表转为图片
  for (let k4 = 0; k4 < canvass.length; k4++) {
    let imageURL = canvass[k4].toDataURL('image/png');
    let img = document.createElement('img');
    img.src = imageURL;
    imageList.push(img.outerHTML);
  }
  //做分页
  //style="page-break-after: always"
  let pages = _dom.querySelectorAll('.result');
  for (let k5 = 0; k5 < pages.length; k5++) {
    pages[k5].setAttribute('style', 'page-break-after: always');
  }
  let result = _dom.outerHTML;
  //result = result.replace(/<colgroup>(.*?)<\/colgroup>/gi, '')
  //result = result.replace(/<canvas (.*?)><\/canvas>/gi, '')
  for (let i = 0; i < imgRepalce.length; i++) {
    result = result.replace(
      imgRepalce[i].outerHTML,
      '<div class="imgRepalce">' + imageList[i] + '</div>',
    );
  }
  result = result.replace(/<img (.*?)>/gi, '<img $1></img>');
  result = result.replace(/<br>/gi, '<br></br>');
  result = result.replace(/<hr>/gi, '<hr></hr>');
  return (
    "<body printmarginleft='72' printmarginright='72' printmargintop='56' printmarginbottom='56'>" +
    result +
    '</body>'
  );
}
function getStyle(notPrint) {
  var str = '<head><meta charset="utf-8"></meta>',
    styles = document.querySelectorAll('style');
  for (var i = 0; i < styles.length; i++) {
    str += styles[i].outerHTML;
  }
  str += '<style>' + (notPrint ? notPrint : '.no-print') + '{display:none;}</style>';
  str += '<style>.results{width:100%!important;} .result .title{width:100%;}</style>';
  str += '<style>table{border-collapse: collapse;table-layout: fixed}</style>';
  str += '<style>table thead tr{ background-color: #f3f4f9;}</style>';
  str +=
    '<style>table td,th{ font-size: 14px;padding: 1px 1px;border-width: 1px;border-style: solid;border-color: #d0d0d0;word-break: keep-all;white-space: nowrap;}</style>';
  str += '<style>h5{font-color: #2fb89e;}</style>';
  str += '</head>';
  return str;
}

//

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
      imgOutline: [''],
      filePath: [''],
      powerFrequency: 0,
      temperature: 0,
      altitude: 0,
    },
    perfData: [],
    similarPerfData: {},
    visible: true,
    previewImage: undefined,
    previewFile: undefined,
    curveChart: '',
    inputRequire: {},
  };
  id?: string;
  model?: string;
  pressureField?: string;
  similarPerfData?: [];
  pdfRef?: React.RefObject<unknown>;
  flowRate?: number;
  pressure?: number;
  similarDesignFactors: {
    impellerDiameter: number;
    motorSpeed: number;
  };
  impellerDiameter?: number;
  impellerDiameterFactors?: number;
  motorSpeedFactors?: number;
  motorSpeed?: number;
  curveFig?: any;
  imgUrl: any;
  // previewImage: any;
  // previewFile: any;
  constructor(props) {
    // console.log('pdf props');
    // console.log(props);
    console.log(' props.children.props.state');
    console.log(props.location.state);
    super(props);

    if (props.location.state == undefined) {
      // history.push('/fan/2');
      window.location.replace('/fan/2');
    } else {
      // var img = new (Image as any)();
      // const imageUrl = props.location.state.curveFig
      // img.src = imageUrl;
      this.pdfRef = React.createRef();
      // this.model = props.match.params.model;
      this.id = props.location.state.id;
      this.model = props.location.state.model;
      this.flowRate = props.location.state.flowRate;
      this.pressure = props.location.state.pressure;
      this.impellerDiameter = props.location.state.impellerDiameter;
      this.similarDesignFactors = props.location.state.similarDesignFactors;
      this.pressureField = props.location.state.pressureField;
      this.motorSpeed = props.location.state.motorSpeed;
      this.similarPerfData = props.location.state.similarPerfData;
      this.curveFig = props.location.state.curveFig;
      // img.src = imageUrl;
      this.imgUrl = props.location.state.imgUrl;
      this.state.inputRequire = props.location.state.inputRequire;
    }
  }

  // 点击导出PDF

  onExportPDF = (fanInfo) => {
    this.setState({ visible: false });
    // exportPDF(this.model + '-报告', this.pdfRef.current);
    message.loading('正在导出，请稍候...');
    // console.log('this.pdfRef.current');
    // console.log('this.pdfRef.current', this.pdfRef.current);

    setTimeout(() => {
      exportPage(this.pdfRef.current, this.model + '-报告', false).then((res) => {
        this.setState({ visible: true });
        setTimeout(() => {
          message.success('导出成功！');
          const actionParams = {
            monitorModule: '风机平台',
            pageUrl: window.location.href,
            pageName: '风机平台',
            pageArea: '相似设计',
            actionModel: fanInfo.model + '-' + fanInfo.figNum + '-' + fanInfo.version,
            actionId: `fan_2_导出PDF`,
            actionType: '导出',
            actionName: '导出风机报告',
            description:
              '导出风机报告_' + fanInfo.model + '-' + fanInfo.figNum + '-' + fanInfo.version,
          };
          saveUserAction({ params: actionParams }).catch((e) => {});
        }, 1000);
      });
    }, 500);
  };
  //基于完全前端html转换成word保留原来显示的样式mhtml-to-word
  // https://blog.csdn.net/qq_40171314/article/details/118638362

  getModelHtml(mhtml: string, style: string) {
    console.log('mhtml', mhtml);
    const mhtmlTemp = mhtml == 'undefined' ? null : mhtml;
    return `

  <!DOCTYPE html>
  <html>
  <head>
  <style>
${style}
  </style>
  </head>
  <body>
    ${mhtmlTemp}

  </body>
  </html>
`;
  }
  onExportWORD = () => {
    this.setState({ visible: false });
    // exportPDF(this.model + '-报告', this.pdfRef.current);
    message.loading('正在导出，请稍候...');
    console.log('this.pdfRef.current');
    console.log('this.pdfRef.current', typeof getHtml(this.pdfRef?.current), this.pdfRef);

    setTimeout(() => {
      exportWord({
        filename: `${this.model} '-报告'`,
        // mhtml: this.getModelHtml(getHtml(this.pdfRef?.current),getStyle()),
        mhtml: baidu.template(this.getModelHtml(getHtml(this.pdfRef?.current), '')),
        style: '',
      });
      // if (getHtml(this.pdfRef?.current)) {
      //   exportWord().then((res) => {
      //     // this.setState({ visible: true });

      //     let html = this.getModelHtml(getHtml(this.pdfRef?.current),getStyle());

      //     let blob = new Blob([html], { type: "application/msword;charset=utf-8" });
      //     saveAs(blob, `${this.model} '-报告'+.doc`);
      setTimeout(() => {
        message.success('导出成功！');
        const actionParams = {
          monitorModule: '风机平台',
          pageUrl: window.location.href,
          pageName: '风机平台',
          pageArea: '相似设计',
          actionModel: null,
          actionId: `fan_2_导出word`,
          actionType: '导出',
          actionName: '导出风机报告word文件',
          description: null,
        };
        saveUserAction({ params: actionParams }).catch((e) => {});
      }, 1000);
      //   });
      // }
    }, 500);
  };

  componentDidMount() {
    if (this.id) {
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
    const { fanInfo } = this.state;
    console.log('this.fanInfo');
    console.log(fanInfo);
    const hideNoise = this.state.perfData.filter((item) => {
      console.log(item);

      return item.noise != undefined ? item : undefined;
    });
    console.log('this.hideNoise');
    console.log(hideNoise);
    const similarColumns: ProColumns<PerfDataItem>[] = [
      {
        title: '流量(m3/s)',
        dataIndex: 'flowRate',
        valueType: 'digit',
        align: 'center',
        width: 110,
        // sorter: (a, b) => {
        //   return Number(a) - Number(b);
        // },

        render: (val: any, record: any, index: number) => {
          if (record.target) {
            return (
              // <Typography.Text strong type="success">
              //   {val}
              // </Typography.Text>
              <h5 style={{ color: '#008000', fontWeight: 'bold', fontSize: 14 }}>{val}</h5>
            );
          } else {
            return val;
          }
        },
      },
      {
        title: '全压(Pa)',
        dataIndex: 'fullPressure',
        valueType: 'digit',
        align: 'center',
        width: 90,
        render: (val: any, record: any, index: number) => {
          if (record.target) {
            return <h5 style={{ color: '#008000', fontWeight: 'bold', fontSize: 14 }}>{val}</h5>;
          } else return val;
        },
      },
      {
        title: '静压(Pa)',
        dataIndex: 'staticPressure',
        valueType: 'digit',
        align: 'center',
        width: 90,
        render: (val: any, record: any, index: number) => {
          if (record.target) {
            return <h5 style={{ color: '#008000', fontWeight: 'bold', fontSize: 14 }}>{val}</h5>;
          } else return val;
        },
      },
      {
        title: '轴功率(kW)',
        dataIndex: 'shaftPower',
        valueType: 'digit',
        align: 'center',
        width: 110,
        render: (val: any, record: any, index: number) => {
          if (record.target) {
            return <h5 style={{ color: '#008000', fontWeight: 'bold', fontSize: 14 }}>{val}</h5>;
          } else return val;
        },
      },
      {
        title: '风机效率(%)',
        dataIndex: 'fanEff',
        valueType: 'digit',
        align: 'center',
        width: 130,
        render: (val: any, record: any, index: number) => {
          if (record.target) {
            return <h5 style={{ color: '#008000', fontWeight: 'bold', fontSize: 14 }}>{val}</h5>;
          } else return val;
        },
      },
      {
        title: '噪音(dB(A))',
        dataIndex: 'noise',
        valueType: 'digit',
        align: 'center',
        width: 110,
        hideInTable: hideNoise.length > 0 ? false : true,
        render: (val: any, record: any, index: number) => {
          if (record.target) {
            return <h5 style={{ color: '#008000', fontWeight: 'bold', fontSize: 14 }}>{val}</h5>;
          } else return val;
        },
      },
    ];
    // console.log('quxian', this.curveFig);
    const columns = [
      ...similarColumns,
      {
        title: '比转速',
        dataIndex: 'specificSpeed',
        valueType: 'digit',
        align: 'center',
        width: 55,
        render: (val: any, record: any, index: number) => {
          if (record.target) {
            return <h5 style={{ color: '#008000', fontWeight: 'bold', fontSize: 14 }}>{val}</h5>;
          } else return val;
        },
      },
      {
        title: '流量系数',
        dataIndex: 'flowCoefficient',
        valueType: 'digit',
        align: 'center',
        width: 95,
        render: (val: any, record: any, index: number) => {
          if (record.target) {
            return <h5 style={{ color: '#008000', fontWeight: 'bold', fontSize: 14 }}>{val}</h5>;
          } else return val;
        },
      },
      {
        title: '压力系数',
        dataIndex: 'pressureCoefficient',
        valueType: 'digit',
        align: 'center',
        width: 95,
        render: (val: any, record: any, index: number) => {
          if (record.target) {
            return <h5 style={{ color: '#008000', fontWeight: 'bold', fontSize: 14 }}>{val}</h5>;
          } else return val;
        },
      },
    ];

    const OnImage = (e) => (
      // console.log("quxian1", e.curve)
      // setTimeout(() => (
      <Image preview={false} width={700} src={e.curve} />
    );

    /**
     * file对象解析为base64位
     */
    const getBase64 = (file: RcFile): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    const handlePreview = async (file: UploadFile) => {
      console.log('handlePreview file');
      console.log(file);

      //针对裁剪后上传的文件和未经裁剪的文件进行改动
      //未裁剪文件有originFileObj

      if (file.url) {
        file.thumbUrl = file.url;
      }
      // console.log('handlePreview file');
      // console.log(file);
      // console.log(file.originFileObj);
      if (file.originFileObj != undefined) {
        console.log('file.originFileObj != undefined');
        file.thumbUrl = await getBase64(file.originFileObj as RcFile);
      } else {
        if (!file.thumbUrl && !file.preview) {
          console.log('!file.thumbUrl && !file.preview');
          file.thumbUrl = await getBase64(file as RcFile);
        }
      }

      this.setState({ previewFile: undefined, previewImage: file.thumbUrl });
      // setPreviewFile(file.thumbUrl || (file.preview as string));
    };
    const title = {
      1: '一',
      2: '二',
      3: '三',
      4: '四',
      5: '五',
      6: '六',
      7: '七',
      8: '八',
      9: '九',
    };
    let index = 0;

    return (
      <Row justify={'center'}>
        <Col>
          <div style={{ background: '#fff', width: 800 }}>
            <div style={{ textAlign: 'end' }}>
              <Card>
                <Row gutter={16} justify="end" align={'bottom'}>
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
                        {fanInfo.model}风机({fanInfo.figNum})相似设计报告
                      </Typography.Title>
                      <br />
                      <div style={reportBorder}>
                        <Typography.Title level={5}>
                          {title[++index]}、相似设计技术要求
                        </Typography.Title>
                        <Card bordered={false}>
                          <Descriptions
                            column={3}
                            labelStyle={{ justifyContent: 'flex-end', minWidth: 60 }}
                            contentStyle={{ justifyContent: 'flex-start', minWidth: 80 }}
                            bordered
                            size="small"
                            title="输入条件:"
                          >
                            <Descriptions.Item label={<Tooltip title=" "> 流量 </Tooltip>}>
                              {this.state.inputRequire?.flowRate
                                ? this.state.inputRequire?.flowRate + 'm/s'
                                : '/'}
                            </Descriptions.Item>
                            <Descriptions.Item
                              label={
                                this.state.inputRequire?.pressureField == 'fullPressure'
                                  ? '全压'
                                  : '静压'
                              }
                            >
                              {this.state.inputRequire?.pressure
                                ? this.state.inputRequire?.pressure +
                                  '(' +
                                  fixNumFunc(
                                    this.state.inputRequire?.pressure -
                                      (this.state.inputRequire?.pressure *
                                        this.state.inputRequire?.min) /
                                        100,
                                    1,
                                  ) +
                                  '~' +
                                  fixNumFunc(
                                    this.state.inputRequire?.pressure +
                                      (this.state.inputRequire?.pressure *
                                        this.state.inputRequire?.max) /
                                        100,
                                    1,
                                  ) +
                                  ')Pa'
                                : '/'}
                            </Descriptions.Item>

                            <Descriptions.Item label="转速 ">
                              {/* {calculation?.specificSpeed} */}
                              {this.state.inputRequire?.motorSpeed
                                ? this.state.inputRequire?.motorSpeed + 'r/min'
                                : '/'}
                            </Descriptions.Item>
                            <Descriptions.Item label="海拔 ">
                              {/* {calculation?.specificSpeed} */}
                              {this.state.inputRequire?.altitude != undefined
                                ? this.state.inputRequire?.altitude + 'm'
                                : '/'}
                            </Descriptions.Item>
                            <Descriptions.Item label="温度 ">
                              {/* {calculation?.specificSpeed} */}
                              {this.state.inputRequire?.temperature
                                ? this.state.inputRequire?.temperature + '℃'
                                : '/'}
                            </Descriptions.Item>
                            <Descriptions.Item label="大气压 ">
                              {/* {calculation?.specificSpeed} */}
                              {this.state.inputRequire?.atmosphericPressure
                                ? this.state.inputRequire?.atmosphericPressure + 'Pa'
                                : '/'}
                            </Descriptions.Item>
                            <Descriptions.Item label="密度 ">
                              {/* {calculation?.specificSpeed} */}
                              {this.state.inputRequire?.atmosphericDensity
                                ? this.state.inputRequire?.atmosphericDensity
                                : '/'}
                            </Descriptions.Item>
                            <Descriptions.Item label="湿度 ">
                              {/* {calculation?.specificSpeed} */}
                              {this.state.inputRequire?.humidity
                                ? this.state.inputRequire?.humidity + '%'
                                : '/'}
                            </Descriptions.Item>
                          </Descriptions>

                          <Descriptions
                            column={3}
                            labelStyle={{ justifyContent: 'flex-end', minWidth: 60 }}
                            contentStyle={{ justifyContent: 'flex-start', minWidth: 60 }}
                            bordered
                            size="small"
                            title="换算到标态:"
                          >
                            <Descriptions.Item label="流量 ">
                              {this.flowRate} m³/s
                            </Descriptions.Item>

                            <Descriptions.Item label="叶轮直径 ">
                              {this.impellerDiameter} mm
                            </Descriptions.Item>
                            <Descriptions.Item label="叶轮直径相似设计系数 ">
                              {fixNumFunc(this.similarDesignFactors?.impellerDiameter, 2)}
                            </Descriptions.Item>
                            <Descriptions.Item
                              label={this.pressureField == 'fullPressure' ? '全压 ' : '静压'}
                            >
                              {this.pressure} Pa
                            </Descriptions.Item>
                            <Descriptions.Item label="转速 ">
                              {this.motorSpeed} r/min
                            </Descriptions.Item>

                            <Descriptions.Item label="转速相似设计系数 ">
                              {fixNumFunc(this.similarDesignFactors?.motorSpeed, 4)}
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      </div>
                    </div>
                    <div style={reportBorder}>
                      {this.state.fanInfo.sampleDesc ? (
                        <>
                          <div style={reportBorder}>
                            <Typography.Title level={5}>
                              {title[++index]}、应用场景
                            </Typography.Title>
                            <Row gutter={16} justify="center">
                              <Col span={23}>
                                <Typography.Paragraph>
                                  {this.state.fanInfo.sampleDesc}
                                </Typography.Paragraph>
                              </Col>
                            </Row>
                          </div>
                          <br />
                        </>
                      ) : null}
                    </div>
                    <div style={reportBorder}>
                      <Typography.Title level={5}>
                        {title[++index]}、原型机工作参数
                      </Typography.Title>
                      <Row gutter={16} justify="center">
                        <Col span={16}>
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
                          <Col span={8}>
                            <Image
                              // width={260}+ '?v=' + moment()
                              preview={false}
                              src={fanInfo?.img3d[0].downloadUrl}
                              fallback={fallbackImage}
                            />
                          </Col>
                        ) : null}
                      </Row>
                    </div>

                    {/* <Divider /> */}
                    <br />

                    <div style={reportBorder}>
                      <Typography.Title level={5}>
                        {' '}
                        {title[++index]}、原型机性能报告
                      </Typography.Title>
                      <div className={styles.cardBody}>
                        <ProTable
                          size="small"
                          search={false}
                          bordered
                          options={false}
                          pagination={false}
                          columns={columns}
                          className={styles.cardBody}
                          rowKey={'key'}
                          // actionRef={standardActionRef}
                          dataSource={this.state.perfData}
                          // cardBordered
                        ></ProTable>
                      </div>
                    </div>
                    <br />

                    <div style={reportBorder}>
                      <Typography.Title level={5}>
                        {title[++index]}、相似设计性能报告（标态）
                      </Typography.Title>

                      {/* <Typography.Text> 相似设计技术要求：</Typography.Text> */}

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
                          rowClassName={(record) => {
                            if (record.target) {
                              return styles.rowStyle;
                            }
                          }}
                          // actionRef={standardActionRef}
                          dataSource={this.similarPerfData}
                          // cardBordered
                        ></ProTable>
                      </div>
                    </div>
                    <br />

                    <br />
                    <div style={reportBorder}>
                      <Typography.Title level={5}>
                        {title[++index]}、原型机外形尺寸图
                      </Typography.Title>
                      {this.state.visible ? (
                        <Row>
                          <Upload
                            maxCount={1}
                            beforeUpload={(file: UploadFile) => {
                              const docTypeList = ['application/pdf'];
                              const imageType = [
                                'image/png',
                                'image/jpg',
                                'image/jpeg',
                                'image/gif',
                              ];
                              console.log('checkType');
                              console.log(file);
                              if (
                                !docTypeList.includes(file.type) &&
                                !imageType.includes(file.type)
                              ) {
                                Modal.error({
                                  title: '文件类型错误，请重新上传',
                                  content: '仅支持.pdf .png .jpg .jpeg .gif 文件',
                                });
                                file.status = 'removed';
                                return Upload.LIST_IGNORE;
                              } else {
                                return file;
                              }
                            }}
                            onChange={async ({ file, fileList }) => {
                              console.log('file');
                              console.log(file);
                              if (file.status == 'removed') {
                                this.setState({ previewFile: undefined, previewImage: undefined });
                              } else {
                                const fileType = file.name.split('.').pop();
                                if (['png', 'jpg', 'jpeg', 'gif'].includes(fileType)) {
                                  console.log('图片预览');

                                  handlePreview(file);
                                } else if (file.url == undefined) {
                                  const url = await getBase64(file.originFileObj as RcFile);
                                  file.url = url;

                                  this.setState({ previewFile: file, previewImage: undefined });
                                  // setPreviewFile(file);
                                } else {
                                  this.setState({ previewFile: file, previewImage: undefined });

                                  // setPreviewFile(file);
                                }
                              }
                            }}
                            onRemove={() => {
                              console.log('onRemove');

                              this.setState({ previewFile: undefined, previewImage: undefined });
                            }}
                          >
                            <Button icon={<UploadOutlined />}>上传外形尺寸图</Button>
                          </Upload>
                        </Row>
                      ) : null}
                      <Row>
                        <Col span={24}>
                          {this.state.previewImage ? (
                            <>
                              <Image
                                // height={300}
                                // src={fanInfo?.img3d[0]}
                                // src={'/api/download/psad/fan/391702/391702-img3d-1.png'}
                                src={this.state.previewImage}
                                fallback={fallbackImage}
                                preview={false}
                              />
                            </>
                          ) : null}
                        </Col>
                      </Row>

                      {this.state.previewFile ? (
                        <ReportFileView
                          filename={this.state.previewFile.name}
                          url={this.state.previewFile.url}
                          refresh={false}
                          randomNum={Math.random()}
                          report={true}
                          visible={this.state.visible}
                        />
                      ) : null}

                      {/* {!(
                        this.state.previewImage == undefined && this.state.previewFile == undefined
                      ) ? null : fanInfo.outlineFile == undefined ||
                        fanInfo.outlineFile.length == 0 ? null : [
                          'png',
                          'jpg',
                          'jpeg',
                          'gif',
                        ].includes(fanInfo?.outlineFile[0].toString().split('.').pop()) ? (
                        <>
                          <Image
                            // width={300}
                            // height={300}
                            preview={false}
                            // src={fanInfo?.img3d[0]}
                            src={fanInfo?.outlineFile[0] + '?v=' + moment()}
                            fallback={fallbackImage}
                          />
                        </>
                      ) : (
                        <>
                          <ReportFileView
                            randomNum={Math.random()}
                            url={fanInfo.outlineFile[0]}
                            report={true}
                            visible={this.state.visible}
                          />
                        </>
                      )} */}
                    </div>
                    <br />
                    <div style={reportBorder}>
                      <Typography.Title level={5}>
                        {' '}
                        {title[++index]}、相似设计性能曲线图
                      </Typography.Title>

                      <div className={styles.cardBody}>
                        <Image width={730} src={this.curveFig} preview={false} />
                      </div>
                      {/* <div className={styles.cardBody}>
                        <Image width={730} src={this.imgUrl} preview={false} />
                      </div> */}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'end' }}>
              <Card>
                <Row gutter={16} justify="end" align={'bottom'}>
                  <Col>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.onExportPDF(fanInfo);
                      }}
                    >
                      导出PDF
                    </Button>
                    &emsp;
                    {/* <Button type="primary" onClick={this.onExportWORD}>
                      导出word
                    </Button> */}
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
