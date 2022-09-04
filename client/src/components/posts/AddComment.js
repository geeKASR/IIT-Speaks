import React from 'react'
import './posts-css/AddComment.css';
import {useSelector, useDispatch} from 'react-redux';
import {postActions} from '../../store/reducers/post';
import {addComment} from '../../requests/auth';
import Spinner from '../layout/Spinner';
import {alertActions} from '../../store/reducers/alert';
import {v4 as uuidv4} from 'uuid';

const AddComment = () => {

    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user);
    const post = useSelector(state => state.post.post);
    const {_id} = post;
    const isLoading = useSelector(state => state.post.loading);

    const [text, setText] = React.useState('');

    const textChangeHandler = (e) => {
        setText(e.target.value);
    }

    const clearHandler = () => {
        setText('');
    }

    const postHandler = async () => {
        dispatch(postActions.isLoading());

        const obj = await addComment(text, _id);
        console.log('post handler');
        console.log(obj);

        if(obj.status === 1){
            dispatch(postActions.addComment(obj.data));
        }
        else{
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
    }

    const {name, avatar} = user;
    return (
        <>{
            isLoading ? <Spinner/>: <div className="add-comment-container">
                <div className="add-comment-image">
                    <img src={avatar}/>
                    <p>{
                        name.toUpperCase()
                    }</p>
                </div>
                <div className="add-comment-text">
                    <textarea placeholder="Comment" name="comment"
                        value={text}
                        onChange={textChangeHandler}/>
                    <div>
                        <button className='comment-button'
                            onClick={postHandler}>Post</button>
                        <button className='comment-button'
                            onClick={clearHandler}>Clear</button>
                    </div>
                </div>
            </div>
        }</>

    )
};
export default AddComment;
