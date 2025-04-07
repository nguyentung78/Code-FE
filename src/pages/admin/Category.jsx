import React, { useEffect, useState } from "react";
import { Button, Space, Table, Tag, Spin, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesThunk, deleteCategoryThunk, setKeyword } from "../../redux/categorySlice";
import ModalCategory from "../../components/admin/ModalCategory";
import { toast } from "react-toastify";

const { Search } = Input;

const Category = () => {
  const [open, setOpen] = useState(false); // Đổi tên từ isModalOpen thành open
  const [selectedCategory, setSelectedCategory] = useState(null); // Đổi từ selectedCategoryId thành selectedCategory
  const dispatch = useDispatch();
  const { data: categories, total, loading, error, keyword } = useSelector((state) => state.categories);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  useEffect(() => {
    dispatch(getCategoriesThunk({ page: pagination.current, size: pagination.pageSize, keyword }));
  }, [dispatch, pagination.current, pagination.pageSize, keyword]);

  const handleAdd = () => {
    setSelectedCategory(null);
    setOpen(true);
  };

  const handleEdit = (category) => { // Đổi từ id thành category để truyền toàn bộ object
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa danh mục này?")) {
      dispatch(deleteCategoryThunk(id))
        .unwrap()
        .then(() => {
          toast.success("Xóa danh mục thành công!");
          dispatch(getCategoriesThunk({ page: pagination.current, size: pagination.pageSize, keyword }));
        })
        .catch((err) => {
          toast.error("Không thể xóa danh mục vì đang chứa sản phẩm!");
        });
    }
  };

  const onClose = () => { // Đổi tên từ handleCancel thành onClose
    setOpen(false);
    setSelectedCategory(null);
    dispatch(getCategoriesThunk({ page: pagination.current, size: pagination.pageSize, keyword }));
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
    { title: "Tên danh mục", dataIndex: "categoryName", key: "categoryName", render: (text) => <a>{text}</a> },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, { status }) => (
        <Tag color={status ? "geekblue" : "green"}>{status ? "Hoạt động" : "Không hoạt động"}</Tag>
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
            onClick={() => handleDelete(record.categoryId)}
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
          title="Thêm danh mục"
        />
      </div>
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="categoryId"
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
      <ModalCategory open={open} onClose={onClose} category={selectedCategory} fetchCategories={() => dispatch(getCategoriesThunk({ page: pagination.current, size: pagination.pageSize, keyword }))} />
    </>
  );
};

export default Category;