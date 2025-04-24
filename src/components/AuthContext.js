// AuthContext.js
import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
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

  const register = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        password,
      });
      if(response.data?.success){
        alert(response.data?.message)
      } else{
        alert(response.data?.message)
      }// Save token (alternative: HttpOnly cookies)
    } catch (err) {
      console.error("register failed", err);
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

