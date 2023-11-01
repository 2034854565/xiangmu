import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportPage = async (node, title, adds) => {
  // 下载尺寸 a4 纸 比例
  let pdf = new jsPDF('p', 'pt', 'a4');
  const element = document.getElementById(node); // 这个dom元素是要导出pdf的div容器
  const w = node.offsetWidth; // 获得该容器的宽
  const h = node.offsetWidth; // 获得该容器的高
  const { offsetTop } = node; // 获得该容器到文档顶部的距离
  const { offsetLeft } = node; // 获得该容器到文档最左的距离
  const canvas = document.createElement('canvas');
  let abs = 0;
  const winI = document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
  const winO = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）
  if (winO > winI) {
    abs = (winO - winI) / 2; // 获得滚动条长度的一半
  }
  canvas.width = w * 2; // 将画布宽&&高放大两倍
  canvas.height = h * 2;
  const context = canvas.getContext('2d');
  context.scale(2, 2);
  context.translate(-offsetLeft - abs, -offsetTop);
  const pdfCanvas = await html2canvas(node, {
    allowTaint: true,
    scale: 2, // 提升画面质量，但是会增加文件大小
    useCORS: true,
    // background: '#FFFFFF', // 如果指定的div没有设置背景色会默认成黑色,这里是个坑
    // tslint:disable-next-line:no-shadowed-variable
    // eslint-disable-next-line no-shadow
  }).then((canvas) => {
    // 未生成pdf的html页面高度
    let leftHeight = canvas.height;

    const a4Width = 594.28; // 595.28,写小是纸的内容要完全在canvas里
    const a4Height = 841.89; // A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
    // 一页pdf显示html页面生成的canvas高度;
    const a4HeightRef = Math.floor((canvas.width / a4Width) * a4Height);

    // pdf页面偏移
    let position = 0;

    const pageData = canvas.toDataURL('image/jpeg', 1.0);

    let index = 1;
    const canvas1 = document.createElement('canvas');
    let height;
    pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen');

    function createImpl(paramsCanvas) {
      console.log(leftHeight, a4HeightRef);
      if (leftHeight > 0) {
        index += 1;
        let checkCount = 0;
        if (leftHeight > a4HeightRef) {
          let i;
          for (i = position + a4HeightRef; i >= position; i -= 1) {
            let isWrite = true;
            for (let j = 0; j < paramsCanvas.width; j += 1) {
              const c = paramsCanvas.getContext('2d').getImageData(j, i, 1, 1).data;

              if (c[0] !== 0xff || c[1] !== 0xff || c[2] !== 0xff) {
                isWrite = false;
                break;
              }
            }
            if (isWrite) {
              checkCount += 1;
              if (checkCount >= 10) {
                break;
              }
            } else {
              checkCount = 0;
            }
          }
          height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef);
          if (height <= 0) {
            height = a4HeightRef;
          }
        } else {
          height = leftHeight;
        }

        canvas1.width = paramsCanvas.width;
        canvas1.height = height;

        //  console.log(index, 'height:', height, 'pos', position)
        const ctx = canvas1.getContext('2d');
        ctx.drawImage(
          paramsCanvas,
          0,
          position,
          paramsCanvas.width,
          height,
          0,
          0,
          paramsCanvas.width,
          height,
        );

        //  const pageHeight = Math.round((a4Width / canvas.width) * height)
        // pdf.setPageSize(null, pageHeight)
        if (position !== 0) {
          //  console.log("最后的位置", position)
          pdf.addPage();
        }
        if (index === 2) {
          // 有分页的时候，第一页时候，index===2,保证首页不需要有偏移量。而从第二页起，上下偏移16
          pdf.addImage(
            canvas1.toDataURL('image/jpeg', 1.0),
            'JPEG',
            0,
            0,
            a4Width,
            (a4Width / canvas1.width) * height,
          );
        } else {
          pdf.addImage(
            canvas1.toDataURL('image/jpeg', 1.0),
            'JPEG',
            0,
            16,
            a4Width,
            (a4Width / canvas1.width) * height,
          );
        }

        // eslint-disable-next-line no-const-assign
        leftHeight -= height;
        position += height;
        if (leftHeight > 0) {
          // console.log("leftHeight", leftHeight)
          createImpl(paramsCanvas);
        } else {
          // pdf.save(pdfName + '.pdf')
        }
      }
    }

    // 当内容未超过pdf一页显示的范围，无需分页
    if (leftHeight < a4HeightRef) {
      pdf.addImage(pageData, 'JPEG', 0, 0, a4Width, (a4Width / canvas.width) * leftHeight);
    } else {
      try {
        pdf.deletePage(0);
        createImpl(canvas);
      } catch (err) {
        // console.log(err);
      }
    }
  });
  if (adds) {
    pdf.addPage();
  }
  await pdf.save(`${title}.pdf`);
};
