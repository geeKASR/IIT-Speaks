import React, { useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom';
// import './CreateProfile.css'
import {createProfile} from '../../requests/auth';
import {useDispatch, useSelector} from 'react-redux';
import {profileActions} from '../../store/reducers/profile';
import {alertActions} from '../../store/reducers/alert';
import {v4 as uuidv4} from 'uuid';
import Spinner from '../../components/layout/Spinner';
import {addPost}    from '../../requests/auth';

const CreatePost = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(state => state.post.loading);

    const [formData, setFormData] = React.useState({
        heading : '',
        text : '',
        image : ''
    });

    const {
        heading,
        text,
        image
    } = formData;


    const onChangeHandler = (e) => {
        setFormData(prevState => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })
    }

    const onFileChange = (e) => {
        setFormData(prevState => {
            return {
                ...prevState,
                image : e.target.files[0]
            }
        })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        dispatch(profileActions.isLoading());

        const formData = new FormData();

        formData.append('image', image);
        formData.append('heading', heading);
        formData.append('text', text);

        console.log(formData);

        const obj = await addPost(formData);

        if(obj.status === 1){
            dispatch(profileActions.addPost(obj.data));
        }
        else{
            dispatch(profileActions.postError(obj.data));

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

        const id = uuidv4();
        dispatch(alertActions.setAlert({msg: "Post Created", alertType: 'success', id: id}));
        setTimeout(() => {
            dispatch(alertActions.removeAlert({id: id}));
        }, 3000);

        // Navigating back to dashboard
        navigate('/posts');
    }


    return (<> {
        isLoading? <Spinner/> : 
            <div className="create-profile-container">
                <h1 className="large text-primary">
                    Add a Post
                </h1>
                <small className="form-text">Create something that gets the most LIKES ;) </small>
                <form className="form"
                    onSubmit={onSubmitHandler}>
                    
                    <div className="form-group">
                        <textarea placeholder="Heading" name="heading"
                            value = {heading}
                            onChange={onChangeHandler}></textarea>
                        <small className="form-text">Heading for your Post </small>
                    </div>
    
                    <div className="form-group">
                        <textarea placeholder="text" name="text"
                            value = {text}
                            onChange={onChangeHandler}></textarea>
                        <small className="form-text">Text for your Post</small>
                    </div>
                    <div className="form-group">
                        <input type="file" name = 'image' id = 'image' onChange={onFileChange}/>
                        <small className="form-text">Image file shouldn't have any spaces in it's name !!</small>

                    </div>
                    <input type="submit" className="btn3"/>
                    <Link to='/dashboard'>Go Back</Link>
                </form>
            </div>}
        </>)
    }

    export default CreatePost
