import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import setAuthToken from "../../services/auth.token";
import { Button, Container, Message, Dropdown, Form } from 'semantic-ui-react';

import Globals from '../../globals';
//import { FormattedMessage } from 'react-intl';

const ban_reasons = [
    {
        key: 'spam',
        text: 'Spam or repeatedly posting the same thing(s).',
        value: 'Spam or repeatedly posting the same thing(s).',
    },
    {
        key: 'impersonation',
        text: 'Impersonating another player.',
        value: 'Impersonating another player.',
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
        key: 'slander',
        text: 'Slander, libel, or defamation towards another individual.',
        value: 'Slander, libel, or defamation towards another individual.'
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
        key: 'malicious_links',
        text: 'Links to malicious or adult sites.',
        value: 'Links to malicious or adult sites.'
    },
    {
        key: 'cybercrime',
        text: 'Teaching others how to commit cybercrimes or bypass paywalls/georestrictions.',
        value: 'Teaching others how to commit cybercrimes or bypass paywalls/georestrictions.'
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
    },
    {
        key: 'multiple_accounts',
        text: 'Use of multiple accounts.',
        value: 'Use of multiple accounts.'
    },
    {
        key: 'ban_evasion',
        text: 'Evading a ban or other restriction.',
        value: 'Evading a ban or other restriction.'
    },
]

const ban_durations = [
    {
        key: '12h',
        text: '12 hours',
        value: '12h',
    },
    {
        key: '24h',
        text: '24 hours',
        value: '24h',
    },
    {
        key: '72h',
        text: '72 hours',
        value: '72h',
    },   
    {
        key: '7d',
        text: '7 days',
        value: '7d'
    },
    {
        key: '14d',
        text: '14 days',
        value: '14d'
    },
    
    {
        key: '30d',
        text: '30 days',
        value: '30d',
    },
    {
        key: '3mo',
        text: '3 months',
        value: '3mo',
    },
    {
        key: '6mo',
        text: '6 months',
        value: '6mo',
    },
    {
        key: '1yr',
        text: '1 year',
        value: '1yr',
    },
    {
        key: 'permanent',
        text: 'Permanent',
        value: 'permanent',
    }
]

function BanAccountComponent(props) {
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [duration, setDuration] = useState("12h");
    const [banReason, setBanReason] = useState("");
    const [additionalDetails, setAdditionalDetails] = useState("");

    function handleSubmit() {
        const token = localStorage.jwtToken;
        setAuthToken(token);
        var dateBanExpires = new Date();
        if(banReason === undefined) {
            setError(true);
            setMessage("Please select a ban reason.");
            return;
        }
        if(additionalDetails === undefined) {
            setError(true);
            setMessage("Please specify additional details about the ban reason.");
            return;
        }
        switch(duration) {
            case "12h":
                dateBanExpires = dateBanExpires.setTime(dateBanExpires.getTime() + 12 * 60 * 60 * 1000);
                break;
            case "24h":
                dateBanExpires = dateBanExpires.setTime(dateBanExpires.getTime() + 24 * 60 * 60 * 1000);
                break;
            case "72h":
                dateBanExpires = dateBanExpires.setTime(dateBanExpires.getTime() + 72 * 60 * 60 * 1000);
                break;
            case "7d":
                dateBanExpires = dateBanExpires.setDate(dateBanExpires.getDate() + 7);
                break;
            case "14d":
                dateBanExpires = dateBanExpires.setDate(dateBanExpires.getDate() + 14);
                break;
            case "30d":
                dateBanExpires = dateBanExpires.setDate(dateBanExpires.getDate() + 30);
                break;
            case "3mo":
                dateBanExpires = dateBanExpires.setMonth(dateBanExpires.getMonth() + 3);
                break;
            case "6mo":
                dateBanExpires = dateBanExpires.setMonth(dateBanExpires.getMonth() + 6);
                break;
            case "1yr":
                dateBanExpires = dateBanExpires.setFullYear(dateBanExpires.getFullYear() + 1);
                break;
            case "permanent":
                dateBanExpires = new Date(1970, 1, 1);
                break;
            default:
                setError(true);
                setMessage("The ban duration is invalid.");
                return;
        }
        fetch(`${Globals.API_URL}/auth/banAccount?username=${props.otherUsername}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", "x-access-token": token, "username": props.username },
            body: JSON.stringify({
                banReason: banReason + "- " + additionalDetails,
                dateBanExpires: dateBanExpires
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

    function handleBanReasonChanged(e, data) {setBanReason(data.value);}

    function handleBanDurationChanged(e, data) {setDuration(data.value);}

    function handleAdditionalDetailsChanged(e, data) {setAdditionalDetails(data.value);}

    return (      
        <Container>
            {error ? <Message error>
                <Message.Header>Error</Message.Header>
                {message}
            </Message> : null}
            <Form>
                <Form.Field>
                    <label>Ban Reason:</label>
                    <Dropdown
                    placeholder='Please select a ban reason..'
                    fluid
                    selection
                    options={ban_reasons}
                    onChange={(e, data) => {handleBanReasonChanged(e, data)}}
                    value={banReason}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.TextArea label="Additional Details:" placeholder="Please enter additional details about the ban reason." onChange={(e, data) => {handleAdditionalDetailsChanged(e, data)}} />
                </Form.Field>
                <Form.Field>
                    <label>Ban Duration:</label>
                    <Dropdown
                    placeholder='Please select a ban duration.'
                    fluid
                    selection
                    options={ban_durations}
                    onChange={(e, data) => {handleBanDurationChanged(e, data)}}
                    value={duration}
                    />
                </Form.Field>
                <Button color="red" onClick={() => {handleSubmit()}}>Ban Account</Button>
            </Form>
        </Container>        
        
    )
}
BanAccountComponent.propTypes = {
    username: PropTypes.string.isRequired,
    otherUsername: PropTypes.string.isRequired
}

export default BanAccountComponent;