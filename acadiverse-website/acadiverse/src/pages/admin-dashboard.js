'use client';

import { createMedia } from "@artsy/fresnel";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Confirm, Checkbox, Dropdown, Message, Table, Menu, Icon, Header, Button, Form, Dimmer } from 'semantic-ui-react';
import Popup from 'reactjs-popup';
import Navigation from '../components/custom_components/navigation.component';
import Footer from '../components/custom_components/footer.component';
//import { FormattedMessage } from 'react-intl';
import Globals from '../globals';

import setAuthToken from "../services/auth.token";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import AccountService from "../services/account.service";
import AuthService from "../services/auth.service";
import store from "../store";
import wrapper from '../store';
import { logoutUser } from "../services/auth.service";
import PropTypes from "prop-types";
import NoticeBanner from "../components/custom_components/notice-banner.component";

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

const bannerTypeOptions = [
      {
        key: 'generic',
        text: 'Generic Banner',
        value: 'GENERIC_BANNER',
      },
      {
          key: 'event',
          text: 'Site Event',
          value: 'SITE_EVENT',
      },
      {
          key: 'important',
          text: 'Important Info',
          value: 'IMPORTANT_INFO',
      },   
      {
          key: 'urgent',
          text: 'Urgent Notice',
          value: 'URGENT_NOTICE'
      }
    ];

function AdminDashboardComponent(props) {
  const [accountsLoaded, setAccountsLoaded] = useState(false);
  const [roles, setRoles] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [username, setUsername] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [canChat, setCanChat] = useState(true);
  const [canComment, setCanComment] = useState(true);
  const [canPublish, setCanPublish] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [accountCreationDate, setAccountCreationDate] = useState(new Date());
  const [lastActive, setLastActive] = useState(new Date());
  const [reputationPoints, setReputationPoints] = useState(0);
  const [money, setMoney] = useState(0);
  const [selectedUserIsModerator, setSelectedUserIsModerator] = useState(false);
  const [selectedUserIsAdmin, setSelectedUserIsAdmin] = useState(false);
  const [selectedUserIsDeveloper, setSelectedUserIsDeveloper] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usesGravatar, setUsesGravatar] = useState(true);
  const [isCurrentUsersProfile, setIsCurrentUsersProfile] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [accountTable, setAccountTable] = useState([]);
  const [submissionsLoaded, setSubmissionsLoaded] = useState(false);
  const [submissionTable, setSubmissionTable] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [allowLogins, setAllowLogins] = useState(true);
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerHeader, setBannerHeader] = useState("");
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerBlogPostLink, setBannerBlogPostLink] = useState("");
  const [bannerType, setBannerType] = useState("GENERIC_BANNER");
  const [bannerHeaderText, setBannerHeaderText] = useState("");
  const [bannerMessageText, setBannerMessageText] = useState("");
  const [bannerBlogPostLinkText, setBannerBlogPostLinkText] = useState("");
  const [blogPostLink, setBlogPostLink] = useState("");
  const [bannerTypeOption, setBannerTypeOption] = useState("GENERIC_BANNER");
  const [aprilFoolsHeader, setAprilFoolsHeader] = useState("");
  const [aprilFoolsMessage, setAprilFoolsMessage] = useState("");
  const [aprilFoolsBlogPostLink, setAprilFoolsBlogPostLink] = useState("");
  const [aprilFoolsBannerType, setAprilFoolsBannerType] = useState("GENERIC_BANNER");
  const [showBannerChecked, setShowBannerChecked] = useState(false);
  const [showAprilFoolsInfo, setShowAprilFoolsInfo] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [blockUsernameChecked, setBlockUsernameChecked] = useState(false);
  const [blockEmailChecked, setBlockEmailChecked] = useState(false);
  const [deleteAllContentChecked, setDeleteAllContentChecked] = useState(false);
  const [confirmBannerChanges, setConfirmBannerChanges] = useState(false);


  async function fetchAccount (username) {
    fetch(`${Globals.API_URL}/account/info/?username=${username}`)
    .then((res) => res.json())
    .then((data) =>
    {
        if(data.statusCode === 404) {
          setError(data.message);
        } else {
          setSelectedUsername(username);
          setEmail(data.email);
          setCanChat(data.canChat);
          setCanComment(data.canComment);
          setCanPublish(data.canPublish);
          setDisplayName(data.displayName);
          setProfileBio(data.profileBio);
          setBirthday(data.birthday);
          setAccountCreationDate(data.accountCreationDate);
          setLastActive(data.lastActive);
          setReputationPoints(data.reputationPoints);
          setMoney(data.money);
          setSelectedUserIsModerator(data.roles.includes("moderators"));
          setSelectedUserIsAdmin(data.roles.includes("admins"));
          setSelectedUserIsDeveloper(data.roles.includes("developers"));
          setNewUsername(data.username);
          setUsesGravatar(data.usesGravatar);
          setIsCurrentUsersProfile(username === loggedInUser);
        }
    })  
  }

  async function refreshAccounts() {
    if(accountsLoaded === false) {
      const token = localStorage.jwtToken;
      setAuthToken(token);
      fetch(`${Globals.API_URL}/account/list?limit=6&skip=${page}`, { headers: { "x-access-token": token, "username": props.account.accountInfo.username }})
      .then((res) => res.json())
      .then((accounts) => 
      {
        setTotalPages(accounts.total / 6);
        var accountTable = [];
        accountTable = accounts.data.map(item => {
          return(
            <Table.Row key={item.username} onClick={() => {fetchAccount(item.username)}}>
              <Table.Cell><button className="button-invisible" aria-label={"Username" + item.username + ", Display Name: " + item.display_name} onClick={() => {this.fetchAccount(item.username)}}>{item.username}</button></Table.Cell>
              <Table.Cell>{item.display_name}</Table.Cell>
              <Table.Cell>{item.account_type}</Table.Cell>
            </Table.Row>
          );
        })
        setAccountsLoaded(true);
        setAccountTable(accountTable);
      })
      .catch(error =>
      {
        console.log(error);
      });
     
    }
  }

  async function refreshSubmissions() {
    if(submissionsLoaded === false) {
      fetch(`${Globals.API_URL}/submissions/list`)
      .then((res) => res.json())
      .then((submissions) => 
      {
        var submissionTable = [];
        submissionTable = submissions.map(item => {
        return(
        <Table.Row key={item.name}>
          <Table.Cell>{item.name}</Table.Cell>
          <Table.Cell>{item.author}</Table.Cell>
          <Table.Cell>{item.submission_type}</Table.Cell>
        </Table.Row>
        );
      });
      setSubmissionsLoaded(true);
      setSubmissionTable(submissionTable);
      });  
    }
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

    if (props.auth.isAuthenticated) {
      setLoggedIn(true);
      dispatch(AccountService.getAccountInfo());
      setUsername(props.account.accountInfo.username);
      setRoles(props.account.accountInfo.roles);
      
      fetch(`${Globals.API_URL}/globalSettings/retrieve?settingType=BOOLEAN&key=allowLogins`)
        .then((res) => res.json())
        .then((res) => {
          setAllowLogins(res.value);
        })

      fetch(`${Globals.API_URL}/globalSettings/retrieve?settingType=BOOLEAN&key=allowRegistrations`)
        .then((res) => res.json())
        .then((res) => {
          setAllowRegistrations(res.value);
      })

      fetch(`${Globals.API_URL}/globalSettings/retrieve?settingType=BOOLEAN&key=showBanner`)
        .then((res) => res.json())
        .then((res) => {
          setShowBanner(res.value);
      })

      fetch(`${Globals.API_URL}/globalSettings/retrieve?settingType=STRING&key=noticeBannerHeader`)
        .then((res) => res.json())
        .then((res) => {
          setBannerHeader(res.value);
      })

      fetch(`${Globals.API_URL}/globalSettings/retrieve?settingType=STRING&key=noticeBannerMessage`)
        .then((res) => res.json())
        .then((res) => {
          setBannerMessage(res.value);
      })

      fetch(`${Globals.API_URL}/globalSettings/retrieve?settingType=STRING&key=noticeBannerBlogPostLink`)
        .then((res) => res.json())
        .then((res) => {
          setBannerBlogPostLink(res.value);
      })

      fetch(`${Globals.API_URL}/globalSettings/retrieve?settingType=STRING&key=noticeBannerType`)
        .then((res) => res.json())
        .then((res) => {
          setBannerType(res.value);
      })

      fetch(`${Globals.API_URL}/globalSettings/retrieve?settingType=STRING&key=aprilFoolsHeader`)
        .then((res) => res.json())
        .then((res) => {
          setAprilFoolsHeader(res.value);
      })

      fetch(`${Globals.API_URL}/globalSettings/retrieve?settingType=STRING&key=aprilFoolsMessage`)
        .then((res) => res.json())
        .then((res) => {
          setAprilFoolsMessage(res.value);
      })

      fetch(`${Globals.API_URL}/globalSettings/retrieve?settingType=STRING&key=aprilFoolsBlogPostLink`)
        .then((res) => res.json())
        .then((res) => {
          setAprilFoolsBlogPostLink(res.value);
      })

      fetch(`${Globals.API_URL}/globalSettings/retrieve?settingType=STRING&key=aprilFoolsBannerType`)
        .then((res) => res.json())
        .then((res) => {
          setAprilFoolsBannerType(res.value);
          setShowBannerChecked(showBanner);
          setBannerHeaderText(bannerHeader);
          setBannerMessageText(bannerMessage);
          setBannerBlogPostLinkText(bannerBlogPostLink);
          setBannerTypeOption(bannerType);
      })
    }
  }, []);
  if(props.auth.isAuthenticated && props.account.accountInfo.roles.includes("admins")) {
      refreshAccounts();
    }
    return (
      <div>
        <Popup open={deleteAccountModalOpen} modal nested>
                  <div className="delete-account-popup">
                    <h3>Delete Account</h3>
                    <p>Are you sure you wish to delete the account "{selectedUsername}"?</p>
                    <Checkbox checked={blockUsernameChecked} onChange={(e, data) => {
                      setBlockUsernameChecked(data.checked);
                    }} label="Block username from being used in the future."/> <br />
                    <Checkbox checked={blockEmailChecked} onChange={(e, data) => {
                      setBlockEmailChecked(data.checked);
                    }} label="Block email from being used in the future."/> <br />
                    <Checkbox checked={deleteAllContentChecked} onChange={(e, data) => {
                      setDeleteAllContentChecked(data.checked);
                    }} label="Delete all content associated with this account."/>
                    <br />
                    <Button color="red" onClick={() => {
                      const token = localStorage.jwtToken;
                      setAuthToken(token);
                      const decoded = jwt_decode(token);
                      fetch(`${Globals.API_URL}/auth/deleteOtherAccount?username=${selectedUsername}`, {
                        method: "DELETE", 
                        headers: { "Content-Type": "application/json", "x-access-token": token, "username": decoded.name},
                        body: JSON.stringify({
                          "addUsernameToBlockList": blockUsernameChecked,
                          "addUsernameToBlockList": blockEmailChecked,
                          "deleteAllContent": deleteAllContentChecked
                        })
                      })
                      .then((res) => res.json())
                      .then((res) => {
                        alert(res.message);
                        setDeleteAccountModalOpen(false);
                        if(res.success) {
                          window.location.reload(false);
                        }
                      });
                    }}>Delete</Button>
                    <Button onClick={() => {
                      this.setState({deleteAccountModalOpen: false});
                    }}>Cancel</Button>
                  </div>
                  
                </Popup>
        
                <Container>
                    {props.auth.isAuthenticated && props.account.accountInfo.roles.includes("admins") ? <Container>
                  <Header as="h1">Admin Panel</Header>

                  <Container>
                    <Header as="h2">Notice Banner</Header>
                    <Checkbox label="Edit April Fools' Day Banner" checked={showAprilFoolsInfo} onChange={(e, data) => {
                      if(data.checked) {
                        setShowBannerChecked(true);
                        setBannerHeaderText(aprilFoolsHeader);
                        setBannerMessageText(aprilFoolsMessage);
                        setBannerBlogPostLinkText(aprilFoolsBlogPostLink);
                        setBannerTypeOption(aprilFoolsBannerType);
                      } else {
                        setShowBannerChecked(showBanner);
                        setBannerHeaderText(bannerHeader);
                        setBannerMessageText(bannerMessage);
                        setBannerBlogPostLinkText(blogPostLink);
                        setBannerTypeOption(bannerType);
                      }
                      setShowAprilFoolsInfo(data.checked);
                    }} />
                    {showAprilFoolsInfo? <Message warning>
                        <Message.Header>You are editing the April Fools' Day banner.</Message.Header>
                        <p>This banner will only be displayed on April 1 and will replace the normal banner on that day.</p>
                      </Message> : null}
                    <Form>
                      
                      <Checkbox label="Show Banner" checked={showBannerChecked} onChange={(e, data) => {
                        setShowBanner(data.checked);
                        setShowBannerChecked(data.checked);
                      }} />
                      <Form.Field>
                        <Form.Input label="Banner Header:" onChange={(e, data) => {
                          if(showAprilFoolsInfo) {
                            setBannerHeaderText(data.value);
                            setAprilFoolsHeader(data.value);
                          } else {
                            setBannerHeaderText(data.value);
                            setBannerHeader(data.value);
                          }
                          
                        }} value={bannerHeaderText} />
                      </Form.Field>
                      
                      <Form.Field>
                        <Form.TextArea label="Banner Message:" onChange={(e, data) => {
                          if(showAprilFoolsInfo) {
                            setBannerMessageText(data.value);
                            setAprilFoolsMessage(data.value);
                          } else {
                            setBannerMessageText(data.value);
                            setBannerMessage(data.value);
                          }
                          
                        }} value={bannerMessageText} ></Form.TextArea>
                      </Form.Field>
                      
                      <Form.Field>
                        <Form.Input label="Blog Post Link:" onChange={(e, data) => {
                          if(showAprilFoolsInfo) {
                            setBannerBlogPostLinkText(data.value);
                            setAprilFoolsBlogPostLink(data.value);
                          } else {
                            setBannerBlogPostLinkText(data.value);
                            setBlogPostLink(data.value);
                          }
                          
                        }} value={bannerBlogPostLinkText} />
                      </Form.Field>

                      <Form.Field>
                        <label>Banner Type:</label>
                        <Dropdown
                        placeholder="Please specify the banner type." 
                        fluid 
                        selection 
                        options={bannerTypeOptions} 
                        onChange={(e, data) => {
                          if(showAprilFoolsInfo) {
                            setBannerTypeOption(data.value);
                            setAprilFoolsBannerType(data.value);
                          } else {
                            setBannerTypeOption(data.value);
                            setBannerType(data.value);
                          }
                        }} 
                        value={bannerTypeOption} 
                        />
                      </Form.Field>
                      <Header as="h2">Banner Preview:</Header>
                        <Button onClick={() => {{setConfirmBannerChanges(true)}}}>Save Changes</Button>
                    </Form>
                    <Confirm className="confirm-show-banner"
                      open={confirmBannerChanges} 
                      onCancel={() => {setConfirmBannerChanges(false)}} 
                      onConfirm={() => {
                          const token = localStorage.jwtToken;
                          setAuthToken(token);
                          const decoded = jwt_decode(token);

                          if(showAprilFoolsInfo) {

                            fetch(`${Globals.API_URL}/globalSettings/setString?key=aprilFoolsHeader&value=${bannerHeaderText}`, { method: "POST", headers: { "x-access-token": token, "username": decoded.name}})
                            .then((res) => res.json())
                            .catch((error) => {
                              console.log(error);
                            });
                            
                            fetch(`${Globals.API_URL}/globalSettings/setString?key=aprilFoolsMessage&value=${bannerMessageText}`, { method: "POST", headers: { "x-access-token": token, "username": decoded.name}})
                            .then((res) => res.json())
                            .catch((error) => {
                              console.log(error);
                            });

                            fetch(`${Globals.API_URL}/globalSettings/setString?key=aprilFoolsBlogPostLink&value=${bannerBlogPostLinkText}`, { method: "POST", headers: { "x-access-token": token, "username": decoded.name}})
                            .then((res) => res.json())
                            .catch((error) => {
                              console.log(error);
                            });

                            fetch(`${Globals.API_URL}/globalSettings/setString?key=aprilFoolsBannerType&value=${bannerTypeOption}`, { method: "POST", headers: { "x-access-token": token, "username": decoded.name}})
                            .then((res) => res.json())
                            .catch((error) => {
                              console.log(error);
                            });
                          
                          } else {

                            fetch(`${Globals.API_URL}/globalSettings/setBoolean?key=showBanner&value=${showBannerChecked}`, { method: "POST", headers: { "x-access-token": token, "username": decoded.name}})
                            .then((res) => res.json())
                            .catch((error) => {
                              console.log(error);
                            });

                            fetch(`${Globals.API_URL}/globalSettings/setString?key=noticeBannerHeader&value=${bannerHeaderText}`, { method: "POST", headers: { "x-access-token": token, "username": decoded.name}})
                            .then((res) => res.json())
                            .catch((error) => {
                              console.log(error);
                            });
                            
                            fetch(`${Globals.API_URL}/globalSettings/setString?key=noticeBannerMessage&value=${bannerMessageText}`, { method: "POST", headers: { "x-access-token": token, "username": decoded.name}})
                            .then((res) => res.json())
                            .then((res) => {
                              console.log(res);
                            })
                            .catch((error) => {
                              console.log(error);
                            });

                            fetch(`${Globals.API_URL}/globalSettings/setString?key=noticeBannerBlogPostLink&value=${bannerBlogPostLinkText}`, { method: "POST", headers: { "x-access-token": token, "username": decoded.name}})
                            .then((res) => res.json())
                            .catch((error) => {
                              console.log(error);
                            });

                            fetch(`${Globals.API_URL}/globalSettings/setString?key=noticeBannerType&value=${bannerTypeOption}`, { method: "POST", headers: { "x-access-token": token, "username": decoded.name}})
                            .then((res) => res.json())
                            .catch((error) => {
                              console.log(error);
                            });

                          }
                        }} 
                      content={showBannerChecked? <div>
                          <p>The following banner will be shown at the top of all pages on the Acadiverse website: </p>
                            <NoticeBanner 
                            active={true} 
                            header={showAprilFoolsInfo? aprilFoolsHeader: bannerHeader} 
                            message={showAprilFoolsInfo? aprilFoolsMessage: bannerMessage} 
                            bannerType={showAprilFoolsInfo? aprilFoolsBannerType: bannerType} 
                            />
                          <p>Are you sure you wish to display this banner?</p>
                        </div> : <div><p>The banner currently being displayed will be hidden. Are you sure you you wish to hide the banner?</p></div>}
                    />
                    <NoticeBanner 
                      active={true} 
                      header={showAprilFoolsInfo? aprilFoolsHeader: bannerHeader} 
                      message={showAprilFoolsInfo? aprilFoolsMessage: bannerMessage} 
                      bannerType={showAprilFoolsInfo? aprilFoolsBannerType: bannerType} 
                    />
                  </Container>

                  <Container>
                    <Header as="h2">Accounts</Header>
                    <Checkbox label="Allow Logins" checked={allowLogins} onChange={(e, data) => {
                      setAllowLogins(data.checked);
                      const token = localStorage.jwtToken;
                      setAuthToken(token);
                      const decoded = jwt_decode(token);
                      fetch(`${Globals.API_URL}/globalSettings/setBoolean?key=allowLogins&value=${data.checked}`, { method: "POST", headers: { "x-access-token": token, "username": decoded.name}})
                        .then((res) => res.json())
                        .then((res) => {
                          console.log(res);
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }}/>
                    <br />
                    <Checkbox label="Allow Signups" checked={allowRegistrations} onChange={(e, data) => {
                      setAllowRegistrations(data.checked);
                      const token = localStorage.jwtToken;
                      setAuthToken(token);
                      const decoded = jwt_decode(token);
                      fetch(`${Globals.API_URL}/globalSettings/setBoolean?key=allowRegistrations&value=${data.checked}`, { method: "POST", headers: { "x-access-token": token, "username": decoded.name}})
                        .then((res) => res.json())
                        .then((res) => {
                          console.log(res);
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }}/>
                    <Table celled selectable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Username</Table.HeaderCell>
                    <Table.HeaderCell>Display Name</Table.HeaderCell>
                    <Table.HeaderCell>Account Type</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                
                <Table.Body>       
                    {accountTable}
                </Table.Body>

                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='3'>
                            <Menu floated='right' pagination>
                                {page > 0? <Menu.Item as='a' icon onClick={() => {
                                  this.setState({page: page - 1, accountsLoaded: false}, () => {this.refreshAccounts();});
                                }}>
                                    <Icon name='chevron left' />
                                </Menu.Item> : null}
                                {page < totalPages? <Menu.Item as='a' icon onClick={() => {
                                  this.setState({page: page + 1, accountsLoaded: false}, () => {this.refreshAccounts();});
                                }}>
                                    <Icon name='chevron right' />
                                </Menu.Item> : null}
                        </Menu>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
            {selectedUsername != ""? <Container>
              <Header as="h2"><a href={Globals.DOMAIN + "/profile/" + selectedUsername} target="_blank">{displayName} (@{selectedUsername})</a></Header>
              <Form>
                <Header as="h3">Profile</Header>
                <Form.Input type="text" label="Username:" value={newUsername} onChange={(e, data) => setNewUsername(data.value)}/>
                <Form.Input type="text" label="Display Name:" value={displayName} onChange={(e, data) => setDisplayName(data.value)}/>
                <Form.TextArea label="Profile Bio:" value={profileBio} onChange={(e, data) => setProfileBio(data.value)}/>
                <Button onClick={() => {
                  const token = localStorage.jwtToken;
                  setAuthToken(token);
                  const decoded = jwt_decode(token);
                  fetch(`${Globals.API_URL}/account/editProfile?username=${selectedUsername}`, { 
                      method: "PUT", 
                      headers: { "Content-Type": "application/json", "x-access-token": token, "username": decoded.name},
                      body: JSON.stringify({
                        "username": newUsername,
                        "displayName": displayName,
                        "profileBio": profileBio
                      })})
                    .then((res) => res.json())
                    .then((res) => {
                      alert(res.message);
                      if(selectedUsername !== newUsername) {
                        if(window.confirm("You have changed this user's username. Add the old username to the username block list?")) {
                          const token = localStorage.jwtToken;
                          setAuthToken(token);
                          const decoded = jwt_decode(token);
                          fetch(`${Globals.API_URL}/globalSettings/addToArray?key=usernameBlockList&value=${selectedUsername}`, { 
                            method: "POST", 
                            headers: { "Content-Type": "application/json", "x-access-token": token, "username": decoded.name},
                          })
                          .then((res) => res.json())
                        }
                        window.location.reload();
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}>Save Changes</Button>
              </Form> <br />

              <Form>
                <Header as="h3">Basic Info</Header>
                <Form.Input type="number" label="Reputation Points:" value={reputationPoints} onChange={(e, data) => setReputationPoints(data.value)} />
                <Form.Input type="number" label="Acadicoins:" value={money} onChange={(e, data) => setMoney(data.value)} />
                <Button onClick={() => {
                  const token = localStorage.jwtToken;
                  setAuthToken(token);
                  const decoded = jwt_decode(token);
                  fetch(`${Globals.API_URL}/account/updateData?username=${selectedUsername}`, { 
                    method: "PUT", 
                    headers: { "Content-Type": "application/json", "x-access-token": token, "username": decoded.name},
                    body: JSON.stringify({
                        "reputationPoints": reputationPoints,
                        "money": money
                    })})
                  .then((res) => res.json())
                  .then((res) => {
                    
                  })
                  .catch((err) => {
                      alert(err);
                  });
                }}>Save Changes</Button>
              </Form>

              <Form>
                <Header as="h3">Privileges</Header>
                <Checkbox checked={canChat} label="Can Chat" onChange={(e, data) => {
                  setCanChat(data.checked);
                }} /> <br />
                <Checkbox checked={canComment} label="Can Comment"  onChange={(e, data) => {
                  setCanComment(data.checked);
                }} /> <br />
                <Checkbox checked={canPublish} label="Can Publish"  onChange={(e, data) => {
                  setCanPublish(data.checked);
                }} /> <br />
                <Button>Save Changes</Button>
              </Form> <br />

              <Form>
                <Header as="h3">Roles</Header>
                <Checkbox checked={selectedUserIsModerator} label="Moderators" onChange={(e, data) => {
                    this.setState({selectedUserIsModerator: data.checked});
                    if(!data.checked) {
                      setSelectedUserIsAdmin(data.checked);
                    }
                }} /> <br />
                <Checkbox checked={selectedUserIsAdmin} onChange={(e, data) => {
                    setSelectedUserIsAdmin(data.checked);
                }} label="Admins" /> <br />
                <Checkbox checked={selectedUserIsDeveloper} onChange={(e, data) => {
                  if(data.checked) {
                    setSelectedUserIsDeveloper(data.checked);
                  }
                }} label="Developers" /> <br />
                <Button onClick={() => {
                  if(selectedUsername === username && !selectedUserIsAdmin) {
                    if(!window.confirm("You are about to remove the \"admins\" role from your own account. If you do this, you will no longer have access to the admin dashboard, including for modifying roles. Continue?")) {
                      return;
                    }
                  }
                  const token = localStorage.jwtToken;
                  setAuthToken(token);
                  const decoded = jwt_decode(token);
                  fetch(`${Globals.API_URL}/auth/changeRoles?username=${selectedUsername}`, { 
                      method: "PUT", 
                      headers: { "Content-Type": "application/json", "x-access-token": token, "username": decoded.name},
                      body: JSON.stringify({
                        "moderators": selectedUserIsModerator,
                        "admins": selectedUserIsAdmin,
                        "developers": selectedUserIsDeveloper
                      })})
                    .then((res) => res.json())
                    .then((res) => {
                      alert(res.message);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}>Save Changes</Button>
              </Form>
              <Form>
                <Header as="h3">Authentication</Header>
                <Form.Input type="password" label="Password" value={newPassword} onChange={(e, data) => this.setState({newPassword: data.value})} />
                <Button onClick={() => {
                  const token = localStorage.jwtToken;
                  setAuthToken(token);
                  const decoded = jwt_decode(token);
                  fetch(`${Globals.API_URL}/account/changePassword?passwordChangedByAdmin=true&username=${selectedUsername}`, { 
                      method: "PUT", 
                      headers: { "Content-Type": "application/json", "x-access-token": token, "username": decoded.name},
                      body: JSON.stringify({
                        "newPassword": newPassword
                      })})
                  .then((res) => res.json())
                  .then((res) => {
                    alert(res.message);
                  })
                  .catch((err) => {
                    alert(err);
                  });
                }}>Change</Button>
              </Form>
              <Header as="h3">Actions</Header>
              <Message error>
                <Header>Warning</Header>
                <p>These actions will have serious and permanent effects on the selected account!</p>
                <p>Selected Account: <strong>{selectedUsername}</strong></p>
              </Message>
              <Button color="red" onClick={() => {
                setDeleteAccountModalOpen(true);
              }}>Delete</Button>
              
            </Container> : null}
                    </Container>

<Container>
  <Table celled selectable>
  <Table.Header>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Author</Table.HeaderCell>
      <Table.HeaderCell>Submission Type</Table.HeaderCell>
  </Table.Header>
  
  <Table.Body>       
      {submissionTable}
  </Table.Body>

  <Table.Footer>
      <Table.Row>
          <Table.HeaderCell colSpan='3'>
              <Menu floated='right' pagination>
                  <Menu.Item as='a' icon>
                      <Icon name='chevron left' />
                  </Menu.Item>
                  <Menu.Item as='a'>1</Menu.Item>
                  <Menu.Item as='a'>2</Menu.Item>
                  <Menu.Item as='a'>3</Menu.Item>
                  <Menu.Item as='a'>4</Menu.Item>
                  <Menu.Item as='a' icon>
                      <Icon name='chevron right' />
                  </Menu.Item>
              </Menu>
          </Table.HeaderCell>
      </Table.Row>
  </Table.Footer>
</Table>
    <Container>
    
    </Container>
    {Globals.ENABLE_DEBUG_MODE? <Container>

    </Container>: null}
      </Container>
        {Globals.ENABLE_DEBUG_MODE && roles.includes("developers")? <Container>
          <Header as="h2">DEBUG:</Header>
          <Message error>
            <p>NOTE: These options are for debug purposes only and are not supposed to be available on a live build! </p>
            <p>Please be aware that these options can have significant (and permanent) effects on the database!</p>
          </Message>
          <Button onClick={() => {
            if(window.confirm("Remove all appeals from the database?")) {
            const token = localStorage.jwtToken;
            setAuthToken(token);
            const decoded = jwt_decode(token);
            fetch(`${Globals.API_URL}/debug/removeAllAppeals`, { method: 'DELETE', headers: { "x-access-token": token, "username": decoded.name}})
              .then((res) => res.json())
              .then((res) => {
                alert(res.message);
              })
              .catch(error =>
              {
                alert(error);
              })
            }
          }}>Remove All Appeals</Button>
          <Button onClick={() => {
            if(window.confirm("Clear all moderator actions?")) {
            const token = localStorage.jwtToken;
            setAuthToken(token);
            const decoded = jwt_decode(token);
            fetch(`${Globals.API_URL}/debug/clearAllModeratorActions`, { method: 'DELETE', headers: { "x-access-token": token, "username": decoded.name}})
              .then((res) => res.json())
              .then((res) => {
                alert(res.message);
              })
              .catch(error =>
              {
                alert(error);
              })
            }
          }}>Clear All Moderator Actions</Button>
          </Container>: null}
            
                    </Container> : 
                    <Message negative>
                        <Message.Header>Error</Message.Header>
                        <p>You must be an admin to access this page.</p>
                    </Message>}
                </Container>
      </div>
    ) 
}

        

AdminDashboardComponent.propTypes = {
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    account: state.account
  });
  
  export default connect(
    mapStateToProps,
    { logoutUser }
  )(AdminDashboardComponent);