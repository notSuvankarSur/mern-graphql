const User = require("../models/user");
const Event = require("../models/event");
const DataLoader = require("dataloader");

const eventLoader = new DataLoader((eventIds) => getEvents(eventIds));

const userLoader = new DataLoader((userIds) =>
  User.find({ _id: { $in: userIds } })
);

const transformEvent = (event) => ({
  ...event._doc,
  date: new Date(event._doc.date).toISOString(),
  createdBy: () => getUser(event._doc.createdBy),
});

const transformBooking = (booking) => ({
  ...booking._doc,
  event: () => getEvent(booking._doc.event),
  user: () => getUser(booking._doc.user),
  createdAt: new Date(booking._doc.createdAt).toISOString(),
  updatedAt: new Date(booking._doc.updatedAt).toISOString(),
});

const getUser = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      password: null,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

const getEvents = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.sort(
      (a, b) =>
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
    );
    return events.map((event) => transformEvent(event));
  } catch (error) {
    throw error;
  }
};

const getEvent = async (eventId) => {
  const event = await eventLoader.load(eventId.toString());
  return event;
};

module.exports = {
  transformEvent,
  transformBooking,
  getUser,
  getEvent,
  getEvents,
};
