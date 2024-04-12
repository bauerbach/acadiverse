import { createMedia } from "@artsy/fresnel";
import { useState, useEffect } from 'react';
import { Container, Header, Button, Icon, Grid, Checkbox, Search, Image, Menu, Card } from 'semantic-ui-react';
import SliderView from 'semantic-ui-react-slider';
import { Link } from 'react-router-dom';
import ProfileLink from "../../components/custom_components/profile-link.component";
import Globals from '../../globals';


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

export default function SubmissionsPage() {
    const [submissionsLoaded, setSubmissionsLoaded] = useState(false);
    const [submissionsList, setSubmissionsList] = useState([]);
    const [submissionsTable, setSubmissionsTable] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortBy, setsortBy] = useState("title_a");

    function handleGradeLevelChanged(e) {

    }

    useEffect(() => {
        if(submissionsLoaded === false) {
            fetch(`${Globals.API_URL}/submissions/list?filterByType=submissionsfeatured=false&limit=${itemsPerPage}&skip=${currentPage}&sortBy=${sortBy}`)
            .then((res) => res.json())
            .then((submissions) => 
            {
            console.log(submissions);
            setSubmissionsList(submissions.data);
            setTotalPages(submissions.total / itemsPerPage);
            var submissionsTable = [];
            submissionsTable = submissionsList.map(item => {
                return(
                    <li aria-role="composite" id="card">
                            <img aria-role="img"
                                src={item.thumbnail}
                            />
                            <h2 aria-role="header">{item.title}</h2>
                            <ProfileLink user={item.author} />
                            <a href={`/submissions/${item._id}`}><Button>View Details</Button></a>
                    </li>
                );
            });
            setSubmissionsLoaded(true);
            setSubmissionsTable(submissionsTable);
        });
        }
    }, []);
    return (
            <MediaContextProvider>
                <Container as={Media} greaterThan="mobile" className="content">
                    Widescreen
                <a href="/submissions/edit?id=NEW">
                    <Button className="publish-button">
                        <Icon name="upload"/>
                        Publish
                    </Button>
                </a>
            <Header as="h1">Submissions</Header>
                <Grid celled>
                    <Grid.Row>
                        <Grid.Column width={15}>
                            <Search />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <Checkbox label="Show Mature Content Submissions" />
                            <Header as="h3">Type</Header>
                            <Checkbox label="Course" /> <br />
                            <Checkbox label="Worksheet" /> <br />
                            <Checkbox label="Scenario" /> <br />
                            <Checkbox label="Quiz" /> <br />
                            <Header as="h3">Grade Level</Header>
                            <p>Note: A value of 0 is used for Kindergarten.</p>
                            <SliderView onSliderValuesChange={(e) => {handleGradeLevelChanged(e)}} sliderMinValue={0} sliderMaxValue={12} /> <br />
                            <Checkbox label="Pre-K" /> <br />
                            <Checkbox label="College-Level" />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <ul>{submissionsTable}</ul>
                        </Grid.Column>
                        <Menu floated='right' pagination>
                            <Menu.Item as='a' icon>
                                <Icon name='chevron left' />
                            </Menu.Item>
                            <Menu.Item as='a'>1</Menu.Item>
                            <Menu.Item as='a'>2</Menu.Item>
                            <Menu.Item as='a'>3</Menu.Item>
                            <Menu.Item as='a'>4</Menu.Item>
                            <Menu.Item as='a' icon>
                                <Icon name='chevron right' />
                            </Menu.Item>
                        </Menu>
                    </Grid.Row>
                </Grid>
            
                </Container>
            </MediaContextProvider>
    )
}