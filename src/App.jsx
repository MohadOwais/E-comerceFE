import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DefaultLayout from "./components/DefaultLayout/DefaultLayout";
import ProductList from "./components/pages/product/ProductList";
import UserList from "./components/pages/Users/UserList";
import Navbar from "./components/pages/Navbar/Navbar";
import ViewProduct from "./components/pages/ViewProduct/ViewProduct";
import LoginCard from "./components/pages/Login/Login";
import PlaceOrder from "./components/pages/PlaceOrder/PlaceOrder";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navbar />} />
          <Route
            path="/dashboard/add-product"
            element={
              <DefaultLayout>
                <ProductList />
              </DefaultLayout>
            }
          />
          <Route
            path="/dashboard/add-users"
            element={
              <DefaultLayout>
                <UserList />
              </DefaultLayout>
            }
          />
          <Route
            path="/dashboard/place-order"
            element={
              <DefaultLayout>
                <PlaceOrder />
              </DefaultLayout>
            }
          />
          <Route path="/product/:id" element={<ViewProduct />} />
          <Route path="/login" element={<LoginCard />} />
        </Routes>
      </Router>
      ;
    </>
  );
}
