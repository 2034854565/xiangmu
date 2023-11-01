import {
  Button,
  Space,
  Popconfirm,
  notification,
  Row,
  Col,
  Typography,
  Card,
  Tabs,
  Descriptions,
  Select,
  InputNumber,
  Divider,
} from 'antd';
import React, { useEffect } from 'react';
import { Input, Tree, Image } from 'antd';
const { Search } = Input;
const { Title } = Typography;

const FanSimilarDesignDetail: React.FC<{}> = (props) => {
  console.log('FanDetail props');
  console.log(props);
  //   const { model } = props.match.params;

  //   const [fanInfo, setFanInfo] = useState<FanListItem>();

  //   useEffect(() => {}, []);

  const handleChangeCategory = (value: any) => {};
  const onChangeNumber = (value: any) => {};

  return (
    <>
      <Card title="相似设计过程">
        <Title level={4}>输入设计参数</Title>
        <Row gutter={16} justify={'center'} align="middle">
          <Space direction="vertical">
            <Col>
              <Title level={4}></Title>
              相似设计类型：
              <Select
                defaultValue={1}
                style={{ width: 120 }}
                onChange={handleChangeCategory}
                options={[
                  {
                    value: 1,
                    label: '类型1',
                  },
                  {
                    value: 2,
                    label: '类型2',
                  },
                  {
                    value: 3,
                    label: '类型3',
                  },
                ]}
              />
            </Col>

            <Col>
              <Title level={4}></Title>
              相似设计系数：
              <InputNumber
                min={0}
                max={10}
                defaultValue={2}
                onChange={onChangeNumber}
              ></InputNumber>
            </Col>
          </Space>
        </Row>
        <Divider />
      </Card>
    </>
  );
};

export default FanSimilarDesignDetail;
