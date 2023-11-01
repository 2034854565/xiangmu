import React, { Component } from 'react';
import { Button } from 'antd';
import { exportPDF } from '@/components/ExportPDF';
// import img1 from '@/assets/img/bg.jpg';

/**
 * 文章
 */
class Article extends Component {
  constructor(props) {
    console.log('pdf props');
    console.log(props);
    super(props);
    this.pdfRef = React.createRef();
  }

  // 点击导出PDF
  onExportPDF = () => {
    exportPDF('测试导出PDF', this.pdfRef.current);
  };

  render() {
    return (
      <div className="main-container" style={{ background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.onExportPDF}>
            导出PDF
          </Button>
        </div>
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
          {/* <img src={img1} alt="" style={{ width: '100%' }} /> */}
          <h2>我是pdf</h2>
          介绍了轴承故障声学信号的产生机理，根据信号采集的方式和轨旁信号的特点概括了声学诊断的优缺点并阐述了声学诊断技术发展的难点，从时域分析、
          频域分析和时频分析方面总结了声学信号的分析方法。最后从我国近年来的研究现状总结出该技术的发展趋势和未来应当突破的技术难点
          <div></div>
        </div>
      </div>
    );
  }
}

export default Article;
