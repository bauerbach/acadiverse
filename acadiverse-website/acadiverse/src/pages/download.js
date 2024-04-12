import { createMedia } from "@artsy/fresnel";
import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import Navigation from '../components/custom_components/navigation.component';
import Footer from '../components/custom_components/footer.component';
import DownloadButton from '../components/custom_components/download-button.component';
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

export default function DownloadComponent() {

    return (
        <section>
            <Container as={Media} at="mobile" className="content">  
                Mobile 
            </Container>
            <Container as={Media} greaterThan="mobile" className="content">
                Widescreen
                <h1>Download Acadiverse</h1>
                <h2>Acadiverse for Windows/macOS</h2>
                <p>Acadiverse Desktop Client is a Windows or macOS application that allows not only launching Acadiverse (the actual game), but it also allows you to easily manage your chats, submissions, and downloads all in one place!</p>
                <p>Acadiverse Desktop Client also allows users to access Acadiverse Course Creator, which makes it easy to create courses for player-created areas of the Acadiverse game (called "Acadiverse Spaces")!</p>
                <br />
                <h3>Windows Download: </h3>
                <DownloadButton filePath="https://acadiverse.com/downloads/AcadiverseDesktopClientInstaller.exe" />
                <br />
                <h3>macOS Download: </h3>
                <DownloadButton filePath="https://acadiverse.com/downloads/AcadiverseDesktopClientInstaller.dmg" />
                <h2>Acadiverse for Android/iOS</h2>
                <p>Acadiverse's official mobile apps allow interacting with/managing your submissions on-the-go! Teachers can also use it to view classroom stats and access other tools related to their classes. We also have a mobile version of the Acadiverse game so that students and teachers can play even if they do not have access to a computer!</p>
            </Container>
        </section>   
    )
}