const eventResolver = require("./events");
const bookingResolver = require("./bookings");
const userResolver = require("./users");

module.exports = {
  ...eventResolver,
  ...bookingResolver,
  ...userResolver,
};
