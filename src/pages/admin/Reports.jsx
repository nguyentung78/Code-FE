import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  Spin,
  Typography,
  Divider,
} from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import { fetchAllReportsThunk } from "../../redux/reportSlice";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Reports = () => {
  const dispatch = useDispatch();
  const { loading, error, ...reportData } = useSelector((state) => state.reports);
  const [dateRange, setDateRange] = useState([
    moment().subtract(30, "days"),
    moment(),
  ]);

  const fetchReportData = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      toast.error("Vui lòng chọn khoảng thời gian!");
      return;
    }

    const fromDate = dateRange[0].format("YYYY-MM-DD");
    const toDate = dateRange[1].format("YYYY-MM-DD");
    dispatch(fetchAllReportsThunk({ fromDate, toDate }))
      .unwrap()
      .catch((err) => {
        toast.error(err.message || "Có lỗi xảy ra khi lấy dữ liệu báo cáo!");
      });
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div>
      <Title level={2}>Báo cáo & Thống kê</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            format="YYYY-MM-DD"
            size="large"
          />
          <Button
            type="primary"
            onClick={fetchReportData}
            size="large"
            style={{ marginLeft: 8 }}
          >
            Cập nhật
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: 50 }} />
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8}>
              <Card title="Tổng doanh thu" bordered={false}>
                <Title level={4}>{reportData.totalRevenue.toLocaleString()} VNĐ</Title>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="Tổng đơn hàng" bordered={false}>
                <Title level={4}>{reportData.totalOrders}</Title>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="Tài khoản mới" bordered={false}>
                <Title level={4}>{reportData.totalNewAccounts}</Title>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card title="Doanh thu theo thời gian" bordered={false}>
                {reportData.revenueOverTime.length === 0 ? (
                  <Text type="secondary">Không có dữ liệu để hiển thị</Text>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportData.revenueOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Doanh thu (VNĐ)"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Số lượng hóa đơn theo thời gian" bordered={false}>
                {reportData.invoicesOverTime.length === 0 ? (
                  <Text type="secondary">Không có dữ liệu để hiển thị</Text>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportData.invoicesOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Số đơn hàng"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <Card title="Doanh thu theo danh mục" bordered={false}>
                {reportData.revenueByCategory.length === 0 ? (
                  <Text type="secondary">Không có dữ liệu để hiển thị</Text>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.revenueByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Doanh thu (VNĐ)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Top sản phẩm bán chạy" bordered={false}>
                {reportData.bestSellerProducts.length === 0 ? (
                  <Text type="secondary">Không có dữ liệu để hiển thị</Text>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.bestSellerProducts}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {reportData.bestSellerProducts.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Top khách hàng chi tiêu" bordered={false}>
                {reportData.topSpendingCustomers.length === 0 ? (
                  <Text type="secondary">Không có dữ liệu để hiển thị</Text>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.topSpendingCustomers}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {reportData.topSpendingCustomers.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Reports;