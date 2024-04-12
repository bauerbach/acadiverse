import {createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      const userData = action.payload;
      state.isAuthenticated = !isEmpty(userData);
      state.user = userData;
    },
    userLoading(state, action) {
      state.loading = true;
    },
    getUser(state, action) {
      return { ...state, ...action.payload };
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    },
  }
});
