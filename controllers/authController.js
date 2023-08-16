const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const handleLogin = async (req, res) => {
  const cookies = req.cookies;

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
    { expiresIn: "1h" }
  );

  const newRefreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  // Changed to let keyword
  let newRefreshTokenArray = !cookies?.jwt
    ? foundUser.refreshToken
    : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

  if (cookies?.jwt) {
    /* 
  Scenario added here: 
      1) User logs in but never uses RT and does not logout 
      2) RT is stolen
      3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
  */
    const refreshToken = cookies.jwt;
    const foundToken = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse!
    if (!foundToken) {
      // clear out ALL previous refresh tokens
      newRefreshTokenArray = [];
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production" ? true : false,
    });
  }

  // Saving refreshToken with current user
  foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  const result = await foundUser.save();

  // Creates Secure Cookie with refresh token
  res.cookie("jwt", newRefreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Send authorization roles and access token to user
  res.status(200).json({
    message: `User ${foundUser.username} is logged in!`,
    roles,
    accessToken,
  });
};

module.exports = { handleLogin };
