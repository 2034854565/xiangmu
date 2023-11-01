import {
  UploadFile,
  Card,
  Tabs,
  Button,
  Form,
  Table,
  Row,
  Col,
  Input,
  InputNumber,
  Space,
} from 'antd';
import React, { useEffect, useState, useRef, useCallback } from 'react';

import styles from './style.less';
import { history, Link, useModel } from 'umi';

import ProTable, { ActionType } from '@ant-design/pro-table';
import FileViewer from 'react-file-viewer';

//react预览pdf文件插件
import PDF from 'react-pdf-js';
import moment from 'moment';
import {
  LeftCircleOutlined,
  LeftOutlined,
  MinusOutlined,
  PlusOutlined,
  RightCircleOutlined,
  RightOutlined,
  SearchOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { values } from 'lodash';
import CarouselDetail from '../CarouselDetail';

// https://blog.csdn.net/a82048195/article/details/107681577
// 参数要求
// url api下载路径
// url 二进制文件+filename
const FileView: React.FC<{
  url: any;
  filename?: string;
  isPage?: boolean;
  refresh?: boolean;
  randomNum?: number;
  defaultScale?: number;
}> = (props) => {
  const {
    url,
    filename,
    isPage = false,
    refresh = true,
    randomNum = 0,
    defaultScale = 0.8,
  } = props;
  console.log('url');
  console.log(url);

  let fileType;
  if (filename != undefined) {
    fileType = filename.split('.').pop();
  }
  //  else {
  //   fileType = url.split('.').pop();
  // }
  // console.log('fileType');
  // console.log(fileType);
  const [scale, setScale] = useState<number>(defaultScale);
  const [jumpPage, setJumpPage] = useState<number>(1);

  const [previewFile, setPreviewFile] = useState<any>({
    open: false,
    file: { name: '' },
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [pageOption, setPageOption] = useState<{ page: number; pages: number }>({
    page: 1,
    pages: 1,
  });
  //获取所有页
  const onDocumentComplete = (pages: number) => {
    setPageOption({ page: 1, pages: pages });
  };
  //点击上一页
  const handlePrevious = (pageOption: any) => {
    setPageOption({ page: pageOption.page - 1, pages: pageOption.pages });
  };
  //点击下一页
  const handleNext = (pageOption: any) => {
    setPageOption({ page: pageOption.page + 1, pages: pageOption.pages });
  };
  function directlyRenderPdf(nums: number) {
    const x = [];
    for (let i = 2; i <= pageOption.pages; i++)
      x.push(<PDF page={i} key={`x${i}`} file={url} scale={1} />);
    return x;
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setPageOption({ page: 1, pages: numPages });
  };
  // const randomNum = Math.random();
  return (
    <>
      {fileType == 'pdf' ? (
        <Row justify={'center'} gutter={16}>
          <Col>
            {isPage ? null : (
              <div>
                <div className={styles.filePdfFooter}>
                  {pageOption.page === 1 ? null : (
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        handlePrevious(pageOption);
                        setJumpPage(pageOption.page - 1);
                      }}
                    >
                      上一页
                    </Button>
                  )}
                  <div className={styles.filePdfPage}>
                    <span>第{pageOption.page}页</span>/<span>共{pageOption.pages}页</span>
                  </div>
                  {pageOption.page === pageOption.pages ? null : (
                    <Button
                      size="small"
                      style={{ marginLeft: '10px' }}
                      type="primary"
                      onClick={() => {
                        handleNext(pageOption);
                        setJumpPage(pageOption.page + 1);
                      }}
                    >
                      下一页
                    </Button>
                  )}
                  &nbsp; &nbsp;
                  {pageOption.pages === 1 ? null : (
                    <>
                      <InputNumber
                        size="small"
                        value={jumpPage}
                        onChange={(e) => {
                          console.log(e);
                          setJumpPage(e);
                        }}
                        onStep={(values, info) => {
                          console.log('values');
                          console.log(values);
                          console.log('info');
                          console.log(info);
                          if (info.type == 'down') {
                            let jump = jumpPage - 1;
                            console.log('jump');
                            console.log(jump);
                            setJumpPage(jump);
                          } else if (info.type == 'up') {
                            let jump = jumpPage + 1;
                            setJumpPage(jump);
                          }
                        }}
                      ></InputNumber>
                      <Button
                        size="small"
                        style={{ marginLeft: '10px' }}
                        type="primary"
                        onClick={() => {
                          setPageOption({ page: jumpPage, pages: pageOption.pages });
                        }}
                      >
                        跳转
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </Col>
          {/* <Col span={6}></Col> */}
          <Col style={{ fontSize: 20 }}>
            <Space>
              <ZoomInOutlined
                onClick={(e) => {
                  if (scale < 2) {
                    setScale(scale + 0.1);
                  }
                }}
              />

              <ZoomOutOutlined
                onClick={(e) => {
                  if (scale > 0.5) {
                    setScale(scale - 0.1);
                  }
                }}
              />
            </Space>
          </Col>
          <Col></Col>
        </Row>
      ) : null}
      <Row justify={'center'}>
        <Col span={1}>
          {pageOption.page === 1 ? null : (
            <Button
              style={{ height: '100%', width: '100%' }}
              type="text"
              onClick={() => {
                handlePrevious(pageOption);
                setJumpPage(pageOption.page - 1);
              }}
            >
              <div className={styles.btnRight}>
                <LeftOutlined />
              </div>
            </Button>
          )}
        </Col>
        {fileType == 'pdf' ? (
          <div>
            <div>
              <div>
                <div className={styles.view}>
                  <PDF
                    scale={scale}
                    // + '*' +
                    file={refresh ? url + '?v=' + randomNum : url} //文件地址
                    onDocumentComplete={(pages) => {
                      onDocumentComplete(pages);
                    }}
                    page={pageOption.page} //文件页码
                  />
                </div>
                {isPage
                  ? pageOption.pages
                    ? pageOption.pages > 1 && directlyRenderPdf(pageOption.pages)
                    : null
                  : null}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ height: window.innerHeight * 0.8 }} className={styles.view}>
            {fileType == 'doc' ? (
              <label>暂不支持doc文件格式预览</label>
            ) : (
              <FileViewer
                fileType={fileType}
                filePath={refresh ? url + '?v=' + randomNum : url}
                onError={() => {
                  console.log('error in file-viewer');
                }}
                errorComponent={<label>出现错误</label>}
                unsupportedComponent={(fileType: string) => {
                  if (url == '') return <label>暂无</label>;
                  else if (fileType == 'doc') return <label>暂不支持doc文件格式预览</label>;
                  else if (fileType == 'dwg') return <label>暂不支持dwg文件格式预览</label>;
                  else return <label></label>;
                }}
              />
            )}
          </div>
        )}
        <Col span={1}>
          {pageOption.page === pageOption.pages ? null : (
            <Button
              block
              style={{ height: '100%', width: '100%', color: '#1f1f1f' }}
              type="text"
              onClick={() => {
                handleNext(pageOption);
                setJumpPage(pageOption.page + 1);
              }}
            >
              <div className={styles.btnRight}>
                <RightOutlined />
              </div>
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
};

export default FileView;
