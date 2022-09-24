const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const apiRouter = require("./routes");

async function initApp() {
  const app = express();
  const store = new MongoDBStore({
    uri: process.env.MONGODB_CONNECTION_STRING,
    collection: "sessions",
  });

  //Catch errors
  store.on("error", function (error) {
    console.log(error);
  });

  app.use(
    require("express-session")({
      secret: "keyboard cat",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
      store: store,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.get("/", function (req, res) {
    res.send("hello world", JSON.stringify(req.session));
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api", apiRouter);
  return app;
}

module.exports = {
  initApp,
};
