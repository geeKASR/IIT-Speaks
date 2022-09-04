import React, {useEffect} from 'react'
import {getAllProfiles} from '../../requests/auth';
import Spinner from '../layout/Spinner';
import {useDispatch, useSelector} from 'react-redux';
import {profileActions} from '../../store/reducers/profile';
import {v4 as uuidv4} from 'uuid';
import { alertActions } from '../../store/reducers/alert';
import './profiles-css/Profiles.css';
import ProfileItem from './ProfileItem';

const Profiles = () => {

    const isLoading = useSelector(state => state.profile.loading);
    const profiles = useSelector(state => state.profile.profiles);
    const dispatch = useDispatch();

    useEffect(() => {

        const fetchProfiles = async () => {

            dispatch(profileActions.clearProfile());
            dispatch(profileActions.clearProfiles());
            dispatch(profileActions.isLoading());

            const obj = await getAllProfiles();
            if (obj.status === 1) {
                dispatch(profileActions.getProfiles(obj.data));
            } else {
                dispatch(profileActions.clearProfiles());

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
        };
        fetchProfiles();
    }, []);
    return (
        <> {
            isLoading ? (
                <Spinner/>) : 
                <div className='profiles-container'>
                    <h1 className='large2 text-primary '>People</h1>
                    <p className='lead'>
                        <i className='fab fa-connectdevelop'/> Browse and connect with other students
                    </p>
                    {profiles.length > 0 ? (profiles.map(profile =>(
                        <ProfileItem key={profile._id} profile={profile}/>
                    ))) : (<p>No profiles found...</p>)}
                </div>
        } </>
    )
}

export default Profiles
