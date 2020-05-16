const express = require("express");
const bodyParser = require("body-parser");
const graphQlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./models/event");
const User = require("./models/user");

const app = express();
app.use(bodyParser.json());

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

app.use(
  "/graphql",
  graphQlHttp({
    schema: buildSchema(`
        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            createdBy: User!
        }

        type User{
            _id: ID!
            name: String!
            email: String!
            password: String
            createdEvents: [Event!]
        }

        input EventInput{
            title: String!
            description: String!
            price: Float!
        }

        input UserInput{
            name: String!
            email: String!
            password: String!
        }

        type RootQuery{
            event: [ Event! ]!
        }

        type RootMutation{
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
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
          return event;
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
    },
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@mern-graphql-j20tj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(3000, () => console.log("Listening on port 3000..."));
  })
  .catch((err) => console.log(err));
