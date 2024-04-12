import { createMedia } from "@artsy/fresnel";
import React, { Component } from 'react';
import { logoutUser } from "../../services/auth.service";
import setAuthToken from "../../services/auth.token";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Header, Message, Loader, Container } from 'semantic-ui-react';
import Navigation from '../components/custom_components/navigation.component';
import Footer from '../components/custom_components/footer.component';

import AccountService from "../../services/account.service";
import AccountSettingsComponent from "../components/custom_components/account-settings.component";

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

function AccountSettingsPage(props) {

document.title = "Account Settings - Acadiverse";
  return (
		<Navigation activeItem = "">
			{props.auth.isAuthenticated? <MediaContextProvider>
                
                    <Media at="mobile" className="content">
                      <Container>
                        <AccountSettingsComponent
                            username={props.account.accountInfo.username}
                            email={props.account.accountInfo.email}
                            displayName={props.account.accountInfo.displayName}
                            profileBio={props.account.accountInfo.profileBio}
                            password={props.account.accountInfo.password}
                            gender={props.account.accountInfo.gender}
                            genderPronoun={props.account.accountInfo.genderPronoun}
                            notifyMentioned={props.account.accountInfo.notifyMentioned}
                            notifyAchievementReceived={props.account.accountInfo.notifyAchievementReceived}
                            notifySubmissionFeatured={props.account.accountInfo.notifySubmissionFeatured}
                            notifySubmissionComment={props.account.accountInfo.notifySubmissionComment}
                            notifySubmissionUpvote={props.account.accountInfo.notifySubmissionUpvote}
                            notifyPMReceived={props.account.accountInfo.notifyPMReceived}
                            profileImageURL={props.account.accountInfo.profileImageURL}
                            usesGravatar={props.account.accountInfo.usesGravatar}
                        />
                        
                      </Container>              
                    </Media>
                    <Media greaterThan="mobile" className="content">
                      <Container>
                        <AccountSettingsComponent
                            username={props.account.accountInfo.username}
                            email={props.account.accountInfo.email}
                            displayName={props.account.accountInfo.displayName}
                            profileBio={props.account.accountInfo.profileBio}
                            password={props.account.accountInfo.password}
                            gender={props.account.accountInfo.gender}
                            genderPronoun={props.account.accountInfo.genderPronoun}
                            notifyMentioned={props.account.accountInfo.notifyMentioned}
                            notifyAchievementReceived={props.account.accountInfo.notifyAchievementReceived}
                            notifySubmissionFeatured={props.account.accountInfo.notifySubmissionFeatured}
                            notifySubmissionComment={props.account.accountInfo.notifySubmissionComment}
                            notifySubmissionUpvote={props.account.accountInfo.notifySubmissionUpvote}
                            notifyPMReceived={props.account.accountInfo.notifyPMReceived}
                            profileImageURL={props.account.accountInfo.profileImageURL}
                            usesGravatar={props.account.accountInfo.usesGravatar}
                        />
                        
                      </Container>              
                    </Media>
                </MediaContextProvider> : <Message error>
                    <Header>Error</Header>
                    You must be logged in to view this page.
                </Message>}
			
		</Navigation>
  )
}
AccountSettingsPage.propTypes = {
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    account: state.account
  });
  
  export default connect(
    mapStateToProps,
    { logoutUser }
  )(AccountSettingsPage);