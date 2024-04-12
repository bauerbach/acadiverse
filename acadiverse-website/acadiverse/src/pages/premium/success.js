import { createMedia } from "@artsy/fresnel";
import React, { Component } from 'react';
import { Container, List, Header } from 'semantic-ui-react';
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

export default function PremiumSuccessComponent () {
    document.title = "Thank You - Acadiverse";
    
    return (
        
            
            <MediaContextProvider>
                <Container as={Media} at="mobile" className="content">  
                    
                </Container>

                <Container as={Media} greaterThan="mobile" className="content">
                    <main>
                    <h1>Thank you for subscribing!</h1>
                    <h2 as="h2">You now have access to the following features:</h2>
                    <ul>
                        <li>
                            <h3>Subscriber Badge</h3>A special badge on your profile to show your support.
                        </li>
                        <li>
                            <h3>No Ads</h3>Use Acadiverse without interruptions or distractions from ads.
                        </li>
                        <li>
                            <h3>Access to the Subscriber Lounge</h3>This special Acadiverse Space is a bustling community full of wonderful places to hang out with other subscribers.
                        </li>
                        <li>
                            <h3>Subscriber Set</h3>Show your support in-game by equipping your avatar with these special items.
                        </li>
                        <li>
                            <h3>Monthly Acadicoins</h3>Get free Acadicoins every month you are subscribed for.
                        </li>
                    </ul>
                    </main>
                    
                </Container>
            </MediaContextProvider>
            
        </Navigation>
    )
}