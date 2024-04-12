import { createMedia } from "@artsy/fresnel";
import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { Link } from 'next/link';
import PropTypes from 'prop-types';
import { Container, Header, Icon, Step, Button} from 'semantic-ui-react';
import Navigation from '../custom_components/navigation.component';
import Footer from '../custom_components/footer.component';
import Globals from "../../globals";


function OnboardingModal(props) {
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [accountType, setaccountType] = useState("");
    const [educationLevel, setEducationLevel] = useState("");
    const [preferredUse, setPreferredUse] = useState("");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setDisplayName(props.account.accountInfo.displayName);
        setUsername(props.account.accountInfo.username);
    });

    return (
        <Container>
            <Step.Group>
                <Step link active={currentStep === 0}>
                    <Step.Title>Welcome!</Step.Title>
                    <Step.Description>Thanks for joining!</Step.Description>
                </Step>
                <Step link active={currentStep === 1}>
                    <Step.Title>User Type</Step.Title>
                    <Step.Description>Please specify which description best fits you.</Step.Description>
                </Step>
            </Step.Group>
            {currentStep === 0? <Container>
                <Header as="h1">Welcome to Acadiverse!</Header>
                <Header as="h2">Hello there, {displayName} (@{username})!</Header>
                <p>Thank you for joining Acadiverse, the free gamified learning platform! Before you start, we would like you to tell us a few things.</p>
                <p>Specifically, we would like to know how you plan on using Acadiverse so we can tailor your experience accordingly.</p>
                <Button onClick={() => {setCurrentStep(currentStep + 1);}}>Next</Button>
            </Container>: null}
            {currentStep === 1? <Container>
                <Header as="h1">What is your current level of education/learning?</Header>
                <Button>Pre-K</Button>
                <Button>K-12</Button>
                <Button>College</Button>
                <Button>Vocational Training</Button>
                <Button>Independent Learning</Button>
                <Button onClick={() => {setCurrentStep(currentStep + 1);}}>Next</Button>
            </Container>: null}
            {currentStep === 2? <Container>
                <Header as="h1">What best describes you?</Header>
                <Button>Student/Independent Learner/Trainee</Button>
                <Button>Teacher/Instructor/Corporate Trainer</Button>
                <Button>Parent</Button>
                <Button onClick={() => {setCurrentStep(currentStep + 1);}}>Next</Button>
            </Container>: null}
        </Container>
    )
}
OnboardingModal.propTypes = {
    auth: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    account: state.account
  });
    
  export default connect(
    mapStateToProps
  )(OnboardingModal);