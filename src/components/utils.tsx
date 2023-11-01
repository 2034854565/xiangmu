//图片转base64位
export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  return new Promise(function (resolve) {
    reader.addEventListener('load', () => callback(resolve(reader.result)));
  });
}
const testAutoOrientationImageURL =
  'data:image/jpeg;base64,/9j/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAYAAAA' +
  'AAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA' +
  'QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE' +
  'BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/AABEIAAEAAgMBEQACEQEDEQH/x' +
  'ABKAAEAAAAAAAAAAAAAAAAAAAALEAEAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAA' +
  'AAAAAEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8H//2Q==';
let isImageAutomaticRotation: any;

export function detectImageAutomaticRotation() {
  return new Promise((resolve) => {
    if (isImageAutomaticRotation === undefined) {
      const img = new Image();

      img.onload = () => {
        // 如果图片变成 1x2，说明浏览器对图片进行了回正
        isImageAutomaticRotation = img.width === 1 && img.height === 2;

        resolve(isImageAutomaticRotation);
      };

      img.src = testAutoOrientationImageURL;
    } else {
      resolve(isImageAutomaticRotation);
    }
  });
}
import { message } from 'antd';
import EXIF from 'exif-js';
export const getOrientation = (file: any): Promise<number> => {
  return new Promise((resolve, reject) => {
    EXIF.getData(file, function () {
      try {
        EXIF.getAllTags(file);
        const orientation = EXIF.getTag(file, 'Orientation');
        resolve(orientation);
      } catch (e) {
        reject(e);
      }
    });
  });
};
export function compress(
  base64, // 源图片
  rate, // 缩放比例
) {
  return new Promise((resolve) => {
    //处理缩放，转格式
    var _img = new Image();
    _img.src = base64;
    _img.onload = function () {
      var _canvas = document.createElement('canvas');
      var w = this.width / rate;
      var h = this.height / rate;
      _canvas.setAttribute('width', w);
      _canvas.setAttribute('height', h);
      _canvas.getContext('2d').drawImage(this, 0, 0, w, h);
      var base64 = _canvas.toDataURL('image/jpeg');
      _canvas.toBlob(function (blob) {
        if (blob.size > 750 * 1334) {
          //如果还大，继续压缩
          compress(base64, rate);
        } else {
          resolve(base64);
        }
      }, 'image/jpeg');
    };
  });
}
export const setImgVertical = (imgSrc: string, orientation: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (!imgSrc) return;
    const type = imgSrc.split(';')[0].split(':')[0];
    const encoderOptions = 1;
    image.src = imgSrc;
    image.onload = function (): void {
      const imgWidth = (this as any).width;
      const imgHeight = (this as any).height;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      if (orientation && orientation !== 1) {
        switch (orientation) {
          case 6:
            canvas.width = imgHeight;
            canvas.height = imgWidth;
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(this as any, 0, -imgHeight, imgWidth, imgHeight);
            break;
          case 3:
            ctx.rotate(Math.PI);
            ctx.drawImage(this as any, -imgWidth, -imgHeight, imgWidth, imgHeight);
            break;
          case 8:
            canvas.width = imgHeight;
            canvas.height = imgWidth;
            ctx.rotate((3 * Math.PI) / 2);
            ctx.drawImage(this as any, -imgWidth, 0, imgWidth, imgHeight);
            break;
        }
      } else {
        ctx.drawImage(this as any, 0, 0, imgWidth, imgHeight);
      }
      resolve(canvas.toDataURL(type, 0.92));
    };
    image.onerror = (e): void => reject(e);
  });
};

export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      message.loading('加载中...');
      resolve(true);
    }, time);
  });
};
// function isEmail(strEmail: string) {
//   if (
//     strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1
//   )
//     return true;
//   else return false;
// }
export function isEmail(str: string) {
  var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  return reg.test(str);
}
export function isPhone(telephone: string) {
  var reg = /^[1][3,4,5,6,7,8][0-9]{9}$/;

  // var reg = /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])\d{8}$/;
  if (!reg.test(telephone)) {
    return false;
  } else {
    return true;
  }
}
