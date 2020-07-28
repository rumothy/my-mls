import React, { useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import PropertyResult from '../PropertyResult';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from "../Button";

const PropertyResults = (props) => {
    const [mode, setMode] = useState('Picture');

    const handleModeChange = (event) => {
        setMode(event.target.textContent);
    }

    return ( 
        <Container>
            <Row>
                <Badge pill variant="secondary"> 
                {props.properties.length} results
                </Badge>
            </Row>
                            
            <Row>
                <ButtonGroup aria-label="Basic example">
                    <Button variant="secondary" onClick={handleModeChange}>Picture</Button>
                    <Button variant="secondary" onClick={handleModeChange}>Video</Button>
                    {/* <Button variant="secondary" onClick={handleModeChange}>List</Button> */}
                </ButtonGroup>
            </Row>
                        
            {props.properties.map(property => (
                <PropertyResult 
                    key={property.id} 
                    property={property}
                    mode={mode}/>
            ))}
        </Container>
    );
}
 
export default PropertyResults;