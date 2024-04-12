//This is a template for pages and is not meant to be imported anywhere.

import { createMedia } from "@artsy/fresnel";
import React, { Component } from 'react';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container } from 'semantic-ui-react';
import Navigation from '../components/custom_components/navigation.component';
import Footer from '../components/custom_components/footer.component';
import setAuthToken from "../services/auth.token";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import AccountService from "../services/account.service";
import AuthService from "../services/auth.service";
import store from "../store";
import wrapper from '../store';
import { logoutUser } from "../services/auth.service";
import PropTypes from "prop-types";
import NoticeBanner from "../components/custom_components/notice-banner.component";
//import { FormattedMessage } from 'react-intl';


const AppMedia = createMedia({
    breakpoints: {
        mobile: 320,
        tablet:768,
        computer: 992,
        largeScreen: 1200,
        widescreen: 1920
    }
});

const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;

const [someVar, setSomeVar] = useState("")

export default function Page() {
    const token = localStorage.jwtToken;
    setAuthToken(token);
    const decoded = jwt_decode(token);
    fetch('http://localhost:4000/api/[route]?[query]', { 
          method: "PUT", 
          headers: { "Content-Type": "application/json", "x-access-token": token, "username": decoded.name},
          body: JSON.stringify({
              "reputationPoints": reputationPoints,
              "money": money
          })})
    .then((res) => res.json())
    .then((res) => {
          // Do something with the response.
    })
    .catch((err) => {
        alert(err);
    });
    return (
            <MediaContextProvider>
                <Container as={Media} at="mobile" className="content">  
                    
                </Container>
                <Container as={Media} greaterThan="mobile" className="content">

                    
                </Container>
            </MediaContextProvider> 
    )
}