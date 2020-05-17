const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
const bcrypt = require("bcryptjs");

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
    return events.map((event) => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        createdBy: getUser(event._doc.createdBy),
      };
    });
  } catch (error) {
    throw error;
  }
};

const getEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  return {
    ...event._doc,
    date: new Date(event._doc.date).toISOString(),
    createdBy: getUser(event._doc.createdBy),
  };
};

module.exports = {
  events: async () => {
    try {
      let events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          createdBy: getUser(event._doc.createdBy),
        };
      });
    } catch (error) {
      throw error;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          event: getEvent(booking._doc.event),
          user: getUser(booking._doc.user),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
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
      return {
        ...event._doc,
        createdBy: getUser(event._doc.createdBy),
        date: new Date(event._doc.date).toISOString(),
      };
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
  createBooking: async (args) => {
    try {
      const fetechedEvent = await Event.findById(args.eventId);
      if (!fetechedEvent) return new Error("No such event exists");
      const booking = new Booking({
        user: "5ec037bf5af9ca4d58004782",
        event: fetechedEvent,
      });
      await booking.save();
      return {
        ...booking._doc,
        event: getEvent(booking._doc.event),
        user: getUser(booking._doc.user),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
      };
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async (args) => {
    try {
      const { event } = await Booking.findById(args.bookingId).populate(
        "event"
      );
      await Booking.deleteOne({ _id: args.bookingId });
      return {
        ...event._doc,
        createdBy: getUser(event._doc.createdBy),
      };
    } catch (error) {
      throw error;
    }
  },
};
