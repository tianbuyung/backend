const jwt = require("jsonwebtoken");

const User = require("../models/User");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401); // 401 Unauthorized

  const refreshToken = cookies.jwt;

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production" ? true : false,
  });

  const foundUser = await User.findOne({ refreshToken }).exec();

  // detected refresh token reuse
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err || foundUser.username !== decoded.username) {
          if (err) return res.sendStatus(403); // 403 Forbidden Invalid

          const hackedUser = await User.findOne({
            username: decoded.username,
          }).exec();

          hackedUser.refreshToken = [];

          const result = await hackedUser.save();
          console.log(result);
        }
      }
    );

    return res.sendStatus(403); // 403 Forbidden Invalid
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  // evaluate the jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        console.log("expired refresh token");
        foundUser.refreshToken = [...newRefreshTokenArray];

        const result = await foundUser.save();
        console.log(result);
      }

      if (err || foundUser.username !== decoded.username) {
        return res.sendStatus(403); // 403 Forbidden Invalid
      }

      // refresh token is valid
      const roles = Object.values(foundUser.roles);

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

      // saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

      const result = await foundUser.save();

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production" ? true : false,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        roles,
        accessToken,
      });
    }
  );
};

module.exports = { handleRefreshToken };
