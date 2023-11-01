import { Avatar, Tag } from 'antd';
import React from 'react';
import moment from 'moment';
import styles from './index.less';

type ArticleListContentProps = {
  data: {
    content: React.ReactNode;
    updatedAt: number;
    avatar: string;
    owner: string;
    href: string;
  };
};

const ArticleListContent: React.FC<ArticleListContentProps> = ({
  data: { content, updatedAt, avatar, owner, href },
}) => (
    <div className={styles.listContent}>
      <div className={styles.extra}>
        <Avatar src={avatar} size="small" />
        <a href={href}>{owner}&nbsp;&nbsp;&nbsp;|</a>
        <em>{moment(updatedAt).format('YYYY-MM-DD HH:mm')}</em>
      </div>
      <div className={styles.description}><span style={{ fontSize: 16, color: '#5A5A5A' }}>摘要：</span>{content}</div>
      <div>
        <span style={{ fontSize: 16, color: '#5A5A5A' }}>关键词：</span>
        <Tag style={{ width: 100, textAlign: "center", borderRadius: 5 }}>城轨</Tag>
        <Tag style={{ width: 100, textAlign: "center", borderRadius: 5 }}>节能</Tag>
        <Tag style={{ width: 100, textAlign: "center", borderRadius: 5 }}>轻量化</Tag>
        <Tag style={{ width: 100, textAlign: "center", borderRadius: 5 }}>设计方案</Tag>
      </div>
    </div>
  );

export default ArticleListContent;
