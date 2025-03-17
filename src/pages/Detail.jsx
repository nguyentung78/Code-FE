import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom'

function Detail() {
    let { id } = useParams();
    console.log(id);
    return (
        <Container>
            <Row>
                <Col lg={6}>
                    <img src='https://hthaostudio.com/wp-content/uploads/2020/06/anh-sen-12.jpg.webp' width="100%" />
                </Col>
                <Col lg={6}>
                    <h3>Tên sản phẩm</h3>
                    <p>Mô tả san phẩm</p>
                    <p>Giá sp</p>
                    <input />
                    <button className='btn btn-secondary'>Thêm vào giỏ hàng</button>
                </Col>
            </Row>
        </Container>
    )
}

export default Detail