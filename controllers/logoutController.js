const User = require("../models/User");

const handleLogout = async (req, res) => {
  // On client also delete accessToken
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const refreshToken = cookies.jwt;

  // is the refresh token in db
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production" ? true : false,
    });
    return res.sendStatus(204); // No content
  }

  // Delete the refresh token from db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  const result = await foundUser.save();

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production" ? true : false,
  }); // secure: true, only for production with https

  res.sendStatus(204); // No content
};

module.exports = { handleLogout };
