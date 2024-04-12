import { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Checkbox, Header, Form, Button, Modal } from 'semantic-ui-react';
//import { FormattedMessage } from 'react-intl';
import setAuthToken from "../../services/auth.token";
import jwt_decode from "jwt-decode";

import Globals from "../../globals";
import DeleteAccountComponent from '../modals/delete-account.component';

function AccountSettingsComponent(props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [profileBio, setProfileBio] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("");
    const [genderPronoun, setGenderPronoun] = useState("");
    const [notifyAchievementReceived, setNotifyAchievementReceived] = useState(true);
    const [notifySubmissionFeatured, setNotifySubmissionFeatured] = useState(true);
    const [notifySubmissionComment, setNotifySubmissionComment] = useState(true);
    const [notifySubmissionUpvote, setNotifySubmissionUpvote] = useState(true);
    const [notifyPMReceived, setNotifyPMReceived] = useState(true);
    const [profileImageURL, setProfileImageURL] = useState("");
    const [usesGravatar, setUsesGravatar] = useState(false);
    const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

    useEffect(() => {
        setUsername(props.username);
        setEmail(props.email);
        setDisplayName(props.displayName);
        setProfileBio(props.profileBio);
        setNewPassword(props.password);
        setGender(props.gender);
        setGenderPronoun(props.genderPronoun);
        setNotifyAchievementReceived(props.notifyAcheivementReceived);
        setNotifySubmissionFeatured(props.notifySubmissionFeatured);
        setNotifySubmissionComment(props.notifySubmissionComment);
        setNotifySubmissionUpvote(props.notifySubmissionUpvote);
        setNotifyPMReceived(props.notifyPMReceived);
        setProfileImageURL(props.profileImageURL);
        setUsesGravatar(props.usesGravatar);
    }, []);

    function handleSubmit() {

        const token = localStorage.jwtToken;
        setAuthToken(token);
        
        const decoded = jwt_decode(token);
        const currentUsername = decoded.name;

        fetch(`${Globals.API_URL}/account/changeSettings`, {
            method: 'POST',
            headers: { 
                "x-access-token": token,
                'username': currentUsername,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                displayName: displayName,
                profileBio: profileBio,
                password: newPassword,
                gender: gender,
                genderPronoun: genderPronoun,
                notifyPMReceived: notifyPMReceived,
                notifyAchievementReceived: notifyAchievementReceived,
                notifySubmissionFeatured: notifySubmissionFeatured,
                notifySubmissionComment: notifySubmissionComment,
                notifySubmissionUpvote: notifySubmissionUpvote,
                
                profileImageURL: profileImageURL,
                usesGravatar: usesGravatar
        })}).then((res) => res.json())
        .then(res => {
            if(res.success) {
                window.location.reload(false);
            } else {
                console.log(res.message);
            }
        });
    }

    function handleDisplayNameChanged(e) { 
        setDisplayName(e.target.value);
    }

    function handleProfileBioChanged(e) { 
        setProfileBio(e.target.value);
    }

    function handleCurrentPasswordChanged(e) { 
       setCurrentPassword(e.target.value);
    }

    function handleNewPasswordChanged(e) { 
        setNewPassword(e.target.value);
    }

    function handleConfirmPasswordChanged(e) { 
       setConfirmPassword(e.target.value);
    }

    function openDeleteAccountModal(e) {
       setDeleteAccountModalOpen(true);
    }

    function closeDeleteAccountModal(e) {
        setDeleteAccountModalOpen(false);
    }

    return (
        <Container fluid>
            <Modal open={deleteAccountModalOpen} className="delete-account-popup">
                <Header>Delete Account</Header>
                <DeleteAccountComponent username={props.username} />
            </Modal>
            <Header as="h1">Account Settings</Header>
            <Form>
                <Header as="h2">Profile</Header>
                <Form.Field>
                    <Checkbox label="Use Gravatar" onChange={(e, data) => {setUsesGravatar(data.checked)}} />
                </Form.Field>
                <Form.Field>
                    <label>Profile Image:</label>
                    <input type="file" name="file" />
                </Form.Field>
                <Form.Field>
                    <Form.Input label="Display Name" onChange={() => {handleDisplayNameChanged()}} value={displayName} />
                </Form.Field>
                <Form.Field>
                    <label>Profile Bio:</label>
                    <textarea value={profileBio} onChange={() => {handleProfileBioChanged()}}></textarea>
                </Form.Field>
                <Header as="h2">Change Password</Header>
                <Form.Field>
                    <Form.Input type="password" label="Current Password" onChange={() => {handleCurrentPasswordChanged()}} />
                </Form.Field>
                <Form.Field>
                    <Form.Input type="password" label="New Password" onChange={() => {handleNewPasswordChanged()}} />
                </Form.Field>
                <Form.Field>
                    <Form.Input type="password" label="Confirm Password" onChange={() => {handleConfirmPasswordChanged()}} />
                </Form.Field>
                <Button>Save Changes</Button>
                <Header as="h2">Notifications</Header>
                <Form.Field>
                    <Checkbox label="PM Recieved" onChange={(e, data) => {setNotifyPMReceived(data.checked)}} checked={notifyPMReceived} />
                </Form.Field>
                <Form.Field>
                    <Checkbox label="Achievement Received" onChange={(e, data) => {setNotifyAchievementReceived(data.checked)}} checked={notifyAchievementReceived} />
                </Form.Field>
                <Form.Field>
                    <Checkbox label="Submission Comment" onChange={(e, data) => {setNotifySubmissionComment(data.checked)}} checked={notifySubmissionComment} />
                </Form.Field>
                <Form.Field>
                    <Checkbox label="Submission Upvote Milestone" onChange={(e, data) => {setNotifySubmissionUpvote(data.checked)}} checked={notifySubmissionUpvote} />
                </Form.Field>
                <Form.Field>
                    <Checkbox label="Submission Featured" onChange={(e, data) => {setNotifySubmissionFeatured(data.checked)}} checked={notifySubmissionFeatured} />
                </Form.Field>
                <Button type="submit" onClick={() => {handleSubmit()}}>Submit</Button>
            </Form>
            <Button color="red" onClick={() => {openDeleteAccountModal()}}>Delete Account</Button>
        </Container>
    )
}
AccountSettingsComponent.propTypes = {
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    profileBio: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    genderPronoun: PropTypes.string.isRequired,
    notifyAchievementReceived: PropTypes.bool.isRequired,
    notifySubmissionFeatured: PropTypes.bool.isRequired,
    notifySubmissionComment: PropTypes.bool.isRequired,
    notifySubmissionUpvote: PropTypes.bool.isRequired,
    notifyPMReceived: PropTypes.bool.isRequired,
    profileImageURL: PropTypes.string.isRequired,
    usesGravatar: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
    
});
export default connect(
    mapStateToProps
  )(AccountSettingsComponent);