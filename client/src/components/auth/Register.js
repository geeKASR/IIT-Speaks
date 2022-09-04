import React from 'react'
import {useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

import {useDispatch, useSelector} from 'react-redux';
import {alertActions} from '../../store/reducers/alert';
import {authActions} from '../../store/reducers/auth';
import {register} from '../../requests/auth';
import { loadUser } from '../../requests/auth';


import './auth-css/Register.css';

function Register() {

    const dispatch = useDispatch();

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const [formData, setFormData] = useState({name: '', email: '', password: '', password2: ''});

    const {name, email, password, password2} = formData;

    const onChangeHandler = (e) => {
        setFormData((prevState) => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            };
        })
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (password !== password2) {
            const id = uuidv4();
            dispatch(alertActions.setAlert({msg: 'Passwords do not match', alertType: 'danger', id: id}));
            setTimeout(() => {
                dispatch(alertActions.removeAlert({id: id}));
            }, 3000);
        } else {
            const obj = await register({name, email, password});
            console.log(obj);

            if (obj.status === 1) {

                dispatch(authActions.authSuccess(obj.data));

                const user = await loadUser();

                if (user.status === 1) {
                    dispatch(authActions.userLoaded(user.data));
                } else {
                    dispatch(authActions.authFail());
                }

            } else {
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
                dispatch(authActions.authFail());
            }
        }
    }


    if(isAuthenticated){
        return <Navigate to="/dashboard"/>
    }

    // html form code--------------------------------------------------------------------------
    return (
        <div className="register">
            <div className="register-container">
                <h1 className="large text-primary">Sign Up</h1>
                <p className="lead">
                    Create Your Account</p>

                <form className="form"
                    onSubmit={onSubmitHandler}>
                    <div className="form-group">
                        <input type="text" placeholder="Name" name="name"
                            value={name}
                            onChange={onChangeHandler}
                            required/>
                    </div>
                    <div className="form-group">
                        <input type="email" placeholder="Email Address" name="email"
                            value={email}
                            onChange={onChangeHandler}
                            required/>
                        <small className="form-text">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                    </div>
                    <div className="form-group"
                        onChange={onChangeHandler}>
                        <input type="password" placeholder="Password" name="password" minLength="6"/>
                    </div>
                    <div className="form-group"
                        onChange={onChangeHandler}>
                        <input type="password" placeholder="Confirm Password" name="password2" minLength="6"/>
                    </div>
                    <div className='buttons'>
                        <div className="button-container">
                            <input type="submit" className="btn effect01" value="Register"/>
                        </div>
                    </div>
                </form>
                <p className="my-1">
                    Already have an account?
                    <Link to='/login'>Sign In</Link>
                </p>
            </div>
        </div>
    )
}

export default Register;
