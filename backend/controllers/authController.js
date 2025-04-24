const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { SECRET_KEY } = require("../config/secrets");

exports.register = async (req, res) => {
  const { userName, password, email } = req.body?.userData ?? {};
  console.log(req.body,"=============================")
  const existingUser = await userModel.findUserByuserName(userName);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists", success: false });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const isActive = true;
  const isLocked = false;
  const role = "Admin";
  const result = await userModel.addUser(userName, hashedPassword, email, isActive, isLocked, role);

  res.status(201).json({ message: "User registered successfully", success: true, result });
};

exports.login = async (req, res) => {
  const { userName, password } = req.body;

  const user = await userModel.findUserByuserName(userName);
  if (!user) return res.status(404).json({ message: "User not found" });
  console.log(password, user,'--------------------------')
  const validPassword = await bcrypt.compare(password, user.PasswordHash);
  if (!validPassword) return res.status(403).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userName }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
};
