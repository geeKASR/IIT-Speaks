import React, { useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import './CreateProfile.css'
import {createProfile} from '../../requests/auth';
import {useDispatch, useSelector} from 'react-redux';
import {profileActions} from '../../store/reducers/profile';
import {alertActions} from '../../store/reducers/alert';
import {v4 as uuidv4} from 'uuid';
import Spinner from '../../components/layout/Spinner';

const CreateProfile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(state => state.profile.loading);
    const profile = useSelector(state => state.profile.profile);

    const [formData, setFormData] = React.useState({
        department: '',
        year: '',
        location: '',
        clubs: '',
        bio: ''
    });

    const {
        department,
        year,
        location,
        clubs,
        bio
    } = formData;

    useEffect(()=>{
        console.log(profile);
        if(profile !== null){
            let temp = "";

            if(profile.clubs !== null){
                for(let i = 0; i < profile.clubs.length; i++){
                    temp += profile.clubs[i] + ",";
                }
            }

            setFormData({...formData, department: profile.department, year: profile.year, location: profile.location, clubs: temp, bio: profile.bio});
        }
    },[]);


    const onChangeHandler = (e) => {
        setFormData(prevState => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        dispatch(profileActions.isLoading());
        const obj = await createProfile(formData);

        console.log('create-profile onSubmitHandler');
        console.log(obj);

        if (obj.status === 1) {
            dispatch(profileActions.getProfile(obj.data));

            const id = uuidv4();
            dispatch(alertActions.setAlert({msg: "Profile Updated", alertType: 'success', id: id}));
            setTimeout(() => {
                dispatch(alertActions.removeAlert({id: id}));
            }, 3000);
            
        } else {
            dispatch(profileActions.profileError(obj.data.errors));

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

        // Navigating back to dashboard
        navigate('/dashboard');
    }


    return (<> {
        isLoading? <Spinner/> : 
            <div className="create-profile-container">
                <h1 className="large text-primary">
                    Update Your Profile
                </h1>
                <p className="lead">
                    <i className="fas fa-user"></i>
                    Let's get some information to make your
                                                            profile stand out
                </p>
                <small>* = required field</small>
                <form className="form"
                    onSubmit={onSubmitHandler}>
                    <div className="form-group">
                        <select name="department"
                            value={department}
                            onChange={onChangeHandler}>
                            required
                            <option value="0">* Select Your Department</option>
                            <option value="Biochemical">Biochemical</option>
                            <option value="Biomedical">Biomedical</option>
                            <option value="Ceramic">Ceramic</option>
                            <option value="Chemical">Ceramic</option>
                            <option value="Civil">Civil</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Engineering Physics">Engineering Physics</option>
                            <option value="Material Science">Material Science</option>
                            <option value="Mathematics and Computing">Mathematics and Computing</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Metallurgy">Metallurgy</option>
                            <option value="Mining">Mining</option>
                            <option value="Pharmaceutical">Pharmaceutical</option>
    
                        </select>
                        <small className="form-text">Which department are you from ?</small>
                    </div>
                    <div className="form-group">
                        <input type="number" placeholder="*Year" name="year" min="1" max="5" required
                            value={year}
                            onChange={onChangeHandler}/>
                        <small className="form-text">Which year are you in?</small>
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="Ayabhatta A-223" name="location"
                            value={location}
                            onChange={onChangeHandler}/>
                        <small className="form-text">Where to find you?
                        </small>
                    </div>
    
                    <div className="form-group">
                        <textarea placeholder="Joint-Sec in Film & Media Council" name="clubs"
                            value={clubs}
                            onChange={onChangeHandler}></textarea>
                        <small className="form-text">Are you involved with any clubs?</small>
                        <small className="form-text">!! ( different club related details should be seperated with a comma "," )</small>
                    </div>
    
                    <div className="form-group">
                        <textarea placeholder="A short bio of yourself" name="bio"
                            value={bio}
                            onChange={onChangeHandler}></textarea>
                        <small className="form-text">Tell us a little about yourself</small>
                    </div>
                    <input type="submit" className="btn3"/>
                    <Link to='/dashboard'>Go Back</Link>
                </form>
            </div>}
        </>)
    }

    export default CreateProfile
