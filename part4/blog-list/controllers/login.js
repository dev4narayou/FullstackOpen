const loginRouter = require("express").Router();
const User = require("../models/user");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()

const app = express();


app.post("/", async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });

  try {
    await bcrypt.compare(password, user.passwordHash);
  } catch (error) {
    console.log("error:", error);
  }

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = app;