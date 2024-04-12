import { createMedia } from "@artsy/fresnel";
import { useState, useEffect } from 'react';
import { Message, Button, Container, Form } from 'semantic-ui-react';
import axios from 'axios';
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

export default function AppealComponent() {
    const [username, setUsername] = useState("");
    const [appealText, setAppealText] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [successful, setSuccessful] = useState(false);

    function submitAppeal(e) {
        e.preventDefault();

        const reqUsername = username;
        const reqAppealText = appealText;

        setSuccessful(false);
        setError(false);
        setMessage("");
        setLoading(true);
        if(reqUsername === "") {
            setError(true);
            setSuccessful(false);
            setMessage("Please enter your username.");
            setLoading(false);
        } else {
            if(reqAppealText === "") {
                setError(true);
                setSuccessful(false);
                setMessage("Please enter the text for your appeal.");
                setLoading(false);
            } else {
                axios
                    .post("http://localhost:4000/api/account/appeal/send", {
                        username: reqUsername,
                        appealText: reqAppealText
                    }).then(response => {
                        if(!response.success) {
                            setSuccessful(false);
                            setError(true);
                            setLoading(false);
                            setMessage(response.message);
                        } else {
                            setSuccessful(true);
                            setError(false);
                            setLoading(false);
                            setMessage(response.message);
                        }
                            
                    })
                    .catch(err => {
                        const status = err.statusCode;
                        var errorMessage = "";
                        if(status === 400) {
                            errorMessage = err.message;
                        } else {
                            errorMessage = "An unknown error has occurred.";
                        }
                        setMessage(errorMessage);
                        setError(true);
                        setSuccessful(false);
                        setLoading(false);
                });
            };
        }
    };

    function onUsernameChanged(e) {
        setUsername(e.target.value);
    };

    function onAppealTextChanged(e) {
        setAppealText(e.target.value);
    };

    return (
        
            
                <Container>
                    Widescreen
                    <h1>Appeal a ban or other account restriction.</h1>
            <Form 
                loading={loading}
                error={error} 
            >
                <Message 
                    error
                    header="Error"
                    content={message}
                />
                { successful ? <Message 
                    header="Appeal Sent"
                    content={message}
                /> : null}
                <Form.Field>
                    <label>Username</label>
                    <input placeholder="Enter your username" onChange={(e) => {onUsernameChanged(e)}} />
                </Form.Field>
                <Form.Field>
                    <label>Please tell us why you believe that you should have not been banned or had a restriction placed on your account.</label>
                    <textarea placeholder="Please provide some information about why you should have your ban or restriction lifted." onChange={(e) => {onAppealTextChanged(e)}} />
                </Form.Field>
            </Form>
            <Button type="submit"onClick={(e) => {submitAppeal(e)}}>Submit Appeal</Button>
            
                </Container>
        
    )
}