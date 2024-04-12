import React from 'react';
import PropTypes from 'prop-types';
import { Container, Message } from 'semantic-ui-react';


const NoticeBanner = (props) => {
        if(props.active === true) {
        return (
            <Container fluid className="notice-banner">          
                <Message negative={props.bannerType === "URGENT_NOTICE"} warning={props.bannerType === "IMPORTANT_INFO"} positive={props.bannerType === "SITE_EVENT"} info={props.bannerType === "GENERIC_BANNER"}>
                    <strong>{props.header}</strong><br/>
                    {props.message}
                </Message>
            </Container>
        )
        } else {
            return(null);
        }
}

export default NoticeBanner;