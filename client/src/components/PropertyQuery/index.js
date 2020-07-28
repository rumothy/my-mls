import React, { useState } from 'react';
import MyAutocomplete from '../../MyAutocomplete';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Input from '../Input';
const PropertyQuery = (props) => {
    const [price, setPrice] = useState(-1);
    const [bedrooms, setBedrooms] = useState(-1); 
    const pricePlaceholder = 'Search for properties lower than this price!';
    const bedroomsPlaceholder = 'How many bedrooms are you looking for?';
    
    return ( 
        <Container>
            <Row>
                <MyAutocomplete 
                    // keys={['Afghanistan', 'Albania', 'Algeria']}
                    searchKeys={props.searchKeys}
                    locationSelected={(searchKey) => 
                        props.onLocationSelected(searchKey, price, bedrooms)}
                />
                <Input
                    value={parseInt(price) === -1 ? '' : price }
                    onChange={(e)=> setPrice(e.target.value)}
                    name="price"
                    placeholder={pricePlaceholder}
                />
                <Input
                    value={parseInt(bedrooms) === -1 ? '' : bedrooms }
                    onChange={(e)=> setBedrooms(e.target.value)}
                    name="bedrooms"
                    placeholder={bedroomsPlaceholder}
                />
            </Row>  
        </Container>
    );
}
 
export default PropertyQuery;