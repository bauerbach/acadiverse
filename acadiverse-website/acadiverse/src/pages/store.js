import { createMedia } from "@artsy/fresnel";
import { useState, useEffect } from 'react';
import { Container, Checkbox, Grid, Header, Search, Card, Image, Item, Button, Menu, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/custom_components/navigation.component';
import Footer from '../components/custom_components/footer.component';
import ProfileLink from "../components/custom_components/profile-link.component";
import Globals from '../globals';


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

export default function StorePage(props) {
    const [storeItemsLoaded, setStoreItemsLoaded] = useState(false);
    const [storeItemsList, setStoreItemsList] = useState([]);
    const [storeItemsTable, setStoreItemsTable] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortBy, setSortBy] = useState("title_a");

    function purchaseItem(id) {

    }

    useEffect(() => {
      if(storeItemsLoaded === false) {
        fetch(`${Globals.API_URL}/submissions/list?filterByType=storeItems&featured=false&limit=${itemsPerPage}&skip=${currentPage}&sortBy=${sortBy}`)
        .then((res) => res.json())
        .then((submissions) => 
        {
            setTotalPages(submissions.total / itemsPerPage);
            var storeItemsTable = [];
            storeItemsTable = submissions.data.map(item => {
                return(
                    <li className="card">
                        <img 
                            src={item.thumbnail}
                        />
                        <h3>{item.title}</h3>
                        <ProfileLink user={item.author} /><br/>
                        <strong>{item.price === 0? "Free!": item.price + " Acadicoins"}</strong><br/>
                        <p>{item.description}</p>
                            <a href={`/submissions/${item._id}`}><Button>View Details</Button></a>
                            <Button>Purchase</Button>
                    </li>
                );
            });
        setStoreItemsLoaded(true);
        setStoreItemsTable(storeItemsTable);
        });
      }
    }, []);

    return (
        <section>
            <Header as="h1">Store</Header>
                <Grid celled>
                    <Grid.Row>
                        <Grid.Column width={15}>
                            <Search />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Checkbox label="Show Discontinued" /> <br />
                            <Checkbox label="Show Seasonal" />
                            <Header as="h3">Type</Header>
                            <Checkbox label="Hat" /> <br />
                            <Checkbox label="Hair Style" /> <br />
                            <Checkbox label="Facial Hair" /> <br />
                            <Checkbox label="Eyewear" /> <br />
                            <Checkbox label="Top" /> <br />
                            <Checkbox label="Bottom" /> <br />
                            <Checkbox label="Footwear" /> <br />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <ul>{storeItemsTable}</ul>
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
        </section>
                    
    )
}