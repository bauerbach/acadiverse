import { createMedia } from "@artsy/fresnel";
import React, { Component } from 'react';
import { Container, Image } from 'semantic-ui-react';


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

export default function Error404Component() {
    return (
    <Container as={Media} greaterThan="mobile" className="content">
        <Image size="medium" alt="Shakespeare painting" src="/assets/images/shakespeare-67698_640.svg" />
        <h1>Whither did doth mine page wend?</h1>
        <h2>That's Shakespearean for "Where did my page go?" Really, this page seems to have gone missing. Maybe you should search for whatever it was that you were looking for via the search bar, or just go back to the home page. Or maybe you just made a typo. Make sure to also check the address bar at the top of your browser window!</h2>
        <h3>If you believe that this is a mistake, please contact us about it. We are so sorry for any inconvenience that this may have caused you!</h3>
    </Container>          
    )
}