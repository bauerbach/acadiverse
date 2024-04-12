import { createMedia } from "@artsy/fresnel";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import Navigation from '../components/custom_components/navigation.component';
import Footer from '../components/custom_components/footer.component';
import NoticeBanner from '../components/custom_components/notice-banner.component';
import { FormattedMessage } from 'react-intl';
import Globals from '../../globals';


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

export default function ModeratorDashboardComponent() {
    return (
    
        
        <MediaContextProvider>
            <Container fluid as={Media} at="mobile" className="content">  
                Mobile 
            </Container>

            <Container fluid as={Media} at="tablet" className="content">
                Tablet
            </Container>

            <Container fluid as={Media} at="computer" className="content">
                Computer
            </Container>

            <Container fluid as={Media} at="largeScreen" className="content">
                Large Screen
            </Container>

            <Container fluid as={Media} greaterThanOrEqual="widescreen" className="content">
                Widescreen
            </Container>
        </MediaContextProvider>
        
    </Navigation>
    )
}