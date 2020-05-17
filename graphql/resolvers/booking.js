const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { transformBooking, transformEvent } = require("../../helpers");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) throw new Error("Not authenticated");

    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => transformBooking(booking));
    } catch (error) {
      throw error;
    }
  },
  createBooking: async (args, req) => {
    if (!req.isAuth) throw new Error("Not authenticated");

    try {
      const fetechedEvent = await Event.findById(args.eventId);
      if (!fetechedEvent) return new Error("No such event exists");

      const booking = new Booking({
        user: req.userId,
        event: fetechedEvent,
      });
      await booking.save();
      return transformBooking(booking);
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) throw new Error("Not authenticated");

    try {
      // check if the booking id is valid,
      // then check if the user who deletes this actually created it
      const { event } = await Booking.findById(args.bookingId).populate(
        "event"
      );
      await Booking.deleteOne({ _id: args.bookingId });
      return transformEvent(event);
    } catch (error) {
      throw error;
    }
  },
};
