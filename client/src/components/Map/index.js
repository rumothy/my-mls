import React from 'react';
import { withGoogleMap, GoogleMap, withScriptjs } from 'react-google-maps';
import Geocode from 'react-geocode';
import API from '../../utils/API';
import Container from 'react-bootstrap/esm/Container';

import Input from "../Input";
import Button from "../Button";
import MyAutoComplete from '../../MyAutocomplete';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_KEY)
Geocode.enableDebug();

class Map extends React.Component{
    constructor( props ){
        super( props );
        this.state = {
            price: '-1',
            bedrooms: '-1',
            properties: [],
            propertySearch: "",
            center: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            },
            searchKeys: [],
            mode: 'picture'
        };
        
    }


    componentDidMount(){
        const query =  { 
            locationsOnly: 'true', 
            location: '', 
            price: -1,
            bedrooms: -1
        };
        console.log("componentDidMount: query: ", query)
        API.getProperties(query)
        .then(response => {
            console.log("componentDidMount: API.getProperties, response.data: ", response.data);
            // response.data: { propertyData: [], locationData: [], mapKey: String }
            this.setState({ searchKeys: response.data.locationData });
        })
        .catch(err => console.log(err));

    };

    shouldComponentUpdate(nextProps, nextState){
        if (this.props.center.lat !== nextProps.center.lat ||
            this.props.center.lng !== nextProps.center.lng){
            return true;
        }
        return false;
    };

    onLocationSelected = (searchKey) => {
        const query =  { 
            locationsOnly: 'false', 
            location: searchKey, 
            price: this.state.price,
            bedrooms: this.state.bedrooms 
        };
        console.log("onLocationSelected: query: ", query)
        API.getProperties(query)
        .then(response => {
            console.log("onLocationSelected: API.getProperties, response: ", response.data);
            // response.data: { propertyData: [], locationData: [], mapKey: String }
            
            this.doGeocode(response.data);
        })
        .catch(err => console.log(err));
    };
    
    doGeocode = ({propertyData, mapKey}) => {
        Geocode.fromAddress(mapKey)
                .then(res => {
                    const place = res.results[0];
                    const latValue = place.geometry.location.lat;
                    const lngValue = place.geometry.location.lng;

                    this.setState({
                        center: {
                            lat: latValue,
                            lng: lngValue
                        },
                        properties: propertyData
                    });
                }, err => console.log(err));
    };

    handleModeChange = (event) => {
        this.setState({ mode: event.target.textContent });
        // const { name, value } = event.target;
        // this.setState({
        //     [name]: value
        // });
    }

    render(){
        const AsyncMap = withScriptjs(
            withGoogleMap(
                props =>
                <Container>
                    <Row>
  
                            <MyAutoComplete 
                                // keys={['Afghanistan', 'Albania', 'Algeria']}
                                keys={this.state.searchKeys}
                                locationSelected={this.onLocationSelected}
                            />
                    </Row>
                    <Row>
                        <GoogleMap 
                            google={this.props.google}
                            defaultZoom={this.props.zoom}
                            // defaultCenter={{ 
                            //     lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng 
                            // }}
                            defaultCenter={{ 
                                lat: this.props.center.lat, lng: this.props.center.lng 
                            }}
                        >
                        </GoogleMap>
                    </Row>
                    <Row>
                        <Badge pill variant="secondary"> 
                            {this.state.properties.length} results
                        </Badge>
                    </Row>
                        
                    <Row>
                        <ButtonGroup aria-label="Basic example">
                            <Button variant="secondary" onClick={this.handleModeChange}>Picture</Button>
                            <Button variant="secondary" onClick={this.handleModeChange}>Video</Button>
                            <Button variant="secondary" onClick={this.handleModeChange}>List</Button>
                        </ButtonGroup>
                    </Row>
                    
                    {this.state.properties.map(property => (
                        <Row key={property.id}>
                            <Card style={{ width: '40rem' }}>
                                <Card.Img variant="top" src={property.picture} />
                                <Card.Body>
                                    <Card.Title><h2>{property.name}</h2></Card.Title>
                                    <Card.Text>
                                        <p>{property.street} . {property.developer}</p>
                                        <p>{property.priceRange.max} - {property.priceRange.min} | {property.units.length} Units | {property.floors} Stories
                                        </p>
                                        <Badge variant="primary">Primary</Badge>{' '}
                                        <Badge variant="secondary">Secondary</Badge>{' '}
                                    </Card.Text>
                                    <Button variant="primary">Like</Button>
                                    <Button variant="primary">Comment</Button>
                                </Card.Body>
                            </Card>
                        </Row>
                    ) )}
                </Container>

            ));
        let map;
        if (this.props.center.lat !== undefined) {
            map =  
                <AsyncMap 
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
                    loadingElement={<div style={{ height: '100%'}}/>}
                    containerElement={<div style={{ height: this.props.height}}/>}
                    mapElement={<div style={{ height: '100%'}}/>}
                    />
                        
                
        }
        else {
            map = <div style={{height: this.props.height}}/>
        }
        return (map)
    }
}

export default Map

