import React from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from 'react-google-maps';
import Geocode from 'react-geocode';
import Autocomplete from 'react-google-autocomplete';
import API from '../../utils/API';

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
            price: '',
            beds: '',
            mapPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            },
            markerPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            }
        }
    }

    componentDidMount(){
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
            return true
        }
        else if (this.props.center.lat === nextProps.enter.lat){
            return false
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
        if (!('formatted_address' in place)) {
            return;
        }
        const address = place.formatted_address,
            addressArray = place.address_components,
            city = this.getCity(addressArray),
            area = this.getArea(addressArray),
            latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();

            API.getProperties({
                city: city,
                price: this.state.price, 
                beds: this.state.beds
            }).then(response => { 
                console.log(response);
            }, error =>{
                console.log(error);
            });

            this.setState({
                address: (address) ? address : '',
                area: (area) ? area : '',
                city: (city) ? city : '',
                state: (this.state.state) ? this.state.state : '',
                markerPosition: {
                    lat: latValue,
                    lng: lngValue
                },
                mapPosition: {
                    lat: latValue,
                    lng: lngValue
                }
            });
    };

    onMarkerDragEnd = (event) => {
        console.log('event', event);
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng(),
            addressArray = [];
        
        Geocode.fromLatLng(newLat, newLng).then(
            response => {
                const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = this.getCity(addressArray),
                    area = this.getArea(addressArray),
                    state = this.getState(addressArray);

                this.setState({
                    address: (address) ? address: '',
                    area: (area) ? area : '',
                    city: (city) ? city : '', 
                    state: (state) ? state : '',
                })
            }, 
            error => {
                console.error(error);
            }
        );            
            
    };

    render(){
        const AsyncMap = withScriptjs(
            withGoogleMap(
                props =>
                    <GoogleMap 
                        google={this.props.google}
                        defaultZoom={this.props.zoom}
                        defaultCenter={{ 
                            lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng 
                        }}
                    >
                        <Autocomplete 
                            style={{
                                width: '100%',
                                height: '40px',
                                paddingLeft: '16px',
                                marginTop: '2px',
                                marginBottom: '100px'
                            }}
                            onPlaceSelected={this.onPlaceSelected}
                            types = {['(cities)']}
                        />
                        {/* <Marker 
                            google={this.props.google} 
                            name={'Dolores park'} 
                            draggable={true}
                            onDragEnd={this.onMarkerDragEnd}
                            position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
                            />

                        <InfoWindow
                            onClose={this.onInfoWindowClose}
                            position={{ 
                                lat: ( this.state.markerPosition.lat + 0.0018),
                                lng: this.state.markerPosition.lng }}>
                                    <div>
                                        <span style={{ padding: 0, margin: 0 }}>{this.state.address}</span>
                                    </div>
                        </InfoWindow> */}

                    </GoogleMap>

            ));
        let map;
        if (this.props.center.lat != undefined) {
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

