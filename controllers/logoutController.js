const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  // On client also delete accessToken
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const refreshToken = cookies.jwt;

  // is the refresh token in db
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204); // No content
  }

  // Delete the refresh token from db
  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );

  const currentUser = { ...foundUser, refreshToken: "" };

  usersDB.setUsers([...otherUsers, currentUser]);

  // write new user to file
  const filePath = path.join(__dirname, "..", "models", "users.json");
  await fsPromises.writeFile(filePath, JSON.stringify(usersDB.users, null, 2));

  res.clearCookie("jwt", { httpOnly: true }); // secure: true, only for production with https

  res.sendStatus(204); // No content
};

module.exports = { handleLogout };
