import { UploadFile, Card, Tabs, Button, Form, Table, Slider, Row, Col } from 'antd';
import React, { useEffect, useState, useRef, useCallback } from 'react';

import styles from './style.less';

import FileViewer from 'react-file-viewer';

//react预览pdf文件插件
import PDF from 'react-pdf-js';

// https://blog.csdn.net/a82048195/article/details/107681577
// 参数要求
// url api下载路径
// url 二进制文件+filename
const ReportFileView: React.FC<{
  url: any;
  filename: string;
  report?: boolean;
  visible?: boolean;
  refresh?: boolean;
  randomNum: number;
}> = (props) => {
  const { url, filename, report = false, visible, randomNum = 0, refresh = true } = props;

  const [scale, setScale] = useState<number>(1);

  let fileType;
  if (filename != undefined) {
    fileType = filename.split('.').pop();
  }
  // else {
  //   fileType = url.split('.').pop();
  // }
  // console.log('view filename');
  // console.log(filename);
  // console.log('url');
  // console.log(url);

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

  // const directlyRenderPdf = (nums: number, pageOption: any, previewFile: any) => {
  //   const x = [];
  //   for (let i = 2; i <= pageOption.pages; i++)
  //     x.push(<PDF page={i} key={`x${i}`} file={previewFile.file.url} scale={0.61} />);
  //   return x;
  // };
  function directlyRenderPdf(nums: number) {
    const x = [];
    for (let i = 2; i <= pageOption.pages; i++)
      x.push(<PDF page={i} key={`x${i}`} file={url} scale={scale} />);
    return x;
  }

  const onDocumentLoadSuccess = (e) => {
    console.log(e);

    setPageOption({ page: 1, pages: numPages });
  };

  // const [width, setWidth] = useState<number>(1.5);
  // useEffect(() => {
  //   console.log('useEffect');
  //   console.log(document.getElementById('pdfView')?.offsetHeight);
  //   console.log(document.getElementById('pdfView')?.offsetWidth);
  //   console.log(740 / document.getElementById('pdfView')?.offsetWidth);
  //   const width = 740 / document.getElementById('pdfView')?.offsetWidth;
  //   console.log(width);

  //   setWidth(width);
  // }, []);
  return (
    <>
      {fileType == 'pdf' ? (
        <div>
          <div>
            {/*  */}
            <div className={report ? null : styles.filePdf}>
              <div className={report ? null : styles.view}>
                <div id="pdfView">
                  {visible ? (
                    <Row>
                      <Col span="flex">缩放调整：</Col>

                      <Col span={10}>
                        <Slider
                          value={scale}
                          min={0.5}
                          step={0.01}
                          max={2}
                          onAfterChange={(e) => {
                            setScale(e);
                          }}
                        />
                      </Col>
                      <Col span={3}>{scale}倍</Col>
                    </Row>
                  ) : null}
                  <PDF
                    // scale={width}
                    scale={scale}
                    file={url} //文件地址
                    onDocumentComplete={(pages) => {
                      onDocumentComplete(pages);
                    }}
                    page={pageOption.page} //文件页码
                  />
                </div>
                {report
                  ? pageOption.pages
                    ? pageOption.pages > 1 && directlyRenderPdf(pageOption.pages)
                    : null
                  : null}
              </div>
            </div>
            <div className={styles.filePdfFooter}>
              {report ? null : pageOption.page === 1 ? null : (
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    handlePrevious(pageOption);
                  }}
                >
                  上一页
                </Button>
              )}

              {report ? null : (
                <div className={styles.filePdfPage}>
                  <span>第{pageOption.page}页</span>/<span>共{pageOption.pages}页</span>
                </div>
              )}
              {report ? null : pageOption.page === pageOption.pages ? null : (
                <Button
                  size="small"
                  style={{ marginLeft: '10px' }}
                  type="primary"
                  onClick={() => {
                    handleNext(pageOption);
                  }}
                >
                  下一页
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.viewer}>
          {/* style={{ height: window.innerHeight * 0.8 }} */}
          {fileType == 'doc' ? (
            <label>暂不支持doc文件格式预览</label>
          ) : (
            <FileViewer
              // className={styles.viewer}
              fileType={fileType}
              //
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
    </>
  );
};

export default ReportFileView;
