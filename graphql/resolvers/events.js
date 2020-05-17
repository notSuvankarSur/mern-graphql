const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("../../helpers");

module.exports = {
  events: async () => {
    try {
      let events = await Event.find();
      return events.map((event) => transformEvent(event));
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (args) => {
    let event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      createdBy: "5ec037bf5af9ca4d58004782",
    });

    try {
      const user = await User.findById("5ec037bf5af9ca4d58004782");
      if (!user) return new Error("User not found");
      event = await event.save();
      user.createdEvents.push(event);
      await user.save();
      return transformEvent(event);
    } catch (error) {
      throw error;
    }
  },
};
