import React, { Component, useState, useEffect } from "react";
import Geocode from 'react-geocode';
import Jumbotron from "./components/Jumbotron";
import Nav from "./components/Nav";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Map from './components/Map';
import Map2 from './components/Map2';
import PropertyQuery from './components/PropertyQuery';
import PropertyResults from './components/PropertyResults';
import API from './utils/API';
import MyAutocomplete from './MyAutocomplete';
import Input from './components/Input';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_KEY)
Geocode.enableDebug();

class App extends Component {
  state = {
    center: {lat: 28.538336, lng: -81.379234},
    properties: [],
    key: '',
    matches: [],
    searchKeys: [],
    price: -1,
    bedrooms: -1,
  }

  componentDidMount(){
    const query =  { 
        locationsOnly: 'true', 
        location: '', 
        price: -1,
        bedrooms: -1
    };
    console.log("App componentDidMount: query: ", query)
    API.getProperties(query)
    .then(response => {
        console.log("App componentDidMount: API.getProperties, response.data: ", response.data);
        // response.data: { propertyData: [], locationData: [], mapKey: String }
        this.setState({ searchKeys: response.data.locationData });
    })
    .catch(err => console.log(err));

  }

  onLocationSelected = (searchKey) => {
    const query =  { 
      locationsOnly: 'false', 
      location: searchKey, 
      price: this.state.price,
      bedrooms: this.state.bedrooms 
    };
    console.log("App onLocationSelected: query: ", query)
    API.getProperties(query)
    .then(response => {
        console.log("onLocationSelected: API.getProperties, response: ", response.data);
        // response.data: { propertyData: [], locationData: [], mapKey: String }
        this.setState({properties: response.data.propertyData});
        this.doGeocode(response.data);
    })
    .catch(err => console.log(err));
    
  }

  doGeocode = ({mapKey}) => {
    Geocode.fromAddress(mapKey)
    .then(res => {
        const place = res.results[0];
        const latValue = place.geometry.location.lat;
        const lngValue = place.geometry.location.lng;

        this.setState({center: {lat: latValue, lng: lngValue} });
    }, err => console.log(err));
  }

  handleTyping = event => {
    const val = event.target.value;
    this.setState({ key: val });
    if (!val) return false;
    const newMatches = [];
    const myKeys = this.state.searchKeys;
    for (let i = 0; i < myKeys.length; i++) {
        if (myKeys[i].substr(0, val.length).toUpperCase() === val.toUpperCase()){
          newMatches.push({ id: i, key: myKeys[i], chars: val.length });
          this.setState({ matches: newMatches });
        }
    }
  };

  handleOptionClick = event => {
    this.setState({key: event.target.innerText});
    this.setState({matches: []});
    this.onLocationSelected(event.target.innerText);
  }

  onLostFocus = event => {
    setTimeout(()=>{
      this.setState({matches: []});
      }, 5000);
  }

  render() {
    const pricePlaceholder = 'Search for properties lower than this price!';
    const bedroomsPlaceholder = 'How many bedrooms are you looking for?';
    return (
      <div>
        <Nav />
        <Jumbotron />
        <Container>
          <Row>
            <div style={{ width: '100vw' }}>
            <Map2 
              // google={this.props.google}
              center={this.state.center}
              height='300px'
              zoom={15}
            />
            </div>
          </Row>
          <Row>
            <div>
              <input 
                  id='myInput' 
                  type='text' 
                  name='myKey' 
                  placeholder="Key" 
                  onChange={this.handleTyping} 
                  value={this.state.key}
                  onBlur={this.onLostFocus}
              />
              <div id='autocomplete-list'>
                  {this.state.matches.map(match =>  
                      <div 
                        key={match.id} 
                        onClick={this.handleOptionClick}>
                          <strong>{match.key.substr(0, match.chars)}</strong>{match.key.substr(match.chars)}
                      </div>
                  )}
              </div>
            </div> 
          </Row>
          <Row>
            <Input
                value={parseInt(this.state.price) === -1 ? '' : this.state.price }
                onChange={(e)=> this.setState({price: e.target.value})}
                name="price"
                placeholder={pricePlaceholder}
            />
            <Input
                value={parseInt(this.state.bedrooms) === -1 ? '' : this.state.bedrooms }
                onChange={(e)=> this.setState({bedrooms: e.target.value})}
                name="bedrooms"
                placeholder={bedroomsPlaceholder}
            />
          </Row>
          <Row>
            <PropertyResults properties={this.state.properties}/>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
