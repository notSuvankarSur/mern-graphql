const express = require("express");
const bodyParser = require("body-parser");
const graphQlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema");
const graphQlResolvers = require("./graphql/resolvers");

const app = express();
app.use(bodyParser.json());

app.use(
  "/graphql",
  graphQlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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
