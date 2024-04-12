import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { Header, Button, Container, Form } from 'semantic-ui-react';
import Globals from '../../globals';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import emoji from "remark-emoji";
import rehypeRaw from "rehype-raw";
import AccountService from '../../services/account.service';
import TextEditor from '../custom_components/text-editor.component';


function CommentView(props) {
    const [context, setContext] = useState("");
    const [itemID, setItemID] = useState("");
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [currentUsername, setCurrentUsername] = useState("");
    const [currentUserIsModerator, setCurrentUserIsModerator] = useState(false);
    const [commentsList, setCommentsList] = useState([]);
    const [reply, setReply] = useState("");

    function handleReply(e){

    }

    function getReplies(comment) {
        var replies = [];
        for(let i = 0; i < comment.replies.length; i++) {
            let reply = comment.replies[i];
            if(reply.replies.length > 0) {
                replies.push(getReplies(reply));
            }
        }
        return replies;
    }

   async function getComments() {
        if(commentsLoaded === false) {
            var commentsArray = [];
            var commentsList = [];
            switch(context) {
                case "submission":
                    await fetch(`${Globals.API_URL}/submissions/get`)
                        .then((res) => res.json())
                        .then((submission) => {
                            commentsArray = submission.comments;
                        });
                    break;
                case "blog_post":
                    await fetch(`${Globals.API_URL}/blog/posts/get`)
                        .then((res) => res.json())
                        .then((post) => {
                            commentsArray = post.comments;
                        });
                    break;
                default:
                    console.log("Invalid context for CommentView; \"" + context + "\" is not a valid context.");
                    return;
            }
            for(let i = 0; i < commentsArray.length; i++) {
                let comment = commentsArray[i];
                let likes = comment.likes;
                let hidden = comment.hidden;
                let edited = comment.edited;
                let text = comment.text;
                let commenterAvatar = comment.commenter_avatar;
                let commenter = "";
                // eslint-disable-next-line
                AccountService.getUsernameFromId(comment.commenter)
                    .then(username => AccountService.getUsernameFromId(comment.commenter))
                    .then(username => {
                        commenter = username;
                    })
                .catch(commenter = "DELETED");
                let profileURL = Globals.DOMAIN + "/profile?user=" + commenter;
                let date = comment.date;
                let replies = getReplies(comment);
                commentsList.push(
                    <li className="comment">
                        <img src={commenterAvatar} />
                        <div className="content">
                            {commenter !== "DELETED" ? <span class="author">DELETED</span> : <span class="author"><a href={profileURL}>{commenter}</a></span>}
                            <div className="metadata">
                                {edited ? <div>{date} (Edited) | {likes} likes.</div> : <div>{date} | {likes} likes.</div>}
                            </div>
                            <p className="text">
                                {hidden ? <i>This comment is hidden.</i> : <ReactMarkdown children={text} remarkPlugins={[remarkGfm, emoji]} rehypePlugins={[rehypeRaw]} />  }
                            </p>
                            <div className="actions">
                                <a>Reply</a>
                                <a>Like</a>
                                {commenter === currentUsername ? <a>Edit</a> : null}
                                {commenter === currentUsername || currentUserIsModerator ? <a>Delete</a> : null}
                                {currentUserIsModerator ? <a>Hide</a> : null}
                            </div>
                        </div>
                        <ul className="ui comments">
                            {replies}
                        </ul>
                    </li>
                );
            }
            setCommentsList(commentsList);
            setCommentsLoaded(true);
        }
    }

    useEffect(() => {
        setCurrentUserIsModerator(props.auth.isAuthenticated && props.account.accountInfo.roles.includes("moderators"));
        setContext(props.context);
        setItemID(props.itemID);
    });

    return (
        <Container>
            <h2>
                Comments
            </h2>
            <hr />
            <ul className="ui comments">
                {commentsList}
            </ul>
            <Form reply>
                <TextEditor 
                    value={reply} 
                    onChange={(value) => setReply(value)} 
                />
                <Button content = "Reply" onClick={() => {handleReply()}} />
            </Form>
        </Container>
    
    )
}
const mapStateToProps = state => ({
    auth: state.auth,
    account: state.account
  });
  
  export default connect(
    mapStateToProps
  )(CommentView);