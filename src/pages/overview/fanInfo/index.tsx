import React, { useState } from 'react';
import { Card, Col, List, Row, Table, Tag } from 'antd';
import styles from '../style.less';
import { ThunderboltTwoTone } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { queryFansList } from '@/pages/fan/selection/service';
import { saveUserAction } from '@/services/ant-design-pro/api';
import { history } from 'umi';

interface FanInfoProps {
  // isFullScreen: boolean;
  // offIcon: any;
  fanIntroduction: any;
  fanData: any;
  fanType: any;
}
// export const View: FC<ViewProps> = (props) => {

const FanInfo: React.FC<FanInfoProps> = (props) => {
  const { fanType, fanData, fanIntroduction } = props; // 通过判断风机类型获取后端数据
  console.log('通过判断风机类型获取后端数据');
  console.log('fanType');
  console.log(fanType);
  console.log('fanData');
  console.log(fanData);
  const [fanDec, setFanDec] = useState(null);
  const [isFanDec, setIsFanDec] = useState(false);

  // 通过判断风机类型获取后端数据
  const fanDataClass = fanData.filter((item) => item.label === fanType);
  // console.log('通过判断风机类型获取后端数据');
  // console.log('fanDataClass');
  // console.log(fanDataClass[0]);
  const changeFan = (item) => {
    setFanDec(item);
    setIsFanDec(true);
  };
  console.log(
    '####fanDataClass#####',
    fanDataClass,
    fanDataClass.length > 0 ? fanDataClass[0].sheet : null,
  );
  const columns: ProColumns<any>[] = [
    {
      title: '型号',
      dataIndex: 'model',
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              history.push({
                pathname: `/fans/detail`,
                state: {
                  // model: record.model,
                  id: record.id,
                  activeKey: '0',
                },
              });
              const actionParams = {
                monitorModule: '风机平台',
                pageUrl: window.location.href,
                pageName: '风机平台',
                actionModel: null,
                pageArea: '详情',
                actionId: `fan_${0}_详情`,
                actionType: '查询',
                actionName: '查看风机详情',
                description:
                  '查看风机数据_' + record.model + '-' + record.figNum + '-' + record.version,
              };
              saveUserAction({ params: actionParams }).catch((e) => {});
            }}
          >
            {record.model}
          </a>
        );
      },
    },
    {
      title: '电压',
      dataIndex: 'ratedCurrent',
    },
    {
      title: '流量',
      dataIndex: 'flowRate',
    },
    {
      title: '全压',
      dataIndex: 'fullPressure',
    },
    {
      title: '电机功率',
      dataIndex: 'motorPower',
    },
    {
      title: '电机转速',
      dataIndex: 'motorSpeed',
    },
    {
      title: '重量',
      dataIndex: 'weight',
    },
  ];
  return (
    <div className={styles.system} style={{ height: 900 }}>
      <Row gutter={16}>
        <Col span={isFanDec ? 0 : 9}>
          <Card
            bordered={false}
            className={styles.cardBody}
            title={<div style={{ fontSize: 18, color: '#1890f', padding: 0 }}>{fanType}</div>}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              <ThunderboltTwoTone />
              &nbsp;简介
            </div>
            <div style={{ fontSize: 14 }}>
              {fanDataClass.length > 0 ? fanDataClass[0].label_description : null}
            </div>

            <br />
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {' '}
              <ThunderboltTwoTone />
              &nbsp;性能参数表
            </div>

            {/* <img
              alt="example"
              // src= {"/fans/img/sheet1_1.jpg"}
              src={fanDataClass[0]?.sheet}
            /> */}
            <ProTable
              size="small"
              columns={columns}
              options={false}
              search={false}
              className={styles.table}
              request={async (params) => {
                params.coolObject = fanIntroduction.coolObject;
                const res = await queryFansList(params);
                // 查看风机历史版本列表
                // console.log('res');
                // console.log(res);

                const actionParams = {
                  monitorModule: '风机平台',
                  pageUrl: window.location.href,
                  pageName: '风机平台',
                  pageArea: '产品介绍',
                  actionModel: null,
                  actionId: `fan_${0}_查询`,
                  actionType: '查询',
                  actionName: '查询风机列表',
                  description: JSON.stringify(params),
                };
                // saveUserAction({ params: actionParams }).catch((e) => {});
                return res;
              }}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['5', '10', '20', '50'], // 每页数量选项
              }}
            ></ProTable>
          </Card>
        </Col>
        <Col span={isFanDec ? 6 : 15}>
          <List
            grid={{
              gutter: 16,
              column: isFanDec ? 1 : 3,
            }}
            dataSource={fanDataClass}
            renderItem={(item) => (
              <List.Item>
                <div onClick={() => changeFan(item)}>
                  <Card title={item.title} hoverable>
                    <img
                      src={item.img}
                      width={(document.documentElement.clientWidth - 800) / 4}
                      height={(document.documentElement.clientWidth - 800) / 4}
                      style={{ width: (document.documentElement.clientWidth - 600) / 4 }}
                    />
                    <div style={{ fontSize: 16, fontWeight: 500, paddingBottom: 20 }}>
                      {item.name}
                    </div>

                    <Tag color="processing">{item.label}</Tag>
                    {/* 产品分类：<Tag color="processing">{item.label}</Tag> */}
                  </Card>
                </div>
              </List.Item>
            )}
          />
        </Col>
        <Col span={isFanDec ? 18 : 0}>
          <Card>
            {isFanDec ? (
              <div style={{ marginLeft: 20, paddingLeft: 50 }}>
                <div style={{ fontSize: 22, fontWeight: 500 }}>{fanDec?.name}</div>
                <br />
                产品分类：<Tag color="processing">{fanDec?.label}</Tag>
                <br />
                <img alt="example" src={fanDec?.img} />
                <br />
                产品描述:&emsp;{fanDec?.description}
              </div>
            ) : null}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FanInfo;
