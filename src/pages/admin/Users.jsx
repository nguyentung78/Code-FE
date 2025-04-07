import React, { useEffect, useState } from "react";
import { Button, Space, Table, Tag, Spin, Input, Modal, Checkbox, Typography } from "antd";
import { EditOutlined, LockOutlined, UnlockOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsersThunk,
  toggleUserStatusThunk,
  updateUserRolesThunk,
  setKeyword,
} from "../../redux/userSlice";
import { toast } from "react-toastify";

const { Search } = Input;
const { Title } = Typography;

const Users = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [openRoleModal, setOpenRoleModal] = useState(false); // Đổi tên từ isRoleModalOpen thành openRoleModal
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const dispatch = useDispatch();
  const { data: users, total, loading, error, keyword } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getUsersThunk({ page: pagination.current, size: pagination.pageSize, keyword }));
  }, [dispatch, pagination.current, pagination.pageSize, keyword]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleToggleStatus = (id) => {
    if (window.confirm("Bạn chắc chắn muốn thay đổi trạng thái tài khoản này?")) {
      dispatch(toggleUserStatusThunk(id))
        .unwrap()
        .then(() => {
          toast.success("Thay đổi trạng thái thành công!");
          dispatch(getUsersThunk({ page: pagination.current, size: pagination.pageSize, keyword }));
        })
        .catch((err) => {
          toast.error("Không thể thay đổi trạng thái!");
        });
    }
  };

  const openRoleModalHandler = (user) => { // Đổi tên từ openRoleModal thành openRoleModalHandler
    setSelectedUser(user);
    setSelectedRoles(user.roles);
    setOpenRoleModal(true);
  };

  const handleRoleChange = (checkedValues) => {
    setSelectedRoles(checkedValues);
  };

  const onOkRoleModal = () => { // Đổi tên từ handleRoleModalOk thành onOkRoleModal
    if (selectedRoles.length === 0) {
      toast.error("Vui lòng chọn ít nhất một vai trò!");
      return;
    }
    dispatch(updateUserRolesThunk({ id: selectedUser.id, roles: selectedRoles }))
      .unwrap()
      .then(() => {
        toast.success("Cập nhật vai trò thành công!");
        dispatch(getUsersThunk({ page: pagination.current, size: pagination.pageSize, keyword }));
        setOpenRoleModal(false);
      })
      .catch((err) => {
        toast.error("Không thể cập nhật vai trò!");
      });
  };

  const onCloseRoleModal = () => { // Đổi tên từ handleRoleModalCancel thành onCloseRoleModal
    setOpenRoleModal(false);
    setSelectedUser(null);
    setSelectedRoles([]);
  };

  const handleTableChange = (pagination) => {
    setPagination({ current: pagination.current, pageSize: pagination.pageSize });
  };

  const handleSearch = (value) => {
    dispatch(setKeyword(value));
    setPagination({ ...pagination, current: 1 });
  };

  const roleOptions = [
    { label: "USER", value: "USER" },
    { label: "MANAGER", value: "MANAGER" },
    { label: "ADMIN", value: "ADMIN" },
  ];

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
      width: 60,
    },
    { title: "Username", dataIndex: "username", key: "username", render: (text) => <a>{text}</a> },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Fullname", dataIndex: "fullname", key: "fullname" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Vai trò",
      dataIndex: "roles",
      key: "roles",
      render: (roles, record) => (
        <Space>
          {roles.length > 0 ? (
            roles.map((role) => (
              <Tag
                key={role}
                color={
                  role === "ADMIN" ? "purple" : role === "MANAGER" ? "orange" : "blue"
                }
                style={{ borderRadius: "12px", padding: "0 8px" }}
              >
                {role}
              </Tag>
            ))
          ) : (
            <Tag color="gray" style={{ borderRadius: "12px", padding: "0 8px" }}>
              Không có vai trò
            </Tag>
          )}
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openRoleModalHandler(record)}
            style={{ color: "#1890ff" }}
            title="Chỉnh sửa vai trò"
          />
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"}>{status ? "Hoạt động" : "Đã khóa"}</Tag>
      ),
      width: 100,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className={record.status ? "delete-button" : "edit-button"}
            icon={record.status ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleToggleStatus(record.id)}
            size="small"
            title={record.status ? "Khóa tài khoản" : "Mở khóa tài khoản"}
          />
        </Space>
      ),
      width: 120,
    },
  ];

  return (
    <>
      <style>
        {`
          .edit-button, .delete-button {
            color: #fff !important; border: none !important; transition: background-color 0.3s ease;
          }
          .edit-button { background-color: #13C2C2 !important; }
          .edit-button:hover { background-color: #0f9d9d !important; }
          .delete-button { background-color: #ff4d4f !important; }
          .delete-button:hover { background-color: #f5222d !important; }
        `}
      </style>
      <div style={{ marginBottom: 16, display: "flex", gap: "16px" }}>
        <Search
          placeholder="Nhập từ khóa tìm kiếm (username)"
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          onChange={handleTableChange}
          scroll={{ x: "max-content" }}
        />
      )}
      <Modal
        title={<Title level={4}>Quản lý vai trò - {selectedUser?.username}</Title>}
        open={openRoleModal}
        onOk={onOkRoleModal}
        onCancel={onCloseRoleModal}
        okText="Lưu"
        cancelText="Hủy"
        width={400}
      >
        <Checkbox.Group
          options={roleOptions}
          value={selectedRoles}
          onChange={handleRoleChange}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        />
      </Modal>
    </>
  );
};

export default Users;