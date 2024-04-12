import { combineReducers } from 'redux'
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { authSlice } from "./redux-slices/authSlice";
import { accountSlice } from "./redux-slices/accountSlice";
import { createWrapper } from "next-redux-wrapper";

const initialState = {};

const middleware = [thunk];

export const makeStore = () => {
    return configureStore({reducer: {
    auth: authSlice.reducer,
    account: accountSlice.reducer
}})};

const wrapper = createWrapper(makeStore);

export default wrapper;