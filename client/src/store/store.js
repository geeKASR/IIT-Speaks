// import {createStore,applyMiddleware} from 'redux';
// import {composeWithDevTools} from 'redux-devtools-extension';
// import thunk from 'redux-thunk';

// const initialState = {};

// const middleware = [thunk];

// const store = createStore(rootReducer,initialState, composeWithDevTools(applyMiddleware(...middleware)));
// export default store;


import  rootReducer from './reducers';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

export const store = configureStore({
    reducer : rootReducer,
    middleware: getDefaultMiddleware(),
    // do not forget this
    devTools: process.env.NODE_ENV !== 'production',
});