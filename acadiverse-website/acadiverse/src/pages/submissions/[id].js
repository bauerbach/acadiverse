import { createMedia } from "@artsy/fresnel";
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useRouter } from 'next/router';
import { Container, Header, Button, Rating, Icon } from 'semantic-ui-react';
import setAuthToken from "../../services/auth.token";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { logoutUser } from "../../services/auth.service";
import AuthService from '../../services/auth.service';
import PropTypes from "prop-types";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import CommentViewComponent from '../../components/custom_components/comment-view.component';
import ProfileLink from '../../components/custom_components/profile-link.component';
import Globals from '../../globals';


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

function SubmissionDetailsPage(props) {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [type, setType] = useState("");
  const [comments, setComments] = useState([]);
  const [dateCreated, setDateCreated] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [url, setUrl] = useState("");
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [favorites, setFavorites] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [funness, setFunness] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [minGrade, setMinGrade] = useState(0);
  const [maxGrade, setMaxGrade] = useState(12);
  const [price, setPrice] = useState(0);
  const [discontinued, setDiscontinued] = useState(false);
  const [exclusive, setExclusive] = useState(false);
  const [seasonal, setSeasonal] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [canPublish, setCanPublish] = useState(true);
  const [roles, setRoles] = useState([]);
  const [username, setUsername] = useState("");
  const [reputationPoints, setReputationPoints] = useState(0);

    const router = useRouter();
    useEffect(() => {
      if(router.isReady) {
        setId(router.query.id);
        if (props.auth.isAuthenticated) {
            setLoggedIn(true);
            setCanPublish(props.account.accountInfo.canPublish);
            setRoles(props.account.accountInfo.roles);
            setUsername(props.account.accountInfo.username);
            setReputationPoints(props.account.accountInfo.reputationPoints);
        }

        fetch(`${Globals.API_URL}/submissions/get?id=${id}`)
        .then((res) => res.json())
        .then(res => {
            console.log(res);
            setError(!res.success);
            if(!res.statusCode) {
              setTitle(res.title);
              setDescription(res.description);
              setTags(res.tags);
              setAuthor(res.author);
              setType(res.type);
              setComments(res.comments);
              setDateCreated(res.dateCreated);
              setLastUpdated(res.lastUpdated);
              setHidden(res.hidden);
              setUrl(res.url);
              setUpvotes(res.upvotes);
              setDownvotes(res.downvotes);
              setFavorites(res.favorites);
              setDifficulty(res.difficulty);
              setFunness(res.funness);
              setMinGrade(res.mingrade);
              setMaxGrade(res.maxGrade);
              setPrice(res.price);
              setExclusive(res.isExclusive);
              setDiscontinued(res.isDiscontinued);
              setSeasonal(res.isSeasonal);
            } else {
                if(res.statusCode === 403 && props.auth.isAuthenticated) {
                    fetch(`${Globals.API_URL}/api/submissions/loadHiddenSubmission?id=${id}`)
                    .then((response) => response.json())
                    .then(response => {
                        if(response.success) {
                            setError(false);
                        } else {
                            setMessage(response.message);
                        }
                    });
                } else {
                  setMessage(res.message);
                }
            }  
        });
      }
        
    }, [router.isReady]);
      return (
          <MediaContextProvider>
            <Container fluid as={Media} at="mobile" className="content">
              
            </Container>
              
            <Container fluid as={Media} greaterThan="mobile" className="content">
            <Header as="h1">{title}</Header>
          <ProfileLink user={author} />
          <ReactMarkdown children={description} remarkPlugins={[remarkGfm]} />
          <Button aria-label="Upvote">Upvote</Button>
          <Button aria-label="Downvote">Downvote</Button>
          <p>Difficulty:</p>
          <Rating aria-label="Difficulty Rating" icon="star" defaultRating={difficulty} maxRating={5} />
          <p>Funness:</p>
          <Rating aria-label="Funness Rating" icon="star" defaultRating={funness} maxRating={5} />
          <CommentViewComponent context="submission" itemID={id} />
          
            </Container>
            </MediaContextProvider>
      )
}
SubmissionDetailsPage.propTypes = {
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    account: state.account
  });
  export default connect(
    mapStateToProps,
    { logoutUser }
  )(SubmissionDetailsPage);