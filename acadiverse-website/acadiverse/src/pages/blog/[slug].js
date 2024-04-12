import { createMedia } from "@artsy/fresnel";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import setAuthToken from "../../services/auth.token";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { logoutUser } from "../../services/auth.service";
import PropTypes from "prop-types";
import Globals from '../../globals';
import { Container, Header, Image, Message, Comment } from 'semantic-ui-react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import emoji from "remark-emoji";
import rehypeRaw from "rehype-raw";
import AccountService from '../../services/account.service';
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

function BlogPostComponent(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [postContents, setPostContents] = useState("");
  const [postCreated, setPostCreated] = useState(new Date());
  const [author, setAuthor] = useState("");
  const [comments, setComments] = useState([]);
  const [locked, setLocked] = useState(false);
  const [image, setImage] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  
const router = useRouter();

    useEffect(() => {
      if(router.isReady) {
        if (props.auth.isAuthenticated) {
          setLoggedIn(true);
        
        }
          fetch(`${Globals.API_URL}/blog/posts/get/?id=${post}`)
          .then((res) => res.json())
          .then(res => 
            {
                console.log(res);
                if(res.statusCode === 404) {
                  setError(true);
                  setMessage(res.message);
                } else {
                  setName(res.name);
                  setAuthor(res.author);
                  setPostContents(res.postContents);
                  setPostCreated(res.postCreated);
                  setComments(res.comments);
                  setLocked(res.postLocked);
                  setImage(res.image);
              }
            })
          .catch(err => {
            console.log(err);
          })
      }
        
      }, [router.isReady]);

      if(error) {
          return (
          <Container>
              <Navigation activeItem = "blog" />
              <Message error>
                  <Message.Header>This post could not be loaded.</Message.Header>
                  Error: {message}
              </Message>
              
          </Container>
          )
      } else {
          return (
              <MediaContextProvider>
                  <Container as={Media} at="mobile" className="content">  
                      Mobile 
                  </Container>
                  <Container as={Media} greaterThan="mobile" className="content">
                      Widescreen
                      <Header as="h1">{name}</Header>
                      <Header as="h6">{AccountService.getUsernameFromId(author)} | {postCreated.toString()}</Header>
                      <Image src={image} size="large" />
                      <ReactMarkdown children={postContents} remarkPlugins={[remarkGfm, emoji]} rehypePlugins={[rehypeRaw]} />  
                      <Comment.Group>
                          <Header as="h2" dividing>
                              Comments
                          </Header>
                      </Comment.Group>
                      
                  </Container>
              </MediaContextProvider>
          )
      }
}
BlogPostComponent.propTypes = {
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    account: state.account
  });
  export default connect(
    mapStateToProps,
    { logoutUser }
  )(BlogPostComponent);