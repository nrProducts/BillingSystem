import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './index.css';
import Login from "./components/login/Login";
import ProtectedRoute from "./ProtectedRoute";
import ManageItems from "./components/manageItems/ManageItemsContainer";
import Navbar from "./components/Nav/Navbar";
import ItemBilling from "./components/ItemBillingModule/ItemBillingContainer";
import Home from "./components/home/Home";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import BillingDashboard from "./components/billingDashboard/BillingDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <Navbar />
                <div className="main-content">
                  <Header />
                  <div className="page-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/itemBilling" element={<ItemBilling />} />
                      <Route path="/items" element={<ManageItems />} />
                      <Route path="/billingdashboard" element={<BillingDashboard />} />
                    </Routes>
                  </div>
                  <Footer />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

