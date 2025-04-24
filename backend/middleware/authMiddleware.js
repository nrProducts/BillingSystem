const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/secrets");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateToken;
