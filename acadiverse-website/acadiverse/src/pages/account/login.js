import { useState, useEffect } from "react";
//import { Link } from 'next/link';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Container, Form, Checkbox, Message, Header } from 'semantic-ui-react';
import { signin } from '../../services/auth.service';
import Globals from '../../globals';
import setAuthToken from "../../services/auth.token";
import { setCurrentUser } from "../../services/auth.service";
import jwt_decode from "jwt-decode";

import { redirect } from 'next/navigation'

//import { FormattedMessage } from 'react-intl';


const LoginComponent = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (props.auth.isAuthenticated) {
          redirect("/app");
        }
    });

    function handleSubmit(e) {
        e.preventDefault();

        setMessage("");
        setLoading(true);
        setUsernameError(false);
        setPasswordError(false);
        setLoginError(false);

        const reqUsername = username;
        const reqPassword = password;

        if(reqUsername !== "" && reqPassword !== "") {
            fetch(`${Globals.API_URL}/auth/signin?username=${reqUsername}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: reqUsername,
                        password: reqPassword,
                    })
            })
                .then((res) => res.json())
                .then(res => {
                    if(res.statusCode === 200) {
                        setSuccessful(true);
                        setLoading(false);
                    // Save to localStorage

                    // Set token to localStorage
                    const { token } = res;
                    localStorage.setItem("jwtToken", token);
                    // Set token to Auth header
                    setAuthToken(token);
                    // Decode token to get user data
                    const decoded = jwt_decode(token);
                    setCurrentUser(decoded);
                    
                    window.location.reload(false);
                    } else {
                        var errorMessage = "";
                        errorMessage = res.message;
                        setLoading(false);
                        setLoginError(true);
                        setMessage(errorMessage);
                    }               
                })
        } else {
            setLoading(false);
            if(username === "") {
                setUsernameError(true);
            }
            if(password === "") {
                setPasswordError(true);
            }
        }
    };

    function onUsernameChanged(e) {
        setUsername(e.target.value);
    
    };

    function onPasswordChanged(e) {
        setPassword(e.target.value);
    };

    return (
        <Container fluid>
            <Header as="h1">Login</Header>
            <Form loading={loading} error={loginError}>
                <Message
                    error
                    header="Login Error"
                    content={message}
                />
                <Form.Field>
                    <Form.Input fluid label="Username" placeholder="Username" error={usernameError} onChange={(e) => {onUsernameChanged(e)}}/>
                </Form.Field>
                <Form.Field>
                    <Form.Input fluid type="password" label="Password" placeholder="Password" error={passwordError} onChange={(e) => {onPasswordChanged(e)}}/>
                </Form.Field>
                <Form.Field>
                    <Checkbox label="Keep me logged in." />
                </Form.Field>
                <Button type="submit" onClick={(e) => {handleSubmit(e)}}>Login</Button>
            </Form>
        </Container>
    );
}

LoginComponent.propTypes = {
    signin: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default connect(
    mapStateToProps,
    { signin }
  )(LoginComponent);