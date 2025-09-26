import React, { useEffect, useState } from "react";
import { Input, Button, Pagination } from "antd";
import { API_BASE_URL, GET_PRODUCT, IMG_URL } from "../../services/end_points";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const { Search } = Input;

const Navbar = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // 3 rows per page

  useEffect(() => {
    GetProduct();
  }, []);

  const GetProduct = async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}${GET_PRODUCT}`);
      if (result.status === 201) {
        const data = result.data.data.map((item) => ({
          ...item,
          product_img: JSON.parse(item.product_img),
        }));
        setProductData(data);
        setFilteredProducts(data); // initial filter
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewToCart = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleSearch = (value) => {
    const filtered = productData.filter((product) =>
      product.product_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // reset to first page after search
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-6 py-4 bg-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 py-2  w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/images/companyLogo.png"
              alt="Company Logo"
              className="h-10 w-auto cursor-pointer"
            />
          </div>
          <div className="hidden md:flex flex-1 mx-4">
            <Search
              placeholder="Search for products..."
              enterButton
              onSearch={handleSearch}
            />
          </div>
          <div className="flex items-center space-x-4">
            <FaShoppingCart size={22} className="cursor-pointer" />
            <a href="/login">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Login
              </button>
            </a>
          </div>
        </div>
        <div className="md:hidden mt-2">
          <Search placeholder="Search..." enterButton onSearch={handleSearch} />
        </div>
      </nav>

      {/* Product List */}
      <div className="mt-24 flex flex-wrap justify-center gap-8 flex-1">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 w-72 flex flex-col overflow-hidden"
          >
            <div className="h-48 flex items-center justify-center p-4 bg-gray-50">
              <img
                src={`${IMG_URL}${product.product_img[0]}`}
                alt={product.product_name}
                className="h-full object-contain"
              />
            </div>
            <div className="p-6 flex flex-col flex-1 items-center text-center">
              <h2 className="text-lg font-bold text-gray-800 truncate">
                {product.product_name}
              </h2>
              <div className="flex items-center mt-3 gap-20">
                <p className="text-xl font-extrabold text-gray-900">
                  ${product.product_price}
                </p>
                <Button
                  type="primary"
                  className="bg-[#3d67f5] border-none hover:bg-[#3d67f5]"
                  onClick={() => handleViewToCart(product)}
                >
                  View Product
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={filteredProducts.length}
          onChange={handlePageChange}
        />
      </div>

      <footer className="mt-12 bg-white shadow-inner w-full flex justify-between items-center px-6 py-4">
        <div>
          <img
            src="/images/companyLogo.png"
            alt="Footer Logo"
            className="h-50 w-auto"
          />
        </div>
        <div className="flex gap-4">
          <Button type="link">Home</Button>
          <Button type="link">View Products</Button>
        </div>
      </footer>
    </div>
  );
};

export default Navbar;
