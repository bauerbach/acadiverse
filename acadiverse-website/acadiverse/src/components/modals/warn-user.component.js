import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import setAuthToken from "../../services/auth.token";
import { Button, Container, Message, Dropdown, Form } from 'semantic-ui-react';

import Globals from '../../globals';
//import { FormattedMessage } from 'react-intl';

const warning_reasons = [
    {
        key: 'spam',
        text: 'Spam or repeatedly posting the same thing(s).',
        value: 'Spam or repeatedly posting the same thing(s).',
    },
    {
        key: 'deceptive_content',
        text: 'Misleading submissions or sharing hoaxes/chain letters.',
        value: 'Misleading submissions or sharing hoaxes/chain letters.',
    },   
    {
        key: 'false_information',
        text: 'Spreading false information.',
        value: 'Spreading false information.'
    },
    {
        key: 'foul_language',
        text: 'Foul language or racial/cultural slurs.',
        value: 'Foul language or racial/cultural slurs.',
    },
    {
        key: 'sexual_content',
        text: 'Sexual contant not used in an educational way.',
        value: 'Sexual contant not used in an educational way.',
    },
    {
        key: 'violent_content',
        text: 'Violent content not used in an educational way.',
        value: 'Violent content not used in an educational way.',
    },
    {
        key: 'mature_content',
        text: 'Mature content not marked as "Mature".',
        value: 'Mature content not marked as "Mature".',
    },
    {
        key: 'controlled_substances',
        text: 'References to illegal drugs or other controlled subtances, not used in an educational way.',
        value: 'References to illegal drugs or other controlled subtances, not used in an educational way.',
    },
    {
        key: 'insensitivity',
        text: 'Being insensitive towards those affected by, or trying to take advantage of, a tragedy.',
        value: 'Being insensitive towards those affected by, or trying to take advantage of, a tragedy.'
    },
    {
        key: 'personal_information',
        text: 'Sharing or asking for personal information.',
        value: 'Sharing or asking for personal information.'
    },
    {
        key: 'harassment',
        text: 'Cyberbullying or harassment.',
        value: 'Cyberbullying or harassment.'
    }
]

function WarnUserComponent(props) {
    const [error, setError] = useState(false);
    const [message, setMessage] = useState(false);
    const [warningReason, setWarningReason] = useState("");
    const [additionalDetails, setAdditionalDetails] = useState("");

    function handleSubmit() {
        const token = localStorage.jwtToken;
        setAuthToken(token);
        if(warningReason === undefined) {
            setError(true);
            setMessage("Please specify a warning reason.");
            return;
        }
        if(additionalDetails === undefined) {
            setError(true);
            setMessage("Please provide additional details about the warning reason.");
                return;
        }
        fetch(`${Globals.API_URL}/account/warnUser?username=${props.otherUsername}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", "x-access-token": token, "username": props.username },
            body: JSON.stringify({
                warningReason: warningReason + "- " + additionalDetails,
        })}).then((res) => res.json())
            .then(res => {
                if(res.success) {
                    window.location.reload(false);
                } else {
                    setError(true);
                    setMessage(res.message);
                }
            });
    }

    function handleWarningReasonChanged (e, { value }) {setWarningReason(value);}

    function handleAdditionalDetailsChanged (e, { value }) {setAdditionalDetails(value);}

    return (      
        <Container>
            {error ? <Message error>
                <Message.Header>Error</Message.Header>
                {message}
            </Message> : null}
            <Form>
                <Form.Field>
                    <label>Warning Reason:</label>
                    <Dropdown
                    placeholder='Please select a warning reason..'
                    fluid
                    selection
                    options={warning_reasons}
                    onChange={(e, value) => {handleWarningReasonChanged(e, value)}}
                    value={warningReason}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.TextArea label="Additional Details:" placeholder="Please enter additional details about the warning reason." onChange={() => handleAdditionalDetailsChanged()} />
                </Form.Field>
                <Button color="red" onClick={() => {handleSubmit()}}>Warn User</Button>
            </Form>
            </Container>        
        
    )
}
WarnUserComponent.propTypes = {
    username: PropTypes.string.isRequired,
    otherUsername: PropTypes.string.isRequired
}

export default WarnUserComponent;