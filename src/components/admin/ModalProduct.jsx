import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Upload, Select, Spin, Image, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { BASE_URL_ADMIN } from '../../api/index';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import { useDispatch } from 'react-redux';
import { addProductThunk, updateProductThunk } from '../../redux/productSlice';

const { Option } = Select;

function ModalProduct({ open, onClose, product, fetchProducts, categories }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    if (product) {
      console.log("Product data:", product);
      form.setFieldsValue({
        productName: product.productName,
        description: product.description,
        unitPrice: product.unitPrice,
        stockQuantity: product.stockQuantity,
        categoryId: product.category?.categoryId,
        featured: product.featured || false,
      });
      setCurrentImage(product.image || null);
      setFile(null);
    } else {
      form.resetFields();
      form.setFieldsValue({
        featured: false, // Mặc định là false cho sản phẩm mới
      });
      setCurrentImage(null);
      setFile(null);
    }
  }, [product, form]);

  const handleFileChange = ({ fileList }) => {
    if (fileList.length > 0) {
      setFile(fileList[0]);
      setCurrentImage(URL.createObjectURL(fileList[0].originFileObj));
    } else {
      setFile(null);
      setCurrentImage(product ? product.image : null);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("productName", values.productName);
    formData.append("description", values.description);
    formData.append("unitPrice", values.unitPrice);
    formData.append("stockQuantity", values.stockQuantity);
    formData.append("categoryId", values.categoryId);
    formData.append("featured", (values.featured ?? false).toString());
    if (file?.originFileObj) {
      formData.append("image", file.originFileObj);
    }

    try {
      if (product) {
        await dispatch(updateProductThunk({ id: product.id, product: formData })).unwrap();
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await dispatch(addProductThunk(formData)).unwrap();
        toast.success("Tạo sản phẩm thành công!");
      }
      fetchProducts();
      onClose();
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={product ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {loading ? (
        <div className="text-center">
          <Spin size="large" />
        </div>
      ) : (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="productName"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input placeholder="Tên sản phẩm" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea placeholder="Mô tả sản phẩm" />
          </Form.Item>
          <Form.Item
            name="unitPrice"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
          >
            <Input type="number" placeholder="Giá sản phẩm" />
          </Form.Item>
          <Form.Item
            name="stockQuantity"
            label="Số lượng tồn kho"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
          >
            <Input type="number" placeholder="Số lượng tồn kho" />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map((category) => (
                <Option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="featured"
            label="Nổi bật"
            valuePropName="checked"
          >
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Hình ảnh"
            rules={product ? [] : [{ required: true, message: 'Vui lòng tải lên hình ảnh!' }]}
          >
            <div>
              {currentImage ? (
                <div style={{ marginBottom: 16 }}>
                  <Image
                    src={currentImage}
                    alt="Hình ảnh sản phẩm"
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: 16 }}>Không có hình ảnh</div>
              )}
              <Upload
                onChange={handleFileChange}
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
                fileList={file ? [file] : []}
              >
                <Button icon={<UploadOutlined />}>
                  {product ? 'Thay đổi hình ảnh' : 'Tải lên hình ảnh'}
                </Button>
              </Upload>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {product ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default ModalProduct;