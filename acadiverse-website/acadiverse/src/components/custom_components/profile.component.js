import React, { Component } from 'react';
import { useState, useEffect } from "react";
import Gravatar from 'react-gravatar';
import { Button, Image, Icon, Checkbox, Container, Header, Message, Modal } from 'semantic-ui-react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import setAuthToken from "../../services/auth.token";
import jwt_decode from "jwt-decode";
import Globals from "../../globals";

import ReportForm from "../acadiverse-web-app/report-form";
import BanAccountComponent from "../modals/ban-account.component";
import WarnUserComponent from "../modals/warn-user.component";

//import { FormattedMessage } from 'react-intl';


function ProfileComponent(props) {
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [birthday, setBirthday] = useState("");
  const [age, setAge] = useState(12);
  const [accountCreationDate, setAccountCreationDate] = useState("");
  const [lastActive, setLastActive] = useState("");
  const [reputationPoints, setReputationPoints] = useState(0);
  const [money, setMoney] = useState(0);
  const [isCurrentUsersProfile, setIsCurrentUsersProfile] = useState(false);
  const [currentUserIsModerator, setCurrentUserIsModerator] = useState(false);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [adminBadge, setAdminBadge] = useState(false);
  const [moderatorBadge, setModeratorBadge] = useState(false);
  const [alphaTesterBadge, setAlphaTesterBadge] = useState(false);
  const [betaTesterBadge, setBetaTesterBadge] = useState(false);
  const [backerBadge, setBackerBadge] = useState(false);
  const [subscriberBadge, setSubscriberBadge] = useState(false);
  const [personalizedBadge, setPersonalizedBadge] = useState(false);
  const [isUserBanned, setIsUserBanned] = useState(false);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [userIsBuddy, setUserIsBuddy] = useState(false);
  const [userCanPublish, setUserCanPublish] = useState(true);
  const [userCanChat, setUserCanChat] = useState(true);
  const [userCanComment, setUserCanComment] = useState(true);
  const [userCanUseForum, setUserCanUseForum] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState("/images/profile_default.svg");
  const [usesGravatar, setUsesGravatar] = useState(false);
  const [genderPronoun, setGenderPronoun] = useState("they/them");
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [buddies, setBuddies] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  function reportFormSubmitted(e) {
    setReportModalOpen(false);
    this.props.profileReported();
  }

  function openReportModal(e) {
    setReportModalOpen(true);
  }

  function openBanModal(e) {
    setBanModalOpen(true);
  }

  function openWarningModal(e) {
    setWarningModalOpen(true);
  }

  function unbanAccount()
  {
    if(window.confirm("Are you sure you wish to unban the account \"" + username + "\"?")) {
      const token = localStorage.jwtToken;
      setAuthToken(token);
      
      const decoded = jwt_decode(token);
      const currentUsername = decoded.name;
      fetch(`${Globals.API_URL}/auth/unbanAccount?username=${username}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json", "x-access-token": token, "username": currentUsername }}).then((res) => res.json())
        .then(res => {
            if(res.success) {
                window.location.reload(false);
            } else {
                alert("Cannot unban this account for the following reason: " + res.message);
            }
        });
    }
  }

  useEffect(() => {
      if (props.auth.isAuthenticated) {
      setLoggedInUser(props.account.accountInfo.username);
      setCurrentUserIsModerator(props.account.accountInfo.roles.includes("moderators"))
      setCurrentUserIsAdmin(props.account.accountInfo.roles.includes("admins"))
      }
      
      setUsername(props.user);
      fetch(`${Globals.API_URL}/account/info/?username=${props.user}`)
      .then((res) => res.json())
      .then((data) =>
      {
          if(data.statusCode === 404) {
              setError(data.message);
          } else {
            var birthdayDate = "";
            var dateArray = data.birthdayDate.split("-");
            birthdayDate = `${Globals.MONTHS[dateArray[0] - 1]} ${dateArray[1] < 10 ? dateArray[1].substring(1): dateArray[1]}`;
            setId(data.id);
            setEmail(data.email);
            setDisplayName(data.displayName);
            setProfileBio(data.profileBio);
            setAge((new Date()).getFullYear() - new Date(data.birthday).getFullYear());
            setBirthday(birthdayDate);
            setBuddies(data.buddies);
            setLastActive(data.lastActive);
            setGenderPronoun(data.genderPronoun);
            setReputationPoints(data.reputationPoints);
            setMoney(data.money);
            setIsUserBanned(data.accountBanned);
            setUserCanPublish(data.canPublish);
            setUserCanChat(data.canChat);
            setUserCanComment(data.canComment);
            setUserCanUseForum(data.canUseForum);
            setProfileImageUrl(data.profileImageUrl);
            setUsesGravatar(data.usesGravatar);
            setIsCurrentUsersProfile(username === loggedInUser);
          }
      })
      setLoading(false);
    }, []);
  if(loading) { return(<p>Loading...</p>)} else {
    document.title = displayName + " (@" + username + ") - Acadiverse";
    if(error === "") {
      return (
        <Container fluid>
            <Modal open={reportModalOpen} className="report-modal">
              <Header>Report User</Header>
              <ReportForm 
              username={loggedInUser} 
              content={props.user} 
              context="user" 
              contentURL={Globals.DOMAIN + "/profile?use=" + props.user} 
              reportSent={() => {reportFormSubmitted()}} />
            </Modal>
            <Modal open={banModalOpen} className="ban-modal">
              <Header>Ban Account</Header>
              <BanAccountComponent
              username={loggedInUser}
              otherUsername={props.user}  />
            </Modal>
            <Modal open={warningModalOpen} className="ban-modal">
              <Header>Warn User</Header>
              <WarnUserComponent
              username={loggedInUser}
              otherUsername={props.user}  />
            </Modal>
            <Container fluid>
                {isUserBanned?<Message error>
                  <Message.Header>This account is banned.</Message.Header>
                  <p>This user has been banned from Acadiverse for violations of the Terms of Service or Code of Conduct.</p>
                  </Message>: null}
                {!(userCanPublish || userCanChat || userCanComment || userCanUseForum) && !isUserBanned? <Message error>
                  <Message.Header>This user is restricted.</Message.Header>
                  <p>This user is blocked from using the following Acadiverse features:</p>
                  {userCanPublish? <p>Publishing content to Acadiverse.</p>: null}
                  {userCanChat? <p>Using in-game chat.</p>: null}
                  {userCanComment? <p>Commenting on submissions, blog posts, etc.</p>: null}
                  {userCanUseForum? <p>Posting on the Acadiverse Forum.</p>: null}
                  <p>For more information about why accounts can be restricted, please see our Code of Conduct.</p>
                </Message>: null}
                {isUserBanned?<p><Image src="/images/profile_banned_user.bmp" size="small" circular />&nbsp;&nbsp;<strong className="profile-name">{displayName} (@{username}) ({genderPronoun})</strong></p>: <p>{usesGravatar ? <Gravatar email={email} className="user-profile"/> : <Image src={profileImageUrl} size="small" circular />}&nbsp;&nbsp;<strong className="profile-name">{displayName} (@{username}) ({genderPronoun})</strong></p>}
                <Header size="medium">{reputationPoints} Reputation Points | {money} Acadicoins</Header>
                <p>{profileBio}</p>
                <p>Birthday: {birthday} (age {age})</p>
                <p>Account Creation Date: {new Date(accountCreationDate).toLocaleDateString(navigator.language)}</p>
                <p>Last Active: {new Date(lastActive).toLocaleDateString(navigator.language)}</p>
                <div id="profile-actions">
                    {blockedUsers && blockedUsers.includes(id) ? <Button onClick={() => {
                      if(window.confirm("Unblock this user?")) {
                        const token = localStorage.jwtToken;
                        setAuthToken(token);
                        const decoded = jwt_decode(token);
                        fetch(`${Globals.API_URL}/account/unblockUser?id=${id}`, { 
                          method: "PUT", 
                          headers: { "Content-Type": "application/json", "x-access-token": token, "username": decoded.name},
                        })
                        .then((res) => res.json())
                        .then((res) => {
                          alert(res.message);
                          window.location.reload(false);
                        })
                        .catch((err) => console.log(err));
                      }
                    }}>Unblock</Button> : <Button onClick={() => {
                      if(window.confirm("Block this user?")) {
                        const token = localStorage.jwtToken;
                        setAuthToken(token);
                        const decoded = jwt_decode(token);
                        fetch(`${Globals.API_URL}/account/blockUser?id=${id}`, { 
                          method: "PUT", 
                          headers: { "Content-Type": "application/json", "x-access-token": token, "username": decoded.name},
                        })
                        .then((res) => res.json())
                        .then((res) => {
                          alert(res.message);
                          window.location.reload(false);
                        })
                        .catch((err) => console.log(err));
                      }
                    }}>Block</Button>}
                    {buddies && buddies.includes(id) ? <Button onClick={() => {
                        const token = localStorage.jwtToken;
                        setAuthToken(token);
                        const decoded = jwt_decode(token);
                        fetch(`${Globals.API_URL}/account/removeBuddy?id=${id}`, { 
                          method: "PUT", 
                          headers: { "Content-Type": "application/json", "x-access-token": token, "username": decoded.name},
                        })
                        .then((res) => res.json())
                        .then((res) => {
                          alert(res.message);
                          window.location.reload(false);
                        })
                        .catch((err) => console.log(err));
                    }}>Remove Buddy</Button> : <Button onClick={() => {
                        const token = localStorage.jwtToken;
                        setAuthToken(token);
                        const decoded = jwt_decode(token);
                        fetch(`${Globals.API_URL}/account/addBuddy?id=${this.state.id}`, { 
                          method: "PUT", 
                          headers: { "Content-Type": "application/json", "x-access-token": token, "username": decoded.name},
                        })
                        .then((res) => res.json())
                        .then((res) => {
                          alert(res.message);
                          window.location.reload(false);
                        })
                        .catch((err) => console.log(err));
                    }}>Add Buddy</Button>}
                    <Button color="red" onClick={() => {openReportModal()}}><Icon name="flag" />Report User</Button>
                </div>
            </Container>
            {currentUserIsModerator && !isUserBanned ? <div className="moderator-actions">
                <Checkbox label="Can Publish" checked={userCanPublish} /><br />
                <Button color="red" onClick={() => {openBanModal()}}>Ban Account...</Button>
                <Button color="red" onClick={() => {openWarningModal()}}>Warn User...</Button>
            </div> : null}
            {currentUserIsModerator && isUserBanned ? <div className="moderator-actions">
                <Button color="red" onClick={() => {unbanAccount()}}>Unban Account</Button>
            </div> : null}
        </Container>
      ) 
    } else {
      return(
        <Message error>{error}</Message>
      )
    }
  }
}
ProfileComponent.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.string.isRequired
};
  
  const mapStateToProps = state => ({
    auth: state.auth,
    account: state.account
  });
  
  export default connect(
    mapStateToProps
  )(ProfileComponent);