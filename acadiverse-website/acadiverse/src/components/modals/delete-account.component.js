import { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { Container, Form, Button, Header, Dropdown, Message } from 'semantic-ui-react';
import Globals from '../../globals';
//import { FormattedMessage } from 'react-intl';
import setAuthToken from "../../services/auth.token";
import jwt_decode from "jwt-decode";


const deletionReasons = [
    {
        key: "reason1",
        text: "I found something better.",
        value: "reason1",
    },
    {
        key: "reason2",
        text: "I don't believe that students will benefit from Acadiverse.",
        value: "reason2",
    },
    {
        key: "reason3",
        text: "I just want a fresh start.",
        value: "reason3",
    },
    {
        key: "reason4",
        text: "Other (please specify below.)",
        value: "reason4",
    }
]
function DeleteAccountComponent(props) {
    const [password, setPassword] = useState("");
    const [deletionReason, setDeletionReason] = useState("");
    const [feedback, setFeedback] = useState("");
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");

    function handlePasswordChanged(e, { value }) {setPassword(value)}

    function handleDeletionReasonChanged(e, { value }) {setDeletionReason(value)}

    function handleFeedbackChanged(e, { value }) {setFeedback(value)}

    function handleSubmit() {

        const token = localStorage.jwtToken;
        setAuthToken(token);
        
        const decoded = jwt_decode(token);
        const currentUsername = decoded.name;

        fetch(`${Globals.API_URL}/auth/deleteAccount`, {
            method: 'DELETE',
            headers: { 
                "x-access-token": token,
                'username': currentUsername,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password,
                deletionReason: deletionReason,
                feedback: feedback
        })}).then((res) => res.json())
        .then(res => {
            if(res.success) {
                window.location.reload(false);
            } else {
                console.log(res.message);
                setError(true);
                setMessage(res.message);
            }
        });
    }

    return (
        <Container>
            {error ? <Message error>
                <Message.Header>Error</Message.Header>
                {message}
            </Message> : null}
            <Message warning>
                <Message.Header>Are you sure you wish to delete your Acadiverse account?</Message.Header>
                Your account will be permanently deleted and you will NOT be able to recover it! All of your comments and submissions will no longer be editable by you and the owner/author will be listed as "DELETED". You will no longer be able to access any of your items, and any Acadiverse Spaces and/or Acadiverse Course Creator projects that you own will also be deleted.
            </Message>
            <Form>
                <Form.Field>
                    <label>Please enter your password:</label>
                    <Form.Input type="password" onChange={() => {handlePasswordChanged()}}></Form.Input>
                </Form.Field>
                <Form.Field>
                    <label>Please tell us why you are deleting your account:</label>
                    <Dropdown
                        selection
                        options={deletionReasons}
                        onChange={(e, value) => {handleDeletionReasonChanged(e, value)}}
                        value={deletionReason}
                        />
                </Form.Field>
                <Form.Field>
                    <Form.TextArea label="Please tell us more info below. Be honest; we appreciate your feedback!" placeholder="Tell us more info on why you are deleting your account." onChange={() => {handleFeedbackChanged()}} />
                </Form.Field>
                <Button type="submit" color="red" onClick={() => {handleSubmit()}}></Button>
            </Form>
        </Container>
    )
}
DeleteAccountComponent.propTypes = {
    username: PropTypes.string.isRequired,
}

export default DeleteAccountComponent;