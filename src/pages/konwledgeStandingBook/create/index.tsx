import { Row, Col, Space, notification } from 'antd';
import { DoubleLeftOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
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
import { createKnowledgeData, queryTreeData, removeFile, queryMethodsData, getKnowledgeById } from './service';
import type { UploadProps } from 'antd';
import proxy from '../../../../config/proxy';

const Create: React.FC<{}> = (props) => {

  const { initialState, setInitialState } = useModel('@@initialState');
  const [fileId, setFileId] = useState();
  const { id } = props.location.query;
  const formRef = useRef<ProFormInstance>();


  useEffect(() => {
    if (id) {
      getKnowledgeById({ id }).then(res => {
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
    history.push('/konwledgeStandingBook');
  }

  const uploadProps: UploadProps = {
    // action: `${proxy.dev['/imip/'].target}/imip/file/upload`,
    headers: {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq',
    },
    // beforeUpload(file) {
    //   console.log(file)
    //   uploadAttachment(file.file).then(res => {
    //     console.log(res)
    //   })
    // }
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
        <div className={styles.title}>知识类提炼信息采集卡</div>
        <div style={{ marginTop: 20 }}>
          <ProForm
            layout='horizontal'
            formRef={formRef}
            labelCol={{ span: 5 }}
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
              gutter: [24, 8],
            }}
            initialValues={{
              knowledgeType: '方法类知识',
              department: '试验检测工程中心/基础研究与仿真部',
              createDate: moment(new Date()).format('YYYY-MM-DD'),
              secret: '内部',
              category: '轨道交通装备专业知识体系',
            }}
            onFinish={async (value) => submitKnowledge(value)}
          >
            <ProFormText name="knowledgeNumber" label="知识编号" colProps={{ span: 12 }} disabled placeholder='' />
            <ProFormSelect
              colProps={{ span: 12 }}
              label="知识类型"
              name="knowledgeType"
              placeholder='请选择'
              valueEnum={{
                方法类知识: '方法类知识',
              }}
              rules={[{ required: true, message: '请选择知识类型!' }]}
            />
            <ProFormText
              colProps={{ span: 12 }}
              label="知识名称"
              name="knowledgeName"
              rules={[{ required: true, message: '请填写知识名称!' }]}
            />
            <ProFormText name="versionInfo" label="版本" colProps={{ span: 12 }} placeholder='V1.0' rules={[{ required: true, message: '请填写版本信息!' }]} />
            <ProFormSelect
              colProps={{ span: 12 }}
              mode="multiple"
              label="关键词"
              name="keys"
              placeholder='请选择'
              valueEnum={{
                侧风: '侧风',
                CWC曲线: 'CWC曲线',
                动力学仿真: '动力学仿真',
                TSI认证: 'TSI认证',
              }}
              rules={[{ required: true, message: '请选择关键词!' }]}
            />
            <ProFormText name="author" label="编写人" colProps={{ span: 12 }} placeholder='' rules={[{ required: true, message: '请填写编写人!' }]} />
            <ProFormTextArea name="abstracts" label="摘要" colProps={{ span: 12 }} placeholder='' rules={[{ required: true, message: '请填写摘要!' }]} />
            <ProFormText name="department" label="提交部门" colProps={{ span: 12 }} placeholder='' rules={[{ required: true, message: '请填写提交部门!' }]} />
            <ProFormDatePicker name="createDate" label="编写日期" colProps={{ span: 12 }} placeholder='' rules={[{ required: true, message: '请填写编写日期!' }]} />
            <ProFormSelect
              colProps={{ span: 12 }}
              mode="multiple"
              label="工艺类型"
              name="processTypes"
              valueEnum={{
                压力成型: '压力成型',
                焊接工艺: '焊接工艺',
                机加工工艺: '机加工工艺',
                涂装工艺: '涂装工艺',
                组装工艺: '组装工艺',
                粘接工艺: '粘接工艺',
                电联接工艺: '电联接工艺',
                调试工艺: '调试工艺',
                无损工艺: '无损工艺',
                检修工艺: '检修工艺',
              }}
            />
            <ProFormRadio.Group
              colProps={{ span: 12 }}
              name="validTime"
              label="有效时间"
              options={[
                {
                  label: '1年',
                  value: '1年',
                },
                {
                  label: '5年',
                  value: '5年',
                },
                {
                  label: '10年以上',
                  value: '10年以上',
                },
              ]}
            />
            <ProFormCheckbox.Group
              name="productTypes"
              label="适用产品类型"
              colProps={{ span: 12 }}
              options={['机车', '城轨', '动车组', '工程车', '磁悬浮', '低地板', '其他']}
              rules={[{ required: true, message: '请选择适用产品类型!' }]}
            />
            <ProFormSelect
              colProps={{ span: 12 }}
              mode="multiple"
              label="适用研制阶段"
              name="stages"
              valueEnum={{
                方案策划: '方案策划',
                方案设计: '方案设计',
                技术设计: '技术设计',
                施工设计: '施工设计',
                产品试制: '产品试制',
                设计验证: '设计验证',
                设计确认: '设计确认',
                后期技术支持: '后期技术支持',
              }}
              rules={[{ required: true, message: '请选择适用研制阶段!' }]}
            />
            <ProFormTreeSelect
              colProps={{ span: 12 }}
              // mode="multiple"
              label="适用专业"
              name="knowledgeLevels"
              request={async () => queryTreeData()}
              fieldProps={{
                showArrow: false,
                filterTreeNode: true,
                showSearch: true,
                dropdownMatchSelectWidth: false,
                labelInValue: true,
                autoClearSearchValue: true,
                multiple: true,
                treeCheckable: true,
                treeNodeFilterProp: 'title',
                fieldNames: {
                  label: 'title',
                },
              }}
              rules={[{ required: true, message: '请选择适用专业!' }]}
            />
            <ProFormText name="category" label="分类" colProps={{ span: 12 }} disabled rules={[{ required: true }]} />
            <ProFormText name="secret" label="密级" colProps={{ span: 12 }} disabled rules={[{ required: true }]} />
            {/* <ProFormUploadDragger
              {...props}
              max={1}
              label="上传附件"
              // name="content"
              colProps={{ span: 12 }}
              onChange={(e) => changeFile(e)}
              rules={[{ required: true }]}
            /> */}
            <ProFormSelect
              colProps={{ span: 12 }}
              mode="multiple"
              label='关联方法'
              name='methodNumbers'
              request={async () => queryMethodsData()}
              rules={[{ required: true, message: `请选择关联方法!` }]}
            />
            <ProFormUploadDragger {...uploadProps} name="contentw" max={1} label="上传附件" onChange={(e) => changeFile(e)} colProps={{ span: 12 }} rules={[{ required: true }]} />
          </ProForm>
        </div>
      </div>
    </>
  );
};

export default Create;
