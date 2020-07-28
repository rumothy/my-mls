import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Button from "../Button";

const PropertyResult = ({property, mode}) => {
    const videoDisplay = 
        <Card.Header style={{height: '300px'}}>
            <iframe style={{height: "100%", width: '100%'}}   
                src={property.video} 
                title={property.name} 
            />
        </Card.Header>;
    const pictureDisplay = <Card.Img variant="top" src={property.picture} />;
    return ( 
        <Card style={{ width: '40rem' }}>
            {mode === 'Picture' ? pictureDisplay : videoDisplay}
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
    );
}
 
export default PropertyResult;