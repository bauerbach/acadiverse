import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Dropdown, Form, Grid, Tab } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import SourceTree from 'react-treeview-semantic';
import { FormattedMessage } from 'react-intl';

import Globals from '../../globals';

export default function AcadiverseCourseCreatorComponent() {
    return (
        <Container fluid>
            <Menu>
                <Dropdown text='File' pointing className='link item'>
                    <Dropdown.Menu>
                        <Dropdown.Item>New...</Dropdown.Item>
                        <Dropdown.Item>Open...</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>Save As...</Dropdown.Item>
                        <Dropdown.Item>Back Up Now</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>Download</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown text='Edit' pointing className='link item'>
                    <Dropdown.Menu>
                        <Dropdown.Item>Undo</Dropdown.Item>
                        <Dropdown.Item>Redo</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>Cut</Dropdown.Item>
                        <Dropdown.Item>Copy</Dropdown.Item>
                        <Dropdown.Item>Paste</Dropdown.Item>
                        <Dropdown.Item>Delete</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>Select All</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown text='View' pointing className='link item'>
                    <Dropdown.Menu>

                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown text='Project' pointing className='link item'>
                    <Dropdown.Menu>

                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown text='Tools' pointing className='link item'>
                    <Dropdown.Menu>

                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown text='Help' pointing className='link item'>
                    <Dropdown.Menu>

                    </Dropdown.Menu>
                </Dropdown>
            </Menu>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <SourceTree
                            setActiveItem={null}
                            baseIcon={null}
                            baseColor={null}
                            checkable={true}
                            singleChecked={true}
                            treeData={null}
                            getChecked={null}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}