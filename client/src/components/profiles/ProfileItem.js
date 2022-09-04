import React from 'react'
import { useNavigate } from 'react-router-dom';
import { profileActions } from '../../store/reducers/profile';
import { useDispatch } from 'react-redux';
import './profiles-css/ProfileItem.css'

const ProfileItem = (props) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {profile} = props;
    const {user, department, year } = profile;
    const { name, avatar,_id} = user;

    const onClickHandler = () => {
        
        dispatch(profileActions.clearProfiles());
        navigate(`/profile/${_id}`);
    }
    return (
        <div className='profile-item-container'>
            <img src = {avatar} alt = "profile-pic" className = 'profile-photo'/>
            <div className='profile-information-container'>
                <div className='large3'>{name.toUpperCase()}
                    <button className='view-profile-button' onClick={onClickHandler}>View Profile</button>
                </div>
                <div className='large4'>{department.toUpperCase()} - PART {year}</div>
            </div>
        </div>
    )
}

export default ProfileItem
