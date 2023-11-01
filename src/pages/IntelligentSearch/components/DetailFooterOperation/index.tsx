import React, { useState, useEffect } from 'react';
import styles from './style.less';
import { Button, Form, List, Input, Comment, Avatar } from 'antd';
import { LikeOutlined, LikeFilled, MessageOutlined, StarOutlined, StarFilled, DownloadOutlined } from '@ant-design/icons';
import type { ListItemDataType, KnowledgeItemDataType } from '../../records/data';
import moment from 'moment';
import { giveLike, giveDisLike, giveUnStore, giveStore, getKnowledgeComments, getMethodComments, addKnowledgeComments, addMethodComments } from '../../records/service';
import { useModel } from 'umi';

const { TextArea } = Input;

interface detailType {
  likeStatus: string,
  likeCount: string,
  storeStatus: string,
  storeCount: string,
  id: number,
  commentCount: number,
  showComment: boolean,
}

type FooterOperationProps = {
  changeRecord: () => void;
  changeComment: (index: any) => void;
  // dataList: ListItemDataType[];
  index: number;
  status: number,
  detailObj: detailType,
};

const DetailFooterOperation: React.FC<FooterOperationProps> = (props) => {
  const { status, changeRecord, changeComment, index } = props;
  const { likeStatus, likeCount, storeStatus, storeCount, id, commentCount, showComment } = props.detailObj;
  const inputRef = React.useRef<any>(null);
  const ref = React.useRef<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState<any>([]);
  const [flag, setFlag] = useState(false);
  // const [likeStatus, setLikeStatus] = useState('0');
  // const [likeCount, setLikeCount] = useState('0');
  // const [storeStatus, setStoreStatus] = useState('0');
  const [count, setCount] = useState(0);

  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    setCount(commentCount);
  }, []);

  const showCommentList = () => {
    changeComment(index);
    const params = {
      articleId: id,
    }
    if (status === 1) {
      getKnowledgeComments(params).then(res => {
        setComments(res.list);
      })
    } else {
      getMethodComments(params).then(res => {
        setComments(res.list);
      })
    }
  };

  const handleSubmit = () => {
    const content = inputRef.current.resizableTextArea.textArea.value;
    if (content === '') {
      return;
    }
    setSubmitting(true);
    const params = {
      articleId: id,
      content,
    };
    if (status === 1) {
      addKnowledgeComments(params).then(res => {
        console.log(res)
        getKnowledgeComments({ articleId: id, }).then(response => {
          setComments(response.list);
          setCount(response.total);
        });
      });
    } else {
      addMethodComments(params).then(res => {
        console.log(res)
        getMethodComments({ articleId: id, }).then(response => {
          setComments(response.list);
          setCount(response.total);
        });
      });
    }
    setSubmitting(false);
    inputRef.current.resizableTextArea.textArea.value = '';
  };

  const collect = (mesg: string) => {
    const params = {
      id: id,
      status: status,
    }
    if (mesg === 'star') {
      if (storeStatus === '1') {
        giveUnStore(params).then(res => {
          console.log(res)
        });
      } else {
        giveStore(params).then(res => {
          console.log(res)
        });
      }
    } else {
      if (likeStatus === '1') {
        giveDisLike(params).then(res => {
          console.log(res)
        });
      } else {
        giveLike(params).then(res => {
          console.log(res)
        });
      }
    }
    changeRecord();
  };


  const Editor = ({ onSubmit, submitting }) => (
    <>
      <Form.Item>
        <TextArea ref={inputRef} rows={2} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
          评论
        </Button>
      </Form.Item>
    </>
  );

  const reply = (index: any) => {
    console.log(comments[index])
    const isShow = comments[index].isShow ? comments[index].isShow = false : comments[index].isShow = true;
    comments[index].isShow = isShow;
    setComments(comments);
    const status = flag ? false : true;
    setFlag(status);
  };

  const replyComments = (value: any) => {
    console.log(value)
    const content = ref.current.resizableTextArea.textArea.value;
    if (content === '') {
      return;
    }
    setSubmitting(true);
    const params = {
      articleId: id,
      content,
      parentId: value,
    };
    if (status === 1) {
      addKnowledgeComments(params).then(res => {
        console.log(res)
        getKnowledgeComments({ articleId: id, }).then(response => {
          setComments(response.list);
          setCount(response.total);
        });
      });
    } else {
      addMethodComments(params).then(res => {
        console.log(res)
        getMethodComments({ articleId: id, }).then(response => {
          setComments(response.list);
          setCount(response.total);
        });
      });
    }
    setSubmitting(false);
    ref.current.resizableTextArea.textArea.value = '';
  };

  const CommentList = ({ commentList }: { commentList: any }) => (
    <List
      style={{ marginTop: -40 }}
      dataSource={commentList}
      header={`全部评论${count}条`}
      itemLayout="horizontal"
      renderItem={(item: any, index: any) => (
        <Comment
          className={styles.container}
          author={<a>张三</a>}
          avatar={<Avatar src={item.avatar} />}
          content={
            <>
              <p>{item.content}</p>
              <div style={{ display: 'flex', marginTop: 10 }}>
                <span onClick={() => reply(index)} style={{ width: 50, fontSize: 13, color: '#8C8C8C', cursor: 'pointer' }}>{item.isShow ? '收起' : '回复'}</span>
                {
                  item.isShow ? (
                    <>
                      <TextArea style={{ width: '80%' }} ref={ref} rows={2} />
                      <Button style={{ marginLeft: 20 }} size='small' type="primary" onClick={() => replyComments(item.id)}>评论</Button>
                    </>
                  ) : ''
                }
              </div>
            </>
          }
          datetime={item.commentTime}
        >
          {
            item.children ? item.children.map((child: any, index: any) => {
              return <Comment
                key={index}
                author={<a>张三</a>}
                avatar={<Avatar src={child.avatar} />}
                content={<p>{child.content}</p>}
                datetime={child.commentTime}
              />
            }) : ''
          }
        </Comment>
      )}
    />
  );

  return (
    <div>
      <div className={styles.footer} style={{ color: '#8C8C8C', marginTop: 20 }}>
        <span className={styles.tagList} onClick={() => collect('star')}>
          {React.createElement(storeStatus === '1' ? StarFilled : StarOutlined)}
          &nbsp;&nbsp;{storeCount === 'null' ? 0 : storeCount}
        </span>
        <span className={styles.tagList} onClick={() => collect('like')}>
          {React.createElement(likeStatus === '1' ? LikeFilled : LikeOutlined)}
          &nbsp;&nbsp;{likeCount === 'null' ? 0 : likeCount}
        </span>
        <span className={styles.tagList} onClick={() => showCommentList()}>
          <MessageOutlined style={{ marginRight: 8 }} />
          {count}
        </span>
        <span>
          <DownloadOutlined style={{ marginRight: 8 }} />
        </span>
      </div>
      {
        showComment ? <>
          <Comment
            avatar={<Avatar src={initialState?.currentUser?.avatar} />}
            content={
              <Editor
                onSubmit={() => handleSubmit()}
                submitting={submitting}
              />
            }
          />
          {comments.length > 0 && <CommentList commentList={comments} />}
        </> : ''
      }
    </div>
  );
};

export default DetailFooterOperation;
