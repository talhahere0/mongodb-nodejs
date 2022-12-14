const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const { UsersCollection } = require("../../../db/collections");

module.exports = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || !email.trim() || !password.trim()) {
    return res.status(400).json({
      status: "fail",
      code: "invalid_req_body",
      message: "Invalid email or password",
    });
  }

  try {
    const existingUser = await UsersCollection.findOne(
      { email },
      { projection: { _id: 1 } }
    );
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        code: "email_already_exists",
        message: "Email already exists",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: "server_error",
      message: "Something went wrong",
    });
  }

  const user = {
    _id: new ObjectId(),
    email: email.toLowerCase().trim(),
    password: await bcrypt.hash(password, 10),
  };

  try {
    await UsersCollection.insertOne(user);

    // store user in session
    req.session.regenerate((error) => {
      if (error) return next(error);

      req.session.user = { _id: user._id };
      req.session.loggedInAt = new Date();

      req.session.save((error) => {
        if (error) return next(error);

        return res.status(201).json({
          status: "success",
          code: "user_created",
          message: "User created",
          user: {
            ...user,
            password: undefined,
          },
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: "server_error",
      message: "Something went wrong",
    });
  }
};
