import { accountSlice } from "../redux-slices/accountSlice";
import store from "../store";

import axios from "axios";
import Globals from '../globals';
import setAuthToken from "../services/auth.token";
import jwt_decode from "jwt-decode";

const accountActions = accountSlice.actions;

export const getUsernameFromId = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${Globals.API_URL}/account/infoFromId/?id=${id}`)
    .then((res) => res.json())
    .then((accountInfo) => 
      {
        if(accountInfo.statusCode === 404) {
          reject("DELETED");
        } else {        
          resolve(accountInfo.username);
        }     
      })
    });
}

export const getAccountInfo = () => (dispatch) => { 
  var accountInfo = {};

  const token = localStorage.jwtToken;
  setAuthToken(token);

  const decoded = jwt_decode(token);
  const currentUsername = decoded.name;
  fetch(`${Globals.API_URL}/account/info/?username=${currentUsername}`, { headers: { "x-access-token": token }})
    .then((res) => res.json())
    .then((res) => 
    {
      if(res.message != null)
      {
        
      dispatch({
        type: "GET_ERRORS",
        payload: res.message
      });
      } else {
        accountInfo = res;
      }
      dispatch(accountActions.accountInfoLoaded(accountInfo));
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: "GET_ERRORS",
        payload: error
      });
    })
}

export const getBasicAccountInfo = () => {
  return new Promise((resolve, reject) => {
        const token = localStorage.jwtToken;
        setAuthToken(token);
        
        const decoded = jwt_decode(token);
        const currentUsername = decoded.name;
        fetch(`${Globals.API_URL}/account/getBasicInfo/?username=${currentUsername}`, { headers: { "x-access-token": token }})
          .then((res) => res.json())
          .then((data) => 
          {
            if(data.message != null)
            {
              reject(data);
            } else {
              resolve(data);
            }
        })
        .catch(error =>
           reject(error)
        )
  })
}

export const getPMs = () => {
  return new Promise((resolve, reject) => {
        const token = localStorage.jwtToken;
        setAuthToken(token);
        
        const decoded = jwt_decode(token);
        const currentUsername = decoded.name;
        fetch(`${Globals.API_URL}/account/info/getPMs/?username=${currentUsername}`, { headers: { "x-access-token": token }})
          .then((res) => res.json())
          .then((data) => 
          {
            if(data.message != null)
            {
              reject(data);
            } else {
              resolve(data);
            }
        })
        .catch(error =>
           reject(error)
        )
  })
}

export const getNotifications = () => {
  return new Promise((resolve, reject) => {
        const token = localStorage.jwtToken;
        setAuthToken(token);
        
        const decoded = jwt_decode(token);
        const currentUsername = decoded.name;
        fetch(`${Globals.API_URL}/account/info/getNotifications/?username=${currentUsername}`, { headers: { "x-access-token": token }})
          .then((res) => res.json())
          .then((data) => 
          {
            if(data.message != null)
            {
              reject(data);
            } else {
              resolve(data);
            }
        })
        .catch(error =>
           reject(error)
        )
  })
}

const AccountService = {getUsernameFromId, getAccountInfo, getBasicAccountInfo, getPMs, getNotifications};

export default AccountService;