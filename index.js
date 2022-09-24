const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

dotenvExpand.expand(
  dotenv.config({
    path: ".env",
  })
);

const { initApp } = require("./app");
const { connectMongoDb } = require("./db");

connectMongoDb((err) => {
  if (err) {
    console.log("Something went wrong while connecting to the database");
    console.error(err);
    process.exit(1);
  }
  console.log("Connected to MongoDB");
  initApp()
    .then((app) => {
      app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.HOSTNAME}`);
      });
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
});
