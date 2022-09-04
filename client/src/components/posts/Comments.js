import React from 'react'
import './posts-css/Comments.css';
import AddComment from './AddComment';
import CommentItem from './CommentItem';

const Comments = (props) => {
  const comments = props.comments;
  return (
    <div className = 'comment-container'>
      <AddComment />
      {
        comments.map((comment,index) => {
          return <CommentItem key = {index} comment = {comment} />
        })
      }
    </div>
  )
}

export default Comments