import { Button, Input, Form, List, Comment as AntComment, Avatar } from 'antd';
import moment from 'moment';
import { FC, useEffect, useState } from 'react'
import { Trash, User } from 'react-feather';
import { useListContext } from '../../../../contexts/ListContext/ListContext';
import { useLoginContext } from '../../../../contexts/LoginContext/LoginContext';
import { cardCommentService } from '../../../../services/http/endpoints/comment';
import { CardCommentRequestPayload } from '../../../../services/http/endpoints/comment/types';
import { author } from '../CardInfo.types';
import { CommentProps } from './Comment.types'

const Comment: FC<CommentProps> = (props) => {
  const listCtx = useListContext()
  const { username } = useLoginContext()
  const { TextArea } = Input;

  interface CommentItem {
    author: string;
    content: React.ReactNode;
    datetime: string;
    id: number
  }
  
  const tempComments: CommentItem[] = []
  props.comments.map(item=>{
    
    const comment: CommentItem = {
      id: item.id,
      author: item.author.username,
      content: <p>{item.message}</p>,
      datetime: moment(item.createdAt).fromNow(),
    }

    tempComments.push(comment);
  })

  const [comments, setComments] = useState<CommentItem[]>(tempComments);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    if (!value) return;

    const CardCommentRequest: CardCommentRequestPayload = {
      message: value,
      cardId: props.cardId
    }

    cardCommentService.createCardComment (CardCommentRequest).then(({data})=>{
      const author : author = {
        id: data.authorId,
        username: username
      }

      listCtx.dispatches.addComment(data, author, props.listId, props.cardId )
      setComments([
            ...comments,
            {
              id:data.id,
              author: username,
              content: <p>{data.message}</p>,
              datetime: moment(data.createdAt).fromNow(),
            },
          ]);
      setSubmitting(false);
      setValue('')
    })
  };

  const handleDelete = (id: number) => {
    cardCommentService.deleteComment(id).then(()=>{
      listCtx.dispatches.deleteComment(id, props.cardId, props.listId)
      const newComment = comments.filter(p=>p.id !== id)
      setComments(newComment)
    })
  }

  const CommentList = ({ comments }: { comments: CommentItem[] }) => (
    <List
      dataSource={comments}
      itemLayout="horizontal"
      header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
      renderItem={item => (
        <List.Item>
           <AntComment {...item} />
            { item.author === username ? <div onClick={()=>handleDelete(item.id)}><Trash /></div>: ''}
        </List.Item>
      )}
    />
    
  );
   
  return (
    <>
      {comments.length > 0 && <CommentList comments={comments} />}
      
      <AntComment
        avatar={<User />}
        content={
          <>
          
          <Form.Item>
            
            <TextArea rows={4} onChange={handleChange} value={value} />
             
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={handleSubmit} type="primary">
              Add Comment
            </Button>
        </Form.Item>
        </>
        }
      />
    </>
  )
}

export default Comment
