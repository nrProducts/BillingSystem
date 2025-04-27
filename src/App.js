import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./components/AuthContext";
// import LoginComponent from "./components/LoginComponent";
// import RegisterComponent from "./components/RegisterComponent";

import './index.css'
import Login from "./components/Login";
import Home from "./components/home/Home";
import ProtectedRoute from "./ProtectedRoute";
import ItemsManager from "./components/items/ItemsManager";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <ItemsManager />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  )
}


// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<LoginComponent />} />
//           <Route path="/login" element={<LoginComponent />} />
//           <Route path="/register" element={<RegisterComponent />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

export default App;
