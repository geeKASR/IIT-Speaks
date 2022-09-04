import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    post: null,
    loading: true,
    error: {}
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        getPosts : (state,action) =>{
            state.posts = action.payload;
            state.loading = false;
        },
        postError : (state,action) =>{
            state.error = action.payload;
            state.loading = false;
        },
        isLoading : (state,action) =>{
            state.loading = true;
        },
        clearPosts : (state,action) =>{
            state.posts = [];
        },
        getPost : (state,action) =>{
            state.post = action.payload;
            state.loading = false;
        },
        addPost : (state,action) =>{
            state.posts.unshift(action.payload);
            state.loading = false;
        },
        removePost : (state,action) =>{
            state.posts = state.posts.filter(post => post._id !== action.payload);
            state.loading = false;
        },
        likePost : (state,action) =>{
            state.post.likes = action.payload;
            state.loading = false;
        },
        unlikePost : (state,action) =>{
            state.post.likes = action.payload;
            state.loading = false;
        },
        dislikePost : (state,action) =>{
            state.post.dislikes = action.payload;
            state.loading = false;
        },
        undislikePost : (state,action) =>{
            state.post.dislikes = action.payload;
            state.loading = false;
        },
        addComment : (state,action) =>{
            state.post.comments = action.payload;
            state.loading = false;
        },
        removeComment : (state,action) =>{
            state.post.comments = action.payload;
            state.loading = false;
        }
        
    }
});

export default postSlice.reducer;
export const postActions = postSlice.actions;