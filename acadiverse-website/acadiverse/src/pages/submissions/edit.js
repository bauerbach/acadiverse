import { createMedia } from "@artsy/fresnel";
import { useState, useEffect } from 'react';
import storage from '../../firebase-integration';
import { Container, Message, Form, Dropdown, Label, Input, Header, Checkbox, Radio, Portal, Segment, Button, Dimmer, Loader, Advertisement } from 'semantic-ui-react';
import setAuthToken from "../../services/auth.token";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { logoutUser } from "../../services/auth.service";
import PropTypes from "prop-types";
import TextEditor from '../../components/custom_components/text-editor.component';
import Navigation from '../../components/custom_components/navigation.component';
import Footer from '../../components/custom_components/footer.component';
import Globals from '../../globals';
import AccountService from '../../services/account.service';
import Head from 'next/head'


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

const months = [
    { key: "1", text: "January", value: 0 },
    { key: "2", text: "Feburary", value: 1 },
    { key: "3", text: "March", value: 2 },
    { key: "4", text: "April", value: 3 },
    { key: "5", text: "May", value: 4 },
    { key: "6", text: "June", value: 5 },
    { key: "7", text: "July", value: 6 },
    { key: "8", text: "August", value: 7 },
    { key: "9", text: "September", value: 8 },
    { key: "10", text: "October", value: 9 },
    { key: "11", text: "November", value: 10 },
    { key: "12", text: "December", value: 11 },
]

const submissionTypes = [
    {
        key: "course",
        text: "Course",
        value: "course"
    },
    {
        key: "worksheet",
        text: "Worksheet",
        value: "worksheet"    
    },
    {
        key: "scenario",
        text: "Scenario",
        value: "scenario"    
    },
    {
        key: "quiz",
        text: "Quiz",
        value: "quiz"    
    },
    {
        key: "hat",
        text: "Hat",
        value: "hat"    
    },
    {
        key: "hairStyle",
        text: "Hairstyle",
        value: "hairStyle"
    },
    {
        key: "facialHair",
        text: "Facial Hair",
        value: "facialHair"
    },
    {
        key: "eyewear",
        text: "Eyewear",
        value: "eyewear"
    },
    {
        key: "top",
        text: "Top",
        value: "top"
    },
    {
        key: "bottom",
        text: "Bottom",
        value: "bottom"
    },
    {
        key: "footwear",
        text: "Footwear",
        value: "footwear"
    }
];

const upload = (file) =>{
  if(file == null)
    return;
  storage.ref(`/submissions/${file.name}`).put(file)
  .on("state_changed" , alert("success") , alert);
}

function EditSubmissionComponent (props) {
    const [showLoader, setShowLoader] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isDeveloper, setIsDeveloper] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
    const [submissionType, setSubmissionType] = useState("");
    const [submissionTitle, setSubmissionTitle] = useState("");
    const [submissionDescription, setSubmissionDescription] = useState("");
    const [submissionTags, setSubmissionTags] = useState("");
    const [submissionTopic, setSubmissionTopic] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");
    const [targetGroup, setTargetGroup] = useState("");
    const [category, setCategory] = useState("");
    const [newSubmission, setNewSubmission] = useState(false);
    const [canPublish, setCanPublish] = useState(true);
    const [reputationPoints, setReputationPoints] = useState(0);
    const [invalidTitle, setInvalidTitle] = useState(false);
    const [invalidDescription, setInvalidDescription] = useState(false);
    const [invalidType, setInvalidType] = useState(false);
    const [invalidTags, setInvalidTags] = useState(false);
    const [invalidTopic, setInvalidTopic] = useState(false);
    const [invalidTargetGroup, setInvalidTargetGroup] = useState(false);
    const [invalidFile, setInvalidFile] = useState(false);
    const [invalidMinGrade, setInvalidMinGrade] = useState(false);
    const [invalidMaxGrade, setInvalidMaxGrade] = useState(false);
    const [invalidPrice, setInvalidPrice] = useState(false);
    const [invalidSeasonStartMonth, setInvalidSeasonStartMonth] = useState(false);
    const [invalidSeasonEndMonth, setInvalidSeasonEndMonth] = useState(false);
    const [invalidSeasonStartDay, setInvalidSeasonStartDay] = useState(false);
    const [invalidSeasonEndDay, setInvalidSeasonEndDay] = useState(false);
    const [invalidSeasonStartDate, setInvalidSeasonStartDate] = useState(false);
    const [invalidSeasonEndDate, setInvalidSeasonEndDate] = useState(false);
    const [value, setValue] = useState("");
    const [file, setFile] = useState("");
    const [price, setPrice] = useState(0);
    const [discontinued, setDiscontinued] = useState(false);
    const [exclusive, setExclusive] = useState(false);
    const [seasonal, setSeasonal] = useState(false);
    const [seasonStartMonth, setSeasonStartMonth] = useState(0);
    const [seasonStartDay, setSeasonStartDay] = useState(1);
    const [seasonEndMonth, setSeasonEndMonth] = useState(0);
    const [seasonEndDay, setSeasonEndDay] = useState(1);
    const [preK, setPreK] = useState(false);
    const [preKPortalOpen, setPreKPortalOpen] = useState(false);
    const [collegeLevel, setCollegeLevel] = useState(false);
    const [collegeLevelPortalOpen, setCollegeLevelPortalOpen] = useState(false);
    const [trainingMaterial, setTrainingMaterial] = useState(false);
    const [trainingMaterialPortalOpen, setTrainingMaterialPortalOpen] = useState(false);
    const [matureContent, setMatureContent] = useState(false);
    const [maturePortalOpen, setMaturePortalOpen] = useState(false);
    const [minGrade, setMinGrade] = useState(0);
    const [maxGrade, setMaxGrade] = useState(12);

    function handleChange(e, { value }) {setValue(value);}

    function handleSubmissionTitleChanged(e, { submissionTitle }) {setSubmissionTitle(submissionTitle);}

    function handleSubmissionDescriptionChanged(e, { submissionDescription }) {setSubmissionDescription(submissionDescription);}

    function handleSubmissionTopicChanged({ submissionTopic }) {setSubmissionTopic(submissionTopic);}    

    function handleSubmissionTagsChanged({ submissionTags }) {setSubmissionTags(submissionTags);}

    function handleFileChanged(event) {
        setFile(event.target.files[0]);
      }

    function handleDiscontinuedChanged(e, { discontinued }) {setDiscontinued(discontinued);}

    function handleExclusiveChanged(e, { exclusive }) {setExclusive(exclusive);}

    function handleSeasonalChanged(e, { seasonal }) {setSeasonal(seasonal);}

    function handleSeasonStartMonthChanged(e, { seasonStartMonth }) {setSeasonStartMonth(seasonStartMonth);}

    function handleSeasonEndMonthChanged(e, { seasonEndMonth }) {setSeasonEndMonth(seasonEndMonth);}

    function handleSeasonStartDayChanged(e, { seasonStartDay }) {setSeasonStartDay(seasonStartDay);}

    function handleSeasonEndDayChanged(e, { seasonEndDay }) {setSeasonEndDay(seasonEndDay);}

    function handlePreKPortalOpen(e) {
        setPreKPortalOpen(true);
    }

    function handlePreKPortalClosed(e) {
        setPreKPortalOpen(false);
    }

    function handleCollegeLevelPortalOpen(e) {
        setCollegeLevelPortalOpen(true);
    }

    function handleCollegeLevelPortalClosed(e) {
        setCollegeLevelPortalOpen(false);
    }

    function handleTrainingMaterialPortalOpen(e) {
        setTrainingMaterialPortalOpen(true);
    }
    
    function handleTrainingMaterialPortalClosed(e) {
       setTrainingMaterialPortalOpen(false);
    }

    function handleMaturePortalOpen(e) {
        setMaturePortalOpen(true);
    }

    function handleMaturePortalClosed(e) {
       setMaturePortalOpen(false);
    }

    function handleSubmit(e) {
        var invalidTitle = submissionTitle === "";
        var invalidDescription = submissionDescription === "";
        var invalidType = value === "";
        var invalidTags = submissionTags === "";
        
        var invalidFile = file === "";

        var invalidTopic = (value === "Course" || value === "Worksheet" || value === "Scenario"|| value === "Quiz") 
            && (submissionTopic === "")

        var invalidTargetGroup = (value === "Course" || value === "Worksheet" || value === "Scenario"|| value === "Quiz") 
            && (targetGroup === "pre-k" || targetGroup === "k-12" || targetGroup === "college" || targetGroup === "corporateTraining");

        var invalidMinGrade = (minGrade > maxGrade || minGrade < 0) 
            && (value === "Course" || value === "Worksheet" || value === "Scenario" || value === "Quiz");

        var invalidMaxGrade = (maxGrade < minGrade || minGrade > 12) 
            && (value === "Course" || value === "Worksheet" || value === "Scenario" || value === "Quiz");

        var invalidPrice = (price < 0) 
            && !(value === "Course" || value === "Worksheet" || value === "Scenario" || value === "Quiz");

        var invalidSeasonStartMonth = (seasonStartMonth > seasonEndMonth && seasonStartMonth > seasonEndMonth) 
            && !(value === "Course" || value === "Worksheet" || value === "Scenario" || value === "Quiz");

        var invalidSeasonEndMonth = (seasonEndMonth < seasonStartMonth && seasonEndMonth < seasonStartMonth) 
            && !(value === "Course" || value === "Worksheet" || value === "Scenario" || value === "Quiz");

        var invalidSeasonStartDay = (seasonStartDay > seasonEndDay && seasonStartDay > seasonEndDay) 
            && !(value === "Course" || value === "Worksheet" || value === "Scenario" || value === "Quiz");

        var invalidSeasonEndDay = (seasonEndDay < seasonStartDay && seasonEndDay < seasonStartDay) 
            && !(value === "Course" || value === "Worksheet" || value === "Scenario" || value === "Quiz");

            setShowLoader(true);
            setInvalidTitle(invalidTitle);
            setInvalidDescription(invalidDescription);
            setInvalidType(invalidType);
            setInvalidTags(invalidTags);
            setInvalidTopic(invalidTopic);
            setInvalidFile(invalidFile);
            setInvalidTargetGroup(invalidTargetGroup);
            setInvalidMinGrade(invalidMinGrade);
            setInvalidMaxGrade(invalidMaxGrade);
            setInvalidPrice(invalidPrice);
            setInvalidSeasonStartMonth(invalidSeasonStartMonth);
            setInvalidSeasonEndMonth(invalidSeasonEndMonth);
            setInvalidSeasonStartDay(invalidSeasonStartDay);
            setInvalidSeasonEndDay(invalidSeasonEndDay);{
            var errors = [];
            if(invalidTitle) {
                errors.push("The submission title cannot be blank.");
            }
            if(invalidDescription) {
                errors.push("The submission description cannot be blank.");
            }
            if(invalidType) {
                errors.push("Please specify a submission type.");
            }
            if(invalidTags) {
                errors.push("Submissions must have at least one tag.");
            }

            if(invalidTopic) {
                errors.push("Please specify a submission topic.");
            }

            if(invalidFile) {
                errors.push("You muse select a file.");
            }

            if(value === "Course" || value === "Worksheet" || value === "Scenario" || value === "Quiz") {
                
                if(invalidTargetGroup) {
                    errors.push("You must specify if your submission is for Pre-K, K-12, College, or Corporate Training.");
                }

                if(invalidMinGrade) {
                    errors.push("Min grade cannot be blank or greater than max grade.")
                }

                if(invalidMaxGrade) {
                    errors.push("Max grade cannot be blank or greater than min grade.")
                }

            } else {

                if(invalidPrice) {
                    errors.push("Price cannot be negative.");
                }

                if(invalidSeasonStartMonth) {
                    errors.push("Season start month cannot be blank or after season end month.");
                }

                if(invalidSeasonStartDay) {
                    errors.push("Season start day cannot be blank or after season end day.")
                }

                if(invalidSeasonEndMonth) {
                    errors.push("Season ens month cannot be blank or before season start month.");
                }

                if(invalidSeasonEndDay) {
                    errors.push("Season end month cannot be blank or before season start month.");
                }

                var errorString = "The following errors must be corrected before publishing:";

                errors.forEach((item) => {
                    errorString = errorString + "\n" + item;
                });
            }
            if (errors.length === 0) {
                const token = localStorage.jwtToken;
                setAuthToken(token);
                
                const decoded = jwt_decode(token);
                const currentUsername = decoded.name;

                fetch(`${Globals.API_URL}/submissions/publish`, {
                    method: 'POST',
                    headers: { 
                        "x-access-token": token,
                        'username': currentUsername,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "file": file
                })}).then((res) => res.json())
                .then(res => {
                    if(res.success) {
                        window.location.reload(false);
                    } else {
                        console.log(res.message);
                    }
                });
            } else {
                setShowLoader(false);
                setError(true);
                setMessage(errorString);
            }
        }
    }

    async function update() {
        if(props.auth.isAuthenticated) {
            setCanPublish(props.account.accountInfo.canPublish);
            setReputationPoints(props.account.accountInfo.reputationPoints);
            const token = localStorage.jwtToken;
            setAuthToken(token);

            if(canPublish) {
                if(reputationPoints >= Globals.REP_PUBLISHING) {
                    const queryString = require('query-string');
                    const search = queryString.parse(window.location.search);
                    const submissionId = search.id;
                    const newSubmission = (submissionId === "NEW");
                    setNewSubmission(newSubmission)
                    if(newSubmission) {
                        setSubmissionTitle("");
                    }
                    else {
                        const token = localStorage.jwtToken;
                        setAuthToken(token);
                        
                        fetch(`${Globals.API_URL}/submissions/loadHiddenSubmission?id=${submissionId}&accountId=${props.account.accountInfo.id}&username=${props.account.accountInfo.username}`, { headers: { "x-access-token": token }})
                        .then((res) => res.json())
                        .then((submission) => 
                        {
                            setSubmissionTitle(submission.title);
                            setSubmissionDescription(submission.description);
                            setSubmissionTags(submission.tags);
                            setAuthor(submission.author);
                            setSubmissionType(submission.type);
                            setUrl(submission.url);

                            if(!(submission.submission_type === "Course" || submission.submission_type === "Worksheet" || submission.submission_type === "Scenario" || submission.submission_type === "Quiz")) {
                                setExclusive(submission.isExclusive);
                                setDiscontinued(submission.isDiscontinued);
                                setSeasonal(submission.isSeasonal);
                                setSeasonStartMonth(submission.seasonStartMonth);
                                setSeasonEndMonth(submission.seasonEndMonth);
                                setSeasonStartDay(submission.seasonStartDay);
                                setSeasonEndDay(submission.seasonEndDay);
                                setInvalidPrice(submission.price);
                                setCategory("Store Items");
                            } else {
                                setPreK(submission.is_prek);
                                setCollegeLevel(submission.is_college_level);
                                setMinGrade(submission.min_grade);
                                setMaxGrade(submission.max_grade);
                            }
                        })
                        .catch(error =>
                        {
                            console.log(error);
                        })
                    }
                    } else {
                        setError(true);
                        setMessage(`You do not have enough Reputation Points to perform this action. You need ${Globals.REP_PUBLISHING} and you currently have ${reputationPoints}.`);
                    }
                    
                } else {
                    setError(true);
                    setMessage(`You may not perform this action because you are currently banned from publishing content to Acadiverse. Please go to ${Globals.APPEAL_URL} if you believe that this is a mistake.`);
                }
        } else {
            setError(true);
            setMessage("You must be logged in to view this page.");
        }
      }

    useEffect(() => {
        if (props.auth.isAuthenticated) {
            setLoggedIn(true);
            update();
                  
        } else {
            setError(true);
            setMessage("You must be logged in to access this page.");
        }
    })
            if(error === false) {
                return (
                    <Navigation activeItem = "submissions">
                        <Head>{newSubmission? <title>New Submission - Acadiverse</title> : <title>Edit Submission - Acadiverse</title>}</Head>
                        <MediaContextProvider>
                            <Container as={Media} at="mobile" className="content">  
                                Mobile 
                            </Container>
                            <Container as={Media} greaterThan="mobile" className="content">
                                <div className="edit-submission-form">
                                    {error === true? <Message error>
                                        <h3>Error</h3>
                                        <p>{message}</p>
                                    </Message>: null}
                            <Header as="h1">Edit Submission</Header>
                                <Dimmer active={showLoader}>
                                    <Loader content="Publishing..."/>
                                </Dimmer>
                                <Form>
                                    <Form.Field>
                                        <Form.Input 
                                            label="Submission Title:" 
                                            placeholder="Please enter the title of your submission." 
                                            onChange={(e, value) => {handleSubmissionTitleChanged(e, value)}} 
                                            error={invalidTitle} 
                                        />
                                    </Form.Field>
                                    <Form.Field error={invalidDescription}>
                                        <label>Submission Description:</label>
                                        <TextEditor 
                                            value={submissionDescription}
                                            onChange={(e, value) => {handleSubmissionDescriptionChanged(e, value)}}
                                            previewEnabled
                                            displayPreviewByDefault
                                            showToolbar
                                        />
                                    </Form.Field>
                                    <Form.Field disabled={!newSubmission}>
                                        <label>Submission Type:</label>
                                        <Dropdown
                                            placeholder="Please select the submission type."
                                            fluid
                                            selection
                                            options={submissionTypes}
                                            onChange={(e, value) => {handleChange(e, value)}}
                                            value={value}
                                        />
                                        <Label basic color="red" pointing="above">
                                            WARNING: You will NOT be able to change the submission type after publishing!
                                        </Label>
                                    </Form.Field>
                                    <Form.Field>
                                        <Form.Input 
                                            placeholder="Please enter the tags, seperated by commas." 
                                            label="Tags:" 
                                            onChange={(e, data) => {
                                                setSubmissionTags(data.value);
                                            }} 
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Form.Input 
                                            type="file" 
                                            label="File:" 
                                            onChange={(e, value) => {handleFileChanged(e, value)}}
                                        />
                                        <p>Please select the file for your submission.</p>
                                    </Form.Field>
                                    {value !== "course" && value !== "worksheet" && value !== "scenario" && value !== "quiz" && value !== "" ? <Container fluid>
                                        <Header as="h3">Store Item Options</Header>
                                        <Form.Field>
                                            <Input 
                                                labelPosition="right" 
                                                type="number" 
                                                placeholder="Item price" 
                                                error={invalidPrice}
                                            >
                                                <input />
                                                <Label>Acadicoins</Label>
                                            </Input>
                                        </Form.Field>
                                        {!newSubmission ? <Form.Field>
                                            <Checkbox 
                                                label="Item is discontinued." 
                                                onChange={(e, value) => {handleDiscontinuedChanged(e, value)}} 
                                            />
                                        </Form.Field> : null}
                                        {isDeveloper ? <Form.Field>
                                            <Checkbox 
                                                label="Item is exclusive." 
                                                onChange={(e, value) => {handleExclusiveChanged(e, value)}} 
                                            />
                                        </Form.Field> : null}
                                        <Form.Field>
                                            <Checkbox 
                                                label="Item is seasonal." 
                                                onChange={(e, value) => {handleSeasonalChanged(e, value)}} 
                                            />
                                        </Form.Field>
                                        <Form.Group widths="equal" label="Season Start Date:">
                                            <Form.Select 
                                                options={months} 
                                                label="Month" 
                                                error={invalidSeasonStartMonth} 
                                                onChange={(e, value) => {handleSeasonStartMonthChanged(e, value)}} 
                                                value={value} 
                                            />
                                            <Form.Input 
                                                label="Day" 
                                                type="number" 
                                                error={invalidSeasonStartDay} 
                                                onChange={(e, value) => {handleSeasonStartDayChanged(e, value)}} 
                                                value={value} 
                                            />
                                        </Form.Group>
                                        <Form.Group widths="equal" label="Season End Date:">
                                            <Form.Select 
                                                options={months} 
                                                label="Month" 
                                                error={invalidSeasonEndMonth} 
                                                onChange={(e, value) => {handleSeasonEndMonthChanged(e, value)}} 
                                                value={value} 
                                            />
                                            <Form.Input 
                                                label="Day" 
                                                type="number" 
                                                error={invalidSeasonEndDay} 
                                                onChange={(e, value) => {handleSeasonEndDayChanged(e, value)}} 
                                                value={value} 
                                            />
                                        </Form.Group>
                                    </Container> : null}
                                    {value === "course" || value === "worksheet" || value === "scenario" || value === "quiz" ? <Container fluid>
                                        <Header as="h3">Submission Options</Header>
                                        <Form.Field>
                                            <Form.Input 
                                                label="Submission Topic:" 
                                                placeholder="Please enter the topic of your submission." 
                                                onChange={(e, value) => {handleSubmissionTopicChanged(e, value)}} 
                                                error={invalidTopic} 
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <Radio 
                                                label="This is a Pre-K submission." 
                                                name="targetGroup" 
                                                value="pre-k" 
                                                checked={targetGroup === "pre-k"} 
                                                onChange={(e, data) => {setTargetGroup(data.value)}} 
                                            />
                                            <Portal
                                                closeOnTriggerClick
                                                OpenOnTriggerClick
                                                trigger={<Label basic as="a">(?)</Label>}
                                                onOpen={(e) => {handlePreKPortalOpen(e)}}
                                                onClose={(e) => {handlePreKPortalClosed(e)}}
                                            >
                                                <Segment style={{
                                                    left:'30%',
                                                    position: 'fixed',
                                                    top: '50%',
                                                    zIndex: 1000,
                                                }}
                                                >
                                                    <Header as="h3">Pre-K Submissions</Header>
                                                    <p>Pre-K submissions are submissions that are meant for preschoolers.</p>
                                                    <p>
                                                        This means that these submissions are under much greater scrutiny 
                                                        for Terms of Service/Code of Conduct compliance, and cannot have a grade assigned to them or be set as "Mature".
                                                    </p>
                                                </Segment>
                                            </Portal>
                                        </Form.Field>
                                        <Form.Field>
                                            <Radio 
                                                label="This is a K-12 submission." 
                                                name="targetGroup" 
                                                value="k-12" 
                                                checked={targetGroup === "k-12"} 
                                                onChange={(e, data) => {setTargetGroup(data.value);}} 
                                            />
                                            <Portal
                                                closeOnTriggerClick
                                                OpenOnTriggerClick
                                                trigger={<Label basic as="a">(?)</Label>}
                                                onOpen={(e) => {handlePreKPortalOpen(e)}}
                                                onClose={(e) => {handlePreKPortalClosed(e)}}
                                            >
                                                <Segment style={{
                                                    left:'30%',
                                                    position: 'fixed',
                                                    top: '50%',
                                                    zIndex: 1000,
                                                }}
                                                >
                                                    <Header as="h3">K-12 Submissions</Header>
                                                    <p>K-12 submissions are submissions meant for students from Kindergarten to 12th grade.</p>
                                                    <p>
                                                        These submissions can only be set to "Mature" if the specified minimum grade is at least 7.
                                                    </p>
                                                </Segment>
                                            </Portal>
                                        </Form.Field>
                                        <Form.Field>
                                            <Radio 
                                                label="This is a College-level submission." 
                                                name="targetGroup" 
                                                value="college" 
                                                checked={targetGroup === "college"} 
                                                onChange={(e, data) => {setTargetGroup(data.value);}} 
                                            />
                                            <Portal
                                                closeOnTriggerClick
                                                OpenOnTriggerClick
                                                trigger={<Label basic as="a">(?)</Label>}
                                                onOpen={(e) => {handleCollegeLevelPortalOpen(e)}}
                                                onClose={(e) => {handleCollegeLevelPortalClosed(e)}}
                                            >
                                                <Segment style={{
                                                    left:'30%',
                                                    position: 'fixed',
                                                    top: '50%',
                                                    zIndex: 1000,
                                                }}
                                                >
                                                    <Header as="h3">College-Level Submissions</Header>
                                                    <p>
                                                        College-level submissions are meant for students above 12th grade.
                                                    </p>
                                                    <p>
                                                        These submissions cannot have a grade level assigned to them.
                                                    </p>
                                                </Segment>
                                            </Portal>
                                        </Form.Field>
                                        <Form.Field>
                                            <Radio 
                                                label="This submission is meant for corporate training." 
                                                name="targetGroup" 
                                                value="corporateTraining" 
                                                checked={targetGroup === "corporateTraining"} 
                                                onChange={(e, data) => {setTargetGroup(data.value);}} 
                                            />
                                            <Portal
                                                closeOnTriggerClick
                                                OpenOnTriggerClick
                                                trigger={<Label basic as="a">(?)</Label>}
                                                onOpen={(e) => {handleTrainingMaterialPortalOpen(e)}}
                                                onClose={(e) => {handleTrainingMaterialPortalClosed(e)}}
                                            >
                                                <Segment style={{
                                                    left:'30%',
                                                    position: 'fixed',
                                                    top: '50%',
                                                    zIndex: 1000,
                                                }}
                                                >
                                                    <Header as="h3">Corporate Training Submissions</Header>
                                                    <p>
                                                        Corporate training submissions are meant for use in a corporate training environment.
                                                    </p>
                                                    <p>
                                                        These submissions cannot be set as "Mature" or have a grade level assigned to them.
                                                    </p>
                                                </Segment>
                                            </Portal>
                                        </Form.Field>
                                        <Form.Field disabled={targetGroup === "pre-k" || targetGroup === "corporateTraining" || (targetGroup === "k-12" && minGrade < 7)}>
                                            <Checkbox 
                                                label="This submission has mature content." 
                                                checked={matureContent === true} 
                                                onChange={(e, data) => {setMatureContent(data.checked)}} />
                                            <Portal
                                                closeOnTriggerClick
                                                OpenOnTriggerClick
                                                trigger={<Label basic as="a">(?)</Label>}
                                                onOpen={(e) => {handleMaturePortalOpen(e)}}
                                                onClose={(e) => {handleMaturePortalClosed(e)}}
                                            >
                                                <Segment style={{
                                                    left:'30%',
                                                    position: 'fixed',
                                                    top: '50%',
                                                    zIndex: 1000,
                                                }}
                                                >
                                                    <Header as="h3">Mature Submissions</Header>
                                                    <p>
                                                        Mature submissions are submissions that may contain mature content such as swear words, 
                                                        sexual content, violence, or references to alcohol/drugs.
                                                    </p>
                                                    <p>
                                                        These submissions cannot have a minimum grade of less than 7.
                                                    </p>
                                                </Segment>
                                            </Portal>
                                        </Form.Field>
                                        <Form.Field>
                                            <Form.Input label="Min. Grade:" type="number" error={invalidMinGrade} />
                                        </Form.Field>
                                        <Form.Field>
                                            <Form.Input label="Max. Grade:" type="number" error={invalidMaxGrade} />
                                        </Form.Field>
                                    </Container> : null}
                                    {newSubmission ? <Button onClick={(e) => {handleSubmit(e)}}>Publish Submission</Button> : <Button onClick={(e) => {handleSubmit(e)}}>Update Submission</Button>}
                            </Form>
                        </div>                        
                        
                            </Container>
                        </MediaContextProvider>
                    </Navigation>
                )
            } else{
                return (
                    <Container className="content">
                        <Navigation activeItem = "submissions" />
                            <Message negative>
                                <Message.Header>Error</Message.Header>
                                {message}
                            </Message>
                        
                    </Container>
                )
            }
}
EditSubmissionComponent.propTypes = {
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    account: state.account
  });
  export default connect(
    mapStateToProps
  )(EditSubmissionComponent)