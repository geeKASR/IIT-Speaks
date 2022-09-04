import React from 'react'
import './layout-css/Landing.css';

import {Link, Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';


function Landing() {

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to='/dashboard'/>
    }

    return (
        <div className="landing">
            <div className='landing-container'>
                <h1>IIT - Speaks</h1>
                <p>
                    Keep up with fellow IITians
                </p>
                <div className='buttons'>
                    <div className="container">
                        <Link to='/register' className="btn effect01">Sign Up</Link>
                    </div>
                    <div className="container">
                        <Link to='/login' className="btn effect01">Log In</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing
