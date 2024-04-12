/**
  * @file Main file for the frontend; contains the root of the app as well as all console messages.
 * @author Bradley Auerbach <bauerbach@gmail.com>
 * @version 1.0.0
 */

import "bootstrap/dist/css/bootstrap.min.css";
import jwt_decode from "jwt-decode";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import setAuthToken from "./services/auth.token";
import store from "./store";
import { createRoot } from 'react-dom/client';
import * as serviceWorker from './serviceWorker'; 

import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";

import NoticeBanner from "./components/custom_components/notice-banner.component";
import App from './App';

//import axios from "axios";

import messages_enUS from "./lang/en-US.json";

import setAuthToken from "./services/auth.token";
import { setCurrentUser, logoutUser } from "./services/auth.service";
import { getAccountInfo } from "./services/account.service";
import jwt_decode from "jwt-decode";

var loggedIn = false;
var loading = false;

require('@formatjs/intl-pluralrules/polyfill')
require('@formatjs/intl-relativetimeformat/polyfill');

if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  if(decoded) {
    store.dispatch(setCurrentUser(decoded));
    const currentTime = Date.now() / 1000
    if (decoded.exp < currentTime) {
      store.dispatch(logoutUser());
    }
  }
}

const root = createRoot(document.getElementById('root'))

function ErrorMessage({error, resetErrorBoundary}) {
  return (
    <NoticeBanner active={true} bannerType="URGENT_NOTICE" header="Error" message={
      <div>
        <p>An error has occurred while displaying this page.</p>
        <p>Details:</p>
        <p>{error.message}</p>
        <p>Please contact support@acadiverse.com to report this issue.</p>
      </div>
    } />
  )
}

const router = (
    <ErrorBoundary FallbackComponent={ErrorMessage} onReset={(details) => {
      
    }}>
      <App />
    </ErrorBoundary>
  );

/*   if (localStorage.jwtToken) {
    store.dispatch(getAccountInfo()).then((res) => {
    root.render(
      router
    );
  });
  } else {
    root.render(
      router
    );
  } */

  


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();