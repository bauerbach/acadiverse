'use client'

import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../services/auth.service";
import { Button, Container, Dropdown, Modal, Image, Header, Label, ButtonGroup, } from 'semantic-ui-react';
import Gravatar from 'react-gravatar';
import setAuthToken from "../../services/auth.token";
import Footer from "./footer.component";
//import { FormattedMessage } from 'react-intl';
import useDropdownMenu from 'react-accessible-dropdown-menu-hook';
import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

import Link from 'next/link'


import Globals from "../../globals";
import badge_admin from '../../assets/images/icons/badge_admin.svg';
import badge_moderator from '../../assets/images/icons/badge_moderator.svg';
import badge_founder_personalized from '../../assets/images/icons/badge_founder_personalized.svg';
import badge_alpha_tester from '../../assets/images/icons/badge_alpha_tester.svg';
import badge_beta_tester from '../../assets/images/icons/badge_beta_tester.svg';
import badge_backer from '../../assets/images/icons/badge_backer.svg';
import badge_subscriber from '../../assets/images/icons/badge_subscriber.svg';
import AccountBanNotice from "../modals/account-ban_notice.component";
import NotificationsModal from "../modals/notifications.component";
import PrivateMessagesModal from '../modals/private_messages.component';
import OnboardingModal from '../modals/onboarding.component';
import ModeratorWarningComponent from "../modals/moderator-warning.component";
import LoginComponent from "../modals/login.component";
import RegisterComponent  from "../modals/register.component";
import NoticeBanner from "../custom_components/notice-banner.component";

const UserDropdown = (props) => {

  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadPMs, setUnreadPMs] = useState(0);
  const [warningsOrdinal, setWarningsOrdinal] = useState("");
  const [noticeBannerHeader, setNoticeBannerHeader] = useState("");
  const [noticeBannerMessage, setNoticeBannerMessage] = useState("");
  const [noticeBannerVisible, setNoticeBannerVisible] = useState(false);
  const [noticeBannerType, setNoticeBannerType] = useState("GENERIC_BANNER");

  function getOrdinal(number) {
    var numberString = number.toString();
    var lastDigit = numberString.charAt(numberString.length - 1);
    if(lastDigit === '1')
    {
      return numberString + "st";
    }
    else if(lastDigit === '2' && number < 20)
    {
      return numberString + "nd";
    }
    else if(lastDigit === '3' && number < 20)
    {
      return numberString + "rd";
    }
    else
    {
      return numberString + "th";
    }
  }
  
  useEffect(() => { async () => 
    Object.keys(props.notifications).map((item) => {
      if(item.read) {
        setUnreadNotifications(unreadNotifications + 1);
      }
    });

    Object.keys(props.privateMessages).map((item) => {
      if(item.read) {
        setUnreadPMs(unreadPMs + 1);
      }
    
    setWarningsOrdinal(getOrdinal(props.warnings));
    });

    setTotalUnread(unreadNotifications + unreadPMs);
  }, []);

  async function acknowledgeWarning() {
    const token = localStorage.jwtToken;
    setAuthToken(token);      
    if(props.auth.isAuthenticated) {
      fetch(`${Globals.API_URL}/account/acknowledgeWarning?username=${props.username}`, { method: "POST", headers: { "x-access-token": token, "username": props.username }})
      .then((res) => res.json());
    }
  }
    

  if(!props.auth.isAuthenticated) {return <Container fluid className="user-menu"><Link href="/account/register"><Button primary>Register</Button></Link> <Link href="/account/login"><Button>Log In</Button></Link></Container>;} else {   
    return (
        <Container fluid className="user-menu">
          <Modal open={props.onboardingCompleted === false} className="onboarding-popup">
          <Modal.Content image>
              <OnboardingModal user={props.username} />
            </Modal.Content>
          </Modal>
          <Modal open={props.acknowledgedLastWarning === false && 
            !(window.location.href === Globals.DOMAIN + "/policies/terms-and-conditions" || 
            window.location.href === Globals.DOMAIN + "/policies/code-of-conduct")}
            className="moderator-warning-popup">
            <Modal.Content image>
              <ModeratorWarningComponent 
                lastWarnedByModeratorName={props.lastWarnedByModeratorName} 
                dateLastWarningReceived={props.dateLastWarningReceived} 
                lastWarningReason={props.lastWarningReason}
                warningNumber={warningsOrdinal}
              />
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => acknowledgeWarning()}>Acknowledge Warning</Button>
            </Modal.Actions>
          </Modal>
          <Modal open={props.accountBanned && props.auth.isAuthenticated} className="account-ban-popup">
            <Modal.Content image>
              <AccountBanNotice 
                banReason={props.banReason} 
                dateBanExpires={props.dateBanExpires}
              />
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => logoutUser()}>Close</Button>
            </Modal.Actions>
        </Modal>
        <Modal open = {false} className="notifications-popup">
          <Modal.Content image>
            <NotificationsModal />
          </Modal.Content>
        </Modal>
        <Modal open = {false} className="pms-popup">
          <Modal.Content image>
            <PrivateMessagesModal />
          </Modal.Content>
        </Modal>
          <Menu menuButton={<MenuButton>{props.usesGravatar ? <Gravatar email={props.email} className="user-profile"/> : <Image alt={props.username} src={props.profileImageUrl} size="mini" avatar circular className="user-profile" />} {props.displayName} (@{props.username})</MenuButton>}>
            <MenuItem><a>
              Notifications
              {unreadNotifications > 0 ? <Label color="red" className="notification-badge">
                {unreadNotifications}
              </Label> : null}
            </a></MenuItem>
            <MenuItem><a>
              Private Messages
              {unreadPMs > 0 ? <Label color="red" className="notification-badge">
                {unreadPMs}
              </Label> : null}
            </a></MenuItem>
            <MenuItem><a>Buddies</a></MenuItem>
            <MenuItem><a href="/account/account-settings">Account Settings</a></MenuItem>
            <MenuItem><a onClick={() => logoutUser()}>Log Out</a></MenuItem>            
          </Menu>
                    {totalUnread > 0 ? <Label color="red" className="notification-badge">
                      {totalUnread}
                    </Label> : null}
                    {props.roles.includes("admins") ? <Image alt="Admin Badge" src={badge_admin} size="mini" avatar circular className="user-profile-badge" /> : null}
                    {props.roles.includes("moderators") ? <Image alt="Moderator Badge" src={badge_moderator} size="mini" avatar circular className="user-profile-badge" /> : null}
                    {props.alphaTester ? <Image alt="Alpha Tester Badge" src={badge_alpha_tester} size="mini" avatar circular className="user-profile-badge" /> : null}
                    {props.betaTester ? <Image alt="Beta Tester Badge" src={badge_beta_tester} size="mini"miniavatar circular className="user-profile-badge" /> : null}
                    {props.isBacker ? <Image alt="Backer Badge" src={badge_backer} size="mini" avatar circular className="user-profile-badge" /> : null}
                    {props.isSubscriber ? <Image alt="Subscriber Badge" src={badge_subscriber} size="mini" avatar circular className="user-profile-badge" /> : null}
                    {props.badgeFounderPersonalized ? <Image alt="Founder Personalized Badge" src={badge_founder_personalized} size="mini" avatar circular className="user-profile-badge" /> : null} 
        </Container>
    )
  }
}
  const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default connect(
    mapStateToProps
  )(UserDropdown);