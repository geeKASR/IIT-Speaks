import React from 'react';
import {useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../requests/auth';
import {authActions} from '../../store/reducers/auth';
import {alertActions} from '../../store/reducers/alert';
import { loadUser } from '../../requests/auth';

import './auth-css/Login.css';

function Login() {

    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const [formData, setFormData] = useState({email: '', password: ''});

    const {email, password} = formData;

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
        const obj = await login({email, password});

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

    if(isAuthenticated){
        return <Navigate to="/posts"/>
    }

    return (
        <div className="login">
            <div className="login-container">
                <h1 className="large text-primary">Log In</h1>
                <p className="lead">
                    Sign Into your Account</p>

                <form className="form"
                    onSubmit={onSubmitHandler}>
                    <div className="form-group">
                        <input type="email" placeholder="Email Address" name="email"
                            value={email}
                            onChange={onChangeHandler}
                            required/>
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Password" name="password"
                            onChange={onChangeHandler}
                            value={password}
                            minLength="6"/>
                    </div>
                    <div className='buttons'>
                        <div className="button-container">
                            <input type="submit" className="btn effect01" value="Log In"/>
                        </div>
                    </div>
                </form>
                <p className="my-1">
                    Don't have an account?
                    <Link to='/register'>Sign Up</Link>
                </p>
            </div>
        </div>
    )
}

export default Login;
