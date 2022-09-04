import React, {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Link, Navigate} from 'react-router-dom';
import {getCurrentProfile,deleteProfile} from '../../requests/auth';
import {alertActions} from '../../store/reducers/alert';
import {v4 as uuidv4} from 'uuid';
import {profileActions} from '../../store/reducers/profile';
import Spinner from '../../components/layout/Spinner';
import './Dashboard.css';


const Dashboard = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProfile = async () => {
            const obj = await getCurrentProfile();
            console.log('useEffect');
            console.log(obj);
            if (obj.status === 1) {
                dispatch(profileActions.getProfile(obj.data));
            } else {
                dispatch(profileActions.profileError());
            }
        };
        fetchProfile();
    }, [])

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const profile = useSelector(state => state.profile.profile);
    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.profile.loading);

    if (! isAuthenticated) {
        return <Navigate to="/login"/>
    }

    const deleteHandler = async () =>{
        const obj = await deleteProfile();
        console.log('deleteHandler');
        console.log(obj);
        if(obj.status === 1){
            dispatch(profileActions.clearProfile());
            const id = uuidv4();
            dispatch(alertActions.setAlert({msg: "Profile deleted Successfully", alertType: 'danger', id: id}));
            setTimeout(() => {
                dispatch(alertActions.removeAlert({id: id}));
            }, 3000);
        }
        else{
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

    return(loading && profile === null ? <Spinner/>: <>
        <div className='dashboard-container'>
            <h1 className='dashboard-primary-text'>Dashboard</h1>
            
            <p className='lead'><i className="fa-solid fa-user"></i>  Welcome {
                user && user.name
            }</p>


            {
            profile !== null ? <>
                <div className='dashboard-buttons'>
                    <Link to='/create-post' className='btn2'>Create Post</Link>
                    <Link to='/create-profile' className='btn2'>Update Profile</Link>
                    <Link to='/dashboard' className='btn2 color-red' onClick={deleteHandler}>Delete Profile</Link>
                </div>
            </> : <>
                <p>You have not yet setup a profile, please add some info</p>
                <Link to='/create-profile' className="btn2">
                    Create Profile</Link>
            </>
        } </div>
    </>)
}

export default Dashboard
