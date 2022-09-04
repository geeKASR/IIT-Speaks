import axios from 'axios';

import setAuthToken from '../utils/setAuthToken';


//Register User
export const register = async ({name, email, password}) => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, email, password});

    try {
        const res = await axios.post('http://localhost:5000/api/user', body, config);

        return {data : res.data, status : 1};

    } catch (err) {

        const errors = err.response.data.errors;

        return {data : errors, status : 0};

    }
}

//Load User info in Redux
export const loadUser = async () => {
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
    try{
        const res = await axios.get('http://localhost:5000/api/auth');

        return {data : res.data, status : 1};
    }
    catch(err){
        return {data : err.response.data, status : 0};
    }
}


// Login User
export const login = async ({email, password}) => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({email, password});

    try {
        const res = await axios.post('http://localhost:5000/api/auth', body, config);

        return {data : res.data, status : 1};

    } catch (err) {

        const errors = err.response.data.errors;

        return {data : errors, status : 0};

    }
}


//get profile 

export const getCurrentProfile = async () => {
    try{
        const res = await axios.get('http://localhost:5000/api/profile/me');

        return {data : res.data, status : 1};
    }catch(err){
        const errors = err.response.data.errors;
        
        return {data : errors , status : 0};
    }
}

//get all profiles

export const getAllProfiles = async () => {
    try{
        const res = await axios.get('http://localhost:5000/api/profile');

        return {data : res.data, status : 1};
    }
    catch(err){
        const errors = err.response.data.errors;

        return {data : errors , status : 0};
    }
}

//get profile by user id

export const getProfileById = async (id) => {
    try{
        const res = await axios.get(`http://localhost:5000/api/profile/user/${id}`);

        return {data : res.data, status : 1};
    }
    catch(err){
        const errors = err.response.data.errors;

        return {data : errors , status : 0};
    }
} 

//Create Profile

export const createProfile = async (formData) => {
    try{
        const config = {
            headers : {
                'Content-Type' : 'application/json'
            }
        };

        const res = await axios.post('http://localhost:5000/api/Profile', formData, config);

        return {data : res.data, status : 1};
    }
    catch(err){
        const errors = err.response.data.errors;
        return {data : errors, status : 0};
    }
}

//Delete Profile

export const deleteProfile = async () => {
    if(window.confirm('Are you sure? This can NOT be undone!')){
        try{
            const res = await axios.delete('http://localhost:5000/api/profile');

            return {data : res.data, status : 1};
        }catch(err){
            const errors = err.response.data.errors;
            return {data : errors, status : 0};
        }
    }
}

//get all Posts

export const getPosts = async () => {
    try{
        const res = await axios.get('http://localhost:5000/api/posts');

        return {data : res.data, status : 1};
    }catch(err){
        const errors = err.response.data.errors;
        return {data : errors, status : 0};
    }
}

//get post by post id

export const getPostById = async (id) => {
    try{
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);

        return {data : res.data, status : 1};
    }
    catch(err){
        const errors = err.response.data.errors;

        return {data : errors , status : 0};
    }
} 

//like a post

export const likePost = async (id) => {
    try{
        const res = await axios.put(`http://localhost:5000/api/posts/like/${id}`);

        if(res.data.errors) return {data : res.data.errors, status : 0};
        
        return {data : res.data, status : 1};
    }
    catch(err){
        const errors = err.response.data.errors;

        return {data : errors , status : 0};
    }
}

//dislike a post

export const dislikePost = async (id) => {
    try{
        const res = await axios.put(`http://localhost:5000/api/posts/dislike/${id}`);

        if(res.data.errors) return {data : res.data.errors, status : 0};

        return {data : res.data, status : 1};
    }
    catch(err){
        const errors = err.response.data.errors;

        return {data : errors , status : 0};
    }
}

//unlike a post
export const unlikePost = async (id) => {
    try{
        const res = await axios.put(`http://localhost:5000/api/posts/unlike/${id}`);

        return {data : res.data, status : 1};
    }
    catch(err){
        const errors = err.response.data.errors;

        return {data : errors , status : 0};
    }
} 

//undislike a post
export const undislikePost = async (id) => {
    try{
        const res = await axios.put(`http://localhost:5000/api/posts/undislike/${id}`);

        return {data : res.data, status : 1};
    }
    catch(err){
        const errors = err.response.data.errors;

        return {data : errors , status : 0};
    }
}

//add a comment

export const addComment = async (text,id) =>{
    try{
        const config = {
            headers : {
                'Content-Type' : 'application/json'
            }
        };

        const body = JSON.stringify({text : text});
        const res = await axios.post(`http://localhost:5000/api/posts/comment/${id}`, body, config);
        
        console.log(res);

        return {data : res.data, status : 1};
    }catch(err){
        const errors = err.response.data.errors;

        return {data : errors, status : 0};
    }
}

//delete a comment 

export const removeComment = async (postId, commentId) => {
    if(window.confirm('Are you sure? This can NOT be undone!')){
        try{
            const res = await axios.delete(`http://localhost:5000/api/posts/comment/${postId}/${commentId}`);
            
            if(res.data.errors) return {data : res.data.errors, status : 0};
            return {data : res.data, status : 1};
        }catch(err){
            const errors = err.response.data.errors;

            return {data : errors, status : 0};
        }
    }
}

//remove a post

export const removePost = async (postId) => {
    if(window.confirm('Are you sure? This can NOT be undone!')){
        try{
            const res = await axios.delete(`http://localhost:5000/api/posts/${postId}`);

            if(res.data.errors) return {data : res.data.errors, status : 0};
            return {data : res.data, status : 1};
        }catch(err){
            const errors = err.response.data.errors;

            return {data : errors, status : 0};
        }
    }
}

//create a post

export const addPost = async (formData) => {
    try{
        const config = {
            headers : {
                'Content-Type' : 'multipart/form-data'
            }
        };
        console.log('hello');

        const res = await axios.post('http://localhost:5000/api/posts', formData, config);

        console.log(res);

        return {data : res.data, status : 1};
    }
    catch(err){
        const errors = err.response.data.errors;
        return {data : errors, status : 0};
    }
}