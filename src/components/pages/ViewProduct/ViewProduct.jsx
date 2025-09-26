import React, { useState } from "react";
import {
  Input,
  Button,
  Carousel,
  Rate,
  InputNumber,
  Modal,
  Form,
  message,
  Spin,
} from "antd";
import { useLocation } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";

export const IMG_URL = "http://localhost:8080/uploads/";
export const ADD_CART = "add-to/add-to-cart";
export const API_BASE_URL = "http://localhost:8080/v1/";

const { Search } = Input;

const ViewProduct = () => {
  const location = useLocation();
  const { product } = location.state || {};

  const [checkModal, setCheckModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    user_first_name: "",
    user_last_name: "",
    user_email: "",
    user_address: "",
    productId: "",
    Qty: 1,
    total_price: 0,
  });

  if (!product) return <p>Product not found!</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Open modal and prefill data
  const openModal = () => {
    const priceNumber = Number(product.product_price.replace(/,/g, ""));
    setFormData({
      ...formData,
      productId: product.id || product.product_id,
      Qty: quantity,
      total_price: priceNumber * quantity,
    });
    setCheckModal(true);
  };

  // Handle Add to Cart submit
  const handleSubmit = async () => {
    try {
      const payload = { ...formData };
      const response = await axios.post(`${API_BASE_URL}${ADD_CART}`, payload);

      if (response.status === 201 || response.data.success) {
        // Save data in localStorage
        localStorage.setItem("cartData", JSON.stringify(payload));
        setCheckModal(false);
        setConfirmModal(true); // open confirm modal
      } else {
        message.error("Failed to add product to cart");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong!");
    }
  };

  // Handle Confirm Order
  const handleConfirmOrder = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setConfirmModal(false);

      const savedData = JSON.parse(localStorage.getItem("cartData"));
      message.success(
        `Thanks for your order! Product ID: ${savedData.productId}, Quantity: ${savedData.Qty}, Total Price: ₹${savedData.total_price}`
      );

      localStorage.removeItem("cartData"); // optionally clear cart data
    }, 2000);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-white shadow-md px-4 py-2 w-full z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <a href="/">
                <img
                  src="/images/companyLogo.png"
                  alt="Company Logo"
                  className="h-50 w-auto cursor-pointer"
                />
              </a>
            </div>
            <div className="hidden md:flex flex-1 mx-4">
              <Search placeholder="Search for products..." enterButton />
            </div>
            <div className="flex items-center space-x-4">
              <a href="/login">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Login
                </button>
              </a>
            </div>
          </div>
          <div className="md:hidden mt-2">
            <Search placeholder="Search..." enterButton />
          </div>
        </nav>

        {/* Product Details */}
        <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-6">
          {/* Left: Image Carousel */}
          <div className="md:w-1/2 bg-white p-4 rounded-lg shadow">
            <Carousel autoplay>
              {product.product_img.map((imgName, index) => (
                <div key={index}>
                  <img
                    src={`${IMG_URL}${imgName}`}
                    alt={`${product.product_name} ${index + 1}`}
                    className="w-full h-[600px] object-contain"
                  />
                </div>
              ))}
            </Carousel>
          </div>

          {/* Right: Product Info */}
          <div className="md:w-1/2 bg-white p-6 rounded-lg shadow flex flex-col gap-4">
            <h1
              className="text-4xl md:text-5xl font-extrabold"
              style={{ color: "#1677ff" }}
            >
              {product.product_name}
            </h1>
            <p className="text-xl text-green-700 font-semibold">
              ₹{product.product_price}
            </p>
            <p className="text-gray-700">{product.product_description}</p>

            <div className="mt-4">
              <h2 className="text-lg font-semibold">Customer Reviews</h2>
              <div className="flex items-center gap-2">
                <Rate disabled defaultValue={4} />
                <span className="text-gray-500">(24 reviews)</span>
              </div>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li>⭐ Great product, highly recommend!</li>
                <li>⭐ Excellent build quality.</li>
                <li>⭐ Fast delivery and good packaging.</li>
              </ul>
            </div>

            <div className="flex items-center justify-between mt-6 w-full">
              <div className="flex items-center gap-2">
                <span className="font-medium" style={{ color: "black" }}>
                  Qty:
                </span>
                <InputNumber
                  min={1}
                  value={quantity}
                  onChange={(value) => setQuantity(value)}
                />
              </div>
              <Button
                style={{
                  backgroundColor: "#ff5722",
                  color: "white",
                  borderRadius: "20px",
                }}
                size="large"
                onClick={openModal}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <Modal
        title={"Add To Cart"}
        open={checkModal}
        onCancel={() => setCheckModal(false)}
        footer={false}
      >
        <Form layout="vertical" initialValues={formData}>
          <InputField
            label="First Name"
            name="user_first_name"
            value={formData.user_first_name}
            onChange={handleChange}
          />
          <InputField
            label="Last Name"
            name="user_last_name"
            value={formData.user_last_name}
            onChange={handleChange}
          />
          <InputField
            label="Email Address"
            name="user_email"
            value={formData.user_email}
            onChange={handleChange}
          />
          <InputField
            label="Delivery Address"
            name="user_address"
            value={formData.user_address}
            onChange={handleChange}
            textarea
          />
          <div className="mb-4">
            <p>
              <strong>Quantity:</strong> {formData.Qty} &nbsp; | &nbsp;
              <strong>Total Price:</strong> ₹{formData.total_price}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={() => setCheckModal(false)} style={backBtnStyle}>
              Back
            </Button>
            <Button onClick={handleSubmit} style={submitBtnStyle}>
              Submit
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Confirm Order Modal */}
      <Modal
        title="Confirm Order"
        open={confirmModal}
        onCancel={() => setConfirmModal(false)}
        footer={[
          <Button key="no" onClick={() => setConfirmModal(false)}>
            No
          </Button>,
          <Button key="yes" type="primary" onClick={handleConfirmOrder}>
            Yes
          </Button>,
        ]}
      >
        {loading ? (
          <Spin tip="Processing your order..." />
        ) : (
          <p>Do you want to place the order?</p>
        )}
      </Modal>
    </>
  );
};

// Helper InputField Component
const InputField = ({ label, name, value, onChange, textarea }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    {textarea ? (
      <TextArea
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1"
      />
    ) : (
      <Input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1"
      />
    )}
  </div>
);

const backBtnStyle = {
  backgroundColor: "#80868b",
  color: "white",
  borderRadius: "15px",
};
const submitBtnStyle = {
  backgroundColor: "#0DA2FF",
  color: "white",
  borderRadius: "15px",
};

export default ViewProduct;
