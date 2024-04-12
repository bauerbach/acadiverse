import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
//import { FormattedMessage } from 'react-intl';


export default function ModeratorWarningComponent(props) {
    return (
        <Container>
                <h1>You have recieved a warning from a moderator!</h1>
                <h2>This is your {props.warningNumber} warning.</h2>
                <p>
                    You have received a warning for the following reason:
                </p>
                <p>
                    {props.lastWarningReason}
                </p>
                <p>
                    This warning was given on {props.dateLastWarningReceived.toString()} by <a href={props.moderatorProfileLinkURL}> {props.lastWarnedByModeratorName}</a>.
                </p>
                <p>
                    Please review our <a href="/policies/code-of-conduct">Code of Conduct</a> and <a href="/policies/terms-of-service">Terms of Service</a>, then click "Acknowledge Warning" to acknowledge this warning.
                </p>
        </Container>
    )
}