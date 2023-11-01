import { Row, Col, Space, notification } from 'antd';
import { DoubleLeftOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ProForm, {
  ProFormText,
  ProFormCheckbox,
  ProFormSelect,
  ProFormTextArea,
  ProFormDatePicker,
  ProFormUploadDragger,
  ProFormRadio,
  ProFormTreeSelect,
} from '@ant-design/pro-form';
// import type { KnowledgeListItem } from './data.d';
import styles from './style.less';
import { history, useModel } from 'umi';
// import { createKnowledgeData, queryTreeData, removeFile } from './service';
import type { UploadProps } from 'antd';
import proxy from '../../../../config/proxy';

const ExamineCreate: React.FC<{}> = () => {

  const goBack = () => {
    history.push('/standardWork/supervision/query');
  }

  return (
    <>
      <div className={styles.container}>
        <a style={{ fontSize: 13, color: '#1890FF' }} onClick={() => goBack()}><DoubleLeftOutlined />返回</a>
        <div className={styles.title}>专项审核信息录入</div>
        <div style={{ marginTop: 20 }}>
          <ProForm
            layout='horizontal'
            labelCol={{ span:  7}}
            grid={true}
            submitter={{
              render: (props, doms) => {
                return (
                  <Row>
                    <Col span={14} offset={10}>
                      <Space>{doms}</Space>
                    </Col>
                  </Row>
                )
              }
            }}
            rowProps={{
              gutter: [12, 8],
            }}
            // initialValues={{
            //   knowledgeType: '方法类知识',
            //   department: '试验检测工程中心/基础研究与仿真部',
            //   createDate: moment(new Date()).format('YYYY-MM-DD'),
            //   secret: '内部',
            //   category: '轨道交通装备专业知识体系',
            // }}
            // onFinish={async (value) => submitKnowledge(value)}
          >
            <div className={styles.infoTitle}>工艺部录入</div>
            <ProFormText name="number" label="编号" colProps={{ span: 12 }} disabled placeholder='' />
            <ProFormText name="time" label="专项审核名称" colProps={{ span: 12 }} placeholder='' />
            <ProFormSelect
              colProps={{ span: 12 }}
              label="责任单位"
              name="unit"
              placeholder='请选择'
              valueEnum={{
                机车事业部: '机车事业部',
                城轨事业部: '城轨事业部',
              }}
            />
            <ProFormDatePicker name="time" label="整改时间要求" colProps={{ span: 12 }} placeholder='' />
            <ProFormTextArea name="remark" label="审核情况" colProps={{ span: 12 }} placeholder='' />
            <ProFormTextArea name="remark" label="改进措施" colProps={{ span: 12 }} placeholder='' />
            <ProFormUploadDragger name="content" max={1} label="上传附件" colProps={{ span: 12 }}/>

            <div className={styles.infoTitle}>工艺部组织沟通后定输出考核项</div>
            <ProFormText name="department" label="输出考核" colProps={{ span: 12 }} placeholder='' />
            <ProFormText name="department" label="考核分数" colProps={{ span: 12 }} placeholder='' />

            <div className={styles.infoTitle}>各单位反馈整改情况</div>
            <ProFormTextArea name="remark" label="整改完成情况" colProps={{ span: 12 }} placeholder='' />
            <ProFormTextArea name="remark" label="整改措施" colProps={{ span: 12 }} placeholder='' />
            <ProFormTextArea name="remark" label="备注" colProps={{ span: 12 }} placeholder='' />
          </ProForm>
        </div>
      </div>
    </>
  );
};

export default ExamineCreate;
