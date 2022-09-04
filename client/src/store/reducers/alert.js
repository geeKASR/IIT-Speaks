import {createSlice} from '@reduxjs/toolkit';


const initialState = [];

export const alertSlice = createSlice({
    name : 'alert',
    initialState,
    reducers : {
        setAlert : (state,action) => {
            const {msg, alertType, id} = action.payload;
            state.push({msg,alertType,id});
        },
        removeAlert : (state,action) => {
            const id = action.payload.id;
            const removeIndex = state.findIndex(alert => alert.id === id);
            if(removeIndex !== -1){
                state.splice(removeIndex,1);
            }
        }
    }
})

export const alertActions = alertSlice.actions;
export default alertSlice.reducer;