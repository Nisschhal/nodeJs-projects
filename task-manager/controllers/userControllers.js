require("dotenv").config();
const fsP = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const data = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const getAllUsers = (req, res) => {
  res.json(data.users);
};

const createNewUser = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ message: "Enter valid userName and Password" });
  }

  const userFound = data.users.find((user) => user.userName === userName);

  if (userFound)
    return res.status(409).json({ message: "username already exists!" });

  try {
    const hasPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: data.users.length + 1,
      userName: userName,
      password: hasPassword,
    };

    data.setUsers([...data.users, newUser]);
    await fsP.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(data.users)
    );
    res.status(201).json({ message: `User ${userName} created Successfully!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserById = () => {};
const deleteUserById = () => {};

// verify and provide jwt
// const fsP = require("fs").promises;
// const path = require("path");
const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password)
    return res
      .status(400)
      .json({ message: "Enter valid username and password" });

  const userFound = data.users.find((user) => user.userName === userName);

  if (!userFound) return res.status(401).json({ message: "UnAuthorized" });

  try {
    const match = await bcrypt.compare(password, userFound.password);
    if (match) {
      // create JWT

      const accessToken = jwt.sign(
        { userName: userFound.userName },
        process.env.ACCESS_TOKEN_SECRET,

        { expiresIn: "30s" }
      );

      console.log("code", process.env.ACCESS_TOKEN_SECRET);
      // saving the refresh token in authenticated user

      const refreshToken = jwt.sign(
        { userName: userFound.userName },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      const otherUsers = data.users.filter(
        (user) => user.userName !== userName
      );
      const currentUser = { ...userFound, refreshToken };
      data.setUsers([...otherUsers, currentUser]);
      // updating the user data by adding refresh token
      await fsP.writeFile(
        path.join(__dirname, "..", "models", "users.json"),
        JSON.stringify(data.users)
      );
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 3600 * 1000,
      });

      res.json({ message: "user logged In successfully!", token: accessToken });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUserById,
  deleteUserById,
  loginUser,
};
