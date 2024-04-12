'use client'

import { createMedia } from "@artsy/fresnel";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import  React from 'react';
import { connect } from "react-redux";
import { logoutUser } from "../../services/auth.service";
import AdBlockDetect from 'react-ad-block-detect';
import { Button, Menu, Advertisement, Sticky, Container, Modal, Segment, Icon, Image, Sidebar} from 'semantic-ui-react';
import jwt_decode from "jwt-decode";
import setAuthToken from "../../services/auth.token";
//import AdSense from 'react-adsense';
//import { FormattedMessage } from 'react-intl';

import withRedux from 'next-redux-wrapper';
import { makeStore } from '../../store';
import wrapper from '../../store';

import Globals from "../../globals";
import logo from '../../assets/images/logo.svg';
import LoginComponent from "../modals/login.component";
import RegisterComponent  from "../modals/register.component";
import NoticeBanner from "../custom_components/notice-banner.component";
import UserDropdown from "./user-dropdown.component";
import AccountService from "../../services/account.service";
import AuthService from "../../services/auth.service";
import store from "../../store";

import Footer from "./footer.component";

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

const Navigation = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
  const [noticeBannerHeader, setNoticeBannerHeader] = useState("");
  const [noticeBannerMessage, setNoticeBannerMessage] = useState("");
  const [noticeBannerVisible, setNoticeBannerVisible] = useState(false);
  const [noticeBannerType, setNoticeBannerType] = useState("GENERIC_BANNER");

  async function acknowledgeWarning() {
  {
    const token = localStorage.jwtToken;
    setAuthToken(token);
    if(props.auth.isAuthenticated) {
      fetch(`${Globals.API_URL}/account/acknowledgeWarning/?username=${this.props.account.accountInfo.username}`, { headers: { "x-access-token": token }})
      .then((res) => res.json());
    }
  }
}

  function openApp() {
    const appWindow = window.open("/app", "_blank");
        appWindow.focus();
  }
const dispatch = useDispatch();

  useEffect(() => {
    if(typeof window !== 'undefined') {
      if (localStorage.jwtToken) {
        const token = localStorage.jwtToken;
        setAuthToken(token);
        const decoded = jwt_decode(token);
        if(decoded) {
          dispatch(AuthService.getUser(decoded));
          const currentTime = Date.now() / 1000
          if (decoded.exp < currentTime) {
            store.dispatch(AuthService.logoutUser());
          }
        }
      }
    }
    
    if (props.auth.isAuthenticated === true) {
      setLoggedIn(true);
      dispatch(AccountService.getAccountInfo());
    }

    fetch(`${Globals.API_URL}/getBannerMessage`).then((res) => res.json())
      .then((res) => {
        setNoticeBannerHeader(res.header);
        setNoticeBannerMessage(res.message);
        setNoticeBannerType(res.type);
        setNoticeBannerVisible(res.showBanner);
      })
  }, []);
  
const { isAuthenticated } = useSelector(state => state.auth);

 return(
      <nav>
          {Globals.ENABLE_DEBUG_MODE? <p>NOTE: Acadiverse is in Debug Mode.</p> : null}
          {Globals.ENABLE_DEBUG_MODE && Globals.FAKE_CURRENT_DATE? <p>NOTE: Acadiverse has been set to fake the current date. The site's appearance and behavior may not reflect the date on your system.</p>: null}
          
          <Container>
              <UserDropdown 
                isWebAppDropdown={false}
                accountType={props.account.accountInfo.accountType} 
                accountBanned={props.account.accountInfo.accountBanned}
                banReason={props.account.accountInfo.banReason} 
                dateBanExpires={props.account.accountInfo.dateBanExpires} 
                dateLastWarningReceived={props.account.accountInfo.dateLastWarningReceived}  
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
                privateMessages={props.account.accountInfo.privateMessages}
                profileImageURL={props.account.accountInfo.profileImageURL} 
                roles={props.account.accountInfo.roles} 
                username={props.account.accountInfo.username} 
                usesGravatar={props.account.accountInfo.usesGravatar} 
                warnings={props.account.accountInfo.warnings}
                onboardingCompleted={props.account.accountInfo.onboardingCompleted}
                />
          </Container>
          <Container className="nav-bar">
            <Menu>
              <h2><a href="/"><Image src={logo} alt="Acadiverse" size="small"/></a></h2>
              <Menu.Item className="nav-item"
                name=""
                active={props.activeItem === ""}
              >
                <a className="nav-link" href="/">
                  <strong>Home</strong>
                </a>
                
              </Menu.Item>
              <Menu.Item className="nav-item"
                name="about"
                active={props.activeItem === "about"}
              >
                <a className="nav-link" href="/about">
                  <strong>About</strong>
                </a>  
              </Menu.Item>
              <Menu.Item className="nav-item"
                name="download"
                active={props.activeItem === "download"}
              >
                <a className="nav-link" href="/download">
                  <strong>Downloads</strong>
                </a>
              </Menu.Item>
                <Menu.Item className="nav-item">
                      <a className="nav-link" href="/submissions/browse">
                        <strong>Submissions</strong>
                      </a>
                  </Menu.Item>
                    <Menu.Item className="nav-item">
                      <a className="nav-link" href="/store">
                        <strong>Store</strong>
                      </a>
                    </Menu.Item>
                    <Menu.Item className="nav-item">
                      <a className="nav-link" href="/blog/latest-posts">
                        <strong>Blog</strong>
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <Button primary onClick={() => { openApp() }}>Open Acadiverse</Button>
                    </Menu.Item>            
            </Menu>
          </Container>
          {props.auth.isAuthenticated? <section>
          {!props.account.accountInfo.isSubscriber ? <Advertisement unit="leaderboard" test="Test Ad" /> : null}
          {!props.account.accountInfo.isSubscriber ? <AdBlockDetect>
              <h3>Hi there! It looks like you are using an ad-blocker!</h3>
              <h4>Sorry to bother you, but while Acadiverse is 100% free, these ads are necessary to cover the costs associated with running the site.</h4>
              <h4>Please whitelist this site. Alternatively, if you want to have an ad-free experience, get a special badge on your profile, and get some more extra perks while still supporting the site, you can become a subscriber on Patreon!</h4>
          </AdBlockDetect> : <Advertisement unit="leaderboard" test="Test Ad" />}
          </section>: null}
          <NoticeBanner 
            header={noticeBannerHeader} 
            message={noticeBannerMessage} 
            active={noticeBannerVisible} 
            bannerType={noticeBannerType} />
          {props.children}
        </nav>
    );
  };

  export const getServerSideProps = wrapper.getServerSideProps((store) => async () => {
    await store.dispatch(AuthService.getUser());
    await store.dispatch(AccountService.getAccountInfo());
    return { props: {} }; // You can pass any needed props to your page component here
  });

const mapStateToProps = (state) => ({
  auth: state.auth,
  account: state.account
});

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: () => dispatch(AuthService.getUser()),
    getAccountInfo: () => dispatch(AccountService.getAccountInfo()),
  }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);