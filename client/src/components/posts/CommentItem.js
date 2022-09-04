import React from 'react'
import Spinner from '../layout/Spinner';
import {useSelector, useDispatch} from 'react-redux';
import './posts-css/CommentItem.css';
import {removeComment} from '../../requests/auth';
import {postActions} from '../../store/reducers/post';
import { alertActions } from '../../store/reducers/alert';
import {v4 as uuidv4} from 'uuid';

const CommentItem = (props) => {
    const dispatch = useDispatch();


    const comment = props.comment;
    const post = useSelector(state => state.post.post);
    const isLoading = useSelector(state => state.post.loading);
    const {
        text,
        name,
        avatar,
        date,
        user,
        _id
    } = comment;

    const user2 = useSelector(state => state.auth.user);
    const user_id = user2._id;

    let dateObject = new Date(date);
    let month = dateObject.getUTCMonth() + 1; // months from 1-12
    let day = dateObject.getUTCDate();
    let year = dateObject.getUTCFullYear();

    let newdate = day + "/" + month + "/" + year;

    const deleteHandler = async () => {
        dispatch(postActions.isLoading());

        const obj = await removeComment(post._id, _id);

        console.log('delete handler');
        console.log(obj);

        if (obj.status === 1) {
            dispatch(postActions.removeComment(obj.data));
        } else {
          dispatch(postActions.postError(obj.data));
            const errors = obj.data;
            if (errors) {
                errors.forEach(error => {
                    const id = uuidv4();
                    dispatch(alertActions.setAlert({msg: error.msg, alertType: 'danger', id: id}));
                    setTimeout(() => {
                        dispatch(alertActions.removeAlert({id: id}));
                    }, 3000);
                })
            }
        }
    };

    return (
        <>{
            isLoading ? <Spinner/>: <div className="comment-item-container">
                <div className="comment-item-image">
                    <img src={avatar}/>
                    <p>{
                        name.toUpperCase()
                    }</p>
                </div>
                <div className="comment-item-text">
                    <p className='lead'>
                        {text}</p>
                    <p className='comment-time'>Created on {newdate} at {
                        dateObject.toLocaleTimeString('en-US')
                    } </p>
                    <div>{
                        user === user_id ? <button className='comment-delete-button'
                            onClick={deleteHandler}>Delete</button> : null
                    } </div>
                </div>
            </div>
        }</>

    )
}

export default CommentItem
