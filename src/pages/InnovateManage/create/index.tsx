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
  ProFormUploadButton,
  ProFormGroup,
} from '@ant-design/pro-form';
// import type { KnowledgeListItem } from './data.d';
import styles from './style.less';
import { history, useModel } from 'umi';
import { getMethodCategory, createMethodData, getConnectCase, getConnetKnowledge, getMethodById } from './service';
import type { UploadProps } from 'antd';
import proxy from '../../../../config/proxy';

const Create: React.FC<{}> = (props) => {

  const { initialState, setInitialState } = useModel('@@initialState');
  const [fileId, setFileId] = useState();
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const { id } = props.location.query;
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (id) {
      getMethodById({ id }).then(res => {
        if (res) {
          formRef?.current?.setFieldsValue(res);
        }
      });
    }
    getMethodCategory().then((res: any) => {
      setCategoryList(res);
    });
  }, []);

  const submit = (value: any) => {
    const params = value;
    const status = id ? '1' : '0';
    if (id) {
      params.id = Number(id);
    }
    console.log(params)
    createMethodData(params, status).then(res => {
      if (res.message === 'OK') {
        notification.success({
          message: '提交成功！',
        });
        history.push('/innovateManage');
      }
    })
  }

  const goBack = () => {
    history.go(-1);
  }

  const uploadProp: UploadProps = {
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
      // if (fileId) {
      //   removeFile({ fileId: fileId }).then(res => {
      //     console.log(res)
      //   })
      // }
    }
  }

  // const getConnectCases = () => {
  //   getConnectCase().then(res => {

  //   });
  // }

  return (
    <>
      <div className={styles.container}>
        <a style={{ fontSize: 13, color: '#1890FF' }} onClick={() => goBack()}><DoubleLeftOutlined />返回</a>
        <div className={styles.title}>创新方法信息采集卡</div>
        <div style={{ marginTop: 20 }}>
          <ProForm
            layout='horizontal'
            labelCol={{ span: 4 }}
            labelWrap={true}
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
            initialValues={{
              department: '试验检测工程中心/基础研究与仿真部',
              createTime: moment(new Date()).format('YYYY-MM-DD'),
            }}
            onFinish={async (value) => submit(value)}
          >
            <ProFormText name="methodNumber" label="编号" colProps={{ span: 12 }} disabled placeholder='' />
            <ProFormGroup>
              <ProFormText
                colProps={{ span: 12 }}
                label="名称"
                name="methodName"
                rules={[{ required: true, message: '请填写方法名称!' }]}
              />
              <ProFormText name="author" label="编写人" colProps={{ span: 12 }} placeholder='' rules={[{ required: true, message: '请填写编写人!' }]} />
              <ProFormRadio.Group
                colProps={{ span: 12 }}
                name="zjUse"
                label="是否株机常用"
                options={[
                  {
                    label: '是',
                    value: '是',
                  },
                  {
                    label: '否',
                    value: '否',
                  },
                ]}
                rules={[{ required: true, message: '请选择是否株机常用!' }]}
              />
              <ProFormText name="department" label="部门" colProps={{ span: 12 }} placeholder='' rules={[{ required: true, message: '请填写部门!' }]} />
              <ProFormRadio.Group
                colProps={{ span: 12 }}
                name="methodType"
                label="类型"
                options={[
                  {
                    label: '轨道交通装备领域',
                    value: '轨道交通装备领域',
                  },
                  {
                    label: '普适性领域',
                    value: '普适性领域',
                  },
                ]}
                rules={[{ required: true, message: '请选择类型!' }]}
              />
              <ProFormDatePicker name="createTime" label="编写日期" colProps={{ span: 12 }} placeholder='' rules={[{ required: true, message: '请填写编写日期!' }]} />
            </ProFormGroup>
            <ProFormGroup>
              <ProFormSelect
                colProps={{ span: 12 }}
                mode="multiple"
                label="方法分类"
                name="methodCategories"
                valueEnum={{
                  设计研发: '设计研发',
                  管理: '管理',
                  工艺制造: '工艺制造',
                }}
              />
            </ProFormGroup>
            <ProFormGroup>
              <ProFormSelect
                colProps={{ span: 12 }}
                mode="multiple"
                label="关联项目案例"
                name="caseNumbers"
                request={async () => getConnectCase()}
              />
            </ProFormGroup>
            <ProFormGroup>
              <ProFormSelect
                colProps={{ span: 12 }}
                mode="multiple"
                label="关联精华知识"
                name="knowledgeNos"
                request={async () => getConnetKnowledge()}
              />
            </ProFormGroup>
            <ProFormTextArea name="theory" label="原理" colProps={{ span: 24 }} labelCol={{ span: 2 }} placeholder='' />
            <ProFormTextArea name="methodContent" label="定义内容" colProps={{ span: 24 }} labelCol={{ span: 2 }} placeholder='' rules={[{ required: true, message: '请填写定义内容!' }]} />
            <div style={{ width: '100%', border: '1px dashed #D7D7D7' }}></div>
            <ProFormGroup title="应用场景">
              {
                categoryList.map(item => {
                  return <ProFormSelect
                    colProps={{ span: 12 }}
                    mode="multiple"
                    label={item.name}
                    name={`${item.labelName}List`}
                    request={async () => {
                      const lists: any[] = [];
                      item.list.map((listItem: any) => {
                        lists.push({
                          label: listItem.realName,
                          value: listItem.realName,
                        })
                      })
                      return lists;
                    }}
                    rules={[{ required: true, message: `请填写${item.name}!` }]}
                  />
                })
              }
            </ProFormGroup>
            <ProFormTextArea name="demand" label="应用要求" colProps={{ span: 12 }} placeholder='' />
            <ProFormUploadButton name="processChart" max={1} label="应用流程框图" colProps={{ span: 12 }} />
            <ProFormTextArea name="processDesc" label="应用流程文字描述 " colProps={{ span: 12 }} placeholder='' rules={[{ required: true, message: '请填写应用流程文字描述!' }]} />

          </ProForm>
        </div>
      </div>
    </>
  );
};

export default Create;
