import { createMedia } from "@artsy/fresnel";
import React from 'react';
import { Container } from 'semantic-ui-react';
import Navigation from '../components/custom_components/navigation.component';
import Footer from '../components/custom_components/footer.component';
import FormattedMessage from 'react-intl';
import jwt_decode from "jwt-decode";
import setAuthToken from "../services/auth.token";


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

const MainComponent = (props) => {
      
    return (
        <main>
            <Container className="content">
                <div id="content">
                    <h1 id="header">
                        Education and training should not be boring.
                    </h1>
                    <h2>
                        Acadiverse is a free gamified learning platform that makes learning much more fun and engaging, Instead of learning through boring lectures and worksheets, you can learn through gamified courses, which take place in Acadiverse Spaces (interactive user-created areas of the game world) and also explore and interact with a large 3D world.
                    </h2>
                    <h2>
                        Users can make their own areas of the game world using the easy-to-use Acadiverse Course Creator, which was designed with simplicity and efficiency in mind.
                    </h2>
                    <h3>
                        Does all of this sound interesting to you? <a href="/about">Learn more about Acadiverse</a>, or log in or sign up by clicking on the Register or Login button on the top right of the page.
                    </h3>             
                </div>
                
            </Container>
        </main>
            
    )
}

export default MainComponent;