const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyJWT = (req, res, next) => {
  //   console.log(req.headers);
  console.log("authorization", req.headers);
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  console.log("token", token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.userName;
    next();
  });
};

module.exports = verifyJWT;
