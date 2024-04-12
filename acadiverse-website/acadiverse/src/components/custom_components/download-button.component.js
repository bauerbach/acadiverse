import React, { Component } from 'react';
import { Icon, Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';


export default function DownloadButton(props) {
    function downloadFile() {
        window.location.href = props.filePath;
    }  
    return (
            
        <Button icon labelPosition="left" onClick={() => {downloadFile()}}>
            <Icon name="download" />
            Download
        </Button>
    )
}