import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import setAuthToken from "../../services/auth.token";
import { Button, Container, Message, Dropdown, Form } from 'semantic-ui-react';

import Globals from '../../globals';
//import { FormattedMessage } from 'react-intl';

const user_reasons = [
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
    }
]

const submission_reasons = [
    {
        key: 'spam',
        text: 'The submission is spam.',
        value: 'The submission is spam.',
    },
    {
        key: 'stolen_content',
        text: 'The submission is a repost of another user\'s submission.',
        value: 'The submission is a repost of another user\'s submission.',
    },
    {
        key: 'deceptive_content',
        text: 'The submission is misleading.',
        value: 'The submission is misleading.',
    },   
    {
        key: 'false_information',
        text: 'The submission contains false information.',
        value: 'The submission contains false information.'
    },
    {
        key: 'slander',
        text: 'The submission is slanderous, libelous, or defamatory.',
        value: 'The submission is slanderous, libelous, or defamatory.'
    },
    {
        key: 'foul_language',
        text: 'The submission contains foul language or racial/cultural slurs.',
        value: 'The submission contains foul language or racial/cultural slurs.',
    },
    {
        key: 'sexual_content',
        text: 'The submission contains sexual contant not used in an educational way.',
        value: 'The submission contains sexual contant not used in an educational way.',
    },
    {
        key: 'violent_content',
        text: 'The submission contains violent content not used in an educational way.',
        value: 'The submission contains violent content not used in an educational way.',
    },
    {
        key: 'mature_content',
        text: 'The submission has mature content but is not marked as "Mature".',
        value: 'The submission has mature content but is not marked as "Mature".',
    },
    {
        key: 'controlled_substances',
        text: 'The submission contains references to controlled substances not used in an educational way.',
        value: 'The submission contains references to controlled substances not used in an educational way.',
    },
    {
        key: 'malicious_links',
        text: 'The submission contains links to malicious or adult sites.',
        value: 'The submission contains links to malicious or adult sites.'
    },
    {
        key: 'cybercrime',
        text: 'The submission teaches people how to commit cybercrimes or bypass paywalls/georestrictions.',
        value: 'The submission teaches people how to commit cybercrimes or bypass paywalls/georestrictions.'
    },
    {
        key: 'insensitivity',
        text: 'The submission tries to take advantage of or is insensitive towards those affected by a tragedy.',
        value: 'The submission tries to take advantage of or is insensitive towards those affected by a tragedy.'
    },
    {
        key: 'personal_information',
        text: 'The submission contains a user\'s personal information or requests it.',
        value: 'The submission contains a user\'s personal information or requests it.'
    },
    {
        key: 'This submission contains content used to bully or harass somebody.',
        value: 'This submission contains content used to bully or harass somebody.'
    }
]

function ReportForm(props) {
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
    const [value, setValue] = useState("");
    const [details, setDetails] = useState("");

    function handleSubmit() {
        const token = localStorage.jwtToken;
        setAuthToken(token);
        fetch(`${Globals.API_URL}/sendReport?username=${props.username}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", "x-access-token": token, "username": props.username },
            body: JSON.stringify({
                username: props.username,
                content: props.content,
                context: props.context,
                contentURL: props.contentURL,
                reason: value
        })}).then((res) => res.json())
            .then(res => {
                console.log(res);
                if(res.success) {
                    props.reportSent();
                } else {
                    setError(true);
                    setMessage(res.message);
                }
            });
    }

    function handleChange(e, { value }) {setValue(value);}

    function handleDetailsChanged(e, { details }) {setDetails(details);}
   
    return (      
        <Container>
            {error ? <Message error>
                <Message.Header>Error</Message.Header>
                {message}
            </Message> : null}
            <Form>
                {props.context === "user"? 
                <Form.Field>
                    <label>What is the reason you are filing a report?</label>
                    <Dropdown
                    placeholder='Please choose why you are reporting this user.'
                    fluid
                    selection
                    options={user_reasons}
                    onChange={(e, value) => {handleChange(e, value)}}
                    value={value}
                    />
                </Form.Field> : null}
                {props.context === "submission"? 
                <Form.Field>
                    <label>What is the reason you are filing a report?</label>
                    <Dropdown
                    placeholder='Please choose why you are reporting this content.'
                    fluid
                    selection
                    options={submission_reasons}
                    onChange={(e, value) => {handleChange(e, value)}}
                    value={value}
                    />
                </Form.Field> : null}
                <Form.TextArea label="Please provide more details below:" placeholder="Please provide more details here." onChange={(e, value) => {handleDetailsChanged(e, value)}} />
                
                <Button color="red" onClick={() => {handleSubmit()}}>Report</Button>
            </Form>
            <p className="warning-text">Please note that submitting false reports is a violation of the <a href={Globals.DOMAIN + "/policies/code-of-conduct"} target="_blank" rel="noreferrer">Code of Conduct</a> and may result in action being taken on your account.</p>
            </Container>        
        
    )
}
ReportForm.propTypes = {
    username: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
    contentURL: PropTypes.string.isRequired
}

export default ReportForm;