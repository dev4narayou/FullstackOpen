const loginRouter = require("express").Router();
const User = require("../models/user");
const express = require("express");
const bcrypt = require("bcrypt");

const app = express();


app.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  // Check if the username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({
      error: "username must be unique",
    });
  }
  console.log("jdlfs");
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
})

app.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

module.exports = app;