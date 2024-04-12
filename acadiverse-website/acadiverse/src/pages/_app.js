import React from "react";
import { useState, useEffect, Suspense } from "react";
import { Provider } from "react-redux";
import wrapper from '../store';
import { createWrapper } from 'next-redux-wrapper';
import "bootstrap/dist/css/bootstrap.min.css";
import jwt_decode from "jwt-decode";
import { ErrorBoundary } from "react-error-boundary";
import setAuthToken from "../services/auth.token";

import IntlProvider from "react-intl";
import { setCurrentUser, logoutUser } from "../services/auth.service";

import Globals from "../globals";

import Navigation from "../components/custom_components/navigation.component";
import Footer from "../components/custom_components/footer.component";

import "../styles/global.css";
import 'semantic-ui-css/semantic.min.css'

import messages_enUS from "../lang/en-US.json";

//Print a random message as well as a warning against entering text into the console.

const randomMessages = [
  "Help! Help! I'm trapped in a log message factory!",
  "What is a programmer's favorite drink? Java!",
  "What is a sailor's favorite programming language? C!",
  "Are you interested in programming? Check out the programming courses on Acadiverse!"
]

const {log} = console;

log(randomMessages[Math.floor((Math.random() * randomMessages.length))]);
log("");
log("");
log('%cWARNING!', 'color: red; font-size: 50px');
log('%cDo not paste anything here, even if someone asked you to!', 'color: red; font-size: 25px');
log('%cPasting code here may give hackers and other malicious users access to your account!', 'color: red; font-size: 25px');
log("");
log("");

var loading = true;

const MyApp = ({Component, pageProps}) => {
  const [error, setError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { store } = wrapper.useWrappedStore({});

  const messages = {
    'en-US': messages_enUS
  };

  function handleErrorChange(e) {
    loading = false;
  }

  function pingServer() {
    return new Promise((resolve) => {
      fetch(Globals.API_URL)
        .then((response) => {
          loading = false;
          setError(false);
        })
        .catch((error) => {
          loading = false;
          console.log(error);
          setError(true);
        });
    });
  }

  function ErrorMessage({error, resetErrorBoundary}) {
    return (
        <div>
          <p>An error has occurred while displaying this page.</p>
          <p>Details:</p>
          <p>{error.message}</p>
          <p>Please contact support@acadiverse.com to report this issue.</p>
        </div>
    )
  }

  useEffect(() => {
    pingServer();
    setIsClient(true)
  }, []);


    if(typeof window !== 'undefined') {
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
    }


        return (
          <>{isClient ? <Suspense fallback="Loading..."><Provider store={store}>
            <Navigation activeItem="">
                <Component {...pageProps} />
            </Navigation>
            <Footer />
          </Provider>
          </Suspense> : <Component {...pageProps} />}</>
      );
  }

export default wrapper.withRedux(MyApp);