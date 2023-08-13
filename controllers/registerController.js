const bcrypt = require("bcrypt");

const User = require("../models/user");

const handleNewUser = async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // check duplicate username in database
  const duplicate = await User.findOne({ username: user }).exec();

  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create and store new user in database
    const result = await User.create({
      username: user,
      password: hashedPassword,
    });

    res.status(201).json({ message: `New user ${user} created successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
