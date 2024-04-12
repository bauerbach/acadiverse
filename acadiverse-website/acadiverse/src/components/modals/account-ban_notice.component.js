import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
//import { FormattedMessage } from 'react-intl';


export default function AccountBanNotice(props) {
    return (
        <Container>
                <h1>Account Banned</h1>
                <p>Ban Reason: {props.banReason}</p>
                <p>
                {new Date(props.dateBanExpires).getFullYear() === 1970 ? "This ban is permanent." : "This ban will expire on " + new Date(props.dateBanExpires).toLocaleString() + "." }
                </p>
                <p>If you believe that this is a mistake, please go to <a href="http://acadiverse.com/account/appeal">acadiverse.com/account/appeal</a> to appeal this ban.</p>
        </Container>
    )
}