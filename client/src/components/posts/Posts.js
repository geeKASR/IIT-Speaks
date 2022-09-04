import React from 'react'
import Spinner from '../layout/Spinner'
import {useSelector, useDispatch} from 'react-redux'
import {getPosts} from '../../requests/auth'
import {postActions} from '../../store/reducers/post'
import { alertActions } from '../../store/reducers/alert'
import {v4 as uuidv4} from 'uuid';
import {useEffect} from 'react';
import './posts-css/Posts.css'
import PostItem from './PostItem'


const Posts = () => {

    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.post.loading);
    const posts = useSelector(state => state.post.posts);

    useEffect(() => {
        const fetchPosts = async () => {

            
            dispatch(postActions.clearPosts());
            dispatch(postActions.isLoading());
            
            const obj = await getPosts();
            
            //logging information
            console.log('posts useEffect');
            console.log(obj);

            if(obj.status === 1){
                dispatch(postActions.getPosts(obj.data));
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
        };

        fetchPosts();
    },[]);

    const postContainer = posts.map((post,index) =>{
        return <PostItem key = {index} post = {post}/>
    });

    return (
        <> 
            {isLoading ? <Spinner/>: 
            <div className='posts-parent-container'>
                <h1 className = 'large6'>Posts</h1>
                <p className='lead'> Welcome to the Community</p>
                <div className='posts-container'>
                    {(posts === null  || posts.length === 0) ? <p>No posts... :(</p> : postContainer}
                </div> 
            </div>}
        </>
    )
};

export default Posts;
