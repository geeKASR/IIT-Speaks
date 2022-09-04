import React, {useEffect} from 'react'
import './posts-css/Post.css';
import {useParams} from 'react-router-dom';
import {getPostById} from '../../requests/auth';
import {postActions} from '../../store/reducers/post';
import {useDispatch, useSelector} from 'react-redux';
import {alertActions} from '../../store/reducers/alert';
import {v4 as uuidv4} from 'uuid';
import PostTop from './PostTop';
import Spinner from '../layout/Spinner';

const Post = () => {
    
    const dispatch = useDispatch();
    const {post_id} = useParams();
    const post = useSelector(state => state.post.post);
    const isLoading = useSelector(state => state.post.loading);

    useEffect(() => {
        
        const fetchPost = async () => {
            dispatch(postActions.isLoading());
            
            const obj = await getPostById(post_id);
            
            console.log("post useEffect");
            console.log(obj);

            if (obj.status === 1) {
                dispatch(postActions.getPost(obj.data));
            }
            else{
                const errors = obj.data;
                dispatch(postActions.postError(errors));

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
        fetchPost();
    }, []);

    return (<>
        { (post === null || isLoading) ? <Spinner/> : <>
            <div className='single-post-container'>
                <PostTop post={post}/>
            </div>
        </> }
        </>
    )
}

export default Post
