import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Container, Header, Form, Grid, Button, Checkbox, List } from 'semantic-ui-react';
//import { FormattedMessage } from 'react-intl';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Globals from '../../globals';


function PrivateMessagesModal(props) {
  const [username, setUsername] = useState("");
  const [pmsList, setPMsList] = useState([]);
  const [pmsTable, setPMsTable] = useState([]);
  const [pmsLoaded, setPMsLoaded] = useState(false);
  const [accountsLoaded, setAccountsLoaded] = useState(false);

    async function refreshPMs() {
    if(pmsLoaded === false) {
      setPMsList(props.account.accountInfo.privateMessages);
      var pmsTable = [];
      pmsTable = pmsList.map(message => {
        var senderUsername = "";
        var senderImage = "";
        fetch(`${Globals.API_URL}/account/info/?id=${message.sender}`)
        .then((res) => res.json())
        .then((sender) =>
        {
          senderUsername = sender.username;
          senderImage = sender.profileImageURL;
        });
        return(
          <List.Item>

          </List.Item>
        );
      })
      setAccountsLoaded(true);
      setPMsTable(pmsTable);
    }
  }

        return (
            <Container>
                <Header as="h1">Private Messages</Header>
                {pmsList}
                <Form>

                </Form>
            </Container>
        )
}
PrivateMessagesModal.propTypes = {
  auth: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  account: state.account
});
  
export default connect(
  mapStateToProps
)(PrivateMessagesModal);