import axios from "axios";
import setAuthToken from "./auth.token";
import jwt_decode from "jwt-decode";
import Globals from '../globals';
import { authSlice } from "../redux-slices/authSlice";

const authActions = authSlice.actions;

// Register User
export const signup = (reqUsername, reqPassword, reqEmail, reqAccountType, reqBirthday, history) => dispatch => {
  axios
    .post("/api/auth/signup", {
      username: reqUsername,
      password: reqPassword,
      email: reqEmail,
      accountType: reqAccountType,
      birthday: reqBirthday
    })
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: "GET_ERRORS",
        payload: err.response.data
      })
    );
};

// Login - get user token
export const signin = (reqUsername, reqPassword, history) => dispatch => {
  axios
    .post("/api/users/login", {
      username: reqUsername,
      password: reqPassword
    }, {'Access-Control-Allow-Origin': '*'})
    .then(res => {
      // Save to localStorage

      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      console.log(decoded);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
        dispatch({
          type: "GET_ERRORS",
          payload: err.response.data
        })
      }
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return(dispatch) => {
    dispatch(authActions.setCurrentUser(decoded));
  };
};

// Get user
export const getUser = () => {
  return(dispatch) => dispatch(authActions.getUser());
}

// User loading
export const setUserLoading = () => {
  return {
    type: "USER_LOADING"
  };
};

// Log user out
export const logoutUser = (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(authActions.setCurrentUser({}));
};

export const userHasRole = (username, role, next) => {
  fetch(`${Globals.API_URL}/account/roles/userHasRole?username=${username}&role=${role}`)
  .then((res) => res.json())
  .then((result) => {
    next(result);
  })
}

const AuthService = {
  signup,
  signin,
  setCurrentUser,
  setUserLoading,
  logoutUser,
  userHasRole,
  getUser
};

export default AuthService;