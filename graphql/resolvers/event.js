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
  createEvent: async ({ eventInput }, req) => {
    if (!req.isAuth) throw new Error("Not authenticated");

    let event = new Event({
      title: eventInput.title,
      description: eventInput.description,
      price: +eventInput.price,
      createdBy: req.userId,
    });

    try {
      const user = await User.findById(req.userId);
      if (!user) throw new Error("User not found");
      event = await event.save();
      user.createdEvents.push(event);
      await user.save();
      return transformEvent(event);
    } catch (error) {
      throw error;
    }
  },
};
