const User = require("../../models/user");
const bcrypt = require("bcryptjs");

module.exports = {
  createUser: async (args) => {
    let user = await User.findOne({ email: args.userInput.email });
    if (user) {
      return new Error("A user with the given email already exists");
    }

    user = new User({
      name: args.userInput.name,
      email: args.userInput.email,
      password: args.userInput.password,
    });

    user.password = await bcrypt.hash(user.password, 10);

    try {
      await user.save();
      return { ...user._doc, password: null };
    } catch (error) {
      throw error;
    }
  },
};
