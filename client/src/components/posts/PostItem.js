import React from 'react'
import './posts-css/PostItem.css';
import {postActions} from '../../store/reducers/post';
import {useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {removePost} from '../../requests/auth';
import {v4 as uuidv4} from 'uuid';
import {alertActions} from '../../store/reducers/alert';
import Spinner from '../layout/Spinner';

const PostItem = (props) => {

    const navaigate = useNavigate();
    const dispatch = useDispatch();

    const {post} = props;
    const user2 = useSelector(state => state.auth.user);
    const isLoading = useSelector(state => state.post.loading);
    const user_id = user2._id;

    const {
        name,
        heading,
        user,
        text,
        avatar,
        date,
        likes,
        dislikes,
        comments,
        _id
    } = post;

    let dateObject = new Date(date);
    let month = dateObject.getUTCMonth() + 1; // months from 1-12
    let day = dateObject.getUTCDate();
    let year = dateObject.getUTCFullYear();

    let newdate = day + "/" + month + "/" + year;

    const viewFullPostHandler = () => {
        dispatch(postActions.clearPosts());
        navaigate(`/posts/${_id}`);
    }

    const removePostHandler = async () => {
        dispatch(postActions.isLoading());

        const obj = await removePost(_id);

        if (obj.status === 1) {
            dispatch(postActions.removePost(_id));

            const id = uuidv4();
            dispatch(alertActions.setAlert({msg: "Post Removed", alertType: 'success', id: id}));
            setTimeout(() => {
                dispatch(alertActions.removeAlert({id: id}));
            }, 3000);
        } else {
            dispatch(postActions.error());

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
    }

    const userProfileHandler = (e) => {
        dispatch(postActions.clearPosts());
        navaigate(`/profile/${user_id}`);
    }

    return (
        <>{
            isLoading ? <Spinner/>: <div className='post-container'>
                <div className='post-heading'>
                    <h1>{heading}</h1>
                    <div>
                        <button className='view-post-button'
                            onClick={viewFullPostHandler}>View Full Post</button>
                        {
                        user_id === user ? <button className='remove-post-button'
                            onClick={removePostHandler}>Remove Post</button> : null
                    } </div>

                </div>
                <div className='post-info'>
                    <div className='post-image'>
                        <img src={avatar}
                            className='post-profile-photo'/>
                        <div className='post-name'
                            onClick={userProfileHandler}>
                            {
                            name.toUpperCase()
                        }</div>
                    </div>
                    <div className='post-text'>
                        <div className='post-text-content'>
                            <p>{text}</p>
                        </div>
                        <div className='post-date'>Created at {newdate}
                            {
                            dateObject.toLocaleTimeString('en-US')
                        }</div>
                        <div className='post-buttons'>
                            <button className='like'>
                                <i className="fa-regular fa-thumbs-up"></i>
                                {
                                likes.length
                            }</button>
                            <button className='dislike'>
                                <i className="fa-regular fa-thumbs-down"></i>
                                {
                                dislikes.length
                            }</button>
                            <button className='comment'>
                                <i className="fa-regular fa-comments"></i>
                                {
                                comments.length
                            }</button>
                        </div>
                    </div>
                </div>
            </div>
        }</>

    )
}

export default PostItem
