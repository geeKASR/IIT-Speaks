import React from 'react';
import './profile-css/ProfileTop.css';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

const ProfileTop = (props) => {
    const navigate = useNavigate();

    const {profile} = props;
    const {user, department, year, location, clubs, bio} = profile;
    const {avatar, name} = user;

    const goBackHandler = () => {
        navigate(-1);
    }

    return (
        <div className='profile-top-container '>
            <h1 className = 'large5' >{name.toUpperCase()}</h1>
            <img src = {avatar} className = 'profile-top-image'></img>
            <p>"{bio}"</p>
            <div className='profile-info-container'>
                <div className='profile-info'>
                    <div>Name</div>
                    <div>{name.toUpperCase()}</div>
                </div>
                <div className='profile-info'>
                    <div>Department</div>
                    <div>{department.toUpperCase()}</div>
                </div>
                <div className='profile-info'>
                    <div>Year</div>
                    <div>{year}</div>
                </div>
                <div className='profile-info'>
                    <div>Location</div>
                    <div>{location}</div>
                </div>
                <ul className='profile-clubs'>
                    {clubs.map((club, index) => {
                        return (<li key={index}>{club}</li>)
                    })}
                </ul>
            </div>
            <p className = 'goback-link' onClick = {goBackHandler}> Go Back </p>
        </div>
    )
}

export default ProfileTop
