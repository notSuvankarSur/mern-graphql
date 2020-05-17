const User = require("../models/user");
const Event = require("../models/event");

const transformEvent = (event) => ({
  ...event._doc,
  date: new Date(event._doc.date).toISOString(),
  createdBy: getUser(event._doc.createdBy),
});

const transformBooking = (booking) => ({
  ...booking._doc,
  event: getEvent(booking._doc.event),
  user: getUser(booking._doc.user),
  createdAt: new Date(booking._doc.createdAt).toISOString(),
  updatedAt: new Date(booking._doc.updatedAt).toISOString(),
});

const getUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      password: null,
      createdEvents: getEvents(user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

const getEvents = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => transformEvent(event));
  } catch (error) {
    throw error;
  }
};

const getEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  return transformEvent(event);
};

module.exports = {
  transformEvent,
  transformBooking,
  getUser,
  getEvent,
  getEvents,
};
