var jwt = require("jsonwebtoken");
const JWT_KEY = "ThisIsJustAnotherJWTKey";

const fetchuser = (req, res, next) => {
  // Get the user from the server using JWT token and add id to the request object

  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({
      message: "No valid token provided",
    });
  }
  try {
    const data = jwt.verify(token, JWT_KEY);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = fetchuser;
