const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const foundUser = usersDB.users.find((person) => person.username === user);

  if (!foundUser) {
    return res.sendStatus(401); // 401 Unauthorized
  }

  // evaluate the password
  const isMatch = await bcrypt.compare(password, foundUser.password);

  if (!isMatch) {
    return res.sendStatus(401); // 401 Unauthorized
  }

  const roles = Object.values(foundUser.roles);

  // create JWTs
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30s" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  // saving refreshToken with current user
  const otherUsers = usersDB.users.filter(
    (person) => person.username !== foundUser.username
  );

  const currentUser = {
    ...foundUser,
    refreshToken,
  };

  usersDB.setUsers([...otherUsers, currentUser]);

  const filePath = path.join(__dirname, "..", "models", "users.json");
  await fsPromises.writeFile(filePath, JSON.stringify(usersDB.users, null, 2));

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: `User ${foundUser.username} is logged in!`,
    accessToken,
  });
};

module.exports = { handleLogin };
