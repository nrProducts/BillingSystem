// server.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = []; // Simulated user database

const SECRET_KEY = "your_jwt_secret"; // Replace with an environment variable in production

// Register Route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // Check if the user already exists
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists", success : false  });
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Store the user
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: "User registered successfully", success : true });
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // Find the user
  const user = users.find((user) => user.username === username);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(403).json({ message: "Invalid credentials" });

  // Generate JWT
  const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Protected Route Example
app.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    res.json({ message: "Welcome to the protected route!", user: payload });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
