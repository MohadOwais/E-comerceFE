import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Button,
  Drawer,
  Modal,
  Row,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import DefaultLayout from "../../DefaultLayout/DefaultLayout";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import {
  ADD_PRODUCT,
  ADD_USER,
  API_BASE_URL,
  GET_CART,
  GET_PRODUCT,
  GET_PRODUCT_ID,
  GET_USER,
  GET_USER_BY,
  IMG_URL,
  UPDATE_PRODUCT,
  UPDATE_USER,
} from "../../services/end_points";
// import DefaultLayout from "../../DefaultLayout/DefaultLayout";

// const originData = Array.from({ length: 10 }).map((_, i) => ({
//   key: i.toString(),
//   name: `Edward ${i}`,
//   age: 20 + i,
//   address: `London Park no. ${i}`,
// }));

// const PlaceOrder = () => {
//   const [form] = Form.useForm();

//   const [pageSize, setPageSize] = useState(8);

//   const [productData, setProductData] = useState([]);
//   const [UsertData, setUsertData] = useState([]);
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     GetProduct();
//     GetUsers();
//     GetCartProduct();
//   }, []);

//   const GetCartProduct = async () => {
//     try {
//       const result = await axios.get(`${API_BASE_URL}${GET_CART}`);

//       if (result.status === 201) {
//         setProductData(result.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const GetUsers = async () => {
//     try {
//       const result = await axios.get(`${API_BASE_URL}${GET_USER_BY}/15`);

//       if (result.status === 201) {
//         setUsertData(result.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const GetProduct = async () => {
//     try {
//       const result = await axios.get(`${API_BASE_URL}${GET_PRODUCT_ID}/5`);

//       if (result.status === 201) {
//         setData(result.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   console.log("productdata", productData);
//   console.log("UsertData", UsertData);
//   console.log("data", data);

//   const handleEdit = (data) => {
//     setcheckModal(true);
//     setEditing(true);
//     setformData({
//       user_address: data.user_address,
//       user_email: data.user_email,
//       user_first_name: data.user_first_name,
//       user_last_name: data.user_last_name,

//       id: data.id,
//     });
//   };

//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       key: "id",
//       width: 80,
//     },
//     {
//       title: "Name",
//       key: "name",
//       render: (_, record) =>
//         `${record.user_first_name} ${record.user_last_name}`,
//       width: 300,
//     },
//     {
//       title: "Email",
//       dataIndex: "user_email",
//       key: "user_email",
//       width: 300,
//     },
//     {
//       title: "Address",
//       dataIndex: "user_address",
//       key: "user_address",
//       width: 300,
//     },
//     {
//       title: "Action",
//       key: "action",
//       width: 120,
//       render: (_, record) => (
//         <div style={{ display: "flex", gap: "10px" }}>
//           <EditOutlined
//             style={{ color: "#1890ff", cursor: "pointer" }}
//             onClick={() => handleEdit(record)}
//           />
//           <DeleteOutlined
//             style={{ color: "red", cursor: "pointer" }}
//             // onClick={() => handleDelete(record)}
//           />
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
//         <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
//           <span className="text-2xl font-bold text-blue-600">
//             {productData.length}
//           </span>
//           <span className="text-gray-700">Total Users</span>
//         </div>
//         <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
//           <span className="text-2xl font-bold text-green-600">2</span>
//           <span className="text-gray-700">Card Two</span>
//         </div>
//         <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
//           <span className="text-2xl font-bold text-red-600">3</span>
//           <span className="text-gray-700">Card Three</span>
//         </div>
//         <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
//           <span className="text-2xl font-bold text-purple-600">4</span>
//           <span className="text-gray-700">Card Four</span>
//         </div>
//       </div>
//       <div className="flex justify-end mb-2 pr-4"></div>

//       <Form form={form} component={false}>
//         <Table
//           bordered
//           dataSource={productData}
//           columns={columns.map((col) => ({
//             ...col,
//           }))}
//           rowKey="id"
//           pagination={{
//             pageSize: pageSize,
//             showSizeChanger: true,
//             pageSizeOptions: ["8", "20", "50", "100"],
//             onShowSizeChange: (_, size) => setPageSize(size),
//           }}
//           scroll={{ x: 800, y: 400 }} // horizontal scroll for mobile
//         />
//       </Form>
//     </>
//   );
// };
const PlaceOrder = () => {
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(8);

  const [cartData, setCartData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchCartDetails();
  }, []);

  const fetchCartDetails = async () => {
    try {
      // 1️⃣ Get cart items
      const cartRes = await axios.get(`${API_BASE_URL}${GET_CART}`);
      if (cartRes.status === 201) {
        const cart = cartRes.data.data;
        setCartData(cart);

        // 2️⃣ Fetch all users and products in parallel
        const userPromises = cart.map((c) =>
          axios.get(`${API_BASE_URL}${GET_USER_BY}/${c.userId}`)
        );
        const productPromises = cart.map((c) =>
          axios.get(`${API_BASE_URL}${GET_PRODUCT_ID}/${c.productId}`)
        );

        const userResults = await Promise.all(userPromises);
        const productResults = await Promise.all(productPromises);

        const users = userResults.map((res) => res.data.data[0]);
        const products = productResults.map((res) => res.data.data[0]);

        setUserData(users);
        setProductData(products);

        // 3️⃣ Merge data for table
        const merged = cart.map((item, index) => ({
          key: item.id,
          id: item.id,
          qty: item.Qty,
          total_price: item.total_price,
          user_first_name: users[index]?.user_first_name,
          user_last_name: users[index]?.user_last_name,
          user_email: users[index]?.user_email,
          user_address: users[index]?.user_address,
          product_name: products[index]?.product_name,
          product_price: products[index]?.product_price,
        }));
        setTableData(merged);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    {
      title: "Name",
      key: "name",
      render: (_, record) =>
        `${record.user_first_name} ${record.user_last_name}`,
      width: 200,
    },
    { title: "Email", dataIndex: "user_email", key: "user_email", width: 200 },
    {
      title: "Address",
      dataIndex: "user_address",
      key: "user_address",
      width: 250,
    },
    {
      title: "Product",
      dataIndex: "product_name",
      key: "product_name",
      width: 200,
    },
    { title: "Qty", dataIndex: "qty", key: "qty", width: 80 },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      width: 120,
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <EditOutlined
            style={{ color: "#1890ff", cursor: "pointer" }}
            // onClick={() => handleEdit(record)}
          />
          <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            {tableData.length}
          </span>
          <span className="text-gray-700">Total Cart Items</span>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            {userData.length}
          </span>
          <span className="text-gray-700">Total Users</span>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-red-600">
            {productData.length}
          </span>
          <span className="text-gray-700">Total Products</span>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-600">4</span>
          <span className="text-gray-700">Card Four</span>
        </div>
      </div>

      {/* Table */}
      <Form form={form} component={false}>
        <Table
          bordered
          dataSource={tableData}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["8", "20", "50", "100"],
            onShowSizeChange: (_, size) => setPageSize(size),
          }}
          scroll={{ x: 900, y: 400 }}
        />
      </Form>
    </>
  );
};
export default PlaceOrder;
