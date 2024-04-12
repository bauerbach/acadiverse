import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
//import { FormattedMessage } from 'react-intl';


export default function BuddiesComponent(props) {
    const [buddiesArray, setBuddiesArray] = useState([]);

    useEffect(() => {
        setBuddiesArray(props.buddiesArray);
      });

        return (
            <Container fluid>
                
            </Container>
        )
}