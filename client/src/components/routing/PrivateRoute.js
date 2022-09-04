import React from 'react'
import {useSelector} from 'react-redux'
import { Navigate } from 'react-router-dom';


const PrivateRoute = ({Component}) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const loading = useSelector(state => state.auth.loading);

    return (
        <>
            {((!loading && isAuthenticated) ? <Component /> : <Navigate to = '/login'/>)}
        </>
    )
}

export default PrivateRoute
