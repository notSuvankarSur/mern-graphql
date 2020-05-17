const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async ({ userInput }) => {
    try {
      let user = await User.findOne({ email: userInput.email });
      if (user) {
        throw new Error("A user with the given email already exists");
      }

      user = new User({
        name: userInput.name,
        email: userInput.email,
        password: userInput.password,
      });

      user.password = await bcrypt.hash(user.password, 10);

      await user.save();
      return { ...user._doc, password: null };
    } catch (error) {
      throw error;
    }
  },
  loginUser: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User doesn't exist");

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error("Incorrect Password");

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "mySecureKey",
        { expiresIn: "24h" }
      );
      return {
        userId: user.id,
        token,
        tokenExpiration: 24,
      };
    } catch (error) {
      throw error;
    }
  },
};
