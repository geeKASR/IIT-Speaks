import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token : localStorage.getItem('token'),
    isAuthenticated : null,
    loading : true,
    user : null
}

export const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        authSuccess : (state,action) => {
            const {token} = action.payload;
            localStorage.setItem('token',token);
            state.isAuthenticated = true;
            state.token = token;
            state.loading = false;
        },
        authFail : (state,action) => {
            
            localStorage.removeItem('token');

            state.isAuthenticated = false;
            state.loading = false;
            state.token = null;
            state.user = null
        },
        userLoaded : (state,action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.loading = false;
        }
    }
})

export const authActions = authSlice.actions;
export default authSlice.reducer;