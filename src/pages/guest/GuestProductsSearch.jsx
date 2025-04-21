import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import CardProduct from '../../components/shared/CardProduct';
import { BASE_URL } from '../../api/index';
import { Spin, Alert, Pagination } from 'antd';
import { toast } from 'react-toastify';

function GuestProductsSearch() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const searchParams = new URLSearchParams(location.search);
        const keyword = searchParams.get('search') || '';
        
        const response = await BASE_URL.get(
          `/public/products/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage - 1}&size=${productsPerPage}`
        );
        const data = response.data.content || response.data;
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts([]);
          setError('Không tìm thấy sản phẩm nào phù hợp!');
        }
      } catch (error) {
        setError('Có lỗi xảy ra khi tải sản phẩm!');
        setProducts([]);
        toast.error('Không thể tải danh sách sản phẩm!');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container fluid>
      <div className="category-header" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <h1>Danh sách sản phẩm</h1>
      </div>
      {loading ? (
        <div className="text-center" style={{ padding: '50px' }}>
          <Spin size="large" tip="Đang tải..." />
        </div>
      ) : error ? (
        <div style={{ maxWidth: 1200, margin: '20px auto' }}>
          <Alert message={error} type="warning" showIcon />
        </div>
      ) : products.length > 0 ? (
        <>
          <Row>
            {products.map((item) => (
              <Col lg={4} key={item.id} className="mb-4">
                <CardProduct product={item} />
              </Col>
            ))}
          </Row>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Pagination
              current={currentPage}
              total={products.length}
              pageSize={productsPerPage}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <div className="text-center" style={{ padding: '50px' }}>
          Không có sản phẩm nào để hiển thị.
        </div>
      )}
    </Container>
  );
}

export default GuestProductsSearch;