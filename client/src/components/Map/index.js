import React from 'react';
import { withGoogleMap, GoogleMap, withScriptjs } from 'react-google-maps';
import Geocode from 'react-geocode';
import API from '../../utils/API';
import Container from 'react-bootstrap/esm/Container';
import Input from "../Input";
import Button from "../Button";
import MyAutoComplete from '../../MyAutocomplete';
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_KEY)
Geocode.enableDebug();

class Map extends React.Component{
    constructor( props ){
        super( props );
        this.state = {
            address: '',
            city: '',
            area: '',
            state: '',
            price: -1,
            bedrooms: -1,
            properties: [],
            propertySearch: "",
            mapPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            },
            markerPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            }, 
            searchKeys: [],
            names: [],
            streets: [],
            cities: [],
            states: [],
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

        Geocode.fromLatLng(this.state.mapPosition.lat, this.state.mapPosition.lng)
        .then(response => {
            const address = response.results[0].formatted_address, 
                addressArray = response.results[0].address_components,
                city = this.getCity(addressArray),
                area = this.getArea(addressArray),
                state = this.getState(addressArray);

            console.log('city', city, area, state);
 
            this.setState({ 
                address: (address) ? address : '',
                area: (area) ? area : '',
                city: (city) ? city : '',
                state: (state) ? state : '',
            })
        
        }, error => {
            console.error(error);
        });
    };

    shouldComponentUpdate(nextProps, nextState){
        if (this.state.markerPosition.lat !== this.props.center.lat ||
            this.state.address !== nextState.address ||
            this.state.city !== nextState.city ||
            this.state.area !== nextState.area ||
            this.state.state !== nextState.state
        ){
            return true;
        }
        else if (this.props.center.lat === nextProps.center.lat){
            return false;
        }
    };

    getCity = (addressArray) => {
        let city = '';
        if (addressArray === undefined) return '';
        for (let i = 0; i < addressArray.length; i++ ){
            if (addressArray[i].types[0] &&
                addressArray[i].types[0] === 'locality'  ) {
                city = addressArray[i].long_name;
                return city;
            }
        }
    };

    getArea = (addressArray) => {
        let county = '';
        if (addressArray === undefined) return '';
        for (let i = 0; i < addressArray.length; i++ ){
            if (addressArray[i].types[0] &&
                addressArray[i].types[0] === 'administrative_area_level_2'  ) {
                county = addressArray[i].long_name;
                return county;
            }
        }
    };

    getState = (addressArray) => {
        let state = '';
        if (addressArray === undefined) return '';
        for (let i = 0; i < addressArray.length; i++ ){
            if (addressArray[i].types[0] &&
                addressArray[i].types[0] === 'administrative_area_level_1'  ) {
                state = addressArray[i].long_name;
                return state;
            }
        }
    };

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onInfoWindowClose = (event) => {

    };

    onPlaceSelected = (place) => {
        
    };

    onMarkerDragEnd = (event) => {
       
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
                    const address = place.formatted_address,
                    addressArray = place.address_components,
                    city = this.getCity(addressArray),
                    area = this.getArea(addressArray),
                    latValue = place.geometry.location.lat,
                    lngValue = place.geometry.location.lng;

                    this.setState({
                        address: (address) ? address : '',
                        area: (area) ? area : '',
                        city: (city) ? city : '',
                        state: (this.state.state) ? this.state.state : '',
                        mapPosition: {
                            lat: latValue,
                            lng: lngValue
                        },
                        properties: propertyData
                    });
                }, err => console.log(err));
    };

    handlePropertySubmit = (event) => {
        console.log('handlePropertySubmit', event.target);
        
    };

    handleSearchTextChange = (event) => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
    };

    render(){
        const AsyncMap = withScriptjs(
            withGoogleMap(
                props =>
                <Container>
                    <Input
                        name="propertySearch"
                        value={this.state.propertySearch}
                        onChange={this.handleSearchTextChange}
                        placeholder="Search For a Property"
                    />
                    <Button
                        onClick={this.handlePropertySubmit}
                        type="success"
                        className="input-lg"
                    >
                    Search
                    </Button>
                    <MyAutoComplete 
                        // keys={['Afghanistan', 'Albania', 'Algeria']}
                        keys={this.state.searchKeys}
                        locationSelected={this.onLocationSelected}
                    />

                    <GoogleMap 
                        google={this.props.google}
                        defaultZoom={this.props.zoom}
                        defaultCenter={{ 
                            lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng 
                        }}
                    >
        
                    <p>{this.state.properties.length} results</p>
                        
                    <form>
                        <input type="radio" id="picture" name="mode" value="picture"/>
                        <label htmlFor="picture">Picture</label>
                        <input type="radio" id="video" name="mode" value="video"/>
                        <label htmlFor="video">Video</label>
                        <input type="radio" id="list" name="mode" value="list"/>
                        <label htmlFor="list">List</label>
                    </form>

                        
                    {this.state.properties.map(property =>  (
                        <div key={property.id} className="propertyCard" style={{ borderStyle: 'solid'}}>
                            
                            <div className='display' style={{ height: '100px', width:'100px'}}>
                                {/* <img width={150} height={100} src={property.picture} alt='img'></img>
                                <iframe width="140" height="105" src={property.video} title={property.name}>
                                </iframe> */}
                                <button>LikeIcon</button>
                                <button>CommentIcon</button>
                            </div>
                            <div>
                                <h2>{property.name}</h2>
                                <p>{property.street} . {property.developer}</p>
                                <p>{property.priceRange.max} - {property.priceRange.min} |
                                    {property.units.length} Units | {property.floors} Stories
                                </p>
                                <p className='badge'>{property.sales_status}</p>
                                <p className='badge'>{property.construction_status}</p>

                            </div>
                        </div>
                    ))}
                    </GoogleMap>
                </Container>

            ));
        let map;
        if (this.props.center.lat !== undefined) {
            map = 
                <div>
                    <div>
                        <div className="form-group">
                            <label htmlFor="">City</label>
                            <input 
                                type='text' 
                                name='city' 
                                className='form-control' 
                                onChange={this.onChange} 
                                readOnly='readOnly' 
                                value={this.state.city} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="">Area</label>
                            <input 
                                type='text' 
                                name='area'  
                                className='form-control'
                                onChange={this.onChange}
                                readOnly="readOnly"
                                value={this.state.area} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor=''>Address</label>
                            <input 
                                type='text' 
                                name='address'
                                className='form-control'
                                onChange={this.onChange}
                                readOnly='readOnly'
                                value={this.state.address}/>
                        </div> 
                    </div>
                    <AsyncMap 
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
                        loadingElement={<div style={{ height: '100%'}}/>}
                        containerElement={<div style={{ height: this.props.height}}/>}
                        mapElement={<div style={{ height: '100%'}}/>}
                        />
                        
                </div>
        }
        else {
            map = <div style={{height: this.props.height}}/>
        }
        return (map)
    }
}

export default Map

