import { LikeOutlined, LoadingOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, List, Row, Select, Tag, Input, Radio } from 'antd';
import type { FC } from 'react';
import React from 'react';
import { useRequest } from 'umi';
import ArticleListContent from './components/ArticleListContent';
import StandardFormRow from './components/StandardFormRow';
// import TagSelect from './components/TagSelect';
import type { ListItemDataType } from './data.d';
import { queryFakeList } from './service';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;

const { Search } = Input;

const pageSize = 5;

const Articles: FC = () => {
  const [form] = Form.useForm();

  const { data, reload, loading, loadMore, loadingMore } = useRequest(
    () => {
      return queryFakeList({
        count: pageSize,
      });
    },
    {
      loadMore: true,
    },
  );

  const list = data?.list || [];

  const optionsWithDisabled = [
    { label: '时间', value: 'Apple' },
    { label: '相关度', value: 'Pear' },
  ];

  const IconText: React.FC<{
    type: string;
    text: React.ReactNode;
  }> = ({ type, text }) => {
    switch (type) {
      case 'star-o':
        return (
          <span>
            <StarOutlined style={{ marginRight: 8 }} />
            {text}
          </span>
        );
      case 'like-o':
        return (
          <span>
            <LikeOutlined style={{ marginRight: 8 }} />
            {text}
          </span>
        );
      case 'message':
        return (
          <span>
            <MessageOutlined style={{ marginRight: 8 }} />
            {text}
          </span>
        );
      default:
        return null;
    }
  };

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 12 },
    },
  };

  const loadMoreDom = list?.length > 0 && (
    <div style={{ textAlign: 'center', marginTop: 16 }}>
      <Button onClick={loadMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
        {loadingMore ? (
          <span>
            <LoadingOutlined /> 加载中...
          </span>
        ) : (
            '加载更多'
          )}
      </Button>
    </div>
  );

  return (
    <>
      <div style={{ marginLeft: 22, paddingRight: 30 }}>
        <Search placeholder="城轨车辆转向架轻量化设计方法" enterButton />
        <div style={{ marginTop: 25, fontSize: 14 }}>关键字：<span style={{ color: '#DC143C' }}>城轨 转向架 轻量化  设计</span></div>
      </div>
      <Card bordered={false}>
        <Form
          layout="inline"
          form={form}
          initialValues={{
            owner: ['wjh', 'zxx'],
          }}
          onValuesChange={reload}
        >
          <StandardFormRow grid last>
            <Row gutter={16}>
              <Col span={8}>
                <FormItem {...formItemLayout} label="创新产品" name="product">
                  <Select placeholder="请选择" style={{ maxWidth: 200, width: '100%' }}>
                    <Option value="pro1">动车</Option>
                    <Option value="pro2">城轨</Option>
                    <Option value="pro3">机车</Option>
                    <Option value="pro4">磁浮</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="创新链环节" name="part">
                  <Select placeholder="请选择" style={{ maxWidth: 200, width: '100%' }}>
                    <Option value="part1">研发</Option>
                    <Option value="part2">生产</Option>
                    <Option value="part3">服务</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="创新链对象" name="object">
                  <Select placeholder="请选择" style={{ maxWidth: 200, width: '100%' }}>
                    <Option value="obj1">电气</Option>
                    <Option value="obj2">制动</Option>
                    <Option value="obj3">暖通</Option>
                    <Option value="obj4">车门</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </StandardFormRow>
          <StandardFormRow grid last>
            <Row gutter={16} style={{ marginTop: '20px' }}>
              <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                <FormItem {...formItemLayout} label="创新类别" name="type">
                  <Select placeholder="请选择" style={{ maxWidth: 200, width: '100%' }}>
                    <Option value="type1">技术创新</Option>
                    <Option value="type2">管理创新</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                <FormItem {...formItemLayout} label="创新程序" name="procedure">
                  <Select placeholder="请选择" style={{ maxWidth: 200, width: '100%' }}>
                    <Option value="obj1">发现问题</Option>
                    <Option value="obj2">分析问题</Option>
                    <Option value="obj3">解决问题</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                <Button type="primary">
                  搜索
                </Button>
              </Col>
            </Row>
          </StandardFormRow>
        </Form>
      </Card>
      <Row style={{ marginLeft: 22, paddingRight: 30, fontSize: 14 }}>
        <Col span={16}>
          <div>智能为你搜索到相关记录<span style={{ color: '#DC143C', marginLeft: 10 }}>12条</span></div>
        </Col>
        <Col span={8}>
          排序
          <Radio.Group
            style={{ marginLeft: 20 }}
            options={optionsWithDisabled}
            optionType="button"
            buttonStyle="solid"
          />
        </Col>
      </Row>
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '8px 32px 32px 32px' }}
      >
        <List<ListItemDataType>
          size="large"
          loading={loading}
          rowKey="id"
          itemLayout="vertical"
          loadMore={loadMoreDom}
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <IconText key="star" type="star-o" text={item.star} />,
                <IconText key="like" type="like-o" text={item.like} />,
                <IconText key="message" type="message" text={item.message} />,
              ]}
              extra={<div className={styles.listItemExtra} />}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle} href={item.href}>
                    {item.title}
                  </a>
                }
                description={
                  <span>
                    <Tag>城轨</Tag>
                    <Tag>节能</Tag>
                    <Tag>轻量化</Tag>
                    <Tag>设计方案</Tag>
                  </span>
                }
              />
              <ArticleListContent data={item} />
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default Articles;
