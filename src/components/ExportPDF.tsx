import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * 导出PDF
 * @param {导出后的文件名} title
 * @param {要导出的dom节点：react使用ref} ele
 */
export const exportPDF = async (title, ele) => {
  console.log('ele');
  console.log(ele);

  // 根据dpi放大，防止图片模糊
  const scale = window.devicePixelRatio > 1 ? window.devicePixelRatio : 2;
  // 下载尺寸 a4 纸 比例
  let pdf = new jsPDF('p', 'pt', 'a4');
  let width = ele.offsetWidth;
  let height = ele.offsetHeight;
  console.log('height', height);
  console.log('aa', width, height, scale);

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  var contentWidth = canvas.width;
  var contentHeight = canvas.height;

  console.log('！！！contentHeight：', contentHeight);
  //一页pdf显示html页面生成的canvas高度;
  var pageHeight = (contentWidth / 592.28) * 841.89;
  //未生成pdf的html页面高度
  var leftHeight = contentHeight;
  console.log('leftHeight', leftHeight);
  //页面偏移
  var position = 0;
  //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
  var imgWidth = 595.28;
  var imgHeight = (592.28 / contentWidth) * contentHeight;
  const pdfCanvas = await html2canvas(ele, {
    useCORS: true,
    canvas,
    scale,
    width,
    height,
    x: 0,
    y: 0,
  });
  const imgDataUrl = pdfCanvas.toDataURL();

  // ------------------------
  // pdf页面偏移
  var a4Width = 595.28;
  var a4Height = 841.89; //A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
  //一页pdf显示html页面生成的canvas高度;
  var a4HeightRef = Math.floor((canvas.width / a4Width) * a4Height);
  var index = 1;
  const canvas1 = document.createElement('canvas');
  let height1;
  pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen');

  function createImpl(canvas) {
    console.log(leftHeight, a4HeightRef);
    if (leftHeight > 0) {
      index++;

      var checkCount = 0;
      if (leftHeight > a4HeightRef) {
        var i = position + a4HeightRef;
        for (i = position + a4HeightRef; i >= position; i--) {
          var isWrite = true;
          for (var j = 0; j < canvas.width; j++) {
            var c = canvas.getContext('2d').getImageData(j, i, 1, 1).data;

            if (c[0] != 0xff || c[1] != 0xff || c[2] != 0xff) {
              isWrite = false;
              break;
            }
          }
          if (isWrite) {
            checkCount++;
            if (checkCount >= 10) {
              break;
            }
          } else {
            checkCount = 0;
          }
        }
        height1 = Math.round(i - position) || Math.min(leftHeight, a4HeightRef);
        if (height1 <= 0) {
          height1 = a4HeightRef;
        }
      } else {
        height1 = leftHeight;
      }

      canvas1.width = canvas.width;
      canvas1.height = height1;

      console.log(index, 'height1:', height1, 'pos', position);

      var ctx = canvas1.getContext('2d');
      ctx.drawImage(canvas, 0, position, canvas.width, height1, 0, 0, canvas.width, height1);

      var pageHeight = Math.round((a4Width / canvas.width) * height1);
      // pdf.setPageSize(null, pageHeight)
      if (position != 0) {
        pdf.addPage();
      }
      pdf.addImage(
        canvas1.toDataURL('image/jpeg', 1.0),
        'JPEG',
        10,
        10,
        a4Width,
        (a4Width / canvas1.width) * height1,
      );
      leftHeight -= height1;
      position += height1;
      if (leftHeight > 0) {
        // setTimeout(createImpl, 500, canvas);
        createImpl(canvas);
      } else {
        pdf.save(title + '.pdf');
      }
    }
  }
  // ------------------------

  if (height > 14400) {
    // 超出jspdf高度限制时
    const ratio = 14400 / height;
    // height = 14400;
    width = width * ratio;
  }

  // 缩放为 a4 大小  pdfpdf.internal.pageSize 获取当前pdf设定的宽高
  height = (height * pdf.internal.pageSize.getWidth()) / width;
  width = pdf.internal.pageSize.getWidth();
  if (leftHeight < pageHeight) {
    console.log('不分页');

    pdf.addImage(imgDataUrl, 'png', 0, 0, imgWidth, imgHeight);
    await pdf.save(`${title}.pdf`);
  } else {
    // 分页
    console.log('分页');

    while (leftHeight > 0) {
      try {
        pdf.deletePage(0);
        // setTimeout(createImpl, 500, canvas);
        createImpl(canvas);
      } catch (err) {
        // console.log(err);
      }
      // pdf.addImage(imgDataUrl, 'png', 0, position, imgWidth, imgHeight);
      // leftHeight -= pageHeight;
      // position -= 841.89;
      // //避免添加空白页
      // if (leftHeight > 0) {
      //   pdf.addPage();
      // }
    }
  }
  // 导出下载
  // await pdf.save(`${title}.pdf`);
};
