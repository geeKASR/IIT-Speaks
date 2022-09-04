import React from 'react'
import './layout-css/Navbar.css';

import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {authActions} from '../../store/reducers/auth';
import {profileActions} from '../../store/reducers/profile';

const Navbar = () => {

    const dispatch = useDispatch();

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const loading = useSelector(state => state.auth.loading);

    const logoutHandler = () => {
        dispatch(authActions.authFail());
        dispatch(profileActions.clearProfile());
    }

    const authLinks = (
        <ul>
            <li>
                <i className ="color-blue fa-solid fa-users"></i>
                <Link to="/posts">Posts</Link>
            </li>
            <li>
                <i className ="color-blue fa-solid fa-users"></i>
                <Link to="/profiles">People</Link>
            </li>
            <li>
                <i className="fa-solid fa-address-card color-blue"></i>
                <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
                <i className="fa-solid fa-right-from-bracket color-blue"></i>
                <Link to="/"
                    onClick={logoutHandler}>Logout</Link>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul>
            <li>
                <i className ="color-blue fa-solid fa-users"></i>
                <Link to="/profiles">People</Link>
            </li>
            <li>
                <i className ="color-blue fa-solid fa-cash-register"></i>
                <Link to="/register">Register</Link>
            </li>
            <li>
                <i className ="color-blue fa-solid fa-right-to-bracket"></i>
                <Link to="/login">Login</Link>
            </li>
        </ul>
    );

    return (
        <nav className="navbar-head">
            <h1>
                <Link to='/'>IIT - Speaks</Link>
            </h1>
            {
            ! loading && (
                <>{
                    isAuthenticated ? authLinks : guestLinks
                }</>
            )
        } </nav>
    )
}

export default Navbar;
