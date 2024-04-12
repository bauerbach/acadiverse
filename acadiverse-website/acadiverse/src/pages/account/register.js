import { useState, useEffect } from 'react';
import { Button, Container, Radio, Form, Message, Checkbox, Header } from 'semantic-ui-react';
//import { signup } from "../services/auth.service";
import setAuthToken from "../../services/auth.token";
//import jwt_decode from "jwt-decode";
//import { FormattedMessage } from 'react-intl';

import Globals from '../../globals';

const RegisterComponent = (props) => {
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);
    const [birthday, setBirthday] = useState(Date.UTC(2001, 1, 1));
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");
    const [registrationError, setRegistrationError] = useState(false);
    const [loading, setLoading] = useState(false);


    function handleSubmit(e) {
        e.preventDefault();

        setMessage("");
        setSuccessful(false);
        setRegistrationError(false);
        setLoading(true);

        const reqUsername = username;
        const reqDisplayName = displayName;
        const reqPassword = password;
        const reqConfirmPassword = confirmPassword;
        const reqEmail = email;
        const reqBirthday = birthday;
        

        fetch(`${Globals.API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: reqUsername,
                displayName: reqDisplayName,
                password: reqPassword,
                confirmPassword: reqConfirmPassword,
                email: reqEmail,
                birthday: reqBirthday
        })}).then((res) => res.json())
            .then(
                res => {
                    console.log(res);
                    if(res.statusCode === 200) {        
                        setMessage(res.message);
                        setSuccessful(true);
                        setRegistrationError(false);
                        setLoading(false);

                    // Save to localStorage

                    // Set token to localStorage
                    const { token } = res;
                    localStorage.setItem("jwtToken", token);
                    // Set token to Auth header
                    setAuthToken(token);
                    // Decode token to get user data
                    //const decoded = jwt_decode(token);

                    window.location.reload(false);
                } else {
                    setMessage(res.message.split('\n').map(line=>(<>{line}<br /></>)));
                    setSuccessful(res.success);
                    setRegistrationError(!res.success);
                    setLoading(false);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    function onUsernameChanged(e) {
        setUsername(e.target.value);
    };
    
    function onDisplayNameChanged(e) {
        setDisplayName(e.target.value);
    };

    function onEmailChanged(e) {
        setEmail(e.target.value);
    };

    function onPasswordChanged(e) {
        setPassword(e.target.value);
    };

    function onConfirmPasswordChanged(e) {
        setConfirmPassword(e.target.value);
    };

    function onDateChanged(e) {
        setBirthday(e.target.value);
    };

    return (
        <Container>
            <Header as="h1">Register</Header>
            {successful == true? <Message info header="Registration Successful" content={message}/> : null}
            <Form loading={loading} error={registrationError}>
            <Message
                    error
                    header="Registration Error"
                    content={message}
                />
                <Form.Field>
                    <label>Username</label>
                    <Form.Input fluid placeholder="Enter the username for your new account." onChange={(e) => {onUsernameChanged(e)}} />
                </Form.Field>
                
                <Form.Field>
                    <label>Password</label>
                    <Form.Input fluid type="password" onChange={(e) => {onPasswordChanged(e)}} />
                </Form.Field>
                <Form.Field>
                    <label>Confirm Password</label>
                    <Form.Input fluid type="password" onChange={(e) => {onConfirmPasswordChanged(e)}} />
                </Form.Field>
                <Form.Field>
                    <label>Display Name</label>
                    <Form.Input fluid placeholder="Enter the display name (preferably your real name) for your new account." onChange={(e) => {onDisplayNameChanged(e)}} />
                </Form.Field>
                <Form.Field>
                    <label>Birthday</label>
                    <Form.Input fluid type="date" onChange={(e) => {onDateChanged(e)}} />
                </Form.Field>
                <Form.Field>
                    <label>Email</label>
                    <Form.Input fluid type="email" onChange={(e) => {onEmailChanged(e)}} />
                </Form.Field>
                <Form.Field>
                    <Checkbox 
                        label={
                            <label>
                                I agree to the&nbsp;
                                <a href={Globals.DOMAIN + "/policies/terms-and-conditions"} target="_blank" rel="noreferrer">Terms &amp; Conditions</a>,&nbsp;
                                <a href={Globals.DOMAIN + "/policies/privacy-policy"} target="_blank" rel="noreferrer"> Privacy Policy</a>, and&nbsp;
                                <a href={Globals.DOMAIN + "/policies/code-of-conduct"} target="_blank" rel="noreferrer">Code of Conduct</a>.
                            </label>
                        } />    
                </Form.Field>
            </Form>
            <Button type="submit" onClick={(e) => {handleSubmit(e)}}>Register</Button>
        </Container>
    )
}

export default RegisterComponent;