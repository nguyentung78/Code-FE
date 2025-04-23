import React, { useEffect, useState } from "react";
import { Button, Space, Table, Tag, Spin, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { getProductsThunk, deleteProductThunk, setKeyword } from "../../redux/productSlice";
import ModalProduct from "../../components/admin/ModalProduct";
import { toast } from "react-toastify";
import { BASE_URL_ADMIN } from "../../api/index"; // Thêm import để lấy danh sách danh mục
import Cookies from "js-cookie";

const { Search } = Input;

const Products = () => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [categories, setCategories] = useState([]); 
  const dispatch = useDispatch();
  const { data: products, total, loading, error, keyword } = useSelector((state) => state.products);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await BASE_URL_ADMIN.get("/categories/search?page=0&size=1000", {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, 
          },
        });
        setCategories(response.data.content);
      } catch (err) {
        toast.error("Không thể tải danh sách danh mục!");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    dispatch(getProductsThunk({ page: pagination.current, size: pagination.pageSize, keyword }));
  }, [dispatch, pagination.current, pagination.pageSize, keyword]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setOpen(true);
  };

  const handleEdit = (product) => { 
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Bạn chắc chắn muốn xóa sản phẩm này? Nếu sản phẩm đang có trong đơn hàng chờ xác nhận, đơn hàng đó sẽ bị hủy."
      )
    ) {
      dispatch(deleteProductThunk(id))
        .unwrap()
        .then(() => {
          toast.success("Xóa sản phẩm thành công!");
          dispatch(getProductsThunk({ page: pagination.current, size: pagination.pageSize, keyword }));
        })
        .catch((err) => {
          toast.error("Không thể xóa sản phẩm!");
        });
    }
  };

  const onClose = () => { 
    setOpen(false);
    setSelectedProduct(null);
    dispatch(getProductsThunk({ page: pagination.current, size: pagination.pageSize, keyword }));
  };

  const handleTableChange = (pagination) => {
    setPagination({ current: pagination.current, pageSize: pagination.pageSize });
  };

  const handleSearch = (value) => {
    dispatch(setKeyword(value));
    setPagination({ ...pagination, current: 1 });
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: "Tên sản phẩm", dataIndex: "productName", key: "productName", render: (text) => <a>{text}</a> },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => price?.toLocaleString() + " VNĐ",
    },
    { title: "Số lượng tồn kho", dataIndex: "stockQuantity", key: "stockQuantity" },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category) => (category ? category.categoryName : "Không có danh mục"),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? <img src={image} alt="Product" style={{ width: 50, height: 50 }} /> : <span>Không có ảnh</span>,
    },
    {
      title: "Trạng thái nổi bật",
      dataIndex: "featured",
      render: (_, { featured }) => (
        <Tag color={featured ? "geekblue" : "green"}>{featured ? "Nổi bật" : "Không nổi bật"}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="edit-button"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Button
            className="delete-button"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <style>
        {`
          .add-button, .edit-button, .delete-button {
            color: #fff !important; border: none !important; transition: background-color 0.3s ease;
          }
          .add-button { background-color: #1890ff !important; }
          .add-button:hover { background-color: #40a9ff !important; }
          .edit-button { background-color: #13C2C2 !important; }
          .edit-button:hover { background-color: #0f9d9d !important; }
          .delete-button { background-color: #ff4d4f !important; }
          .delete-button:hover { background-color: #f5222d !important; }
        `}
      </style>
      <div style={{ marginBottom: 16, display: "flex", gap: "16px" }}>
        <Search
          placeholder="Nhập từ khóa tìm kiếm"
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button
          className="add-button"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          title="Thêm sản phẩm"
        />
      </div>
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          onChange={handleTableChange}
        />
      )}
      <ModalProduct
        open={open}
        onClose={onClose}
        product={selectedProduct}
        fetchProducts={() => dispatch(getProductsThunk({ page: pagination.current, size: pagination.pageSize, keyword }))}
        categories={categories} // Truyền danh sách danh mục vào ModalProduct
      />
    </>
  );
};

export default Products;