import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import './index.css';
import Login from "./components/login/Login";
import ProtectedRoute from "./ProtectedRoute";
import ManageItems from "./components/manageItems/ManageItemsContainer";
import Navbar from "./components/Nav/Navbar";
import ItemBilling from "./components/ItemBillingModule/ItemBillingContainer";
import Home from "./components/home/Home";


const App = () => {
  
  return (
    <Router>
      <Routes>
        {/* Login page without layout */}
        <Route path="/login" element={<Login />} />

        {/* All protected pages with layout */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <Navbar />
                {/* Center Content */}
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/itemBilling" element={<ItemBilling />} />
                    <Route path="/items" element={<ManageItems />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
