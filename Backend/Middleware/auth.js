const jwt = require("jsonwebtoken");
const Users = require("../Models/users.js");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.WEB_TOKEN);

    const user = await Users.findOne({
      _id: decoded._id,
      "Tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: "Please Authenticate" });
  }
};

module.exports = auth;
