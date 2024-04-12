import { createMedia } from "@artsy/fresnel";
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import setAuthToken from "../../services/auth.token";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { logoutUser } from "../../services/auth.service";
import PropTypes from "prop-types";
import Globals from '../../globals';
import { Container, Form, Message, Button } from 'semantic-ui-react';
import TextEditor from '../components/custom_components/text-editor.component';
import Navigation from '../components/custom_components/navigation.component';
import Footer from '../components/custom_components/footer.component';

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

function EditBlogPostComponent(props) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [postTitle, setPostTitle] = useState("");
    const [postContents, setPostContents] = useState("");
    const [postCreated, setPostCreated] = useState(new Date());
    const [author, setAuthor] = useState("");
    const [error, setError] = useState(false);
    const [successful, setSuccessful] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [invalidTitle, setInvalidTitle] = useState(false);

    const { post } = useParams();

    useEffect(() => {
        if (props.auth.isAuthenticated) {
          setLoggedIn(true);
          
        }
        if(post === "NEW") {
          if(props.auth.isAuthenticated && 
            (props.account.accountInfo.roles.includes("moderators") ||
            props.account.accountInfo.roles.includes("admins") ||
            props.account.accountInfo.includes("developers"))) {
              setPostTitle("");
              setAuthor(props.account.accountInfo.id);
              setPostContents("");
              setPostCreated(new Date());
            } else {
              setError(true);
              setMessage("You must be a moderator, an admin, or a developer to create a new blog post.");
            }
        } else {
          fetch(`${Globals.API_URL}/blog/posts/get/?id=${post}`)
          .then((res) => res.json())
          .then(res => 
            {
                console.log(res);
                if(res.statusCode === 404) {
                  setError(true);
                  setMessage(res.message);
                } else {
                    setPostTitle(res.name);
                    setAuthor(res.author);
                    setPostContents(res.postContents);
                    setPostCreated(res.dateCreated);
              }
            })
          .catch(err => {
            console.log(err);
          })
        }
      }, [post]);

      function handleSubmit(e) {
        var invalidTitle = postTitle === "";
        setShowLoader(true);
        setInvalidTitle(invalidTitle);
        if(invalidTitle === false) {
          if(post === "NEW") {
            const token = localStorage.jwtToken;
            setAuthToken(token);
            fetch(`${Globals.API_URL}/blog/post`, {
              method: 'POST',
              headers: { "Content-Type": "application/json", "x-access-token": token, "username": props.account.accountInfo.username },
              body: JSON.stringify({
                  name: postTitle,
                  postContents: postContents
          })})
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            setShowMessage(true);
            setSuccessful(false);
            setMessage(err);
          });
          } else {

          }
        } else {
          setShowMessage(true);
          setSuccessful(false);
          setMessage("The post title cannot be blank.");
        }
    }

    if(error) {
        document.title = "Error - Acadiverse Blog";
        return (
        <Container fluid>
            <Navigation activeItem = "blog" />
            <Message error>
                {post === "NEW"?<Message.Header>You cannot create a new post.</Message.Header>:<Message.Header>You cannot edit this post.</Message.Header>}
                Error: {message}
            </Message>
            
        </Container>
        )
    } else {
      if(post === "NEW") {
        document.title = "New Post - Acadiverse Blog";
      } else {
        document.title = "Edit Post - Acadiverse Blog";
      }
        return (
          <Navigation activeItem = "blog">
            
            <MediaContextProvider>
                <Container fluid as={Media} at="mobile" className="content">  
                    Mobile 
                </Container>

                <Container fluid as={Media} greaterThan="mobile" className="content">
                    <Form>
                      {showMessage === true && successful === false?<Message error>
                      {post === "NEW"?<Message.Header>Could not publish your post.</Message.Header>:<Message.Header>Could not edit this post.</Message.Header>}
                      {message}
                      </Message>:null}
                      <Form.Field>
                        <Form.Input label="Post Title:" type="text" value={postTitle} onChange={(e, data) => setPostTitle(e.target.ATTRIBUTE_NODEvalue)} />
                      </Form.Field>
                      <Form.Field>
                        <TextEditor 
                          value={postContents} 
                          onChange={(value) => setPostContents(value)} 
                          previewEnabled
                          displayPreviewByDefault
                          showToolbar
                        />
                      </Form.Field>
                      <Button onClick={(e) => {handleSubmit(e)}}>Submit Post</Button>
                    </Form>
                    
                </Container>
            </MediaContextProvider>
          </Navigation>
        )
    }
}
EditBlogPostComponent.propTypes = {
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    account: state.account
  });
  export default connect(
    mapStateToProps,
    { logoutUser }
  )(EditBlogPostComponent);