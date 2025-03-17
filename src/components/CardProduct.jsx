import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { NavLink } from 'react-router-dom';
function CardProduct({ product }) {
    return (
        <Card>
            <Card.Img variant="top" src={product.image} />
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                    {product.price}
                </Card.Text>
                <NavLink className="btn btn-primary" to={"product-detail/" + product.id} >Xem chi tiết</NavLink>
            </Card.Body>
        </Card>
    )
}

export default CardProduct