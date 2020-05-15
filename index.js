const express = require("express");
const bodyParser = require("body-parser");
const graphQlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphQlHttp({
    schema: buildSchema(`
        type RootQuery{
            event: [ String! ]!
        }

        type RootMutation{
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      event: () => {
        return ["Cycling", "Coding all night", "Rock Concert"];
      },
      createEvent: (args) => {
        const { name } = args;
        return name;
      },
    },
    graphiql: true,
  })
);

app.listen(3000, () => console.log("Listening on port 3000..."));
