import React, { FC, useCallback, useState, useRef, useEffect } from 'react';
import { Button, message, Modal, Result } from 'antd';
import Cropper from 'react-cropper'; // 引入Cropper
import 'cropperjs/dist/cropper.css'; // 引入Cropper对应的css
import { UploadFile } from 'antd/es/upload';
import { compress, detectImageAutomaticRotation, getOrientation, setImgVertical } from '../utils';
import { title } from '@/pages/fan/selection/data';
//React之上传图片并裁剪(Img-Crop&&react-cropper)
//https://blog.csdn.net/Welkin_qing/article/details/109614327
// https://github.com/fengyuanchen/cropperjs
interface CutProps {
  title?: string;
  visible: boolean;
  uploadedImageFile: any;
  onClose: () => void;
  imgFileList: UploadFile[][];
  onSubmit: (values: string, originFile: any, imgFileList: UploadFile[][]) => void;
}
const CutModal: FC<CutProps> = ({ visible, uploadedImageFile, onClose, imgFileList, onSubmit, title = '图片裁剪' }) => {
  const [src, setSrc] = useState(''); //存原始图片
  // const [cropData, setCropData] = useState(''); //存裁剪后的图片
  // const [cropper, setCropper] = useState<any>(); //获取裁剪后的图片
  const cropperRef = useRef<HTMLImageElement>(null);
  // useEffect(() => {
  //   const fileReader = new FileReader();
  //   fileReader.onload = (e) => {
  //     //拿到传过来的照片
  //     if (e.target) {
  //       const dataURL = e.target.result as string;
  //       setSrc(dataURL);
  //     }
  //   };
  //   fileReader.readAsDataURL(uploadedImageFile);
  // }, [uploadedImageFile]);
  useEffect(() => {
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      //拿到传过来的照片
      if (e.target) {
        try {
          const iosSystem = await detectImageAutomaticRotation();
          if (iosSystem) {
            //做了回正,直接压缩
            const dataURL = e.target.result as string;
            setSrc(dataURL);
          } else {
            //浏览器不自带回正,需要旋转根据旋转方向进行旋转
            const dataURL = e.target.result as string;
            getOrientation(uploadedImageFile).then(async (orientation) => {
              const cesibase64 = await compress(dataURL, 6);
              const base64 = await setImgVertical(cesibase64 as string, orientation);
              // setLoading(false)
              setSrc(base64);
            });
          }
        } catch (e) {
          message.error(e);
        }
      }
    };
    fileReader.readAsDataURL(uploadedImageFile);
  }, [uploadedImageFile]);

  const getCropData = useCallback(() => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      //裁剪的图像后台导出的图像的大小大于原始图像的大小
      //.toDataURL('image/jpeg')
      onSubmit(cropper.getCroppedCanvas().toDataURL(), uploadedImageFile, imgFileList);
    } else {
      message.error('裁剪失败！');
    }
  }, [onSubmit]);

  return (
    <>
      <Modal
        open={visible}
        title={title}
        width={'fit-content'}
        onCancel={onClose}
        onOk={getCropData}
      >
        <Cropper
          src={src}
          // style={{ width: 500 }}
          // className={styles['modal__cropper']}
          initialAspectRatio={0} //定义裁剪框的初始宽高比
          viewMode={1} //裁剪框不能超过画布大小
          guides={true} //网格线
          minCropBoxHeight={300} //最小高度
          minCropBoxWidth={300}
          background={true}
          autoCropArea={1} //定义自动裁剪的大小比
          cropBoxMovable={true} //裁剪框是否移动
          cropBoxResizable={true} //裁剪框大小是否变化
          scalable={false} //是否可以放大
          zoomable={false}
          rotatable={true} //是否可以旋转
          dragMode={'move'} //单击设置为移动图片
          //这个比较重要，单击时，设置裁剪框不可变化
          toggleDragModeOnDblclick={false}
          //这个也比较重要，对于有方向值的图片是否根据方向值旋转
          checkOrientation={false}
          ref={cropperRef}
        />
        {/* <Button type="primary" onClick={getCropData}>
          确定
        </Button> */}
      </Modal>
    </>
  );
};
export default CutModal;
