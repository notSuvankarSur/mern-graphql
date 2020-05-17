const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { transformBooking, transformEvent } = require("../../helpers");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => transformBooking(booking));
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
      return transformBooking(booking);
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
      return transformEvent(event);
    } catch (error) {
      throw error;
    }
  },
};
