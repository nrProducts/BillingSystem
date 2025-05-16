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
import UserManagement from "./components/userManagement/UserManagementContainer";
import TableManager from "./components/tableManager/tableManager";
import Kitchen from "./components/kitchen/kitchen";
import { UserProvider } from "./context/UserContext";

const App = () => {
  return (
    <UserProvider>
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
                        <Route path="/user" element={<UserManagement />} />
                        <Route path="/itemBilling/:tableId?" element={<ItemBilling />} />
                        <Route path="/tableManager" element={<TableManager />} />
                        <Route path="/items" element={<ManageItems />} />
                        <Route path="/billingDashboard" element={<BillingDashboard />} />
                        <Route path="/kitchen" element={<Kitchen />} />
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
    </UserProvider>
  );
};

export default App;

