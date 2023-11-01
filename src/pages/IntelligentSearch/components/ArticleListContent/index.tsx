import { Avatar, Tag } from 'antd';
import React from 'react';
import moment from 'moment';
import styles from './index.less';

type ArticleListContentProps = {
  content?: string,
  createDate?: string,
  avatar?: string,
  submitter?: string,
  href?: string,
  keys: string[],
};

const ArticleListContent: React.FC<ArticleListContentProps> = ({
  content, createDate, avatar, submitter, href, keys
}) => (
    <div className={styles.listContent}>
      <div className={styles.extra}>
        <Avatar src={avatar} size="small" />
        <a href={href}>{submitter}&nbsp;&nbsp;&nbsp;|</a>
        <em>{moment(createDate).format('YYYY-MM-DD HH:mm')}</em>
      </div>
      <div className={styles.description}><span style={{ fontSize: 16, color: '#5A5A5A' }}>摘要：</span>{content}</div>
      <div>
        <span style={{ fontSize: 16, color: '#5A5A5A' }}>关键词：</span>
        {
          keys.map((item, index) => <Tag key={index} color="blue" style={{ width: 100, textAlign: "center", borderRadius: 5 }}>{item}</Tag>)
        }
      </div>
    </div>
  );

export default ArticleListContent;
