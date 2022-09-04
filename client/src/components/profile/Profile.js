import React, { useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../requests/auth';
import { profileActions } from '../../store/reducers/profile';
import { alertActions } from '../../store/reducers/alert';
import {v4 as uuidv4} from 'uuid';
import { useParams } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import './profile-css/Profile.css';

const Profile = () => {
    const dispatch = useDispatch();

    const {user_id} = useParams();
    const isLoading = useSelector(state => state.profile.isLoading);
    const profile = useSelector(state => state.profile.profile);

    useEffect(()=>{
        const fetchUserById = async () =>{
            dispatch(profileActions.isLoading());

            const obj = await getProfileById(user_id);

            console.log('Profile by id useEffect');
            console.log(obj);

            if(obj.status === 1){
                dispatch(profileActions.getProfile(obj.data));
            }else{
                dispatch(profileActions.clearProfile());

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
        fetchUserById();
    },[]);


    return (<>
        { (profile === null || isLoading) ? <Spinner/> : <>
            <div className='profile-by-id-container'>
                <ProfileTop profile={profile}/>
            </div>
        </> }
        </>
    )
}

export default Profile
