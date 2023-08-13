const jwt = require("jsonwebtoken");

const User = require("../models/User");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401); // 401 Unauthorized

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    return res.sendStatus(403); // 403 Forbidden Invalid
  }

  // evaluate the jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403); // 403 Forbidden Invalid
    }

    const roles = Object.values(foundUser.roles);

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

    res.status(200).json({
      accessToken,
    });
  });
};

module.exports = { handleRefreshToken };
