import React, { useState } from "react";
import {
  BarChartOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import {
  ConfigProvider,
  Menu,
  Breadcrumb,
  Layout,
  Button,
  Dropdown,
  Avatar,
} from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "../../../public/images/companyLogo.png"; // Adjust path

const { Header, Content, Sider } = Layout;

const menuItems = [
  {
    key: "product",
    icon: <BarChartOutlined />,
    label: <Link to="/dashboard/add-product">Product</Link>,
  },
  {
    key: "users",
    icon: <UserOutlined />,
    label: <Link to="/dashboard/add-users">User Management</Link>,
  },
  {
    key: "order",
    icon: <UserOutlined />,
    label: <Link to="/dashboard/place-order">Place Order</Link>,
  },
];

const DefaultLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const handleMenuClick = ({ key }) => {
    if (key === "2") {
      navigate("/");
    }
  };

  const profileMenu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        { key: "1", label: "Profile", icon: <UserOutlined /> },
        { key: "2", label: "Logout", icon: <LogoutOutlined /> },
      ]}
    />
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemActiveBg: "#0071ba94",
            itemSelectedBg: "#2253ff",
            itemSelectedColor: "white",
            iconSize: "20px",
            itemPaddingInline: "60px",
          },
        },
      }}
    >
      <Layout className="min-h-screen bg-gray-100">
        <Sider
          className="bg-[#fafafa] text-white shadow-lg"
          width={300}
          collapsed={collapsed}
          breakpoint="md"
          onCollapse={(collapsed) => setCollapsed(collapsed)}
          trigger={null}
        >
          <div className="flex justify-center mt-4 mb-6 hidden lg:flex">
            <a href="/">
              <img
                src={CompanyLogo}
                alt="Company Logo"
                className="h-16 w-auto"
              />
            </a>
          </div>

          <Button
            type="primary"
            className="absolute top-2 right-4 lg:hidden"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />

          <Menu
            mode="inline"
            selectedKeys={[
              location.pathname.includes("product")
                ? "product"
                : location.pathname.includes("users")
                ? "users"
                : "",
              location.pathname.includes("order") ? "order" : "",
            ]}
            items={menuItems}
          />
        </Sider>

        <Layout className="flex-1 flex flex-col bg-gray-100">
          <Header className="bg-white px-6 py-2 mt-4 mx-4 flex items-center justify-between shadow-md rounded-md">
            <Breadcrumb items={[{ title: "Home" }, { title: "Dashboard" }]} />
            <div className="flex items-center gap-6">
              <BellOutlined className="text-xl cursor-pointer" />
              <Dropdown overlay={profileMenu} placement="bottomRight" arrow>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar size="large" icon={<UserOutlined />} />
                  <span className="hidden sm:inline">Owais</span>
                </div>
              </Dropdown>
            </div>
          </Header>

          <Content className="flex-grow p-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              {children} {/* ✅ Now we render children instead of <Outlet /> */}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default DefaultLayout;
