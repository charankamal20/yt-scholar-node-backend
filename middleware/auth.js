// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    console.log("IN Middleware")
    const token = req.cookies.auth_token;


  if (!token) return res.sendStatus(401); // Unauthorized if no token found

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid

    req.user = user; // Add the decoded user information to the request
    next();
  });
};

module.exports = authenticateToken;
