const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // check duplicate username in database
  const duplicate = usersDB.users.find((person) => person.username === user);

  if (duplicate) {
    return res.sendStatus(409); //Conflict
    // res.status(409).json({ message: "Username is already taken." });
  }

  try {
    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // store new user in database
    const newUser = {
      username: user,
      password: hashedPassword,
    };

    usersDB.setUsers([...usersDB.users, newUser]);

    // write new user to file
    const filePath = path.join(__dirname, "..", "models", "users.json");
    await fsPromises.writeFile(
      filePath,
      JSON.stringify(usersDB.users, null, 2)
    );

    console.log(usersDB.users);

    res.status(201).json({ message: `New user ${user} created successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
