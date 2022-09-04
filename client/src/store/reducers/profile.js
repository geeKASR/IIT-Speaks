import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile : null,
    profiles : [],
    loading : true,
    error : {}
}

export const profileSlice = createSlice({
    name : 'profile',
    initialState,
    reducers : {
        getProfile : (state,action) => {
            state.profile = action.payload;
            state.loading = false;
        },
        profileError : (state,action) => {

            state.error = action.payload;
            state.loading = false;
        },
        isLoading : (state,action) => {
            state.loading = true;
        },
        getProfiles : (state,action) => {
            state.profiles = action.payload;
            state.loading = false;
        },
        clearProfiles : (state,action) => {
            state.profiles = [];
            state.loading = false;
        },
        clearProfile(state,action) {
            state.profile = null;
            state.loading = false;
        }
    }
})

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;