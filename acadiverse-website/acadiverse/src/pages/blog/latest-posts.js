import { createMedia } from "@artsy/fresnel";
import { useState, useEffect } from 'react';
import { Container, Icon, Header, Button, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import Globals from '../../globals';
import setAuthToken from "../../services/auth.token";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { logoutUser } from "../../services/auth.service";
import PropTypes from "prop-types";
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

function ViewBlogPostsComponent(props) {
  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState([]);
  const [postsArray, setPostsArray] = useState([]);
  const [postsLoaded, setPostsLoaded] = useState(false);

    useEffect(() => {
      if(props.auth.isAuthenticated === true) {
        setUsername(props.account.accountInfo.username);
        setRoles(props.account.accountInfo.roles);
      }
      getPosts();     
    }, []);

    async function getPosts() {
      if(postsLoaded === false) {
        var postsArray = [];
        var postsList = [];
        await fetch(`${Globals.API_URL}/blog/posts/list`)
          .then((res) => res.json())
          .then((posts) => 
          {
              postsArray = posts;
          });

          console.log(postsArray);
          console.log(postsArray.length);
          for (let i = 0; i < postsArray.length; i++) {
            let post = postsArray[i];
            let id = post._id;
            let title = post.name;
            let image = post.image;
            let author = "";
            AccountService.getUsernameFromId(post.author)
              .then(username => AccountService.getUsernameFromId(post.author))
              .then(username => {
                author = username;
              })
              .catch(author = "DELETED");
            let dateCreated = post.date_created;
            let postContents = post.post_contents.slice(0, 200) + "...";
            postsList.push(
              <Item key={post._id}>
                <Item.Image size="small" src={image} />
                <Item.Content>
                  <Item.Header as="a" href={"/blog/post/?id=" + id}>{title}</Item.Header>
                  <Item.Meta>{author} | {dateCreated}</Item.Meta>
                  <Item.Description>{postContents}</Item.Description>
                </Item.Content>
            </Item>
            );
          };
          
        setPostsLoaded(true);
        setPostsArray(postsList);
      }
    }

    return (
        <MediaContextProvider>
          <Container as={Media} at="mobile" className="content">  
              
          </Container>
          <Container as={Media} greaterThan="mobile" className="content">
            <Header as="h1">Acadiverse Blog- Latest Posts</Header>
            {roles.includes("moderators") || roles.includes("admins") || roles.includes("developers") ? <Link href="/blog/posts/edit/NEW">
              <Button className="publish-button">
                <Icon name="post"/>
                New Post
              </Button>
            </Link> : null}
            <Item.Group link>
              {postsArray}
            </Item.Group>
          
          </Container>
        </MediaContextProvider>
    )
}

ViewBlogPostsComponent.propTypes = {
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    account: state.account
  });
  
  export default connect(
    mapStateToProps,
    { logoutUser }
  )(ViewBlogPostsComponent);