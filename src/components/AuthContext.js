// AuthContext.js
import React, { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState(null);

  const login = async (userName, password) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        userName,
        password,
      });
      setAuth(response.data.token);
      localStorage.setItem("token", response.data.token);
      alert("valid user!")
    } catch (err) {
      console.error("Login failed", err);
      alert("User Not found, Please register")
    }
  };

  const register = async (userData = {}) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        userData,
      });
      return response.data; // Let component handle alert and navigation
    } catch (err) {
      console.error("register failed", err);
      throw err;
    }
  };
  

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

