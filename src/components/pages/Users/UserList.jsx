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
  GET_PRODUCT,
  GET_USER,
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

const UserList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [editing, setEditing] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [deletedImages, setDeletedImages] = useState([]); // Track removed old images

  const [checkModal, setcheckModal] = useState(false);

  const [productData, setProductData] = useState([]);

  const [formData, setformData] = useState({
    user_first_name: "",
    user_last_name: "",
    user_email: "",
    user_password: "",
    user_address: "",
  });

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  // Filter Logic
  const applyFilter = () => {
    const filtered = originData.filter((item) =>
      item.name.toLowerCase().includes(filterName.toLowerCase())
    );
    setData(filtered);
    setOpenFilter(false);
  };

  const resetFilter = () => {
    setFilterName("");
    setData(originData);
    setOpenFilter(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target; // Extract name and value
    setformData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    GetProduct();
  }, []);
  const closeModal = () => {
    setcheckModal(false);
    setEditing(false);
  };

  const handleSubmit = async () => {
    try {
      if (editing && formData.id) {
        // Update user
        const response = await axios.put(
          `${API_BASE_URL}${UPDATE_USER}${formData.id}`,
          formData
        );

        if (response.status === 200 || response.status === 201) {
          message.success("User Updated Successfully");
        }
      } else {
        // Add user
        const response = await axios.post(
          `${API_BASE_URL}${ADD_USER}`,
          formData
        );

        if (response.status === 200 || response.status === 201) {
          message.success("User Added Successfully");
        }
      }

      // Reset after success
      setformData({
        user_first_name: "",
        user_last_name: "",
        user_email: "",
        user_password: "",
        user_address: "",
      });
      setcheckModal(false);
      setEditing(false);
      GetProduct(); 
    } catch (error) {
      console.error(error);
      // message.error("Something went wrong");
    }
  };

  const GetProduct = async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}${GET_USER}`);

      if (result.status === 201) {
        setProductData(result.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (data) => {
    setcheckModal(true);
    setEditing(true);
    setformData({
      user_address: data.user_address,
      user_email: data.user_email,
      user_first_name: data.user_first_name,
      user_last_name: data.user_last_name,

      id: data.id,
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) =>
        `${record.user_first_name} ${record.user_last_name}`,
      width: 300,
    },
    {
      title: "Email",
      dataIndex: "user_email",
      key: "user_email",
      width: 300,
    },
    {
      title: "Address",
      dataIndex: "user_address",
      key: "user_address",
      width: 300,
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <EditOutlined
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          />
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer" }}
            // onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            {productData.length}
          </span>
          <span className="text-gray-700">Total Users</span>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">2</span>
          <span className="text-gray-700">Card Two</span>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-red-600">3</span>
          <span className="text-gray-700">Card Three</span>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-600">4</span>
          <span className="text-gray-700">Card Four</span>
        </div>
      </div>
      <div className="flex justify-end mb-2 pr-4">
        <Button
          style={{
            backgroundColor: "#2253ff",
            borderColor: "#0071ba",
            color: "white",
            fontSize: "15px",
            marginLeft: "10px",
          }}
          onClick={() => setcheckModal(true)}
        >
          Add Product
        </Button>
      </div>
      <Drawer
        title="Filter Users"
        placement="right"
        onClose={() => setOpenFilter(false)}
        open={openFilter}
      >
        <Input
          placeholder="Filter by name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" onClick={applyFilter} block>
          Apply
        </Button>
        <Button onClick={resetFilter} block style={{ marginTop: 8 }}>
          Reset
        </Button>
      </Drawer>
      <Form form={form} component={false}>
        <Table
          bordered
          dataSource={productData}
          columns={columns.map((col) => ({
            ...col,
          }))}
          rowKey="id"
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["8", "20", "50", "100"],
            onShowSizeChange: (_, size) => setPageSize(size),
          }}
          scroll={{ x: 800, y: 400 }} // horizontal scroll for mobile
        />
      </Form>

      <Modal
        title={editing ? "Edit Product" : "Add User"}
        open={checkModal}
        onCancel={() => closeModal()}
        footer={false}
      >
        <Form layout="vertical" initialValues={formData}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="user_first_name"
              value={formData.user_first_name}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="user_last_name"
              value={formData.user_last_name}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              User Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              User Password <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="user_password"
              value={formData.user_password}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              User Address <span className="text-red-500">*</span>
            </label>
            <TextArea
              type="text"
              name="user_address"
              value={formData.user_address}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={() => setcheckModal(false)}
              style={{
                backgroundColor: "#80868b",
                color: "white",
                borderRadius: "15px",
              }}
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#0DA2FF",
                color: "white",
                borderRadius: "15px",
              }}
            >
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default UserList;
