import { createMedia } from "@artsy/fresnel";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import React from "react";
import { Container, Message } from 'semantic-ui-react';
import Navigation from '../../components/custom_components/navigation.component';
import Footer from '../../components/custom_components/footer.component';
import ProfileComponent from '../../components/custom_components/profile.component';


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

export default function ProfilePageComponent(props) {
    const [username, setUsername] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [messageHeader, setMessageHeader] = useState("");
    const [message, setMessage] = useState("");

    function showReportSuccessMessage() {
        setShowMessage(true);
        setMessageHeader("Profile Reported");
        setMessage("Thank you for reporting this profile. The moderators will review your report and take appropriate action if necessary.");
    }

    const router = useRouter();
    useEffect(() => {
        if(router.isReady) {         
            setUsername(router.query.slug);
        }
    }, [router.isReady]);

    if (username === "") { return( <p>Loading...</p>) } else {
        return (
                    <MediaContextProvider>
                        <Container as={Media} greaterThan="mobile" className="content">
                            {showMessage ? <Message positive>
                            <Message.Header>{messageHeader}</Message.Header>
                            {message}
                            </Message> : null}
                            <ProfileComponent user={username} profileReported={showReportSuccessMessage} />
                            
                        </Container>
                    </MediaContextProvider>
        );
    }
}