import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';


import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-form/CreateProfile';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Post from './components/posts/Post';
import CreatePost from './components/post-form/PostForm';

// Redux
import {Provider} from 'react-redux';
import {store} from './store/store';

import setAuthToken from './utils/setAuthToken';
import {loadUser} from './requests/auth';
import {authActions} from './store/reducers/auth';
import PrivateRoute from './components/routing/PrivateRoute';
import Posts from './components/posts/Posts';

if (localStorage.getItem('token') !== null) {
    setAuthToken(localStorage.getItem('token'));
}

const App = () => {
    useEffect(() => {
        const fetchUser = async () => {
            const obj = await loadUser();
            if (obj.status === 1) {
                store.dispatch(authActions.userLoaded(obj.data));
            } else {
                store.dispatch(authActions.authFail());
            }
        }
        fetchUser();
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <div className='parent-container'>
                    <Navbar/>
                    <div className='alert-container'>
                        <Alert/>
                    </div>
                    <Routes>
                        <Route path="/"
                            element={<Landing/>}/>
                        <Route path="/profiles"
                            element={<Profiles/>}/>
                        <Route path='/login'
                            element={<Login/>}/>
                        <Route path='/profile/:user_id'
                            element={<Profile />}/>
                        <Route path='/register'
                            element={<Register/>}/>
                        <Route path='/dashboard'
                            element={<PrivateRoute Component={Dashboard}/>}/>
                        <Route path='/create-profile'
                            element={<PrivateRoute Component={CreateProfile}/>}/>
                        <Route path='/create-post'
                            element={<PrivateRoute Component={CreatePost}/>}/>
                        <Route path='/posts'
                            element={<PrivateRoute Component={Posts}/>}/>
                        <Route path='/posts/:post_id'
                            element={<PrivateRoute Component={Post}/>}/>
                    </Routes>
                </div>
            </Router>
        </Provider>
    )
}
export default App;
