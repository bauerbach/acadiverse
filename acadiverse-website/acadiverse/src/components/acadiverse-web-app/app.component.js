import { useState, useEffect } from 'react';
import { Container, Tab, Grid, Header, Button, Image, Feed, Item } from 'semantic-ui-react';
//import { FormattedMessage } from 'react-intl';
//import axios from "axios";
import setAuthToken from "../../services/auth.token";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { logoutUser } from "../../services/auth.service";
import PropTypes from "prop-types";
import LoginComponent from "../modals/login.component";
import UserDropdown from '../custom_components/user-dropdown.component';
//import ProfileComponent from '../profile.component';
import logo from '../../assets/images/logo.svg';
//import { transpileModule } from 'typescript';
//import ReportForm from './report-form';

import Globals from '../../globals';

var userBuddies = [];
var buddies = [];
//var items = [];
//var favoritedSubmissions = [];
//var ownedSubmissions = [];
//var privateMessages = [];
const panes = [
  { menuItem: 'Dashboard', render: () => 
      <Tab.Pane>
          <Container>
            <Grid>
              <Grid.Row>
                <Grid.Column floated="left" width={5}>
                  <Header as="h1">Statistics</Header>

                </Grid.Column>
                <Grid.Column floated="right" width={5}>
                  <Header as="h1">My Feed</Header>
                  <Feed>

                  </Feed>
                </Grid.Column>
              </Grid.Row>
              
            </Grid>
          </Container>
      </Tab.Pane> },
  { menuItem: 'Buddies', render: () => 
    <Tab.Pane>
        <Container>
            {userBuddies.length === 0 ? <p>You have no buddies. :(</p> : null}
            <Item.Group divided link>
              {userBuddies.map(item => {
                  console.log(item);
                  return(
                  <div>
                    <Item>
                      <Item.Image size='tiny' src={item.profileImageURL} />

                      <Item.Content>
                        <Item.Header as='a'>{item.username}</Item.Header>
                        <Item.Description>
                          <p>Last Active: {item.lastActive}</p>
                          <Button>Remove Buddy</Button>
                        </Item.Description>
                      </Item.Content>
                    </Item>
                  </div>
                  );
                })}
            </Item.Group>
        </Container>
    </Tab.Pane> },
  { menuItem: 'My Submissions', render: () => 
    <Tab.Pane>
        <Container>
          <Header as="h2">Owned Submissions</Header>
            <Item.Group divided link>

            </Item.Group>
          <Header as="h2">Favorited Submissions</Header>
            <Item.Group divided link>
              
            </Item.Group>
        </Container>
    </Tab.Pane>
  },
  { menuItem: 'My Items', render: () => 
    <Tab.Pane>
        <Container>
            <Item.Group divided link>
              
            </Item.Group>
        </Container>
    </Tab.Pane> },
  { menuItem: 'Classroom Discussions', render: () => 
    <Tab.Pane>
        <Container>
            
        </Container>
    </Tab.Pane>
  },
]

function AppComponent(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [buddiesLoaded, setBuddiesLoaded] = useState(false);

  function handleLogOutClick(e) {
    logoutUser();
  }

  function handleWarningAcknowledged(e) {
    acknowledgeWarning();
  }

  async function acknowledgeWarning() {
    const token = localStorage.jwtToken;
    setAuthToken(token);      
    if(props.auth.isAuthenticated) {
      fetch(`${Globals.API_URL}/account/acknowledgeWarning/?username=${props.account.accountInfo.username}`, { headers: { "x-access-token": token }})
      .then((res) => res.json());
    }
  }

  async function refreshBuddies() {
    const token = localStorage.jwtToken;
    setAuthToken(token);    
    userBuddies = props.account.accountInfo.buddies;
    userBuddies.forEach(item => {
      fetch(`${Globals.API_URL}/account/info/?id=${item}`, { headers: { "x-access-token": token }})
      .then((res) => res.json())
      .then((data) => 
      {
        userBuddies.Prototype.push(data);
      });
    });
    setBuddiesLoaded(true);
  }

      useEffect(() => {
          if (props.auth.isAuthenticated) {
            setLoggedIn(true);
            
            if(buddiesLoaded === false) {
              buddies = refreshBuddies();
              console.log(buddies);
            }  
          }
        });

  function getOrdinal(number) {
    var numberString = number.toString();
    var lastDigit = numberString.charAt(numberString.length - 1);
    if(lastDigit === '1')
    {
      return numberString + "st";
    }
    else if(lastDigit === '2')
    {
      return numberString + "nd";
    }
    else if(lastDigit === '3')
    {
      return numberString + "rd";
    }
    else
    {
      return numberString + "th";
    }
  }

  if(props.auth.isAuthenticated) {
    return (
        <Container fluid>
        <UserDropdown
          isWebAppDropdown={true} 
          accountType={props.account.accountInfo.accountType} 
          accountBanned={props.account.accountInfo.accountBanned} 
          banReason={props.account.accountInfo.banReason} 
          dateBanExpires={props.account.accountInfo.dateBanExpires} 
          dateLastWarningRecieved={props.account.accountInfo.dateLastWarningRecieved}  
          acknowledgedLastWarning={props.account.accountInfo.acknowledgedLastWarning} 
          displayName={props.account.accountInfo.displayName} 
          email={props.account.accountInfo.email} 
          gender={props.account.accountInfo.gender} 
          genderPronoun={props.account.accountInfo.genderPronoun} 
          isBacker={props.account.accountInfo.isBacker} 
          isSubscriber={props.account.accountInfo.isSubscriber} 
          lastWarnedByModeratorName={props.account.accountInfo.lastWarnedByModeratorName} 
          lastWarningReason={props.account.accountInfo.lastWarningReason} 
          notifications={props.account.accountInfo.notifications} 
          notifyAchievementReceived={props.account.accountInfo.notifyAchievementReceived} 
          notifyPMReceived={props.account.accountInfo.notifyPMReceived} 
          notifySubmissionComment={props.account.accountInfo.notifySubmissionComment} 
          notifySubmissionFeatured={props.account.accountInfo.notifySubmissionFeatured} 
          notifySubmissionUpvote={props.account.accountInfo.notifySubmissionUpvote} 
          password={props.account.accountInfo.password} 
          privateMessages={props.account.accountInfo.privateMessages} 
          profileBio={props.account.accountInfo.profileBio} 
          profileImageURL={props.account.accountInfo.profileImageURL} 
          roles={props.account.accountInfo.roles} 
          username={props.account.accountInfo.username} 
          usesGravatar={props.account.accountInfo.usesGravatar} 
          warnings={props.account.accountInfo.warnings} 
          unreadNotifications={props.account.accountInfo.unreadNotifications} 
          unreadPMs={props.account.accountInfo.unreadPMs} 
          totalUnread={props.account.accountInfo.totalUnread} 
          />
          <Container fluid className="nav-bar">
            <Image src={logo} alt="Acadiverse" size="small" />
          </Container>
            <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes} />
            <Button>Open Acadiverse Course Creator</Button>
            <Button>Open Acadiverse Game</Button>
        </Container>
    )
  }
  else
  {
    return (
      <LoginComponent />
    )
  }
}
AppComponent.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  account: state.account
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(AppComponent);