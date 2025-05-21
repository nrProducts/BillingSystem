// import React, { useContext, useState, useEffect } from "react";
// import { AuthContext } from "./AuthContext";
// import { Link } from "react-router-dom"; // use Link instead of <a>
// import "./styles.css";

// const LoginComponent = () => {
//   const { login } = useContext(AuthContext);
//   const [userName, setuserName] = useState("");
//   const [password, setPassword] = useState("");

//   useEffect(() => {
//     // Make your Node.js backend call here (e.g., fetch or axios)
//     console.log("LoginComponent mounted — make backend call if needed");
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     login(userName, password);
//   };

//   return (
//     <div className="form-container">
//       <div className="form-box">
//         <h2>Login</h2>
//         <form onSubmit={handleSubmit}>
//           <input className="input-field" type="text" placeholder="userName" value={userName} onChange={(e) => setuserName(e.target.value)} />
//           <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//           {/* <button className="button" type="submit">Login</button> */}
//         </form>
//         <div className="link">
//           <p>Create your account{" "}
//             <Link className="link-action" to="/register">Register here</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginComponent;
