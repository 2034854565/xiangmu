import { Row, Col, Space, notification } from 'antd';
import { DoubleLeftOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import ProForm, {
  ProFormText,
  ProFormDigit,
  ProFormGroup,
  ProFormTextArea,
} from '@ant-design/pro-form';
import styles from './style.less';
import { history } from 'umi';
import { getMethodCategory, addScore, updateScore } from '../service';

const ExamineCreate: React.FC<{}> = (props) => {

  let initialObj = {
    id: '',
    methodName: '',
    methodNumber: '',
    methodContent: '',
  };
  if (props.location.state) {
    initialObj = props.location.state;
  }
  console.log('================>', props)
  const type = props.location.query.type;
  const [categoryList, setCategoryList] = useState<any[]>([]);


  useEffect(() => {
    getMethodCategory().then((res: any) => {
      setCategoryList(res);
    });
  }, []);

  const goBack = () => {
    history.push('/fitnessScore');
  }

  const submitScore = (value: any) => {
    if (type === 'add') {
      addScore(value).then((res) => {
        if (res.message === 'OK') {
          notification.success({
            message: '保存成功！'
          });
          history.push('/fitnessScore');
        }
      })
    } else {
      const params = value;
      params.id = initialObj.id;
      updateScore(params).then((res) => {
        if (res.message === 'OK') {
          notification.success({
            message: '修改成功！'
          });
          history.push('/fitnessScore');
        }
      })
    }
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <a style={{ fontSize: 13, color: '#1890FF', marginRight: 20 }} onClick={() => goBack()}><DoubleLeftOutlined />返回</a>
          {
            type === 'add' ? '适应度评分新建' : '适应度评分详情'
          }
        </div>
        <div style={{ marginTop: 20 }}>
          <ProForm
            layout='horizontal'
            labelCol={{ span: 12 }}
            grid={true}
            labelWrap
            submitter={{
              render: (props, doms) => {
                return (
                  <Row>
                    <Col span={16} offset={10}>
                      <Space>{doms}</Space>
                    </Col>
                  </Row>
                )
              }
            }}
            rowProps={{
              gutter: [16, 8],
            }}
            initialValues={{
              methodName: initialObj.methodName,
              methodNumber: initialObj.methodNumber,
              methodContent: initialObj.methodContent,
            }}
            onFinish={async (value) => submitScore(value)}
          >
            <ProFormGroup>
              <ProFormText name="methodNumber" label="方法编号" colProps={{ span: 12 }} disabled labelCol={{ span: 6 }} />
              <ProFormText name="methodName" label="方法名称" colProps={{ span: 12 }} disabled labelCol={{ span: 6 }} />
              <ProFormTextArea name="methodContent" label="方法定义" colProps={{ span: 24 }} disabled labelCol={{ span: 3 }} />
            </ProFormGroup>
            {
              categoryList.map((category, index) => {
                return (
                  <ProFormGroup label={category.name}>
                    {
                      category.list.map((item: any, index: any) => {
                        return <ProFormDigit initialValue={initialObj[item.label]} key={index} label={item.realName} name={item.label} min={0} max={100} colProps={{ span: 6 }} rules={[{ required: true, message: `请填写${item.realName}评分!` }]} />
                      })
                    }
                  </ProFormGroup>
                )
              })
            }
          </ProForm>
        </div>
      </div>
    </>
  );
};

export default ExamineCreate;
