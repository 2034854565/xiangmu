import { Row, Col, Space, notification } from 'antd';
import { DoubleLeftOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import moment from 'moment';
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormDatePicker,
  ProFormUploadDragger,
  ProFormGroup
} from '@ant-design/pro-form';
import styles from './style.less';
import { history, useModel } from 'umi';
import { createKnowledgeData, getCaseById, removeFile, queryMethodsData } from './service';
import type { UploadProps } from 'antd';
import proxy from '../../../../config/proxy';

const Create: React.FC<{}> = (props) => {

  const { initialState, setInitialState } = useModel('@@initialState');
  const { id } = props.location.query;
  const [fileId, setFileId] = useState();
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (id) {
      getCaseById({ id }).then(res => {
        if (res) {
          formRef?.current?.setFieldsValue(res);
        }
      });
    }
  }, []);

  const submitKnowledge = (value: any) => {
    const knowledge = value;
    knowledge.submitter = initialState?.currentUser?.name;
    knowledge.submissionTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    knowledge.fileId = fileId;
    const levels: string[] = [];
    knowledge.knowledgeLevels.map((item: any) => {
      levels.push(item.label);
    });
    knowledge.knowledgeLevels = levels;
    delete knowledge.content;
    createKnowledgeData(knowledge).then(res => {
      if (res.message === 'OK') {
        notification.success({
          message: '提交成功！',
        });
        history.push('/konwledgeStandingBook');
      }
    })
  }

  const goBack = () => {
    history.push('/example');
  }

  const uploadProps: UploadProps = {
    action: `${proxy.dev['/imip/'].target}/imip/file/upload`,
    headers: {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
    },
  }

  const changeFile = (e: any) => {
    console.log(e)
    if (e.file.status === 'done') {
      if (e.file.response.message === 'OK') {
        const fileId = e.file.response.data.fileId;
        setFileId(fileId);
        notification.success({
          message: '上传成功！',
        })
      } else {
        notification.error({
          message: e.file.response.message,
        });
      }
    } else if (e.file.status === 'removed') {
      if (fileId) {
        removeFile({ fileId: fileId }).then(res => {
          console.log(res)
        })
      }
    }
  }

  return (
    <>
      <div className={styles.container}>
        <a style={{ fontSize: 13, color: '#1890FF' }} onClick={() => goBack()}><DoubleLeftOutlined />返回</a>
        <div className={styles.title}>项目案例提炼信息采集卡</div>
        <div style={{ marginTop: 20 }}>
          <ProForm
            layout='horizontal'
            labelCol={{ span: 5 }}
            grid={true}
            formRef={formRef}
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
              gutter: [24, 8],
            }}
            onFinish={async (value) => submitKnowledge(value)}
          >
            <ProFormText name="caseNumber" label="编号" colProps={{ span: 12 }} disabled placeholder='' />
            <ProFormGroup>
              <ProFormText
                colProps={{ span: 12 }}
                label="名称"
                name="caseName"
                rules={[{ required: true, message: '请填写知识名称!' }]}
              />
              <ProFormText name="uploader" label="编写人" colProps={{ span: 12 }} placeholder='' rules={[{ required: true, message: '请填写编写人!' }]} />
              <ProFormSelect
                colProps={{ span: 12 }}
                label="重要程度"
                name="important"
                valueEnum={{
                  一般重要: '一般重要',
                  重要: '重要',
                  非常重要: '非常重要',
                }}
                rules={[{ required: true }]}
              />
              <ProFormText name="uploadDepartment" label="部门" colProps={{ span: 12 }} placeholder='' rules={[{ required: true, message: '请填写部门!' }]} />
              <ProFormTextArea name="background" label="案例背景" colProps={{ span: 12 }} placeholder='' rules={[{ required: true, message: '请填写定义内容!' }]} />
              <ProFormDatePicker name="uploadTime" label="编写日期" colProps={{ span: 12 }} placeholder='' rules={[{ required: true, message: '请填写编写日期!' }]} />
              <ProFormTextArea name="caseContent" label="内容摘要" colProps={{ span: 12 }} placeholder='' rules={[{ required: true, message: '请填写定义内容!' }]} />
              <ProFormSelect
                colProps={{ span: 12 }}
                mode="multiple"
                label='关联方法'
                name='methodNumbers'
                request={async () => queryMethodsData()}
                rules={[{ required: true, message: `请选择关联方法!` }]}
              />
            </ProFormGroup>
            <ProFormUploadDragger {...uploadProps} name="content" max={1} label="上传附件" onChange={(e) => changeFile(e)} colProps={{ span: 12 }} rules={[{ required: true }]} />
          </ProForm>
        </div>
      </div>
    </>
  );
};

export default Create;
