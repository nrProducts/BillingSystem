// import React, { useContext, useState, useEffect } from "react";
// import { AuthContext } from "./AuthContext";
// import { Link, useNavigate } from "react-router-dom";
// import "./styles.css";

// const RegisterComponent = () => {
//   const { register } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [userData, setUserData] = useState({
//     userName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     console.log("RegisterComponent mounted — make backend call if needed");
//   }, []);

//   const validate = () => {
//     const newErrors = {};

//     if (!userData.userName.trim()) {
//       newErrors.userName = "userName is required";
//     }

//     if (!userData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
//       newErrors.email = "Email format is invalid";
//     }

//     if (!userData.password) {
//       newErrors.password = "Password is required";
//     } else if (userData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (!userData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password";
//     } else if (userData.password !== userData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (value, key) => {
//     setUserData((prev) => ({ ...prev, [key]: value }));
//     setErrors((prev) => ({ ...prev, [key]: "" })); // Clear error on change
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (validate()) {
//         const res = await register(userData);
//         if (res?.success) {
//           alert(res.message);
//           navigate('/login');
//         } else {
//           alert(res.message);
//         }
//       }
//     } catch (err) {
//       alert("Registration failed");
//     }
//   };

//   return (
//     <div className="form-container">
//       <div className="form-box">
//         <h2>Register</h2>
//         <form onSubmit={handleSubmit} noValidate>
//           <input
//             className={`input-field ${errors.userName ? "error" : ""}`}
//             type="text"
//             placeholder="userName"
//             value={userData.userName}
//             onChange={(e) => handleChange(e.target.value, "userName")}
//           />
//           {errors.userName && <p className="error-text">{errors.userName}</p>}

//           <input
//             className={`input-field ${errors.email ? "error" : ""}`}
//             type="email"
//             placeholder="Email"
//             value={userData.email}
//             onChange={(e) => handleChange(e.target.value, "email")}
//           />
//           {errors.email && <p className="error-text">{errors.email}</p>}

//           <input
//             className={`input-field ${errors.password ? "error" : ""}`}
//             type="password"
//             placeholder="Password"
//             value={userData.password}
//             onChange={(e) => handleChange(e.target.value, "password")}
//           />
//           {errors.password && <p className="error-text">{errors.password}</p>}

//           <input
//             className={`input-field ${errors.confirmPassword ? "error" : ""}`}
//             type="password"
//             placeholder="Confirm Password"
//             value={userData.confirmPassword}
//             onChange={(e) => handleChange(e.target.value, "confirmPassword")}
//           />
//           {errors.confirmPassword && (
//             <p className="error-text">{errors.confirmPassword}</p>
//           )}

//           <button className="button" type="submit">
//             Register
//           </button>
//         </form>
//         <div className="link">
//           <p>
//             Already have an account?{" "}
//             <Link className="link-action" to="/login">
//               Login here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterComponent;
