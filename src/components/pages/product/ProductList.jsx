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
  API_BASE_URL,
  GET_PRODUCT,
  IMG_URL,
  UPDATE_PRODUCT,
} from "../../services/end_points";
// import DefaultLayout from "../../DefaultLayout/DefaultLayout";

// const originData = Array.from({ length: 10 }).map((_, i) => ({
//   key: i.toString(),
//   name: `Edward ${i}`,
//   age: 20 + i,
//   address: `London Park no. ${i}`,
// }));

const ProductList = () => {
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
    product_name: "",
    product_description: "",
    product_price: "",
    product_img: [],
    id: "",
  });

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
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

  //   const columns = [
  //     { title: "Product Name", dataIndex: "name", width: "25%", editable: true },
  //     { title: "Product Image", dataIndex: "age", width: "15%", editable: true },
  //     {
  //       title: "Product Price",
  //       dataIndex: "address",
  //       width: "40%",
  //       editable: true,
  //     },
  //     {
  //       title: "Operation",
  //       dataIndex: "operation",
  //       render: (_, record) => {
  //         const editable = isEditing(record);
  //         return editable ? (
  //           <span>
  //             <Typography.Link
  //               onClick={() => save(record.key)}
  //               style={{ marginInlineEnd: 8 }}
  //             >
  //               Save
  //             </Typography.Link>
  //             <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
  //               <a>Cancel</a>
  //             </Popconfirm>
  //           </span>
  //         ) : (
  //           <Typography.Link
  //             disabled={editingKey !== ""}
  //             onClick={() => edit(record)}
  //           >
  //             Edit
  //           </Typography.Link>
  //         );
  //       },
  //     },
  //   ];

  //   const mergedColumns = columns.map((col) =>
  //     !col.editable
  //       ? col
  //       : {
  //           ...col,
  //           onCell: (record) => ({
  //             record,
  //             inputType: col.dataIndex === "age" ? "number" : "text",
  //             dataIndex: col.dataIndex,
  //             title: col.title,
  //             editing: isEditing(record),
  //           }),
  //         }
  //   );
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

  //   const handleSubmit = async () => {
  //     const data = new FormData();
  //     data.append("product_name", formData.product_name);
  //     data.append("product_price", formData.product_price);
  //     data.append("product_description", formData.product_description);

  //     formData.product_img.forEach((file) => {
  //       data.append("product_img", file); // must exactly match backend field name
  //     });

  //     const response = await axios.post(`${API_BASE_URL}${ADD_PRODUCT}`, data, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (response.status === 201) {
  //       message.success("Product Added Sucessfully");
  //       setformData({
  //         product_name: "",
  //         product_description: "",
  //         product_img: [],
  //         product_price: "",
  //       });
  //       setcheckModal(false);
  //     }
  //   };
  const handleSubmit = async () => {
    const data = new FormData();
    data.append("product_name", formData.product_name);
    data.append("product_price", formData.product_price);
    data.append("product_description", formData.product_description);

    if (editing && formData.id) {
      data.append("id", formData.id);
    }

    const newFiles = formData.product_img.filter((f) => f instanceof File);
    const existingFiles = formData.product_img.filter(
      (f) => typeof f === "string"
    );

    newFiles.forEach((file) => data.append("product_img", file));
    data.append("existing_img", JSON.stringify(existingFiles));
    data.append("delete_img", JSON.stringify(deletedImages));

    try {
      const response = editing
        ? await axios.put(
            `${API_BASE_URL}${UPDATE_PRODUCT}${formData.id}`,
            data,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          )
        : await axios.post(`${API_BASE_URL}${ADD_PRODUCT}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      if (response.status === 200 || response.status === 201) {
        message.success(
          editing
            ? "Product Updated Successfully"
            : "Product Added Successfully"
        );

        setformData({
          product_name: "",
          product_description: "",
          product_img: [],
          product_price: "",
        });
        setDeletedImages([]);
        setcheckModal(false);
        setEditing(false);
        GetProduct();
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    }
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    setformData((prevData) => ({
      ...prevData,
      product_img: [...prevData.product_img, ...files], // <-- append instead of overwrite
    }));
  };

  const GetProduct = async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}${GET_PRODUCT}`);

      if (result.status === 201) {
        const data = result.data.data.map((item) => ({
          ...item,
          product_img: JSON.parse(item.product_img),
        }));
        setProductData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (data) => {
    console.log("editData", data);
    setcheckModal(true);
    setEditing(true);
    setformData({
      product_name: data.product_name,
      product_description: data.product_description,
      product_price: data.product_price,
      product_img: data.product_img || [],
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
      title: "Images",
      dataIndex: "product_img",
      key: "product_img",
      width: 200,
      render: (imgs) =>
        imgs && imgs.length > 0 ? (
          <img src={`${IMG_URL}${imgs[0]}`} alt="" width={100} />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Name",
      dataIndex: "product_name",
      key: "product_name",
      // Example filter for product name
      filters: [
        { text: "Dress", value: "Dress" },
        // add more if needed
      ],
      onFilter: (value, record) => record.product_name.includes(value),
      width: 300,
    },

    {
      title: "Price",
      dataIndex: "product_price",
      key: "product_price",
      sorter: (a, b) => a.product_price - b.product_price,
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
  const handleRemoveImage = (index) => {
    const removedImage = formData.product_img[index];
    const newImages = [...formData.product_img];
    newImages.splice(index, 1);
    setformData({ ...formData, product_img: newImages });

    // Optional: keep track of deleted old images for backend
    if (!(removedImage instanceof File)) {
      setDeletedImages((prev) => [...prev, removedImage]); // define deletedImages state
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">1</span>
          <span className="text-gray-700">Card One</span>
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
        title={editing ? "Edit Product" : "Add Product"}
        open={checkModal}
        onCancel={() => closeModal()}
        footer={false}
      >
        <Form layout="vertical" initialValues={formData}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Descriptions <span className="text-red-500">*</span>
            </label>
            <TextArea
              type="text"
              name="product_description"
              value={formData.product_description}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="product_img"
              multiple
              onChange={handleImageChange}
            />
          </div> */}
          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Images <span className="text-red-500">*</span>
            </label>

       
            <div className="flex gap-2 mb-2">
              {formData.product_img &&
                formData.product_img.map((img, index) => (
                  <img
                    key={index}
                    src={`${IMG_URL}${img}`} // Adjust path based on your storage
                    alt={`Product ${index}`}
                    className="w-50 h-10 object-cover rounded"
                  />
                ))}
            </div>

            <input
              type="file"
              name="product_img"
              multiple
              onChange={handleImageChange}
            />
          </div> */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Images <span className="text-red-500">*</span>
            </label>

            {/* Display existing images with delete button */}
            <div className="flex gap-2 mb-2">
              {formData.product_img &&
                formData.product_img.map((img, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={`${IMG_URL}${img}`} // Adjust path based on your storage
                      alt={`Product ${index}`}
                      className="w-50 h-10 object-cover rounded"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      X
                    </button>
                  </div>
                ))}
            </div>

            <input
              type="file"
              name="product_img"
              multiple
              onChange={handleImageChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Price <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="product_price"
              value={formData.product_price}
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

export default ProductList;
