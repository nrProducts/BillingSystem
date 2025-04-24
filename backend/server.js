const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("../backend/routes/authRoutes");
const protectedRoutes = require("../backend/routes/authRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes); // for protected routes

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
