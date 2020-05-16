const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const createdByUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    return { ...user._doc, createdEvents: userEvents(user._doc.createdEvents) };
  } catch (error) {
    throw error;
  }
};

const userEvents = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return {
        ...event._doc,
        createdBy: createdByUser(event._doc.createdBy),
      };
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  event: async () => {
    try {
      let events = await Event.find();
      events = events.map((event) => {
        return {
          ...event._doc,
          createdBy: createdByUser(event._doc.createdBy),
        };
      });
      return events;
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (args) => {
    let event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      createdBy: "5ebf9dfc6a58394048d20a2c",
    });

    try {
      event = await event.save();
      const user = await User.findById("5ebf9dfc6a58394048d20a2c");
      user.createdEvents.push(event);
      await user.save();
      return { ...event._doc, createdBy: createdByUser(event._doc.createdBy) };
    } catch (error) {
      throw error;
    }
  },
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
