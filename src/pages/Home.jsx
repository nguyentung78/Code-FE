import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import CardProduct from '../components/CardProduct'
import { dataProduct } from '../data/product';

function Home() {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts(dataProduct);
    }, []);
    return (
        <Container>
            <h2 className='text-center'>Danh sách sản phẩm </h2>
            <Row>
                {products.map(item =>
                    <Col lg={4} key={item.id}>
                        <CardProduct product={item} />
                    </Col>
                )}

            </Row>
        </Container>
    )
}

export default Home