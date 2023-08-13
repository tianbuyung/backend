const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const handleLogin = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const foundUser = await User.findOne({ username: user }).exec();

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
  foundUser.refreshToken = refreshToken;

  const result = await foundUser.save();
  console.log(result);

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
