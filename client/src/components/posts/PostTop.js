import React from 'react'
import './posts-css/PostTop.css';
import {useEffect,useState} from 'react';
import Comments from './Comments';
import {postActions} from '../../store/reducers/post';
import {likePost, dislikePost, unlikePost, undislikePost} from '../../requests/auth';
import {useDispatch, useSelector} from 'react-redux';
import {alertActions} from '../../store/reducers/alert';
import {v4 as uuidv4} from 'uuid';

import Spinner from '../layout/Spinner';

const PostTop = (props) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const isLoading = useSelector(state => state.post.loading);

    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    
    const {post} = props;
    const user_id = user._id;
    const { heading,text, name, dislikes, likes, comments, date,image,_id} = post;
    const imgAddress = `/uploads/${image}`;
    
    useEffect(() => {
        if(props.post.likes.filter(like => like.user === user_id).length > 0){
            setIsLiked(true);
        }
        if(props.post.dislikes.filter(dislike => dislike.user === user_id).length > 0){
            setIsDisliked(true);
        }
    }, [isLiked, isDisliked])

    let dateObject = new Date(date);
    let month = dateObject.getUTCMonth() + 1; //months from 1-12
    let day = dateObject.getUTCDate();
    let year = dateObject.getUTCFullYear();

    let newdate = day + "/" + month + "/" + year;
    

    const likeHandler = async () => {
        dispatch(postActions.isLoading());
        const obj = await likePost(_id);

        console.log('like handler');
        console.log(obj);

        if(obj.status === 1){
            dispatch(postActions.likePost(obj.data));
            
            setIsLiked(true);
            if(isDisliked){
                dislikeHandler();
            }
        }
        else{
            dispatch(postActions.isLoading());
            const obj2 = await unlikePost(_id);

            if(obj2.status === 1){
                dispatch(postActions.unlikePost(obj2.data));
                setIsLiked(false);
            }
            else{
                dispatch(postActions.postError(obj2.data));

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
    };

    const dislikeHandler = async () => {
        dispatch(postActions.isLoading());

        const obj = await dislikePost(_id);

        console.log('dislike handler');
        console.log(obj);

        if(obj.status === 1){
            dispatch(postActions.dislikePost(obj.data));
            setIsDisliked(true);

            if(isLiked){
                likeHandler();
            }
        }
        else{
            dispatch(postActions.isLoading());
            const obj2 = await undislikePost(_id);

            if(obj2.status === 1){
                dispatch(postActions.undislikePost(obj2.data));
                setIsDisliked(false);
            }
            else{
                dispatch(postActions.postError(obj2.data));

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
    }

    return (<>{ isLoading ? <Spinner /> :<>
        <div className='post-top-container'>
            <div className='post-top-heading'>
                <h1>{heading}</h1>
            </div>
            <div className='post-top-text'>
                <p className='lead'>{text}</p>
            </div>
            <p className='post-top-created'> Created at {newdate} {dateObject.toLocaleTimeString('en-US')} by {name.toUpperCase()}</p>
            <img src = {imgAddress} alt = "test.png" className = 'post-top-image'/>
            <div className='post-top-buttons'>
                <button className= {`post-top-like ${isLiked ? "like-button" : null}`} onClick={likeHandler}> <i class="fa-solid fa-thumbs-up "/>   {likes.length} </button>
                <button className= {`post-top-dislike ${isDisliked ? "dislike-button" : null}`} onClick={dislikeHandler}> <i class="fa-solid fa-thumbs-down"/>   {dislikes.length} </button>
            </div>
        </div>
            <Comments comments = {comments} />
        </>}
        </>
    )
}

export default PostTop;
