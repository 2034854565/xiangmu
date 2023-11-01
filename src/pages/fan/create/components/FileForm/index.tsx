import CutModal from '@/components/CropImage';
import ProForm, { ProFormList, ProFormSelect, ProFormUploadButton } from '@ant-design/pro-form';
import { Button, Card, Col, message, Modal, notification, Row, Upload, UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';
import React, { useCallback, useState } from 'react';
import { useModel } from 'umi';
import styles from '../../style.less';
import { ProCard } from '@ant-design/pro-card';
import FileView from '@/components/FileView';
import { download, downloadFile } from '@/pages/fan/service';
import { waitTime } from '@/components/utils';
import { fixNumFunc } from '@/pages/fan/components/utils';

export const normFile = (e: { file: File; fileList: UploadFile[] }) => {
  console.log('Upload event:', e);

  // if (Array.isArray(e.fileList)) {
  //   console.log('return e  ');
  //   return e.fileList;
  // }
  // console.log('return e && e.fileList');
  // // setImgFileList(e.fileList);

  return e && e.fileList;
};
export const beforeUploadFile1 = (file: UploadFile) => {
  const docTypeList = [
    // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // 'application/msword',
    'application/pdf',
    // "application/x-zip-compressed",//google ie
    // "application/octet-stream",//firefox 360
    // "application/zip",//opera
    // "application/x-rar-compressed",
    // "application/x-tar"
  ];
  const imageType = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

  console.log('checkType');
  console.log(file);
  if (!docTypeList.includes(file.type) && !imageType.includes(file.type)) {
    Modal.error({
      title: '文件类型错误，请重新上传',
      content: '仅支持.pdf .png .jpg .jpeg .gif 文件',
    });
    file.status = 'removed';
    return Upload.LIST_IGNORE;
  } else {
    // if (file.status != 'removed' && file.status != 'done') {
    //   formData.append('technicalFile', file);
    // }
    return false;
  }
};
const FileForm: React.FC<{
  setKey: Function;
  imgFileList: any;
  setImgFileList: Function;
  buttonVisible: boolean;
  setButtonVisible: Function;
  fanInfo: any;
  setFanInfo: Function;
  id: string;
}> = (props) => {
  const { setKey, imgFileList, setImgFileList, buttonVisible, setButtonVisible, fanInfo, id } =
    props;
  // console.log('fanInfo');
  // console.log(fanInfo);
  // console.log('imgFileList');
  // console.log(imgFileList);
  const [fileId, setFileId] = useState();

  const [modalFile, setModalFile] = useState(''); //存上传的图片数据
  const [visible, setVisible] = useState(false); //设置裁剪框是否可见
  const [imgTitle, setImgTitle] = useState<string>('图片裁剪');
  // const [loading, setLoading] = useState(true);
  // const [imgUrl, setImgUrl] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  //   const [imgFileList, setImgFileList] = useState<UploadFile[][]>([[], [], []]);
  //   const [buttonVisible, setButtonVisible] = useState<boolean>(true);

  const [previewFile, setPreviewFile] = useState<any>({
    open: false,
    file: { name: '' },
  });
  const { initialState } = useModel('@@initialState');

  const [imgSize, setImgSize] = useState<{ width: number; height: number }>({});

  const changeFile = (e: any) => {
    console.log('changeFile e');
    console.log(e);
    if (e.file.status === 'done') {
      if (e.file.response.message === 'OK') {
        const fileId = e.file.response.data.fileId;
        setFileId(fileId);
        notification.success({
          message: '上传成功！',
        });
      } else {
        notification.error({
          message: e.file.response.message,
        });
      }
    } else if (e.file.status === 'removed') {
      // if (fileId) {
      //   removeFile({ fileId: fileId }).then(res => {
      //     console.log(res)
      //   })
      // }
    }
  };
  // let formData = new FormData();

  const beforeUploadDwg = (file: UploadFile) => {
    const docTypeList = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/pdf',
      // "application/x-zip-compressed",//google ie
      // "application/octet-stream",//firefox 360
      // "application/zip",//opera
      // "application/x-rar-compressed",
      // "application/x-tar"
    ];
    console.log('checkType');
    console.log(file);
    if (file.name.split('.').pop() == 'dwg') {
      return false;
    } else if (!docTypeList.includes(file.type)) {
      Modal.error({
        title: '文件类型错误，请重新上传',
        content: '仅支持.doc .docx .pdf文件',
      });
      file.status = 'removed';
      return Upload.LIST_IGNORE;
    } else {
      // if (file.status != 'removed' && file.status != 'done') {
      //   formData.append('technicalFile', file);
      // }
      return false;
    }
  };
  const beforeUploadFile = (file: UploadFile) => {
    const docTypeList = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/pdf',
      // "application/x-zip-compressed",//google ie
      // "application/octet-stream",//firefox 360
      // "application/zip",//opera
      // "application/x-rar-compressed",
      // "application/x-tar"
    ];
    console.log('checkType');
    console.log(file);
    if (!docTypeList.includes(file.type)) {
      Modal.error({
        title: '文件类型错误，请重新上传',
        content: '仅支持.doc .docx .pdf文件',
      });
      file.status = 'removed';
      return Upload.LIST_IGNORE;
    } else {
      // if (file.status != 'removed' && file.status != 'done') {
      //   formData.append('technicalFile', file);
      // }
      return false;
    }
  };

  const beforeUploadImg = async (file: UploadFile, uploadIndex: number) => {
    const imageType = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    if (!imageType.includes(file.type)) {
      Modal.error({
        title: '文件类型错误，请重新上传',
        content: '仅支持.png .jpg .jpeg .gif文件',
      });
      file.status = 'removed';
      return Upload.LIST_IGNORE;
    } // else {
    //   return false;
    // }

    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('图片大小应小于 2MB!');
    //   return false;
    // }
    //同名文件禁止上传

    for (let i = 0; i < imgFileList.length; i++) {
      for (let j = 0; j < imgFileList[i].length; j++) {
        if (imgFileList[i][j].name == file.name) {
          message.error('存在同名图片!');
          onRemove(file, uploadIndex);
          return false;
        }
      }
    }
    await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file as RcFile);
      reader.onload = () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
          const width = image.width;
          const height = image.height;
          // setImgSize({ width: width, height: height});
          console.log('文件像素大小'); //文件像素大小
          console.log(width, height); //文件像素大小
          if (width < 300 || height < 300) {
            message.error('宽高需要均大于300像素');
            reject('图片宽高需要均大于300像素 ');
            // ，小于4000像素  || width > 4000   || height > 4000
          }
          resolve(true);
        };
      };
    });
    // setLoading(true);
    //标记上传图片类型 对应imgFileList
    file.uploadIndex = uploadIndex;
    setModalFile(file); //存入modal中
    // console.log('modalFile');
    // console.log(modalFile);
    setVisible(true); //设置裁剪框为true
    // console.log('beforeUploadImg imgFileList');
    // console.log(imgFileList);

    return false;
  };

  /**
   * base64图片 转图片file对象
   */
  const dataURLtoFile = (cropDataUrl: any, originFile: UploadFile) => {
    let arr = cropDataUrl.split(',');
    // 获取文件类型
    let mime = (arr[0].match(/:(.*?);/) as any)[1];
    // 解码base64字符串
    let bstr = atob(arr[1]);
    let n = bstr.length;
    // 创建一个内容长度的数组，每个元素为对应字符串的Unicode码
    // 数组类型表示一个8位无符号整型数组，创建时内容被初始化为0。
    let u8arr = new Uint8Array(n);
    // UTF-16 编码单元匹配 Unicode 编码单元
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    let file: UploadFile = new File([u8arr], originFile.name, { type: mime });
    file.uid = originFile.uid;
    // file.originFileObj = originFile;
    //预览需要thumbUrl
    file.thumbUrl = cropDataUrl;
    return file;
  };

  const handleCutImage = useCallback((values, originFile, imgFileList) => {
    //不传imgFileList会导致删除文件时imgFileList更新不及时

    const file = dataURLtoFile(values, originFile);
    const isLt2M = file.size / 1024 / 1024;
    let tempImgFileList: UploadFile<any>[][] = [];
    for (let i = 0; i < imgFileList.length; i++) {
      tempImgFileList.push(imgFileList[i]);
    }
    let temp: UploadFile<any>[] = [];
    temp = imgFileList[originFile.uploadIndex];
    temp.push(file);
    if (!(isLt2M < 2)) {
      tempImgFileList[originFile.uploadIndex].pop();
      message.error('图片大小应小于 2MB!');
      setImgTitle('图片大小' + fixNumFunc(isLt2M, 3) + 'MB');
      setImgFileList(tempImgFileList);
      // return false;
    } else {
      setVisible(false);
      imgFileList[originFile.uploadIndex] = temp;
      setImgFileList(tempImgFileList);
      setImgTitle('图片裁剪');
    }
  }, []);

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
    //裁剪文件有thumbUrl

    if (file.url) {
      file.thumbUrl = file.url;
    }
    console.log('handlePreview file');
    console.log(file);
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
    setPreviewImage(file.thumbUrl || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.fileName || file.thumbUrl!.substring(file.thumbUrl!.lastIndexOf('/') + 1),
    );
  };

  const onPreview = async (src: string) => {
    //浏览器打开新窗口查看图片
    // let src = file.thumbUrl as string;
    // if (!src) {
    //   src = await new Promise((resolve) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file.originFileObj as RcFile);
    //     reader.onload = () => resolve(reader.result as string);
    //   });
    // }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const onRemove = (e: UploadFile<any>, uploadIndex: number) => {
    let tempImgFileList: UploadFile<any>[][] = [];
    for (let i = 0; i < imgFileList.length; i++) {
      tempImgFileList[i] = imgFileList[i];
    }
    let temp: UploadFile<any>[] = [];
    tempImgFileList[uploadIndex].forEach((img) => {
      console.log('img');
      console.log(img);

      if (img != e) {
        temp.push(img);
      }
    });
    tempImgFileList[uploadIndex] = temp;
    console.log('tempImgFileList');
    console.log(tempImgFileList);

    setImgFileList(tempImgFileList);
    console.log('onRemove');

    return true;
  };
  const handleChange = (fileList: UploadFile<any>[], uploadIndex: number) => {
    let tempImgFileList: UploadFile<any>[][] = [];
    for (let i = 0; i < imgFileList.length; i++) {
      if (i != uploadIndex) {
        tempImgFileList[i] = imgFileList[i];
      }
    }
    tempImgFileList[uploadIndex] = fileList;
    setImgFileList(tempImgFileList);
  };
  return (
    <>
      <Card className={styles.card} bordered={false}>
        <Row align={'top'} justify="end">
          <Col lg={14} md={12} sm={24}>
            {/*<Row>
               <Col span={23}> */}
            <ProFormUploadButton
              name="img3d"
              max={5}
              label="三维图 "
              labelCol={{ span: 6 }}
              colProps={{ span: 24 }}
              getValueFromEvent={(e) => {
                // normFile(e);
                return imgFileList[1][0];
              }}
              fileList={imgFileList[1]}
              fieldProps={{
                data: { type: 'img3d' },
                beforeUpload: (e) => {
                  beforeUploadImg(e, 1);
                },
                // onChange: (e) => handleChange(e.fileList, 1),
                onPreview: handlePreview,
                onRemove: (e) => onRemove(e, 1),
                listType: 'picture-card',
                // accept: 'image/*',
              }}
            />
            {/*</Col>
               <Col>注意事项：</Col>
            </Row> */}
          </Col>
          {/* <Col span={1}></Col> title="图片要求："*/}
          <Col lg={10} md={12} sm={24}>
            <ProCard style={{ maxWidth: 300, color: '#696969' }} size="small">
              <div>图片要求：</div>
              <div>1.支持.png .jpg .jpeg .gif文件</div>
              <div>2.图片大小应小于 2MB</div>
              <div>3.图片像素宽高均大于300px</div>
              {/* ，小于4000px */}
            </ProCard>
          </Col>
        </Row>

        <Row>
          <Col lg={11} md={12} sm={24}>
            <ProFormUploadButton
              name="aerodynamicSketch"
              max={2}
              label="气动略图"
              colProps={{ span: 12 }}
              tooltip="请上传气动略图.dwg文件或pdf文件"
              listType="text"
              // rules={[
              //   // { required: true, message: '请上传文件' },
              //   () => ({
              //     validator(rule: any, value: UploadFile[]) {
              //       let flag = 0;
              //       if (value == undefined) {
              //         return Promise.reject('请上传.dwg文件!');
              //       }
              //       value.forEach((file) => {
              //         if (file.name.split('.').pop() == 'dwg') {
              //           flag++;
              //         }
              //       });
              //       if (flag == 0) {
              //         return Promise.reject('未上传.dwg文件!');
              //       } else if (flag > 1) {
              //         return Promise.reject('已存在.dwg文件!');
              //       }
              //       return Promise.resolve();
              //     },
              //   }),
              // ]}
              // fileList={fileList}
              getValueFromEvent={(e) => {
                return normFile(e);
              }}
              fieldProps={{
                // listType: 'text',
                beforeUpload: beforeUploadDwg,
                onPreview: async (file) => {
                  console.log('气动略图');
                  console.log(file);
                  console.log(file.name.split('.').pop());

                  if (file.name.split('.').pop() == 'dwg') {
                    message.info('暂不支持dwg文件预览');
                    // await waitTime(200).then(() => {
                    //   if (file.url != undefined) {
                    //     downloadFile(file.url);
                    //   }
                    // });
                  } else {
                    if (file.url == undefined) {
                      const url = await getBase64(file.originFileObj as RcFile);
                      file.url = url;
                    } else {
                      setPreviewFile({ open: true, file: file });
                    }
                  }
                },
              }}
            />
          </Col>
          {/* <Col lg={11} md={12} sm={24}>
            <ProFormUploadButton
              name="imgOutline"
              // max={1}
              label="外形尺寸图"
              colProps={{ span: 12 }}
              getValueFromEvent={(e) => {
                // normFile(e);
                e.data = 'imgOutline';
                return imgFileList[0][0];
              }}
              fileList={imgFileList[0]}
              fieldProps={{
                data: { type: 'imgOutline' },
                beforeUpload: (e) => {
                  beforeUploadImg(e, 0);
                },
                onPreview: handlePreview,
                // onChange: (e) => handleChange(e.fileList, 0),
                onRemove: (e) => onRemove(e, 0),
                listType: 'picture-card',
                accept: 'image/*',
              }}
            />
          </Col> */}
          <Col lg={11} md={12} sm={24}>
            <ProFormUploadButton
              name="outlineFile"
              max={1}
              label="外形尺寸图"
              colProps={{ span: 12 }}
              //rules={[{ required: true, message: '请上传文件' }]}
              // fileList={fileList}
              getValueFromEvent={(e) => {
                return normFile(e);
              }}
              fieldProps={{
                listType: 'text',
                beforeUpload: beforeUploadFile1,
                ////测试用勿删
                // onChange: changeFile,
                // onRemove: (e) => {
                //    移除文件  fileList为[], e.file.status为removed
                //   console.log('onRemove e');
                //   console.log(e);
                //   return true;
                // },
                onPreview: async (file) => {
                  console.log('file');
                  console.log(file);
                  const fileType = file.name.split('.').pop();
                  if (['png', 'jpg', 'jpeg', 'gif'].includes(fileType)) {
                    handlePreview(file);
                  } else if (file)
                    if (file.url == undefined) {
                      const url = await getBase64(file.originFileObj as RcFile);
                      file.url = url;
                      setPreviewFile({ open: true, file: file });
                    } else {
                      setPreviewFile({ open: true, file: file });
                    }
                },
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={11} md={12} sm={24}>
            <ProFormList
              name={['technicalFile']}
              label="技术文档"
              copyIconProps={false}
              // labelCol={{ span: 6 }}
              // creatorButtonProps={{}}
              min={1}
              initialValue={[
                {
                  fileType: 'labReport',
                },
              ]}
              itemContainerRender={(doms) => {
                return <ProForm.Group>{doms}</ProForm.Group>;
              }}
              // alwaysShowItemLabel
            >
              {(f, index, action) => {
                return (
                  <>
                    {/* <ProFormText
                      initialValue={index}
                      name="rowKey"
                      label={`第 ${index + 1} 个附件`}
                    /> */}
                    <ProFormSelect
                      colProps={{ span: 6 }}
                      mode="single"
                      // label="文件类型"
                      name="fileType"
                      labelCol={{ span: 0 }}
                      placeholder="文件类型"
                      // options={['实验报告', '设计说明书'].map((fileType) => ({
                      //   label: fileType,
                      //   value: fileType,
                      // }))}
                      options={[
                        {
                          label: '实验报告',
                          // value: '实验报告',
                          value: 'labReport',
                        },
                        {
                          label: '设计说明书',
                          // value: '设计说明书',
                          value: 'designSpecification',
                        },
                      ]}
                      rules={[{ required: true, message: '请选择文件类型!' }]}
                    />
                    <ProFormUploadButton
                      name="file"
                      // max={1}
                      // label="技术文档"
                      colProps={{ span: 12 }}
                      rules={[{ required: true, message: '请上传文件' }]}
                      // fileList={fileList}
                      getValueFromEvent={(e) => {
                        console.log('getValueFromEvent');
                        console.log(e);
                        return normFile(e);
                      }}
                      fieldProps={{
                        listType: 'text',
                        beforeUpload: beforeUploadFile,
                        onPreview: async (file) => {
                          if (file.url == undefined) {
                            const url = await getBase64(file.originFileObj as RcFile);
                            file.url = url;
                          } else {
                            setPreviewFile({ open: true, file: file });
                          }
                        },
                        onRemove: (e) => {
                          console.log('remove e');
                          console.log(e);
                        },
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '8px',
                        height: 60,
                      }}
                    >
                      {/* <Button
                        type="dashed"
                        key="clear"
                        onClick={() => {
                          action.setCurrentRowData({
                            name: undefined,
                            remark: undefined,
                          });
                        }}
                      >
                        清空
                      </Button> */}
                    </div>
                  </>
                );
              }}
            </ProFormList>
          </Col>
        </Row>
      </Card>
      {/* {buttonVisible ? (
        <Row justify="center" gutter={16}>
          <Button
            type="primary"
            style={{ marginRight: 3 }}
            onClick={() => {
              setKey('2');
            }}
          >
            上一步
          </Button>
          <Col>
            <Button
              type="primary"
              style={{ marginLeft: 3 }}
              onClick={() => {
                setButtonVisible(false);
              }}
            >
              确定
            </Button>
          </Col>
        </Row>
      ) : null} */}
      <Modal
        centered
        open={previewOpen}
        title={previewTitle}
        footer={null}
        width="fit-content"
        onCancel={() => setPreviewOpen(false)}
      >
        <div>
          {/* 点击a标签 打开浏览器新页面查看图片，可去掉 */}
          <a onClick={() => onPreview(previewImage)}>
            <img alt="example" src={previewImage} />
          </a>
        </div>
      </Modal>
      {visible && (
        <CutModal
          visible={visible}
          title={imgTitle}
          uploadedImageFile={modalFile}
          onClose={() => {
            return setVisible(false);
          }}
          // onClose={handleCutImageCancel}
          imgFileList={imgFileList}
          //不传imgFileList会导致删除文件时imgFileList更新不及时
          onSubmit={handleCutImage}
        />
      )}
      <Modal
        width={800}
        // destroyOnClose
        title={'文件预览-' + previewFile.file.name}
        // + previewFile.file.name
        open={previewFile.open}
        onCancel={() => {
          console.log('oncancel');
          // console.log(previewFile.file.url);

          setPreviewFile({ open: false, file: { name: '', type: '' } });
          // console.log(previewFile);
        }}
        footer={null}
      >
        {/* react-file-viewer react-pdf react-pdf-js 均可 
        react-file-viewer及react-pdf引用均报错所以此处用react-pdf-js
        推荐使用react-pdf */}
        {/* {previewFile.file.name.split('.')[1] == 'pdf' ? ( */}
        <FileView
          filename={previewFile.file.name}
          url={previewFile.file.url}
          refresh={false}
          randomNum={Math.random()}
        />
      </Modal>
    </>
  );
};
export default FileForm;
{
  /* <ProFormDependency key="remark" name={['name']}>
                {({ name }) => {
                  if (!name) {
                    return (
                      <span
                        style={{
                          lineHeight: '92px',
                        }}
                      >
                        输入姓名展示
                      </span>
                    );
                  }
                  return <ProFormText name="remark" label="昵称详情" />;
                }}
              </ProFormDependency> */
}
