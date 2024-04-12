import { createMedia } from "@artsy/fresnel";
import { useState, useEffect } from 'react';
import { Button, Container, Dropdown, Form } from 'semantic-ui-react';
import Navigation from '../components/custom_components/navigation.component';
import Footer from '../components/custom_components/footer.component';

import Globals from '../globals';
//import { FormattedMessage } from 'react-intl';

const AppMedia = createMedia({
    breakpoints: {
        mobile: 320,
        tablet:768,
        computer: 992,
        largeScreen: 1200,
        widescreen: 1920
    }
});

const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;

const categories = [
    {
        key: 'account_ban',
        text: 'My account was banned or restricted.',
        value: 'account_ban',
    },
    {
        key: 'forgot_info',
        text: 'I forgot my username or my password.',
        value: 'forgot_info',
    },
    {
        key: 'policy_violation',
        text: 'There is a violation of the Terms of Service or Acceptable Use Policy.',
        value: 'policy_violation',
    },
    {
        key: 'copyright_issue',
        text: 'Someone is infringing upon my copyright.',
        value: 'copyright_issue',
    },
    {
        key: 'trademark_issue',
        text: 'Someone is using my trademark without my permission.',
        value: 'trademark_issue'
    },
    {
        key: 'technical_issue',
        text: 'I am experiencing a technical issue.',
        value: 'technical_issue'
    },
    {
        key: 'other_issue',
        text: 'I have an issue that is not listed here.',
        value: 'other_issue'
    }
]



export default function ContactComponent(props) {
    const [value, setValue] = useState("");

    function handleChange (e, { value }) {setValue(value);}
    
        document.title = "Contact Us - Acadiverse";
        return (
                <MediaContextProvider>
                    <Container fluid as={Media} at="mobile" className="content">  
                        Mobile 
                    </Container>

                    <Container fluid as={Media} at="tablet" className="content">
                        Tablet
                    </Container>

                    <Container fluid as={Media} at="computer" className="content">
                        Computer
                    </Container>

                    <Container fluid as={Media} at="largeScreen" className="content">
                        Large Screen
                    </Container>

                    <Container fluid as={Media} greaterThanOrEqual="widescreen" className="content">
                        Widescreen
                        <h1>Contact Us</h1>
                <Form>
                    <Form.Field>
                        <label>Your Name:</label>
                        <input aria-label="Your Name" placeholder="Enter your username" />
                    </Form.Field>
                    <Form.Field>
                        <label>Your Email (or your parent/guardian's email):</label>
                        <input aria0label="Your email or your parent/guardian's email" type="email" />
                    </Form.Field>
                    <Form.Field>
                        <Dropdown
                            placeholder='Select a category.'
                            fluid
                            selection
                            options={categories}
                            onChange={(e, value) => handleChange(e, value)}
                            value={value}
                        />
                     </Form.Field>
                    <Form.Field>
                        {value === 'policy_violation' ? 
                        <div>
                            <p>
                                To report a policy violation, you can for the most part use the "Report" button. However, you can provide more details below if you believe that more details need to be provided or the issue is in multiple places.
                            </p>
                        </div>
                        : null}
                        {value === 'account_ban' ? 
                        <div>
                            <p>
                                To appeal an account ban or other account restriction, please go to <a href={Globals.DOMAIN + "/account/appeal"}>acadiverse.com/account/appeal</a>.
                            </p>
                        </div>
                        : null}
                        {value === 'forgot_info' ? 
                        <div>
                            <p>
                                If you forgot your username or password, you can click on the "I forgot my password." link on the login page.
                            </p>
                        </div>
                        : null}
                        {value === 'other_issue' || value === 'technical_issue' || value === 'trademark_issue' || value === 'copyright_issue' || value === 'policy_violation' ? 
                        <div>
                            <label>Please describe your problem in further detail:</label>
                            <textarea aria-label="Please describe your problem in further detail." placeholder="Write a few paragraphs describing your problem." /> 
                        </div>
                        : null}

                        </Form.Field>
                    </Form>
                    <Button type="submit">Send Message</Button>
                
                    </Container>
                </MediaContextProvider>
        )
}