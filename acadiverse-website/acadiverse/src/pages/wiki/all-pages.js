import { createMedia } from "@artsy/fresnel";
import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import Navigation from '../components/custom_components/navigation.component';
import Footer from '../components/custom_components/footer.component';
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

export default function WikiPagesComponent() {
    document.title = "Page List - Acadiverse Wiki";
    return (
            
                
                <MediaContextProvider>
                <Container as={Media} at="mobile" className="content">  
                    
                </Container>
                <Container as={Media} greaterThan="mobile" className="content">

                    
                </Container>
            </MediaContextProvider>
                
            </Navigation>
            
    )
}