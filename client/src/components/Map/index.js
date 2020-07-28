import React from 'react';
import { withGoogleMap, GoogleMap, withScriptjs } from 'react-google-maps';
import Geocode from 'react-geocode';


Geocode.setApiKey(process.env.REACT_APP_GOOGLE_KEY)
Geocode.enableDebug();

class Map2 extends React.Component{
    constructor( props ){
        super( props );
        this.state = {
             mapPosition: {
                lat: this.props.center.lat,
                lng: this.props.center.lng
            },
         };
    }

    shouldComponentUpdate(nextProps, nextState){
        if (this.props.center !== nextProps.center){
            return true;
        }
        else if (this.props.center.lat === nextProps.center.lat){
            return false;
        }
    };

    render(){
        const AsyncMap = withScriptjs(
            withGoogleMap(
                props =>
                    <GoogleMap 
                        google={this.props.google}
                        defaultZoom={this.props.zoom}
                        defaultCenter={this.props.center}
                        // defaultCenter={{ 
                        //     lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng 
                        // }}
                    >
                    </GoogleMap>));
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

export default Map2

