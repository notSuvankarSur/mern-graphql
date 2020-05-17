const eventResolver = require("./event");
const bookingResolver = require("./booking");
const userResolver = require("./auth");

module.exports = {
  ...eventResolver,
  ...bookingResolver,
  ...userResolver,
};
